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

export default function OrderConfirmation({ transaction }) {
    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const { auth, config } = usePage().props;

    // Load Snap.js
    useEffect(() => {
        const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = config.midtrans_client_key;
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
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block mb-6"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle
                                            size={48}
                                            className="text-green-600"
                                        />
                                    </div>
                                </motion.div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Pesanan Dikonfirmasi
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Terima kasih telah melakukan pemesanan.
                                    Simpan bukti transaksi ini untuk keperluan
                                    administrasi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Motor Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24 shadow-sm">
                                    <div className="aspect-video bg-gray-100 overflow-hidden flex items-center justify-center p-4">
                                        <img
                                            src={`/storage/${transaction.motor.image_path}`}
                                            alt={transaction.motor.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 mb-4">
                                            {transaction.motor.name}
                                        </h3>
                                        <div className="space-y-3 mb-5 pb-5 border-b border-gray-200">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Tipe
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {transaction.motor.type}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Tahun
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {transaction.motor.year}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Harga
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        transaction.motor.price,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                            <p className="text-xs font-semibold text-blue-900">
                                                ID Transaksi
                                            </p>
                                            <p className="font-mono text-sm font-bold text-blue-600 mt-1">
                                                {transaction.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Order Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Customer Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User
                                                size={20}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Informasi Pelanggan
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Nama Lengkap
                                            </label>
                                            <p className="font-semibold text-gray-900">
                                                {transaction.customer_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Nomor Telepon
                                            </label>
                                            <p className="font-semibold text-gray-900">
                                                {transaction.customer_phone}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Pekerjaan
                                            </label>
                                            <p className="font-semibold text-gray-900">
                                                {
                                                    transaction.customer_occupation
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Jenis Transaksi
                                            </label>
                                            <p className="font-semibold text-gray-900">
                                                {isCredit ? "Kredit" : "Cash"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Credit Details (if applicable) */}
                                {isCredit && transaction.credit_detail && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <CreditCard
                                                    size={20}
                                                    className="text-blue-600"
                                                />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Simulasi Kredit
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Uang Muka
                                                </label>
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .down_payment,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Tenor
                                                </label>
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        transaction
                                                            .credit_detail.tenor
                                                    }{" "}
                                                    Bulan
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Cicilan/Bulan
                                                </label>
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .monthly_installment,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                {transaction.installments &&
                                    transaction.installments.length > 0 && (
                                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Wallet
                                                        size={20}
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                                <h2 className="text-lg font-bold text-gray-900">
                                                    Pembayaran
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
                                                            ? "Uang Muka (DP)"
                                                            : "Booking Fee"
                                                    }
                                                    isLoading={isLoadingPay}
                                                    onPay={handleOnlinePayment}
                                                    formatCurrency={
                                                        formatCurrency
                                                    }
                                                />
                                            )}

                                            {/* Pelunasan (if booking fee paid) */}
                                            {!isCredit &&
                                                transaction.installments?.find(
                                                    (i) =>
                                                        i.installment_number ===
                                                        0,
                                                )?.status === "paid" &&
                                                transaction.installments?.find(
                                                    (i) =>
                                                        i.installment_number ===
                                                        1,
                                                ) && (
                                                    <div className="mt-5 pt-5 border-t border-gray-200">
                                                        <CashPaymentModule
                                                            installment={transaction.installments.find(
                                                                (i) =>
                                                                    i.installment_number ===
                                                                    1,
                                                            )}
                                                            type="Pelunasan Unit"
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
                                        className={`${transaction.documents_complete ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"} border rounded-lg p-6`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`p-3 ${transaction.documents_complete ? "bg-green-100" : "bg-blue-100"} rounded-lg shrink-0`}
                                            >
                                                {transaction.documents_complete ? (
                                                    <CheckCircle
                                                        size={20}
                                                        className="text-green-600"
                                                    />
                                                ) : (
                                                    <AlertCircle
                                                        size={20}
                                                        className="text-blue-600"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3
                                                    className={`font-bold ${transaction.documents_complete ? "text-green-900" : "text-blue-900"} mb-2`}
                                                >
                                                    {transaction.documents_complete
                                                        ? "Dokumen Berhasil Diunggah"
                                                        : "Lengkapi Dokumen Anda"}
                                                </h3>
                                                <p
                                                    className={`text-sm ${transaction.documents_complete ? "text-green-800" : "text-blue-800"} mb-4`}
                                                >
                                                    {transaction.documents_complete
                                                        ? "Dokumen Anda telah lengkap dan sedang dalam proses verifikasi oleh tim kami."
                                                        : "Upload KTP, Kartu Keluarga, dan Slip Gaji untuk melanjutkan proses verifikasi kredit Anda."}
                                                </p>
                                                <Link
                                                    href={route(
                                                        transaction.documents_complete
                                                            ? "motors.manage-documents"
                                                            : "motors.upload-credit-documents",
                                                        transaction.id,
                                                    )}
                                                    className={`inline-flex items-center gap-2 px-6 py-2 ${transaction.documents_complete ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"} text-white font-semibold rounded-lg transition-colors`}
                                                >
                                                    {transaction.documents_complete ? (
                                                        <>
                                                            <FileText
                                                                size={18}
                                                            />{" "}
                                                            Manage Dokumen
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload size={18} />{" "}
                                                            Upload Dokumen
                                                        </>
                                                    )}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={route("home")}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Home size={18} /> Beranda
                                    </Link>
                                    <Link
                                        href={route("motors.index")}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                    >
                                        <ArrowRight size={18} /> Cari Motor Lain
                                    </Link>
                                    <button
                                        onClick={() => window.print()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Download size={18} /> Print
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
                        <CheckCircle className="text-green-500" size={18} />
                    ) : (
                        <AlertCircle className="text-yellow-500" size={18} />
                    )}
                    <h5 className="font-bold text-gray-900">{type}</h5>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(installment.amount)}
                </div>
                <p
                    className={`text-xs mt-1 ${
                        isPaid ? "text-green-600" : "text-yellow-600"
                    }`}
                >
                    {isPaid
                        ? "Pembayaran telah diverifikasi"
                        : "⚠ Segera selesaikan pembayaran"}
                </p>
            </div>

            {!isPaid && (
                <button
                    onClick={() => onPay(installment)}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                    {isLoading ? "Memproses..." : "Bayar Sekarang"}
                </button>
            )}
        </div>
    );
}
