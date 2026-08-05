"use client";
import { useState } from "react";
import { Menu, X, Home, Lock, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const fadeIn = {
        hidden: { opacity: 0, y: -20 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1 },
        }),
    };

    const navItems = [
        { name: "Home", href: "/home", icon: <Home size={18} /> },
        {
            name: "Passwords",
            href: "/add-new-legacy/password",
            icon: <Lock size={18} />,
        },
        {
            name: "Trusted Contacts",
            href: "/add-new-legacy/trustedcontact",
            icon: <Users size={18} />,
        },
        {
            name: "Profile",
            href: "/profile",
            icon: <Settings size={18} />,
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="bg-forest text-white mx-auto w-full transition-all duration-300 ease-in-out relative"
        >
            <div className="max-w-6xl mx-auto px-6">
                <nav className="flex justify-between items-center py-5 relative z-10">
                    <motion.div
                        variants={fadeIn}
                        className="text-2xl font-display font-semibold tracking-tight text-white"
                    >
                        <Link href="/home">LegacyLocker</Link>
                    </motion.div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.name}
                            variants={fadeIn}
                            custom={index + 1}
                        >
                            <Link
                                href={item.href}
                                className="text-sm font-medium text-emerald-soft/70 hover:text-white border-b-2 border-transparent hover:border-brass pb-1 transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div variants={fadeIn} custom={5}>
                        {user ? (
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 text-sm font-medium text-emerald-soft/70 hover:text-white transition-colors duration-200"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        ) : null}
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    variants={fadeIn}
                    custom={1}
                    className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </nav>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 py-2 space-y-3">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.name}
                            variants={fadeIn}
                            initial="hidden"
                            animate={isOpen ? "visible" : "hidden"}
                            custom={index + 1}
                        >
                            <Link
                                href={item.href}
                                className="flex items-center space-x-3 text-slate-400 hover:text-cyan-400 py-2 transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="text-cyan-500">
                                    {item.icon}
                                </div>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate={isOpen ? "visible" : "hidden"}
                        custom={5}
                        className="pt-3 border-t border-slate-800"
                    >
                        {user && (
                            <button className="flex w-full items-center space-x-3 py-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium" onClick={logout}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>
            </div>
        </motion.div>
    );
}
