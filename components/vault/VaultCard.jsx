"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VaultCard({ vault, selectedId, onSelect, onDelete }) {
  const router = useRouter();

  const handleManualTrigger = async () => {
    try {
      await axios.post("/api/vault/manual-trigger", { vaultId: vault.id });
      alert("Manual trigger email sent successfully.");
    } catch (err) {
      console.error(err);
      alert("Error triggering manual email.");
    }
  };

  return (
    <motion.div
      key={vault.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border-b border-gray-700 pb-6"
    >
      <div
        className="flex items-center cursor-pointer"
        onClick={() => onSelect(vault.id)}
      >
        <h3 className="text-lg font-semibold text-white hover:text-gray-300">
          {vault.title}
        </h3>
        <span className="ml-2 text-gray-400 text-sm">
          {selectedId === vault.id ? "▼" : "▶"}
        </span>
      </div>
      {selectedId === vault.id && (
        <div className="mt-4">
          <div className="bg-[#0c1119] rounded-lg p-4 mb-4 text-gray-300 whitespace-pre-wrap">
            {vault.content}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/edit/${vault.id}`)}
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(vault.id)}
              className="border border-white text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-black"
            >
              Delete
            </button>
            {vault.hasManualTrigger && (
              <button
                onClick={handleManualTrigger}
                className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-700"
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
