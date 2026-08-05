const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
    throw new Error('FATAL: Missing required frontend environment variable: NEXT_PUBLIC_API_URL');
}

export const publicEnv = { NEXT_PUBLIC_API_URL };

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('FATAL: Missing required server environment variable: SECRET_KEY');
}

export const serverEnv = { SECRET_KEY };