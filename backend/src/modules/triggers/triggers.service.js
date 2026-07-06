import db from '../../db/index.js';
import { triggers, vaultRecipients } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

class TriggersService {
    async addTrigger(vaultId, { type, triggerDate, inactivityDays, recipients }) {
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
