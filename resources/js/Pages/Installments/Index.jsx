import React, { useState, useEffect } from "react";
import { Link, usePage, useForm, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    FileText,
    Landmark,
    Shield,
    ShieldCheck,
    Upload,
    Wallet,
    X,
    ArrowLeft,
    RefreshCw,
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Calendar,
    MessageCircle,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function InstallmentIndex({ transactions }) {
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedTotal, setSelectedTotal] = useState(0);

    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const [isLoadingCheck, setIsLoadingCheck] = useState(false);

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
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_method: "transfer",
        payment_proof: null,
    });

    const openUploadModal = (installment) => {
        setSelectedInstallment(installment);
        setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
        setSelectedInstallment(null);
        reset();
    };

    const handleOnlinePayment = async (installment) => {
        setIsLoadingPay(true);
        try {
            const response = await axios.post(
                route("installments.create-payment", installment.id),
            );
            const token = response.data.snap_token;

            window.snap.pay(token, {
                onSuccess: function (result) {
                    Swal.fire({
                        title: "PEMBAYARAN BERHASIL",
                        text: "Transaksi terverifikasi.",
                        icon: "success",
                        background: "#fff",
                        color: "#1a1a1a",
                        confirmButtonColor: "#1a1a1a",
                    });
                    router.reload();
                },
                onPending: function (result) {
                    Swal.fire({
                        title: "PEMBAYARAN TERTUNDA",
                        text: "Menunggu penyelesaian.",
                        icon: "info",
                        background: "#fff",
                        color: "#1a1a1a",
                        confirmButtonColor: "#1a1a1a",
                    });
                    router.reload();
                },
                onError: function (result) {
                    Swal.fire({
                        title: "PEMBAYARAN GAGAL",
                        text: "Transaksi ditolak.",
                        icon: "error",
                        background: "#fff",
                        color: "#1a1a1a",
                        confirmButtonColor: "#1a1a1a",
                    });
                },
                onClose: function () {},
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "KESALAHAN SISTEM",
                text: "Gateway tidak dapat dijangkau.",
                icon: "error",
                background: "#fff",
                color: "#1a1a1a",
                confirmButtonColor: "#1a1a1a",
            });
        } finally {
            setIsLoadingPay(false);
        }
    };

    const handleCheckStatus = async (installment) => {
        setIsLoadingCheck(true);
        try {
            const response = await axios.post(
                route("installments.check-status", installment.id),
            );
            Swal.fire({
                title: "PEMBARUAN STATUS",
                text: response.data.message,
                icon: "info",
                background: "#fff",
                color: "#1a1a1a",
                confirmButtonColor: "#1a1a1a",
            });
            router.reload();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "INFO",
                text: error.response?.data?.message || "Check failed.",
                icon: "warning",
                background: "#fff",
                color: "#1a1a1a",
                confirmButtonColor: "#1a1a1a",
            });
        } finally {
            setIsLoadingCheck(false);
        }
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route("installments.pay", selectedInstallment.id), {
            onSuccess: () => {
                closeUploadModal();
                Swal.fire({
                    icon: "success",
                    title: "PENGAJUAN BERHASIL",
                    text: "Bukti diserahkan untuk verifikasi manual.",
                    background: "#fff",
                    color: "#1a1a1a",
                    confirmButtonColor: "#1a1a1a",
                });
            },
        });
    };

    const toggleSelection = (installmentId, amount, penalty = 0) => {
        setSelectedIds((prevIds) => {
            const isCurrentlySelected = prevIds.includes(installmentId);
            const newSelectedIds = isCurrentlySelected
                ? prevIds.filter((id) => id !== installmentId)
                : [...prevIds, installmentId];

            // Calculate total
            const newTotal = transactions.reduce((total, transaction) => {
                return (
                    total +
                    (transaction.installments?.reduce((sum, inst) => {
                        if (newSelectedIds.includes(inst.id)) {
                            return (
                                sum +
                                Number(inst.amount) +
                                Number(inst.penalty_amount || 0)
                            );
                        }
                        return sum;
                    }, 0) || 0)
                );
            }, 0);

            setSelectedTotal(newTotal);
            return newSelectedIds;
        });
    };

    const handlePayMultiple = async () => {
        if (selectedIds.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "PILIH CICILAN",
                text: "Pilih minimal satu cicilan untuk dibayar.",
                background: "#fff",
                color: "#1a1a1a",
                confirmButtonColor: "#1a1a1a",
            });
            return;
        }

        setIsLoadingPay(true);
        try {
            const response = await axios.post(
                route("installments.pay-multiple"),
                { installment_ids: selectedIds },
            );
            const token = response.data.snap_token;

            window.snap.pay(token, {
                onSuccess: function (result) {
                    Swal.fire({
                        title: "PEMBAYARAN BERHASIL",
                        text: "Transaksi semua cicilan diproses.",
                        icon: "success",
                        background: "#fff",
                        color: "#1a1a1a",
                        confirmButtonColor: "#1a1a1a",
                    });
                    setSelectedIds([]);
                    router.reload();
                },
                onPending: function (result) {
                    Swal.fire({
                        title: "PEMBAYARAN TERTUNDA",
                        text: "Menunggu penyelesaian.",
                        icon: "info",
                        background: "#fff",
                        color: "#1a1a1a",
                        confirmButtonColor: "#1a1a1a",
                    });
                    router.reload();
                },
                onError: function (result) {
                    Swal.fire({
                        title: "PEMBAYARAN GAGAL",
                        text: "Transaksi ditolak.",
                        icon: "error",
                        background: "#fff",
                        color: "#1a1a1a",
                        confirmButtonColor: "#1a1a1a",
                    });
                },
                onClose: function () {},
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "KESALAHAN SISTEM",
                text:
                    error.response?.data?.message ||
                    "Gagal memproses pembayaran.",
                icon: "error",
                background: "#fff",
                color: "#1a1a1a",
                confirmButtonColor: "#1a1a1a",
            });
        } finally {
            setIsLoadingPay(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-gray-100 text-gray-500 border-gray-100",
            waiting_approval: "bg-blue-50 text-blue-500 border-blue-100",
            paid: "bg-green-50 text-green-600 border-green-100",
            overdue: "bg-red-50 text-red-600 border-red-100",
        };
        const labels = {
            pending: "BELUM BAYAR",
            waiting_approval: "DIVERIFIKASI",
            paid: "LUNAS",
            overdue: "TERLAMBAT",
            cancelled: "DIBATALKAN",
        };

        const Icon =
            {
                pending: Clock,
                waiting_approval: RefreshCw,
                paid: CheckCircle,
                overdue: AlertTriangle,
            }[status] || Clock;

        return (
            <span
                className={`flex items-center gap-1.5 px-4 py-2 border-2 uppercase text-[9px] font-black tracking-[0.2em] w-fit ${
                    status === "paid" ? "bg-green-50 text-green-600 border-green-500" :
                    status === "overdue" || status === "cancelled" ? "bg-red-50 text-red-600 border-red-500" :
                    status === "waiting_approval" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    "bg-white text-gray-500 border-gray-100"
                }`}
            >
                <Icon size={12} strokeWidth={3} />
                {labels[status] || status}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount))
            return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString, showTime = false) => {
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        if (showTime) {
            options.hour = "2-digit";
            options.minute = "2-digit";
        }
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getReminderBadge = (daysUntilDue) => {
        if (daysUntilDue < 0) {
            return {
                text: `${Math.abs(daysUntilDue)} hari terlambat`,
                color: "text-red-600 bg-red-50 border-red-200",
            };
        } else if (daysUntilDue === 0) {
            return {
                text: "Jatuh tempo hari ini",
                color: "text-red-600 bg-red-50 border-red-200",
            };
        } else if (daysUntilDue <= 7) {
            return {
                text: `${daysUntilDue} hari lagi`,
                color: "text-amber-600 bg-amber-50 border-amber-200",
            };
        } else if (daysUntilDue <= 30) {
            return {
                text: `${daysUntilDue} hari lagi`,
                color: "text-blue-600 bg-blue-50 border-blue-200",
            };
        } else {
            return {
                text: `${daysUntilDue} hari lagi`,
                color: "text-green-600 bg-green-50 border-green-200",
            };
        }
    };

    return (
        <PublicLayout title="Cicilan Saya - SRB Motors">
            {/* BMW INDUSTRIAL HEADER */}
            <section className="bg-black text-white pt-24 pb-32 border-b border-gray-800 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-16">
                        <Link
                            href={route("home")}
                            className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-gray-500 hover:text-white transition-all group uppercase"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            KEMBALI KE BERANDA
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-px bg-[#1c69d4]"></div>
                                <p className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase">FINANSIAL & CICILAN</p>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                MANAJEMEN <br/>
                                PEMBAYARAN
                            </h1>
                            <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl uppercase tracking-widest leading-relaxed opacity-70">
                                Pantau jadwal jatuh tempo, kelola cicilan berjalan, dan akses seluruh riwayat pembayaran Anda secara transparan.
                            </p>
                        </div>

                        {selectedTotal > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-8 border-l-4 border-[#1c69d4] min-w-[320px] shadow-2xl"
                            >
                                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-2">TOTAL TERPILIH</p>
                                <p className="text-4xl font-black text-black tracking-tighter mb-6">{formatCurrency(selectedTotal)}</p>
                                <button 
                                    onClick={handlePayMultiple}
                                    disabled={isLoadingPay}
                                    className="w-full h-14 bg-black hover:bg-[#1c69d4] text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                                >
                                    {isLoadingPay ? <RefreshCw className="animate-spin w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                    BAYAR SEKARANG
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            <main className="flex-1 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20">
                    {transactions?.length > 0 ? (

                        <div className="flex flex-col gap-12">
                            {transactions?.map((transaction) => (

                                <motion.div
                                    key={transaction.id}
                                    className={`group bg-white border border-gray-200 hover:border-black relative transition-all duration-500 hover:shadow-2xl ${
                                        transaction.status === "cancelled"
                                            ? "opacity-75"
                                            : "shadow-sm"
                                    }`}
                                >
                                    {/* RED ACCENT FOR CANCELLED */}
                                    {transaction.status === "cancelled" && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 z-20"></div>
                                    )}
                                    {/* TRANSACTION HEADER - BMW INDUSTRIAL STYLE */}
                                    <div className="p-8 md:p-12 border-b border-gray-100 transition-colors group-hover:bg-gray-50/50">
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase">
                                                    <span className="text-gray-400">INV #{transaction.invoice_number || `INV-${transaction.id}`}</span>
                                                    <span className="w-1.5 h-1.5 bg-[#1c69d4]"></span>
                                                    {transaction.status === "cancelled" ? (
                                                        <span className="text-red-600 font-black">TRANSAKSI DIBATALKAN</span>
                                                    ) : (
                                                        <span className="text-[#1c69d4]">AKTIF</span>
                                                    )}
                                                </div>
                                                <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none">
                                                    {transaction.motor?.name || "UNIT MOTOR"}
                                                </h3>
                                            </div>
                                            
                                            <div className="flex flex-col md:items-end gap-2 w-full lg:w-auto">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">UNIT PRICE</p>
                                                <p className="text-4xl font-black text-black tracking-tighter">
                                                    {formatCurrency(transaction.total_amount)}
                                                </p>
                                                <div className="mt-4 flex gap-2">
                                                    {transaction.status === "cancelled" ? (
                                                        <span className="px-4 py-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest">DIBATALKAN</span>
                                                    ) : transaction.status === "completed" ? (
                                                        <span className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest">LUNAS</span>
                                                    ) : (
                                                        <span className="px-4 py-2 bg-white border-2 border-black text-black text-[9px] font-black uppercase tracking-widest">TRANSAKSI AKTIF</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INSTALLMENT TABLE - HIDDEN ON MOBILE */}
                                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-black">
                                                    <th className="px-6 py-4 text-left text-[9px] font-black text-white uppercase tracking-[0.2em] w-20">
                                                        SELECT
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                                        TERMIN
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                                        DUE DATE
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                                        AMOUNT
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                                        STATUS
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                                        ACTIONS
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {transaction.installments &&
                                                    transaction.installments.map(
                                                        (inst) => (
                                                            <tr
                                                                key={inst.id}
                                                                className={`hover:bg-blue-50/30 transition-colors ${
                                                                    selectedIds.includes(
                                                                        inst.id,
                                                                    )
                                                                        ? "bg-blue-50"
                                                                        : ""
                                                                } ${
                                                                    transaction.status ===
                                                                    "cancelled"
                                                                        ? "opacity-40 grayscale pointer-events-none"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <td className="px-4 py-3">
                                                                    {inst.status ===
                                                                        "pending" ||
                                                                    inst.status ===
                                                                        "overdue" ? (
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                                            checked={selectedIds.includes(
                                                                                inst.id,
                                                                            )}
                                                                            onChange={() =>
                                                                                transaction.status !==
                                                                                    "cancelled" &&
                                                                                toggleSelection(
                                                                                    inst.id,
                                                                                    inst.amount,
                                                                                    inst.penalty_amount ||
                                                                                        0,
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                transaction.status ===
                                                                                "cancelled"
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`font-semibold ${inst.installment_number === 0 ? "text-blue-600" : "text-gray-900"}`}
                                                                    >
                                                                        {inst.installment_number ===
                                                                        0
                                                                            ? "DP"
                                                                            : `Cicilan #${inst.installment_number}`}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex flex-col gap-1">
                                                                        <p className="text-gray-700 font-medium">
                                                                            {formatDate(
                                                                                inst.due_date,
                                                                            )}
                                                                        </p>
                                                                        {inst.status ===
                                                                            "pending" ||
                                                                        inst.status ===
                                                                            "overdue" ? (
                                                                            <span
                                                                                className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit ${getReminderBadge(getDaysUntilDue(inst.due_date)).color}`}
                                                                            >
                                                                                {
                                                                                    getReminderBadge(
                                                                                        getDaysUntilDue(
                                                                                            inst.due_date,
                                                                                        ),
                                                                                    )
                                                                                        .text
                                                                                }
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex flex-col items-end gap-0.5">
                                                                        <p className="font-bold text-gray-900">
                                                                            {formatCurrency(
                                                                                Number(
                                                                                    inst.amount,
                                                                                ) +
                                                                                    Number(
                                                                                        inst.penalty_amount ||
                                                                                            0,
                                                                                    ),
                                                                            )}
                                                                        </p>
                                                                        {Number(
                                                                            inst.penalty_amount,
                                                                        ) >
                                                                            0 && (
                                                                            <p className="text-[10px] font-medium text-red-600">
                                                                                +Denda{" "}
                                                                                {formatCurrency(
                                                                                    inst.penalty_amount,
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 text-center">
                                                                    <div className="flex justify-center">
                                                                        {getStatusBadge(inst.status)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        {inst.status === "pending" || inst.status === "overdue" ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleOnlinePayment(inst)}
                                                                                    disabled={isLoadingPay}
                                                                                    className="h-10 px-6 bg-black hover:bg-[#1c69d4] text-white text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-20"
                                                                                >
                                                                                    <CreditCard size={14} /> ONLINE
                                                                                </button>
                                                                                {inst.midtrans_booking_code && (
                                                                                    <button
                                                                                        onClick={() => handleCheckStatus(inst)}
                                                                                        disabled={isLoadingCheck}
                                                                                        className="h-10 px-6 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                                                                                        title="Cek ke server Midtrans jika status belum berubah"
                                                                                    >
                                                                                        {isLoadingCheck ? <RefreshCw className="animate-spin w-3.5 h-3.5" /> : <RefreshCw size={14} />} CEK STATUS
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    onClick={() => openUploadModal(inst)}
                                                                                    className="h-10 px-6 bg-white border-2 border-black text-black hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                                                                >
                                                                                    <Upload size={14} /> TRANSFER
                                                                                </button>

                                                                            </>
                                                                        ) : inst.status === "paid" ? (
                                                                            <a
                                                                                href={route("installments.receipt", inst.id)}
                                                                                target="_blank"
                                                                                className="h-10 px-6 bg-gray-100 text-black hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                                                            >
                                                                                <Download size={14} /> RECEIPT
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                                <Clock size={14} /> VERIFYING
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="md:hidden divide-y divide-gray-100">
                                        {transaction.installments &&
                                            transaction.installments.map((inst) => (
                                                <div 
                                                    key={inst.id} 
                                                    className={`p-8 transition-colors ${
                                                        selectedIds.includes(inst.id) ? "bg-[#f4f7fa]" : ""
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex gap-4">
                                                            {(inst.status === "pending" || inst.status === "overdue") && (
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-5 h-5 mt-1 border-2 border-black text-black focus:ring-0 cursor-pointer"
                                                                    checked={selectedIds.includes(inst.id)}
                                                                    onChange={() =>
                                                                        transaction.status !== "cancelled" &&
                                                                        toggleSelection(inst.id, inst.amount, inst.penalty_amount || 0)
                                                                    }
                                                                />
                                                            )}
                                                            <div>
                                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${inst.installment_number === 0 ? "text-[#1c69d4]" : "text-gray-400"}`}>
                                                                    {inst.installment_number === 0 ? "UANG MUKA" : `CICILAN #${inst.installment_number}`}
                                                                </p>
                                                                <p className="text-sm font-black text-black uppercase tracking-tight">
                                                                    {formatDate(inst.due_date)}
                                                                </p>
                                                                {(inst.status === "pending" || inst.status === "overdue") && (
                                                                    <div className={`mt-2 text-[8px] font-black px-2 py-1 border uppercase tracking-widest w-fit ${getReminderBadge(getDaysUntilDue(inst.due_date)).color}`}>
                                                                        {getReminderBadge(getDaysUntilDue(inst.due_date)).text}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-black tracking-tighter">
                                                                {formatCurrency(Number(inst.amount) + Number(inst.penalty_amount || 0))}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(inst.status)}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {inst.status === "pending" || inst.status === "overdue" ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleOnlinePayment(inst)}
                                                                        className="h-12 bg-black text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                                                    >
                                                                        <CreditCard size={14} /> ONLINE
                                                                    </button>
                                                                    {inst.midtrans_booking_code && (
                                                                        <button
                                                                            onClick={() => handleCheckStatus(inst)}
                                                                            disabled={isLoadingCheck}
                                                                            className="h-12 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                                                        >
                                                                            {isLoadingCheck ? <RefreshCw className="animate-spin w-3.5 h-3.5" /> : <RefreshCw size={14} />} CEK STATUS
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => openUploadModal(inst)}
                                                                        className="h-12 bg-white border-2 border-black text-black text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                                                    >
                                                                        <Upload size={14} /> TRANSFER
                                                                    </button>

                                                                </>
                                                            ) : inst.status === "paid" ? (
                                                                <a
                                                                    href={route("installments.receipt", inst.id)}
                                                                    target="_blank"
                                                                    className="col-span-2 h-12 bg-black text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                                                >
                                                                    <Download size={14} /> DOWNLOAD RECEIPT
                                                                </a>
                                                            ) : (
                                                                <div className="col-span-2 h-12 bg-gray-50 flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                                    <Clock size={14} /> VERIFYING PAYMENT
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    {selectedIds.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="px-6 md:px-8 py-6 md:py-8 bg-black border-t border-black"
                                        >
                                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                                        Cicilan Terpilih
                                                    </p>
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-2xl md:text-3xl font-black text-white">
                                                            {selectedIds.length}{" "}
                                                            Cicilan
                                                        </p>
                                                        <p className="text-xs font-medium text-gray-400">
                                                            Total Nominal:{" "}
                                                            <span className="font-bold text-white">
                                                                {formatCurrency(
                                                                    selectedTotal,
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handlePayMultiple}
                                                    disabled={isLoadingPay}
                                                    className="w-full md:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 border border-white hover:bg-transparent hover:text-white"
                                                >
                                                    <ShieldCheck className="w-5 h-5" />
                                                    {isLoadingPay
                                                        ? "MEMPROSES..."
                                                        : "BAYAR SEMUA SEKARANG"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}


                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto py-24 text-center">
                            <div className="w-32 h-32 bg-white rounded-none border border-gray-300 flex items-center justify-center mx-auto mb-8">
                                <CreditCard className="w-16 h-16 text-black" />
                            </div>
                            <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-4">
                                Tidak Ada Tagihan Aktif
                            </h3>
                            <p className="text-gray-500 font-bold mb-10 text-lg leading-relaxed">
                                Anda belum memiliki transaksi dengan skema
                                pembiayaan/cicilan. Hubungi admin kami jika Anda
                                merasa ini adalah kesalahan.
                            </p>

                            <Link href="/motors">
                                <button className="h-16 px-10 bg-black text-white font-black uppercase tracking-widest rounded-none border border-black hover:bg-transparent hover:text-black transition-colors flex items-center gap-3 mx-auto">
                                    LIHAT KATALOG MOTOR{" "}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* GLOBAL PAYMENT VERIFICATION INFO */}
                <div className="mt-20">
                    <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-black text-white border-l-8 border-[#1c69d4] shadow-2xl relative overflow-hidden group">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1c69d4] opacity-[0.05] -mr-16 -mt-16 rounded-full blur-3xl"></div>
                        
                        <div className="flex-shrink-0 p-5 bg-white/5 border border-white/10 rounded-none text-[#1c69d4] group-hover:bg-[#1c69d4]/10 transition-colors">
                            <ShieldCheck size={40} strokeWidth={1.5} />
                        </div>
                        
                        <div className="space-y-4 flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#1c69d4]">SISTEM VERIFIKASI PEMBAYARAN</p>
                                <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">TERINTEGRASI OJK</span>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-gray-400 leading-relaxed uppercase tracking-[0.15em] max-w-2xl">
                                KONFIRMASI OTOMATIS MEMAKAN WAKTU <span className="text-white font-black">1-5 MENIT</span>. 
                                JIKA STATUS BELUM BERUBAH, SILAKAN GUNAKAN TOMBOL <span className="text-white font-black italic">'CEK STATUS'</span> PADA RIWAYAT ATAU 
                                HUBUNGI <span className="text-white font-black">HELP DESK</span> KAMI MELALUI WHATSAPP DENGAN MENYERTAKAN BUKTI BAYAR.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <a 
                                href="https://wa.me/628121345678" 
                                target="_blank"
                                className="px-8 py-5 bg-[#1c69d4] hover:bg-white hover:text-black text-white font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 group/btn"
                            >
                                <MessageCircle size={18} /> 
                                HUBUNGI SUPPORT
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                            <p className="text-[9px] font-bold text-gray-600 text-center uppercase tracking-widest">RESPONS CEPAT: 08:00 - 21:00</p>
                        </div>
                    </div>
                </div>
            </main>
            

            {/* MANUAL UPLOAD MODAL */}
            <AnimatePresence>
                {isUploadModalOpen && selectedInstallment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-primary-dark/80 backdrop-blur-xl"
                            onClick={closeUploadModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white rounded-none w-full max-w-lg border-2 border-black relative z-20 overflow-hidden"
                        >
                            <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-gray-200">
                                <h3 className="text-2xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-none bg-black flex items-center justify-center text-white">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    BUKTI PEMBAYARAN
                                </h3>
                                <button
                                    onClick={closeUploadModal}
                                    className="w-10 h-10 rounded-none border border-gray-300 text-gray-400 hover:text-black hover:border-black transition-colors flex items-center justify-center"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitPayment}
                                className="p-10 pt-8 space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="p-8 bg-gray-50 rounded-none border border-gray-300 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                                Jumlah Bayar
                                            </p>
                                            <p className="text-4xl font-black text-black tracking-tight">
                                                {formatCurrency(
                                                    Number(
                                                        selectedInstallment.amount,
                                                    ) +
                                                        Number(
                                                            selectedInstallment.penalty_amount ||
                                                                0,
                                                        ),
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                                Target
                                            </p>
                                            <p className="text-sm font-black text-black uppercase">
                                                #Cicilan{" "}
                                                {selectedInstallment.installment_number ||
                                                    "DP"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white rounded-none border border-black flex items-start gap-4">
                                        <Shield className="w-6 h-6 text-primary shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                                Informasi Rekening Tujuan
                                            </p>
                                            <p className="text-lg font-black text-gray-900">
                                                123-456-7890
                                            </p>
                                            <p className="text-xs font-bold text-gray-500">
                                                BCA - PT SRB MOTOR INDONESIA
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Pilih Metode
                                        </label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) =>
                                                setData(
                                                    "payment_method",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full h-14 rounded-none bg-white border border-gray-300 px-6 font-bold text-black focus:ring-0 focus:border-black transition-colors appearance-none"
                                        >
                                            <option value="transfer">
                                                TRANSFER BANK MANUAL
                                            </option>
                                            <option value="cash">
                                                SETOR TUNAI DI DEALER
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Unggah Foto Transaksi
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_proof",
                                                        e.target.files[0],
                                                    )
                                                }
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                required
                                            />
                                            <div className="w-full h-40 rounded-none border border-dashed border-gray-400 flex flex-col items-center justify-center gap-3 group-hover:bg-gray-50 group-hover:border-black transition-all bg-gray-50">
                                                <div className="w-12 h-12 rounded-none bg-white border border-gray-300 flex items-center justify-center text-black">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                {data.payment_proof ? (
                                                    <p className="text-xs font-black text-black">
                                                        {
                                                            data.payment_proof
                                                                .name
                                                        }
                                                    </p>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                                                            Seret gambar kesini
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-16 bg-black text-white font-black uppercase tracking-widest rounded-none border border-black hover:bg-white hover:text-black disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
                                >
                                    {processing ? (
                                        <RefreshCw className="animate-spin" />
                                    ) : (
                                        <>
                                            KIRIM UNTUK VERIFIKASI{" "}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PublicLayout>
    );
}
