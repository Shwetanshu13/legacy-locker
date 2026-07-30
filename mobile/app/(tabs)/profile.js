import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Passkey } from 'react-native-passkey';
import api from '../../utils/api';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const [addingPasskey, setAddingPasskey] = useState(false);

    const handleAddPasskey = async () => {
        setAddingPasskey(true);
        try {
            const optRes = await api.get(`/auth/webauthn/register-options?email=${encodeURIComponent(user.email)}`);
            const options = optRes.data;
            const attResp = await Passkey.register(options);
            await api.post("/auth/webauthn/register-verify", { email: user.email, body: attResp });
            
            Alert.alert("Success", "New passkey added to this device!");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", err.response?.data?.message || "Failed to register passkey");
        } finally {
            setAddingPasskey(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 p-6">
            <View className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100 items-center">
                <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-4">
                    <Text className="text-4xl">👤</Text>
                </View>
                <Text className="text-xl font-bold text-slate-800 mb-1">{user?.email}</Text>
                <Text className="text-slate-500 mb-4">Account Status: Active</Text>
                
                <TouchableOpacity 
                    onPress={logout}
                    className="bg-red-50 px-6 py-2 rounded-lg border border-red-100"
                >
                    <Text className="text-red-600 font-bold">Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                <Text className="text-lg font-bold text-slate-800 mb-2">Device Security</Text>
                <Text className="text-slate-500 mb-4 text-sm leading-6">
                    If this is a new device, you can register it for biometric access (Face ID / Touch ID) so you can easily log in later.
                </Text>
                <TouchableOpacity 
                    onPress={handleAddPasskey}
                    disabled={addingPasskey}
                    className={`w-full py-3 rounded-lg items-center flex-row justify-center ${addingPasskey ? 'bg-teal-400' : 'bg-teal-600'}`}
                >
                    {addingPasskey ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Add Passkey to this Device</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}
