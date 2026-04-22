import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
    Search,
    Plus,
    Filter,
    Bike,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    RefreshCw,
    Tag,
    Archive,
    MapPin
} from "lucide-react";

export default function Index({ motors: initialMotors, filters, brands, branches }) {
    const [localMotors, setLocalMotors] = useState(initialMotors);
    const [search, setSearch] = useState(filters.search || "");
    const [brand, setBrand] = useState(filters.brand || "");
    const [status, setStatus] = useState(filters.status || "");
    const [branch, setBranch] = useState(filters.branch || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        setLocalMotors(initialMotors);
    }, [initialMotors]);

    const fetchMotors = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.motors.index"), {
                params: currentFilters,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            if (response.data.motors) {
                setLocalMotors(response.data.motors);
            }
        } catch (error) {
            console.error("Error fetching motors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const params = {};
        if (search) params.search = search;
        if (brand) params.brand = brand;
        if (status) params.status = status;
        if (branch) params.branch = branch;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);

            fetchMotors(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, brand, status, branch]);

    const handleSearch = (e) => e.preventDefault();

    const resetFilters = () => {
        setSearch("");
        setBrand("");
        setStatus("");
        setBranch("");
    };

    const confirmDelete = (motor) => {
        setDropdownOpen(null);
        Swal.fire({
            title: `Hapus ${motor.name}?`,
            text: "Motor akan dihapus dari katalog permanen. Tindakan ini tidak bisa dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            borderRadius: '12px'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.motors.destroy", motor.id), {
                    onSuccess: () => toast.success("Motor berhasil dihapus"),
                    onError: () => toast.error("Gagal menghapus motor"),
                });
            }
        });
    };

    return (
        <MetronicAdminLayout title="Katalog Unit Motor">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Motor</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola inventaris dan katalog motor secara keseluruhan.
                    </p>
                </div>
                <Link
                    href={route("admin.motors.create")}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white hover:text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20 w-fit"
                >
                    <Plus size={18} /> Tambah Unit
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5 relative z-10">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:flex-1 relative">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">Pencarian</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Cari nama motor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48 relative">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1 flex items-center gap-1"><Tag size={12}/> Merk</label>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        >
                            <option value="">Semua Merk</option>
                            {brands && brands.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-48 relative">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1 flex items-center gap-1"><Archive size={12}/> Status</label>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="1">Tersedia</option>
                            <option value="0">Kosong / Habis</option>
                        </select>
                    </div>
                    <div className="w-full md:w-64 relative">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1 flex items-center gap-1">
                            <MapPin size={12}/> Cabang
                        </label>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        >
                            <option value="">Semua Cabang</option>
                            {branches && branches.map((b) => (
                                <option key={b.code} value={b.code}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    {(search || brand || status || branch) && (
                        <div className="w-full md:w-auto">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="w-full relative px-4 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCw size={16} /> Reset
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Inventory Table List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-md"></div>
                        <span className="mt-3 text-sm font-bold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">Memuat Data...</span>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Informasi Unit</th>
                                <th className="px-6 py-4 hidden md:table-cell">Merk & Spesifikasi</th>
                                <th className="px-6 py-4">Harga OTR</th>
                                <th className="px-6 py-4">Lokasi Unit</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {localMotors.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
                                                <Bike size={32} className="text-gray-300" />
                                            </div>
                                            <span>Tidak ada motor yang ditemukan di katalog.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                localMotors.data.map((motor) => (
                                    <tr key={motor.id} className="hover:bg-gray-50/80 transition-colors group">
                                        {/* Unit Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                                                    {motor.image_path ? (
                                                        <img 
                                                            src={motor.image_path.startsWith("http") ? motor.image_path : `/storage/${motor.image_path}`} 
                                                            alt={motor.name} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Bike className="text-gray-400" size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-base">{motor.name}</div>
                                                    <div className="mt-1 flex items-center gap-2 md:hidden">
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold tracking-wide uppercase border border-gray-200">
                                                            {motor.brand}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{motor.type} • {motor.year}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Specs (Desktop) */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="px-2.5 py-0.5 bg-gray-800 text-white rounded-md text-[11px] font-bold tracking-widest uppercase shadow-sm">
                                                    {motor.brand}
                                                </span>
                                                <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                                                    <span className="text-blue-600">{motor.type}</span> 
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
                                                    {motor.year}
                                                </div>
                                            </div>
                                        </td>                                        {/* Price */}
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-800">
                                                <span className="text-gray-400 font-bold mr-1">Rp</span>
                                                {new Intl.NumberFormat("id-ID").format(motor.price)}
                                            </div>
                                        </td>
 
                                        {/* Branch Location */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs uppercase tracking-tight">
                                                    <MapPin size={12} className="text-blue-500" />
                                                    {motor.branch_info?.name || motor.branch || '-'}
                                                </div>
                                                {motor.branch_info?.code && (
                                                    <span className="text-[10px] text-gray-400 font-medium ml-4">{motor.branch_info.code}</span>
                                                )}
                                            </div>
                                        </td>
 
                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            {(motor.tersedia || motor.tersedia === 1) ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 tracking-widest uppercase">
                                                    Tersedia
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 tracking-widest uppercase">
                                                    Kosong
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            {/* Desktop Nav */}
                                            <div className="hidden md:flex justify-end gap-2">
                                                <Link href={route("admin.motors.show", motor.id)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-600 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm" title="Preview Catalog">
                                                    <Eye size={15} />
                                                </Link>
                                                <Link href={route("admin.motors.edit", motor.id)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 text-gray-600 hover:text-amber-600 flex items-center justify-center transition-colors shadow-sm" title="Edit Data">
                                                    <Edit2 size={15} />
                                                </Link>
                                                <button onClick={() => confirmDelete(motor)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm" title="Hapus Unit">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>

                                            {/* Mobile Nav */}
                                            <div className="relative md:hidden inline-block text-left z-10">
                                                <button onClick={() => setDropdownOpen(dropdownOpen === motor.id ? null : motor.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none border border-gray-200 bg-white">
                                                    <MoreVertical size={16} />
                                                </button>
                                                <AnimatePresence>
                                                    {dropdownOpen === motor.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(null)}></div>
                                                            <motion.div 
                                                                initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-40 py-1"
                                                            >
                                                                <Link href={route("admin.motors.show", motor.id)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2">
                                                                    <Eye size={16} className="text-gray-400" /> Detail Unit
                                                                </Link>
                                                                <Link href={route("admin.motors.edit", motor.id)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 flex items-center gap-2">
                                                                    <Edit2 size={16} className="text-gray-400" /> Edit Metadata
                                                                </Link>
                                                                <div className="border-t border-gray-100 my-1"></div>
                                                                <button onClick={() => confirmDelete(motor)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                                                                    <Trash2 size={16} /> Hapus Motor
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {localMotors.links && localMotors.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center bg-gray-50/50">
                        <nav className="flex items-center gap-1">
                            {localMotors.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                const isPrevious = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                let labelRender = link.label;
                                if (isPrevious) labelRender = "«";
                                if (isNext) labelRender = "»";

                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                                            link.active
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: labelRender }} />
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: labelRender }} />
                                    </span>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </MetronicAdminLayout>
    );
}
