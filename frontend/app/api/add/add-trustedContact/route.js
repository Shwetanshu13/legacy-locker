import db from "@/db";
import { trustedContacts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body);
        const { clerkUserId, name, email, relationship } = body;
        console.log("POST /api/add-trustedContact");
        console.log(clerkUserId, name, email, relationship);

        if (!clerkUserId || !name || !email) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        const regUsers = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

        if (regUsers.length === 0) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        const userId = regUsers[0].id;

        const existingContact = await db
            .select()
            .from(trustedContacts)
            .where(eq(trustedContacts.userId, userId))
            .where(eq(trustedContacts.email, email));

        if (existingContact.length > 0) {
            return Response.json({ message: "Trusted contact already exists" }, { status: 403 });
        }

        await db.insert(trustedContacts).values({
            userId,
            name,
            email,
            relationship,
        });

        return Response.json({ message: "Trusted contact added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding trusted contact:", error);
        return Response.json({ message: "Error adding trusted contact" }, { status: 500 });
    }
}
