import { Worker } from 'bullmq';
import redisConnection from '../utils/redis.util.js';
import { sendEmail, sendLegacyReleaseEmail, sendInactivityWarningEmail } from '../utils/email.util.js';
import { getOtpEmailTemplate } from '../templates/otp.template.js';

export const emailWorker = new Worker('email-queue', async (job) => {
    console.log(`[EmailWorker] Processing job ${job.id} of type ${job.name}`);
    
    switch (job.name) {
        case 'send-otp': {
            const { to, otp } = job.data;
            await sendEmail({
                to,
                subject: 'Legacy Locker - Your OTP Code',
                text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
                html: getOtpEmailTemplate(otp),
            });
            break;
        }
        case 'send-legacy-release': {
            const { to, contactName, ownerName, vaultTitle, customMessage, unlockLink } = job.data;
            await sendLegacyReleaseEmail({ to, contactName, ownerName, vaultTitle, customMessage, unlockLink });
            break;
        }
        case 'send-inactivity-warning': {
            const { to, ownerName, vaultTitle } = job.data;
            await sendInactivityWarningEmail({ to, ownerName, vaultTitle });
            break;
        }
        default:
            console.warn(`[EmailWorker] Unknown job name: ${job.name}`);
    }
}, {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 emails concurrently
});

emailWorker.on('completed', (job) => {
    console.log(`[EmailWorker] Job ${job.id} completed successfully.`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`[EmailWorker] Job ${job.id} failed with error:`, err.message);
});
