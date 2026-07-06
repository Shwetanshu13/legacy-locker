import { eq } from 'drizzle-orm';
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
}

export default new VaultsRepository();
