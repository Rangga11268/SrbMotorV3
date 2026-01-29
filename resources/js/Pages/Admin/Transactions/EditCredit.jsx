import React from "react";
import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeft,
    Save,
    CreditCard,
    FileText,
    User,
    Bike,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    ChevronDown,
    AlertTriangle,
    Shield,
    Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditCredit({ transaction }) {
    const { credit_detail, motor, user } = transaction;
    const documents = credit_detail?.documents || [];

    const { data, setData, put, processing, errors } = useForm({
        credit_status: credit_detail?.credit_status || "menunggu_persetujuan",
        approved_amount: credit_detail?.approved_amount || "",
        admin_notes: transaction.notes || "",
    });

    const creditStatusOptions = [
        {
            value: "menunggu_persetujuan",
            label: "MENUNGGU PERSETUJUAN",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            desc: "Dokumen sedang ditinjau",
        },
        {
            value: "data_tidak_valid",
            label: "DATA TIDAK VALID",
            color: "text-red-400",
            bg: "bg-red-500/10",
            desc: "Dokumen perlu diperbaiki",
        },
        {
            value: "dikirim_ke_surveyor",
            label: "DIKIRIM KE SURVEYOR",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            desc: "Menunggu jadwal survey",
        },
        {
            value: "jadwal_survey",
            label: "JADWAL SURVEY",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            desc: "Survey telah dijadwalkan",
        },
        {
            value: "disetujui",
            label: "DISETUJUI",
            color: "text-green-400",
            bg: "bg-green-500/10",
            desc: "Kredit disetujui oleh leasing",
        },
        {
            value: "ditolak",
            label: "DITOLAK",
            color: "text-red-400",
            bg: "bg-red-500/10",
            desc: "Kredit ditolak oleh leasing",
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.updateCredit", transaction.id), {
            onSuccess: () => toast.success("STATUS KREDIT BERHASIL DIPERBARUI"),
            onError: () => toast.error("GAGAL MEMPERBARUI STATUS"),
        });
    };

    const handleQuickApprove = () => {
        if (
            confirm(
                "Setujui kredit ini? Status akan berubah menjadi DISETUJUI."
            )
        ) {
            router.put(
                route("admin.transactions.updateCredit", transaction.id),
                {
                    credit_status: "disetujui",
                    approved_amount: data.approved_amount || motor?.price || 0,
                    admin_notes: data.admin_notes,
                },
                {
                    onSuccess: () => toast.success("KREDIT BERHASIL DISETUJUI"),
                    onError: () => toast.error("GAGAL MENYETUJUI KREDIT"),
                }
            );
        }
    };

    const handleQuickReject = () => {
        if (confirm("Tolak kredit ini? Status akan berubah menjadi DITOLAK.")) {
            router.put(
                route("admin.transactions.updateCredit", transaction.id),
                {
                    credit_status: "ditolak",
                    approved_amount: 0,
                    admin_notes: data.admin_notes,
                },
                {
                    onSuccess: () => toast.success("KREDIT BERHASIL DITOLAK"),
                    onError: () => toast.error("GAGAL MENOLAK KREDIT"),
                }
            );
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    const currentStatus = creditStatusOptions.find(
        (opt) => opt.value === data.credit_status
    );

    return (
        <AdminLayout title={`EDIT KREDIT #${transaction.id}`}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Control */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <Link
                        href={route("admin.transactions.show", transaction.id)}
                        className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                    >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-mono text-sm tracking-wider uppercase">
                            KEMBALI KE DETAIL
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        <CreditCard size={14} />
                        MODE EDIT KREDIT
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Form Section */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Status Selection Panel */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-24 translate-x-24"></div>

                                <h3 className="text-xl font-bold text-white mb-8 font-display uppercase tracking-wider flex items-center gap-3">
                                    <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                                    PROTOKOL STATUS KREDIT
                                </h3>

                                {/* Status Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    {creditStatusOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    "credit_status",
                                                    opt.value
                                                )
                                            }
                                            className={`p-4 rounded-xl border transition-all text-left group ${
                                                data.credit_status === opt.value
                                                    ? `${opt.bg} border-current ${opt.color} shadow-lg scale-[1.02]`
                                                    : "bg-black/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        data.credit_status ===
                                                        opt.value
                                                            ? "bg-current"
                                                            : "bg-white/20"
                                                    }`}
                                                ></div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                                    {opt.label}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-white/40 font-mono">
                                                {opt.desc}
                                            </p>
                                        </button>
                                    ))}
                                </div>

                                {/* Approved Amount (shown when status is disetujui) */}
                                {data.credit_status === "disetujui" && (
                                    <div className="mb-8 p-6 rounded-xl bg-green-500/5 border border-green-500/20">
                                        <label className="block text-[10px] font-bold text-green-400 uppercase tracking-[0.2em] mb-2 font-mono">
                                            JUMLAH DISETUJUI LEASING
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500 font-mono font-bold">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                value={data.approved_amount}
                                                onChange={(e) =>
                                                    setData(
                                                        "approved_amount",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-14 pr-6 py-4 rounded-xl bg-black/50 border border-green-500/30 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-white placeholder-white/20 font-mono text-xl font-bold transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                        <p className="text-[10px] text-white/40 font-mono mt-2">
                                            Nominal yang disetujui oleh pihak
                                            leasing/surveyor
                                        </p>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 font-mono">
                                        CATATAN ADMIN
                                    </label>
                                    <textarea
                                        value={data.admin_notes}
                                        onChange={(e) =>
                                            setData(
                                                "admin_notes",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-6 py-4 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-white/20 font-mono transition-all"
                                        placeholder="Catatan internal untuk proses kredit..."
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={handleQuickReject}
                                    className="py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold font-display uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} />
                                    TOLAK KREDIT
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold font-display uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    SIMPAN PERUBAHAN
                                </button>

                                <button
                                    type="button"
                                    onClick={handleQuickApprove}
                                    className="py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold font-display uppercase tracking-wider hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    SETUJUI KREDIT
                                </button>
                            </div>
                        </form>

                        {/* Document Vault */}
                        <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display uppercase tracking-wider">
                                    <Shield
                                        className="text-yellow-400"
                                        size={18}
                                    />
                                    DOKUMEN PELANGGAN
                                </h3>
                                <span className="text-[10px] font-mono text-white/40">
                                    {documents.length} DOKUMEN
                                </span>
                            </div>

                            <div className="p-6">
                                {documents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 rounded bg-white/5 text-blue-400 group-hover:text-white transition-colors">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="font-bold text-white text-xs font-display uppercase tracking-wide truncate">
                                                            {doc.document_type}
                                                        </div>
                                                        <div className="text-[10px] text-white/40 font-mono">
                                                            {new Date(
                                                                doc.created_at
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`/storage/${doc.file_path}`}
                                                    target="_blank"
                                                    className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-blue-500/20 text-[10px] font-bold text-white/60 hover:text-blue-400 rounded transition-all uppercase tracking-wider"
                                                >
                                                    <Eye size={12} />
                                                    LIHAT DOKUMEN
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                                        <AlertTriangle
                                            size={32}
                                            className="mx-auto text-amber-500/50 mb-3"
                                        />
                                        <p className="text-white/30 font-mono text-xs">
                                            BELUM ADA DOKUMEN TERUPLOAD
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="sticky top-6 space-y-6">
                            {/* Customer Info */}
                            <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                                <h3 className="text-xs font-bold text-white/50 mb-4 uppercase tracking-widest font-mono flex items-center gap-2">
                                    <User size={14} className="text-blue-400" />
                                    DATA PELANGGAN
                                </h3>

                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] mx-auto mb-3">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                            <span className="text-xl font-black text-white">
                                                {(user?.name || "U")[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-white">
                                        {user?.name || "Unknown"}
                                    </h4>
                                    <p className="text-xs text-white/40 font-mono">
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="space-y-3 border-t border-white/5 pt-4">
                                    <div>
                                        <label className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">
                                            TELEPON
                                        </label>
                                        <div className="font-mono text-sm text-white">
                                            {transaction.customer_phone ||
                                                user?.phone_number ||
                                                "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">
                                            PEKERJAAN
                                        </label>
                                        <div className="font-mono text-sm text-white">
                                            {transaction.customer_occupation ||
                                                "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Summary */}
                            <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                                <h3 className="text-xs font-bold text-white/50 mb-4 uppercase tracking-widest font-mono flex items-center gap-2">
                                    <Activity
                                        size={14}
                                        className="text-green-400"
                                    />
                                    RINGKASAN KREDIT
                                </h3>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                        <label className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">
                                            UNIT
                                        </label>
                                        <div className="font-display font-bold text-white text-lg uppercase">
                                            {motor?.name || "-"}
                                        </div>
                                        <div className="text-blue-400 font-mono font-bold mt-1">
                                            {formatRupiah(motor?.price)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                                            <label className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">
                                                DP
                                            </label>
                                            <div className="font-mono font-bold text-white text-sm">
                                                {formatRupiah(
                                                    credit_detail?.down_payment
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                                            <label className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">
                                                TENOR
                                            </label>
                                            <div className="font-mono font-bold text-white text-sm">
                                                {credit_detail?.tenor || 0} BLN
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">
                                            ANGSURAN/BULAN
                                        </label>
                                        <div className="font-mono font-bold text-white text-xl">
                                            {formatRupiah(
                                                credit_detail?.monthly_installment
                                            )}
                                        </div>
                                    </div>

                                    {/* Current Status Display */}
                                    <div
                                        className={`p-4 rounded-xl border ${currentStatus?.bg} ${currentStatus?.color} border-current`}
                                    >
                                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 opacity-70">
                                            STATUS SAAT INI
                                        </label>
                                        <div className="font-display font-bold text-lg uppercase">
                                            {currentStatus?.label ||
                                                data.credit_status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
