"use client";
import Trigger from "@/components/add-new-legacy/Trigger";
import VaultRecipientForm from "@/components/add-new-legacy/VaultRecipientForm";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TriggerNow = () => {
  const params = useParams();
  const vaultId = params?.id as string;
  const router = useRouter();

  const { user } = useUser();

  const [trustedContacts, setTrustedContacts] = useState([]);
  const [triggerSet, setTriggerSet] = useState(false);

  const getTrustedContacts = async () => {
    try {
      const res = await axios.post("/api/get/trusted-contacts", {
        clerkUserId: user.id,
      });
      setTrustedContacts(res.data.contacts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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
      const res = await axios.post("/api/add/add-vaultRecipient", {
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
