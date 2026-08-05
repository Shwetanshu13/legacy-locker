"use client";
import { useAuth } from "@/components/AuthProvider";
import { useVaults } from "@/hooks/useVaults";
import { useStats } from "@/hooks/useStats";

import StatsSummary from "./dashboard/StatsSummary";
import EmptyState from "./dashboard/EmptyState";
import VaultsGrid from "./dashboard/VaultsGrid";
import ActionCards from "./dashboard/ActionCards";

export default function Dashboard() {
  const { user } = useAuth();

  const { vaults, loading: vaultsLoading, deleteVault } = useVaults(user?.id, true);
  const { stats } = useStats(user?.id, true);

  return (
      <div className="relative max-w-6xl mx-auto px-6 pb-12 pt-8 z-10">
        
        {/* Sleek Hero Banner */}
        <div className="relative bg-surface border border-emerald-200 rounded-2xl overflow-hidden mb-12 shadow-sm">
            <div className="relative p-10 md:p-14">
              <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 text-ink tracking-tight">
                Digital Legacy
              </h1>
              <p className="text-ink-muted max-w-lg text-lg leading-relaxed">
                Secure your most critical digital assets. Ensure they&apos;re preserved and passed on exactly according to your conditions.
              </p>
            </div>
        </div>

        {/* Stats Summary */}
        <div className="mb-12">
            <StatsSummary stats={stats} />
        </div>

        {/* Action Cards */}
        <div className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-ink tracking-tight mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <ActionCards />
            </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-semibold text-ink tracking-tight">Your Vaults</h2>
              <span className="text-sm font-mono text-ink-muted bg-surface px-3 py-1 rounded border border-emerald-200">
                {vaults.filter(v => v.status === "unlocked").length} unlocked ●
              </span>
          </div>

          {vaultsLoading ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent mb-4 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
              <p className="text-emerald-700 font-medium tracking-wide">Decrypting vaults locally...</p>
            </div>
          ) : vaults.length === 0 ? (
            <EmptyState />
          ) : (
            <VaultsGrid vaults={vaults} onDelete={deleteVault} />
          )}
        </div>
      </div>
  );
}
