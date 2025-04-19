import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = 12345678901234567890123456789012; // Must be 32 bytes (e.g., a secure random string)
const iv = crypto.randomBytes(16); // Initialization vector

export function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey),
        iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
