import { eq, desc } from 'drizzle-orm';
import db from '../../db/index.js';
import { users, passkeys } from '../../db/schema.js';

class AuthRepository {
    async getUserByEmail(email) {
        const existingUsers = await db.select().from(users).where(eq(users.email, email));
        return existingUsers[0] || null;
    }

    async createUser(email, passwordHash) {
        const [user] = await db.insert(users).values({
            email,
            passwordHash,
            isVerified: true,
        }).returning();
        return user;
    }

    async updateUserKeys(id, { publicKey, encryptedPrivateKey, salt }) {
        await db.update(users).set({ publicKey, encryptedPrivateKey, salt }).where(eq(users.id, id));
    }

    async getPasskeysByUserId(userId) {
        return await db.select().from(passkeys).where(eq(passkeys.userId, userId));
    }

    async getPasskeyByCredentialId(credentialId) {
        const results = await db.select().from(passkeys).where(eq(passkeys.credentialId, credentialId));
        return results[0] || null;
    }

    async createPasskey({ userId, credentialId, publicKey, counter, transports }) {
        const [passkey] = await db.insert(passkeys).values({
            userId,
            credentialId,
            publicKey,
            counter: counter.toString(),
            transports: JSON.stringify(transports),
        }).returning();
        return passkey;
    }

    async updatePasskeyCounter(credentialId, counter) {
        await db.update(passkeys).set({ counter: counter.toString() }).where(eq(passkeys.credentialId, credentialId));
    }
}

export default new AuthRepository();
