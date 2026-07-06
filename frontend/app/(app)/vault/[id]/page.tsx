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

  const { user, masterPassword } = useAuth();

  const [trustedContacts, setTrustedContacts] = useState([]);
  const [triggerData, setTriggerData] = useState<any>(null);
  const [sharingPin, setSharingPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTrustedContacts = async () => {
      try {
        const res = await api.get("/api/contacts");
        setTrustedContacts(res.data.contacts);
      } catch (error) {
        console.log(error);
      }
    };
    if (user?.id) getTrustedContacts();
  }, [user?.id]);

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const assignVaultAndTrigger = async ({
    contactId,
    customMessage,
  }: {
    contactId: string;
    customMessage?: string;
  }) => {
    if (!triggerData || !user || !masterPassword) {
        alert("Missing trigger data or master password. Please log in again.");
        return;
    }

    try {
      setLoading(true);
      // 1. Generate Sharing PIN
      const pin = generatePin();
      
      // 2. Fetch the vault
      const vaultRes = await api.get(`/api/vaults/${vaultId}`);
      const vault = vaultRes.data.data;
      
      if (!vault) {
          throw new Error("Vault not found.");
      }

      // 3. Extract DEK
      const dek = await getDekFromVault(vault, user, masterPassword);
      
      // 4. Wrap DEK with PIN
      const encryptedDekNominee = await wrapDekWithPin(dek, pin);

      // 5. Submit to backend
      const res = await api.post("/api/triggers/add", {
        vaultId,
        type: triggerData.type,
        triggerDate: triggerData.scheduledAt,
        inactivityDays: triggerData.inactivityDays,
        contactId,
        customMessage,
        encryptedDekNominee
      });

      console.log("Trigger and Recipient assigned:", res.data);
      setSharingPin(pin); // Show the PIN to the user
    } catch (error) {
      console.log(error);
      alert("Failed to setup trigger.");
    } finally {
      setLoading(false);
    }
  };

  if (sharingPin) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900/80 p-8 rounded-xl border border-green-500 shadow-2xl text-center max-w-lg w-full"
              >
                  <h2 className="text-3xl font-bold mb-4 text-green-400">Trigger Created!</h2>
                  <p className="text-gray-300 mb-6">
                      Your vault has been successfully linked to the trigger and recipient. 
                      Since we use End-to-End Encryption, we cannot read your vault. 
                      You must give this secure PIN to your nominee so they can decrypt it when the time comes.
                  </p>
                  <div className="bg-black p-6 rounded-lg border border-gray-700 mb-8">
                      <p className="text-sm text-gray-500 mb-2">SHARING PIN</p>
                      <p className="text-5xl font-mono tracking-widest text-white">{sharingPin}</p>
                  </div>
                  <button
                      onClick={() => router.push("/home")}
                      className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition"
                  >
                      I have saved the PIN securely
                  </button>
              </motion.div>
          </div>
      );
  }

  return (
    <div>
      {!triggerData ? (
        <Trigger vaultId={vaultId} setTriggerSet={setTriggerData} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold mb-8">Select Recipient</h2>
            {loading ? (
                <div className="text-xl">Encrypting payload and saving...</div>
            ) : (
                <div className="w-full max-w-xl">
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
