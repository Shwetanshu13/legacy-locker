import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Adjust if .env is inside backend/

import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { vaults, triggers, users, vaultRecipients, trustedContacts } from '../db/schema.js';
import { sendEmail } from '../utils/email.util.js';

async function sendNotification(email, title, isNominee = false, ownerName = "") {
    const subject = isNominee ? `A Vault has been unlocked for you` : `Vault Reminder: ${title}`;
    const text = isNominee 
        ? `${ownerName} has unlocked the vault "${title}" for you. Please log in to Legacy Locker to view it.`
        : `This is a reminder about your vault: ${title}`;
    const html = isNominee
        ? `<p><strong>${ownerName}</strong> has unlocked the vault "<strong>${title}</strong>" for you. Please log in to Legacy Locker to view it.</p>`
        : `<p>This is a reminder about your vault: <strong>${title}</strong></p>`;

    await sendEmail({
        to: email,
        subject,
        text,
        html
    });
}

export async function checkTriggers() {
    console.log("Starting trigger check...");
    const now = new Date();

    try {
        const allTriggers = await db.select().from(triggers);

        for (const trigger of allTriggers) {
            const vault = await db.select().from(vaults).where(eq(vaults.id, trigger.vaultId));
            if (!vault.length) continue;

            const vaultData = vault[0];
            const user = await db.select().from(users).where(eq(users.id, vaultData.userId));
            if (!user.length) continue;
            
            const owner = user[0];
            const lastUpdated = new Date(vaultData.createdAt); // Or owner's lastActiveAt depending on logic
            
            const shouldTrigger =
                (trigger.type === "date" && trigger.date && new Date(trigger.date).toDateString() === now.toDateString()) ||
                (trigger.type === "inactivity" && trigger.inactivityDays &&
                    (now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24) >= parseInt(trigger.inactivityDays));

            if (shouldTrigger) {
                // Unlock for nominees
                await db.update(vaultRecipients)
                    .set({ isUnlocked: true })
                    .where(eq(vaultRecipients.vaultId, vaultData.id));

                // Fetch nominees to notify
                const recipients = await db.select().from(vaultRecipients).where(eq(vaultRecipients.vaultId, vaultData.id));
                for (const recipient of recipients) {
                    const contact = await db.select().from(trustedContacts).where(eq(trustedContacts.id, recipient.contactId));
                    if (contact.length) {
                        await sendNotification(contact[0].email, vaultData.title, true, owner.fullName || owner.email);
                        console.log(`Notification sent to nominee: ${contact[0].email}`);
                    }
                }

                // Notify owner (optional, depending on requirements, we keep it)
                await sendNotification(owner.email, vaultData.title);
                console.log(`Notification sent for vault: ${vaultData.title} to owner: ${owner.email}`);
            }
        }

        console.log("Finished checking and sending email notifications.");
    } catch (error) {
        console.error("Error during trigger check:", error);
    }
}

// Allow running the script directly
if (process.argv[1] && process.argv[1].endsWith('checkTriggers.job.js')) {
    checkTriggers().then(() => process.exit(0));
}
