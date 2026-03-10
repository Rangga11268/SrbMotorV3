import React, { useState, useEffect } from "react";
import { Link, usePage, useForm, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    FileText,
    Landmark,
    Shield,
    ShieldCheck,
    TrendingUp,
    Upload,
    Wallet,
    X,
    Zap,
    ArrowLeft,
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
        };

        const Icon =
            {
                pending: Clock,
                waiting_approval: Activity,
                paid: CheckCircle,
                overdue: AlertTriangle,
            }[status] || Clock;

        return (
            <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest w-fit ${
                    badges[status] || badges.pending
                }`}
            >
                <Icon size={12} strokeWidth={3} />
                {labels[status] || status}
            </span>
        );
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

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
        <PublicLayout auth={auth} title="Cicilan Saya - SRB Motors">
            {/* BACK BUTTON */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href={route("profile.show")}
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Profil
                    </Link>
                </div>
            </div>

            <div className="flex-grow pt-[104px] pb-20">
                {/* HERO HEADER - SIMPLE */}
                <div className="bg-white border-b border-gray-100 pt-8 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Manajemen Cicilan
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                            Bayar cicilan Anda dengan mudah. Pilih metode
                            pembayaran: bayar langsung online atau transfer
                            kemudian upload bukti
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
                    {transactions.length > 0 ? (
                        <div className="space-y-8">
                            {transactions.map((transaction) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={transaction.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                                >
                                    {/* TRANSACTION HEADER - SIMPLIFIED */}
                                    <div className="px-6 md:px-8 py-6 md:py-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                    {transaction.motor?.name ||
                                                        "Unit Motor"}
                                                </h3>
                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-600">
                                                    <span>
                                                        <span className="font-semibold text-gray-900">
                                                            No. Invoice:
                                                        </span>{" "}
                                                        {transaction.invoice_number ||
                                                            `INV-${transaction.id}`}
                                                    </span>
                                                    <span>
                                                        <span className="font-semibold text-gray-900">
                                                            Tanggal:
                                                        </span>{" "}
                                                        {formatDate(
                                                            transaction.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right w-full md:w-auto">
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                    Sisa Kewajiban
                                                </p>
                                                <p className="text-3xl font-black text-blue-600">
                                                    {formatCurrency(
                                                        transaction.total_amount,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INSTALLMENT TABLE - IMPROVED RESPONSIVE */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Pilih
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Termin
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Jatuh Tempo
                                                    </th>
                                                    <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                                                        Nominal
                                                    </th>
                                                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                                                        Status
                                                    </th>
                                                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                                                        Pembayaran
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {transaction.installments &&
                                                    transaction.installments.map(
                                                        (inst) => (
                                                            <tr
                                                                key={inst.id}
                                                                className={`hover:bg-blue-50/30 transition-colors ${selectedIds.includes(inst.id) ? "bg-blue-50" : ""}`}
                                                            >
                                                                <td className="px-4 py-4">
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
                                                                                toggleSelection(
                                                                                    inst.id,
                                                                                    inst.amount,
                                                                                    inst.penalty_amount ||
                                                                                        0,
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <span
                                                                        className={`font-semibold ${inst.installment_number === 0 ? "text-blue-600" : "text-gray-900"}`}
                                                                    >
                                                                        {inst.installment_number ===
                                                                        0
                                                                            ? "DP"
                                                                            : `Cicilan #${inst.installment_number}`}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="flex flex-col gap-2">
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
                                                                                className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full border w-fit ${getReminderBadge(getDaysUntilDue(inst.due_date)).color}`}
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
                                                                <td className="px-4 py-4 text-right">
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
                                                                <td className="px-4 py-4 text-center">
                                                                    {getStatusBadge(
                                                                        inst.status,
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="flex items-center justify-center">
                                                                        {inst.status ===
                                                                            "pending" ||
                                                                        inst.status ===
                                                                            "overdue" ? (
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleOnlinePayment(
                                                                                            inst,
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        isLoadingPay
                                                                                    }
                                                                                    title="Bayar langsung via online gateway"
                                                                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                                                                                >
                                                                                    <Zap className="w-3.5 h-3.5" />
                                                                                    Bayar
                                                                                    Online
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        openUploadModal(
                                                                                            inst,
                                                                                        )
                                                                                    }
                                                                                    title="Upload struk transfer manual dari bank"
                                                                                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                                                                                >
                                                                                    <Upload className="w-3.5 h-3.5" />
                                                                                    Transfer
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleCheckStatus(
                                                                                            inst,
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        isLoadingCheck
                                                                                    }
                                                                                    title="Cek apakah pembayaran sudah terverifikasi"
                                                                                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                                                                                >
                                                                                    <Activity
                                                                                        className={`w-3.5 h-3.5 ${isLoadingCheck ? "animate-spin" : ""}`}
                                                                                    />
                                                                                    Cek
                                                                                    Status
                                                                                </button>
                                                                            </div>
                                                                        ) : inst.status ===
                                                                          "paid" ? (
                                                                            <a
                                                                                href={route(
                                                                                    "installments.receipt",
                                                                                    inst.id,
                                                                                )}
                                                                                target="_blank"
                                                                                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex whitespace-nowrap"
                                                                            >
                                                                                <Download className="w-3.5 h-3.5" />
                                                                                Lihat
                                                                                Kwitansi
                                                                            </a>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg whitespace-nowrap">
                                                                                <Clock className="w-3.5 h-3.5" />
                                                                                Verifikasi
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

                                    {selectedIds.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="px-6 md:px-8 py-6 md:py-8 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200"
                                        >
                                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
                                                        Cicilan Terpilih untuk
                                                        Dibayar
                                                    </p>
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-2xl md:text-3xl font-black text-gray-900">
                                                            {selectedIds.length}{" "}
                                                            Cicilan
                                                        </p>
                                                        <p className="text-xs font-medium text-gray-600">
                                                            Total Nominal:{" "}
                                                            <span className="font-bold text-blue-600">
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
                                                    className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    <Zap className="w-5 h-5" />
                                                    {isLoadingPay
                                                        ? "Memproses..."
                                                        : "Bayar Semua"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* FOOTER INFO */}
                                    <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-green-500" />
                                        <p className="text-xs font-bold text-gray-400">
                                            Seluruh data pembayaran dijamin
                                            keamanannya dan tercatat pada sistem
                                            OJK melalui penyedia pembiayaan
                                            terpilih.
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto py-24 text-center">
                            <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-8 border border-white">
                                <CreditCard className="w-16 h-16 text-gray-400" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">
                                Tidak Ada Tagihan Aktif
                            </h3>
                            <p className="text-gray-500 font-bold mb-10 text-lg leading-relaxed">
                                Anda belum memiliki transaksi dengan skema
                                pembiayaan/cicilan. Hubungi admin kami jika Anda
                                merasa ini adalah kesalahan.
                            </p>

                            <Link href="/motors">
                                <button className="h-16 px-10 bg-primary text-black font-black uppercase tracking-widest rounded-[2rem] hover:bg-white transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 mx-auto">
                                    Lihat Katalog Motor{" "}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

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
                            className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative z-20 overflow-hidden"
                        >
                            <div className="px-10 pt-10 pb-6 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center text-primary-dark shadow-lg shadow-yellow-400/20">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    BUKTI PEMBAYARAN
                                </h3>
                                <button
                                    onClick={closeUploadModal}
                                    className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitPayment}
                                className="p-10 pt-0 space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                                                Jumlah Bayar
                                            </p>
                                            <p className="text-4xl font-black text-primary">
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
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                                                Target
                                            </p>
                                            <p className="text-sm font-black text-gray-900 uppercase">
                                                #Cicilan{" "}
                                                {selectedInstallment.installment_number ||
                                                    "DP"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
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
                                            className="w-full h-14 rounded-2xl bg-gray-50 border border-gray-100 px-6 font-black text-gray-900 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none"
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
                                            <div className="w-full h-40 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 group-hover:bg-gray-50 group-hover:border-primary/30 transition-all">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-primary transition-all">
                                                    <Upload className="w-6 h-6" />
                                                </div>
                                                {data.payment_proof ? (
                                                    <p className="text-xs font-black text-primary uppercase">
                                                        {
                                                            data.payment_proof
                                                                .name
                                                        }
                                                    </p>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                            Seret gambar kesini
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-300 uppercase">
                                                            Pilih dari Galeri
                                                            Smartphone
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
                                    className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black disabled:opacity-50 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                                >
                                    {processing ? (
                                        <Activity className="animate-spin" />
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
