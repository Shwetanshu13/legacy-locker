"use client";
import { Lock, Users, Clock } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function StatsSummary({ stats }) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface border border-emerald-200 rounded-xl p-4 flex items-center shadow-sm">
                <div className="mr-4 bg-emerald-soft p-3 rounded-lg">
                    <Lock size={24} className="text-emerald" />
                </div>
                <div>
                    <p className="text-ink-muted text-sm font-medium">Total Vaults</p>
                    <p className="text-xl font-display font-semibold text-ink">{stats.totalVaults || 0}</p>
                </div>
            </div>
            <div className="bg-surface border border-emerald-200 rounded-xl p-4 flex items-center shadow-sm">
                <div className="mr-4 bg-emerald-soft p-3 rounded-lg">
                    <Users size={24} className="text-emerald" />
                </div>
                <div>
                    <p className="text-ink-muted text-sm font-medium">Saved Contacts</p>
                    <p className="text-xl font-display font-semibold text-ink">{stats.totalContacts || 0}</p>
                </div>
            </div>
            <div className="bg-surface border border-emerald-200 rounded-xl p-4 flex items-center shadow-sm">
                <div className="mr-4 bg-emerald-soft p-3 rounded-lg">
                    <Clock size={24} className="text-emerald" />
                </div>
                <div>
                    <p className="text-ink-muted text-sm font-medium">Last Activity</p>
                    <p className="text-xl font-display font-semibold text-ink">
                        {formatDate(stats.lastActivity)}
                    </p>
                </div>
            </div>
        </div>
    );
}
