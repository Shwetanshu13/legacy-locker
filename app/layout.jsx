import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "Legacy Locker",
    description: "Your own digital will",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <header className="flex justify-end items-center p-4 gap-4">
                        <SignedOut>
                            <div className="flex gap-4 items-center">
                                <SignInButton className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg text-sm transition duration-200" />
                                <SignUpButton className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 font-medium px-6 py-2 rounded-lg text-sm transition duration-200" />
                            </div>
                        </SignedOut>
                    </header>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
