// /api/get/triggers/route.js
import db from "@/db";
import { triggers, vaults } from "@/db/schema";
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
            return Response.json({ triggers: [] }, { status: 200 });
        }

        const triggerList = await db
            .select()
            .from(triggers)
            .where(inArray(triggers.vaultId, vaultIds));

        return Response.json({ triggers: triggerList }, { status: 200 });
    } catch (error) {
        console.error("Error fetching triggers:", error);
        return Response.json({ message: "Error fetching triggers" }, { status: 500 });
    }
}
