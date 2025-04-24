import db from "@/db";
import { users, vaults } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/utils/encrypt";

export async function POST(req) {
    try {
        const { clerkUserId } = await req.json();

        if (!clerkUserId) {
            return Response.json({ message: "Missing clerkUserId" }, { status: 400 });
        }

        const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 403 });
        }

        const vaultData = await db.select().from(vaults).where(eq(vaults.userId, user.id));

        const decryptedVaults = vaultData.map(vault => ({
            id: vault.id,
            title: vault.title,
            content: decrypt(vault.content),
            visibility: vault.visibility,
        }));

        return Response.json({ vaults: decryptedVaults }, { status: 200 });
    } catch (err) {
        console.error("Error fetching vaults:", err);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
