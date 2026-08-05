"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, User, Plus, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [passkeys, setPasskeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchPasskeys = async () => {
        try {
            const res = await api.get("/auth/passkeys");
            setPasskeys(res.data);
        } catch (err) {
            console.error("Failed to fetch passkeys:", err);
            setError("Failed to load passkeys");
        }
    };

    useEffect(() => {
        if (user && !authLoading) {
            fetchPasskeys();
        }
    }, [user, authLoading]);

    const handleAddPasskey = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const optRes = await api.get("/auth/webauthn/add-passkey-options");
            const options = optRes.data;
            
            const attResp = await startRegistration(options);
            
            await api.post("/auth/webauthn/add-passkey-verify", { body: attResp });
            
            setSuccess("Passkey registered successfully!");
            fetchPasskeys();
        } catch (err) {
            console.error("Add Passkey Error:", err);
            setError(err.response?.data?.message || err.message || "Failed to register passkey");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="min-h-screen bg-bg text-ink-muted p-8 pt-24 text-center font-medium">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-bg text-ink p-8 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl bg-surface border border-emerald-200 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald to-transparent"></div>
                    
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-emerald-soft rounded-xl text-emerald">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-semibold text-forest">Your Profile</h1>
                            <p className="text-ink-muted">Manage your account settings and security.</p>
                        </div>
                    </div>

                    <div className="bg-bg p-6 rounded-xl border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <p className="text-sm text-ink-muted mb-1">Email Address</p>
                            <p className="text-lg font-medium text-ink">{user.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-emerald bg-emerald-soft px-4 py-2 rounded-lg text-sm font-medium">
                            <Key size={16} />
                            <span>E2EE Keys Configured</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-2xl bg-surface border border-emerald-200 shadow-sm relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <Fingerprint className="text-emerald" size={28} />
                            <h2 className="text-xl font-display font-semibold text-forest">Biometric Passkeys</h2>
                        </div>
                        <button
                            onClick={handleAddPasskey}
                            disabled={loading}
                            className="flex items-center space-x-2 bg-forest hover:bg-ink text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Add New Device</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-md text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 bg-emerald-soft border border-emerald text-emerald px-4 py-3 rounded-md text-sm font-medium">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        {passkeys.length === 0 ? (
                            <p className="text-ink-muted text-center py-8 bg-bg rounded-xl border border-emerald-100">
                                No passkeys found. Add one to secure your account.
                            </p>
                        ) : (
                            passkeys.map((pk, idx) => (
                                <div key={pk.id} className="flex items-center justify-between p-4 bg-bg rounded-xl border border-emerald-100 hover:border-emerald/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-emerald-soft rounded-lg text-emerald">
                                            <Fingerprint size={20} />
                                        </div>
                                        <div>
                                            <p className="text-ink font-medium">Passkey {idx + 1}</p>
                                            <p className="text-sm text-ink-muted">Added on {new Date(pk.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-ink-muted px-3 py-1 bg-surface rounded-full border border-emerald-200 font-medium">
                                        Active
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
