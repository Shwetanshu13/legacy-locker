// /app/api/vault/delete/route.js
import db from "@/db"; // adjust based on your DB instance location
import { vaults } from "@/db/schema"; // adjust this path to your Drizzle schema file
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const body = await req.json();
        const { vaultId } = body;

        if (!vaultId) {
            return Response.json(
                { success: false, message: "Vault ID is required" },
                { status: 400 }
            );
        }

        await db.delete(vaults).where(eq(vaults.id, vaultId));

        return Response.json({ success: true, message: "Vault deleted" });
    } catch (err) {
        console.error("Error deleting vault:", err);
        return Response.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
