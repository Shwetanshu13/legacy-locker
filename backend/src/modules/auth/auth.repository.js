import { eq, desc } from 'drizzle-orm';
import db from '../../db/index.js';
import { users, passkeys, otps } from '../../db/schema.js';

class AuthRepository {
    async getUserByEmail(email) {
        const existingUsers = await db.select().from(users).where(eq(users.email, email));
        return existingUsers[0] || null;
    }

    async createUser(email, passwordHash) {
        const [user] = await db.insert(users).values({
            email,
            passwordHash,
            isVerified: false,
        }).returning();
        return user;
    }

    async setUserVerified(userId) {
        await db.update(users).set({ isVerified: true }).where(eq(users.id, userId));
    }

    async createOtp(email, otp) {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await db.insert(otps).values({ email, otp, expiresAt });
    }

    async getOtp(email, otp) {
        const results = await db.select().from(otps)
            .where(eq(otps.email, email))
            .orderBy(desc(otps.createdAt));
        // Return latest OTP for email matching the given one
        const match = results.find(r => r.otp === otp);
        return match || null;
    }

    async deleteOtpsByEmail(email) {
        await db.delete(otps).where(eq(otps.email, email));
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
