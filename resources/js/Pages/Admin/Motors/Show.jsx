import React, { useState } from "react";
import { Link, router, Head } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import Modal from "@/Components/Modal";
import {
    ArrowLeft,
    Edit2,
    Trash2,
    Bike,
    Tag,
    Palette,
    Info,
    CheckCircle2,
    XCircle,
    Hash
} from "lucide-react";

export default function Show({ motor }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route("admin.motors.destroy", motor.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
        });
    };

    const isAvailable = motor.tersedia || motor.tersedia === 1;

    return (
        <MetronicAdminLayout title={`Detail Unit: ${motor.name}`}>
            <Head title={`Detail Motor - ${motor.name}`} />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Unit Motor"
                message={`Peringatan: Seluruh data untuk "${motor.name}", termasuk gambar dan log sistem berisiko hilang. Lanjutkan?`}
                confirmText="Hapus Permanen"
                onConfirm={handleDelete}
                type="danger"
                processing={isDeleting}
            />

            {/* Header Navbar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={route("admin.motors.index")}
                        className="p-2 border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                            Overview Resolusi
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Menampilkan spesifikasi rinci untuk unit aktif.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route("admin.motors.edit", motor.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <Edit2 size={16} /> Edit Unit
                    </Link>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Imagery & Price */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Image Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 relative overflow-hidden">
                        <div className="absolute top-5 left-5 z-10 flex gap-2">
                            {isAvailable ? (
                                <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-emerald-400">
                                    <CheckCircle2 size={12}/> TERSAMBUNG
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 bg-rose-500/90 backdrop-blur-sm text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-rose-400">
                                    <XCircle size={12} /> HABIS
                                </span>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden border border-gray-100 relative group">
                            {motor.image_path ? (
                                <img
                                    src={motor.image_path.startsWith("http") ? motor.image_path : `/storage/${motor.image_path}`}
                                    alt={motor.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 opacity-40">
                                    <Bike size={48} />
                                    <span className="text-xs font-bold uppercase tracking-widest">NO IMAGE</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Card Minimalist */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Tag size={12}/> Net Price (OTR)
                        </p>
                        <h3 className="text-3xl font-black tracking-tight drop-shadow-sm flex items-end gap-1">
                            <span className="text-xl text-blue-200 block mb-0.5 font-bold">Rp</span>
                            {new Intl.NumberFormat("id-ID").format(motor.price)}
                        </h3>
                    </div>
                </div>

                {/* Right Side: Information Matrix */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Primary Data Sheet */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <Info size={18} className="text-blue-500" /> Profil Unit
                            </h3>
                            <span className="text-[10px] font-bold text-gray-400 font-mono bg-white px-2.5 py-1 rounded-md border border-gray-200 flex items-center gap-1 shadow-sm">
                                <Hash size={10} /> {motor.id.toString().padStart(6, "0")}
                            </span>
                        </div>

                        <div className="p-6">
                            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{motor.name}</h1>
                            
                            {/* Key Value Metadata Ribbon */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex gap-2 items-center">
                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Merk</span>
                                    <span className="text-gray-900 text-xs font-black uppercase">{motor.brand}</span>
                                </div>
                                <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex gap-2 items-center">
                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Tipe</span>
                                    <span className="text-gray-900 text-xs font-black uppercase">{motor.type || 'STANDAR'}</span>
                                </div>
                                <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex gap-2 items-center">
                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Tahun Rilis</span>
                                    <span className="text-gray-900 text-xs font-black uppercase">{motor.year}</span>
                                </div>
                            </div>
                            
                            <hr className="border-gray-100 my-6" />

                            {/* Description Payload */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Spesifikasi Lengkap / Marketing Text</h4>
                                {motor.description ? (
                                    <div 
                                        className="prose prose-sm max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-700"
                                        dangerouslySetInnerHTML={{ __html: motor.description }}
                                    ></div>
                                ) : (
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm italic text-center font-medium">
                                        Data spesifikasi belum diisi oleh tim admin.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Varian Warna Box */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <Palette size={16} className="text-blue-500" /> Varian Body / Warna
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {motor.colors && motor.colors.length > 0 ? (
                                    motor.colors.map((color, idx) => (
                                        <span 
                                            key={idx} 
                                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
                                        >
                                            {color}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-sm italic font-medium">Belum ada identifikasi warna untuk unit ini.</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

        </MetronicAdminLayout>
    );
}
