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
    const [relationship, setRelationship] = useState("Private");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, relationship });
        setName("");
        setEmail("");
        setRelationship("Private");
    };

    const handleReset = () => {
        setName("");
        setEmail("");
        setRelationship("Private");
    };

    return (
        <div className="flex flex-col md:flex-row bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-200 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
            
            <motion.div
                className="p-10 md:w-2/5 flex flex-col justify-center relative overflow-hidden bg-white/60"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
            >
                <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <motion.h2
                        className="text-emerald-950 text-3xl font-bold mb-4 tracking-tight"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                    >
                        Add a Trusted Contact
                    </motion.h2>
                    <motion.p
                        className="text-emerald-700"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        Define who receives your digital legacy when the time comes.
                    </motion.p>
                </div>
            </motion.div>

            <div className="p-8 md:p-12 md:w-3/5 bg-white/30">
                <button 
                    onClick={() => window.history.back()} 
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mb-6 transition-colors font-medium text-sm"
                    type="button"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                        <label className="block text-emerald-700 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="nominee@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
                        />
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                        <label className="block text-emerald-700 text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
                        />
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="relative">
                        <label className="block text-emerald-700 text-sm font-medium mb-2">Relationship</label>
                        <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full px-4 py-3 bg-white/80 border border-emerald-300 rounded-lg text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none shadow-inner"
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 1rem center",
                                backgroundSize: "1.2rem",
                            }}
                        >
                            <option value="Private">Private</option>
                            <option value="Family">Family</option>
                            <option value="Friend">Friend</option>
                            <option value="Colleague">Colleague</option>
                            <option value="Other">Other</option>
                        </select>
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
                            className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-colors flex-1 shadow-lg shadow-emerald-600/20"
                        >
                            Save Contact
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-emerald-100/50 text-emerald-900 border border-emerald-300 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-emerald-950 transition-colors flex-1"
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
        <div className="bg-emerald-50 text-emerald-950 overflow-x-hidden min-h-screen flex items-center justify-center p-6 relative">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl z-10"
            >
                <TrustedContactForm onSubmit={handleAddContact} />
            </motion.div>
        </div>
    );
}
