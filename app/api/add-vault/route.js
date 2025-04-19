


export async function POST(req) {
    try {
        const { userId, title, content, visibility } = await req.json();
        console.log("POST /api/add-vault");
        console.log(title, content, visibility);

        if (!userId || !title || !content || !visibility) {
            return Response.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await db.insert(vaults).values({ userId, title, content, visibility });

        return Response.json({ message: 'Vault added successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error adding vault:", error);
        return Response.json({ message: 'Error adding vault' }, { status: 500 });
    }

};