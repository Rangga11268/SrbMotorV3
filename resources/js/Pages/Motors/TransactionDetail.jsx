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
    ArrowRight,
} from "lucide-react";
import TransactionTimeline from "@/Components/TransactionTimeline";

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
                {/* MODERN INDUSTRIAL HEADER */}
                <header className="bg-black text-white pt-16 pb-24 border-b border-gray-800 relative overflow-hidden mb-16">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="container mx-auto max-w-7xl px-4 relative z-10">
                        <Link
                            href={route("motors.user-transactions")}
                            className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#1c69d4] transition-all group uppercase mb-12"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            KEMBALI KE DAFTAR TRANSAKSI
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="bg-[#1c69d4] text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                                        ORDER #{String(transaction.id).padStart(6, "0")}
                                    </span>
                                    <span className="text-gray-500 font-bold text-[10px] tracking-widest uppercase">
                                        {new Date(transaction.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    DETAIL <span className="text-[#1c69d4]">TRANSAKSI</span>
                                </h1>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-3">
                                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">STATUS PESANAN SAAT INI</p>
                                <div className={`px-6 py-3 border-2 font-black text-xs tracking-[0.2em] uppercase rounded-none ${
                                    getStatusColor(transaction.status) === "success" ? "bg-[#1c69d4]/10 border-[#1c69d4] text-[#1c69d4]" :
                                    getStatusColor(transaction.status) === "warning" ? "bg-amber-500/10 border-amber-500 text-amber-500" :
                                    getStatusColor(transaction.status) === "danger" ? "bg-red-500/10 border-red-500 text-red-500" :
                                    "bg-gray-500/10 border-gray-500 text-gray-400"
                                }`}>
                                    {getStatusLabel(transaction.status)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

            <main className="container mx-auto px-4 max-w-7xl">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Rejection Notice */}
                        {(transaction.creditDetail?.status === 'ditolak' || transaction.creditDetail?.status === 'data_tidak_valid') && (transaction.creditDetail?.verification_notes || transaction.creditDetail?.rejection_reason) && (
                            <div className="bg-red-500 p-8 rounded-none border border-red-600 space-y-4">
                                <div className="flex items-center gap-4">
                                    <AlertCircle className="w-8 h-8 text-white" />
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">PERHATIAN: PENGAJUAN DITOLAK</h3>
                                </div>
                                <div className="bg-black/10 p-6 border-l-4 border-white/30">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">ALASAN PENOLAKAN:</p>
                                    <p className="text-white font-bold text-lg leading-tight">
                                        {transaction.creditDetail.verification_notes || transaction.creditDetail.rejection_reason}
                                    </p>
                                </div>
                                <p className="text-white/80 text-sm italic font-medium">
                                    Silakan hubungi customer service kami atau perbaiki data pengajuan Anda jika tersedia.
                                </p>
                            </div>
                        )}

                        {/* Header Card */}
                        <div className="bg-black rounded-none border border-black overflow-hidden relative">
                            {/* Decorative Blur */}
                            
                             <div className="relative z-10 p-8 sm:p-12">
                                <div className="flex flex-col lg:flex-row justify-between gap-12">
                                    <div className="flex-grow space-y-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div>
                                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                                    ORDER IDENTIFICATION
                                                </p>
                                                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                                                    #{String(transaction.id).padStart(6, "0")}
                                                </h1>
                                            </div>
                                            <div className="shrink-0">
                                                <div className={`px-6 py-3 border-2 font-black text-[10px] tracking-[0.2em] uppercase ${
                                                    getStatusColor(transaction.status) === "success" ? "bg-[#1c69d4]/10 border-[#1c69d4] text-[#1c69d4]" :
                                                    getStatusColor(transaction.status) === "warning" ? "bg-amber-500/10 border-amber-500 text-amber-500" :
                                                    getStatusColor(transaction.status) === "danger" ? "bg-red-500/10 border-red-500 text-red-500" :
                                                    "bg-white/5 border-white/20 text-white"
                                                }`}>
                                                    {getStatusLabel(transaction.status)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">UNIT YANG DIPESAN</p>
                                            <p className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-lg">
                                                {transaction.motor.name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* FILLING THE GAPS: Large Motor Silhouette/Image */}
                                    <div className="hidden lg:block w-72 h-44 relative shrink-0">
                                        <div className="absolute inset-0 bg-[#1c69d4] opacity-20 blur-[60px] rounded-full"></div>
                                        <img
                                            src={`/storage/${transaction.motor.image_path}`}
                                            alt={transaction.motor.name}
                                            className="w-full h-full object-contain relative z-10 filter brightness-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                        />
                                    </div>
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

                            {/* MOTOR PRODUCT SECTION */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-8 bg-[#1c69d4]"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">KENDARAAN YANG DIPESAN</h2>
                                </div>
                                
                                <div className="bg-gray-50 border border-gray-200 p-8 sm:p-12 flex flex-col md:flex-row gap-12 items-center">
                                    <div className="w-full md:w-1/2 aspect-video bg-white border border-gray-200 p-6 flex items-center justify-center relative shadow-sm group">
                                        <img
                                            src={`/storage/${transaction.motor.image_path}`}
                                            alt={transaction.motor.name}
                                            className="max-w-full max-h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 text-[9px] font-black tracking-widest uppercase">
                                            {transaction.motor.year} MODEL
                                        </div>
                                    </div>
                                    
                                    <div className="w-full md:w-1/2 space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">UNIT PEMESANAN</p>
                                            <h3 className="text-3xl font-black text-black uppercase tracking-tighter leading-tight">
                                                {transaction.motor.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">BRAND</p>
                                                <p className="text-sm font-bold uppercase">{transaction.motor.brand}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">VARIAN WARNA</p>
                                                <p className="text-sm font-bold uppercase text-[#1c69d4]">{transaction.motor_color || "STANDARD"}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">NILAI KENDARAAN (OTR)</p>
                                            <p className="text-3xl font-black text-black">
                                                {formatCurrency(transaction.motor.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* CUSTOMER INFORMATION SECTION */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-8 bg-black"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">INFORMASI PELANGGAN</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 shadow-xl">
                                    {[
                                        { label: "NAMA LENGKAP (SESUAI KTP)", value: transaction.name || transaction.user?.name },
                                        { label: "NIK KEPENDUDUKAN", value: transaction.nik || "TIDAK TERSEDIA" },
                                        { label: "NOMOR WHATSAPP", value: transaction.phone || "TIDAK TERSEDIA" },
                                        { label: "PEKERJAAN", value: transaction.occupation || "TIDAK TERSEDIA" }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-8">
                                            <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2">{item.label}</p>
                                            <p className="font-bold text-black uppercase tracking-tight">{item.value}</p>
                                        </div>
                                    ))}
                                    <div className="bg-white p-8 md:col-span-2 border-t border-gray-100">
                                        <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2">ALAMAT PENGIRIMAN / DOMISILI</p>
                                        <p className="font-bold text-black uppercase tracking-tight leading-relaxed">
                                            {transaction.address || "ALAMAT BELUM DILENGKAPI"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* TRANSACTION DETAILS SECTION (CASH/CREDIT) */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-8 bg-[#1c69d4]"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">
                                        RINCIAN {transaction.transaction_type}
                                    </h2>
                                </div>

                                {isCreditOrder ? (
                                    <div className="space-y-0 border border-gray-200 overflow-hidden">
                                        {/* CREDIT — Dark Header Bar */}
                                        <div className="bg-black px-10 py-6 flex items-center gap-4">
                                            <div className="w-2 h-6 bg-[#1c69d4]"></div>
                                            <p className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">DETAIL PEMBIAYAAN KREDIT</p>
                                        </div>

                                        {/* Key Metrics Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
                                            <div className="bg-white px-8 py-8">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3">UANG MUKA (DP)</p>
                                                <p className="text-2xl font-black text-[#1c69d4] tracking-tighter">{formatCurrency(transaction.creditDetail.down_payment)}</p>
                                            </div>
                                            <div className="bg-white px-8 py-8">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3">ANGSURAN / BULAN</p>
                                                <p className="text-2xl font-black text-black tracking-tighter">{formatCurrency(transaction.creditDetail.monthly_installment)}</p>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mt-1">{transaction.creditDetail.tenor} BULAN</p>
                                            </div>
                                            <div className="bg-white px-8 py-8">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3">PENYEDIA LEASING</p>
                                                <p className="text-2xl font-black text-black tracking-tighter">{transaction.creditDetail.leasing_provider || "PENDING"}</p>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mt-1">PARTNER RESMI</p>
                                            </div>
                                            <div className="bg-white px-8 py-8">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3">TENOR</p>
                                                <p className="text-2xl font-black text-black tracking-tighter">{transaction.creditDetail.tenor}</p>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mt-1">BULAN</p>
                                            </div>
                                        </div>

                                        {/* Secondary Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
                                            <div className="bg-gray-50 px-8 py-6">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-2">POKOK PEMBIAYAAN</p>
                                                <p className="text-lg font-black text-black tracking-tighter">
                                                    {formatCurrency((transaction.motor.price || 0) - (transaction.creditDetail.down_payment || 0))}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 px-8 py-6">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-2">TOTAL PEMBIAYAAN</p>
                                                <p className="text-lg font-black text-black tracking-tighter">
                                                    {formatCurrency((transaction.creditDetail.monthly_installment || 0) * (transaction.creditDetail.tenor || 0))}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 px-8 py-6">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-2">BUNGA FLAT</p>
                                                <p className="text-lg font-black text-black tracking-tighter">
                                                    {transaction.creditDetail.interest_rate ? `${transaction.creditDetail.interest_rate}%` : "1.5% / BULAN"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Credit Status Display */}
                                        <div className="bg-white border-t border-gray-100 p-8 sm:p-12">
                                            <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mb-8">STATUS PROSES KREDIT</p>
                                            <CreditStatusDisplay credit={transaction.creditDetail} transaction={transaction} showSurvey={false} />

                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-0 border border-gray-200 overflow-hidden">
                                        {/* CASH — Dark Header Bar */}
                                        <div className="bg-black px-10 py-6 flex items-center gap-4">
                                            <div className="w-2 h-6 bg-[#1c69d4]"></div>
                                            <p className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">DETAIL PEMBAYARAN TUNAI</p>
                                        </div>

                                        {/* Key Metrics Grid */}
                                        <div className="grid grid-cols-2 gap-px bg-gray-100">
                                            <div className="bg-white px-8 py-8">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3">TOTAL PEMBAYARAN</p>
                                                <p className="text-3xl font-black text-black tracking-tighter">{formatCurrency(transaction.total_price)}</p>
                                            </div>
                                            <div className="bg-white px-8 py-8">
                                                <p className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3">BOOKING FEE</p>
                                                <p className="text-3xl font-black text-[#1c69d4] tracking-tighter">
                                                    {formatCurrency(transaction.booking_fee || 0)}
                                                </p>
                                                <p className="text-[8px] font-bold text-gray-400 tracking-widest uppercase mt-2">SUDAH TERMASUK TOTAL</p>
                                            </div>
                                        </div>

                                        {/* Cash Status */}
                                        <div className="bg-white border-t border-gray-100 p-8 sm:p-12">
                                            <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mb-8">STATUS PROSES PEMBAYARAN</p>
                                            <CashStatusDisplay transaction={transaction} />
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* TRANSACTION TIMELINE - THE "REAL" HISTORY */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-8 bg-black"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">RIWAYAT TRANSAKSI BERDASARKAN SYSTEM LOGS</h2>
                                </div>
                                <TransactionTimeline logs={transaction.logs} />
                            </section>



                            {/* COLLAPSIBLE SECTIONS */}
                            <div className="space-y-4">
                                {isCreditOrder && survey && (
                                    <details className="group border border-gray-200 bg-white" open={expandedSection === 'survey'}>
                                        <summary className="flex justify-between items-center p-8 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <Calendar className="w-6 h-6 text-[#1c69d4]" />
                                                <h3 className="text-lg font-black uppercase tracking-widest">JADWAL SURVAI LEASING</h3>
                                            </div>
                                            <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-gray-100 mt-4">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2">WAKTU PELAKSANAAN</p>
                                                <p className="font-bold text-black uppercase">
                                                    {new Date(survey.scheduled_date).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    <span className="block text-gray-500 mt-1">{survey.scheduled_time || "JAM BELUM DITENTUKAN"}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2">PETUGAS SURVAI (SURVEYOR)</p>
                                                <p className="font-bold text-black uppercase">{survey.surveyor_name || "MENUNGGU PENUGASAN"}</p>
                                                <p className="text-[#1c69d4] font-bold text-xs mt-1">{survey.surveyor_phone || "KONTAK BELUM TERSEDIA"}</p>
                                            </div>
                                        </div>
                                    </details>
                                )}

                                {transaction.installments?.length > 0 && (
                                    <details className="group border border-gray-200 bg-white" open={expandedSection === 'installments'}>
                                        <summary className="flex justify-between items-center p-8 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <DollarSign className="w-6 h-6 text-[#1c69d4]" />
                                                <h3 className="text-lg font-black uppercase tracking-widest">RIWAYAT PEMBAYARAN ({transaction.installments.length})</h3>
                                            </div>
                                            <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="p-8 pt-0 border-t border-gray-100 mt-4">
                                            <div className="space-y-4 pt-4">
                                                {transaction.installments.map((installment) => (
                                                    <div key={installment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 border border-gray-100 group/item hover:bg-white hover:border-[#1c69d4] transition-all">
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">
                                                                {installment.installment_number === 0 ? (transaction.transaction_type === "CASH" ? "BOOKING FEE" : "UANG MUKA / DP") : `ANGSURAN KE-${installment.installment_number}`}
                                                            </p>
                                                            <p className="font-black text-lg uppercase tracking-tight">{formatCurrency(installment.amount)}</p>
                                                        </div>
                                                        <div className="mt-4 sm:mt-0 flex items-center gap-4">
                                                            <div className="text-right hidden sm:block">
                                                                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">JATUH TEMPO</p>
                                                                <p className="text-[11px] font-bold uppercase">{new Date(installment.due_date).toLocaleDateString("id-ID")}</p>
                                                            </div>
                                                            <span className={`px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase border ${
                                                                installment.status === 'paid' ? 'bg-[#1c69d4]/10 border-[#1c69d4] text-[#1c69d4]' : 'bg-red-500/10 border-red-500 text-red-500'
                                                            }`}>
                                                                {installment.status === 'paid' ? 'LUNAS' : 'PENDING'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ACTIONS & STICKY SUMMARY */}
                        <div className="lg:col-span-4 space-y-8">
                            <aside className="sticky top-40 space-y-8">
                                {/* SUMMARY CARD */}
                                <div className="bg-black text-white p-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#1c69d4]/10 -rotate-45 translate-x-12 -translate-y-12"></div>
                                    
                                    <h3 className="text-xl font-black uppercase tracking-widest mb-10 border-b border-gray-800 pb-4">RINGKASAN PEMBAYARAN</h3>
                                    
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-300 tracking-widest uppercase mb-1">HARGA KENDARAAN</p>
                                                <p className="text-xl font-black uppercase tracking-tight text-white">{formatCurrency(transaction.motor.price)}</p>

                                            </div>
                                        </div>

                                        {isCreditOrder ? (
                                            <>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-300 tracking-widest uppercase mb-1">UANG MUKA (DP)</p>
                                                        <p className="text-xl font-black uppercase tracking-tight text-[#1c69d4]">{formatCurrency(transaction.creditDetail.down_payment)}</p>

                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end pt-8 border-t border-gray-800">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-300 tracking-widest uppercase mb-1">POKOK PEMBIAYAAN</p>
                                                        <p className="text-2xl font-black uppercase tracking-tight text-white">
                                                            {formatCurrency(transaction.motor.price - transaction.creditDetail.down_payment)}
                                                        </p>

                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex justify-between items-end pt-8 border-t border-gray-800">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 tracking-widest uppercase mb-1">TOTAL PELUNASAN</p>
                                                    <p className="text-3xl font-black uppercase tracking-tight text-[#1c69d4]">
                                                        {formatCurrency(transaction.total_price)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* PRIMARY ACTION BUTTONS */}
                                    <div className="mt-12 space-y-4">
                                        {transaction.transaction_type === "CREDIT" && (
                                            <Link
                                                href={route("motors.manage-documents", transaction.id)}
                                                className="w-full bg-white text-black hover:bg-gray-200 h-16 transition-all font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                                            >
                                                KELOLA BERKAS <FileText size={16} />
                                            </Link>
                                        )}
                                        
                                        {transaction.transaction_type === "CREDIT" && !["new_order", "pengajuan_masuk", "menunggu_persetujuan", "cancelled"].includes(transaction.status) && (

                                            <Link
                                                href={route("motors.installments", transaction.id)}
                                                className="w-full bg-[#1c69d4] text-white hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] h-16 transition-all font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-lg shadow-[#1c69d4]/20"
                                            >
                                                LIHAT CICILAN <ArrowRight size={16} />
                                            </Link>

                                        )}
                                        
                                        {canCancel && (
                                            <button
                                                onClick={handleCancel}
                                                className="w-full border border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-500 h-14 transition-all font-black text-[9px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
                                            >
                                                BATALKAN PESANAN <XCircle size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* CONTACT SUPPORT AD */}
                                <div className="border border-gray-200 p-8 bg-gray-50">
                                    <h4 className="text-[10px] font-black tracking-widest uppercase mb-4">BUTUH BANTUAN?</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 uppercase tracking-widest">
                                        JIKA ANDA MEMILIKI KENDALA ATAU PERTANYAAN TERKAIT STATUS TRANSAKSI ANDA, HUBUNGI TIM KAMI.
                                    </p>
                                    <a href="https://wa.me/628123456789" className="text-black font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:text-[#1c69d4] transition-colors">
                                        WHATSAPP SUPPORT <ArrowRight size={14} />
                                    </a>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>
        </PublicLayout>
    );
}
