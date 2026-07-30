const requiredEnvVars = [
    'EXPO_PUBLIC_API_URL',
    'EXPO_PUBLIC_SECRET_KEY'
];

export const env = {
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    SECRET_KEY: process.env.EXPO_PUBLIC_SECRET_KEY,
};

// Validate environment variables
const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
);

if (missingVars.length > 0) {
    throw new Error(
        `FATAL: Missing required mobile environment variables:\n${missingVars.join('\n')}\n` +
        `Please check your .env files.`
    );
}
