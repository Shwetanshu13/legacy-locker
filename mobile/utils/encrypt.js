import crypto from 'react-native-quick-crypto';
import { env } from './env';
import { Buffer } from 'buffer';

const algorithm = "aes-256-cbc";
const secretKey = env.API_URL; // Wait, we need SECRET_KEY in the mobile env!

// But actually, on the frontend, encrypt.js was used for SOME encrypting things, but mostly the server uses SECRET_KEY.
// Let me look at the frontend encrypt.js. It used `env.SECRET_KEY`.
// I should use exactly what it used.

export function encrypt(text) {
    if (!env.SECRET_KEY) throw new Error("SECRET_KEY not found in env");
    const key = Buffer.from(env.SECRET_KEY, "base64");
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText) {
    if (!env.SECRET_KEY) throw new Error("SECRET_KEY not found in env");
    const key = Buffer.from(env.SECRET_KEY, "base64");
    
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
