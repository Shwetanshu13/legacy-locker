"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

export default function Landing() {
    useEffect(() => {
        // Load Spline viewer script
        const splineScript = document.createElement("script");
        splineScript.src =
            "https://unpkg.com/@splinetool/viewer@0.9.490/build/spline-viewer.js";
        splineScript.type = "module";
        document.head.appendChild(splineScript);

        return () => {
            // Clean up script when component unmounts
            document.head.removeChild(splineScript);
        };
    }, []);

    return (
        <div className="relative bg-black text-white overflow-x-hidden font-sans">
            {/* Decorative background shapes */}
            <div className="absolute top-[-100px] left-1/2 w-[700px] h-[700px] bg-purple-600 opacity-20 blur-[180px] rounded-full transform -translate-x-1/2 -z-10" />
            <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-500 opacity-10 blur-3xl rounded-full -z-10" />

            {/* Hero Section with Spline Background */}
            <section className="relative min-h-screen max-w-7xl mx-auto px-6 py-28">
                {/* Spline Viewer as background */}
                <div className="absolute inset-0 w-full h-full overflow-hidden -z-5">
                    <spline-viewer
                        url="https://prod.spline.design/YjKP74MlhtyCYk-6/scene.splinecode"
                        className="w-full h-full"
                    ></spline-viewer>
                </div>

                {/* Semi-transparent overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 -z-5"></div>

                {/* Content - maintaining original flex layout */}
                <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between gap-12">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 text-center md:text-left"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                            Your Legacy, <br /> Locked & Secured
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-md mx-auto md:mx-0">
                            Manage, protect and pass on your digital life with
                            confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all duration-300 shadow-md">
                                Get Started
                            </button>
                            <button className="border border-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-md">
                                Learn More
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="flex-1"
                    >
                        {/* This is an empty div that preserves the original layout spacing */}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["Secure Storage", "Easy Management", "24/7 Support"].map(
                        (title, i) => (
                            <motion.div
                                key={title}
                                custom={i + 1}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="p-6 border border-gray-700 rounded-xl bg-white/5 backdrop-blur-md text-white transform-gpu transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
                            >
                                <h3 className="text-xl font-semibold mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-300">
                                    {title === "Secure Storage"
                                        ? "Encrypted vaults to keep your data safe forever."
                                        : title === "Easy Management"
                                        ? "User-friendly dashboard for peace of mind."
                                        : "Our team is here to help anytime, anywhere."}
                                </p>
                            </motion.div>
                        )
                    )}
                </div>
            </section>

            {/* How It Works Section with Spline Background */}
            <section className="relative py-24 bg-gray-950">
                {/* Spline Viewer as background for How It Works section */}
                <div className="absolute inset-0 w-full h-full overflow-hidden opacity-60">
                    <spline-viewer
                        url="https://prod.spline.design/wTCpAdDX34stWPdK/scene.splinecode"
                        className="w-full h-full"
                    ></spline-viewer>
                </div>

                {/* Semi-transparent overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gray-950 bg-opacity-70"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-14 text-center"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        How It Works
                    </motion.h2>
                    <div className="space-y-12">
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
                                className="p-6 bg-gray-900 border border-gray-700 rounded-xl text-left shadow-md hover:shadow-lg transition-shadow duration-300"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i + 1}
                            >
                                <p className="text-gray-300 italic mb-4">
                                    {t.quote}
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white mr-3">
                                        {t.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    <span className="text-sm font-medium">
                                        {t.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-center text-gray-500 border-t border-gray-800 text-sm">
                &copy; {new Date().getFullYear()} Legacy Locker. All rights
                reserved.
            </footer>
        </div>
    );
}
