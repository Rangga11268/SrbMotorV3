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

    // Check if all required documents are complete
    const isComplete =
        data.documents.KTP.length > 0 &&
        data.documents.KK.length > 0 &&
        data.documents.SLIP_GAJI.length > 0;

    const existingDocs = transaction.credit_detail?.documents || [];

    return (
        <PublicLayout auth={auth} title="Kelola Dokumen">
            <div className="flex-grow pt-[104px] pb-20">
                <div className="bg-white min-h-screen">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileCheck
                                        size={24}
                                        className="text-blue-600"
                                    />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Kelola Dokumen
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Lihat dokumen yang sudah diupload atau tambahkan
                                dokumen baru
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Motor Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24 shadow-sm">
                                    <div className="aspect-video bg-gray-100 overflow-hidden flex items-center justify-center p-4">
                                        <img
                                            src={`/storage/${transaction.motor.image_path}`}
                                            alt={transaction.motor.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 mb-4">
                                            {transaction.motor.name}
                                        </h3>

                                        {/* Existing Documents List */}
                                        <div className="mb-5 pb-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600 mb-3">
                                                DOKUMEN YANG ADA
                                            </p>
                                            {existingDocs.length > 0 ? (
                                                <div className="space-y-2">
                                                    {existingDocs.map((doc) => (
                                                        <div
                                                            key={doc.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <CheckCircle
                                                                size={16}
                                                                className="text-green-600 shrink-0"
                                                            />
                                                            <a
                                                                href={`/storage/${doc.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:underline truncate"
                                                            >
                                                                {
                                                                    doc.document_type
                                                                }
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-500">
                                                    Belum ada dokumen
                                                </p>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        {isComplete ? (
                                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg w-full justify-center">
                                                <CheckCircle
                                                    size={16}
                                                    className="text-green-600"
                                                />
                                                <span className="text-xs font-semibold text-green-700">
                                                    Lengkap
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg w-full justify-center">
                                                <AlertCircle
                                                    size={16}
                                                    className="text-yellow-700"
                                                />
                                                <span className="text-xs font-semibold text-yellow-700">
                                                    Belum Lengkap
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Upload Form */}
                            <div className="lg:col-span-2">
                                {/* Info Banner */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        <strong>💡 Tip:</strong> Anda dapat
                                        mengganti dokumen dengan versi yang
                                        lebih baik kapan saja.
                                    </p>
                                </div>

                                {/* Existing Documents Preview */}
                                {existingDocs.length > 0 && (
                                    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                                                <CheckCircle
                                                    size={24}
                                                    className="text-green-600"
                                                />
                                                Dokumen yang Diterima
                                            </h3>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                                                ✓ {existingDocs.length} Dokumen
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {existingDocs.map((doc) => {
                                                const isPdf = doc.file_path
                                                    .toLowerCase()
                                                    .endsWith(".pdf");
                                                const isImage =
                                                    /\.(jpg|jpeg|png|webp|gif)$/i.test(
                                                        doc.file_path,
                                                    );
                                                return (
                                                    <motion.a
                                                        key={doc.id}
                                                        href={`/storage/${doc.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        className="relative group rounded-lg overflow-hidden border border-green-300 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                                                    >
                                                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                                            {isImage ? (
                                                                <img
                                                                    src={`/storage/${doc.file_path}`}
                                                                    alt={
                                                                        doc.document_type
                                                                    }
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                />
                                                            ) : isPdf ? (
                                                                <div className="flex flex-col items-center justify-center text-red-600 w-full h-full">
                                                                    <FileText
                                                                        size={
                                                                            48
                                                                        }
                                                                    />
                                                                    <span className="text-xs font-bold mt-2">
                                                                        PDF
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <FileText
                                                                    size={48}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                                                <Eye
                                                                    size={32}
                                                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-white">
                                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                                {
                                                                    doc.document_type
                                                                }
                                                            </p>
                                                            <p className="text-xs text-green-600 font-bold mt-1">
                                                                ✓ Terima
                                                            </p>
                                                        </div>
                                                    </motion.a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

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
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Mengupload...
                                                </span>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {progress.percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-blue-600"
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
                                            className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <ArrowLeft size={18} /> Kembali
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Upload size={18} /> Perbarui
                                            Dokumen
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
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <label
                        htmlFor={id}
                        className="block text-sm font-semibold text-gray-900 mb-1"
                    >
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                    <p className="text-sm text-gray-600">{description}</p>
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
                        className={`w-full p-6 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                            error
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                    >
                        <Upload
                            size={32}
                            className={error ? "text-red-400" : "text-gray-400"}
                        />
                        <p className="mt-2 text-sm font-medium text-gray-900">
                            Klik untuk unggah atau drag & drop
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            JPG, PNG, atau PDF. Maksimal 2MB per file.
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
                                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                >
                                    {/* Preview */}
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
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
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
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
