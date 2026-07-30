const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'SECRET_KEY'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`FATAL: Missing required frontend environment variable: ${envVar}`);
    }
}

export const env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SECRET_KEY: process.env.SECRET_KEY,
};
