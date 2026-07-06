"use client";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptyState() {
    const router = useRouter();

    const handleCreateVault = () => {
        router.push("/add-new-legacy/password");
    };

    return (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl bg-gray-900/50">
            <div className="mb-4 inline-flex p-4 bg-gray-800 rounded-full">
                <Lock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No vaults created yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Create your first vault to securely store your important passwords and
                digital assets.
            </p>
            <button
                onClick={handleCreateVault}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition duration-200"
            >
                Create Your First Vault
            </button>
        </div>
    );
}
