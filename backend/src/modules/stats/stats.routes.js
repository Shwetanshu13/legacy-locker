import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import db from '../../db/index.js';
import { vaults, trustedContacts, users } from '../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Count vaults
        const [vaultsCountRes] = await db
            .select({ count: sql`count(*)` })
            .from(vaults)
            .where(eq(vaults.userId, userId));
            
        // Count contacts
        const [contactsCountRes] = await db
            .select({ count: sql`count(*)` })
            .from(trustedContacts)
            .where(eq(trustedContacts.userId, userId));
            
        // Get last activity
        const [userRes] = await db
            .select({ lastActiveAt: users.lastActiveAt })
            .from(users)
            .where(eq(users.id, userId));

        res.status(200).json({
            totalVaults: Number(vaultsCountRes?.count || 0),
            totalContacts: Number(contactsCountRes?.count || 0),
            lastActivity: userRes?.lastActiveAt || null,
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

export default router;
