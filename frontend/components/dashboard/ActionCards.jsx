"use client";
import { useRouter } from "next/navigation";
import { UserCircle, Lock, History } from "lucide-react";

export default function ActionCards() {
    const router = useRouter();
    const buttonClass = "bg-emerald text-white font-medium px-4 py-2 rounded-lg text-sm w-full transition duration-200 flex items-center justify-center gap-2 hover:bg-forest";
    const cardClass = "bg-surface border border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-64 flex flex-col group cursor-pointer";
    const iconWrapperClass = "mb-4 p-3 bg-emerald-soft rounded-lg w-fit text-emerald group-hover:bg-emerald group-hover:text-white transition-colors duration-200";

    return (
        <>
            {/* Trusted Contacts Card */}
            <div className={cardClass} onClick={() => router.push("/add-new-legacy/trustedcontact")}>
                <div className={iconWrapperClass}>
                    <UserCircle size={24} />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-ink">
                    Trusted Contacts
                </h2>
                <p className="text-sm text-ink-muted mb-4 flex-grow">
                    Manage people who can access your vault in emergencies.
                </p>
                <div className="mt-auto flex items-center text-emerald font-medium text-sm group-hover:text-forest transition-colors">
                    Manage Contacts &rarr;
                </div>
            </div>

            {/* Passwords Card */}
            <div className={cardClass} onClick={() => router.push("/add-new-legacy/password")}>
                <div className={iconWrapperClass}>
                    <Lock size={24} />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-ink">
                    Password Manager
                </h2>
                <p className="text-sm text-ink-muted mb-4 flex-grow">
                    Access and manage all your stored passwords securely.
                </p>
                <div className="mt-auto flex items-center text-emerald font-medium text-sm group-hover:text-forest transition-colors">
                    Go to Passwords &rarr;
                </div>
            </div>

            {/* History Card */}
            <div className={cardClass} onClick={() => router.push("/history")}>
                <div className={iconWrapperClass}>
                    <History size={24} />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-ink">
                    Trigger History
                </h2>
                <p className="text-sm text-ink-muted mb-4 flex-grow">
                    View a log of all automated triggers and accessed vaults.
                </p>
                <div className="mt-auto flex items-center text-emerald font-medium text-sm group-hover:text-forest transition-colors">
                    View History &rarr;
                </div>
            </div>
        </>
    );
}
