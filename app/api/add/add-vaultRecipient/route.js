// app/api/add-vaultRecipient/route.ts
import { vaultRecipients } from "@/schema";
import db from "@/db";

export async function POST(req) {
    try {
        const { vaultId, contactId, customMessage } = await req.json();

        if (!vaultId || !contactId) {
            return Response.json({ message: "Missing vaultId or contactId" }, { status: 400 });
        }

        await db.insert(vaultRecipients).values({
            vaultId,
            contactId,
            customMessage,
        });

        return Response.json({ message: "Vault recipient added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error assigning vault recipient:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
