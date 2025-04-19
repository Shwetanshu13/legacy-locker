"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="shadow-md bg-white rounded-md mx-auto my-4 max-w-5xl transition-all duration-300 ease-in-out">
            <nav className="flex justify-between items-center p-4">
                <div className="text-xl font-semibold text-black">MyApp</div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 transition-all duration-300">
                    <li>
                        <a
                            href="/"
                            className="text-black hover:text-red-500 transition duration-200"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/about"
                            className="text-black hover:text-red-500 transition duration-200"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="/contact"
                            className="text-black hover:text-red-500 transition duration-200"
                        >
                            Contact
                        </a>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black transition-transform duration-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <ul className="flex flex-col items-end px-4 pb-4 space-y-2 text-right">
                    <li>
                        <a
                            href="/"
                            className="block text-black hover:text-red-500 transition duration-200"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/about"
                            className="block text-black hover:text-red-500 transition duration-200"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="/contact"
                            className="block text-black hover:text-red-500 transition duration-200"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
                {/* <ClerkProvider>
                    <header className="flex justify-end items-center p-4 gap-4 h-16">
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </header>
                </ClerkProvider> */}
            </div>
        </div>
    );
}
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="shadow-md bg-white rounded-md mx-auto my-4 max-w-5xl transition-all duration-300 ease-in-out">
            <nav className="flex justify-between items-center p-4">
                <div className="text-xl font-semibold text-black">MyApp</div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 transition-all duration-300">
                    <li>
                        <a
                            href="/"
                            className="text-black hover:text-red-500 transition duration-200"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/about"
                            className="text-black hover:text-red-500 transition duration-200"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="/contact"
                            className="text-black hover:text-red-500 transition duration-200"
                        >
                            Contact
                        </a>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black transition-transform duration-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <ul className="flex flex-col items-end px-4 pb-4 space-y-2 text-right">
                    <li>
                        <a
                            href="/"
                            className="block text-black hover:text-red-500 transition duration-200"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/about"
                            className="block text-black hover:text-red-500 transition duration-200"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="/contact"
                            className="block text-black hover:text-red-500 transition duration-200"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
                {/* <ClerkProvider>
                    <header className="flex justify-end items-center p-4 gap-4 h-16">
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </header>
                </ClerkProvider> */}
            </div>
        </div>
    );
}
