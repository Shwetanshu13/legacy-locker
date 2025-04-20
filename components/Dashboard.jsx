"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import VaultCard from "@/components/vault/VaultCard";
import {
    Lock,
    UserCircle,
    Shield,
    Clock,
    PlusCircle,
    Settings,
    Bell,
    Users,
} from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalVaults: 0,
        totalContacts: 0,
        lastActivity: null,
    });
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoaded) return;
            setIsLoading(true);
            try {
                // Fetch vaults
                const vaultsRes = await axios.post("/api/get/vaults", {
                    clerkUserId: user.id,
                });
                setData(vaultsRes.data.vaults);

                // Fetch stats (this would need to be implemented on the backend)
                try {
                    const statsRes = await axios.post("/api/get/stats", {
                        clerkUserId: user.id,
                    });
                    setStats(statsRes.data);
                } catch (err) {
                    // Fallback if stats endpoint isn't implemented yet - now showing contacts instead of passwords
                    setStats({
                        totalVaults: vaultsRes.data.vaults.length,
                        totalContacts: 0, // Default to 0 if no contacts data available
                        lastActivity: new Date().toISOString(),
                    });
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isLoaded, user]);

    const handleDelete = async (id) => {
        try {
            await axios.post("/api/vault/delete", { vaultId: id });
            setData(data.filter((item) => item.id !== id));
            setStats((prev) => ({
                ...prev,
                totalVaults: prev.totalVaults - 1,
            }));
        } catch (error) {
            console.error("Error deleting vault:", error);
            alert("Failed to delete vault.");
        }
    };

    const handleCreateVault = () => {
        router.push("/add-new-legacy/password");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-6 pb-12">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center">
                        <div className="mr-4 bg-indigo-900/30 p-3 rounded-lg">
                            <Lock size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">
                                Total Vaults
                            </p>
                            <p className="text-xl font-semibold">
                                {stats.totalVaults}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center">
                        <div className="mr-4 bg-teal-900/30 p-3 rounded-lg">
                            <Users size={24} className="text-teal-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">
                                Saved Contacts
                            </p>
                            <p className="text-xl font-semibold">
                                {stats.totalContacts}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center">
                        <div className="mr-4 bg-purple-900/30 p-3 rounded-lg">
                            <Clock size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">
                                Last Activity
                            </p>
                            <p className="text-xl font-semibold">
                                {formatDate(stats.lastActivity)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6">
                        Your Secure Vaults
                    </h2>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                            <p className="mt-4 text-gray-400">
                                Loading your vaults...
                            </p>
                        </div>
                    ) : (
                        <>
                            {data.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl bg-gray-900/50">
                                    <div className="mb-4 inline-flex p-4 bg-gray-800 rounded-full">
                                        <Lock
                                            size={32}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">
                                        No vaults created yet
                                    </h3>
                                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                        Create your first vault to securely
                                        store your important passwords and
                                        digital assets.
                                    </p>
                                    <button
                                        onClick={handleCreateVault}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        Create Your First Vault
                                    </button>
                                </div>
                            ) : (
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
                                        <h3 className="text-lg font-medium mb-1">
                                            Create New Vault
                                        </h3>
                                        <p className="text-sm text-gray-400 text-center">
                                            Add a new secure storage for your
                                            digital assets
                                        </p>
                                    </div>

                                    {/* Existing Vault Cards */}
                                    {data.map((vault) => (
                                        <VaultCard
                                            key={vault.id}
                                            vault={vault}
                                            selectedId={selectedId}
                                            onSelect={(id) =>
                                                setSelectedId(
                                                    id === selectedId
                                                        ? null
                                                        : id
                                                )
                                            }
                                            onDelete={handleDelete}
                                        />
                                    ))}

                                    {/* Trusted Contacts Card */}
                                    <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition h-64 flex flex-col">
                                        <div className="mb-4 p-3 bg-purple-900/30 rounded-lg w-fit">
                                            <UserCircle
                                                size={24}
                                                className="text-purple-400"
                                            />
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2">
                                            Trusted Contacts
                                        </h2>
                                        <p className="text-sm text-gray-400 mb-4 flex-grow">
                                            Manage people who can access your
                                            vault in emergencies.
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    "/add-new-legacy/trustedcontact"
                                                )
                                            }
                                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm w-full transition"
                                        >
                                            Manage Contacts
                                        </button>
                                    </div>

                                    {/* Passwords Card */}
                                    <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition h-64 flex flex-col">
                                        <div className="mb-4 p-3 bg-teal-900/30 rounded-lg w-fit">
                                            <Lock
                                                size={24}
                                                className="text-teal-400"
                                            />
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2">
                                            Password Manager
                                        </h2>
                                        <p className="text-sm text-gray-400 mb-4 flex-grow">
                                            Access and manage all your stored
                                            passwords securely.
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    "/add-new-legacy/password"
                                                )
                                            }
                                            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm w-full transition"
                                        >
                                            Go to Passwords
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
