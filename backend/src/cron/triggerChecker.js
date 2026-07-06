import cron from 'node-cron';
import { eq, and } from 'drizzle-orm';
import db from '../db/index.js';
import { triggers, vaultRecipients, vaults, users, trustedContacts } from '../db/schema.js';
import { sendEmail } from '../utils/email.util.js';

export const startTriggerChecker = () => {
    // Run every minute for testing, or daily in prod
    cron.schedule('* * * * *', async () => {
        console.log('[Cron] Checking triggers...');
        try {
            // Fetch all locked recipients with their triggers, vaults, and contacts
            const lockedRecipients = await db
                .select({
                    recipient: vaultRecipients,
                    trigger: triggers,
                    vault: vaults,
                    owner: users,
                    contact: trustedContacts
                })
                .from(vaultRecipients)
                .innerJoin(triggers, eq(triggers.vaultId, vaultRecipients.vaultId))
                .innerJoin(vaults, eq(vaults.id, vaultRecipients.vaultId))
                .innerJoin(users, eq(users.id, vaults.userId))
                .innerJoin(trustedContacts, eq(trustedContacts.id, vaultRecipients.contactId))
                .where(eq(vaultRecipients.isUnlocked, false));

            const now = new Date();

            for (const { recipient, trigger, vault, owner, contact } of lockedRecipients) {
                let shouldTrigger = false;

                if (trigger.type === 'inactivity' && trigger.inactivityDays && owner.lastActiveAt) {
                    const lastActive = new Date(owner.lastActiveAt);
                    const inactivityMs = parseInt(trigger.inactivityDays) * 24 * 60 * 60 * 1000;
                    if (now.getTime() - lastActive.getTime() >= inactivityMs) {
                        shouldTrigger = true;
                    }
                } else if (trigger.type === 'scheduled' && trigger.triggerDate) {
                    const scheduledDate = new Date(trigger.triggerDate);
                    if (now.getTime() >= scheduledDate.getTime()) {
                        shouldTrigger = true;
                    }
                }

                if (shouldTrigger) {
                    console.log(`[Cron] Trigger met for Vault ${vault.id} -> Nominee ${contact.email}`);
                    
                    // Mark as unlocked
                    await db.update(vaultRecipients)
                        .set({ isUnlocked: true })
                        .where(eq(vaultRecipients.id, recipient.id));

                    // Send email to nominee
                    const unlockLink = `http://localhost:3000/unlock-legacy/${vault.id}`;
                    
                    const html = `
                        <h2>Legacy Locker Release</h2>
                        <p>Hello ${contact.name},</p>
                        <p>${owner.fullName || owner.email} has shared a digital vault with you via Legacy Locker, and the release conditions have been met.</p>
                        <p><strong>Title:</strong> ${vault.title}</p>
                        <p><strong>Message from Owner:</strong> ${recipient.customMessage || 'None'}</p>
                        <br/>
                        <a href="${unlockLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Unlock Legacy</a>
                        <br/><br/>
                        <p><em>Note: You will need the Sharing PIN provided to you by the owner to decrypt the contents of this vault.</em></p>
                    `;

                    await sendEmail({
                        to: contact.email,
                        subject: `Legacy Release: ${vault.title}`,
                        html: html
                    });
                }
            }
        } catch (error) {
            console.error('[Cron] Error in trigger checker:', error);
        }
    });
};
