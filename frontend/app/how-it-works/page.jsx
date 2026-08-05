"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileKey, Share2 } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
};

export default function HowItWorks() {
    return (
        <div className="relative bg-[#020617] text-slate-200 overflow-hidden font-sans min-h-screen">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            
            {/* Subtle Grid overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Header */}
            <header className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
                <div className="text-xl font-bold tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    LegacyLocker
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 pb-32">
                <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Legacy Locker</span> Works
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        We built a system where even we cannot read your data. Here is exactly how your digital assets are secured from end-to-end.
                    </p>
                </motion.div>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                    {/* Step 1 */}
                    <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-slate-800 text-cyan-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Lock size={20} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <h3 className="font-bold text-xl text-white mb-2">1. Client-Side Encryption</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Everything starts on your device. When you create a vault, your browser generates a secure Data Encryption Key (DEK). Your files and text are encrypted using AES-256-GCM locally. The raw data never touches our servers.
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-slate-800 text-emerald-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <Shield size={20} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <h3 className="font-bold text-xl text-white mb-2">2. Master Password Security</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Your DEK is wrapped (encrypted) using a key derived from your Master Password using Argon2, the winner of the Password Hashing Competition. We only store the wrapped key, meaning without your password, the vault is mathematically impossible to open.
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-slate-800 text-violet-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                            <FileKey size={20} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <h3 className="font-bold text-xl text-white mb-2">3. Nominee Assignment</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                When you assign a nominee, your session briefly decrypts the DEK, and re-encrypts it using a unique 6-digit Sharing PIN. This PIN is shown to you only once. You must provide this PIN to your nominee in person or via a secure channel.
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-slate-800 text-emerald-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                            <Share2 size={20} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <h3 className="font-bold text-xl text-white mb-2">4. Dead Man's Trigger</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                If you fail to log in for your specified inactivity period, or your scheduled date arrives, Legacy Locker emails your nominee with a unique unlock link. 
                                Upon visiting the link, they enter the Sharing PIN. Their browser locally unwraps the DEK and decrypts the vault content right before their eyes.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    custom={6} 
                    initial="hidden" 
                    animate="visible" 
                    variants={fadeUp}
                    className="mt-20 text-center"
                >
                    <Link href="/home" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-white border border-transparent rounded-full hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                        Start Securing Your Legacy
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
