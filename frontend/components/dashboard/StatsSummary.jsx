"use client";
import { Lock, Users, Clock } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function StatsSummary({ stats }) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center">
                <div className="mr-4 bg-emerald-900/30 p-3 rounded-lg">
                    <Lock size={24} className="text-emerald-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Total Vaults</p>
                    <p className="text-xl font-semibold">{stats.totalVaults || 0}</p>
                </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center">
                <div className="mr-4 bg-teal-900/30 p-3 rounded-lg">
                    <Users size={24} className="text-teal-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Saved Contacts</p>
                    <p className="text-xl font-semibold">{stats.totalContacts || 0}</p>
                </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center">
                <div className="mr-4 bg-purple-900/30 p-3 rounded-lg">
                    <Clock size={24} className="text-purple-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Last Activity</p>
                    <p className="text-xl font-semibold">
                        {formatDate(stats.lastActivity)}
                    </p>
                </div>
            </div>
        </div>
    );
}
