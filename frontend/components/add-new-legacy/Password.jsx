"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/utils/animations";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api"; // configured axios instance
import { useRouter } from "next/navigation";
import { 
  generateVaultDek, 
  encryptSymmetric, 
  importKeyFromBase64, 
  wrapKey 
} from "@/utils/crypto";
import { ArrowLeft } from "lucide-react";

export default function Password() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "private",
  });


  const { user, token } = useAuth();
  const router = useRouter();

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!user || !user.publicKey) {
        console.error("User does not have an active session or missing public key.");
        return;
    }

    try {
      // E2EE: Generate DEK
      const dek = await generateVaultDek();
      
      // E2EE: Encrypt the vault content
      const { ciphertext, iv } = await encryptSymmetric(dek, formData.content);
      
      // E2EE: Import owner's public key and wrap the DEK
      const ownerPubKey = await importKeyFromBase64(user.publicKey, "RSA-OAEP", false);
      const encryptedDekOwner = await wrapKey(dek, ownerPubKey);

      const payload = {
        title: formData.title,
        ciphertext,
        iv,
        encryptedDekOwner,
        visibility: formData.visibility,
      };

      const response = await api.post("/vaults/add", payload);
      console.log("Vault added successfully:", response.data);

      if (response.status === 201) {
        // Redirect to trigger/nominee setup page for this vault
        router.push(`/vault/${response.data.data.id}`);
      }

    } catch (error) {
      console.error("Error adding vault:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="relative bg-emerald-50 text-emerald-950 overflow-x-hidden min-h-screen flex items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl z-10"
      >
        <div className="flex flex-col md:flex-row bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-200 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          
          {/* Left Section */}
          <motion.div
            className="p-10 md:w-2/5 flex flex-col justify-center relative overflow-hidden bg-white/60"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <motion.h2
                className="text-emerald-950 text-3xl font-bold mb-4 tracking-tight"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                Add a Password to <br /> Your Legacy
              </motion.h2>
              <motion.p
                className="text-emerald-700"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                Secure your digital assets with AES-256 GCM encryption.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Section */}
          <div className="p-8 md:p-12 md:w-3/5 bg-white/30">
            <button 
              onClick={() => router.push("/home")} 
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mb-6 transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
              {/* Title */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <label className="block text-emerald-700 text-sm font-medium mb-2">Vault Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Primary Email Account"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
                />
              </motion.div>

              {/* Content */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <label className="block text-emerald-700 text-sm font-medium mb-2">Secret Content</label>
                <textarea
                  name="content"
                  placeholder="Username, password, or sensitive notes..."
                  required
                  rows={5}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner font-mono text-sm resize-none"
                />
              </motion.div>

              {/* Visibility dropdown */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="relative">
                <label className="block text-emerald-700 text-sm font-medium mb-2">Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all appearance-none shadow-inner"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.2rem",
                  }}
                >
                  <option value="private">Private (Only You)</option>
                  <option value="trusted">Trusted Contacts</option>
                </select>
                {formData.visibility === 'private' && (
                  <p className="mt-2 text-xs text-amber-600 font-medium">
                    Note: Private vaults cannot have triggers attached to them. You must change visibility to 'Trusted Contacts' to add a trigger.
                  </p>
                )}
              </motion.div>

              {/* Buttons */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={5}
                className="flex flex-col sm:flex-row gap-4 mt-6"
              >
                <button
                  type="submit"
                  className="bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-cyan-500 transition-colors flex-1 shadow-lg shadow-cyan-600/20"
                >
                  Encrypt & Save
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      email: "",
                      title: "",
                      content: "",
                      visibility: "private",
                    })
                  }
                  className="bg-emerald-100/50 text-emerald-900 border border-emerald-300 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-emerald-950 transition-colors flex-1"
                >
                  Reset Form
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
