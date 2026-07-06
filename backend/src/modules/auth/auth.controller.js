import authService from './auth.service.js';

class AuthController {
    async sendOtp(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const result = await authService.sendOtp(email);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Send OTP Error:', error);
            const statusCode = error.message.includes('Invalid') || error.message.includes('Disposable') ? 400 : 500;
            return res.status(statusCode).json({ message: error.message || 'Failed to send OTP' });
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

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }

            const result = await authService.verifyOtp(email, otp);
            return res.status(200).json({
                message: 'OTP verified successfully',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Verify OTP Error:', error);
            const statusCode = ['No OTP found', 'Invalid OTP', 'OTP has expired'].some(msg => error.message.includes(msg)) ? 400 : 500;
            return res.status(statusCode).json({ message: error.message || 'Failed to verify OTP' });
        }
    }
}

export default new AuthController();
