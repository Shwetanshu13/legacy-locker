import { Queue } from 'bullmq';
import redisConnection from '../utils/redis.util.js';

export const emailQueue = new Queue('email-queue', {
    connection: redisConnection,
});

export const enqueueLegacyReleaseEmail = async ({ to, contactName, ownerName, vaultTitle, customMessage, unlockLink }) => {
    return await emailQueue.add('send-legacy-release', { 
        to, contactName, ownerName, vaultTitle, customMessage, unlockLink 
    }, {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
    });
};

export const enqueueInactivityWarningEmail = async ({ to, ownerName, vaultTitle }) => {
    return await emailQueue.add('send-inactivity-warning', { 
        to, ownerName, vaultTitle 
    }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
    });
};
