import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import { 
    Plus, 
    MapPin, 
    Phone, 
    Wrench, 
    Store, 
    Pencil, 
    Trash2, 
    Navigation,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Info
} from "lucide-react";

export default function BranchIndex({ branches }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus cabang ${name}?`)) {
            destroy(route("admin.branches.destroy", id));
        }
    };

    return (
        <MetronicAdminLayout title="Manajemen Cabang">
            <Head title="Manajemen Cabang - Admin Panel" />

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Jaringan Dealer & Workshop</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data lokasi, koordinat GPS, dan operasional seluruh cabang SRB Motor.</p>
                </div>
                <Link
                    href={route("admin.branches.create")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200"
                >
                    <Plus size={18} /> Tambah Cabang Baru
                </Link>
            </div>

            {branches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-all duration-300 flex flex-col">
                            {/* Card Header Status */}
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {branch.is_main_branch && (
                                        <span className="px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded">PUSAT</span>
                                    )}
                                    {branch.can_service ? (
                                        <span className="px-2 py-1 bg-cyan-50 text-cyan-700 border border-cyan-100 text-[9px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                                            <Wrench size={10} /> Workshop
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 border border-gray-200 text-[9px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                                            <Store size={10} /> Sales
                                        </span>
                                    )}
                                </div>
                                <div>
                                    {branch.is_active ? (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle2 size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wide">Aktif</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-red-400">
                                            <XCircle size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wide">Non-Aktif</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-grow">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">{branch.name}</h4>
                                
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{branch.address}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-gray-400 shrink-0" />
                                        <p className="text-xs text-gray-700 font-semibold">{branch.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Navigation size={16} className="text-gray-400 shrink-0" />
                                        <p className="text-[10px] font-mono text-gray-400">{branch.latitude}, {branch.longitude}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-3 mt-auto">
                                <Link 
                                    href={route("admin.branches.edit", branch.id)}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                                >
                                    <Pencil size={14} /> Edit Data
                                </Link>
                                <button
                                    onClick={() => handleDelete(branch.id, branch.name)}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-200 transition-all"
                                >
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Store size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Belum Ada Cabang</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Daftar cabang dealer SRB Motor belum dikonfigurasi. Mulai dengan menambahkan cabang utama.</p>
                    <Link
                        href={route("admin.branches.create")}
                        className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Tambah Cabang Pertama
                    </Link>
                </div>
            )}

            <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-blue-600">
                    <Info size={20} />
                </div>
                <div>
                    <h5 className="font-bold text-blue-900 text-sm">Informasi Koordinat GPS</h5>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        Data koordinat <i>Latitude</i> dan <i>Longitude</i> sangat krusial untuk fitur <b>Cabang Terdekat</b>. Pastikan data yang dimasukkan akurat agar pelanggan mendapatkan rekomendasi dealer yang tepat berdasarkan lokasi GPS mereka secara real-time.
                    </p>
                </div>
            </div>
        </MetronicAdminLayout>
    );
}
