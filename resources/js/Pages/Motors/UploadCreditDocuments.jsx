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

    // Check if documents already exist
    const existingDocs = transaction.credit_detail?.documents || [];
    const hasUploadedDocuments = existingDocs.length > 0;

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

    return (
        <PublicLayout auth={auth} title="Upload Dokumen Verifikasi">
            <div className="flex-grow pt-[104px] pb-20">
                <div className="bg-white min-h-screen">
                    {/* Header Section */}
                    <div className="bg-black py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-900 border border-gray-800 rounded-none">
                                    <ShieldCheck
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                                    UPLOAD DOKUMEN <span className="text-[#1c69d4]">VERIFIKASI</span>
                                </h1>
                            </div>
                            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                Lengkapi dokumen yang diperlukan untuk verifikasi kredit Anda. Semua dokumen disimpan dengan aman.
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Motor Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white border border-gray-200 rounded-none overflow-hidden sticky top-24">
                                    <div className="aspect-video bg-gray-50 border-b border-gray-200 flex items-center justify-center p-4">
                                        <img
                                            src={`/storage/${transaction.motor.image_path}`}
                                            alt={transaction.motor.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[#1c69d4] text-[10px] font-bold uppercase tracking-widest mb-1">
                                            {transaction.motor.brand}
                                        </p>
                                        <h3 className="font-black text-xl text-black uppercase tracking-tighter mb-4">
                                            {transaction.motor.name}
                                        </h3>
                                        <div className="space-y-3 mb-5 pb-5 border-b border-gray-200">
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    UANG MUKA
                                                </span>
                                                <span className="font-black text-black">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .down_payment,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    CICILAN/BLN
                                                </span>
                                                <span className="font-black text-black">
                                                    {formatCurrency(
                                                        transaction
                                                            .credit_detail
                                                            .monthly_installment,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    TENOR
                                                </span>
                                                <span className="font-black text-black">
                                                    {
                                                        transaction
                                                            .credit_detail.tenor
                                                    }{" "}
                                                    BULAN
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-none p-4 border border-gray-200">
                                            <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-2">
                                                DOKUMEN YANG DIPERLUKAN:
                                            </p>
                                            <ul className="text-[10px] font-bold text-gray-600 uppercase tracking-widest space-y-1">
                                                <li>• KARTU IDENTITAS (KTP)</li>
                                                <li>• KARTU KELUARGA</li>
                                                <li>• SLIP GAJI 3 BULAN</li>
                                            </ul>
                                        </div>

                                        {/* Show existing documents if any */}
                                        {hasUploadedDocuments && (
                                            <div className="bg-green-50 rounded-none p-4 border border-green-200 mt-4">
                                                <p className="text-[10px] font-bold text-green-900 mb-3 flex items-center gap-2 uppercase tracking-widest">
                                                    <CheckCircle size={16} />{" "}
                                                    DOKUMEN YANG SUDAH DIKIRIM
                                                </p>
                                                <ul className="text-[10px] font-bold uppercase tracking-widest text-green-800 space-y-2">
                                                    {existingDocs.map((doc) => (
                                                        <li
                                                            key={doc.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <CheckCircle
                                                                size={14}
                                                                className="text-green-600"
                                                            />
                                                            {doc.document_type}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-[10px] font-bold text-green-700 mt-3 uppercase tracking-widest mt-4 pt-3 border-t border-green-100">
                                                    ANDA DAPAT MENGGANTI DOKUMEN DENGAN VERSI YANG LEBIH BAIK DI HALAMAN KELOLA DOKUMEN.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Upload Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Document Fields */}
                                    {documentTypes.map((docType) => (
                                        <FileUploadField
                                            key={docType.key}
                                            label={docType.label}
                                            description={docType.description}
                                            id={`document_${docType.key.toLowerCase()}`}
                                            accept="image/*,application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(e, docType.key)
                                            }
                                            onRemove={(idx) =>
                                                handleRemoveFile(
                                                    docType.key,
                                                    idx,
                                                )
                                            }
                                            error={
                                                errors[
                                                    `documents.${docType.key}`
                                                ]
                                            }
                                            files={data.documents[docType.key]}
                                            required={docType.required}
                                        />
                                    ))}

                                    {/* Upload Progress */}
                                    {progress && (
                                        <div className="bg-gray-50 rounded-none p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                                                    MENGUPLOAD...
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                                                    {progress.percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-none h-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-black"
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${progress.percentage}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200">
                                        <Link
                                            href={route(
                                                "motors.order.confirmation",
                                                transaction.id,
                                            )}
                                            className="flex items-center justify-center gap-2 px-6 py-4 text-black font-black border border-gray-300 rounded-none hover:bg-gray-50 transition-colors text-[11px] uppercase tracking-widest"
                                        >
                                            <ArrowLeft size={16} /> KEMBALI
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-black rounded-none border border-black hover:bg-gray-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[11px] uppercase tracking-widest"
                                        >
                                            <Upload size={16} /> UPLOAD DOKUMEN
                                        </button>
                                    </div>
                                </form>
                            </div>
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
}) {
    const isImage = (file) => file.type.startsWith("image/");

    return (
        <div className="bg-white border border-gray-200 rounded-none p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <label
                        htmlFor={id}
                        className="block text-[11px] font-bold text-black mb-1 uppercase tracking-widest"
                    >
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{description}</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Upload Zone */}
                <div className="relative group">
                    <input
                        type="file"
                        id={id}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        accept={accept}
                        multiple
                        onChange={onChange}
                        required={files.length === 0 && required}
                    />
                    <div
                        className={`w-full p-8 border border-dashed transition-all flex flex-col items-center justify-center text-center ${
                            error
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100"
                        }`}
                    >
                        <Upload
                            size={32}
                            className={error ? "text-red-400" : "text-black"}
                        />
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-black">
                            KLIK UNTUK UNGGAH ATAU DRAG & DROP
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                            JPG, PNG, ATAU PDF. MAKSIMAL 2MB PER FILE.
                        </p>
                    </div>
                </div>

                {/* File List */}
                <AnimatePresence>
                    {files && files.length > 0 && (
                        <div className="space-y-2">
                            {Array.from(files).map((file, idx) => (
                                <motion.div
                                    key={`${file.name}-${idx}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-none group hover:border-black transition-colors"
                                >
                                    {/* Preview */}
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden rounded-none">
                                        {isImage(file) ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FileText
                                                size={16}
                                                className="text-gray-400"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-black uppercase tracking-widest truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        <CheckCircle
                                            size={18}
                                            className="text-green-500"
                                        />
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(idx)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                        <AlertCircle
                            size={16}
                            className="text-red-600 shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-red-700">{error}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
