// /api/get/trusted-contacts/route.js
import db from "@/db";
import { trustedContacts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { clerkUserId } = await req.json();

        if (!clerkUserId) {
            return Response.json({ message: "Missing userId" }, { status: 400 });
        }

        const regUsers = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

        if (regUsers.length === 0) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        const userId = regUsers[0].id;

        const contacts = await db
            .select()
            .from(trustedContacts)
            .where(eq(trustedContacts.userId, userId));

        return Response.json({ contacts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching trusted contacts:", error);
        return Response.json({ message: "Error fetching contacts" }, { status: 500 });
    }
}
