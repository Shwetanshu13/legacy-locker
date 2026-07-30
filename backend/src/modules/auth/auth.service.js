import jwt from 'jsonwebtoken';
import disposableDomains from 'disposable-email-domains' with { type: 'json' };
import authRepository from './auth.repository.js';
import bcrypt from 'bcryptjs';
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import redisConnection from '../../utils/redis.util.js';
import { env } from '../../config/env.js';

const rpName = 'Legacy Locker';
const origin = env.FRONTEND_URL || 'http://localhost:3000';
const rpID = new URL(origin).hostname;

class AuthService {
    _isValidEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    _isDisposableEmail(email) {
        const domain = email.split('@')[1];
        return disposableDomains.includes(domain);
    }

    async register(email, password) {
        if (!this._isValidEmailFormat(email)) {
            throw new Error('Invalid email format');
        }

        if (this._isDisposableEmail(email)) {
            throw new Error('Disposable email addresses are not allowed');
        }

        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const existingUser = await authRepository.getUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await authRepository.createUser(email, passwordHash);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await authRepository.createOtp(email, otp);

        const { sendOtpEmail } = await import('../../utils/email.util.js');
        await sendOtpEmail({ to: email, otp });

        return { message: 'Verification code sent to email', email };
    }

    async verifyEmailOtp(email, otp) {
        const existingOtp = await authRepository.getOtp(email, otp);

        if (!existingOtp) {
            throw new Error('Invalid or expired verification code');
        }

        if (new Date() > new Date(existingOtp.expiresAt)) {
            throw new Error('Verification code has expired');
        }

        const user = await authRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        await authRepository.setUserVerified(user.id);
        await authRepository.deleteOtpsByEmail(email);

        return { message: 'Email verified successfully', email };
    }

