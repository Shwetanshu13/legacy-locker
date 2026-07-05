import express from 'express';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users, vaults, trustedContacts, vaultRecipients, triggers } from '../db/schema.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Protect all API routes below
router.use(authMiddleware);

// --- Vaults ---

// Get all vaults for user
router.get('/vaults', async (req, res) => {
    try {
        const userId = req.user.id;
        const userVaults = await db.select().from(vaults).where(eq(vaults.userId, userId));
        res.json({ data: userVaults });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vaults' });
    }
});

// Add a new vault
router.post('/add-vault', async (req, res) => {
    try {
        const { title, content, visibility } = req.body;
        const userId = req.user.id;
        
        if (!title || !content || !visibility) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Note: we should import encrypt from utils, for now assuming it's passed encrypted or we handle it here
        const encryptedContent = content; // placeholder

        const [newVault] = await db.insert(vaults)
            .values({ userId, title, content: encryptedContent, visibility })
            .returning();
            
        res.json({ message: 'Vault added successfully', data: newVault });
    } catch (error) {
        res.status(500).json({ message: 'Error adding vault' });
    }
});

// Other placeholders for migration
router.post('/add-trigger', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.post('/add-trustedContact', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.post('/add-vaultRecipient', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.get('/stats', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.get('/triggers', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.get('/trusted-contacts', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.get('/vault-recipients', async (req, res) => { res.json({ message: 'Not implemented' }) });
router.post('/vault/delete', async (req, res) => { res.json({ message: 'Not implemented' }) });

export default router;
