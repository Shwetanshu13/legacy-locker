import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
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
    weight: "100 900",
});

export const metadata = {
    title: "Legacy Locker",
    description: "Your own digital will",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-emerald-50 text-emerald-950`}
            >
                <AuthProvider>
                    <Toaster position="bottom-right" />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
