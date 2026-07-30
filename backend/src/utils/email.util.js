import nodemailer from 'nodemailer';
import { getLegacyReleaseEmailTemplate } from '../templates/legacyRelease.template.js';
import { getInactivityWarningEmailTemplate } from '../templates/inactivityWarning.template.js';

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[DEV MODE Email] To: ${to} | Subject: ${subject}`);
            console.log(`[DEV MODE Email] Content: ${text || html}`);
            return true;
        }

        const mailOptions = {
            from: `"Legacy Locker" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const mailTransporter = getTransporter();
        await mailTransporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export const sendLegacyReleaseEmail = async ({ to, contactName, ownerName, vaultTitle, customMessage, unlockLink }) => {
    const html = getLegacyReleaseEmailTemplate({ contactName, ownerName, vaultTitle, customMessage, unlockLink });
    const subject = `Legacy Release: ${vaultTitle}`;
    
    return await sendEmail({
        to,
        subject,
        html,
    });
};

export const sendInactivityWarningEmail = async ({ to, ownerName, vaultTitle }) => {
    const html = getInactivityWarningEmailTemplate({ ownerName, vaultTitle });
    const subject = `Warning: Inactivity Trigger Approaching for ${vaultTitle}`;
    
    return await sendEmail({
        to,
        subject,
        html,
    });
};

export const sendOtpEmail = async ({ to, otp }) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Legacy Locker Account</h2>
            <p>Your one-time verification code is:</p>
            <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
        </div>
    `;
    const subject = `Your Verification Code: ${otp}`;
    
    return await sendEmail({
        to,
        subject,
        html,
    });
};
