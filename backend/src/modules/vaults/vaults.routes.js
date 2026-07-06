import express from 'express';
import vaultsController from './vaults.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

// Public route for nominees to fetch vault payload
router.get('/unlock/:id', vaultsController.getUnlockPayload);

// Protect all other vaults routes
router.use(authMiddleware);

router.get('/', vaultsController.getVaults);
router.get('/:id', vaultsController.getVaultById);
router.post('/add', vaultsController.addVault);

export default router;
