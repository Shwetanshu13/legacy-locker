import db from "@/db";
import { trustedContacts } from "@/schema";

export async function POST(req) {
    try {
        const { userId, name, email, relationship } = await req.json();
        console.log("POST /api/add-trustedContact");
        console.log(name, email, relationship);

        if (!userId || !name || !email) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
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
