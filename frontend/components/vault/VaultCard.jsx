"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { decryptVaultContent } from "@/utils/crypto";

export default function VaultCard({ vault, selectedId, onSelect, onDelete }) {
  const router = useRouter();
  const [hasManualTrigger, setHasManualTrigger] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState("Decrypting...");
  const [passwordInput, setPasswordInput] = useState("");
  const { user, masterPassword, setMasterPassword } = useAuth();

  const handleManualTrigger = async () => {
    try {
      await api.post("/vault/manual-trigger", {
        vaultId: vault.id,
        clerkUserId: user.id,
      });
      alert("Manual trigger email sent successfully.");
    } catch (err) {
      console.error(err);
      alert("Error triggering manual email.");
    }
  };

  useEffect(() => {
    const checkManualTrigger = async () => {
      // The backend doesn't have this endpoint yet, avoiding 404s
      setHasManualTrigger(false);
    };
    checkManualTrigger();
  }, [vault.id]);

  useEffect(() => {
    if (selectedId === vault.id) {
        if (!masterPassword || !user) {
            return;
        }
        decryptVaultContent(vault, user, masterPassword).then(content => {
            setDecryptedContent(content);
        });
    }
  }, [selectedId, vault.id, vault, user, masterPassword]);

  if (!user) return null;

  return (
    <motion.div
      key={vault.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="border border-gray-700 bg-[#0d1117] rounded-xl px-5 py-4 transition hover:shadow-md"
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => onSelect(vault.id)}
      >
        <h3 className="text-xl font-semibold text-white hover:text-gray-300 transition">
          {vault.title}
        </h3>
        <span className="ml-2 text-gray-400 text-sm">
          {selectedId === vault.id ? "▼" : "▶"}
        </span>
      </div>

      {selectedId === vault.id && (
        <div className="mt-4 space-y-4">
          <div className="bg-[#0c1119] rounded-lg p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap border border-gray-800">
            {!masterPassword ? (
              <div className="flex flex-col gap-3">
                <p className="text-red-400 font-medium">Master Password missing. Please enter it to decrypt.</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter Master Password"
                    className="flex-1 max-w-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button 
                    onClick={() => {
                        if (passwordInput) setMasterPassword(passwordInput);
                    }}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-md font-medium hover:bg-cyan-500 transition"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              decryptedContent
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push(`/edit/${vault.id}`)}
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
              Edit
            </button>
            <button
              onClick={() => router.push(`/vault/${vault.id}`)}
              className="bg-cyan-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-cyan-500 transition"
            >
              Manage Triggers
            </button>
            <button
              onClick={() => onDelete(vault.id)}
              className="border border-white text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition"
            >
              Delete
            </button>
            {hasManualTrigger && (
              <button
                onClick={handleManualTrigger}
                className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition"
              >
                Manual Trigger
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
