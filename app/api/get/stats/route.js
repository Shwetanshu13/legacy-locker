// /app/api/get/stats/route.ts
import db from "@/db";
import { vaults, trustedContacts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { clerkUserId } = await req.json();

        if (!clerkUserId) {
            return Response.json({ error: "Missing clerkUserId" }, { status: 400 });
        }

        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.clerkUserId, clerkUserId));

        if (userResult.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const userId = userResult[0].id;

        const [vaultsResult, contactsResult] = await Promise.all([
            db.select().from(vaults).where(eq(vaults.userId, userId)),
            db.select().from(trustedContacts).where(eq(trustedContacts.userId, userId)),
        ]);

        const lastActivity = vaultsResult.reduce((latest, vault) => {
            const date = new Date(vault.lastActivityAt || vault.createdAt);
            return date > new Date(latest) ? date.toISOString() : latest;
        }, "1970-01-01T00:00:00.000Z");

        return Response.json({
            totalVaults: vaultsResult.length,
            totalContacts: contactsResult.length,
            lastActivity,
        });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
