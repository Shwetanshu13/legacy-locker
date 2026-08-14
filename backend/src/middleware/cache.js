import redisConnection from '../utils/redis.util.js';

export const cacheMiddleware = (prefix) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return next();
        }
        
        const userId = req.user.id;
        const key = `${prefix}:${userId}`;
        
        try {
            const cachedData = await redisConnection.get(key);
            if (cachedData) {
                // If data exists in cache, return it immediately
                return res.status(200).json(JSON.parse(cachedData));
            }
            
            // Override res.json to capture and cache the response
            const originalJson = res.json;
            res.json = function(body) {
                // Set cache for 1 hour (3600 seconds)
                redisConnection.set(key, JSON.stringify(body), 'EX', 3600).catch(err => {
                    console.error('Redis set error:', err);
                });
                originalJson.call(this, body);
            };
            next();
        } catch (error) {
            console.error('Redis cache error:', error);
            next();
        }
    };
};

export const invalidateCache = async (prefix, userId) => {
    try {
        const key = `${prefix}:${userId}`;
        await redisConnection.del(key);
    } catch (error) {
        console.error('Redis invalidate error:', error);
    }
};
