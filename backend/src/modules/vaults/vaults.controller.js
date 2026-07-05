import vaultsService from './vaults.service.js';

class VaultsController {
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
            const { title, content, visibility } = req.body;
            const userId = req.user.id;
            
            if (!title || !content || !visibility) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const newVault = await vaultsService.addVault(userId, { title, content, visibility });
            res.status(201).json({ message: 'Vault added successfully', data: newVault });
        } catch (error) {
            console.error('Add Vault Error:', error);
            res.status(500).json({ message: 'Error adding vault' });
        }
    }
}

export default new VaultsController();
