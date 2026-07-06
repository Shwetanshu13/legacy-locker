import cron from 'node-cron';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { triggers, vaultRecipients, vaults, users, trustedContacts } from '../db/schema.js';
import { enqueueLegacyReleaseEmail, enqueueInactivityWarningEmail } from '../queues/email.queue.js';

const warnedVaults = new Set();

const checkTriggerConditions = (trigger, owner) => {
    const now = new Date();

    if (trigger.type === 'inactivity' && trigger.inactivityDays && owner.lastActiveAt) {
        const lastActive = new Date(owner.lastActiveAt);
        const inactivityMs = parseInt(trigger.inactivityDays) * 24 * 60 * 60 * 1000;
        return now.getTime() - lastActive.getTime() >= inactivityMs;
    } 
    
    if (trigger.type === 'scheduled' && trigger.triggerDate) {
        const scheduledDate = new Date(trigger.triggerDate);
        return now.getTime() >= scheduledDate.getTime();
    }

    return false;
};

const isInactivityWarningWindow = (trigger, owner) => {
    if (trigger.type !== 'inactivity' || !trigger.inactivityDays || !owner.lastActiveAt) return false;
    
    const now = new Date();
    const lastActive = new Date(owner.lastActiveAt);
    const inactivityMs = parseInt(trigger.inactivityDays) * 24 * 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const timeSinceActive = now.getTime() - lastActive.getTime();
    const timeRemaining = inactivityMs - timeSinceActive;
    
    // Check if less than 24 hours remaining, but not yet triggered
    return timeRemaining <= oneDayMs && timeRemaining > 0;
};

const releaseVault = async (recipient, vault, owner, contact) => {
    // Mark as unlocked
    await db.update(vaultRecipients)
        .set({ isUnlocked: true })
        .where(eq(vaultRecipients.id, recipient.id));

    // Send email to nominee using Queue
    const unlockLink = `http://localhost:3000/unlock-legacy/${vault.id}`;
    
    await enqueueLegacyReleaseEmail({
        to: contact.email,
        contactName: contact.name,
        ownerName: owner.fullName || owner.email,
        vaultTitle: vault.title,
        customMessage: recipient.customMessage,
        unlockLink
    });
};

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
                const shouldTrigger = checkTriggerConditions(trigger, owner);

                if (shouldTrigger) {
                    console.log(`[Cron] Trigger met for Vault ${vault.id} -> Nominee ${contact.email}`);
                    await releaseVault(recipient, vault, owner, contact);
                } else if (isInactivityWarningWindow(trigger, owner)) {
                    if (!warnedVaults.has(vault.id)) {
                        console.log(`[Cron] Inactivity warning for Vault ${vault.id} -> Owner ${owner.email}`);
                        await enqueueInactivityWarningEmail({
                            to: owner.email,
                            ownerName: owner.fullName || owner.email,
                            vaultTitle: vault.title
                        });
                        warnedVaults.add(vault.id);
                    }
                } else {
                    // Reset warning if user became active again
                    if (warnedVaults.has(vault.id)) {
                        warnedVaults.delete(vault.id);
                    }
                }
            }
        } catch (error) {
            console.error('[Cron] Error in trigger checker:', error);
        }
    });
};
