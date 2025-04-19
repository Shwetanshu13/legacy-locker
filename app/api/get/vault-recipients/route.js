// /api/get/vault-recipients/route.js
import db from "@/db";
import { vaultRecipients, vaults } from "@/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(req) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return Response.json({ message: "Missing userId" }, { status: 400 });
        }

        const userVaults = await db
            .select({ id: vaults.id })
            .from(vaults)
            .where(eq(vaults.userId, userId));

        const vaultIds = userVaults.map(v => v.id);

        if (vaultIds.length === 0) {
            return Response.json({ vaultRecipients: [] }, { status: 200 });
        }

        const recipients = await db
            .select()
            .from(vaultRecipients)
            .where(inArray(vaultRecipients.vaultId, vaultIds));

        return Response.json({ vaultRecipients: recipients }, { status: 200 });
    } catch (error) {
        console.error("Error fetching vault recipients:", error);
        return Response.json({ message: "Error fetching recipients" }, { status: 500 });
    }
}
