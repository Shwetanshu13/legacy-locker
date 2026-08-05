import 'server-only';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('FATAL: Missing required server environment variable: SECRET_KEY');
}

export const serverEnv = { SECRET_KEY };
