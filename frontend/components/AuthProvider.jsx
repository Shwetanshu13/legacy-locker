"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [masterPassword, setMasterPassword] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setToken(token);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (newToken, userData, password) => {
        setToken(newToken);
        setUser(userData);
        setMasterPassword(password);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/home"); // Redirect to dashboard or home
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setMasterPassword(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, token, masterPassword, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
