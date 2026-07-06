import argon2 from 'argon2-browser/dist/argon2-bundled.min.js';

// Constants
const SALT_SIZE = 16;
const KEY_ALG = 'AES-GCM';
const KEY_LENGTH = 256;

// Utility: Convert string to Uint8Array
export const strToAb = (str) => new TextEncoder().encode(str);
// Utility: Convert Uint8Array to string
export const abToStr = (buf) => new TextDecoder().decode(buf);
// Utility: Convert Uint8Array to Base64
export const abToBase64 = (buf) => {
    let binary = '';
    const bytes = new Uint8Array(buf);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

// Utility: Convert Base64 to Uint8Array
export const base64ToAb = (b64) => {
    try {
        // Remove any potential whitespace that could cause atob to fail
        let cleanB64 = b64.replace(/\s+/g, '');
        // Pad the string with '=' if length is not a multiple of 4
        while (cleanB64.length % 4 !== 0) {
            cleanB64 += '=';
        }
        const binary = atob(cleanB64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    } catch (err) {
        console.error("Failed to decode base64:", { original: b64, error: err.message });
        throw err;
    }
};

/**
 * Derives a Key Encryption Key (KEK) from a master password using Argon2id.
 */
export async function deriveKeyFromPassword(password, saltBase64) {
    const salt = saltBase64 ? base64ToAb(saltBase64) : window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
    
    // Perform Argon2id hash (memory intensive)
    const result = await argon2.hash({
        pass: password,
        salt: salt,
        time: 2,
        mem: 1024 * 64, // 64MB
        hashLen: 32, // 256 bits for AES-256
        type: argon2.ArgonType.Argon2id
    });

    const keyMaterial = result.hash;
    
    // Import raw key into WebCrypto API
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: KEY_ALG },
        false,
        ['encrypt', 'decrypt']
    );

    return {
        key: cryptoKey,
        saltBase64: abToBase64(salt)
    };
}

/**
 * Generates an RSA-OAEP key pair for wrapping the symmetric DEKs.
 */
export async function generateRsaKeyPair() {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    );
}

/**
 * Exports a crypto key to a Base64 string (JWK or SPKI/PKCS8).
 * For simplicity, we use JWK (JSON Web Key) format since it's easy to stringify and store.
 */
export async function exportKeyToBase64(key, isPrivate = false) {
    const jwk = await window.crypto.subtle.exportKey('jwk', key);
    return btoa(JSON.stringify(jwk));
}

/**
 * Imports a Base64 string back to a crypto key.
 */
export async function importKeyFromBase64(b64, algName = "RSA-OAEP", isPrivate = false) {
    const jwk = JSON.parse(atob(b64));
    delete jwk.key_ops; // Remove restricted usages so we can import with new ones
    return await window.crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: algName, hash: 'SHA-256' },
        true,
        isPrivate ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey']
    );
}

/**
 * Encrypts data using AES-GCM (used for encrypting the vault AND encrypting the private key)
 */
export async function encryptSymmetric(key, plaintextStr) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = strToAb(plaintextStr);

    const ciphertext = await window.crypto.subtle.encrypt(
        { name: KEY_ALG, iv: iv },
        key,
        encoded
    );

    return {
        ciphertext: abToBase64(new Uint8Array(ciphertext)),
        iv: abToBase64(iv)
    };
}

/**
 * Decrypts data using AES-GCM
 */
export async function decryptSymmetric(key, ciphertextBase64, ivBase64) {
    const iv = base64ToAb(ivBase64);
    const ciphertext = base64ToAb(ciphertextBase64);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: KEY_ALG, iv: iv },
        key,
        ciphertext
    );

    return abToStr(new Uint8Array(decrypted));
}

/**
 * Generates a random AES-256-GCM Data Encryption Key (DEK) for a vault.
 */
