import db from "@/db";
import { triggers, vaults } from "@/db/schema";
import { desc, eq } from "drizzle-orm";


export async function POST(req) {
    try {
        const { vaultId } = await req.json();

        if (!vaultId || vaultId.length === 0) {
            return Response.json({ message: "Missing vaultId" }, { status: 400 });
        }

        const [vault] = await db
            .select()
            .from(vaults)
            .where(eq(vaults.id, vaultId));

        if (!vault) {
            return Response.json({ message: "Vault not found" }, { status: 404 });
        }

        const trigger = await db
            .select()
            .from(triggers)
            .where(eq(triggers.vaultId, vaultId))
            .orderBy(desc(triggers.createdAt))
            .limit(1);

        if (!trigger) {
            return Response.json({ triggered: false }, { status: 200 });
        }

        const triggerType = trigger[0];

        return Response.json({ triggerType }, { status: 200 });
    } catch (error) {
        console.error("Error checking trigger:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}