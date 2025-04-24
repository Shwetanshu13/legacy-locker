// /scripts/checkTriggers.ts
import db from "@/db";
import { vaults, triggers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

async function sendNotification(email, title) {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Vault Reminder: ${title}`,
        text: `This is a reminder about your vault: ${title}`,
    });
}

export async function checkTriggers() {
    const now = new Date();

    const allTriggers = await db.select({
        vaultId: triggers.vaultId,
        type: triggers.type,
        date: triggers.triggerDate,
        inactivityDays: triggers.inactivityDays,
    }).from(triggers);

    for (const trigger of allTriggers) {
        const vault = await db.select().from(vaults).where(eq(vaults.id, trigger.vaultId));
        if (!vault.length) continue;

        const vaultData = vault[0];
        const user = await db.select().from(users).where(eq(users.id, vaultData.userId));
        if (!user.length) continue;

        const lastUpdated = new Date(vaultData.updatedAt);
        const shouldSend =
            (trigger.type === "date" && trigger.date && new Date(trigger.date).toDateString() === now.toDateString()) ||
            (trigger.type === "inactivity" && trigger.inactivityDays &&
                (now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24) >= trigger.inactivityDays);

        if (shouldSend) {
            await sendNotification(user[0].email, vaultData.title);
        }
    }

    console.log("Checked and sent email notifications.");
}

// run the function
checkTriggers();
