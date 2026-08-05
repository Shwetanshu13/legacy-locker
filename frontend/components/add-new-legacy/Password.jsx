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
    <div className="bg-bg text-ink min-h-screen flex items-center justify-center p-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl z-10"
      >
        <div className="bg-surface rounded-xl overflow-hidden border border-emerald-200 shadow-sm flex flex-col md:flex-row">
          
          {/* Left Section */}
          <div className="p-10 md:w-2/5 flex flex-col justify-center bg-emerald-soft/30 border-r border-emerald-100">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-emerald-200 text-forest mb-6 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-forest font-display text-3xl font-semibold mb-4 tracking-tight">
                Add a Password to <br /> Your Legacy
              </h2>
              <p className="text-ink-muted">
                Secure your digital assets with AES-256 GCM encryption.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 md:p-12 md:w-3/5 bg-surface">
            <button 
              onClick={() => router.push("/home")} 
              className="text-emerald hover:text-forest flex items-center gap-2 mb-8 transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
              {/* Title */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <label className="block text-ink text-sm font-medium mb-2">Vault Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Primary Email Account"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-emerald-200 rounded-md text-ink placeholder-ink-muted focus:outline-none focus:ring-1 focus:border-emerald focus:ring-emerald transition-colors"
                />
              </motion.div>

              {/* Content */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <label className="block text-ink text-sm font-medium mb-2">Secret Content</label>
                <textarea
                  name="content"
                  placeholder="Username, password, or sensitive notes..."
                  required
                  rows={5}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-emerald-200 rounded-md text-ink placeholder-ink-muted focus:outline-none focus:ring-1 focus:border-emerald focus:ring-emerald transition-colors font-mono text-sm resize-none"
                />
              </motion.div>

              {/* Visibility dropdown */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="relative">
                <label className="block text-ink text-sm font-medium mb-2">Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-emerald-200 rounded-md text-ink focus:outline-none focus:ring-1 focus:border-emerald focus:ring-emerald transition-colors appearance-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23152420'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
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
                  className="bg-forest text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-ink transition-colors flex-1"
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
                  className="bg-surface text-ink border border-emerald-200 px-6 py-3 rounded-md text-sm font-medium hover:bg-emerald-soft transition-colors flex-1"
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
