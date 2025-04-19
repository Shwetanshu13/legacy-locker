import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "";
console.log("Secret key is ", secretKey);

// Decode from base64 instead of hex
const key = Buffer.from(secretKey, "base64");

if (key.length !== 32) {
    // throw new Error("SECRET_KEY must decode to 32 bytes");
    console.error("SECRET_KEY must decode to 32 bytes");
}

export function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
