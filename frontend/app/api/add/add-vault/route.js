import db from "@/db";
import { users, vaults } from "@/db/schema";
import { encrypt } from "@/utils/encrypt";
import { eq } from "drizzle-orm";


export async function POST(req) {
    try {
        const { clerkUserId, title, content, visibility } = await req.json();
        console.log("POST /api/add-vault");
        // console.log(title, content, visibility);

        if (!clerkUserId || !title || !content || !visibility) {
            return Response.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const encryptedContent = encrypt(content);

        const regUsers = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

        if (regUsers.length === 0) {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }

        const userId = regUsers[0].id;

        const [newVault] = await db.insert(vaults)
            .values({ userId, title, content: encryptedContent, visibility })
            .returning();


        return Response.json({ message: 'Vault added successfully', data: newVault }, { status: 200 });


    } catch (error) {
        console.error("Error adding vault:", error);
        return Response.json({ message: 'Error adding vault' }, { status: 500 });
    }

};