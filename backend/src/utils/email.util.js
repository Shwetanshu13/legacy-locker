import nodemailer from 'nodemailer';
import { getLegacyReleaseEmailTemplate } from '../templates/legacyRelease.template.js';
import { getInactivityWarningEmailTemplate } from '../templates/inactivityWarning.template.js';
import { getLoginOtpEmailTemplate } from '../templates/loginOtp.template.js';
import { env } from '../config/env.js';

let transporter;

const getTransporter = () => {
    if (!transporter) {
        const isGmail = env.EMAIL_SERVICE === 'gmail' || env.EMAIL_SERVICE === 'smtp.gmail.com';
        
        const config = isGmail ? {
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            }
        } : {
            host: env.EMAIL_SERVICE,
            port: env.EMAIL_PORT,
            secure: Number(env.EMAIL_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            },
        };

        transporter = nodemailer.createTransport(config);
    }
    return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!env.EMAIL_USER || !env.EMAIL_PASS) {
            console.log(`[DEV MODE Email] To: ${to} | Subject: ${subject}`);
            console.log(`[DEV MODE Email] Content: ${text || html}`);
            return true;
        }

        const mailOptions = {
            from: `"Legacy Locker" <${env.EMAIL_USER}>`,
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

export const sendLoginOtpEmail = async ({ to, otp }) => {
    const html = getLoginOtpEmailTemplate({ otp });
    const subject = `Login Verification Code: ${otp}`;
    
    return await sendEmail({
        to,
        subject,
        html,
    });
};
