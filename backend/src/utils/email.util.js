import nodemailer from 'nodemailer';
import { getLegacyReleaseEmailTemplate } from '../templates/legacyRelease.template.js';
import { getInactivityWarningEmailTemplate } from '../templates/inactivityWarning.template.js';

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
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
