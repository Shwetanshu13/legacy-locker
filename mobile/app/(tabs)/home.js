import React from 'react';
import useSWR from 'swr';
import Toast from 'react-native-toast-message';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const fetcher = url => api.get(url).then(res => res.data.vaults || res.data.data || res.data || []);

export default function HomeScreen() {
    const router = useRouter();
    const { data: vaults = [], error, isLoading: loading } = useSWR('/vaults', fetcher);

    if (error) {
        console.error("Failed to fetch vaults:", error);
        // Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch vaults' });
    }

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
