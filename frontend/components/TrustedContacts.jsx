"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/utils/animations";
import { useContacts } from "@/hooks/useContacts";

export default function TrustedContacts({ userId }) {
    const { contacts, loading, error } = useContacts(userId, true);

    if (loading)
        return (
            <div className="text-center mt-4 text-ink-muted text-sm font-medium">
                Loading contacts...
            </div>
        );
    if (error)
        return (
            <div className="text-center mt-4 text-danger text-sm font-medium">{error}</div>
        );

    return (
        <div className="w-full px-4 pt-8 max-w-6xl mx-auto">
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full"
            >
                <h3 className="text-2xl font-display font-semibold mb-6 text-forest border-b border-emerald-100 pb-2">
                    Saved Trusted Contacts
                </h3>

                {contacts.length === 0 ? (
                    <p className="text-ink-muted text-sm">
                        No trusted contacts found.
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={contact.id}
                                className="p-6 bg-surface border border-emerald-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald transition h-full flex flex-col justify-between"
                                variants={fadeUp}
                                custom={index + 1}
                                initial="hidden"
                                animate="visible"
                            >
                                <div>
                                    <h4 className="text-lg font-display font-semibold text-ink mb-2">
                                        {contact.name}
                                    </h4>
                                    <p className="text-ink text-sm mb-1">
                                        <span className="text-emerald mr-2">📞</span> {contact.phone || "Not provided"}
                                    </p>
                                    <p className="text-ink text-sm">
                                        <span className="text-emerald mr-2">📧</span> {contact.email}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
