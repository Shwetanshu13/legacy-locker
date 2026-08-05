"use client";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { decryptVaultContent } from "@/utils/crypto";
import toast from "react-hot-toast";

export default function VaultCard({ vault, selectedId, onSelect, onDelete }) {
  const router = useRouter();
  const [decryptedContent, setDecryptedContent] = useState("Decrypting...");
  const [passwordInput, setPasswordInput] = useState("");
  const { user, masterPassword, setMasterPassword } = useAuth();
  
  // Animation states
  const sealControls = useAnimation();
  const ringControls = useAnimation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorState, setErrorState] = useState(false);

  const isSelected = selectedId === vault.id;
  const isAlreadyUnlocked = !!masterPassword && isSelected;

  useEffect(() => {
    if (isSelected) {
        if (!masterPassword || !user) {
            return;
        }
        setIsUnlocked(true);
        decryptVaultContent(vault, user, masterPassword).then(content => {
            setDecryptedContent(content);
        }).catch(err => {
            console.error(err);
            setDecryptedContent("Error decrypting. Bad key.");
        });
    } else {
        setIsUnlocked(false);
        setPasswordInput("");
        setErrorState(false);
    }
  }, [isSelected, vault, user, masterPassword]);

  const handleUnlockAttempt = async () => {
    if (!passwordInput) return;
    
    // Simulate checking password before attempting to set global master password
    try {
        await decryptVaultContent(vault, user, passwordInput);
        // If it succeeds:
        setMasterPassword(passwordInput);
        setIsUnlocked(true);
        sealControls.start({
            rotate: [0, -15, 90],
            transition: { duration: 0.25, ease: "easeOut" }
        });
    } catch (err) {
        // If it fails: flash danger
        setErrorState(true);
        ringControls.start({
            stroke: "var(--danger)",
            transition: { duration: 0.1 }
        }).then(() => {
            setTimeout(() => {
                setErrorState(false);
                ringControls.start({
                    stroke: "var(--emerald)",
                    transition: { duration: 0.3 }
                });
            }, 300);
        });
        toast.error("That password didn't match. Try again, or reset access from Settings.");
    }
  };

  // Calculate ring progress based on password length (capped at 16 chars for visual effect)
  const ringProgress = Math.min(passwordInput.length / 16, 1) * 100;
  const strokeDasharray = 125; // 2 * pi * r (approx r=20)
  const strokeDashoffset = strokeDasharray - (ringProgress / 100) * strokeDasharray;

  if (!user) return null;

  return (
    <motion.div
      key={vault.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(vault.id)}
      className={`relative bg-surface rounded-xl overflow-hidden transition-shadow hover:shadow-md cursor-pointer border ${isUnlocked ? 'border-emerald shadow-emerald/10' : 'border-emerald-200'} group`}
    >
      {/* Left edge accent */}
      <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-300 ${isUnlocked ? 'bg-emerald' : isSelected ? 'bg-brass' : 'bg-transparent group-hover:bg-emerald-200'}`} />

      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4 pl-3">
            {isUnlocked ? (
                <svg className="w-5 h-5 text-emerald flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-brass flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            <h3 className={`text-xl font-display font-semibold transition-colors duration-200 ${isUnlocked ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
                {vault.title}
            </h3>
        </div>
      </div>

      {isSelected && (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="px-6 pb-6 pl-9 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when interacting inside
        >
            {!masterPassword && !isUnlocked ? (
              <div className="flex flex-col items-center justify-center p-6 border border-emerald-100 rounded-lg bg-bg">
                {/* Signature Seal */}
                <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 44 44">
                        <circle cx="22" cy="22" r="20" fill="none" stroke="var(--emerald-soft)" strokeWidth="2" />
                        <motion.circle 
                            cx="22" cy="22" r="20" fill="none" 
                            stroke={errorState ? "var(--danger)" : "var(--emerald)"}
                            strokeWidth="2" 
                            strokeDasharray={strokeDasharray}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.1, ease: "linear" }}
                        />
                    </svg>
                    <motion.div animate={sealControls} className="text-brass">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>
                </div>
                
                <h4 className="text-ink font-semibold mb-2 text-center">Unlock Vault</h4>
                <p className="text-ink-muted text-sm text-center mb-6 max-w-xs">Enter your master password to unlock this vault.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                  <input
                    type="password"
                    id={`vault-pw-${vault.id}`}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleUnlockAttempt(); }}
                    placeholder="Master Password"
                    className={`flex-1 px-4 py-2 bg-surface border rounded-md text-ink focus:outline-none focus:ring-1 transition-colors ${errorState ? 'border-danger focus:ring-danger' : 'border-emerald-200 focus:border-emerald focus:ring-emerald'}`}
                  />
                  <button 
                    onClick={handleUnlockAttempt}
                    className="bg-forest text-white px-6 py-2 rounded-md font-medium hover:bg-ink transition flex-shrink-0"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="bg-surface rounded-lg p-5 text-ink text-sm leading-relaxed whitespace-pre-wrap border border-emerald-100 font-mono">
                    {decryptedContent}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push(`/edit/${vault.id}`)}
                    className="bg-surface text-ink border border-emerald-200 px-5 py-2 rounded-md text-sm font-medium hover:bg-emerald-soft transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/vault/${vault.id}`)}
                    className="bg-surface text-ink border border-emerald-200 px-5 py-2 rounded-md text-sm font-medium hover:bg-emerald-soft transition"
                  >
                    Manage Triggers
                  </button>
                  <button
                    onClick={() => onDelete(vault.id)}
                    className="text-danger hover:bg-danger/10 px-5 py-2 rounded-md text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
        </motion.div>
      )}
    </motion.div>
  );
}
