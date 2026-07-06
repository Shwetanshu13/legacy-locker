"use client";
import { useRouter } from "next/navigation";
import { UserCircle, Lock } from "lucide-react";

export default function ActionCards() {
    const router = useRouter();
    const buttonClass = "bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm w-full transition duration-200 flex items-center justify-center gap-2";

    return (
        <>
            {/* Trusted Contacts Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition h-64 flex flex-col">
                <div className="mb-4 p-3 bg-purple-900/30 rounded-lg w-fit">
                    <UserCircle size={24} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                    Trusted Contacts
                </h2>
                <p className="text-sm text-gray-400 mb-4 flex-grow">
                    Manage people who can access your vault in emergencies.
                </p>
                <button
                    onClick={() => router.push("/add-new-legacy/trustedcontact")}
                    className={buttonClass.replace("bg-indigo-600 hover:bg-indigo-500", "bg-purple-600 hover:bg-purple-500")}
                >
                    Manage Contacts
                </button>
            </div>

            {/* Passwords Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition h-64 flex flex-col">
                <div className="mb-4 p-3 bg-teal-900/30 rounded-lg w-fit">
                    <Lock size={24} className="text-teal-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                    Password Manager
                </h2>
                <p className="text-sm text-gray-400 mb-4 flex-grow">
                    Access and manage all your stored passwords securely.
                </p>
                <button
                    onClick={() => router.push("/add-new-legacy/password")}
                    className={buttonClass.replace("bg-indigo-600 hover:bg-indigo-500", "bg-teal-600 hover:bg-teal-500")}
                >
                    Go to Passwords
                </button>
            </div>
        </>
    );
}
