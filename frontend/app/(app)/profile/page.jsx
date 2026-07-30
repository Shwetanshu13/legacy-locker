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
        return <div className="min-h-screen bg-[#020617] text-slate-200 p-8 pt-24 text-center">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
                    
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
                            <p className="text-slate-400">Manage your account settings and security.</p>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Email Address</p>
                            <p className="text-lg font-medium text-white">{user.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-lg text-sm font-medium">
                            <Key size={16} />
                            <span>E2EE Keys Configured</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <Fingerprint className="text-cyan-400" size={28} />
                            <h2 className="text-xl font-bold text-white">Biometric Passkeys</h2>
                        </div>
                        <button
                            onClick={handleAddPasskey}
                            disabled={loading}
                            className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            <Plus size={18} />
                            <span>Add New Device</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        {passkeys.length === 0 ? (
                            <p className="text-slate-400 text-center py-8 bg-slate-950/30 rounded-xl border border-slate-800/30">
                                No passkeys found. Add one to secure your account.
                            </p>
                        ) : (
                            passkeys.map((pk, idx) => (
                                <div key={pk.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-cyan-500/30 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
                                            <Fingerprint size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Passkey {idx + 1}</p>
                                            <p className="text-sm text-slate-400">Added on {new Date(pk.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
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