export async function generateVaultDek() {
    return await window.crypto.subtle.generateKey(
        { name: KEY_ALG, length: KEY_LENGTH },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Wraps (encrypts) a symmetric key using an RSA public key.
 */
export async function wrapKey(symmetricKeyToWrap, wrappingPublicKey) {
    const wrapped = await window.crypto.subtle.wrapKey(
        "raw",
        symmetricKeyToWrap,
        wrappingPublicKey,
        { name: "RSA-OAEP" }
    );
    return abToBase64(new Uint8Array(wrapped));
}

/**
 * Unwraps (decrypts) a symmetric key using an RSA private key.
 */
export async function unwrapKey(wrappedKeyBase64, unwrappingPrivateKey) {
    const wrapped = base64ToAb(wrappedKeyBase64);
    return await window.crypto.subtle.unwrapKey(
        "raw",
        wrapped,
        unwrappingPrivateKey,
        { name: "RSA-OAEP" },
        { name: KEY_ALG, length: KEY_LENGTH },
        true,
        ["encrypt", "decrypt"]
    );
}

/**
 * High-level utility to decrypt a vault given the user's master password, salt, and encrypted private key.
 */
export async function decryptVaultContent(vault, user, masterPassword) {
    try {
        // 1. Derive KEK
        const { key: kek } = await deriveKeyFromPassword(masterPassword, user.salt);
        
        // 2. Decrypt RSA Private Key
        const [ivB64, ciphertextB64] = user.encryptedPrivateKey.split(":");
        const privateKeyB64 = await decryptSymmetric(kek, ciphertextB64, ivB64);
        const rsaPrivateKey = await importKeyFromBase64(privateKeyB64, "RSA-OAEP", true);
        
        // 3. Unwrap the DEK
        const dek = await unwrapKey(vault.encryptedDekOwner, rsaPrivateKey);
        
        // 4. Decrypt vault content
        return await decryptSymmetric(dek, vault.ciphertext, vault.iv);
    } catch (e) {
        console.error("Decryption failed:", e);
        return "Failed to decrypt content. Incorrect Master Password or corrupted data.";
    }
}

/**
 * Extracts the DEK (CryptoKey) from a vault using the owner's master password.
 */
export async function getDekFromVault(vault, user, masterPassword) {
    // 1. Derive KEK
    const { key: kek } = await deriveKeyFromPassword(masterPassword, user.salt);
    
    // 2. Decrypt RSA Private Key
    const [ivB64, ciphertextB64] = user.encryptedPrivateKey.split(":");
    const privateKeyB64 = await decryptSymmetric(kek, ciphertextB64, ivB64);
    const rsaPrivateKey = await importKeyFromBase64(privateKeyB64, "RSA-OAEP", true);
    
    // 3. Unwrap the DEK
    return await unwrapKey(vault.encryptedDekOwner, rsaPrivateKey);
}

/**
 * Encrypts a DEK (CryptoKey) using a symmetric Sharing PIN.
 */
export async function wrapDekWithPin(dek, sharingPin) {
    const { key: sharingKEK, saltBase64 } = await deriveKeyFromPassword(sharingPin, null);
    
    const rawDek = await window.crypto.subtle.exportKey("raw", dek);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedRawDek = await window.crypto.subtle.encrypt(
        { name: KEY_ALG, iv: iv },
        sharingKEK,
        rawDek
    );

    return `${abToBase64(iv)}:${saltBase64}:${abToBase64(encryptedRawDek)}`;
}

/**
 * Decrypts a DEK (CryptoKey) using a symmetric Sharing PIN.
 */
export async function unwrapDekWithPin(encryptedDekPayload, sharingPin) {
    const [ivB64, saltB64, ciphertextB64] = encryptedDekPayload.split(':');
    const { key: sharingKEK } = await deriveKeyFromPassword(sharingPin, saltB64);
    
    const iv = base64ToAb(ivB64);
    const ciphertext = base64ToAb(ciphertextB64);
    
    const decryptedRawDek = await window.crypto.subtle.decrypt(
        { name: KEY_ALG, iv: iv },
        sharingKEK,
        ciphertext
    );
    
    return await window.crypto.subtle.importKey(
        'raw',
        decryptedRawDek,
        { name: KEY_ALG },
        true,
        ['encrypt', 'decrypt']
    );
}
