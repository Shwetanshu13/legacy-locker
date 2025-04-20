"use client";
import { useState } from "react";
import { Menu, X, Home, Lock, Users, Settings } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const fadeIn = {
        hidden: { opacity: 0, y: -20 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1 },
        }),
    };

    const navItems = [
        { name: "Home", href: "/", icon: <Home size={18} /> },
        {
            name: "Passwords",
            href: "/add-new-legacy/password",
            icon: <Lock size={18} />,
        },
        {
            name: "Trusted Contacts",
            href: "/add-new-legacy/trustedcontact",
            icon: <Users size={24} />,
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="backdrop-blur-md bg-gray-900/80 text-white rounded-xl mx-auto my-4 max-w-6xl border border-gray-700 shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
        >
            <nav className="flex justify-between items-center p-4">
                <motion.div
                    variants={fadeIn}
                    className="text-xl font-bold text-white"
                >
                    <Link href="/">Digital Legacy</Link>
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
                                className="text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div variants={fadeIn} custom={5}>
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox:
                                            "border-2 border-purple-500",
                                    },
                                }}
                            />
                        </SignedIn>
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    variants={fadeIn}
                    custom={1}
                    className="md:hidden text-white hover:text-purple-400 transition-colors duration-300"
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
                                className="flex items-center space-x-3 text-gray-300 hover:text-white py-2 transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="text-purple-500">
                                    {item.icon}
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate={isOpen ? "visible" : "hidden"}
                        custom={5}
                        className="pt-3 border-t border-gray-700"
                    >
                        <SignedIn>
                            <div className="flex items-center space-x-3 py-2">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox:
                                                "border-2 border-purple-500",
                                        },
                                    }}
                                />
                                <span className="text-sm text-gray-400">
                                    Your account
                                </span>
                            </div>
                        </SignedIn>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
