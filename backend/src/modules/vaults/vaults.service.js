import vaultsRepository from './vaults.repository.js';

class VaultsService {
    async getUserVaults(userId) {
        return await vaultsRepository.getVaultsByUserId(userId);
    }

    async addVault(userId, vaultData) {
        // Ideally we would encrypt the content here using a utility
        const encryptedContent = vaultData.content; 
        
        return await vaultsRepository.createVault({
            userId,
            title: vaultData.title,
            content: encryptedContent,
            visibility: vaultData.visibility
        });
    }
}

export default new VaultsService();
