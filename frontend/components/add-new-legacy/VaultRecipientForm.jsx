"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const VaultRecipientForm = ({ vaultId, trustedContacts, onSuccess }) => {
  const [selectedContact, setSelectedContact] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedContact) return;

    onSuccess({
      contactId: selectedContact,
      customMessage,
    });

    setSelectedContact("");
    setCustomMessage("");
  };

  return (
    <motion.form
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Assign Recipient</h3>
        <p className="text-slate-400 text-sm">Select who will receive this vault when the trigger conditions are met.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Select Trusted Contact</label>
          <div className="relative">
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all appearance-none shadow-inner"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.2rem",
              }}
            >
              <option value="">-- Select Contact --</option>
              {trustedContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} ({contact.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Custom Message (optional)</label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="A final message to your nominee..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedContact}
          className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-600/20 mt-4"
        >
          Assign Vault & Generate PIN
        </button>
      </div>
    </motion.form>
  );
};

export default VaultRecipientForm;
