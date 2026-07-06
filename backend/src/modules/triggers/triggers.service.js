import db from '../../db/index.js';
import { triggers, vaultRecipients } from '../../db/schema.js';

class TriggersService {
    async addTrigger(vaultId, { type, triggerDate, inactivityDays, contactId, encryptedDekNominee, customMessage }) {
        return await db.transaction(async (tx) => {
            // Add the trigger
            const [newTrigger] = await tx
                .insert(triggers)
                .values({
                    vaultId,
                    type,
                    triggerDate: triggerDate ? new Date(triggerDate) : null,
                    inactivityDays: inactivityDays ? inactivityDays.toString() : null
                })
                .returning();

            // Add the vault recipient
            const [newRecipient] = await tx
                .insert(vaultRecipients)
                .values({
                    vaultId,
                    contactId,
                    customMessage,
                    encryptedDekNominee
                })
                .returning();

            return { trigger: newTrigger, recipient: newRecipient };
        });
    }
}

export default new TriggersService();
