import express from 'express';
import vaultsController from './vaults.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

// Protect all vaults routes
router.use(authMiddleware);

router.get('/', vaultsController.getVaults);
router.post('/add', vaultsController.addVault);

export default router;
