import express from 'express';
import vaultsController from './vaults.controller.js';
import authMiddleware from '../../middleware/auth.js';
import { cacheMiddleware } from '../../middleware/cache.js';

const router = express.Router();

// Public route for nominees to fetch vault payload
router.get('/unlock/:id', vaultsController.getUnlockPayload);
router.post('/unlock/:id/mark-opened', vaultsController.markVaultOpened);

// Protect all other vaults routes
router.use(authMiddleware);

router.get('/', cacheMiddleware('vaults'), vaultsController.getVaults);
router.get('/:id', vaultsController.getVaultById);
router.post('/add', vaultsController.addVault);
router.delete('/:id', vaultsController.deleteVault);
router.put('/:id', vaultsController.editVault);

export default router;
