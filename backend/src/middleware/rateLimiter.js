import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// Block after 5 requests in 15 minutes
export const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many OTP requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Delay after 2 requests in 15 minutes
export const otpSpeedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 2,
    delayMs: (hits) => (hits - 2) * 500, // Add 500ms of delay per request above 2
});

// General rate limiter for other auth endpoints
export const generalAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
