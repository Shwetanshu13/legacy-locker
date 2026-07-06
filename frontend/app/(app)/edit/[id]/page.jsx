"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { decryptVaultContent, getDekFromVault, encryptSymmetric } from "@/utils/crypto";
import { fadeUp } from "@/utils/animations";

export default function EditContentPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const { user, masterPassword } = useAuth();
  const [vault, setVault] = useState(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    
    if (!masterPassword) {
        setError("Master Password missing. Please return to the dashboard and unlock your vaults first.");
        setLoading(false);
        return;
    }

    const fetchAndDecrypt = async () => {
      try {
        const res = await api.get(`/vaults/${id}`);
        const vaultData = res.data.data;
        setVault(vaultData);
        setTitle(vaultData.title);
        
        const decryptedContent = await decryptVaultContent(vaultData, user, masterPassword);
        setContent(decryptedContent);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load vault or incorrect Master Password.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndDecrypt();
  }, [id, user, masterPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Unwrap the DEK using the master password
      const dek = await getDekFromVault(vault, user, masterPassword);
      
      // 2. Encrypt the new content using the same DEK
      const { ciphertext, iv } = await encryptSymmetric(dek, content);
      
      // 3. Send update to server
      const updatedData = { title, ciphertext, iv };
      const res = await api.put(`/vaults/${id}`, updatedData);

      if (res.status === 200) {
        router.push("/home");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating content. Ensure your Master Password is correct.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400">Loading Vault...</div>;
  }

  if (error) {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-red-400 text-2xl font-bold mb-4">Access Error</h2>
            <p className="text-slate-400 mb-8 max-w-md">{error}</p>
            <button 
                onClick={() => router.push("/home")}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-500 transition"
            >
                Return to Dashboard
            </button>
        </div>
    );
  }

  return (
    <div className="relative bg-[#020617] text-slate-200 overflow-x-hidden min-h-screen flex items-center justify-center p-6 pt-24">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-2xl shadow-2xl relative z-10"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">Edit Vault</h1>
        <p className="text-slate-400 mb-8">Make changes to your securely encrypted data.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Vault Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Secret Content</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content"
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner font-mono text-sm resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-600 text-white px-6 py-3 rounded-xl hover:bg-cyan-500 transition shadow-lg shadow-cyan-600/20 flex-1 font-bold disabled:opacity-50"
            >
              {saving ? "Encrypting & Saving..." : "Encrypt & Save"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="bg-slate-800 text-slate-300 border border-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
