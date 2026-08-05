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
    <div className="min-h-screen bg-emerald-50 text-emerald-950">
      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="fixed top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pb-12 pt-8 z-10">
        
        {/* Sleek Hero Banner */}
        <div className="relative bg-white/40 border border-emerald-200/80 rounded-2xl overflow-hidden mb-12 shadow-2xl backdrop-blur-md">
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 opacity-50"></div>
          
          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50/50 border border-emerald-300 mb-6 text-xs font-mono text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                System Secured
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-emerald-950 tracking-tight">
                Digital Legacy
              </h1>
              <p className="text-emerald-700 max-w-lg text-lg leading-relaxed">
                Secure your most critical digital assets. Ensure they&apos;re preserved and passed on exactly according to your conditions.
              </p>
            </div>

            {/* Decorative abstract shield/vault graphic */}
            <div className="hidden md:flex flex-shrink-0 relative w-48 h-48 items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
              <div className="relative w-32 h-32 bg-emerald-100/50/50 backdrop-blur border border-emerald-500/30 rounded-2xl flex items-center justify-center transform rotate-3 shadow-xl">
                <div className="w-24 h-24 bg-white rounded-xl border border-emerald-300 flex items-center justify-center transform -rotate-6">
                  <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mb-12">
            <StatsSummary stats={stats} />
        </div>

        {/* Action Cards */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-emerald-950 tracking-tight mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <ActionCards />
            </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/40 backdrop-blur-xl border border-emerald-200/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">Your Secure Vaults</h2>
              <span className="text-sm font-mono text-emerald-600 bg-emerald-100/50/50 px-3 py-1 rounded border border-emerald-300">AES-256 GCM</span>
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
    </div>
  );
}
