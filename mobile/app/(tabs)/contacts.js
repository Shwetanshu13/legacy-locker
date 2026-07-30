import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import api from '../../utils/api';

export default function ContactsScreen() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPin, setNewPin] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts');
            setContacts(res.data);
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async () => {
        if (!newEmail || !newPin) {
            Alert.alert("Error", "Please enter both email and a secure PIN");
            return;
        }

        setAdding(true);
        try {
            await api.post('/contacts', { contactEmail: newEmail, triggerType: 'inactivity', triggerValue: 30 });
            setNewEmail("");
            setNewPin("");
            fetchContacts();
            Alert.alert("Success", "Contact added. You can now assign vaults to them using the PIN.");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to add contact");
        } finally {
            setAdding(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 p-4">
            <View className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
                <Text className="text-lg font-bold text-slate-800 mb-4">Add Trusted Contact</Text>
                
                <TextInput
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 text-slate-800"
                    placeholder="Contact's Email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-slate-800"
                    placeholder="Sharing PIN (must be shared safely with them)"
                    value={newPin}
                    onChangeText={setNewPin}
                />

                <TouchableOpacity 
                    onPress={handleAddContact}
                    disabled={adding}
                    className={`w-full p-3 rounded-lg items-center ${adding ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                >
                    {adding ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Add Contact</Text>}
                </TouchableOpacity>
            </View>

            <Text className="text-2xl font-bold text-slate-800 mb-4">My Contacts</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4f46e5" />
            ) : contacts.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-slate-500">No trusted contacts added.</Text>
                </View>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className="bg-white p-5 rounded-xl shadow-sm mb-3 border border-gray-100">
                            <Text className="text-lg font-bold text-slate-800">{item.contactEmail}</Text>
                            <Text className="text-slate-500 mt-1">Status: {item.status}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
