"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import VaultCard from "@/components/vault/VaultCard";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchVaults = async () => {
      if (!isLoaded) return;
      try {
        const res = await axios.post("/api/get/vaults", {
          clerkUserId: user.id,
        });
        setData(res.data.vaults);
      } catch (err) {
        console.error("Error fetching vaults:", err);
      }
    };

    fetchVaults();
  }, [isLoaded]);

  const handleDelete = async (id) => {
    try {
      await axios.post("/api/vault/delete", { vaultId: id });
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting vault:", error);
      alert("Failed to delete vault.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Your Saved Vaults
          </h1>

          {data.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm">
              No passwords saved yet.
            </p>
          ) : (
            <div className="space-y-6">
              {data.map((vault) => (
                <VaultCard
                  key={vault.id}
                  vault={vault}
                  selectedId={selectedId}
                  onSelect={(id) =>
                    setSelectedId(id === selectedId ? null : id)
                  }
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
