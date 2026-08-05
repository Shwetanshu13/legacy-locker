import { Resend } from 'resend';
import { getLegacyReleaseEmailTemplate } from '../templates/legacyRelease.template.js';
import { getInactivityWarningEmailTemplate } from '../templates/inactivityWarning.template.js';
import { getLoginOtpEmailTemplate } from '../templates/loginOtp.template.js';
import { env } from '../config/env.js';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!env.RESEND_API_KEY) {
            console.log(`[DEV MODE Email] To: ${to} | Subject: ${subject}`);
            console.log(`[DEV MODE Email] Content: ${text || html}`);
            return true;
        }

        const payload = {
            from: `"Legacy Locker" <${env.EMAIL_USER}>`,
            to: Array.isArray(to) ? to : [to],
            subject,
        };

        if (html) payload.html = html;
        if (text) payload.text = text;

        const { data, error } = await resend.emails.send(payload);

        if (error) {
            console.error('Error sending email via Resend:', error);
            throw new Error(error.message);
        }

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
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
