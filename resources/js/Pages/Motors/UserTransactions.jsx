import React from "react";
import { usePage, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
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
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserTransactions({ transactions }) {
    const { auth } = usePage().props;

    // Status Helper
    const getStatusInfo = (transaction) => {
        const status = transaction.unified_status || transaction.status;

        const successStatuses = [
            "Selesai",
            "Kredit Disetujui",
            "Pembayaran Berhasil",
            "Persiapan Unit",
            "Siap Dikirim",
            "completed",
            "disetujui",
            "ready_for_delivery",
            "payment_confirmed",
        ];
        const warningStatuses = [
            "Perbaiki Dokumen",
            "Data Tidak Valid",
            "Kredit Ditolak",
            "Ditolak",
            "ditolak",
            "data_tidak_valid",
        ];

        if (successStatuses.includes(status)) {
            return {
                label: status.toUpperCase(),
                color: "text-green-600 border-green-100 bg-green-50",
                icon: CheckCircle,
            };
        }

        if (warningStatuses.includes(status)) {
            return {
                label: status.toUpperCase(),
                color: "text-red-600 border-red-100 bg-red-50",
                icon: XCircle,
            };
        }

        return {
            label: status.toUpperCase(),
            color: "text-blue-600 border-blue-100 bg-blue-50",
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
                {/* HERO HEADER - SIMPLE */}
                <div className="bg-white border-b border-gray-100 pt-8 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                            Lacak status pemesanan motor Anda, kelola dokumen
                            persyaratan, dan lihat rincian transaksi secara
                            transparan
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
                    {transactions.data.length > 0 ? (
                        <div className="space-y-8">
                            {transactions.data.map((transaction, index) => {
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
                                                        </div>
                                                    </div>

                                                    <div className="md:text-right">
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                                                            Nilai Transaksi
                                                        </p>
                                                        <p className="text-3xl font-black text-primary">
                                                            {formatCurrency(
                                                                transaction.total_amount,
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
                                                            "motors.order.confirmation",
                                                            transaction.id,
                                                        )}
                                                        className="w-full sm:w-auto flex-1 h-14 px-8 rounded-2xl bg-primary text-white hover:bg-black font-black text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-primary/20"
                                                    >
                                                        Lihat Detail Pesanan
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

                    {/* PAGINATION */}
                    {transactions.links && transactions.links.length > 3 && (
                        <div className="mt-20 flex justify-center gap-3">
                            {transactions.links.map((link, k) => (
                                <Link
                                    key={k}
                                    href={link.url || "#"}
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
