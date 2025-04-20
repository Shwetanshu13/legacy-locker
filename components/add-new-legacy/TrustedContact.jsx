"use client";
import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

// Define animations consistent with Password component
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2 },
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
        <div className="flex flex-col md:flex-row bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 shadow-lg">
            <motion.div
                className="p-10 md:w-2/5 flex flex-col justify-center"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
            >
                <motion.h2
                    className="text-white text-3xl font-bold mb-4"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    Add a Trusted Contact to <br /> Your Legacy
                </motion.h2>
                <motion.p
                    className="text-gray-400 text-center"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                >
                    Secure your digital assets for the future
                </motion.p>
            </motion.div>

            <div className="p-8 md:p-12 md:w-3/5 bg-gray-900/50 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                        className="relative"
                    >
                        <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1rem",
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
                        className="flex flex-col sm:flex-row gap-4 mt-4"
                    >
                        <button
                            type="submit"
                            className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition flex-1"
                        >
                            Save Contact
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="border border-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition flex-1"
                        >
                            Reset Form
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}

export default function TrustedContact({ userId }) {
    const [loading, setLoading] = useState(false);
    const { user, isLoaded } = useUser();

    const handleAddContact = async (contact) => {
        try {
            setLoading(true);
            console.log(user);
            const res = await axios.post("/api/add/add-trustedContact", {
                clerkUserId: user.id,
                ...contact,
            });

            console.log("Response:", res.data);
            alert("Trusted Contact added successfully.");
        } catch (err) {
            console.error("Axios error:", err.response?.data || err.message);
            alert(
                err.response?.data?.message || "Error adding trusted contact."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="relative bg-black text-white overflow-x-hidden min-h-screen flex items-center justify-center p-4">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -z-10" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-10 blur-2xl -z-10" />

            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl"
            >
                <TrustedContactForm onSubmit={handleAddContact} />
            </motion.div>
        </div>
    );
}
