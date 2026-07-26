import express from 'express';
import authController from './auth.controller.js';
import authMiddleware from '../../middleware/auth.js';
import { generalAuthLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', generalAuthLimiter, authController.register);
router.post('/login', generalAuthLimiter, authController.login);
router.get('/webauthn/register-options', generalAuthLimiter, authController.getWebAuthnRegisterOptions);
router.post('/webauthn/register-verify', generalAuthLimiter, authController.verifyWebAuthnRegister);
router.get('/webauthn/login-options', generalAuthLimiter, authController.getWebAuthnLoginOptions);
router.post('/webauthn/login-verify', generalAuthLimiter, authController.verifyWebAuthnLogin);
router.post('/setup-keys', authMiddleware, generalAuthLimiter, authController.setupKeys);

// Used to manually ping the backend and update the lastActiveAt timestamp via authMiddleware
router.post('/update-activity', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Activity updated' });
});

export default router;
