import { useState } from "react";
import axios from "axios";
import api from "@/utils/api";
import { useAuth } from "@/components/AuthProvider";
import { 
    deriveKeyFromPassword, 
    generateRsaKeyPair, 
    encryptSymmetric, 
    decryptSymmetric, 
    exportKeyToBase64 
} from "@/utils/crypto";
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export function useAuthLogic() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [masterPassword, setMasterPassword] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [step, setStep] = useState(1); // 1 = Login/Signup, 2 = Master Password
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Temporary states during the multi-step login
    const [tempUser, setTempUser] = useState(null);
    const [tempToken, setTempToken] = useState(null);
    
    const { login } = useAuth();

    const handleAuth = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
            const response = await api.post(endpoint, { email, password });
            
            const user = response.data.user;
            const token = response.data.token;
            
            setTempUser(user);
            setTempToken(token);
            
            // Move to Master Password step
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isLoginMode ? 'login' : 'register'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricAuth = async () => {
        if (!email) {
            setError("Please enter your email first");
            return;
        }
        setError("");
        setLoading(true);

        try {
            if (isLoginMode) {
                // Login Flow
                const optRes = await api.get(`/auth/webauthn/login-options?email=${encodeURIComponent(email)}`);
                const options = optRes.data;
                
                const asseResp = await startAuthentication(options);
                
                const verifyRes = await api.post("/auth/webauthn/login-verify", { email, body: asseResp });
                
                setTempUser(verifyRes.data.user);
                setTempToken(verifyRes.data.token);
                setStep(2);
            } else {
                // Register Flow
                const optRes = await api.get(`/auth/webauthn/register-options?email=${encodeURIComponent(email)}`);
                const options = optRes.data;
                
                const attResp = await startRegistration(options);
                
                const verifyRes = await api.post("/auth/webauthn/register-verify", { email, body: attResp });
                
                setTempUser(verifyRes.data.user);
                setTempToken(verifyRes.data.token);
                setStep(2);
            }
        } catch (err) {
            console.error('Biometric Auth Error:', err);
            setError(err.response?.data?.message || err.message || "Failed biometric authentication");
        } finally {
            setLoading(false);
        }
    };

    const handleMasterPassword = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!tempUser.publicKey) {
                // SETUP MODE
                const { key: kek, saltBase64 } = await deriveKeyFromPassword(masterPassword);
                const rsaKeypair = await generateRsaKeyPair();
                const publicKeyB64 = await exportKeyToBase64(rsaKeypair.publicKey);
                const privateKeyB64 = await exportKeyToBase64(rsaKeypair.privateKey, true);
                const { ciphertext, iv } = await encryptSymmetric(kek, privateKeyB64);
                const encryptedPrivateKey = `${iv}:${ciphertext}`;

                await api.post("/auth/setup-keys", 
                    { publicKey: publicKeyB64, encryptedPrivateKey, salt: saltBase64 },
                    { headers: { Authorization: `Bearer ${tempToken}` } }
                );

                tempUser.publicKey = publicKeyB64;
                tempUser.encryptedPrivateKey = encryptedPrivateKey;
                tempUser.salt = saltBase64;
            }

            // UNLOCK MODE
            const { key: kek } = await deriveKeyFromPassword(masterPassword, tempUser.salt);
            const [ivB64, ciphertextB64] = tempUser.encryptedPrivateKey.split(":");
            
            try {
                // Verify correctness by attempting to decrypt the private key
                await decryptSymmetric(kek, ciphertextB64, ivB64);
                login(tempToken, tempUser, masterPassword); 
            } catch (decErr) {
                throw new Error("Invalid Master Password");
            }
        } catch (err) {
            setError(err.message || "Failed to process Master Password");
        } finally {
            setLoading(false);
        }
    };

    const resetStep = (newStep) => {
        setStep(newStep);
        setError("");
    };

    return {
        email, setEmail,
        password, setPassword,
        masterPassword, setMasterPassword,
        isLoginMode, setIsLoginMode,
        step, resetStep,
        error, loading,
        tempUser,
        handleAuth,
        handleBiometricAuth,
        handleMasterPassword
    };
}
