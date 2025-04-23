import db from "@/db"; // adjust based on your setup
import { triggers } from "@/db/schema"; // assuming this exists

export async function POST(req) {
    try {
        const body = await req.json();
        const { vaultId, type, scheduledAt, inactivityDays } = body;

        // Validate, then insert trigger
        const result = await db.insert(triggers).values({
            vaultId,
            type,
            triggerDate: scheduledAt || null,
            inactivityDays: inactivityDays ? Number(inactivityDays) : null,
        });

        return Response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, error: error.message });
    }
}
