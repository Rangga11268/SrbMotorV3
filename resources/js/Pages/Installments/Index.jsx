import React, { useState, useEffect } from "react";
import { Head, useForm, router, usePage, Link } from "@inertiajs/react";
import Navbar from "@/Components/Public/Navbar";
import Footer from "@/Components/Public/Footer";
import {
    CreditCard,
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    Upload,
    ChevronRight,
    Search,
    Download,
    X,
    Shield,
    Zap,
    TrendingUp,
    Activity,
    DollarSign,
    Landmark,
    ArrowRight,
    FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallmentIndex({ transactions }) {
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
            <Head title="Cicilan Saya - SRB Motors" />
            <Navbar auth={auth} />

            <main className="flex-grow pt-[104px] pb-20">
                {/* HERO HEADER */}
                <div className="bg-gray-50 pt-16 pb-24 relative border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
                            <Landmark className="w-4 h-4" /> Manajemen
                            Pembiayaan
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tight">
                            RENCANA{" "}
                            <span className="text-blue-600/20">CICILAN</span>
                        </h1>
                        <p className="mt-4 text-slate-500 font-bold text-lg max-w-2xl">
                            Pantau status pembayaran, unduh kwitansi, dan
                            lakukan pelunasan unit motor Anda dengan mudah dan
                            aman.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                    {transactions.length > 0 ? (
                        <div className="space-y-12">
                            {transactions.map((transaction) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={transaction.id}
                                    className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white overflow-hidden"
                                >
                                    {/* TRANSACTION STRIP */}
                                    <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-gray-50/50 border-b border-gray-100">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                                    {transaction.motor?.name ||
                                                        "Unit Motor"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        NO INVOICE:{" "}
                                                        <span className="text-gray-900">
                                                            {transaction.invoice_number ||
                                                                `INV-${transaction.id}`}
                                                        </span>
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        TRANSAKSI:{" "}
                                                        <span className="text-gray-900">
                                                            {formatDate(
                                                                transaction.created_at,
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                                Sisa Kewajiban
                                            </p>
                                            <p className="text-3xl font-black text-primary">
                                                {formatCurrency(
                                                    transaction.total_amount,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* INSTALLMENT TABLE */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/30 border-b border-gray-100">
                                                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Termin
                                                    </th>
                                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Jatuh Tempo
                                                    </th>
                                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Nominal Pembayaran
                                                    </th>
                                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Status
                                                    </th>
                                                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                                        Tindakan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {transaction.installments &&
                                                    transaction.installments.map(
                                                        (inst) => (
                                                            <tr
                                                                key={inst.id}
                                                                className="hover:bg-gray-50/50 transition-colors group"
                                                            >
                                                                <td className="px-10 py-6">
                                                                    <span
                                                                        className={`text-[11px] font-black uppercase tracking-widest ${inst.installment_number === 0 ? "text-blue-500" : "text-gray-900"}`}
                                                                    >
                                                                        {inst.installment_number ===
                                                                        0
                                                                            ? "Down Payment (DP)"
                                                                            : `# Cicilan ${inst.installment_number}`}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-6">
                                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                                                        <Calendar className="w-4 h-4 text-gray-300" />
                                                                        {formatDate(
                                                                            inst.due_date,
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6">
                                                                    <div className="space-y-1">
                                                                        <p className="text-lg font-black text-gray-900">
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
                                                                            <p className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-fit flex items-center gap-1 uppercase tracking-widest">
                                                                                <AlertTriangle className="w-3 h-3" />{" "}
                                                                                Termasuk
                                                                                Denda
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6">
                                                                    {getStatusBadge(
                                                                        inst.status,
                                                                    )}
                                                                </td>
                                                                <td className="px-10 py-6">
                                                                    <div className="flex items-center justify-center gap-3">
                                                                        {inst.status ===
                                                                            "pending" ||
                                                                        inst.status ===
                                                                            "overdue" ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleOnlinePayment(
                                                                                            inst,
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        isLoadingPay
                                                                                    }
                                                                                    className="h-10 px-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                                                                                >
                                                                                    <Zap className="w-4 h-4" />{" "}
                                                                                    {isLoadingPay
                                                                                        ? "Memproses..."
                                                                                        : "Bayar Snap"}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        openUploadModal(
                                                                                            inst,
                                                                                        )
                                                                                    }
                                                                                    className="w-10 h-10 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all rounded-xl flex items-center justify-center shadow-sm"
                                                                                    title="Upload Bukti Manual"
                                                                                >
                                                                                    <Upload className="w-4 h-4" />
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
                                                                                    className="w-10 h-10 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all rounded-xl flex items-center justify-center shadow-sm"
                                                                                    title="Cek Status Webhook"
                                                                                >
                                                                                    <Activity
                                                                                        className={`w-4 h-4 ${isLoadingCheck ? "animate-spin" : ""}`}
                                                                                    />
                                                                                </button>
                                                                            </>
                                                                        ) : inst.status ===
                                                                          "paid" ? (
                                                                            <a
                                                                                href={route(
                                                                                    "installments.receipt",
                                                                                    inst.id,
                                                                                )}
                                                                                target="_blank"
                                                                                className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-black uppercase tracking-widest transition-colors"
                                                                            >
                                                                                <Download className="w-4 h-4" />{" "}
                                                                                Kwitansi
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                                                Menunggu
                                                                                Konfirmasi
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
            </main>

            <Footer />

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
        </div>
    );
}
