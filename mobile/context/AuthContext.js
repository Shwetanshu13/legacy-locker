import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user, isInitialized) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) return;
        
        const inAuthGroup = segments[0] === '(auth)';
        
        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)/home');
        }
    }, [user, segments, isInitialized]);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // We also store the RSA private key in memory (never in storage, for security)
    const [rsaPrivateKey, setRsaPrivateKey] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('user');
                const token = await SecureStore.getItemAsync('token');
                
                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error loading user from SecureStore:", error);
            } finally {
                setIsInitialized(true);
            }
        };
        
        loadUser();
    }, []);

    useProtectedRoute(user, isInitialized);

    const login = async (userData, token) => {
        await SecureStore.setItemAsync('user', JSON.stringify(userData));
        await SecureStore.setItemAsync('token', token);
        setUser(userData);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('token');
        setUser(null);
        setRsaPrivateKey(null);
    };

    const setKey = (key) => {
        setRsaPrivateKey(key);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, rsaPrivateKey, setKey, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
}
