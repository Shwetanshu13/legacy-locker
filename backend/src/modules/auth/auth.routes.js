import express from 'express';
import authController from './auth.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/setup-keys', authMiddleware, authController.setupKeys);

// Used to manually ping the backend and update the lastActiveAt timestamp via authMiddleware
router.post('/update-activity', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Activity updated' });
});

export default router;
