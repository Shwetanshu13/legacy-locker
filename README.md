# 🧾 Legacy Locker

A zero-knowledge, end-to-end encrypted digital vault for safeguarding your important information and securely handing it down to trusted nominees — featuring automated releases triggered by inactivity periods or scheduled dates.

## 🚀 Features

- **🔐 End-to-End Encryption (E2EE):** Your vaults are encrypted locally on your browser using AES-256-GCM. We never see your plaintext data.
- **🛡️ Master Password Security:** Vault keys are protected by your Master Password, derived securely using Argon2.
- **🤝 Secure Nominee Handover:** Decryption keys are securely wrapped using a unique 6-digit Sharing PIN that you provide to your nominees offline.
- **⏳ Dead Man's Switch:** Automated emails trigger and release encrypted vaults to your nominees after **N days of inactivity**.
- **📅 Scheduled Release:** Set a specific future **date** to hand down your digital legacy.
- **⚡ Asynchronous Processing:** BullMQ & Redis-backed queue system for robust, non-blocking email delivery.
- **🛑 Anti-Exploitation Auth:** Built-in rate-limiting and speed-delaying mechanisms to prevent bot brute-forcing.

---

## ⚙️ Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Serverless), Drizzle ORM
- **Authentication:** Custom JWT-based Auth with Email OTPs
- **Cryptography:** Web Crypto API, Argon2 (Browser)
- **Queues & Cron:** Redis, BullMQ, Node-Cron
- **Email Service:** Nodemailer

---

## 📦 Folder Structure

```
legacy-locker/
├── frontend/             # Next.js Application
│   ├── app/              # Next.js App Router (Pages & Layouts)
│   ├── components/       # Reusable UI Components
│   ├── hooks/            # Custom React Hooks
│   ├── utils/            # Crypto utilities (E2EE logic)
│   └── next.config.mjs
├── backend/              # Node.js + Express Backend
│   ├── src/
│   │   ├── cron/         # node-cron jobs (Trigger Checker)
│   │   ├── db/           # Drizzle schema and connection
│   │   ├── middleware/   # Auth & Rate Limiters
│   │   ├── modules/      # Domain Logic (Auth, Vaults, Triggers)
│   │   ├── queues/       # BullMQ Queue definitions
│   │   ├── templates/    # Email HTML Templates
│   │   ├── utils/        # Redis & Email Utilities
│   │   └── workers/      # BullMQ Background Workers
│   └── server.js         # Entry point
└── docker-compose.yml    # Redis setup for queues
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_super_secret_jwt_key
EMAIL_SERVICE=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
REDIS_URL=redis://127.0.0.1:6379
```

### Frontend (`frontend/.env.local` or directly in `api.js`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🧪 Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/legacy-locker.git
cd legacy-locker
```

2. **Start the Redis Server (Required for BullMQ Emails)**
```bash
docker-compose up -d
```

3. **Setup and Run Backend**
```bash
cd backend
npm install
# Push DB Schema
npx drizzle-kit push
# Start the backend server (runs on port 5000)
npm run dev
```

4. **Setup and Run Frontend**
Open a new terminal.
```bash
cd frontend
npm install --legacy-peer-deps
# Start the frontend dev server (runs on port 3000)
npm run dev
```

---

## 🔐 Security Architecture

- **Zero-Knowledge Design:** All vaults are secured before leaving the client. The backend stores ciphertext.
- **No Password Stored:** Your Master Password is used to encrypt your Data Encryption Keys (DEKs) on the client side and is never transmitted to the server.
- **Sharing PINs:** When a vault is assigned to a nominee, the DEK is decrypted using your active session and re-wrapped using a temporary 6-digit PIN. The server only receives the wrapped payload.
- **Brute Force Protection:** Authentication endpoints are strictly rate-limited and delayed to protect against spam.

---

## 💡 Inspiration

This project was built during HackBMU to solve the problem of digital legacy and secure vault handovers — ensuring loved ones can access critical digital assets in an emergency, while maintaining absolute mathematical privacy from the platform providers themselves.
