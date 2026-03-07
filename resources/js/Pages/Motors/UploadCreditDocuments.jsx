import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Image as ImageIcon,
    X,
    Trash2,
    ShieldCheck,
    ScanLine,
    Database,
    Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadCreditDocuments({ transaction }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, progress } = useForm({
        documents: {
            KTP: [],
            KK: [],
            SLIP_GAJI: [],
            LAINNYA: [],
        },
    });

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
        post(route("motors.upload-credit-documents.post", transaction.id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <PublicLayout auth={auth} title="Uplink Data Aman">
            <div className="flex-grow pt-[104px]">
                <div className="bg-surface-dark min-h-screen pb-20 overflow-hidden relative pt-10">
                    {/* Background Cyber-Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-5xl mx-auto"
                        >
                            {/* Header */}
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-6 backdrop-blur-md">
                                    <Lock size={12} className="text-accent" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">
                                        Koneksi Terenkripsi
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-display font-black text-white px-4 leading-none mb-4">
                                    DATA{" "}
                                    <span className="text-accent text-glow">
                                        UPLINK
                                    </span>
                                </h1>
                                <p className="text-white/40 max-w-lg mx-auto font-sans">
                                    Unggah dokumen verifikasi yang diperlukan ke
                                    database aman untuk diproses.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Panel: Transaction Summary */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-6 relative group">
                                        <div className="absolute top-0 right-0 p-20 bg-white/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500"></div>

                                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                            <Database
                                                size={18}
                                                className="text-accent"
                                            />{" "}
                                            Aset Target
                                        </h3>

                                        <div className="aspect-video rounded-xl bg-black/50 border border-white/5 mb-4 overflow-hidden p-4 flex items-center justify-center relative">
                                            <img
                                                src={`/storage/${transaction.motor.image_path}`}
                                                alt={transaction.motor.name}
                                                className="w-full h-full object-contain relative z-10"
                                            />
                                            <div className="absolute inset-0 bg-[url('/assets/img/grid.svg')] opacity-20"></div>
                                        </div>

                                        <h2 className="text-2xl font-display font-bold text-white mb-6">
                                            {transaction.motor.name}
                                        </h2>

                                        <div className="space-y-4 font-mono text-sm">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-white/40">
                                                    Uang Muka
                                                </span>
                                                <span className="text-accent">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .down_payment,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-white/40">
                                                    Cicilan/Bulan
                                                </span>
                                                <span className="text-white font-bold">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .monthly_installment,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-white/40">
                                                    Tenor
                                                </span>
                                                <span className="text-white">
                                                    {
                                                        transaction
                                                            .credit_detail.tenor
                                                    }{" "}
                                                    Bulan
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
                                        <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                                            <ShieldCheck size={18} /> Protokol
                                            Wajib
                                        </h4>
                                        <ul className="space-y-2 text-xs text-blue-200/70 font-mono">
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">
                                                    [1]
                                                </span>{" "}
                                                Valid ID Card (KTP)
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">
                                                    [2]
                                                </span>{" "}
                                                Family Card (KK)
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">
                                                    [3]
                                                </span>{" "}
                                                Bukti Penghasilan (Slip Gaji)
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Panel: Upload Form */}
                                <div className="lg:col-span-2">
                                    <form
                                        onSubmit={submit}
                                        className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <FileUploadField
                                                label="KARTU IDENTITAS (KTP)"
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
                                                required
                                                description="Pindai Depan & Belakang"
                                            />

                                            <FileUploadField
                                                label="KARTU KELUARGA (KK)"
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
                                                required
                                                description="Pindai Dokumen Lengkap"
                                            />

                                            <FileUploadField
                                                label="BUKTI PENGHASILAN"
                                                id="document_slip_gaji"
                                                accept="image/*,application/pdf"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "SLIP_GAJI",
                                                    )
                                                }
                                                onRemove={(idx) =>
                                                    handleRemoveFile(
                                                        "SLIP_GAJI",
                                                        idx,
                                                    )
                                                }
                                                error={
                                                    errors[
                                                        "documents.SLIP_GAJI"
                                                    ]
                                                }
                                                files={data.documents.SLIP_GAJI}
                                                required
                                                description="3 Bulan Terakhir"
                                            />

                                            <FileUploadField
                                                label="DATA TAMBAHAN"
                                                id="document_lainnya"
                                                accept="image/*,application/pdf"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "LAINNYA",
                                                    )
                                                }
                                                onRemove={(idx) =>
                                                    handleRemoveFile(
                                                        "LAINNYA",
                                                        idx,
                                                    )
                                                }
                                                error={
                                                    errors["documents.LAINNYA"]
                                                }
                                                files={data.documents.LAINNYA}
                                                description="Dokumen Pendukung Opsional"
                                            />
                                        </div>

                                        {progress && (
                                            <div className="w-full bg-black/50 rounded-full h-1 mb-6 border border-white/10 overflow-hidden relative">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${progress.percentage}%`,
                                                    }}
                                                    className="h-full bg-accent relative"
                                                >
                                                    <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
                                                </motion.div>
                                            </div>
                                        )}

                                        <div className="flex flex-col-reverse md:flex-row gap-4 pt-6 border-t border-white/5">
                                            <Link
                                                href={route(
                                                    "motors.order.confirmation",
                                                    transaction.id,
                                                )}
                                                className="px-6 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={20} /> BATALKAN
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 bg-accent text-black px-6 py-4 rounded-xl font-bold font-display text-lg hover:bg-lime-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] transform hover:-translate-y-1"
                                            >
                                                <Upload size={20} /> MULAI
                                                UPLOAD
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function FileUploadField({
    label,
    id,
    accept,
    onChange,
    onRemove,
    error,
    files,
    required,
    description,
}) {
    const isImage = (file) => file.type.startsWith("image/");

    return (
        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-colors duration-300 group/field">
            <div className="flex justify-between items-start mb-4">
                <label
                    htmlFor={id}
                    className="flex items-center gap-2 text-xs font-bold text-white/70 uppercase tracking-widest group-hover/field:text-white transition-colors"
                >
                    {label}
                    {required && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                </label>
            </div>

            <div className="space-y-4">
                {/* Dropzone Area */}
                <div className="relative group">
                    <input
                        type="file"
                        id={id}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                        accept={accept}
                        multiple
                        onChange={onChange}
                        required={files.length === 0 && required}
                    />
                    <div
                        className={`w-full p-6 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden bg-black/40 ${
                            error
                                ? "border-red-500/50"
                                : "border-white/10 group-hover:border-accent group-hover:bg-accent/5"
                        }`}
                    >
                        {/* Scanning Grid Animation */}
                        <div className="absolute inset-0 bg-[url('/assets/img/grid.svg')] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto border transition-all duration-300 ${
                                    error
                                        ? "bg-red-500/10 border-red-500/50 text-red-500"
                                        : "bg-white/5 border-white/10 text-white/50 group-hover:bg-accent group-hover:text-black group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(190,242,100,0.4)]"
                                }`}
                            >
                                <ScanLine size={20} />
                            </div>
                            <span className="block text-xs font-bold text-white/50 group-hover:text-white transition-colors uppercase tracking-wider">
                                Click to Scan
                            </span>
                            <span className="block text-[10px] text-white/30 mt-1 font-mono">
                                {description}
                            </span>
                        </div>
                    </div>
                </div>

                {/* File List Preview */}
                <AnimatePresence mode="popLayout">
                    {files && files.length > 0 && (
                        <motion.div layout className="space-y-2">
                            {Array.from(files).map((file, idx) => (
                                <motion.div
                                    layout
                                    key={`${file.name}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative flex items-center p-2 rounded-lg border border-white/5 bg-white/5 group overflow-hidden"
                                >
                                    {/* Preview Thumbnail */}
                                    <div className="w-10 h-10 rounded bg-black/50 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                                        {isImage(file) ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <FileText
                                                size={16}
                                                className="text-blue-400"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 ml-3 mr-8">
                                        <p className="text-xs font-bold text-white truncate font-mono">
                                            {file.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="h-0.5 w-12 bg-green-500/30 rounded-full overflow-hidden">
                                                <div className="h-full w-full bg-green-500 animate-[pulse_2s_infinite]"></div>
                                            </div>
                                            <span className="text-[10px] text-green-400 font-mono">
                                                SIAP
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(idx)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 mt-3 text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20 font-mono"
                >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}
        </div>
    );
}
