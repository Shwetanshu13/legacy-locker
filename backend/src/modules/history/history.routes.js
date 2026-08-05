import express from 'express';
import historyController from './history.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', historyController.getHistory);

export default router;
