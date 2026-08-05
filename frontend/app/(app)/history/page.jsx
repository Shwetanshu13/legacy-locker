"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useAuth } from "@/components/AuthProvider";
import { ArrowLeft, Clock, Eye, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function HistoryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const res = await api.get("/history");
                setHistory(res.data.data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-emerald-50 text-emerald-950">
            {/* Background Orbs */}
            <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            
            <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-12 z-10">
                <button 
                    onClick={() => router.push("/home")} 
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mb-8 transition-colors font-medium text-sm"
                    type="button"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-emerald-950 tracking-tight flex items-center gap-3">
                        <Clock className="text-amber-500" size={32} />
                        Trigger History
                    </h1>
                    <p className="text-emerald-700 text-lg">
                        View a log of all automated triggers and accessed vaults.
                    </p>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-emerald-200/80 rounded-2xl shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
                    
                    {loading ? (
                        <div className="p-12 text-center text-emerald-700">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertTriangle className="mx-auto text-emerald-600 mb-4" size={48} />
                            <h3 className="text-xl font-medium text-emerald-900 mb-2">No History Yet</h3>
                            <p className="text-emerald-600">Your trigger and access logs will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800/50">
                            {history.map((record) => (
                                <div key={record.id} className="p-6 hover:bg-emerald-100/50/20 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-emerald-950">{record.vaultTitle}</h3>
                                            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100/50 border border-emerald-300 text-emerald-700">
                                                ID: {record.vaultId.substring(0, 8)}...
                                            </span>
                                        </div>
                                        <p className="text-emerald-700 text-sm">
                                            Accessed by Nominee: <span className="text-amber-400 font-medium">{record.nomineeEmail}</span>
                                        </p>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-medium mb-1">
                                            <Eye size={14} />
                                            {record.status === 'OPENED_AND_PURGED' ? 'Opened & Purged' : record.status}
                                        </div>
                                        <div className="text-emerald-600 text-xs flex items-center justify-end gap-1">
                                            <Clock size={12} />
                                            {format(new Date(record.openedAt || record.triggeredAt), 'PPpp')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
