import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    weight: ["400", "600"],
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-plex-mono",
    weight: ["400", "500"],
});

export const metadata = {
    title: "Legacy Locker",
    description: "Your own digital will",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}>
            <body
                className={`antialiased bg-bg text-ink font-sans selection:bg-emerald-soft`}
            >
                <AuthProvider>
                    <Toaster position="bottom-right" />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
