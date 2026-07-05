import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import disposableDomains from 'disposable-email-domains';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users, otps } from '../db/schema.js';

const router = express.Router();

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Basic format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Disposable email validation (prevent 10 minute mails)
        const domain = email.split('@')[1];
        if (disposableDomains.includes(domain)) {
            return res.status(400).json({ message: 'Disposable email addresses are not allowed' });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60000); // Expires in 10 minutes

        // Save OTP to DB
        await db.insert(otps).values({
            email,
            otp,
            expiresAt,
        });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Legacy Locker - Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log(`[DEV MODE] Generated OTP for ${email}: ${otp}`);
        }

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Check if OTP exists and is valid
        const dbOtps = await db.select().from(otps).where(eq(otps.email, email));
        
        if (dbOtps.length === 0) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }

        // Get the latest OTP
        const latestOtp = dbOtps.reduce((a, b) => a.createdAt > b.createdAt ? a : b);

        if (latestOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > latestOtp.expiresAt) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Check if user exists
        const existingUsers = await db.select().from(users).where(eq(users.email, email));
        let user = existingUsers[0];

        if (!user) {
            // Create user
            const result = await db.insert(users).values({
                email,
                isVerified: true,
            }).returning();
            user = result[0];
        } else if (!user.isVerified) {
            // Update user to verified
            await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
        }

        // Delete the used OTP
        await db.delete(otps).where(eq(otps.id, latestOtp.id));

        // Issue JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'OTP verified successfully',
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to verify OTP' });
    }
});

export default router;
