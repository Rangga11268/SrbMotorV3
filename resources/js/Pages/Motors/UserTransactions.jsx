import React, { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import axios from "axios";
import {
    ShoppingBag,
    Calendar,
    User,
    Phone,
    Info,
    FileText,
    CheckCircle,
    AlertCircle,
    XCircle,
    Clock,
    Hash,
    ArrowRight,
    ArrowLeft,
    Search,
    Filter,
    X,
    Gauge,
    History,
    Wallet,
    CreditCard,
    ChevronRight,
    Package,
    MapPin,
    ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserTransactions({ transactions: initialTransactions, filters }) {
    const { auth } = usePage().props;

    const [localTransactions, setLocalTransactions] = useState(initialTransactions);
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const fetchTransactions = async (params) => {
        setLoading(true);
        try {
            const response = await axios.get(route("motors.user-transactions"), {
                params,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            setLocalTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);

            fetchTransactions(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, status]);

    const handlePageChange = (url) => {
        if (!url) return;
        const urlObj = new URL(url);
        const params = Object.fromEntries(urlObj.searchParams);
        fetchTransactions(params);
        window.history.replaceState({}, "", url);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Status Helper
    const getStatusInfo = (transaction) => {
        const status = transaction.status;

        const successStatuses = [
            "completed",
            "payment_confirmed",
            "disetujui",
            "dp_dibayar"
        ];
        const infoStatuses = [
            "unit_preparation",
            "ready_for_delivery",
            "dalam_pengiriman",
            "dikirim_ke_leasing",
            "survey_dijadwalkan",
            "survey_berjalan"
        ];
        const dangerStatuses = [
            "cancelled",
            "ditolak",
            "data_tidak_valid"
        ];

        const labels = {
            new_order: "PESANAN MASUK",
            waiting_payment: "MENUNGGU PEMBAYARAN",
            payment_confirmed: "PEMBAYARAN DIKONFIRMASI",
            unit_preparation: "MOTOR DISIAPKAN",
            ready_for_delivery: "SIAP DIKIRIM/AMBIL",
            dalam_pengiriman: "DALAM PENGIRIMAN",
            completed: "SELESAI",
            cancelled: "DIBATALKAN",
            waiting_credit_approval: "VERIFIKASI BERKAS",
            menunggu_persetujuan: "VERIFIKASI BERKAS",
            pengajuan_masuk: "PENGAJUAN MASUK",
            verifikasi_dokumen: "VERIFIKASI DOKUMEN",
            dikirim_ke_leasing: "DIKIRIM KE LEASING",
            survey_dijadwalkan: "SURVEY DIJADWALKAN",
            survey_berjalan: "SURVEY BERJALAN",
            menunggu_keputusan_leasing: "MENUNGGU KEPUTUSAN",
            disetujui: "DISETUJUI",
            ditolak: "DITOLAK",
            dp_dibayar: "DP DITERIMA"
        };

        if (successStatuses.includes(status)) {
            return {
                label: labels[status] || status.toUpperCase(),
                color: "text-green-600 border-green-100 bg-green-50",
                icon: CheckCircle,
            };
        }

        if (dangerStatuses.includes(status)) {
            return {
                label: labels[status] || status.toUpperCase(),
                color: "text-red-600 border-red-100 bg-red-50",
                icon: XCircle,
            };
        }

        if (infoStatuses.includes(status)) {
            return {
                label: labels[status] || status.toUpperCase(),
                color: "text-blue-600 border-blue-100 bg-blue-50",
                icon: Clock,
            };
        }

        return {
            label: labels[status] || status.replace(/_/g, " ").toUpperCase(),
            color: "text-amber-600 border-amber-100 bg-amber-50",
            icon: History,
        };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <PublicLayout auth={auth} title="RIWAYAT PESANAN - SRB MOTOR">
            <div className="flex-grow pt-[140px] bg-white min-h-screen">
                {/* HERO SECTION */}
                <section className="bg-black text-white pt-24 pb-32 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-16">
                            <Link
                                href={route("profile.show")}
                                className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-gray-500 hover:text-white transition-all group uppercase"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                KEMBALI KE PROFIL
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                            <div className="max-w-3xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-px bg-[#1c69d4]"></div>
                                    <p className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase">TRANSAKSI & RIWAYAT</p>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                    DAFTAR <br/>
                                    PESANAN MOTOR
                                </h1>
                                <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl uppercase tracking-widest leading-relaxed opacity-70">
                                    Kelola dokumen persyaratan, pantau status unit secara real-time, dan akses seluruh rincian transaksi kendaraan Anda.
                                </p>
                            </div>

                            {/* ANALYTICS MINI BAR */}
                            <div className="flex items-center gap-8 border-l border-gray-800 pl-8 h-fit self-start lg:self-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">TOTAL PESANAN</p>
                                    <p className="text-3xl font-black text-white">{localTransactions.total || 0}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">AKTIF</p>
                                    <p className="text-3xl font-black text-[#1c69d4]">
                                        {localTransactions.data?.filter(t => !["completed", "cancelled"].includes(t.status)).length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FILTER SECTION */}
                <div className="sticky top-[110px] sm:top-28 z-[30] bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-stretch gap-0">
                            {/* Search */}
                            <div className="flex-grow flex items-center border-r border-gray-200 py-6 md:pr-8">
                                <div className="relative w-full group">
                                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="CARI ID ATAU MODEL KENDARAAN..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-8 pr-4 py-2 bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-[0.15em] placeholder:text-gray-300"
                                    />
                                    {search && (
                                        <button onClick={() => setSearch("")} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="md:w-72 flex items-center border-r border-gray-200 py-6 md:px-8">
                                <div className="relative w-full flex items-center">
                                    <Filter className="absolute left-0 w-4 h-4 text-gray-400" />
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full pl-8 pr-8 py-2 bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-[0.15em] appearance-none cursor-pointer"
                                    >
                                        <option value="">KESELURUHAN STATUS</option>
                                        <option value="NEW_ORDER">PESANAN BARU</option>
                                        <option value="WAITING_PAYMENT">MENUNGGU PEMBAYARAN</option>
                                        <option value="UNIT_PREPARATION">PERSIAPAN UNIT</option>
                                        <option value="READY_FOR_DELIVERY">SIAP KIRIM</option>
                                        <option value="COMPLETED">SELESAI</option>
                                        <option value="CANCELLED">DIBATALKAN</option>
                                    </select>
                                    <ChevronRight className="absolute right-0 w-4 h-4 text-gray-400 rotate-90" />
                                </div>
                            </div>

                            {/* Total Info (Desktop Only) */}
                            <div className="hidden lg:flex items-center px-8 py-6 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                                MENAMPILKAN {localTransactions.data?.length || 0} DARI {localTransactions.total || 0} HASIL
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 transition-all duration-500">
                    <div className={`${loading ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'} transition-all duration-300`}>
                    {localTransactions.data.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {localTransactions.data.map((transaction, index) => {
                                const statusInfo = getStatusInfo(transaction);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`relative bg-white p-8 sm:p-12 border border-gray-200 flex flex-col md:flex-row gap-8 lg:gap-16 transition-all duration-300 hover:shadow-xl hover:border-black animate-in fade-in slide-in-from-bottom-5 ${transaction.status === 'cancelled' ? 'opacity-70' : ''}`}
                                    >
                                        {/* RED ACCENT FOR CANCELLED */}
                                        {transaction.status === "cancelled" && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 z-20"></div>
                                        )}
                                        <div className="hidden md:flex flex-col items-center justify-start gap-4 w-12 pt-2">
                                            <div className={`p-3 border-2 ${statusInfo.color.split(' ')[1]} ${statusInfo.color.split(' ')[0]} rounded-none`}>
                                                <StatusIcon size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-grow w-px bg-gray-100"></div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                            {/* Preview Image */}
                                            <div className="lg:col-span-3">
                                                <div className="aspect-[4/3] bg-gray-100 border border-gray-200 p-4 relative group hover:bg-gray-200 transition-colors">
                                                    <img
                                                        src={`/storage/${transaction.motor.image_path}`}
                                                        alt={transaction.motor.name}
                                                        className="w-full h-full object-contain filter drop-shadow-2xl"
                                                    />
                                                    <div className="absolute top-0 right-0 bg-white border-l border-b border-gray-200 px-3 py-1 text-[9px] font-black tracking-widest text-[#1c69d4]">
                                                        {transaction.transaction_type}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Primary Info */}
                                            <div className="lg:col-span-5 space-y-6">
                                                <div>
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">
                                                        <span>ID #{String(transaction.id).padStart(6, "0")}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                        <span>{formatDate(transaction.created_at)}</span>
                                                    </div>
                                                    <h3 className="text-3xl font-black text-black uppercase tracking-tighter leading-tight group-hover:text-[#1c69d4] transition-colors">
                                                        {transaction.motor.name}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">DATA PELANGGAN</p>
                                                        <p className="text-[11px] font-bold text-black uppercase truncate">{transaction.name || transaction.user?.name}</p>
                                                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">{transaction.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">METODE PEMBAYARAN</p>
                                                        <p className="text-[11px] font-bold text-black uppercase">{transaction.transaction_type === "CASH" ? "TUNAI / TRANSFER" : "PEMBIAYAAN KREDIT"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financials & Status */}
                                            <div className="lg:col-span-4 flex flex-col md:items-end justify-between h-full gap-8">
                                                <div className="md:text-right w-full">
                                                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">TOTAL TRANSAKSI</p>
                                                    <p className="text-4xl font-black text-black tracking-tighter">
                                                        {formatCurrency(transaction.final_price || transaction.total_price || 0)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap md:justify-end gap-3 w-full">
                                                    {transaction.transaction_type === "CREDIT" && (
                                                        <Link
                                                            href={route("motors.manage-documents", transaction.id)}
                                                            className="flex-1 md:flex-none px-6 py-4 bg-white border-2 border-black hover:bg-black hover:text-white text-black font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <FileText size={16} />
                                                            DOKUMEN
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={route("motors.transaction.show", transaction.id)}
                                                        className="flex-[2] md:flex-none px-10 py-4 bg-black border-2 border-black hover:bg-gray-800 text-white font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3"
                                                    >
                                                        RINCIAN <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto py-32 text-center border-2 border-dashed border-gray-200">
                            <div className="w-24 h-24 bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-10">
                                <ShoppingBag className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
                                TIDAK ADA DATA
                            </h3>
                            <p className="text-gray-500 font-medium mb-12 text-sm uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto opacity-70">
                                Belum ditemukan riwayat pemesanan yang tercatat dalam sistem untuk filter saat ini.
                            </p>
                            <Link href={route('motors.index')}>
                                <button className="h-16 px-12 bg-black hover:bg-[#1c69d4] text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-4 mx-auto">
                                    LIHAT KATALOG <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    )}
                    </div>

                    {/* PAGINATION */}
                    {localTransactions.links && localTransactions.links.length > 3 && (
                        <div className="mt-24 flex justify-center items-center gap-4">
                            {localTransactions.links.map((link, k) => {
                                if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                                    return (
                                        <button
                                            key={k}
                                            onClick={() => handlePageChange(link.url)}
                                            disabled={!link.url}
                                            className={`w-14 h-14 flex items-center justify-center border transition-all ${
                                                !link.url ? "opacity-20 cursor-not-allowed border-gray-200" : "hover:bg-black hover:text-white border-black"
                                            }`}
                                        >
                                            {link.label.includes("Previous") ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                                        </button>
                                    );
                                }
                                return (
                                    <button
                                        key={k}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url || link.active}
                                        className={`w-14 h-14 flex items-center justify-center text-[11px] font-black tracking-widest transition-all border ${
                                            link.active
                                                ? "bg-black text-white border-black shadow-xl"
                                                : link.url
                                                  ? "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                                                  : "bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed"
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .section-py-sm { padding-top: 5rem; padding-bottom: 5rem; }
                @media (max-width: 640px) {
                    .section-py-sm { padding-top: 3rem; padding-bottom: 3rem; }
                }
            ` }} />
        </PublicLayout>
    );
}
