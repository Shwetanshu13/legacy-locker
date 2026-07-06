"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import VaultCard from "@/components/vault/VaultCard";
import ActionCards from "./ActionCards";

export default function VaultsGrid({ vaults, onDelete }) {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState(null);

    const handleCreateVault = () => {
        router.push("/add-new-legacy/password");
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Vault Card */}
            <div
                onClick={handleCreateVault}
                className="bg-gray-800 hover:bg-gray-750 border-2 border-dashed border-gray-700 p-6 rounded-xl cursor-pointer transition-all group flex flex-col items-center justify-center h-64"
            >
                <div className="mb-4 p-4 bg-indigo-900/30 rounded-full">
                    <PlusCircle
                        size={32}
                        className="text-indigo-400 group-hover:text-indigo-300"
                    />
                </div>
                <h3 className="text-lg font-medium mb-1">Create New Vault</h3>
                <p className="text-sm text-gray-400 text-center">
                    Add a new secure storage for your digital assets
                </p>
            </div>

            {/* Existing Vault Cards */}
            {vaults.map((vault) => (
                <VaultCard
                    key={vault.id}
                    vault={vault}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
                    onDelete={onDelete}
                />
            ))}

            <ActionCards />
        </div>
    );
}
