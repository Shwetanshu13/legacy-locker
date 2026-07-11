"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { unwrapDekWithPin, decryptSymmetric } from "@/utils/crypto";

export default function UnlockLegacy() {
    const params = useParams();
    const vaultId = params?.vaultId as string;

    const [pin, setPin] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | unlocked | error
    const [errorMessage, setErrorMessage] = useState("");
    const [vaultData, setVaultData] = useState<any>(null);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin) return;

        setStatus("loading");
        setErrorMessage("");

        try {
            // Fetch the public payload from backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaults/unlock/${vaultId}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to fetch vault data");
            }
            const { data: payload } = await res.json();

            // Perform decryption
            // 1. Unwrap DEK using PIN
            const dek = await unwrapDekWithPin(payload.encryptedDekNominee, pin);

            // 2. Decrypt ciphertext using DEK
            const decryptedContent = await decryptSymmetric(dek, payload.ciphertext, payload.iv);

            setVaultData({
                title: payload.title,
                customMessage: payload.customMessage,
                content: decryptedContent,
            });
            setStatus("unlocked");
        } catch (error: any) {
            console.error("Unlock error:", error);
            setStatus("error");
            setErrorMessage(error.message || "Incorrect PIN or corrupted data.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-2">Legacy Access</h2>
                    <p className="text-gray-400 mb-8">
                        A digital vault has been released to you. Enter the 6-digit Sharing PIN provided by the owner to decrypt it.
                    </p>

                    {status === "unlocked" && vaultData ? (
                        <div className="space-y-6">
                            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                                <h3 className="text-green-400 font-semibold mb-2">Decryption Successful</h3>
                                <p className="text-sm text-green-200">The vault has been decrypted locally on your device.</p>
                            </div>

                            <div>
                                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Vault Title</h4>
                                <p className="text-xl font-medium">{vaultData.title}</p>
                            </div>

                            {vaultData.customMessage && (
                                <div>
                                    <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Message for You</h4>
                                    <p className="text-gray-300 italic">"{vaultData.customMessage}"</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Vault Contents</h4>
                                <div className="bg-black p-4 rounded border border-gray-800 text-gray-200 whitespace-pre-wrap font-mono text-sm">
                                    {vaultData.content}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUnlock} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Sharing PIN</label>
                                <input
                                    type="text"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter PIN"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono tracking-widest text-center text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>

                            {status === "error" && (
                                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {status === "loading" ? "Decrypting..." : "Decrypt Vault"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
