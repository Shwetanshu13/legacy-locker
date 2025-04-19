"use client";

import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2 },
    }),
};

export default function Landing() {
    return (
        <div className="relative bg-black text-white overflow-x-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -z-10" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-10 blur-2xl -z-10" />

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 gap-12">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 text-center md:text-left"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        Your Legacy, <br /> Locked & Secured
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-8">
                        Manage, protect and pass on your digital life with
                        confidence.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <button className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition">
                            Get Started
                        </button>
                        <button className="border border-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition">
                            Learn More
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className="flex-1 h-80 md:h-[400px] w-full bg-black border border-gray-700 rounded-xl shadow-lg"
                >
                    {/* Placeholder for visual */}
                </motion.div>
            </section>

            {/* Features Section */}
            {["Secure Storage", "Easy Management", "24/7 Support"].map(
                (title, i) => (
                    <motion.div
                        key={title}
                        custom={i + 1}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="p-6 border border-gray-700 rounded-lg bg-gray-900/50 backdrop-blur-md transform-gpu transition-transform duration-300 hover:rotate-x-3 hover:rotate-y-3 hover:scale-105"
                    >
                        <h3 className="text-xl font-semibold mb-2">{title}</h3>
                        <p className="text-sm">
                            {title === "Secure Storage"
                                ? "Encrypted vaults to keep your data safe forever."
                                : title === "Easy Management"
                                ? "User-friendly dashboard for peace of mind."
                                : "Our team is here to help anytime, anywhere."}
                        </p>
                    </motion.div>
                )
            )}

            {/* How It Works Section */}
            <section className="py-24 bg-gray-950 text-white">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.h2
                        className="text-3xl font-bold mb-10 text-center"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        How It Works
                    </motion.h2>
                    <div className="space-y-10">
                        {[
                            {
                                step: "Create your digital locker",
                                desc: "Sign up and build your personal legacy vault.",
                            },
                            {
                                step: "Add digital assets",
                                desc: "Upload important documents, files, and notes.",
                            },
                            {
                                step: "Assign legacy recipients",
                                desc: "Set trusted people to access your legacy securely.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={index + 1}
                                className="flex flex-col md:flex-row items-start gap-6"
                            >
                                <div className="text-4xl font-bold text-purple-500">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {item.step}
                                    </h3>
                                    <p className="text-gray-400">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Testimonials */}
            <section className="py-24 bg-black text-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        What Our Users Say
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                quote: "Legacy Locker gave me peace of mind knowing my digital life is in safe hands.",
                            },
                            {
                                name: "David Chen",
                                quote: "A simple and secure way to plan ahead for my family's digital access.",
                            },
                            {
                                name: "Amina Malik",
                                quote: "The interface is beautiful, and support is top-notch. Highly recommended!",
                            },
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                className="p-6 bg-gray-900/50 border border-gray-700 rounded-xl text-left shadow-md"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i + 1}
                            >
                                <p className="text-gray-300 italic mb-4">
                                    &quot;{t.quote}&quot;
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white mr-3">
                                        {t.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    <span className="text-sm font-medium text-white">
                                        {t.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
                &copy; {new Date().getFullYear()} Legacy Locker. All rights
                reserved.
            </footer>
        </div>
    );
}
