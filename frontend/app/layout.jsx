import { AuthProvider } from "@/components/AuthProvider";
import Link from "next/link";
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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
            >
                <AuthProvider>
                    <header className="flex justify-end items-center p-4 gap-4">
                        <div className="flex gap-4 items-center">
                            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg text-sm transition duration-200">
                                Login / Sign Up
                            </Link>
                        </div>
                    </header>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
