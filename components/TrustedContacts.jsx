"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TrustedContacts({ clerkUserId }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.post("/api/get/trusted-contacts", {
          clerkUserId,
        });

        setContacts(response.data.contacts);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [clerkUserId]);

  if (loading)
    return (
      <div className="text-center mt-6 text-gray-600">Loading contacts...</div>
    );
  if (error)
    return <div className="text-center mt-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Trusted Contacts</h2>

      {contacts.length === 0 ? (
        <p className="text-gray-500">No trusted contacts found.</p>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold">{contact.name}</h3>
              <p className="text-gray-700">📞 {contact.phone}</p>
              <p className="text-gray-700">📧 {contact.email}</p>
              <p className="text-gray-500 italic">
                Relationship: {contact.relationship}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
