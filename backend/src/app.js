import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import vaultsRoutes from './modules/vaults/vaults.routes.js';
import contactsRoutes from './modules/contacts/contacts.routes.js';
import triggersRoutes from './modules/triggers/triggers.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Load modules
app.use('/api/auth', authRoutes);
app.use('/api/vaults', vaultsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/triggers', triggersRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

export default app;
