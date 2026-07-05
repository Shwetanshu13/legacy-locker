import { checkTriggers as runCheckTriggers } from "@/scripts/checkTriggers";

export async function POST() {
    try {
        await runCheckTriggers();
        return Response.json({ success: true, message: "Triggers checked and emails sent." });
    } catch (err) {
        console.error(err);
        return Response.json({ success: false, error: "Failed to check triggers." }, { status: 500 });
    }
}
