import { env } from './config/env.js';
import app from './app.js';
import { startTriggerChecker } from './cron/triggerChecker.js';

const port = env.PORT;

// Start background cron jobs
startTriggerChecker();

app.listen(port, () => {
    console.log(`Backend server running on ${port}`);
});
