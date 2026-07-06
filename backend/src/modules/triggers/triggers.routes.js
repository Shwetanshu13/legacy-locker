import express from 'express';
import triggersController from './triggers.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add', triggersController.addTrigger);

export default router;
