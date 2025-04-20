import db from "@/db";
import { eq } from "drizzle-orm";
import { vaults, vaultRecipients, trustedContacts, users } from "@/db/schema";
import { sendTriggerEmail } from "@/lib/mail/triggerEmail";
import { decrypt } from "@/utils/encrypt";

export async function POST(req) {
  try {
    const { vaultId, clerkUserId } = await req.json();

    // Get the vault
    const [vault] = await db
      .select()
      .from(vaults)
      .where(eq(vaults.id, vaultId));

    if (!vault) {
      return Response.json({ message: "Vault not found" }, { status: 404 });
    }

    const regUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId));

    if (regUsers.length === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const userName = regUsers[0].fullName;

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
      return Response.json({ message: "No recipients found" }, { status: 400 });
    }

    const decryptedContent = decrypt(vault.content);

    // Send email to each recipient
    for (const recipient of recipients) {
      const emailText = `Hey ${recipient.name},
      

You have received a legacy vault titled "${vault.title}" from "${userName}".

Message from the sender: ${recipient.customMessage || "No personal message provided."}

Vault Content:
${decryptedContent}

If you were not expecting this, please reach out to the sender for clarification.

– Legacy Locker`;

      await sendTriggerEmail({
        to: recipient.email,
        subject: `Legacy Vault Shared: "${vault.title}"`,
        text: emailText,
      });
    }

    return Response.json({ message: "Emails sent to all recipients." });
  } catch (error) {
    console.error("Manual trigger error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
