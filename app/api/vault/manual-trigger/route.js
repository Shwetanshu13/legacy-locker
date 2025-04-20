import db from "@/db";
import { eq } from "drizzle-orm";
import { vaults, vaultRecipients, trustedContacts } from "@/db/schema";
import { sendTriggerEmail } from "@/lib/mail/triggerEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { vaultId } = await req.json();

    // Get the vault
    const [vault] = await db
      .select()
      .from(vaults)
      .where(eq(vaults.id, vaultId));

    if (!vault) {
      return NextResponse.json({ message: "Vault not found" }, { status: 404 });
    }

    // Get all recipients for the vault
    const recipients = await db
      .select({
        contactId: vaultRecipients.contactId,
        customMessage: vaultRecipients.customMessage,
        name: trustedContacts.name,
        email: trustedContacts.email,
        relationship: trustedContacts.relationship,
      })
      .from(vaultRecipients)
      .innerJoin(trustedContacts, eq(vaultRecipients.contactId, trustedContacts.id))
      .where(eq(vaultRecipients.vaultId, vaultId));

    if (recipients.length === 0) {
      return NextResponse.json({ message: "No recipients found" }, { status: 400 });
    }

    // Send email to each recipient
    for (const recipient of recipients) {
      const emailText = `Hey ${recipient.name},

You have received a legacy vault titled "${vault.title}".

Message from the sender: ${recipient.customMessage || "No personal message provided."}

Vault Content:
${vault.content}

If you were not expecting this, please reach out to the sender for clarification.

– Legacy Locker`;

      await sendTriggerEmail({
        to: recipient.email,
        subject: `Legacy Vault Shared: "${vault.title}"`,
        text: emailText,
      });
    }

    return NextResponse.json({ message: "Emails sent to all recipients." });
  } catch (error) {
    console.error("Manual trigger error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
