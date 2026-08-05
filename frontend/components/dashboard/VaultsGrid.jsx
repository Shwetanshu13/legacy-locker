"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import VaultCard from "@/components/vault/VaultCard";

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
                className="bg-surface border-2 border-dashed border-emerald-300 p-6 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group flex flex-col items-center justify-center h-64"
            >
                <div className="mb-4 p-4 rounded-full bg-emerald-soft text-emerald group-hover:scale-110 transition-transform duration-200">
                    <PlusCircle
                        size={32}
                    />
                </div>
                <h3 className="text-lg font-display font-semibold mb-1 text-ink">Create New Vault</h3>
                <p className="text-sm text-ink-muted text-center max-w-[200px]">
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
        </div>
    );
}
