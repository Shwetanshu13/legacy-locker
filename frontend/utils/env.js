const publicEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOMETHING_ELSE: process.env.NEXT_PUBLIC_SOMETHING_ELSE,
};

for (const [key, value] of Object.entries(publicEnv)) {
    if (!value) throw new Error(`FATAL: Missing required frontend environment variable: ${key}`);
}

export { publicEnv as env };