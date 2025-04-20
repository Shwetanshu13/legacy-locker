"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
    }),
};

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
            <div className="text-center mt-4 text-gray-400 text-sm">
                Loading contacts...
            </div>
        );
    if (error)
        return (
            <div className="text-center mt-4 text-red-500 text-sm">{error}</div>
        );

    return (
        <div className="w-full px-4 pt-8 max-w-6xl mx-auto">
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full"
            >
                <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
                    Saved Trusted Contacts
                </h3>

                {contacts.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No trusted contacts found.
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={contact.id}
                                className="p-4 bg-gray-900/70 border border-gray-700 rounded-lg shadow hover:shadow-md transition backdrop-blur"
                                variants={fadeUp}
                                custom={index + 1}
                                initial="hidden"
                                animate="visible"
                            >
                                <h4 className="text-lg font-semibold text-white mb-1">
                                    {contact.name}
                                </h4>
                                <p className="text-gray-300 text-sm">
                                    📞 {contact.phone}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    📧 {contact.email}
                                </p>
                                <p className="text-gray-500 italic text-xs mt-2">
                                    Relationship: {contact.relationship}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
