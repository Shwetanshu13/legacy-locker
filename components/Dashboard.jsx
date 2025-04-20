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

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    // Optionally add backend call here
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/add-new-legacy/password")}
          className="w-full my-1 bg-[#111827] border border-gray-800 rounded-xl py-5 font-semibold hover:bg-gray-800"
        >
          Add New Password
        </button>
        <button
          onClick={() => router.push("/add-new-legacy/trustedcontact")}
          className="w-full my-1 bg-[#111827] border border-gray-800 rounded-xl py-5 font-semibold hover:bg-gray-800"
        >
          Add New Trusted Contact
        </button>

        <div className="bg-[#111827] border border-gray-800 rounded-xl mt-6 p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Your Saved Titles</h1>
          {data.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No passwords saved yet
            </p>
          ) : (
            data.map((vault) => (
              <VaultCard
                key={vault.id}
                vault={vault}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
