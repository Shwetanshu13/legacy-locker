// /api/get/trusted-contacts/route.js
import db from "@/db";
import { trustedContacts } from "@/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return Response.json({ message: "Missing userId" }, { status: 400 });
        }

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
