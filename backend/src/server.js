import './env.js';
import app from './app.js';
import { startTriggerChecker } from './cron/triggerChecker.js';
import './workers/email.worker.js';

const port = process.env.PORT || 5000;

// Start background cron jobs
startTriggerChecker();

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
