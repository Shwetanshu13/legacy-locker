import vaultsRepository from './vaults.repository.js';
import db from '../../db/index.js';
import { vaults, vaultRecipients, trustedContacts, triggerHistory } from '../../db/schema.js';
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
                isUnlocked: vaultRecipients.isUnlocked,
                status: vaults.status
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

    async deleteVault(userId, vaultId) {
        return await vaultsRepository.deleteVault(userId, vaultId);
    }

    async editVault(userId, vaultId, { title, ciphertext, iv }) {
        return await vaultsRepository.editVault(userId, vaultId, { title, ciphertext, iv });
    }

    async markVaultOpened(vaultId) {
        const [vault] = await db.select().from(vaults).where(eq(vaults.id, vaultId));
        if (!vault) throw new Error('Vault not found');
        if (vault.status === 'opened_and_purged') throw new Error('Vault already opened and purged');

        const [recipient] = await db
            .select({ email: trustedContacts.email })
            .from(vaultRecipients)
            .innerJoin(trustedContacts, eq(vaultRecipients.contactId, trustedContacts.id))
            .where(eq(vaultRecipients.vaultId, vaultId))
            .limit(1);

        const nomineeEmail = recipient ? recipient.email : "Unknown";

        await db.update(vaults)
            .set({ 
                ciphertext: '', 
                iv: '', 
                encryptedDekOwner: '', 
                status: 'opened_and_purged', 
                openedAt: new Date() 
            })
            .where(eq(vaults.id, vaultId));

        await db.insert(triggerHistory).values({
            userId: vault.userId,
            vaultId: vault.id,
            vaultTitle: vault.title,
            nomineeEmail,
            status: 'OPENED_AND_PURGED',
            openedAt: new Date(),
        });

        return { message: 'Vault data purged permanently' };
    }
}

export default new VaultsService();
