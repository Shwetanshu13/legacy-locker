import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// General rate limiter for other auth endpoints
export const generalAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
