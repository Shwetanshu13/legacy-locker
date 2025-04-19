import { db } from "@/db";
import { vaultRecipients } from "@/schema";

export async function POST(req) {
    try {
        const { vaultId, contactId, customMessage } = await req.json();
        console.log("POST /api/add-vaultRecipient");
        console.log(vaultId, contactId, customMessage);

        if (!vaultId || !contactId) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        await db.insert(vaultRecipients).values({
            vaultId,
            contactId,
            customMessage,
        });

        return Response.json({ message: "Vault recipient added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding vault recipient:", error);
        return Response.json({ message: "Error adding vault recipient" }, { status: 500 });
    }
}
