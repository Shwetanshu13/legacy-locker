import Redis from 'ioredis';
import { env } from '../config/env.js';

const redisConnection = new Redis(env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisConnection;
