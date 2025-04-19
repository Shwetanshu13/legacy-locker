"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="shadow-md bg-white rounded-md mx-auto my-4 max-w-5xl transition-all duration-300 ease-in-out">
      <nav className="flex justify-between items-center p-4">
        <div className="text-xl font-semibold text-black">
          <Link href="/">MyApp</Link>
        </div>

        {/* Desktop Menu */}
        <SignedIn>
          <UserButton />
        </SignedIn>

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
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
