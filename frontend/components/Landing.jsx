"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.7,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
};

const floatingAnimation = {
    animate: {
        y: [0, -20, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export default function Landing() {
    return (
        <div className="relative bg-[#020617] text-slate-200 overflow-hidden font-sans min-h-screen">
            {/* Dark Midnight Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-violet-600/15 blur-[180px] rounded-full mix-blend-screen pointer-events-none" />
            
            {/* Subtle Grid overlay for texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Header */}
            <header className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    LegacyLocker
                </div>
                <div className="flex gap-4 items-center">
                    <Link 
                        href="/home"
                        className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-8 font-medium text-slate-200 border border-slate-700/50 shadow-lg transition-all hover:border-indigo-500/50 hover:bg-slate-800"
                    >
                        <span className="relative z-10">{useAuth()?.user ? "Dashboard" : "Log In"}</span>
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                            <div className="relative h-full w-8 bg-white/5"></div>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center pt-20">
                <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Military-grade encryption for your digital assets
                </motion.div>

                <motion.h1
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8 text-white"
                >
                    Your Legacy, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400">
                        Locked & Secured.
                    </span>
                </motion.h1>

                <motion.p
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    The ultimate zero-knowledge platform to manage, protect, and pass on your digital life to the people who matter most. 
                </motion.p>

                <motion.div
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
                >
                    <Link href="/login" className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        Create Your Vault
                    </Link>
                    <Link href="/how-it-works" className="px-8 py-4 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-md text-white font-medium hover:bg-slate-800 transition-colors">
                        Learn How It Works
                    </Link>
                </motion.div>
                
                {/* Visual element representing a vault/shield */}
                <motion.div 
                    variants={floatingAnimation}
                    animate="animate"
                    className="mt-24 relative w-64 h-64 mx-auto"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl opacity-20 blur-2xl"></div>
                    <div className="relative w-full h-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center gap-4 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
                        <div className="w-20 h-20 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/10">
                            <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-2/3"></div>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">End-to-End Encrypted</p>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-32 bg-slate-950/50 backdrop-blur-3xl border-y border-slate-800/50 mt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Zero-Knowledge Architecture</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Your private keys never leave your device. We couldn't read your data even if we tried.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "AES-256 GCM",
                                desc: "Military-grade symmetric encryption secures all vault contents locally before transmission.",
                                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            },
                            {
                                title: "Dead Man's Switch",
                                desc: "Automated triggers release your vaults to trusted nominees based on inactivity limits you define.",
                                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            },
                            {
                                title: "Client-Side Cryptography",
                                desc: "RSA-OAEP wrapping ensures your nominees are the only ones who can ever decrypt your payloads.",
                                icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                className="group relative p-8 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:bg-slate-800/60 transition-all duration-300"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-500"></div>
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 bg-slate-950 text-center border-t border-slate-900">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="text-xl font-bold tracking-tighter text-slate-300">LegacyLocker</div>
                    <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Legacy Locker. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
