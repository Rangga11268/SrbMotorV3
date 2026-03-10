import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import SurveyScheduleCard from "@/Components/SurveyScheduleCard";
import {
    ChevronLeft,
    Calendar,
    DollarSign,
    FileText,
    AlertCircle,
    CheckCircle,
    Clock,
    MapPin,
} from "lucide-react";

export default function TransactionDetail({ transaction }) {
    const [expandedSection, setExpandedSection] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const statusMap = {
            menunggu_persetujuan: "warning",
            disetujui: "success",
            ditolak: "danger",
            dikirim_ke_surveyor: "info",
            jadwal_survey: "info",
            survey_selesai: "success",
            dibayar: "success",
            cancelled: "danger",
            new_order: "warning",
            pending: "warning",
            approved: "success",
            rejected: "danger",
            completed: "success",
        };

        return statusMap[status] || "secondary";
    };

    const getStatusLabel = (status) => {
        const labels = {
            menunggu_persetujuan: "Menunggu Persetujuan",
            disetujui: "Disetujui",
            ditolak: "Ditolak",
            dikirim_ke_surveyor: "Dikirim ke Surveyor",
            jadwal_survey: "Jadwal Survey",
            survey_selesai: "Survey Selesai",
            dibayar: "Dibayar",
            cancelled: "Dibatalkan",
            new_order: "Order Baru",
            pending: "Tertunda",
            approved: "Disetujui",
            rejected: "Ditolak",
            completed: "Selesai",
        };

        return labels[status] || status;
    };

    const isCreditOrder = !!transaction.creditDetail;
    const survey = transaction.creditDetail?.surveySchedules?.[0];

    return (
        <PublicLayout title="Detail Transaksi">
            <main className="flex-grow container mx-auto px-4 py-12">
                {/* Back Button */}
                <Link
                    href={route("motors.user-transactions")}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6 font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali ke Transaksi
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-blue-100 text-sm">
                                            Order ID
                                        </p>
                                        <h1 className="text-3xl font-bold">
                                            #{transaction.id}
                                        </h1>
                                    </div>
                                    <span
                                        className={`px-4 py-2 rounded-full font-semibold text-sm bg-opacity-20 ${
                                            getStatusColor(
                                                transaction.status,
                                            ) === "success"
                                                ? "bg-green-500 text-green-100"
                                                : getStatusColor(
                                                        transaction.status,
                                                    ) === "warning"
                                                  ? "bg-yellow-500 text-yellow-100"
                                                  : getStatusColor(
                                                          transaction.status,
                                                      ) === "danger"
                                                    ? "bg-red-500 text-red-100"
                                                    : "bg-blue-500 text-blue-100"
                                        }`}
                                    >
                                        {getStatusLabel(transaction.status)}
                                    </span>
                                </div>
                                <p className="text-blue-100">
                                    {transaction.motor.name}
                                </p>
                            </div>

                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Tanggal Order
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        {new Date(
                                            transaction.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Tipe Order
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {isCreditOrder ? "Kredit" : "Tunai"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Motor Details */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Detail Motor
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Merk
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {transaction.motor.brand}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Model
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {transaction.motor.model}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Tahun
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {transaction.motor.year}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Warna
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {transaction.motor.color}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Harga
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(
                                            transaction.motor.harga,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Credit Details */}
                        {isCreditOrder && (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                    Detail Kredit
                                </h2>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            DP
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(
                                                transaction.creditDetail
                                                    .down_payment,
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Tenor
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {transaction.creditDetail.tenor}{" "}
                                            Bulan
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Bunga
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {
                                                transaction.creditDetail
                                                    .interest_rate
                                            }
                                            % per Bulan
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Cicilan
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(
                                                transaction.creditDetail
                                                    .monthly_payment,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Total Pembayaran
                                        </span>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrency(
                                                transaction.creditDetail
                                                    .down_payment +
                                                    transaction.creditDetail
                                                        .monthly_payment *
                                                        transaction.creditDetail
                                                            .tenor,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Credit Status */}
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Status Kredit
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-white capitalize">
                                        {getStatusLabel(
                                            transaction.creditDetail
                                                .credit_status,
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Survey Schedule Card */}
                        {isCreditOrder && survey && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Jadwal Survei
                                </h2>
                                <SurveyScheduleCard
                                    survey={survey}
                                    creditDetail={transaction.creditDetail}
                                    transactionId={transaction.id}
                                />
                            </div>
                        )}

                        {/* Installments */}
                        {isCreditOrder &&
                            transaction.installments &&
                            transaction.installments.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        Jadwal Cicilan
                                    </h2>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {transaction.installments.map(
                                            (installment, idx) => (
                                                <div
                                                    key={installment.id}
                                                    className={`p-4 border rounded-lg ${
                                                        installment.status ===
                                                        "paid"
                                                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                            : installment.status ===
                                                                "overdue"
                                                              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                                              : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                                Cicilan{" "}
                                                                {idx + 1} dari{" "}
                                                                {
                                                                    transaction
                                                                        .installments
                                                                        .length
                                                                }
                                                            </p>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                Jatuh tempo:{" "}
                                                                {new Date(
                                                                    installment.due_date,
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg text-slate-900 dark:text-white">
                                                                {formatCurrency(
                                                                    installment.amount,
                                                                )}
                                                            </p>
                                                            <span
                                                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                                                    installment.status ===
                                                                    "paid"
                                                                        ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                        : installment.status ===
                                                                            "overdue"
                                                                          ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                          : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                                }`}
                                                            >
                                                                {installment.status ===
                                                                "paid"
                                                                    ? "Lunas"
                                                                    : installment.status ===
                                                                        "overdue"
                                                                      ? "Tertunggak"
                                                                      : "Menunggu"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Documents */}
                        {isCreditOrder &&
                            transaction.creditDetail.documents &&
                            transaction.creditDetail.documents.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        Dokumen
                                    </h2>
                                    <div className="space-y-3">
                                        {transaction.creditDetail.documents.map(
                                            (doc) => (
                                                <div
                                                    key={doc.id}
                                                    className={`flex items-center justify-between p-4 border rounded-lg ${
                                                        doc.approval_status ===
                                                        "approved"
                                                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                            : doc.approval_status ===
                                                                "rejected"
                                                              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                                              : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                                {doc.name}
                                                            </p>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                {new Date(
                                                                    doc.created_at,
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded ${
                                                            doc.approval_status ===
                                                            "approved"
                                                                ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                : doc.approval_status ===
                                                                    "rejected"
                                                                  ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                  : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                        }`}
                                                    >
                                                        {doc.approval_status ===
                                                        "approved"
                                                            ? "Terverifikasi"
                                                            : doc.approval_status ===
                                                                "rejected"
                                                              ? "Ditolak"
                                                              : "Menunggu"}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">
                                Ringkasan
                            </h3>
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-blue-400/30">
                                    <p className="text-blue-100 text-sm mb-1">
                                        Harga Motor
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(
                                            transaction.motor.harga,
                                        )}
                                    </p>
                                </div>
                                {isCreditOrder && (
                                    <>
                                        <div className="pb-4 border-b border-blue-400/30">
                                            <p className="text-blue-100 text-sm mb-1">
                                                DP (Down Payment)
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(
                                                    transaction.creditDetail
                                                        .down_payment,
                                                )}
                                            </p>
                                        </div>
                                        <div className="pb-4 border-b border-blue-400/30">
                                            <p className="text-blue-100 text-sm mb-1">
                                                Sisa Pembayaran
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(
                                                    transaction.motor.harga -
                                                        transaction.creditDetail
                                                            .down_payment,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-blue-100 text-sm mb-1">
                                                Cicilan Bulanan
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(
                                                    transaction.creditDetail
                                                        .monthly_payment,
                                                )}
                                            </p>
                                            <p className="text-xs text-blue-200 mt-1">
                                                x{" "}
                                                {transaction.creditDetail.tenor}{" "}
                                                bulan
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-3">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                                Aksi Cepat
                            </h3>
                            <Link
                                href={route("motors.user-transactions")}
                                className="block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition text-center font-medium"
                            >
                                Kembali ke Daftar
                            </Link>
                            {isCreditOrder && (
                                <Link
                                    href={route(
                                        "motors.manage-documents",
                                        transaction.id,
                                    )}
                                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
                                >
                                    Kelola Dokumen
                                </Link>
                            )}
                        </div>

                        {/* Need Help */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                                Butuh Bantuan?
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                                Hubungi tim customer service kami untuk bantuan
                                lebih lanjut.
                            </p>
                            <a
                                href="https://wa.me/628123456789"
                                className="inline-block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium"
                            >
                                WhatsApp Kami
                            </a>
                        </div>
                    </aside>
                </div>
            </main>
        </PublicLayout>
    );
}
