// /pages/api/vault/update-activity.ts
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = await req.json();

        return Response.json({ message: "Activity updated successfully", userId }, { status: 200 });
    } catch (err) {
        console.error("Error updating activity:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
