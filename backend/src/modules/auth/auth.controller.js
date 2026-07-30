import authService from './auth.service.js';

class AuthController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const result = await authService.register(email, password);
            return res.status(201).json({
                message: 'Account created successfully',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Register Error:', error);
            const statusCode = error.message.includes('Invalid') || error.message.includes('Disposable') || error.message.includes('already registered') || error.message.includes('at least 8') ? 400 : 500;
            return res.status(statusCode).json({ message: error.message || 'Failed to create account' });
        }
    }

    async setupKeys(req, res) {
        try {
            const { publicKey, encryptedPrivateKey, salt } = req.body;
            const userId = req.user.id;

            if (!publicKey || !encryptedPrivateKey || !salt) {
                return res.status(400).json({ message: 'Missing key materials' });
            }

            await authService.updateUserKeys(userId, { publicKey, encryptedPrivateKey, salt });
            return res.status(200).json({ message: 'Keys setup successfully' });
        } catch (error) {
            console.error('Setup Keys Error:', error);
            return res.status(500).json({ message: 'Failed to setup keys' });
        }
    }

    async verifyEmailOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }

            const result = await authService.verifyEmailOtp(email, otp);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Verify Email OTP Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to verify email' });
        }
    }

    // --- Profile Passkeys ---

    async getPasskeys(req, res) {
        try {
            const passkeys = await authService.getPasskeys(req.user.id);
            return res.status(200).json(passkeys);
        } catch (error) {
            console.error('Get Passkeys Error:', error);
            return res.status(500).json({ message: 'Failed to fetch passkeys' });
        }
    }

    async getAddPasskeyOptions(req, res) {
        try {
            const options = await authService.generateAddPasskeyOptions(req.user.id);
            return res.status(200).json(options);
        } catch (error) {
            console.error('Get Add Passkey Options Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to generate WebAuthn options' });
        }
    }

    async verifyAddPasskey(req, res) {
        try {
            const { body } = req.body;
            if (!body) return res.status(400).json({ message: 'WebAuthn response is required' });

            const result = await authService.verifyAddPasskey(req.user.id, body);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Verify Add Passkey Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to verify WebAuthn passkey' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const result = await authService.login(email, password);
            return res.status(200).json({
                message: 'Login successful',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Login Error:', error);
            const statusCode = error.message.includes('Invalid email or password') ? 401 : 500;
            return res.status(statusCode).json({ message: error.message || 'Failed to login' });
        }
    }

    async loginFallbackInit(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const result = await authService.loginFallbackInit(email, password);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Login Fallback Init Error:', error);
            const statusCode = error.message.includes('Invalid email or password') ? 401 : 500;
            return res.status(statusCode).json({ message: error.message || 'Failed to init login fallback' });
        }
    }

    async loginFallbackVerify(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }

            const result = await authService.loginFallbackVerify(email, otp);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Login Fallback Verify Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to verify login fallback' });
        }
    }

    // --- WebAuthn Logic ---

    async getWebAuthnRegisterOptions(req, res) {
        try {
            const { email } = req.query;
            if (!email) return res.status(400).json({ message: 'Email is required' });
            
            const options = await authService.generateWebAuthnRegisterOptions(email);
            return res.status(200).json(options);
        } catch (error) {
            console.error('getWebAuthnRegisterOptions Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to get registration options' });
        }
    }

    async verifyWebAuthnRegister(req, res) {
        try {
            const { email, body } = req.body;
            if (!email || !body) return res.status(400).json({ message: 'Email and response body are required' });

            const result = await authService.verifyWebAuthnRegistration(email, body);
            return res.status(201).json({
                message: 'Passkey registered successfully',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('verifyWebAuthnRegister Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to verify registration' });
        }
    }

    async getWebAuthnLoginOptions(req, res) {
        try {
            const { email } = req.query;
            if (!email) return res.status(400).json({ message: 'Email is required' });
            
            const options = await authService.generateWebAuthnLoginOptions(email);
            return res.status(200).json(options);
        } catch (error) {
            console.error('getWebAuthnLoginOptions Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to get login options' });
        }
    }

    async verifyWebAuthnLogin(req, res) {
        try {
            const { email, body } = req.body;
            if (!email || !body) return res.status(400).json({ message: 'Email and response body are required' });

            const result = await authService.verifyWebAuthnLogin(email, body);
            return res.status(200).json({
                message: 'Login successful via Passkey',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('verifyWebAuthnLogin Error:', error);
            return res.status(400).json({ message: error.message || 'Failed to verify login' });
        }
    }
}

export default new AuthController();
