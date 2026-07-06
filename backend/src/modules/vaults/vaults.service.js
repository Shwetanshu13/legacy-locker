import vaultsRepository from './vaults.repository.js';
import db from '../../db/index.js';
import { vaults, vaultRecipients } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

class VaultsService {
    async getUserVaults(userId) {
        return await vaultsRepository.getVaultsByUserId(userId);
    }

    async getVaultById(userId, vaultId) {
        const [vault] = await db
            .select()
            .from(vaults)
            .where(
                and(
                    eq(vaults.userId, userId),
                    eq(vaults.id, vaultId)
                )
            );
        return vault;
    }

    async getUnlockPayload(vaultId) {
        // Must join vault and vaultRecipients, and check isUnlocked
        const [result] = await db
            .select({
                title: vaults.title,
                ciphertext: vaults.ciphertext,
                iv: vaults.iv,
                encryptedDekNominee: vaultRecipients.encryptedDekNominee,
                customMessage: vaultRecipients.customMessage,
                isUnlocked: vaultRecipients.isUnlocked
            })
            .from(vaults)
            .innerJoin(vaultRecipients, eq(vaults.id, vaultRecipients.vaultId))
            .where(
                and(
                    eq(vaults.id, vaultId),
                    eq(vaultRecipients.isUnlocked, true)
                )
            );
        return result;
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
