import { eq, desc } from 'drizzle-orm';
import db from '../../db/index.js';
import { users, otps } from '../../db/schema.js';

class AuthRepository {
    async createOtp(email, otp, expiresAt) {
        const [inserted] = await db.insert(otps).values({
            email,
            otp,
            expiresAt,
        }).returning();
        return inserted;
    }

    async getLatestOtpByEmail(email) {
        const dbOtps = await db.select()
            .from(otps)
            .where(eq(otps.email, email))
            .orderBy(desc(otps.createdAt))
            .limit(1);
        
        return dbOtps[0] || null;
    }

    async deleteOtp(id) {
        await db.delete(otps).where(eq(otps.id, id));
    }

    async getUserByEmail(email) {
        const existingUsers = await db.select().from(users).where(eq(users.email, email));
        return existingUsers[0] || null;
    }

    async createUser(email) {
        const [user] = await db.insert(users).values({
            email,
            isVerified: true,
        }).returning();
        return user;
    }

    async verifyUser(id) {
        await db.update(users).set({ isVerified: true }).where(eq(users.id, id));
    }
}

export default new AuthRepository();
