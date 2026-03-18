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
    Activity,
    CreditCard,
    DollarSign,
    Package,
    ChevronRight,
    Wallet,
    MapPin,
    ShieldCheck,
    ArrowLeft,
    Search,
    Filter,
    X,
    Gauge,
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
            label: labels[status] || status.toUpperCase(),
            color: "text-amber-600 border-amber-100 bg-amber-50",
            icon: Activity,
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
        <PublicLayout auth={auth} title="Riwayat Pesanan - SRB Motors">
            <div className="flex-grow pt-[110px] sm:pt-32 pb-20">
                {/* BACK BUTTON */}
                <div className="bg-gray-50/50 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                        <Link
                            href={route("profile.show")}
                            className="inline-flex items-center gap-2 text-xs font-black text-gray-500 hover:text-blue-600 transition-colors group uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Profil
                        </Link>
                    </div>
                </div>

                {/* HERO HEADER - SIMPLE */}
                <div className="bg-white border-b border-gray-100 section-py-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                                    Riwayat Transaksi
                                </h1>
                                <p className="text-gray-500 font-medium text-base md:text-lg max-w-xl leading-relaxed">
                                    Lacak status pemesanan motor Anda, kelola dokumen
                                    persyaratan, dan lihat rincian transaksi secara
                                    transparan
                                </p>
                            </div>

                            {/* SEARCH & FILTER UI */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                <div className="relative w-full sm:w-80 group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari ID atau Nama Motor..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full h-14 pl-12 pr-12 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold placeholder:text-gray-400"
                                    />
                                    {search && (
                                        <button 
                                            onClick={() => setSearch("")}
                                            className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="relative w-full sm:w-56">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <Filter className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full h-14 pl-12 pr-10 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-gray-700 appearance-none"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="new_order">Pesanan Masuk</option>
                                        <option value="waiting_payment">Menunggu Pembayaran</option>
                                        <option value="payment_confirmed">Pembayaran Lunas</option>
                                        <option value="unit_preparation">Motor Disiapkan</option>
                                        <option value="ready_for_delivery">Siap Dikirim/Ambil</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Dibatalkan</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
                    <div className={`${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                    {localTransactions.data.length > 0 ? (
                        <div className="space-y-8">
                            {localTransactions.data.map((transaction, index) => {
                                const statusInfo = getStatusInfo(transaction);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-gray-900">
                                                    ID: #{String(transaction.id).padStart(6, "0")}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="text-sm font-medium text-gray-500">
                                                    <Calendar className="inline-block w-4 h-4 mr-1.5 -mt-0.5 text-gray-400" />
                                                    {formatDate(transaction.created_at)}
                                                </span>
                                            </div>
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 shadow-sm ${statusInfo.color}`}>
                                                <StatusIcon size={14} strokeWidth={2.5} />
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6 flex flex-col sm:flex-row gap-6">
                                            {/* Image */}
                                            <div className="w-full sm:w-48 h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                                                <img
                                                    src={`/storage/${transaction.motor.image_path}`}
                                                    alt={transaction.motor.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="text-xl font-black text-gray-900 mb-2">
                                                    {transaction.motor.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <Gauge className="w-4 h-4 text-gray-400" />
                                                        {transaction.motor.year}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    {transaction.transaction_type === "CASH" ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                                                            <Wallet className="w-4 h-4" />
                                                            Tunai
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md">
                                                            <CreditCard className="w-4 h-4" />
                                                            Kredit
                                                        </span>
                                                    )}
                                                </div>

                                                {(transaction.nik || transaction.occupation) && (
                                                    <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5" />
                                                        {transaction.occupation || "Pekerjaan -"} 
                                                        {transaction.nik && ` • NIK: ${transaction.nik.substring(0, 6)}...`}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Price / Subtotal Mobile */}
                                            <div className="sm:text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                    Nilai Transaksi
                                                </p>
                                                <p className="text-2xl font-black text-gray-900">
                                                    {formatCurrency(transaction.final_price || transaction.total_price || 0)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Footer (Actions) */}
                                        <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3 mt-auto">
                                            {transaction.transaction_type === "CREDIT" && (
                                                <Link
                                                    href={route("motors.manage-documents", transaction.id)}
                                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FileText size={16} strokeWidth={2.5} />
                                                    Kelola Dokumen
                                                </Link>
                                            )}
                                            <Link
                                                href={route("motors.transaction.show", transaction.id)}
                                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                Detail Transaksi
                                                <ArrowRight size={16} strokeWidth={2.5} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto py-24 text-center">
                            <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-8 border border-white">
                                <Package className="w-16 h-16 text-gray-200" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">
                                Belum Ada Transaksi
                            </h3>
                            <p className="text-gray-500 font-bold mb-10 text-lg leading-relaxed">
                                Anda belum memiliki riwayat pemesanan motor di
                                SRB Motors. Jelajahi katalog kami untuk
                                menemukan motor impian Anda.
                            </p>
                            <Link href="/motors">
                                <button className="h-16 px-10 bg-primary text-black font-black uppercase tracking-widest rounded-[2rem] hover:bg-white transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 mx-auto">
                                    Mulai Menjelajah{" "}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    )}
                    </div>

                    {/* PAGINATION */}
                    {localTransactions.links && localTransactions.links.length > 3 && (
                        <div className="mt-20 flex justify-center gap-3">
                            {localTransactions.links.map((link, k) => (
                                <button
                                    key={k}
                                    onClick={() => handlePageChange(link.url)}
                                    disabled={!link.url || link.active}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[11px] font-black transition-all border ${
                                        link.active
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : link.url
                                              ? "bg-white text-gray-400 border-gray-100 hover:border-primary hover:text-primary shadow-sm"
                                              : "bg-white text-gray-200 border-gray-50 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
