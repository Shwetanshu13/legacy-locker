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

export function useAuthLogic() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [masterPassword, setMasterPassword] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Temporary states during the multi-step login
    const [tempUser, setTempUser] = useState(null);
    const [tempToken, setTempToken] = useState(null);
    
    const { login } = useAuth();

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/send-otp", { email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/verify-otp", { email, otp });
            const user = response.data.user;
            const token = response.data.token;
            
            setTempUser(user);
            setTempToken(token);
            
            // Move to Master Password step
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to verify OTP");
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
        otp, setOtp,
        masterPassword, setMasterPassword,
        step, resetStep,
        error, loading,
        tempUser,
        handleSendOtp,
        handleVerifyOtp,
        handleMasterPassword
    };
}
