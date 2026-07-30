import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
    const [vaults, setVaults] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchVaults();
    }, []);

    const fetchVaults = async () => {
        try {
            const res = await api.get('/vaults');
            setVaults(res.data);
        } catch (error) {
            console.error("Failed to fetch vaults:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 p-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-slate-800">My Vaults</Text>
                <TouchableOpacity 
                    onPress={() => router.push('/vaults/new')}
                    className="bg-teal-600 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-bold">+ New Vault</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0d9488" />
            ) : vaults.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-slate-500 text-lg">No vaults created yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={vaults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => router.push(`/vaults/${item.id}`)}
                            className="bg-white p-5 rounded-xl shadow-sm mb-4 border border-gray-100 flex-row justify-between items-center"
                        >
                            <View>
                                <Text className="text-lg font-bold text-slate-800">{item.title}</Text>
                                <Text className="text-slate-500 mt-1 text-sm">
                                    Created: {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text className="text-xl">➔</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
