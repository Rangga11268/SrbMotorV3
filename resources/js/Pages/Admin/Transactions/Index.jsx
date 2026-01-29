import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    CheckCircle,
    Clock,
    RotateCcw,
    AlertTriangle,
    Plus,
    ChevronDown,
    Bike,
    Calendar,
    ArrowRight,
    DollarSign,
    CreditCard,
    FileText,
    Eye,
    Edit,
    Settings,
} from "lucide-react";

export default function Index({
    transactions,
    filters,
    transactionTypes,
    statuses,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "");
    const [status, setStatus] = useState(filters.status || "");
    const [isFirstRender, setIsFirstRender] = useState(true);

    // Live Search Implementation
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("admin.transactions.index"),
                {
                    search: search,
                    type: type,
                    status: status,
                },
                { preserveState: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, type, status]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Triggered by effect
    };

    const handleFilterChange = (key, value) => {
        if (key === "type") setType(value);
        if (key === "status") setStatus(value);
        // Effect will handle the fetch
    };

    const resetFilters = () => {
        setSearch("");
        setType("");
        setStatus("");
        // Effect will handle the fetch
    };

    // Explicit filter application (optional, as effect handles it)
    const applySearch = () => {
        // No-op or force immediate
    };

    const getStatusStyle = (status) => {
        if (
            [
                "completed",
                "disetujui",
                "ready_for_delivery",
                "payment_confirmed",
            ].includes(status)
        )
            return "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]";
        if (
            [
                "menunggu_persetujuan",
                "new_order",
                "waiting_payment",
                "unit_preparation",
                "dikirim_ke_surveyor",
                "jadwal_survey",
            ].includes(status)
        )
            return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]";
        if (
            ["ditolak", "data_tidak_valid", "cancelled", "rejected"].includes(
                status
            )
        )
            return "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]";
        return "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, " ").toUpperCase();
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <AdminLayout title="LOG TRANSAKSI">
            <div className="space-y-8">
                {/* Header Control Panel */}
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-white/50 font-mono uppercase tracking-widest text-xs mb-2">
                            MODUL SISTEM
                        </h2>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
                            <span className="w-1 h-8 bg-accent rounded-full"></span>
                            DATA TRANSAKSI
                        </h1>
                    </div>

                    <Link
                        href={route("admin.transactions.create")}
                        className="group flex items-center gap-3 px-6 py-3 bg-accent text-black rounded-xl font-bold font-display uppercase tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
                    >
                        <Plus
                            size={20}
                            className="group-hover:rotate-90 transition-transform duration-500"
                        />
                        <span>ENTRI BARU</span>
                    </Link>
                </div>

                {/* Glassmorphic Filter Bar */}
                <div className="bg-zinc-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/5 flex flex-col xl:flex-row gap-4 items-center justify-between">
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full xl:w-96 group"
                    >
                        <input
                            type="text"
                            placeholder="CARI ID JEJAK / KLIEN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-accent/50 focus:ring-1 focus:ring-accent/50 text-white placeholder-white/20 font-mono text-sm transition-all"
                        />
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-accent transition-colors"
                            size={18}
                        />
                    </form>

                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        <div className="relative min-w-[160px]">
                            <select
                                value={type}
                                onChange={(e) =>
                                    handleFilterChange("type", e.target.value)
                                }
                                className="w-full pl-10 pr-10 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-accent/50 text-white font-mono text-xs uppercase tracking-wider appearance-none cursor-pointer hover:border-white/30 transition-all"
                            >
                                <option value="">SEMUA TIPE</option>
                                {transactionTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            <CreditCard
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                size={16}
                            />
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                                size={14}
                            />
                        </div>

                        <div className="relative min-w-[200px]">
                            <select
                                value={status}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }
                                className="w-full pl-10 pr-10 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-accent/50 text-white font-mono text-xs uppercase tracking-wider appearance-none cursor-pointer hover:border-white/30 transition-all"
                            >
                                <option value="">SEMUA STATUS</option>
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {formatStatus(s)}
                                    </option>
                                ))}
                            </select>
                            <CheckCircle
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                size={16}
                            />
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                                size={14}
                            />
                        </div>

                        {(search || type || status) && (
                            <button
                                onClick={resetFilters}
                                className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold font-mono text-xs uppercase flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                <span className="hidden sm:inline">RESET</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Data Grid */}
                <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-white/40 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                                    <th className="p-6">ID Jejak</th>
                                    <th className="p-6">Identitas Klien</th>
                                    <th className="p-6">Unit Target</th>
                                    <th className="p-6">Nilai</th>
                                    <th className="p-6">Protokol Status</th>
                                    <th className="p-6 text-right">Waktu</th>
                                    <th className="p-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.data.length > 0 ? (
                                    transactions.data.map((transaction) => {
                                        const customerName =
                                            transaction.customer_name ||
                                            transaction.user?.name ||
                                            "ENTITAS_TIDAK_DIKENAL";
                                        const initials =
                                            getInitials(customerName);
                                        const isCash =
                                            transaction.transaction_type ===
                                            "CASH";

                                        return (
                                            <tr
                                                key={transaction.id}
                                                className="hover:bg-white/5 transition-colors group cursor-pointer"
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "admin.transactions.show",
                                                            transaction.id
                                                        )
                                                    )
                                                }
                                            >
                                                <td className="p-6">
                                                    <span className="font-mono font-bold text-xs text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20 group-hover:bg-accent group-hover:text-black transition-colors">
                                                        #
                                                        {transaction.id
                                                            .toString()
                                                            .padStart(6, "0")}
                                                    </span>
                                                </td>

                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-xs border border-white/10 ${
                                                                isCash
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : "bg-purple-500/10 text-purple-400"
                                                            }`}
                                                        >
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white text-sm font-display uppercase tracking-wide">
                                                                {customerName}
                                                            </div>
                                                            <div className="text-[10px] text-white/40 font-mono mt-1">
                                                                {transaction.customer_phone ||
                                                                    "TIDAK_ADA_KOMUNIKASI"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden shrink-0 group-hover:border-accent/30 transition-colors">
                                                            {transaction.motor
                                                                ?.image_path ? (
                                                                <img
                                                                    src={`/storage/${transaction.motor.image_path}`}
                                                                    alt={
                                                                        transaction
                                                                            .motor
                                                                            .name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                                                    <Bike
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white text-xs font-display uppercase tracking-wide">
                                                                {transaction
                                                                    .motor
                                                                    ?.name ||
                                                                    "UNIT TIDAK DIKENAL"}
                                                            </div>
                                                            <div className="text-[10px] text-white/40 font-mono mt-1">
                                                                {transaction
                                                                    .motor
                                                                    ?.brand ||
                                                                    "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <div className="font-mono font-bold text-white text-sm">
                                                            Rp{" "}
                                                            {new Intl.NumberFormat(
                                                                "id-ID"
                                                            ).format(
                                                                transaction.total_amount
                                                            )}
                                                        </div>
                                                        <div
                                                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                                isCash
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                    : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            }`}
                                                        >
                                                            {isCash ? (
                                                                <>
                                                                    <DollarSign
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{" "}
                                                                    TUNAI
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{" "}
                                                                    KREDIT
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-6">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span
                                                            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(
                                                                transaction.status
                                                            )}`}
                                                        >
                                                            {formatStatus(
                                                                transaction.status
                                                            )}
                                                        </span>

                                                        {transaction.transaction_type ===
                                                            "CREDIT" &&
                                                            !transaction.documents_complete && (
                                                                <span className="flex items-center gap-1 text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 mt-1">
                                                                    <AlertTriangle
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{" "}
                                                                    DOKUMEN
                                                                    HILANG
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>

                                                <td className="p-6 text-right">
                                                    <div className="text-[10px] font-mono text-white/40">
                                                        <div className="flex items-center justify-end gap-1.5 mb-1">
                                                            <Calendar
                                                                size={10}
                                                            />
                                                            {new Date(
                                                                transaction.created_at
                                                            )
                                                                .toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Clock size={10} />
                                                            {new Date(
                                                                transaction.created_at
                                                            ).toLocaleTimeString(
                                                                "id-ID",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}{" "}
                                                            WIB
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.transactions.show",
                                                                transaction.id
                                                            )}
                                                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all inline-flex group/btn"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>

                                                        {transaction.transaction_type ===
                                                            "CREDIT" && (
                                                            <Link
                                                                href={route(
                                                                    "admin.transactions.editCredit",
                                                                    transaction.id
                                                                )}
                                                                className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all inline-flex group/btn"
                                                                title="Edit Status Kredit"
                                                            >
                                                                <CreditCard
                                                                    size={16}
                                                                />
                                                            </Link>
                                                        )}

                                                        <Link
                                                            href={route(
                                                                "admin.transactions.edit",
                                                                transaction.id
                                                            )}
                                                            className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all inline-flex group/btn"
                                                            title="Edit Transaksi"
                                                        >
                                                            <Edit size={16} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="p-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-white/20">
                                                <div className="bg-white/5 p-4 rounded-full mb-4">
                                                    <FileText
                                                        size={48}
                                                        strokeWidth={1}
                                                    />
                                                </div>
                                                <p className="text-lg font-bold font-display uppercase tracking-widest text-white/40">
                                                    Tidak Ditemukan Catatan
                                                </p>
                                                <p className="text-xs font-mono text-white/20 mt-2">
                                                    SESUAIKAN PARAMETER
                                                    PENCARIAN ATAU KONFIGURASI
                                                    FILTER
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.links.length > 3 && (
                        <div className="p-6 border-t border-white/5 flex justify-center bg-black/20">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {transactions.links.map((link, index) => {
                                    if (!link.url && !link.label) return null;
                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                                                link.active
                                                    ? "bg-accent text-black border-accent"
                                                    : "bg-white/5 text-white/50 border-white/5 hover:border-white/20 hover:text-white"
                                            }`}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/5 text-white/20 border border-transparent cursor-not-allowed"
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
