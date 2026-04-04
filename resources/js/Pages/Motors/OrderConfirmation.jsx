import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    CheckCircle,
    Calendar,
    User,
    Phone,
    Briefcase,
    CreditCard,
    Info,
    FileText,
    Upload,
    Home,
    ArrowRight,
    Wallet,
    Download,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

export default function OrderConfirmation({ transaction, midtransClientKey }) {
    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const { auth, config } = usePage().props;

    // Load Snap.js
    useEffect(() => {
        const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = midtransClientKey || config.midtrans_client_key;
        const script = document.createElement("script");
        script.src = snapUrl;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleOnlinePayment = async (installment) => {
        if (!installment || !installment.id) {
            Swal.fire({
                title: "Data Tidak Valid",
                text: "Informasi pembayaran tidak ditemukan. Silakan hubungi admin.",
                icon: "warning",
            });
            return;
        }
        setIsLoadingPay(true);
        try {
            const response = await axios.post(
                route("installments.create-payment", installment.id),
            );
            const token = response.data.snap_token;

            window.snap.pay(token, {
                onSuccess: async function (result) {
                    try {
                        await axios.post(
                            route("installments.check-status", installment.id),
                        );
                    } catch (e) {
                        console.error("Manual status check failed", e);
                    }
                    Swal.fire({
                        title: "Pembayaran Berhasil",
                        text: "Pembayaran Anda telah diterima.",
                        icon: "success",
                        background: "#ffffff",
                        color: "#000000",
                        confirmButtonColor: "#2563eb",
                    });
                    if (installment.installment_number === 0) {
                        router.visit(route("installments.index"));
                    } else {
                        router.reload();
                    }
                },
                onPending: async function (result) {
                    try {
                        await axios.post(
                            route("installments.check-status", installment.id),
                        );
                    } catch (e) {}
                    Swal.fire({
                        title: "Pembayaran Tertunda",
                        text: "Menunggu konfirmasi pembayaran Anda.",
                        icon: "info",
                        background: "#ffffff",
                        color: "#000000",
                        confirmButtonColor: "#2563eb",
                    });
                    if (installment.installment_number === 0) {
                        router.visit(route("installments.index"));
                    } else {
                        router.reload();
                    }
                },
                onError: function (result) {
                    Swal.fire({
                        title: "Pembayaran Gagal",
                        text: "Pembayaran tidak berhasil diproses.",
                        icon: "error",
                        background: "#ffffff",
                        color: "#000000",
                        confirmButtonColor: "#dc2626",
                    });
                },
                onClose: function () {
                    // Customer closed the popup
                },
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error Sistem",
                text: "Gagal memproses pembayaran online.",
                icon: "error",
                background: "#ffffff",
                color: "#000000",
                confirmButtonColor: "#dc2626",
            });
        } finally {
            setIsLoadingPay(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const isCredit = transaction.transaction_type === "CREDIT";

    return (
        <PublicLayout auth={auth} title="Konfirmasi Pesanan">
            <div className="flex-grow pt-[104px] pb-24">
                <div className="min-h-screen bg-white">
                    {/* Header Section */}
                    <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block mb-6"
                                >
                                    <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-none flex items-center justify-center">
                                        <CheckCircle
                                            size={48}
                                            className="text-white"
                                        />
                                    </div>
                                </motion.div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
                                    PESANAN <span className="text-green-500">DIKONFIRMASI</span>
                                </h1>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] max-w-2xl mx-auto">
                                    TERIMA KASIH TELAH MELAKUKAN PEMESANAN. SIMPAN BUKTI TRANSAKSI INI UNTUK KEPERLUAN ADMINISTRASI.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Motor Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 border border-gray-200 rounded-none overflow-hidden sticky top-24">
                                    <div className="aspect-video bg-white border-b border-gray-200 flex items-center justify-center p-4">
                                        <img
                                            src={`/storage/${transaction.motor.image_path}`}
                                            alt={transaction.motor.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[#1c69d4] text-[10px] font-bold uppercase tracking-widest mb-1">
                                            {transaction.motor.brand}
                                        </p>
                                        <h3 className="font-black text-xl text-black uppercase tracking-tighter mb-4">
                                            {transaction.motor.name}
                                        </h3>
                                        <div className="space-y-3 mb-5 pb-5 border-b border-gray-200">
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    TIPE
                                                </span>
                                                <span className="font-bold text-black uppercase">
                                                    {transaction.motor.type}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    TAHUN
                                                </span>
                                                <span className="font-bold text-black">
                                                    {transaction.motor.year}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    HARGA
                                                </span>
                                                <span className="font-black text-black">
                                                    {formatCurrency(
                                                        transaction.motor.price,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-none p-4 border border-gray-200">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                ID TRANSAKSI
                                            </p>
                                            <p className="font-mono text-sm font-black text-black mt-1">
                                                {transaction.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Order Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Customer Information */}
                                <div className="bg-white border border-gray-200 rounded-none p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                        <div className="w-8 h-8 bg-black flex items-center justify-center">
                                            <User
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-lg font-black text-black uppercase tracking-widest">
                                            INFORMASI PELANGGAN
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                NAMA LENGKAP
                                            </h4>
                                            <p className="font-bold text-black uppercase">
                                                {transaction.name || (transaction.user && transaction.user.name) || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                NOMOR WHASTAPP
                                            </h4>
                                            <p className="font-bold text-black">
                                                {transaction.phone || (transaction.user && transaction.user.phone) || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                EMAIL
                                            </h4>
                                            <p className="font-bold text-black uppercase">
                                                {transaction.email || (transaction.user && transaction.user.email) || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                NIK (NO. KTP)
                                            </h4>
                                            <p className="font-bold text-black">
                                                {transaction.nik || (transaction.user && transaction.user.nik) || "-"}
                                            </p>
                                        </div>
                                        
                                        {isCredit && (
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    PEKERJAAN
                                                </h4>
                                                <p className="font-bold text-black uppercase">
                                                    {transaction.occupation || (transaction.user && transaction.user.pekerjaan) || "-"}
                                                </p>
                                            </div>
                                        )}

                                        {!isCredit && (
                                            <>
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                        WARNA MOTOR
                                                    </h4>
                                                    <p className="font-bold text-black uppercase">
                                                        {transaction.motor_color || "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                        METODE PENYERAHAN
                                                    </h4>
                                                    <p className="font-bold text-black uppercase">
                                                        {transaction.delivery_method || "-"}
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        <div className="sm:col-span-2">
                                            <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                ALAMAT LENGKAP
                                            </h4>
                                            <p className="font-bold text-black uppercase leading-relaxed">
                                                {transaction.address || (transaction.user && transaction.user.alamat) || "-"}
                                            </p>
                                        </div>
                                        <div className="sm:col-span-2 pt-6 border-t border-gray-100">
                                            <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                JENIS TRANSAKSI
                                            </h4>
                                            <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest mt-1">
                                                {transaction.transaction_type}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Credit Details (if applicable) */}
                                {isCredit && transaction.credit_detail && (
                                    <div className="bg-white border border-gray-200 rounded-none p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                            <div className="w-8 h-8 bg-black flex items-center justify-center">
                                                <CreditCard
                                                    size={16}
                                                    className="text-white"
                                                />
                                            </div>
                                            <h2 className="text-lg font-black text-black uppercase tracking-widest">
                                                SIMULASI KREDIT
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    NO. REFERENSI
                                                </label>
                                                <p className="font-bold text-black uppercase">
                                                    {transaction.creditDetail?.reference_number || transaction.credit_detail?.reference_number || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    UANG MUKA (DP)
                                                </label>
                                                <p className="font-black text-black">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail?.dp_amount || transaction.creditDetail?.dp_amount || 0,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    TENOR
                                                </label>
                                                <p className="font-black text-black">
                                                    {
                                                        transaction
                                                            .credit_detail?.tenor || transaction.creditDetail?.tenor || 0
                                                    }{" "}
                                                    BULAN
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    BUNGA/BULAN
                                                </label>
                                                <p className="font-black text-black">
                                                    {transaction.credit_detail?.interest_rate || transaction.creditDetail?.interest_rate || 0}%
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    CICILAN/BULAN
                                                </label>
                                                <p className="font-black text-[#1c69d4]">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail?.monthly_installment || transaction.creditDetail?.monthly_installment || 0,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                                    PENYEDIA LEASING
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-black uppercase">
                                                        {transaction.credit_detail?.leasing_provider || transaction.creditDetail?.leasing_provider || "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                {transaction.installments &&
                                    transaction.installments.length > 0 && (
                                        <div className="bg-white border border-gray-200 rounded-none p-6 md:p-8">
                                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                                <div className="w-8 h-8 bg-black flex items-center justify-center">
                                                    <Wallet
                                                        size={16}
                                                        className="text-white"
                                                    />
                                                </div>
                                                <h2 className="text-lg font-black text-black uppercase tracking-widest">
                                                    PEMBAYARAN
                                                </h2>
                                            </div>

                                            {/* Booking Fee / Down Payment */}
                                            {transaction.installments?.find(
                                                (i) =>
                                                    i.installment_number === 0,
                                            ) && (
                                                <CashPaymentModule
                                                    installment={transaction.installments.find(
                                                        (i) =>
                                                            i.installment_number ===
                                                            0,
                                                    )}
                                                    type={
                                                        isCredit
                                                            ? "UANG MUKA (DP)"
                                                            : "BOOKING FEE"
                                                    }
                                                    isLoading={isLoadingPay}
                                                    onPay={handleOnlinePayment}
                                                    formatCurrency={
                                                        formatCurrency
                                                    }
                                                />
                                            )}

                                            {/* Pelunasan (if booking fee paid OR no booking fee exists) */}
                                            {!isCredit &&
                                                (transaction.installments?.find(
                                                    (i) =>
                                                        i.installment_number ===
                                                        0,
                                                )?.status === "paid" || 
                                                !transaction.installments?.find(
                                                    (i) =>
                                                        i.installment_number ===
                                                        0,
                                                )) &&
                                                transaction.installments?.find(
                                                    (i) =>
                                                        i.installment_number ===
                                                        1,
                                                ) && (
                                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                                        <CashPaymentModule
                                                            installment={transaction.installments.find(
                                                                (i) =>
                                                                    i.installment_number ===
                                                                    1,
                                                            )}
                                                            type="PELUNASAN UNIT"
                                                            isLoading={
                                                                isLoadingPay
                                                            }
                                                            onPay={
                                                                handleOnlinePayment
                                                            }
                                                            formatCurrency={
                                                                formatCurrency
                                                            }
                                                        />
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                {/* Document Upload CTA (Credit) */}
                                {isCredit && (
                                    <div
                                        className={`${transaction.documents_complete ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border rounded-none p-6 md:p-8`}
                                    >
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                            <div
                                                className={`w-12 h-12 flex items-center justify-center shrink-0 ${transaction.documents_complete ? "bg-green-100 text-green-600" : "bg-black text-white"}`}
                                            >
                                                {transaction.documents_complete ? (
                                                    <CheckCircle
                                                        size={24}
                                                    />
                                                ) : (
                                                    <AlertCircle
                                                        size={24}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3
                                                    className={`font-black uppercase tracking-widest text-lg ${transaction.documents_complete ? "text-green-900" : "text-black"} mb-1`}
                                                >
                                                    {transaction.documents_complete
                                                        ? "DOKUMEN LENGKAP"
                                                        : "LENGKAPI DOKUMEN ANDA"}
                                                </h3>
                                                <p
                                                    className={`text-[11px] font-bold uppercase tracking-widest ${transaction.documents_complete ? "text-green-800" : "text-gray-500"} mb-4 md:mb-0`}
                                                >
                                                    {transaction.documents_complete
                                                        ? "DOKUMEN ANDA TELAH LENGKAP DAN SEDANG DALAM PROSES VERIFIKASI."
                                                        : "UPLOAD KTP, KK, DAN SLIP GAJI UNTUK MELANJUTKAN VERIFIKASI KREDIT."}
                                                </p>
                                            </div>
                                            <Link
                                                href={route(
                                                    transaction.documents_complete
                                                        ? "motors.manage-documents"
                                                        : "motors.upload-credit-documents",
                                                    transaction.id,
                                                )}
                                                className={`shrink-0 inline-flex items-center gap-2 px-6 py-4 border font-black uppercase tracking-widest text-[11px] transition-colors rounded-none ${transaction.documents_complete ? "border-green-600 bg-green-600 hover:bg-green-700 text-white" : "border-black bg-black hover:bg-gray-900 text-white"}`}
                                            >
                                                {transaction.documents_complete ? (
                                                    <>
                                                        <FileText
                                                            size={16}
                                                        />{" "}
                                                        KELOLA
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} />{" "}
                                                        UPLOAD
                                                    </>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={route("home")}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-black font-black uppercase tracking-widest text-[11px] border border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
                                    >
                                        <Home size={16} /> BERANDA
                                    </Link>
                                    <Link
                                        href={route("motors.index")}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white border border-black font-black uppercase tracking-widest text-[11px] rounded-none hover:bg-gray-900 transition-colors"
                                    >
                                        <ArrowRight size={16} /> CARI MOTOR
                                    </Link>
                                    <button
                                        onClick={() => window.print()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-black font-black uppercase tracking-widest text-[11px] border border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
                                    >
                                        <Download size={16} /> CETAK
                                    </button>
                                </div>

                                {/* Tanggal Info */}
                                <div className="text-center text-sm text-gray-600">
                                    <p>
                                        Dibuat pada:{" "}
                                        <span className="font-semibold text-gray-900">
                                            {new Date(
                                                transaction.created_at,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function CashPaymentModule({
    installment,
    type,
    isLoading,
    onPay,
    formatCurrency,
}) {
    const isPaid = installment.status === "paid";

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    {isPaid ? (
                        <CheckCircle className="text-green-500" size={16} />
                    ) : (
                        <AlertCircle className="text-red-500" size={16} />
                    )}
                    <h5 className="font-bold text-[10px] uppercase tracking-widest text-black">{type}</h5>
                </div>
                <div className="text-2xl font-black text-black">
                    {formatCurrency(installment.amount)}
                </div>
                <p
                    className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${
                        isPaid ? "text-green-600" : "text-gray-500"
                    }`}
                >
                    {isPaid
                        ? "PEMBAYARAN TELAH DIVERIFIKASI"
                        : "SEGERA SELESAIKAN PEMBAYARAN"}
                </p>
            </div>

            {!isPaid && (
                <button
                    onClick={() => onPay(installment)}
                    disabled={isLoading}
                    className="px-8 py-4 bg-black text-white border border-black font-black text-[11px] uppercase tracking-widest rounded-none hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap w-full sm:w-auto mt-4 sm:mt-0"
                >
                    {isLoading ? "MEMPROSES..." : "BAYAR SEKARANG"}
                </button>
            )}
        </div>
    );
}
