import db from "@/db"; // your drizzle DB instance
import { users } from "@/db/schema"; // user table schema
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { clerkUserId, email, fullName } = await req.json();
        console.log("POST /api/onboarding");
        console.log(clerkUserId, email, fullName);

        if (!clerkUserId || !email || !fullName) {
            return Response.json({ message: 'Missing required fields', data: null }, { status: 400 });
        }

        // Check if user already exists
        const existing = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));
        if (existing.length > 0) {
            return Response.json({ message: 'User already onboarded' }, { status: 403 });
        }
        const client = await clerkClient();
        const response = await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
                onboardingComplete: true,
            },
        });
        console.log(response);

        await db.insert(users).values({
            clerkUserId,
            email,
            fullName,
        });

        return Response.json({ message: 'User onboarded successfully', data: { clerkUserId, email, fullName } }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Failed to onboard user', data: null }, { status: 500 });
    }
}


