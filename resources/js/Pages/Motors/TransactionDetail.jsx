import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import SurveyScheduleCard from "@/Components/SurveyScheduleCard";
import CreditStatusDisplay from "@/Components/CreditStatusDisplay";
import Swal from "sweetalert2";
import {
    ChevronLeft,
    Calendar,
    DollarSign,
    FileText,
    AlertCircle,
    CheckCircle,
    Clock,
    MapPin,
    User,
    Phone,
    ChevronDown,
    ChevronUp,
    XCircle,
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
            // New 10-status credit flow
            pengajuan_masuk: "info",
            verifikasi_dokumen: "warning",
            dikirim_ke_leasing: "info",
            survey_dijadwalkan: "warning",
            survey_berjalan: "warning",
            menunggu_keputusan_leasing: "info",
            disetujui: "success",
            ditolak: "danger",
            dp_dibayar: "success",
            selesai: "success",
            // Old statuses for backward compatibility
            menunggu_persetujuan: "warning",
            data_tidak_valid: "danger",
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
            // Transaction statuses
            waiting_credit_approval: "warning",
            survey_scheduled: "warning",
            survey_in_progress: "warning",
            unit_preparation: "info",
            ready_for_delivery: "success",
        };

        return statusMap[status] || "secondary";
    };

    const getStatusLabel = (status) => {
        const labels = {
            // New 10-status credit flow
            pengajuan_masuk: "Pengajuan Masuk",
            verifikasi_dokumen: "Verifikasi Dokumen",
            dikirim_ke_leasing: "Dikirim ke Leasing",
            survey_dijadwalkan: "Survey Dijadwalkan",
            survey_berjalan: "Survey Sedang Berlangsung",
            menunggu_keputusan_leasing: "Menunggu Keputusan",
            disetujui: "Disetujui",
            ditolak: "Ditolak",
            dp_dibayar: "DP Dibayar",
            selesai: "Selesai",
            // Old statuses for backward compatibility
            menunggu_persetujuan: "Menunggu Persetujuan",
            data_tidak_valid: "Data Tidak Valid",
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
            // Transaction statuses
            waiting_credit_approval: "Menunggu Persetujuan Kredit",
            survey_scheduled: "Survey Dijadwalkan",
            survey_in_progress: "Survey Sedang Berlangsung",
            unit_preparation: "Persiapan Unit",
            ready_for_delivery: "Siap Dikirim",
        };

        return labels[status] || status;
    };

    const isCreditOrder =
        transaction.transaction_type === "CREDIT" && !!transaction.creditDetail;

    // Check if survey is scheduled (from surveySchedules or from credit_details fields)
    const handleCancel = () => {
        const allowedCashStatuses = ["new_order", "waiting_payment"];
        const allowedCreditStatuses = [
            "menunggu_persetujuan",
            "waiting_credit_approval",
        ];
        const isAllowed =
            transaction.transaction_type === "CASH"
                ? allowedCashStatuses.includes(transaction.status)
                : allowedCreditStatuses.includes(transaction.status);

        if (!isAllowed) {
            Swal.fire({
                icon: "error",
                title: "Opps...",
                text: "Pesanan tidak dapat dibatalkan pada tahap ini. Silakan hubungi admin.",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        Swal.fire({
            title: "Batalkan Pesanan?",
            text: "Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan.",
            icon: "warning",
            input: "textarea",
            inputPlaceholder: "Berikan alasan pembatalan (opsional)...",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Batalkan!",
            cancelButtonText: "Batal",
            showLoaderOnConfirm: true,
            preConfirm: (reason) => {
                return router.post(
                    route("motors.cancel", transaction.id),
                    { cancellation_reason: reason },
                    {
                        onSuccess: () => {
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil",
                                text: "Pesanan Anda telah dibatalkan.",
                                confirmButtonColor: "#3b82f6",
                            });
                        },
                        onError: () => {
                            Swal.fire({
                                icon: "error",
                                title: "Gagal",
                                text: "Terjadi kesalahan saat membatalkan pesanan.",
                                confirmButtonColor: "#3b82f6",
                            });
                        },
                    },
                );
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });
    };

    const allowedCashStatuses = ["new_order", "waiting_payment"];
    const allowedCreditStatuses = [
        "menunggu_persetujuan",
        "waiting_credit_approval",
    ];
    const canCancel =
        !transaction.is_cancelled &&
        (transaction.transaction_type === "CASH"
            ? allowedCashStatuses.includes(transaction.status)
            : allowedCreditStatuses.includes(transaction.status));

    const survey =
        transaction.creditDetail?.surveySchedules?.[0] ||
        (transaction.creditDetail?.survey_scheduled_date
            ? {
                  scheduled_date:
                      transaction.creditDetail.survey_scheduled_date,
                  scheduled_time:
                      transaction.creditDetail.survey_scheduled_time,
                  surveyor_name: transaction.creditDetail.surveyor_name,
                  surveyor_phone: transaction.creditDetail.surveyor_phone,
              }
            : null);

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
                                {canCancel && (
                                    <button
                                        onClick={handleCancel}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all text-sm font-medium border border-white border-opacity-30"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Batalkan Pesanan
                                    </button>
                                )}
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
                                        {transaction.transaction_type ===
                                        "CREDIT"
                                            ? "Kredit"
                                            : "Tunai"}
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
                                            transaction.motor.price,
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
                                            Lembaga Pembiayaan
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {transaction.creditDetail.leasing_provider?.name || "Belum ditentukan"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            No. Referensi
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {transaction.creditDetail.reference_number || "-"}
                                        </p>
                                    </div>
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
                                            Cicilan Bulanan
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(
                                                transaction.creditDetail
                                                    .monthly_installment,
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
                                                parseFloat(
                                                    transaction.creditDetail
                                                        .down_payment || 0,
                                                ) +
                                                    parseFloat(
                                                        transaction.creditDetail
                                                            .monthly_installment ||
                                                            0,
                                                    ) *
                                                        parseInt(
                                                            transaction
                                                                .creditDetail
                                                                .tenor || 0,
                                                        ),
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Credit Status - Using new CreditStatusDisplay component */}
                                <CreditStatusDisplay
                                    credit={transaction.creditDetail}
                                />
                            </div>
                        )}

                        {/* Customer Information */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Informasi Pelanggan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400 text-xs">Nama Lengkap (Sesuai KTP)</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{transaction.name || transaction.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400 text-xs">NIK (Nomor Induk Kependudukan)</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{transaction.nik || "-"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400 text-xs">Nomor WhatsApp</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{transaction.phone || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400 text-xs">Pekerjaan</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{transaction.occupation || "-"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400 text-xs">Alamat Lengkap</p>
                                            <p className="font-semibold text-slate-900 dark:text-white leading-relaxed">{transaction.address || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Survey Schedule */}
                        {isCreditOrder && survey && (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                                <button
                                    onClick={() =>
                                        setExpandedSection(
                                            expandedSection === "survey"
                                                ? null
                                                : "survey",
                                        )
                                    }
                                    className="w-full flex justify-between items-center"
                                >
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Jadwal Survei
                                    </h2>
                                    {expandedSection === "survey" ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500 transition-transform" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
                                    )}
                                </button>

                                {expandedSection === "survey" && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Tanggal
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {new Date(
                                                        survey.scheduled_date,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Waktu
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {survey.scheduled_time ||
                                                        "Belum ditentukan"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Surveyor
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {survey.surveyor_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    No. WhatsApp
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {survey.surveyor_phone ||
                                                        "Belum tersedia"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Installments */}
                        {isCreditOrder &&
                            transaction.installments &&
                            transaction.installments.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                                    <button
                                        onClick={() =>
                                            setExpandedSection(
                                                expandedSection ===
                                                    "installments"
                                                    ? null
                                                    : "installments",
                                            )
                                        }
                                        className="w-full flex justify-between items-center mb-4"
                                    >
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            Jadwal Cicilan (
                                            {transaction.installments.length})
                                        </h2>
                                        {expandedSection === "installments" ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500 transition-transform" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
                                        )}
                                    </button>
                                    {expandedSection === "installments" && (
                                        <div className="space-y-2">
                                            {transaction.installments.map(
                                                (installment, idx) => (
                                                    <div
                                                        key={installment.id}
                                                        className={`p-3 border rounded-lg text-sm ${
                                                            installment.status ===
                                                            "paid"
                                                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                                : installment.status ===
                                                                    "overdue"
                                                                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                                                  : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                                    {installment.installment_number ===
                                                                    0
                                                                        ? "DP"
                                                                        : `Cicilan #${installment.installment_number}`}
                                                                </p>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                                    {new Date(
                                                                        installment.due_date,
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            day: "numeric",
                                                                            month: "short",
                                                                        },
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-slate-900 dark:text-white">
                                                                    {formatCurrency(
                                                                        installment.amount,
                                                                    )}
                                                                </p>
                                                                <span
                                                                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1 ${
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
                                    )}
                                </div>
                            )}

                        {/* Documents */}
                        {isCreditOrder &&
                            transaction.creditDetail.documents &&
                            transaction.creditDetail.documents.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                                    <button
                                        onClick={() =>
                                            setExpandedSection(
                                                expandedSection === "documents"
                                                    ? null
                                                    : "documents",
                                            )
                                        }
                                        className="w-full flex justify-between items-center mb-4"
                                    >
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            Dokumen (
                                            {
                                                transaction.creditDetail
                                                    .documents.length
                                            }
                                            )
                                        </h2>
                                        {expandedSection === "documents" ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500 transition-transform" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
                                        )}
                                    </button>
                                    {expandedSection === "documents" && (
                                        <div className="space-y-2">
                                            {transaction.creditDetail.documents.map(
                                                (doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className={`flex items-center justify-between p-3 border rounded-lg text-sm ${
                                                            doc.approval_status ===
                                                            "approved"
                                                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                                : doc.approval_status ===
                                                                    "rejected"
                                                                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                                                  : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                                    {doc.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {new Date(
                                                                        doc.created_at,
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            day: "numeric",
                                                                            month: "short",
                                                                        },
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap ml-2 ${
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
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
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
                                            transaction.motor.price,
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
                                                    transaction.motor.price -
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
                                                        .monthly_installment,
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
                                <>
                                    <Link
                                        href={route(
                                            "motors.manage-documents",
                                            transaction.id,
                                        )}
                                        className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
                                    >
                                        Kelola Dokumen
                                    </Link>
                                </>
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
