import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { generateVaultDek, encryptSymmetric, wrapKey, importKeyFromBase64 } from '../../utils/crypto';

export default function NewVaultScreen() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const router = useRouter();
    const { user } = useAuth();

    const handleCreateVault = async () => {
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // 1. Generate DEK
            const dek = await generateVaultDek();
            
            // 2. Encrypt Content
            const { ciphertext, iv } = await encryptSymmetric(dek, content);
            
            // 3. Wrap DEK with User's Public Key
            const rsaPublicKey = await importKeyFromBase64(user.publicKey, "RSA-OAEP", false);
            const encryptedDekOwner = await wrapKey(dek, rsaPublicKey);
            
            // 4. Send to backend
            await api.post("/vaults", {
                title,
                ciphertext,
                iv,
                encryptedDekOwner
            });
            
            router.back();
        } catch (err) {
            console.error("Vault creation error:", err);
            setError("Failed to create vault securely.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 p-4">
            <View className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md self-center border border-gray-100">
                <Text className="text-2xl font-bold text-slate-800 mb-6">Create New Vault</Text>
                
                {error ? (
                    <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                        <Text className="text-red-600 text-sm">{error}</Text>
                    </View>
                ) : null}

                <Text className="text-slate-600 mb-2 font-medium">Vault Title</Text>
                <TextInput
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 focus:border-teal-500 focus:bg-white"
                    placeholder="E.g., Bank Credentials, Final Will"
                    value={title}
                    onChangeText={setTitle}
                />
                
                <Text className="text-slate-600 mb-2 font-medium">Secret Content</Text>
                <TextInput
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-slate-800 focus:border-teal-500 focus:bg-white"
                    placeholder="Enter the sensitive information here. It will be encrypted locally on your device."
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                />
                
                <TouchableOpacity 
                    onPress={handleCreateVault}
                    disabled={loading}
                    className={`w-full p-4 rounded-lg items-center flex-row justify-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg mr-2">🔒 Encrypt & Save Vault</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}
