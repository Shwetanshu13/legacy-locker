import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We now import env.js at the top of server.js so process.env.DATABASE_URL is populated
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export default db;