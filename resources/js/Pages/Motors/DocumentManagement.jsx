import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Eye,
    Clock,
    XCircle,
    AlertTriangle,
    Image as ImageIcon,
    Trash2,
    ShieldCheck,
    Database,
    ScanLine,
    X,
    Lock,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentManagement({ transaction }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, progress } = useForm({
        documents: {
            KTP: [],
            KK: [],
            SLIP_GAJI: [],
            LAINNYA: [],
        },
    });

    // Status Helper
    const getCreditStatusInfo = (status) => {
        switch (status) {
            case "disetujui":
            case "ready_for_delivery":
                return {
                    label: "DISETUJUI",
                    color: "bg-green-500/10 text-green-400 border-green-500/20",
                    icon: CheckCircle,
                };
            case "menunggu_persetujuan":
            case "dikirim_ke_surveyor":
            case "PENDING_REVIEW":
            case "SUBMITTED_TO_SURVEYOR":
            case "SURVEY_SCHEDULED":
                return {
                    label: "DIPROSES",
                    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                    icon: Activity,
                };
            case "ditolak":
            case "REJECTED":
                return {
                    label: "DITOLAK",
                    color: "bg-red-500/10 text-red-400 border-red-500/20",
                    icon: XCircle,
                };
            default:
                return {
                    label: status,
                    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    icon: FileText,
                };
        }
    };

    const handleFileChange = (e, type) => {
        const newFiles = Array.from(e.target.files);
        setData("documents", {
            ...data.documents,
            [type]: [...data.documents[type], ...newFiles],
        });
        e.target.value = "";
    };

    const handleRemoveFile = (type, index) => {
        const newFiles = [...data.documents[type]];
        newFiles.splice(index, 1);
        setData("documents", {
            ...data.documents,
            [type]: newFiles,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("motors.update-documents", transaction.id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const creditStatus = getCreditStatusInfo(
        transaction.credit_detail?.credit_status,
    );
    const StatusIcon = creditStatus.icon;

    const groupedDocuments =
        transaction.credit_detail?.documents?.reduce((acc, doc) => {
            const type = doc.document_type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(doc);
            return acc;
        }, {}) || {};

    const hasRequiredDocs =
        transaction.credit_detail?.documents?.some(
            (d) => d.document_type === "KTP",
        ) &&
        transaction.credit_detail?.documents?.some(
            (d) => d.document_type === "KK",
        ) &&
        transaction.credit_detail?.documents?.some(
            (d) => d.document_type === "SLIP_GAJI",
        );

    return (
        <PublicLayout auth={auth} title="Brankas Dokumen">
            <div className="flex-grow pt-[104px]">
                <div className="bg-surface-dark min-h-screen pb-20 overflow-hidden relative pt-10">
                    {/* Background FX */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-surface-dark to-surface-dark pointer-events-none"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-md">
                                <Database size={12} className="text-blue-400" />
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-400">
                                    AKSES DATABASE
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
                                BRANKAS{" "}
                                <span className="text-accent text-glow">
                                    DOKUMEN
                                </span>
                            </h1>
                            <p className="text-white/40 font-mono text-sm">
                                Kelola dan perbarui aset verifikasi untuk ID
                                Transaksi: #{transaction.id}
                            </p>
                        </motion.div>

                        <div className="max-w-5xl mx-auto space-y-8">
                            {/* Transaction Status Card */}
                            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-black/50 rounded-lg border border-white/10 p-2 flex items-center justify-center">
                                            <img
                                                src={`/storage/${transaction.motor.image_path}`}
                                                alt={transaction.motor.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white font-display">
                                                {transaction.motor.name}
                                            </h2>
                                            <div className="flex items-center gap-4 text-xs font-mono text-white/50 mt-1">
                                                <span>
                                                    TENOR:{" "}
                                                    {
                                                        transaction
                                                            .credit_detail.tenor
                                                    }{" "}
                                                    BLN
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    DP:{" "}
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .down_payment,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`px-4 py-2 rounded-full border flex items-center gap-2 ${creditStatus.color}`}
                                    >
                                        <StatusIcon size={16} />
                                        <span className="text-xs font-bold tracking-wider">
                                            {creditStatus.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Existing Documents Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-bold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                        <ShieldCheck
                                            size={18}
                                            className="text-green-400"
                                        />
                                        ASET TERSIMPAN
                                    </h3>

                                    {Object.keys(groupedDocuments).length >
                                    0 ? (
                                        <div className="space-y-4">
                                            {Object.entries(
                                                groupedDocuments,
                                            ).map(([type, docs]) => (
                                                <div
                                                    key={type}
                                                    className="space-y-2"
                                                >
                                                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">
                                                        {type.replace(
                                                            /_/g,
                                                            " ",
                                                        )}
                                                    </h4>
                                                    {docs.map((doc, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                    <FileText
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </div>
                                                                <span className="text-sm text-white/70 font-mono truncate max-w-[150px]">
                                                                    {
                                                                        doc.original_name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <a
                                                                href={`/storage/${doc.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
                                                            >
                                                                <Eye
                                                                    size={12}
                                                                />{" "}
                                                                LIHAT
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-white/30 font-mono text-sm">
                                                BRANKAS KOSONG
                                            </p>
                                        </div>
                                    )}

                                    <div
                                        className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${
                                            hasRequiredDocs
                                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                        }`}
                                    >
                                        {hasRequiredDocs ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <AlertTriangle size={20} />
                                        )}
                                        <span className="text-xs font-bold font-mono">
                                            {hasRequiredDocs
                                                ? "SEMUA PROTOKOL TERVERIFIKASI"
                                                : "DATA TIDAK LENGKAP TERDETEKSI"}
                                        </span>
                                    </div>
                                </div>

                                {/* Upload New Form */}
                                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-bold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                        <Upload
                                            size={18}
                                            className="text-accent"
                                        />
                                        UNGGAH DATA BARU
                                    </h3>

                                    <form
                                        onSubmit={submit}
                                        className="space-y-4"
                                    >
                                        <FileUploadFieldMin
                                            label="KTP"
                                            id="document_ktp"
                                            accept="image/*,application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(e, "KTP")
                                            }
                                            onRemove={(idx) =>
                                                handleRemoveFile("KTP", idx)
                                            }
                                            error={errors["documents.KTP"]}
                                            files={data.documents.KTP}
                                        />
                                        <FileUploadFieldMin
                                            label="KK"
                                            id="document_kk"
                                            accept="image/*,application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(e, "KK")
                                            }
                                            onRemove={(idx) =>
                                                handleRemoveFile("KK", idx)
                                            }
                                            error={errors["documents.KK"]}
                                            files={data.documents.KK}
                                        />
                                        <FileUploadFieldMin
                                            label="SLIP GAJI"
                                            id="document_slip_gaji"
                                            accept="image/*,application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(e, "SLIP_GAJI")
                                            }
                                            onRemove={(idx) =>
                                                handleRemoveFile(
                                                    "SLIP_GAJI",
                                                    idx,
                                                )
                                            }
                                            error={
                                                errors["documents.SLIP_GAJI"]
                                            }
                                            files={data.documents.SLIP_GAJI}
                                        />
                                        <FileUploadFieldMin
                                            label="DOKUMEN TAMBAHAN"
                                            id="document_lainnya"
                                            accept="image/*,application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(e, "LAINNYA")
                                            }
                                            onRemove={(idx) =>
                                                handleRemoveFile("LAINNYA", idx)
                                            }
                                            error={errors["documents.LAINNYA"]}
                                            files={data.documents.LAINNYA}
                                        />

                                        {progress && (
                                            <div className="w-full bg-black/50 rounded-full h-1 mt-4 overflow-hidden">
                                                <div
                                                    className="h-full bg-accent"
                                                    style={{
                                                        width: `${progress.percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-4 mt-6">
                                            <Link
                                                href={route(
                                                    "motors.order.confirmation",
                                                    transaction.id,
                                                )}
                                                className="px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors font-bold text-xs"
                                            >
                                                <ArrowLeft size={16} />
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                                            >
                                                <Upload size={16} /> UNGGAH
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function FileUploadFieldMin({
    label,
    id,
    accept,
    onChange,
    onRemove,
    error,
    files,
}) {
    return (
        <div className="bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-center mb-2">
                <label
                    htmlFor={id}
                    className="text-[10px] font-bold text-white/50 uppercase tracking-wider"
                >
                    {label}
                </label>
                <div className="relative">
                    <input
                        type="file"
                        id={id}
                        className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10"
                        accept={accept}
                        multiple
                        onChange={onChange}
                    />
                    <button
                        type="button"
                        className="text-accent hover:text-white transition-colors"
                    >
                        <Upload size={14} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {files && files.length > 0 && (
                    <div className="space-y-1">
                        {Array.from(files).map((file, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center justify-between text-xs text-white bg-white/5 p-1.5 rounded"
                            >
                                <span className="truncate max-w-[150px]">
                                    {file.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onRemove(idx)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <X size={12} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
            {error && (
                <span className="text-[10px] text-red-500 block mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}
