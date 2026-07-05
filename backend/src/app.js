import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import vaultsRoutes from './modules/vaults/vaults.routes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Load modules
app.use('/api/auth', authRoutes);
app.use('/api/vaults', vaultsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

export default app;
