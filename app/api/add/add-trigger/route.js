import { db } from "@/db";
import { triggers } from "@/schema";

export async function POST(req) {
    try {
        const { vaultId, type, scheduledAt, inactivityDays } = await req.json();
        console.log("POST /api/add-trigger");
        console.log(type, scheduledAt, inactivityDays);

        if (!vaultId || !type) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        await db.insert(triggers).values({
            vaultId,
            type,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            inactivityDays,
        });

        return Response.json({ message: "Trigger added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding trigger:", error);
        return Response.json({ message: "Error adding trigger" }, { status: 500 });
    }
}
