# 🧾 Legacy Locker

A zero-knowledge, end-to-end encrypted digital vault for safeguarding your important information and securely handing it down to trusted nominees — featuring automated releases triggered by inactivity periods or scheduled dates.

Includes both a **Web Application** and a **Companion Mobile App (iOS & Android)**.

## 🚀 Features

- **🔐 End-to-End Encryption (E2EE):** Your vaults are encrypted locally on your browser and mobile device using AES-256-GCM. We never see your plaintext data.
- **🛡️ Master Password Security:** Vault keys are protected by your Master Password, derived securely using Argon2 (both on Web and Native Mobile using OpenSSL).
- **📱 Biometric Authentication:** WebAuthn passkey support! Login securely using FaceID, TouchID, or your device's biometric sensor. No more passwords.
- **🤝 Secure Nominee Handover:** Decryption keys are securely wrapped using a unique 6-digit Sharing PIN that you provide to your nominees offline.
- **⏳ Dead Man's Switch:** Automated emails trigger and release encrypted vaults to your nominees after **N days of inactivity**.
- **📅 Scheduled Release:** Set a specific future **date** to hand down your digital legacy.
- **🛑 Anti-Exploitation Auth:** Built-in rate-limiting and fallback OTP mechanisms if biometrics fail.

---

## ⚙️ Tech Stack

- **Web Frontend:** Next.js 15, React 19, TailwindCSS
- **Mobile App:** React Native, Expo (Prebuild), NativeWind, Expo Router, QuickCrypto
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Docker), Drizzle ORM
- **Authentication:** WebAuthn (Passkeys), Custom JWT, Email OTPs
- **Cryptography:** Web Crypto API (Browser), react-native-quick-crypto (Mobile OpenSSL), Argon2
- **Email Service:** Nodemailer

---

## 📦 Folder Structure

```
legacy-locker/
├── frontend/             # Next.js Web Application
│   ├── app/              # Next.js App Router (Pages & Layouts)
│   ├── hooks/            # Custom React Hooks
│   ├── utils/            # Crypto utilities (E2EE logic)
├── mobile/               # React Native (Expo) Mobile Application
│   ├── app/              # Expo Router App (Tabs, Auth, Vaults)
│   ├── hooks/            # Mobile-specific auth hooks
│   ├── utils/            # Native crypto utilities (react-native-quick-crypto)
├── backend/              # Node.js + Express Backend
│   ├── src/
│   │   ├── db/           # Drizzle schema and connection
│   │   ├── modules/      # Domain Logic (Auth, Vaults, Triggers)
│   │   └── server.js     # Entry point
└── docker-compose.yml    # PostgreSQL DB Setup
```

---

## 🔑 Environment Variables

### Backend (`backend/.env.local` and `backend/.env.prod`)
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/legacylocker
JWT_SECRET=your_super_secret_jwt_key
EMAIL_SERVICE=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`frontend/.env.local` and `frontend/.env.prod`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SECRET_KEY=yoursecretkeybase64stringthatis32byteslong=
```

### Mobile (`mobile/.env.local` and `mobile/.env.prod`)
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
EXPO_PUBLIC_SECRET_KEY=yoursecretkeybase64stringthatis32byteslong=
```

---

## 🧪 Setup Instructions

### 1. Start PostgreSQL Database
Ensure you have Docker installed and running.
```bash
docker-compose up -d
```

### 2. Setup and Run Backend
```bash
cd backend
npm install
# Push DB Schema to Postgres
npm run db:push
# Start the backend server (runs on port 5000)
npm run dev
```

### 3. Setup and Run Web Frontend
Open a new terminal.
```bash
cd frontend
npm install --legacy-peer-deps
# Start the frontend dev server (runs on port 3000)
npm run dev
```

### 4. Setup and Run Mobile App (React Native)
Because the mobile app uses native cryptography and biometric passkey modules, it cannot be run inside the standard Expo Go app. **You must build a custom development client.**

Open a new terminal.
```bash
cd mobile
npm install --legacy-peer-deps
# Build the native Android app (Requires Android Studio and SDK)
npx expo run:android
```
*(Note: Change `EXPO_PUBLIC_API_URL` in `.env.local` to your local machine's local IP address if testing on a physical device instead of an Android Emulator).*

---

## 🔐 Security Architecture

- **Zero-Knowledge Design:** All vaults are secured before leaving the client. The backend stores ciphertext.
- **No Password Stored:** Your Master Password is used to encrypt your Data Encryption Keys (DEKs) on the client side and is never transmitted to the server.
- **Sharing PINs:** When a vault is assigned to a nominee, the DEK is decrypted using your active session and re-wrapped using a temporary 6-digit PIN. The server only receives the wrapped payload.
- **Biometric Only:** Primary authentication is handled exclusively by the OS hardware security enclave via WebAuthn, falling back to Email OTPs only if necessary.
