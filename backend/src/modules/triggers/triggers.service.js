import db from '../../db/index.js';
import { triggers, vaultRecipients, vaults } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

class TriggersService {
    async addTrigger(vaultId, { type, triggerDate, inactivityDays, recipients }) {
        // Check if vault is private
        const [vault] = await db.select().from(vaults).where(eq(vaults.id, vaultId));
        if (!vault) throw new Error("Vault not found.");
        if (vault.visibility === "private") {
            throw new Error("Private vaults cannot be triggered. Please change the visibility to 'trusted' first.");
        }

        // Since neon-http driver doesn't support transactions, execute sequentially
        
        // Add the trigger
        const [newTrigger] = await db
            .insert(triggers)
            .values({
                vaultId,
                type,
                triggerDate: triggerDate ? new Date(triggerDate) : null,
                inactivityDays: inactivityDays ? inactivityDays.toString() : null
            })
            .returning();

        // Add the vault recipients
        let newRecipients = [];
        if (recipients && recipients.length > 0) {
            const values = recipients.map(r => ({
                vaultId,
                contactId: r.contactId,
                customMessage: r.customMessage,
                encryptedDekNominee: r.encryptedDekNominee
            }));
            
            try {
                newRecipients = await db
                    .insert(vaultRecipients)
                    .values(values)
                    .returning();
            } catch (err) {
                // Pseudo-rollback for neon-http lack of transaction
                await db.delete(triggers).where(eq(triggers.id, newTrigger.id));
                throw err;
            }
        }

        return { trigger: newTrigger, recipients: newRecipients };
    }
}

export default new TriggersService();
