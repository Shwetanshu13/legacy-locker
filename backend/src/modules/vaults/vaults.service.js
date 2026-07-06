import vaultsRepository from './vaults.repository.js';

class VaultsService {
    async getUserVaults(userId) {
        return await vaultsRepository.getVaultsByUserId(userId);
    }

    async addVault(userId, vaultData) {
        // Vault data is now encrypted strictly on the client side
        return await vaultsRepository.createVault({
            userId,
            title: vaultData.title,
            ciphertext: vaultData.ciphertext,
            iv: vaultData.iv,
            encryptedDekOwner: vaultData.encryptedDekOwner,
            visibility: vaultData.visibility
        });
    }
}

export default new VaultsService();
