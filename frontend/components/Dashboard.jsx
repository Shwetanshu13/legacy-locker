"use client";
import { useState } from "react";
import Spline from "@splinetool/react-spline";
import { useAuth } from "@/components/AuthProvider";
import { useVaults } from "@/hooks/useVaults";
import { useStats } from "@/hooks/useStats";

import StatsSummary from "./dashboard/StatsSummary";
import EmptyState from "./dashboard/EmptyState";
import VaultsGrid from "./dashboard/VaultsGrid";

export default function Dashboard() {
  const [splineLoading, setSplineLoading] = useState(true);
  const { user, isLoaded } = useAuth(); // Assuming we adjusted useAuth to provide isLoaded or we just check user

  const { vaults, loading: vaultsLoading, deleteVault } = useVaults(user?.id, true);
  const { stats } = useStats(user?.id, true);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* 3D Spline Hero Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8 relative">
          <div className="h-80 w-full relative">
            {splineLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              </div>
            )}
            <Spline
              scene="https://prod.spline.design/xJeSckXFvIStXIIz/scene.splinecode"
              onLoad={() => setSplineLoading(false)}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Digital Legacy</h1>
            <p className="text-gray-300 max-w-lg">
              Secure your digital assets and ensure they&apos;re passed on according to your wishes.
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <StatsSummary stats={stats} />

        {/* Main Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6">Your Secure Vaults</h2>

          {vaultsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-400">Loading your vaults...</p>
            </div>
          ) : vaults.length === 0 ? (
            <EmptyState />
          ) : (
            <VaultsGrid vaults={vaults} onDelete={deleteVault} />
          )}
        </div>
      </div>
    </div>
  );
}
