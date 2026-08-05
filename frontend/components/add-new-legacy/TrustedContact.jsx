"use client";
import React, { useState } from "react";
import api from "@/utils/api";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    }),
};

function TrustedContactForm({ onSubmit }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email });
        setName("");
        setEmail("");
    };

    const handleReset = () => {
        setName("");
        setEmail("");
    };

    return (
        <div className="flex flex-col md:flex-row bg-surface rounded-xl overflow-hidden border border-emerald-200 shadow-sm relative">
            <motion.div
                className="p-10 md:w-2/5 flex flex-col justify-center relative overflow-hidden bg-emerald-soft/30 border-r border-emerald-100"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
            >
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-emerald-200 text-forest mb-6 shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-forest text-3xl font-display font-semibold mb-4 tracking-tight">
                        Add a Trusted Contact
                    </h2>
                    <p className="text-ink-muted">
                        Define who receives your digital legacy when the time comes.
                    </p>
                </div>
            </motion.div>

            <div className="p-8 md:p-12 md:w-3/5 bg-surface">
                <button 
                    onClick={() => window.history.back()} 
                    className="text-emerald hover:text-forest flex items-center gap-2 mb-8 transition-colors font-medium text-sm"
                    type="button"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                        <label className="block text-ink text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="nominee@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-surface border border-emerald-200 rounded-md text-ink placeholder-ink-muted focus:outline-none focus:ring-1 focus:border-emerald focus:ring-emerald transition-colors"
                        />
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                        <label className="block text-ink text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-surface border border-emerald-200 rounded-md text-ink placeholder-ink-muted focus:outline-none focus:ring-1 focus:border-emerald focus:ring-emerald transition-colors"
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        className="flex flex-col sm:flex-row gap-4 mt-6"
                    >
                        <button
                            type="submit"
                            className="bg-forest text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-ink transition-colors flex-1"
                        >
                            Save Contact
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-surface text-ink border border-emerald-200 px-6 py-3 rounded-md text-sm font-medium hover:bg-emerald-soft transition-colors flex-1"
                        >
                            Reset
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}

export default function TrustedContact() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleAddContact = async (contact) => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await api.post("/contacts/add", {
                ...contact,
            });

            console.log("Response:", res.data);
            toast.success("Trusted Contact added successfully.");
        } catch (err) {
            console.error("Axios error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Error adding trusted contact.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-bg text-ink min-h-screen flex items-center justify-center p-6 relative">
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl z-10"
            >
                <TrustedContactForm onSubmit={handleAddContact} />
            </motion.div>
        </div>
    );
}
