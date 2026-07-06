"use client";
import Trigger from "@/components/add-new-legacy/Trigger";
import VaultRecipientForm from "@/components/add-new-legacy/VaultRecipientForm";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TriggerNow = () => {
  const params = useParams();
  const vaultId = params?.id as string;
  const router = useRouter();

  const { user } = useAuth();

  const [trustedContacts, setTrustedContacts] = useState([]);
  const [triggerSet, setTriggerSet] = useState(false);

  useEffect(() => {
    const getTrustedContacts = async () => {
      try {
        const res = await api.post("/trusted-contacts"); // Wait, we can hit the backend or just change to /trusted-contacts since the token specifies the user
        setTrustedContacts(res.data.contacts);
      } catch (error) {
        console.log(error);
      }
    };
    if (user?.id) getTrustedContacts();
  }, [user?.id]);

  const assignVault = async ({
    contactId,
    customMessage,
  }: {
    contactId: string;
    customMessage?: string;
  }) => {
    try {
      const res = await api.post("/vaults/add-recipient", {
        vaultId,
        contactId,
        customMessage,
      });
      console.log("Recipient assigned:", res.data);
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!triggerSet ? (
        <Trigger vaultId={vaultId} setTriggerSet={setTriggerSet} />
      ) : (
        <VaultRecipientForm
          vaultId={vaultId}
          trustedContacts={trustedContacts}
          onSuccess={assignVault}
        />
      )}
    </div>
  );
};

export default TriggerNow;
