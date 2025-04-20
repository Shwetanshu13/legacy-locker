"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function VaultCard({ vault, selectedId, onSelect, onDelete }) {
  const router = useRouter();
  const [hasManualTrigger, setHasManualTrigger] = useState(false);
  const { user, isLoaded } = useUser();

  const handleManualTrigger = async () => {
    try {
      await axios.post("/api/vault/manual-trigger", {
        vaultId: vault.id,
        clerkUserId: user.id,
      });
      alert("Manual trigger email sent successfully.");
    } catch (err) {
      console.error(err);
      alert("Error triggering manual email.");
    }
  };

  const checkManualTrigger = async () => {
    try {
      const res = await axios.post("/api/vault/check-trigger/", {
        vaultId: vault.id,
      });

      if (res.data?.triggerType?.type === "manual") {
        setHasManualTrigger(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkManualTrigger();
  }, []);

  if (!isLoaded) return null;

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
            {vault.content}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push(`/edit/${vault.id}`)}
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
              Edit
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
