import express from 'express';
import authController from './auth.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/setup-keys', authMiddleware, authController.setupKeys);

export default router;
