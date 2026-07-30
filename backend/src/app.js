import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import vaultsRoutes from './modules/vaults/vaults.routes.js';
import contactsRoutes from './modules/contacts/contacts.routes.js';
import triggersRoutes from './modules/triggers/triggers.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';
import { runTriggerChecks } from './cron/triggerChecker.js';
import { env } from './config/env.js';

const app = express();

// Trust the first proxy (Render's load balancer) for express-rate-limit
app.set('trust proxy', 1);

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

// Load modules
app.use('/auth', authRoutes);
app.use('/vaults', vaultsRoutes);
app.use('/contacts', contactsRoutes);
app.use('/triggers', triggersRoutes);
app.use('/stats', statsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Exposed cron endpoint for external pinging (e.g., cron-job.org)
app.post('/cron/check-triggers', async (req, res) => {
    try {
        await runTriggerChecks();
        res.json({ status: 'ok', message: 'Trigger checks executed successfully' });
    } catch (error) {
        console.error('Error executing trigger checks via API:', error);
        res.status(500).json({ error: 'Internal server error during trigger checks' });
    }
});

export default app;
