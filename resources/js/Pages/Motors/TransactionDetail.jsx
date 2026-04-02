import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import SurveyScheduleCard from "@/Components/SurveyScheduleCard";
import CreditStatusDisplay from "@/Components/CreditStatusDisplay";
import CashStatusDisplay from "@/Components/CashStatusDisplay";
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
            // Transaction & Cash statuses
            new_order: "warning",
            waiting_payment: "warning",
            payment_confirmed: "success",
            unit_preparation: "info",
            ready_for_delivery: "info",
            dalam_pengiriman: "info",
            completed: "success",
            cancelled: "danger",
            // Transaction statuses
            waiting_credit_approval: "warning",
            survey_scheduled: "warning",
            survey_in_progress: "warning",
        };

        return statusMap[status] || "secondary";
    };

    const getStatusLabel = (status) => {
        const statusKey = (status || "").toLowerCase();
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
            new_order: "Pesanan Masuk",
            waiting_payment: "Menunggu Pembayaran",
            payment_confirmed: "Pembayaran Dikonfirmasi",
            pembayaran_dikonfirmasi: "Pembayaran Dikonfirmasi",
            unit_preparation: "Motor Disiapkan",
            ready_for_delivery: "Siap Dikirim/Ambil",
            dalam_pengiriman: "Dalam Pengiriman",
            completed: "Selesai",
            waiting_credit_approval: "Menunggu Persetujuan Kredit",
            survey_scheduled: "Survey Dijadwalkan",
            survey_in_progress: "Survey Sedang Berlangsung",
        };

        return labels[statusKey] || status.replace(/_/g, " ").toUpperCase();
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
        transaction.status !== "cancelled" &&
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
            <div className="bg-slate-50 min-h-screen pt-[110px] sm:pt-32 pb-12">
                {/* Modern Header */}
                <div className="bg-black text-white rounded-none border-b border-black mb-8 pt-6 pb-12 px-4 relative overflow-hidden">
                    {/* Decorative Blurs */}
                    
                    <div className="container mx-auto max-w-7xl relative z-10">
                        {/* Back Button */}
                        <Link
                            href={route("motors.user-transactions")}
                            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-black transition-colors hover:-translate-x-1 mb-6 bg-transparent hover:bg-white py-2 px-4 rounded-none border border-white w-fit"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Kembali ke Daftar Transaksi
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                                    Detail Transaksi
                                </h1>
                                <p className="text-slate-400 font-medium">
                                    Kelola dan pantau detail pesanan motor Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            <main className="container mx-auto px-4 max-w-7xl">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-black rounded-none border border-black overflow-hidden relative">
                            {/* Decorative Blur */}
                            
                            <div className="relative z-10 p-8 sm:p-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Order ID
                                        </p>
                                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                            #{String(transaction.id).padStart(6, "0")}
                                        </h1>
                                    </div>
                                    <div className="shrink-0">
                                        <span
                                            className={`inline-flex items-center justify-center px-4 py-2 rounded-none font-bold text-[10px] uppercase tracking-widest border ${
                                                getStatusColor(transaction.status) === "success"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : getStatusColor(transaction.status) === "warning"
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    : getStatusColor(transaction.status) === "danger"
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                                            }`}
                                        >
                                            {getStatusLabel(transaction.status)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-slate-300 mb-1">Unit yang Dipesan</p>
                                    <p className="text-2xl font-black text-white">
                                        {transaction.motor.name}
                                    </p>
                                </div>
                            </div>

                            <div className="px-8 sm:px-10 py-6 bg-slate-800/50 border-t border-slate-800 grid grid-cols-2 gap-6 relative z-10">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Tanggal Order
                                    </p>
                                    <p className="text-base font-bold text-white">
                                        {new Date(transaction.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="sm:border-l sm:border-slate-700 sm:pl-6">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                                        Tipe Transaksi
                                    </p>
                                    <p className="text-base font-bold text-white">
                                        {transaction.transaction_type === "CREDIT" ? "Pembiayaan Kredit" : "Tunai"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Motor Details */}
                        <div className="bg-white rounded-none border border-slate-300 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">
                                    Rincian Unit Motor
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                        Merk
                                    </p>
                                    <p className="font-bold text-slate-900">
                                        {transaction.motor.brand}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                        Model
                                    </p>
                                    <p className="font-bold text-slate-900">
                                        {transaction.motor.model}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                        Tahun
                                    </p>
                                    <p className="font-bold text-slate-900">
                                        {transaction.motor.year}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                        Warna
                                    </p>
                                    <p className="font-bold text-slate-900">
                                        {transaction.motor_color || "Belum dipilih"}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                    Harga OTR
                                </p>
                                <p className="text-2xl font-black text-primary">
                                    {formatCurrency(transaction.motor.price)}
                                </p>
                            </div>
                        </div>

                        {/* Credit Details */}
                        {isCreditOrder && (
                            <div className="bg-white rounded-none border border-slate-300 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">
                                        Rincian Kredit
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Lembaga
                                        </p>
                                        <p className="font-bold text-slate-900">
                                            {transaction.creditDetail.leasing_provider?.name || "Belum ditentukan"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Referensi
                                        </p>
                                        <p className="font-bold text-slate-900">
                                            {transaction.creditDetail.reference_number || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Deposit (DP)
                                        </p>
                                        <p className="font-bold text-slate-900">
                                            {formatCurrency(transaction.creditDetail.down_payment)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Tenor
                                        </p>
                                        <p className="font-bold text-slate-900">
                                            {transaction.creditDetail.tenor} Bulan
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Bunga
                                        </p>
                                        <p className="font-bold text-slate-900">
                                            {transaction.creditDetail.interest_rate}% / Bln
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                            Angsuran
                                        </p>
                                        <p className="font-bold text-slate-900">
                                            {formatCurrency(transaction.creditDetail.monthly_installment)}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-100 rounded-none p-6 border border-gray-300 mb-8">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                            Estimasi Total Keseluruhan
                                        </span>
                                        <p className="text-2xl font-black text-blue-600">
                                            {formatCurrency(
                                                parseFloat(transaction.creditDetail.down_payment || 0) +
                                                (parseFloat(transaction.creditDetail.monthly_installment || 0) * parseInt(transaction.creditDetail.tenor || 0))
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Display */}
                                {isCreditOrder ? (
                                    <CreditStatusDisplay
                                        credit={transaction.creditDetail}
                                        showSurvey={false}
                                    />
                                ) : (
                                    <CashStatusDisplay
                                        transaction={transaction}
                                    />
                                )}
                            </div>
                        )}

                        {/* Customer Information */}
                        <div className="bg-white rounded-none border border-slate-300 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">
                                    Informasi Pelanggan
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                                            Nama Lengkap (Sesuai KTP)
                                        </p>
                                        <p className="font-bold text-slate-900">{transaction.name || transaction.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                                            NIK Kependudukan
                                        </p>
                                        <p className="font-bold text-slate-900">{transaction.nik || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                                            Nomor WhatsApp
                                        </p>
                                        <p className="font-bold text-slate-900">{transaction.phone || "-"}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                                            Pekerjaan
                                        </p>
                                        <p className="font-bold text-slate-900">{transaction.occupation || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                                            Alamat Lengkap
                                        </p>
                                        <p className="font-bold text-slate-900 leading-relaxed max-w-sm">{transaction.address || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Survey Schedule */}
                        {isCreditOrder && survey && (
                            <div className="bg-white rounded-none border border-slate-300 p-8">
                                <button
                                    onClick={() =>
                                        setExpandedSection(
                                            expandedSection === "survey"
                                                ? null
                                                : "survey"
                                        )
                                    }
                                    className="w-full flex justify-between items-center group mb-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                            Jadwal Survei
                                        </h2>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors">
                                        {expandedSection === "survey" ? (
                                            <ChevronUp className="w-5 h-5 transition-transform" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 transition-transform" />
                                        )}
                                    </div>
                                </button>

                                {expandedSection === "survey" && (
                                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> Tanggal
                                            </p>
                                            <p className="font-bold text-slate-900">
                                                {new Date(survey.scheduled_date).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" /> Waktu
                                            </p>
                                            <p className="font-bold text-slate-900">
                                                {survey.scheduled_time || "Belum ditentukan"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> Surveyor
                                            </p>
                                            <p className="font-bold text-slate-900">
                                                {survey.surveyor_name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5" /> No. WhatsApp
                                            </p>
                                            <p className="font-bold text-slate-900">
                                                {survey.surveyor_phone || "Belum tersedia"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Installments / Payments */}
                        {transaction.installments &&
                            transaction.installments.length > 0 && (
                                <div className="bg-white rounded-none border border-slate-300 p-8">
                                    <button
                                        onClick={() =>
                                            setExpandedSection(
                                                expandedSection === "installments"
                                                    ? null
                                                    : "installments"
                                            )
                                        }
                                        className="w-full flex justify-between items-center group mb-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                                Riwayat Pembayaran ({transaction.installments.length})
                                            </h2>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors">
                                            {expandedSection === "installments" ? (
                                                <ChevronUp className="w-5 h-5 transition-transform" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 transition-transform" />
                                            )}
                                        </div>
                                    </button>
                                    {expandedSection === "installments" && (
                                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                                            {transaction.installments.map((installment, idx) => (
                                                <div
                                                    key={installment.id}
                                                    className={`p-5 rounded-none border transition-colors ${
                                                        installment.status === "paid"
                                                            ? "bg-emerald-50/50 border-emerald-100"
                                                            : installment.status === "overdue"
                                                            ? "bg-rose-50/50 border-rose-100"
                                                            : "bg-slate-50 border-slate-100"
                                                    }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                        <div>
                                                            <p className="font-black text-slate-900 mb-1">
                                                                {installment.installment_number === 0
                                                                    ? (transaction.transaction_type === "CASH" ? "Booking Fee" : "DP")
                                                                    : `Angsuran Bulan ke-${installment.installment_number}`}
                                                            </p>
                                                            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                Tenggat: {new Date(installment.due_date).toLocaleDateString("id-ID", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="sm:text-right">
                                                            <p className="font-black text-slate-900 text-lg">
                                                                {formatCurrency(installment.amount)}
                                                            </p>
                                                            <span
                                                                className={`inline-flex mt-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                                                                    installment.status === "paid"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : installment.status === "overdue"
                                                                        ? "bg-rose-100 text-rose-700"
                                                                        : "bg-amber-100 text-amber-700"
                                                                }`}
                                                            >
                                                                {installment.status === "paid"
                                                                    ? "Lunas"
                                                                    : installment.status === "overdue"
                                                                    ? "Tertunggak"
                                                                    : "Ditinjau / Menunggu"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        {/* Documents */}
                        {isCreditOrder &&
                            transaction.creditDetail.documents &&
                            transaction.creditDetail.documents.length > 0 && (
                                <div className="bg-white rounded-none border border-slate-300 p-8">
                                    <button
                                        onClick={() =>
                                            setExpandedSection(
                                                expandedSection === "documents"
                                                    ? null
                                                    : "documents"
                                            )
                                        }
                                        className="w-full flex justify-between items-center group mb-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                                Dokumen Persyaratan ({transaction.creditDetail.documents.length})
                                            </h2>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors">
                                            {expandedSection === "documents" ? (
                                                <ChevronUp className="w-5 h-5 transition-transform" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 transition-transform" />
                                            )}
                                        </div>
                                    </button>
                                    {expandedSection === "documents" && (
                                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                                            {transaction.creditDetail.documents.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className={`p-4 rounded-2xl flex items-center justify-between transition-colors border ${
                                                        doc.approval_status === "approved"
                                                            ? "bg-emerald-50/50 border-emerald-100"
                                                            : doc.approval_status === "rejected"
                                                            ? "bg-rose-50/50 border-rose-100"
                                                            : "bg-slate-50 border-slate-100"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                            doc.approval_status === "approved" ? "bg-emerald-100 text-emerald-600" :
                                                            doc.approval_status === "rejected" ? "bg-rose-100 text-rose-600" :
                                                            "bg-slate-200 text-slate-500"
                                                        }`}>
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">
                                                                {doc.name}
                                                            </p>
                                                            <p className="text-xs font-medium text-slate-500">
                                                                Diupload: {new Date(doc.created_at).toLocaleDateString("id-ID", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap ${
                                                            doc.approval_status === "approved"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : doc.approval_status === "rejected"
                                                                ? "bg-rose-100 text-rose-700"
                                                                : "bg-amber-100 text-amber-700"
                                                        }`}
                                                    >
                                                        {doc.approval_status === "approved"
                                                            ? "Terverifikasi"
                                                            : doc.approval_status === "rejected"
                                                            ? "Ditolak"
                                                            : "Menunggu"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
                        {/* Summary Card */}
                        <div className="bg-black text-white rounded-none border border-black p-8 relative overflow-hidden">
                            
                            <h3 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
                                Ringkasan
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="pb-6 border-b border-slate-700/50">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                        Harga Motor
                                    </p>
                                    <p className="text-3xl font-black text-white">
                                        {formatCurrency(transaction.motor.price)}
                                    </p>
                                </div>
                                
                                {isCreditOrder ? (
                                    <>
                                        <div className="pb-6 border-b border-slate-700/50">
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                Deposit (DP) Awal
                                            </p>
                                            <p className="text-2xl font-black text-white">
                                                {formatCurrency(transaction.creditDetail?.down_payment || 0)}
                                            </p>
                                        </div>
                                        <div className="pb-6 border-b border-slate-700/50">
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                Total Pembiayaan (Pokok Hutang)
                                            </p>
                                            <p className="text-2xl font-black text-white">
                                                {formatCurrency(transaction.motor.price - (transaction.creditDetail?.down_payment || 0))}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                Estimasi Angsuran
                                            </p>
                                            <p className="text-3xl font-black text-white">
                                                {formatCurrency(transaction.creditDetail?.monthly_installment || 0)}
                                            </p>
                                            <span className="inline-block text-[10px] font-bold text-white mt-2 bg-transparent border border-white px-3 py-1.5 rounded-none uppercase tracking-widest">
                                                {transaction.creditDetail?.tenor || 0} Bulan Tenor
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="pb-6 border-b border-slate-700/50">
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                Booking Fee
                                            </p>
                                            <p className="text-2xl font-black text-emerald-400">
                                                {formatCurrency(transaction.booking_fee || 0)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                Sisa Pelunasan
                                            </p>
                                            <p className="text-3xl font-black text-white">
                                                {formatCurrency(transaction.motor.price - (transaction.booking_fee || 0))}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Card - New Location for Cancel Button */}
                        {canCancel && (
                            <div className="bg-white rounded-none shadow-none border border-slate-300 p-8 overflow-hidden relative group">
                                
                                <h3 className="text-lg font-black text-slate-900 mb-2 relative z-10">Bantuan</h3>
                                <p className="text-slate-500 text-sm mb-6 relative z-10 font-bold">
                                    Jika Anda ingin membatalkan pesanan ini, silakan klik tombol di bawah.
                                </p>
                                <button
                                    onClick={handleCancel}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white hover:bg-black hover:text-white text-black border-2 border-black rounded-none font-bold uppercase tracking-widest text-[10px] transition-all relative z-10"
                                >
                                    <XCircle className="w-4 h-4" />
                                    BATALKAN PESANAN
                                </button>
                            </div>
                        )}

                        {/* Need Help Card */}
                        <div className="bg-white border border-black rounded-none p-8">
                            <div className="w-12 h-12 bg-black rounded-none flex items-center justify-center text-white mb-4">
                                <Phone className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-black uppercase tracking-widest mb-2">
                                Butuh Bantuan?
                            </h3>
                            <p className="text-sm font-bold text-gray-600 mb-6 leading-relaxed">
                                Tim kami siap membantu Anda melalui WhatsApp jika ada kendala.
                            </p>
                            <a
                                href="https://wa.me/628123456789"
                                target="_blank"
                                className="inline-flex w-full items-center justify-center gap-2 px-5 py-4 bg-black border border-black hover:bg-white hover:text-black text-white rounded-none transition-colors font-bold text-[10px] uppercase tracking-widest"
                            >
                                CHAT VIA WHATSAPP
                            </a>
                        </div>
                    </aside>
                </div>
            </main>
            </div>
        </PublicLayout>
    );
}
