import vaultsService from './vaults.service.js';

class VaultsController {
    async getUnlockPayload(req, res) {
        try {
            const vaultId = req.params.id;
            const payload = await vaultsService.getUnlockPayload(vaultId);
            if (!payload) {
                return res.status(404).json({ message: 'Vault not found or not unlocked yet' });
            }
            if (payload.status === 'opened_and_purged') {
                 return res.status(410).json({ message: 'Vault has been permanently deleted as it was already opened.' });
            }
            res.status(200).json({ data: payload });
        } catch (error) {
            console.error('Get Unlock Payload Error:', error);
            res.status(500).json({ message: 'Error fetching unlock payload' });
        }
    }

    async markVaultOpened(req, res) {
        try {
            const vaultId = req.params.id;
            // No user auth required here because the nominee is unauthenticated, they only have the link
            // But they proved they decrypted it.
            const result = await vaultsService.markVaultOpened(vaultId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Mark Vault Opened Error:', error);
            res.status(500).json({ message: error.message || 'Error purging vault' });
        }
    }

    async getVaultById(req, res) {
        try {
            const vaultId = req.params.id;
            const userId = req.user.id;
            const vault = await vaultsService.getVaultById(userId, vaultId);
            if (!vault) {
                return res.status(404).json({ message: 'Vault not found' });
            }
            res.status(200).json({ data: vault });
        } catch (error) {
            console.error('Get Vault Error:', error);
            res.status(500).json({ message: 'Error fetching vault' });
        }
    }

    async getVaults(req, res) {
        try {
            const userId = req.user.id;
            const userVaults = await vaultsService.getUserVaults(userId);
            res.status(200).json({ data: userVaults });
        } catch (error) {
            console.error('Get Vaults Error:', error);
            res.status(500).json({ message: 'Error fetching vaults' });
        }
    }

    async addVault(req, res) {
        try {
            const { title, ciphertext, iv, encryptedDekOwner, visibility } = req.body;
            const userId = req.user.id;
            
            if (!title || !ciphertext || !iv || !encryptedDekOwner || !visibility) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const newVault = await vaultsService.addVault(userId, { title, ciphertext, iv, encryptedDekOwner, visibility });
            res.status(201).json({ message: 'Vault added successfully', data: newVault });
        } catch (error) {
            console.error('Add Vault Error:', error);
            res.status(500).json({ message: 'Error adding vault' });
        }
    }

    async deleteVault(req, res) {
        try {
            const vaultId = req.params.id;
            const userId = req.user.id;
            
            const deletedVault = await vaultsService.deleteVault(userId, vaultId);
            if (!deletedVault) {
                return res.status(404).json({ message: 'Vault not found or not authorized' });
            }
            
            res.status(200).json({ message: 'Vault deleted successfully', data: deletedVault });
        } catch (error) {
            console.error('Delete Vault Error:', error);
            res.status(500).json({ message: 'Error deleting vault' });
        }
    }

    async editVault(req, res) {
        try {
            const vaultId = req.params.id;
            const userId = req.user.id;
            const { title, ciphertext, iv } = req.body;

            if (!title || !ciphertext || !iv) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const updatedVault = await vaultsService.editVault(userId, vaultId, { title, ciphertext, iv });
            if (!updatedVault) {
                return res.status(404).json({ message: 'Vault not found or not authorized' });
            }
            
            res.status(200).json({ message: 'Vault updated successfully', data: updatedVault });
        } catch (error) {
            console.error('Edit Vault Error:', error);
            res.status(500).json({ message: 'Error updating vault' });
        }
    }
}

export default new VaultsController();
