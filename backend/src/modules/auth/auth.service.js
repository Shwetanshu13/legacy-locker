import jwt from 'jsonwebtoken';
import disposableDomains from 'disposable-email-domains' with { type: 'json' };
import authRepository from './auth.repository.js';
import { sendEmail } from '../../utils/email.util.js';
import { getOtpEmailTemplate } from '../../templates/otp.template.js';

class AuthService {
    _generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    _isValidEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    _isDisposableEmail(email) {
        const domain = email.split('@')[1];
        return disposableDomains.includes(domain);
    }

    async sendOtp(email) {
        if (!this._isValidEmailFormat(email)) {
            throw new Error('Invalid email format');
        }

        if (this._isDisposableEmail(email)) {
            throw new Error('Disposable email addresses are not allowed');
        }

        const otp = this._generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

        await authRepository.createOtp(email, otp, expiresAt);

        await sendEmail({
            to: email,
            subject: 'Legacy Locker - Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: getOtpEmailTemplate(otp),
        });

        return { message: 'OTP sent successfully' };
    }

    async verifyOtp(email, otpCode) {
        const latestOtp = await authRepository.getLatestOtpByEmail(email);

        if (!latestOtp) {
            throw new Error('No OTP found for this email');
        }

        if (latestOtp.otp !== otpCode) {
            throw new Error('Invalid OTP');
        }

        if (new Date() > latestOtp.expiresAt) {
            throw new Error('OTP has expired');
        }

        let user = await authRepository.getUserByEmail(email);

        if (!user) {
            user = await authRepository.createUser(email);
        } else if (!user.isVerified) {
            await authRepository.verifyUser(user.id);
        }

        await authRepository.deleteOtp(latestOtp.id);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
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
}

export default new AuthService();
