import db from "@/db";
import { vaults, users } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { sendNotificationEmail } from "@/utils/email";
import { isSameDay, differenceInDays } from "date-fns";

export async function GET() {
    try {
        const allVaults = await db.select().from(vaults);

        for (const vault of allVaults) {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.id, vault.userId))
                .then(res => res[0]);

            if (!user || !user.email) continue;

            const now = new Date();

            if (vault.triggerType === "scheduled") {
                const targetDate = new Date(vault.triggerConfig.scheduledDate);
                if (isSameDay(now, targetDate)) {
                    await sendNotificationEmail(user.email, vault);
                }
            }

            if (vault.triggerType === "inactivity") {
                const lastActive = new Date(vault.triggerConfig.lastActive);
                const inactiveDays = vault.triggerConfig.inactivityDays;
                const diff = differenceInDays(now, lastActive);
                if (diff >= inactiveDays) {
                    await sendNotificationEmail(user.email, vault);
                }
            }
        }

        return Response.json({ message: "Trigger check completed." });
    } catch (error) {
        console.error("Scheduled trigger error:", error);
        return Response.json({ message: "Error checking triggers" }, { status: 500 });
    }
}
