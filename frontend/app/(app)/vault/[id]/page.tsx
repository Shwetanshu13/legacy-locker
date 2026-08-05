"use client";
import Trigger from "@/components/add-new-legacy/Trigger";
import VaultRecipientForm from "@/components/add-new-legacy/VaultRecipientForm";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { getDekFromVault, wrapDekWithPin } from "@/utils/crypto";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TriggerNow = () => {
  const params = useParams();
  const vaultId = params?.id as string;
  const router = useRouter();

  const [trustedContacts, setTrustedContacts] = useState([]);
  const [triggerData, setTriggerData] = useState<any>(null);
  const [sharingPin, setSharingPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const { user, masterPassword, setMasterPassword } = useAuth();

  useEffect(() => {
    const getTrustedContacts = async () => {
      try {
        const res = await api.get("/contacts");
        setTrustedContacts(res.data.data || res.data.contacts);
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    };
    if (user?.id) getTrustedContacts();
  }, [user?.id]);

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const assignVaultAndTrigger = async (selectedRecipients: any[]) => {
    if (!triggerData || !user || !masterPassword) {
        alert("Missing trigger data or master password. Please log in again.");
        return;
    }

    try {
      setLoading(true);
      // 1. Generate one Sharing PIN for this vault
      const pin = generatePin();
      
      // 2. Fetch the vault
      const vaultRes = await api.get(`/vaults/${vaultId}`);
      const vault = vaultRes.data.data;
      
      if (!vault) {
          throw new Error("Vault not found.");
      }

      // 3. Extract DEK
      const dek = await getDekFromVault(vault, user, masterPassword);
      
      // 4. Wrap DEK with the Sharing PIN
      const encryptedDekNominee = await wrapDekWithPin(dek, pin);

      // 5. Prepare the recipients array for the backend
      const recipientsPayload = selectedRecipients.map(r => ({
          contactId: r.contactId,
          customMessage: r.customMessage,
          encryptedDekNominee: encryptedDekNominee
      }));

      // 6. Submit to backend
      const res = await api.post("/triggers/add", {
        vaultId,
        type: triggerData.type,
        triggerDate: triggerData.scheduledAt,
        inactivityDays: triggerData.inactivityDays,
        recipients: recipientsPayload
      });

      console.log("Trigger and Recipients assigned:", res.data);
      setSharingPin(pin); // Show the PIN to the user
    } catch (error) {
      console.error(error);
      alert("Failed to setup trigger.");
    } finally {
      setLoading(false);
    }
  };

  if (sharingPin) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-bg text-ink p-4">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface p-8 rounded-xl border border-emerald-200 shadow-sm text-center max-w-lg w-full relative overflow-hidden"
              >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald to-transparent"></div>
                  <h2 className="text-3xl font-display font-semibold mb-4 text-forest tracking-tight">Trigger Created</h2>
                  <p className="text-ink-muted mb-6">
                      Your vault has been successfully linked to the trigger and selected nominees. 
                      Since we use End-to-End Encryption, we cannot read your vault. 
                      You must give this secure PIN to your nominees so they can decrypt it when the time comes.
                  </p>
                  <div className="bg-bg p-6 rounded-lg border border-emerald-100 mb-8 shadow-inner">
                      <p className="text-sm text-emerald font-bold tracking-wider mb-2">SHARING PIN</p>
                      <p className="text-5xl font-mono tracking-widest text-ink">{sharingPin}</p>
                  </div>
                  <button
                      onClick={() => router.push("/home")}
                      className="bg-forest text-white px-8 py-3 rounded-md font-medium hover:bg-ink transition shadow-sm w-full"
                  >
                      I have saved the PIN securely
                  </button>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="bg-bg min-h-screen">
      {!masterPassword ? (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-surface border border-emerald-200 p-8 rounded-xl shadow-sm max-w-md w-full text-center">
                <h2 className="text-2xl font-display font-semibold text-forest mb-4">Master Password Required</h2>
                <p className="text-ink-muted mb-6 text-sm">
                    Your Master Password is required in memory to generate secure sharing PINs for your nominees. 
                    Please enter it below to continue setting up your trigger.
                </p>
                <div className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter Master Password"
                        className="w-full px-4 py-3 bg-surface border border-emerald-200 rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-emerald focus:border-emerald"
                    />
                    <button 
                        onClick={() => {
                            if (passwordInput) setMasterPassword(passwordInput);
                        }}
                        className="w-full bg-forest text-white font-medium py-3 rounded-md hover:bg-ink transition shadow-sm"
                    >
                        Unlock Session
                    </button>
                    <button
                        onClick={() => router.push("/home")}
                        className="text-emerald text-sm hover:text-forest transition mt-2 font-medium"
                    >
                        Cancel & Return Home
                    </button>
                </div>
            </div>
        </div>
      ) : !triggerData ? (
        <Trigger vaultId={vaultId} setTriggerSet={setTriggerData} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-display font-semibold mb-8 text-forest tracking-tight">Select Recipients</h2>
            {loading ? (
                <div className="text-xl text-emerald font-medium">Encrypting payload and saving...</div>
            ) : (
                <div className="w-full max-w-2xl">
                    <VaultRecipientForm
                        vaultId={vaultId}
                        trustedContacts={trustedContacts}
                        onSuccess={assignVaultAndTrigger}
                    />
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TriggerNow;
