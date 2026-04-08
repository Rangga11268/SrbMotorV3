import React, { useState } from "react";
import { 
    Clock, 
    CheckCircle2, 
    Search, 
    Truck, 
    CreditCard, 
    Package, 
    FileText, 
    AlertCircle,
    HardHat,
    User,
    ArrowRight,
    ChevronDown,
    ChevronUp
} from "lucide-react";

export default function TransactionTimeline({ logs = [] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const INITIAL_SHOW = 3;

    if (!logs || logs.length === 0) {
        return (
            <div className="bg-white border border-gray-200 p-12 text-center">
                <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Belum ada riwayat aktivitas yang tercatat
                </p>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("new_order") || s.includes("pengajuan_masuk")) return Package;
        if (s.includes("pembayaran") || s.includes("payment") || s.includes("dp")) return CreditCard;
        if (s.includes("dokumen") || s.includes("verifikasi")) return FileText;
        if (s.includes("survey") || s.includes("jadwal")) return HardHat;
        if (s.includes("distribusi") || s.includes("kirim") || s.includes("delivery")) return Truck;
        if (s.includes("selesai") || s.includes("complete") || s.includes("setuju")) return CheckCircle2;
        if (s.includes("batal") || s.includes("cancel") || s.includes("tolak")) return AlertCircle;
        return Clock;
    };

    // Sort logs by created_at descending (newest on top)
    const sortedLogs = [...logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const displayLogs = isExpanded ? sortedLogs : sortedLogs.slice(0, INITIAL_SHOW);

    return (
        <div className="bg-white border border-gray-200 relative overflow-hidden transition-all duration-500">
            {/* Header Timeline */}
            <div className="bg-black px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-6 bg-[#1c69d4]"></div>
                    <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">RIWAYAT AKTIVITAS & STATUS</h3>
                </div>
                <div className="text-[9px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                    {logs.length} AKTIVITAS <Clock className="w-3 h-3" />
                </div>
            </div>

            <div className="p-8 sm:p-12 relative">
                {/* Vertical Line Line */}
                <div className="absolute left-[44px] sm:left-[60px] top-12 bottom-12 w-px bg-gray-100"></div>

                <div className="space-y-12">
                    {displayLogs.map((log, index) => {
                        const Icon = getStatusIcon(log.status_to || log.status);
                        const isFirst = index === 0;
                        const date = new Date(log.created_at);

                        // Extract installment info if available
                        const installmentNum = log.payload?.installment_number;
                        const isPayment = (log.notes || "").toLowerCase().includes("pembayaran");

                        return (
                            <div key={log.id} className={`relative flex gap-8 items-start group animate-in fade-in slide-in-from-top-4 duration-500`}>
                                {/* Timeline Marker */}
                                <div className="relative z-10 shrink-0">
                                    <div className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 ${isFirst ? 'bg-black text-white scale-110 shadow-lg' : 'bg-gray-50 text-gray-400 border border-gray-100 group-hover:bg-gray-100'}`}>
                                        <Icon className={`${isFirst ? 'w-4 h-4 sm:w-6 sm:h-6' : 'w-3 h-3 sm:w-5 sm:h-5'}`} />
                                    </div>
                                    {isFirst && (
                                        <div className="absolute -inset-1 border border-black animate-ping opacity-20 pointer-events-none"></div>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className={`text-[11px] font-black uppercase tracking-tight ${isFirst ? 'text-black' : 'text-gray-500'}`}>
                                                    {log.description || "Perubahan Status"}
                                                </p>
                                                {isFirst && (
                                                    <span className="bg-[#1c69d4] text-white px-2 py-0.5 text-[8px] font-black tracking-widest uppercase">TERBARU</span>
                                                )}
                                                {installmentNum !== undefined && (
                                                    <span className="bg-black text-white px-2 py-0.5 text-[8px] font-black tracking-widest uppercase">
                                                        {installmentNum === 0 ? "PEMBAYARAN AWAL" : `CICILAN KE-${installmentNum}`}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest">
                                                    {date.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    <span className="mx-2 opacity-30">|</span>
                                                    {date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Actor Badge */}
                                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100">
                                            <User className="w-3 h-3 text-gray-400" />
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                                {log.actor?.name || (log.actor_type?.includes("User") ? "PELANGGAN" : "SISTEM")}
                                            </p>
                                        </div>
                                    </div>

                                    {log.notes && (
                                        <div className={`p-4 sm:p-6 border-l-2 ${isFirst ? 'bg-slate-50 border-[#1c69d4]' : 'bg-transparent border-gray-100'} transition-all`}>
                                            <p className={`text-sm tracking-tight leading-relaxed ${isFirst ? 'text-gray-800 font-medium italic' : 'text-gray-500'}`}>
                                                "{log.notes}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Status Change Arrow (only if both exist and different) */}
                                    {log.status_from && log.status_to && log.status_from !== log.status_to && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{log.status_from.replace(/_/g, " ")}</span>
                                            <ArrowRight className="w-2.5 h-2.5 text-gray-300" />
                                            <span className="text-[8px] font-black text-[#1c69d4] uppercase tracking-widest">{log.status_to.replace(/_/g, " ")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* See More / Minimize Toggle */}
                {sortedLogs.length > INITIAL_SHOW && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="group flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 hover:border-black transition-all"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-black">
                                {isExpanded ? "Sembunyikan Aktivitas Lama" : `Lihat ${sortedLogs.length - INITIAL_SHOW} Aktivitas Lainnya`}
                            </span>
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-black" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Accent */}
            <div className="h-1.5 bg-gradient-to-r from-black via-[#1c69d4] to-black opacity-10"></div>
        </div>
    );
}

