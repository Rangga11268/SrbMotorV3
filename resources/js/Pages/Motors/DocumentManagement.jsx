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
    Trash2,
    FileCheck,
    ChevronLeft,
    ShieldCheck,
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

    const documentTypes = [
        {
            key: "KTP",
            label: "Kartu Identitas (KTP)",
            description: "Foto bagian depan dan belakang",
            required: true,
        },
        {
            key: "KK",
            label: "Kartu Keluarga (KK)",
            description: "Dokumen lengkap dan jelas",
            required: true,
        },
        {
            key: "SLIP_GAJI",
            label: "Bukti Penghasilan",
            description: "Slip gaji 3 bulan terakhir",
            required: true,
        },
        {
            key: "LAINNYA",
            label: "Dokumen Pendukung",
            description: "Dokumen tambahan (opsional)",
            required: false,
        },
    ];

    const existingDocs = transaction.credit_detail?.documents || [];
    const hasExisting = (type) => existingDocs.some(doc => doc.document_type === type);

    // Check if all required documents are complete (either existing or newly selected)
    const isComplete =
        (hasExisting("KTP") || data.documents.KTP.length > 0) &&
        (hasExisting("KK") || data.documents.KK.length > 0) &&
        (hasExisting("SLIP_GAJI") || data.documents.SLIP_GAJI.length > 0);

    // Locked if status is under review (menunggu_persetujuan) or already processed
    const currentStatus = transaction.credit_detail?.status || "pengajuan_masuk";
    
    // Allow editing ONLY if status is 'pengajuan_masuk' (initial) or 'dokumen_ditolak' (needs fix)
    const editableStatuses = ["pengajuan_masuk", "dokumen_ditolak", "data_tidak_valid"];
    const isLocked = transaction.status === "cancelled" || !editableStatuses.includes(currentStatus);


    return (
        <PublicLayout auth={auth} title="Kelola Dokumen">
            <div className="bg-slate-50 min-h-screen pt-[110px] sm:pt-32 pb-20">
                {/* MODERN INDUSTRIAL HEADER */}
                <header className="bg-black text-white pt-16 pb-24 border-b border-gray-800 relative overflow-hidden mb-16">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="container mx-auto max-w-7xl px-4 relative z-10">
                        <Link
                            href={route("motors.transaction.show", transaction.id)}
                            className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#1c69d4] transition-all group uppercase mb-12"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            KEMBALI KE DETAIL TRANSAKSI
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="bg-[#1c69d4] text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                                        RE-UPLOAD DOKUMEN
                                    </span>
                                    <span className="text-gray-500 font-bold text-[10px] tracking-widest uppercase">
                                        TRANSAKSI #{String(transaction.id).padStart(6, "0")}
                                    </span>
                                </div>
                                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                                    PELENGKAPAN <span className="text-[#1c69d4]">BERKAS</span>
                                </h1>
                                <p className="text-gray-400 text-sm max-w-xl font-medium">
                                    Unggah atau perbarui dokumen persyaratan kredit Anda untuk melanjutkan proses verifikasi leasing.
                                </p>
                            </div>
                            
                            <div className="hidden lg:block shrink-0">
                                <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-none bg-[#1c69d4] flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">DATA KEAMANAN</p>
                                            <p className="text-xs font-bold text-white uppercase tracking-tight">ENKRIPSI 256-BIT SSL</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left: Motor Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-none border border-black overflow-hidden sticky top-24">
                                <div className="aspect-video bg-gray-100 overflow-hidden flex items-center justify-center p-8 border-b border-gray-100">
                                    <img
                                        src={`/storage/${transaction.motor.image_path}`}
                                        alt={transaction.motor.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-1 h-8 bg-[#1c69d4]"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">MODEL MOTOR</p>
                                            <h3 className="font-black text-2xl text-gray-900 uppercase tracking-tighter">
                                                {transaction.motor.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Existing Documents List */}
                                    <div className="mb-8 pb-8 border-b border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                            STATUS DOKUMEN SAAT INI
                                        </p>
                                        {existingDocs.length > 0 ? (
                                            <div className="space-y-3">
                                                {existingDocs.map((doc) => (
                                                    <div key={doc.id} className="flex items-center gap-3">
                                                        <CheckCircle size={14} className="text-[#1c69d4] shrink-0" />
                                                        <a
                                                            href={`/storage/${doc.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-gray-700 hover:text-[#1c69d4] transition-colors truncate uppercase tracking-tight"
                                                        >
                                                            {doc.document_type}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                BELUM ADA DOKUMEN
                                            </p>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    {isLocked ? (
                                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-900 border border-black rounded-none w-full justify-center">
                                            <ShieldCheck size={16} className="text-[#1c69d4]" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                BERKAS TERKUNCI
                                            </span>
                                        </div>
                                    ) : isComplete ? (
                                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-[#1c69d4]/5 border border-[#1c69d4] rounded-none w-full justify-center">
                                            <CheckCircle size={16} className="text-[#1c69d4]" />
                                            <span className="text-[10px] font-black text-[#1c69d4] uppercase tracking-widest">
                                                DOKUMEN LENGKAP
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-amber-500/5 border border-amber-500 rounded-none w-full justify-center">
                                            <AlertCircle size={16} className="text-amber-500" />
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                                MASIH ADA KEKURANGAN
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Upload Form */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-1.5 h-10 bg-[#1c69d4]"></div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">UNGGAH <span className="text-[#1c69d4]">PEMBARUAN</span></h2>
                                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-1">UPLOAD DOKUMEN PENGGANTI ATAU TAMBAHAN</p>
                                </div>
                            </div>

                            <div className="bg-[#1c69d4]/5 border border-[#1c69d4]/20 p-6 mb-12 flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-[#1c69d4] shrink-0" />
                                <div>
                                    <p className="text-[10px] font-black text-[#1c69d4] uppercase tracking-widest mb-1">
                                        {isLocked ? "VERIFIKASI BERLANGSUNG" : "INSTRUKSI PENGUNGGAHAN"}
                                    </p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {isLocked 
                                            ? "Dokumen Anda sedang dalam proses verifikasi atau telah disetujui. Perubahan dokumen tidak diperbolehkan kecuali diminta oleh admin."
                                            : "Anda dapat mengganti dokumen lama dengan versi yang lebih jelas. Pastikan foto tidak terpotong dan tulisan terbaca dengan baik untuk mempercepat proses verifikasi."}
                                    </p>
                                </div>
                            </div>

                            {existingDocs.length > 0 && (
                                <div className="mb-12 p-8 bg-gray-900 border border-black relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                            <div className="flex items-center gap-4">
                                                <CheckCircle className="text-[#1c69d4] w-6 h-6" />
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                                                    ARSIP <span className="text-[#1c69d4]">AKTIF</span>
                                                </h3>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest border border-white/20 px-3 py-1">
                                                {existingDocs.length} FILE TERVERIFIKASI
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {existingDocs.map((doc) => {
                                                const isPdf = doc.file_path.toLowerCase().endsWith(".pdf");
                                                const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.file_path);
                                                return (
                                                    <motion.a
                                                        key={doc.id}
                                                        href={`/storage/${doc.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ y: -4 }}
                                                        className="relative group bg-white/5 border border-white/10 overflow-hidden hover:border-[#1c69d4]/50 transition-all cursor-pointer"
                                                    >
                                                        <div className="aspect-[4/3] bg-black flex items-center justify-center relative overflow-hidden">
                                                            {isImage ? (
                                                                <img
                                                                    src={`/storage/${doc.file_path}`}
                                                                    alt={doc.document_type}
                                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                                                />
                                                            ) : isPdf ? (
                                                                <div className="flex flex-col items-center justify-center text-[#1c69d4] w-full h-full">
                                                                    <FileText size={32} />
                                                                    <span className="text-[10px] font-black mt-2 tracking-widest">PDF</span>
                                                                </div>
                                                            ) : (
                                                                <FileText size={32} className="text-gray-600" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-500"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                                <Eye size={24} className="text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="p-4 bg-white/5 border-t border-white/10">
                                                            <p className="text-[10px] font-black text-[#1c69d4] uppercase tracking-widest mb-1">{doc.document_type}</p>
                                                            <p className="text-white font-bold text-xs uppercase tracking-tight">VERIFIED DOC</p>
                                                        </div>
                                                    </motion.a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {documentTypes.map((docType) => (
                                    <FileUploadField
                                        key={docType.key}
                                        label={docType.label}
                                        description={docType.description}
                                        id={`document_${docType.key.toLowerCase()}`}
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileChange(e, docType.key)}
                                        onRemove={(idx) => handleRemoveFile(docType.key, idx)}
                                        error={errors[`documents.${docType.key}`]}
                                        files={data.documents[docType.key]}
                                        required={docType.required}
                                        isLocked={isLocked}
                                        hasExisting={hasExisting(docType.key)}
                                    />
                                ))}

                                {progress && (
                                    <div className="bg-blue-50 p-6 border border-blue-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">MENGUPLOAD DATA...</span>
                                            <span className="text-[10px] font-black text-[#1c69d4] uppercase tracking-widest">{progress.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-blue-100 h-1 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#1c69d4]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col-reverse sm:flex-row gap-6 pt-12 border-t border-gray-200">
                                    <Link
                                        href={route("motors.transaction.show", transaction.id)}
                                        className="flex items-center justify-center gap-4 px-10 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-black border border-gray-200 transition-all uppercase"
                                    >
                                        <ChevronLeft size={16} /> KEMBALI
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || isLocked}
                                        className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase hover:bg-[#1c69d4] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
                                    >
                                        <Upload size={16} className="group-hover:-translate-y-1 transition-transform" /> 
                                        {isLocked ? "BERKAS TELAH TERKUNCI" : "KONFIRMASI DAN PERBARUI BERKAS"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function FileUploadField({
    label,
    description,
    id,
    accept,
    onChange,
    onRemove,
    error,
    files,
    required,
    isLocked,
    hasExisting,
}) {
    const isImage = (file) => file.type.startsWith("image/");

    return (
        <div className="bg-white border border-gray-200 p-8 hover:border-[#1c69d4] transition-colors relative overflow-hidden group/field">
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rotate-45 translate-x-8 -translate-y-8 group-hover/field:bg-[#1c69d4]/10 transition-colors"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 relative z-10">
                <div>
                    <label
                        htmlFor={id}
                        className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1"
                    >
                        {label}
                        {required && (
                            <span className="text-[#1c69d4] ml-1">*</span>
                        )}
                    </label>
                    <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900">{label.split(' (')[0]}</h4>
                    <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-tight">{description}</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* Upload Zone */}
                <div className="relative group/zone">
                    <input
                        type="file"
                        id={id}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                        accept={accept}
                        multiple
                        onChange={onChange}
                        required={files.length === 0 && required && !hasExisting}
                        disabled={isLocked}
                    />
                    <div
                        className={`w-full p-12 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                            error
                                ? "border-red-300 bg-red-50"
                                : "border-gray-100 bg-slate-50 group-hover/zone:border-[#1c69d4] group-hover/zone:bg-white"
                        }`}
                    >
                        <div className={`p-4 mb-4 ${error ? 'bg-red-100' : 'bg-white'} border border-gray-100 shadow-sm group-hover/zone:scale-110 transition-transform`}>
                            <Upload
                                size={24}
                                className={error ? "text-red-500" : "text-[#1c69d4]"}
                            />
                        </div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-1">
                            PILIH FILE DARI STORAGE
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            PNG, JPG, PDF (MAX 2MB)
                        </p>
                    </div>
                </div>

                {/* File List */}
                <AnimatePresence>
                    {files && files.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array.from(files).map((file, idx) => (
                                <motion.div
                                    key={`${file.name}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-4 p-4 bg-white border border-gray-100 group hover:border-[#1c69d4]/30 transition-all"
                                >
                                    {/* Preview */}
                                    <div className="w-12 h-12 bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                                        {isImage(file) ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FileText
                                                size={20}
                                                className="text-[#1c69d4]"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-[#1c69d4] uppercase">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(idx)}
                                        className="p-2 text-gray-200 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-50 border border-red-100"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle
                                size={14}
                                className="text-red-500"
                            />
                            <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">{error}</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
