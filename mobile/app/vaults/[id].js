import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { unwrapKey, decryptSymmetric, importKeyFromBase64 } from '../../utils/crypto';

export default function VaultDetailScreen() {
    const { id } = useLocalSearchParams();
    const [vault, setVault] = useState(null);
    const [decryptedContent, setDecryptedContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [decrypting, setDecrypting] = useState(false);
    const [error, setError] = useState("");
    
    const router = useRouter();
    const { rsaPrivateKey } = useAuth();

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const res = await api.get(`/vaults/${id}`);
                setVault(res.data);
            } catch (err) {
                setError("Failed to load vault details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVault();
    }, [id]);

    const handleDecrypt = async () => {
        if (!rsaPrivateKey) {
            setError("Your encryption key is not loaded. Please log in again.");
            return;
        }

        setDecrypting(true);
        setError("");

        try {
            // 1. Load private key
            const privateKeyObj = await importKeyFromBase64(rsaPrivateKey, "RSA-OAEP", true);
            
            // 2. Unwrap DEK
            const dek = await unwrapKey(vault.encryptedDekOwner, privateKeyObj);
            
            // 3. Decrypt Content
            const plaintext = await decryptSymmetric(dek, vault.ciphertext, vault.iv);
            
            setDecryptedContent(plaintext);
        } catch (err) {
            console.error("Decryption error:", err);
            setError("Failed to decrypt vault content. The data might be corrupted or keys are mismatched.");
        } finally {
            setDecrypting(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50">
                <ActivityIndicator size="large" color="#0d9488" />
            </View>
        );
    }

    if (error || !vault) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50 p-6">
                <Text className="text-red-600 text-lg text-center mb-4">{error || "Vault not found"}</Text>
                <TouchableOpacity onPress={() => router.back()} className="bg-slate-200 px-4 py-2 rounded-lg">
                    <Text className="text-slate-800">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-50 p-4">
            <View className="bg-white rounded-xl shadow-sm p-6 w-full max-w-lg self-center border border-gray-100 mb-6">
                <Text className="text-2xl font-bold text-slate-800 mb-2">{vault.title}</Text>
                <Text className="text-slate-500 mb-6">
                    Created on {new Date(vault.createdAt).toLocaleDateString()}
                </Text>

                {decryptedContent !== null ? (
                    <View className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                        <Text className="text-slate-800 font-mono text-base">{decryptedContent}</Text>
                    </View>
                ) : (
                    <View className="bg-slate-100 border border-slate-200 rounded-lg p-6 mb-6 items-center justify-center">
                        <Text className="text-4xl mb-2">🔒</Text>
                        <Text className="text-slate-600 text-center mb-4">
                            Content is End-to-End Encrypted. Only you can decrypt it.
                        </Text>
                        <TouchableOpacity 
                            onPress={handleDecrypt}
                            disabled={decrypting}
                            className={`w-full py-3 rounded-lg items-center flex-row justify-center ${decrypting ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {decrypting ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Decrypt Content</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
