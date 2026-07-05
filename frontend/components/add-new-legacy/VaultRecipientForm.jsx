"use client";
import React, { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#1a1d24] p-6 rounded-xl"
    >
      <div>
        <label className="block text-white">Select Trusted Contact</label>
        <select
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-600"
        >
          <option value="">-- Select Contact --</option>
          {trustedContacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name} ({contact.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-white">Custom Message (optional)</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-600"
        />
      </div>

      <button
        type="submit"
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Assign Vault
      </button>
    </form>
  );
};

export default VaultRecipientForm;
