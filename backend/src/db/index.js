import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { env } from '../config/env.js';

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql);

export default db;