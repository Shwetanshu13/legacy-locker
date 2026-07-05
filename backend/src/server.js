import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: '../.env' }); // Adjust if .env is inside backend/

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
