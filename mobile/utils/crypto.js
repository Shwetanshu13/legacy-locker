import crypto from 'react-native-quick-crypto';
import argon2 from 'react-native-argon2';
import { Buffer } from 'buffer';

const SALT_SIZE = 16;
const KEY_ALG = 'aes-256-gcm';

export const strToAb = (str) => Buffer.from(str, 'utf8');
export const abToStr = (buf) => Buffer.from(buf).toString('utf8');
export const abToBase64 = (buf) => Buffer.from(buf).toString('base64');
export const base64ToAb = (b64) => Buffer.from(b64, 'base64');

export async function deriveKeyFromPassword(password, saltBase64) {
    let saltHex;
    let saltBuf;
    if (saltBase64) {
        saltBuf = Buffer.from(saltBase64, 'base64');
        saltHex = saltBuf.toString('hex');
    } else {
        saltBuf = crypto.randomBytes(SALT_SIZE);
        saltHex = saltBuf.toString('hex');
    }

    const result = await argon2(password, saltHex, {
        iterations: 2,
        memory: 64 * 1024,
        parallelism: 1,
        hashLength: 32,
        mode: 'argon2id',
        saltEncoding: 'hex'
    });

    const keyMaterial = Buffer.from(result.rawHash, 'hex');

    return {
        key: keyMaterial,
        saltBase64: saltBuf.toString('base64')
    };
}

export async function generateRsaKeyPair() {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
        }, (err, publicKey, privateKey) => {
            if (err) reject(err);
            else resolve({ publicKey, privateKey });
        });
    });
}

export async function exportKeyToBase64(keyObj, isPrivate = false) {
    // Attempt JWK export. If quick-crypto doesn't support it, this will throw.
    const jwk = keyObj.export({ format: 'jwk' });
    return Buffer.from(JSON.stringify(jwk)).toString('base64');
}

export async function importKeyFromBase64(b64, algName = "RSA-OAEP", isPrivate = false) {
    const jwk = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    if (isPrivate) {
        return crypto.createPrivateKey({ key: jwk, format: 'jwk' });
    } else {
        return crypto.createPublicKey({ key: jwk, format: 'jwk' });
    }
}

export async function encryptSymmetric(keyBuffer, plaintextStr) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(KEY_ALG, keyBuffer, iv);
    let encrypted = cipher.update(plaintextStr, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // WebCrypto appends the auth tag to the ciphertext
    const ciphertext = Buffer.concat([encrypted, authTag]);

    return {
        ciphertext: ciphertext.toString('base64'),
        iv: iv.toString('base64')
    };
}

export async function decryptSymmetric(keyBuffer, ciphertextBase64, ivBase64) {
    const iv = Buffer.from(ivBase64, 'base64');
    const ciphertextWithTag = Buffer.from(ciphertextBase64, 'base64');
    
    // WebCrypto appends 16-byte auth tag at the end
    const ciphertext = ciphertextWithTag.slice(0, -16);
    const authTag = ciphertextWithTag.slice(-16);

    const decipher = crypto.createDecipheriv(KEY_ALG, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
}

export async function generateVaultDek() {
    return crypto.randomBytes(32); // 256 bits for AES-256
}

export async function wrapKey(dekBuffer, rsaPublicKey) {
    const wrapped = crypto.publicEncrypt({
        key: rsaPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, dekBuffer);
    return wrapped.toString('base64');
}

export async function unwrapKey(wrappedB64, rsaPrivateKey) {
    const wrapped = Buffer.from(wrappedB64, 'base64');
    const unwrapped = crypto.privateDecrypt({
        key: rsaPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, wrapped);
    return unwrapped;
}

export async function decryptVaultContent(vault, user, masterPassword) {
    try {
        const { key: kek } = await deriveKeyFromPassword(masterPassword, user.salt);
        const [ivB64, ciphertextB64] = user.encryptedPrivateKey.split(":");
        const privateKeyB64 = await decryptSymmetric(kek, ciphertextB64, ivB64);
        const rsaPrivateKey = await importKeyFromBase64(privateKeyB64, "RSA-OAEP", true);
        const dek = await unwrapKey(vault.encryptedDekOwner, rsaPrivateKey);
        return await decryptSymmetric(dek, vault.ciphertext, vault.iv);
    } catch (e) {
        console.error("Decryption failed:", e);
        return "Failed to decrypt content. Incorrect Master Password or corrupted data.";
    }
}

export async function getDekFromVault(vault, user, masterPassword) {
    const { key: kek } = await deriveKeyFromPassword(masterPassword, user.salt);
    const [ivB64, ciphertextB64] = user.encryptedPrivateKey.split(":");
    const privateKeyB64 = await decryptSymmetric(kek, ciphertextB64, ivB64);
    const rsaPrivateKey = await importKeyFromBase64(privateKeyB64, "RSA-OAEP", true);
    return await unwrapKey(vault.encryptedDekOwner, rsaPrivateKey);
}

export async function wrapDekWithPin(dekBuffer, sharingPin) {
    const { key: sharingKEK, saltBase64 } = await deriveKeyFromPassword(sharingPin, null);
    
    // Instead of raw export like WebCrypto, DEK is already a Buffer here
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(KEY_ALG, sharingKEK, iv);
    let encryptedRawDek = cipher.update(dekBuffer);
    encryptedRawDek = Buffer.concat([encryptedRawDek, cipher.final()]);
    const authTag = cipher.getAuthTag();
    const finalEncrypted = Buffer.concat([encryptedRawDek, authTag]);

    return `${iv.toString('base64')}:${saltBase64}:${finalEncrypted.toString('base64')}`;
}

export async function unwrapDekWithPin(encryptedDekPayload, sharingPin) {
    const [ivB64, saltB64, ciphertextB64] = encryptedDekPayload.split(':');
    const { key: sharingKEK } = await deriveKeyFromPassword(sharingPin, saltB64);
    
    const iv = Buffer.from(ivB64, 'base64');
    const ciphertextWithTag = Buffer.from(ciphertextB64, 'base64');
    const ciphertext = ciphertextWithTag.slice(0, -16);
    const authTag = ciphertextWithTag.slice(-16);
    
    const decipher = crypto.createDecipheriv(KEY_ALG, sharingKEK, iv);
    decipher.setAuthTag(authTag);
    let decryptedRawDek = decipher.update(ciphertext);
    decryptedRawDek = Buffer.concat([decryptedRawDek, decipher.final()]);
    
    return decryptedRawDek;
}