    async login(email, password) {
        const user = await authRepository.getUserByEmail(email);

        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                publicKey: user.publicKey,
                encryptedPrivateKey: user.encryptedPrivateKey,
                salt: user.salt
            }
        };
    }

    async loginFallbackInit(email, password) {
        const user = await authRepository.getUserByEmail(email);

        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await authRepository.createOtp(email, otp);

        const { sendLoginOtpEmail } = await import('../../utils/email.util.js');
        await sendLoginOtpEmail({ to: email, otp });

        return { message: '2FA Verification code sent to email', email };
    }

    async loginFallbackVerify(email, otp) {
        const existingOtp = await authRepository.getOtp(email, otp);

        if (!existingOtp) {
            throw new Error('Invalid or expired verification code');
        }

        if (new Date() > new Date(existingOtp.expiresAt)) {
            throw new Error('Verification code has expired');
        }

        const user = await authRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        await authRepository.deleteOtpsByEmail(email);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                publicKey: user.publicKey,
                encryptedPrivateKey: user.encryptedPrivateKey,
                salt: user.salt
            }
        };
    }

    async updateUserKeys(userId, { publicKey, encryptedPrivateKey, salt }) {
        await authRepository.updateUserKeys(userId, { publicKey, encryptedPrivateKey, salt });
    }

    // --- WebAuthn Logic ---

    async generateWebAuthnRegisterOptions(email) {
        if (!this._isValidEmailFormat(email)) throw new Error('Invalid email format');
        if (this._isDisposableEmail(email)) throw new Error('Disposable email addresses are not allowed');

        const user = await authRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found. Please complete the first step of registration.');
        }
        if (!user.isVerified) {
            throw new Error('Email not verified. Please verify your email first.');
        }

        const userPasskeys = await authRepository.getPasskeysByUserId(user.id);
        if (userPasskeys.length > 0) {
            throw new Error('User already has a registered passkey. Please login to add a new passkey from your profile.');
        }

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new TextEncoder().encode(user.id),
            userName: user.email,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(pk => ({
                id: pk.credentialId,
                transports: pk.transports ? JSON.parse(pk.transports) : [],
            })),
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'preferred',
            },
        });

        // Store challenge in redis for 5 minutes
        await redisConnection.set(`webauthn:register:${email}`, options.challenge, 'EX', 300);

        return options;
    }

    async verifyWebAuthnRegistration(email, body) {
        const expectedChallenge = await redisConnection.get(`webauthn:register:${email}`);
        if (!expectedChallenge) throw new Error('Registration session expired');

        const user = await authRepository.getUserByEmail(email);
        if (!user) throw new Error('User not found');

        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });

        if (!verification.verified || !verification.registrationInfo) {
            throw new Error('WebAuthn verification failed');
        }

        const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

        await authRepository.createPasskey({
            userId: user.id,
            credentialId: credential.id,
            publicKey: Buffer.from(credential.publicKey).toString('base64'),
            counter: credential.counter,
            transports: credential.transports || [],
        });

        await redisConnection.del(`webauthn:register:${email}`);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return { token, user: { id: user.id, email: user.email, publicKey: user.publicKey, encryptedPrivateKey: user.encryptedPrivateKey, salt: user.salt } };
    }

    async generateWebAuthnLoginOptions(email) {
        const user = await authRepository.getUserByEmail(email);
        if (!user) throw new Error('Invalid email');

        const userPasskeys = await authRepository.getPasskeysByUserId(user.id);
        if (userPasskeys.length === 0) throw new Error('No passkeys registered for this user');

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials: userPasskeys.map(pk => ({
                id: pk.credentialId,
                transports: pk.transports ? JSON.parse(pk.transports) : [],
            })),
            userVerification: 'preferred',
        });

        await redisConnection.set(`webauthn:login:${email}`, options.challenge, 'EX', 300);

        return options;
    }

    async verifyWebAuthnLogin(email, body) {
        const expectedChallenge = await redisConnection.get(`webauthn:login:${email}`);
        if (!expectedChallenge) throw new Error('Login session expired');

        const user = await authRepository.getUserByEmail(email);
        if (!user) throw new Error('User not found');

        const passkey = await authRepository.getPasskeyByCredentialId(body.id);
        if (!passkey) throw new Error('Passkey not found');

        const verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            credential: {
                id: passkey.credentialId,
                publicKey: Buffer.from(passkey.publicKey, 'base64'),
                counter: parseInt(passkey.counter, 10),
                transports: passkey.transports ? JSON.parse(passkey.transports) : [],
            },
        });

        if (!verification.verified) throw new Error('WebAuthn verification failed');

        await authRepository.updatePasskeyCounter(passkey.credentialId, verification.authenticationInfo.newCounter);
        await redisConnection.del(`webauthn:login:${email}`);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return { token, user: { id: user.id, email: user.email, publicKey: user.publicKey, encryptedPrivateKey: user.encryptedPrivateKey, salt: user.salt } };
    }

    // --- Profile: Multiple Passkeys ---

    async getPasskeys(userId) {
        const passkeys = await authRepository.getPasskeysByUserId(userId);
        return passkeys.map(pk => ({
            id: pk.id,
            createdAt: pk.createdAt,
            // we don't expose public key or credential id to the frontend for security reasons
        }));
    }

    async generateAddPasskeyOptions(userId) {
        // Fetch user from DB to get their email (for userName)
        const userPasskeys = await authRepository.getPasskeysByUserId(userId);
        
        // Wait, I need user details. How to fetch user by ID?
        // Let's assume there is a method in authRepository. Or we can just use a generic name since we don't strictly need the email, but `userName` is nice to have.
        // I will just use the userId for both.
        const userName = `user_${userId}`;

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new TextEncoder().encode(userId),
            userName: userName,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(pk => ({
                id: pk.credentialId,
                transports: pk.transports ? JSON.parse(pk.transports) : [],
            })),
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'preferred',
            },
        });

        await redisConnection.set(`webauthn:add:${userId}`, options.challenge, 'EX', 300);

        return options;
    }

    async verifyAddPasskey(userId, body) {
        const expectedChallenge = await redisConnection.get(`webauthn:add:${userId}`);
        if (!expectedChallenge) throw new Error('Registration session expired');

        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });

        if (!verification.verified || !verification.registrationInfo) {
            throw new Error('WebAuthn verification failed');
        }

        const { credential } = verification.registrationInfo;

        await authRepository.createPasskey({
            userId,
            credentialId: credential.id,
            publicKey: Buffer.from(credential.publicKey).toString('base64'),
            counter: credential.counter,
            transports: credential.transports || [],
        });

        await redisConnection.del(`webauthn:add:${userId}`);

        return { message: 'Passkey added successfully' };
    }
}

export default new AuthService();
