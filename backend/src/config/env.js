import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'FRONTEND_URL',
    'JWT_SECRET',
    'SECRET_KEY',
    'EMAIL_USER',
    'RESEND_API_KEY'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`FATAL: Missing required backend environment variable: ${envVar}`);
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SECRET_KEY: process.env.SECRET_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};
