import { eq, and } from 'drizzle-orm';
import db from '../../db/index.js';
import { vaults } from '../../db/schema.js';

class VaultsRepository {
    async getVaultsByUserId(userId) {
        return await db.select().from(vaults).where(eq(vaults.userId, userId));
    }

    async createVault({ userId, title, ciphertext, iv, encryptedDekOwner, visibility }) {
        const [newVault] = await db.insert(vaults)
            .values({ userId, title, ciphertext, iv, encryptedDekOwner, visibility })
            .returning();
        return newVault;
    }

    async deleteVault(userId, vaultId) {
        const [deletedVault] = await db.delete(vaults)
            .where(and(eq(vaults.id, vaultId), eq(vaults.userId, userId)))
            .returning();
        return deletedVault;
    }

    async editVault(userId, vaultId, { title, ciphertext, iv }) {
        const [updatedVault] = await db.update(vaults)
            .set({ title, ciphertext, iv })
            .where(and(eq(vaults.id, vaultId), eq(vaults.userId, userId)))
            .returning();
        return updatedVault;
    }
}

export default new VaultsRepository();
