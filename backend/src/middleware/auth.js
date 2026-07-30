import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET || 'fallback_secret');
        req.user = decoded; // { id, email }
        
        // Asynchronously update last active timestamp
        if (decoded && decoded.id) {
            db.update(users).set({ lastActiveAt: new Date() }).where(eq(users.id, decoded.id)).catch(err => {
                console.error("Failed to update lastActiveAt for user:", err);
            });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
