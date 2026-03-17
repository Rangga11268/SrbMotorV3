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
    Zap,
    MapPin,
    ShieldCheck,
    ArrowLeft,
    Search,
    Filter,
    X,
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
            "pembayaran_dikonfirmasi",
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
            pembayaran_dikonfirmasi: "PEMBAYARAN DIKONFIRMASI",
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
            <div className="flex-grow pt-[104px] pb-20">
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
                                        <option value="pembayaran_dikonfirmasi">Pembayaran Lunas</option>
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                                    >
                                        <div className="flex flex-col lg:flex-row">
                                            {/* IMAGE SECTION */}
                                            <div className="lg:w-80 p-8 bg-gray-50 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span
                                                        className={`px-3 py-1.5 rounded-full text-[9px] font-black border flex items-center gap-1.5 uppercase tracking-widest shadow-sm ${statusInfo.color}`}
                                                    >
                                                        <StatusIcon
                                                            size={12}
                                                            strokeWidth={3}
                                                        />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <img
                                                    src={`/storage/${transaction.motor.image_path}`}
                                                    alt={transaction.motor.name}
                                                    className="w-full h-48 object-contain relative z-10 filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            {/* CONTENT SECTION */}
                                            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                TXID: #
                                                                {String(
                                                                    transaction.id,
                                                                ).padStart(
                                                                    6,
                                                                    "0",
                                                                )}
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                {formatDate(
                                                                    transaction.created_at,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-3xl font-black text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {
                                                                transaction
                                                                    .motor.name
                                                            }
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                                <Calendar className="w-3.5 h-3.5 text-gray-300" />
                                                                {
                                                                    transaction
                                                                        .motor
                                                                        .year
                                                                }
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                                                                {transaction.transaction_type ===
                                                                "CASH" ? (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                                                        <span className="text-emerald-600">
                                                                            Tunai
                                                                            Keras
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                                                                        <span className="text-blue-600">
                                                                            Pembiayaan
                                                                            Kredit
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </span>
                                                            {(transaction.nik || transaction.occupation) && (
                                                                <>
                                                                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                                        {transaction.occupation || "Pekerjaan -"} 
                                                                        {transaction.nik && ` • NIK: ${transaction.nik.substring(0, 6)}...`}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="md:text-right">
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                                                            Nilai Transaksi
                                                        </p>
                                                        <p className="text-3xl font-black text-primary">
                                                            {formatCurrency(
                                                                transaction.final_price || transaction.total_price || 0,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                                    {transaction.transaction_type ===
                                                        "CREDIT" && (
                                                        <Link
                                                            href={route(
                                                                "motors.manage-documents",
                                                                transaction.id,
                                                            )}
                                                            className="w-full sm:w-auto h-14 px-8 rounded-2xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white text-[11px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 group/btn shadow-sm"
                                                        >
                                                            <FileText
                                                                size={18}
                                                                strokeWidth={
                                                                    2.5
                                                                }
                                                            />
                                                            Kelola Dokumen
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={route(
                                                            "motors.transaction.show",
                                                            transaction.id,
                                                        )}
                                                        className="w-full sm:w-auto flex-1 h-14 px-8 rounded-2xl bg-primary text-white hover:bg-black font-black text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-primary/20"
                                                    >
                                                        Detail Transaksi
                                                        <ArrowRight
                                                            size={18}
                                                            strokeWidth={2.5}
                                                            className="group-hover/btn:translate-x-1 transition-transform"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
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
