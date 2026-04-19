import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import axios from "axios";
import {
    Search, RefreshCw, Eye, Bike, User,
    ChevronLeft, ChevronRight, MoreVertical
} from "lucide-react";

const STATUS_MAP = {
    pengajuan_masuk:           { label: "Pengajuan Masuk",        cls: "bg-sky-100 text-sky-700 border-sky-200" },
    menunggu_persetujuan:      { label: "Menunggu Persetujuan",   cls: "bg-amber-100 text-amber-700 border-amber-200" },
    verifikasi_dokumen:        { label: "Verifikasi Dokumen",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
    dikirim_ke_leasing:        { label: "Dikirim ke Leasing",     cls: "bg-blue-100 text-blue-700 border-blue-200" },
    survey_dijadwalkan:        { label: "Survey Dijadwalkan",     cls: "bg-purple-100 text-purple-700 border-purple-200" },
    survey_berjalan:           { label: "Survey Berjalan",        cls: "bg-purple-100 text-purple-700 border-purple-200" },
    menunggu_keputusan_leasing:{ label: "Menunggu Keputusan",     cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    disetujui:                 { label: "Disetujui",              cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    ditolak:                   { label: "Ditolak",                cls: "bg-red-100 text-red-600 border-red-200" },
    dp_dibayar:                { label: "DP Dibayar",             cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    selesai:                   { label: "Selesai",                cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.cls}`}>
            {s.label}
        </span>
    );
};

export default function Index({ credits: initialCredits, statuses: statusList, filters: currentFilters }) {
    const [localCredits, setLocalCredits] = useState(initialCredits);
    const [search, setSearch] = useState(currentFilters?.search || "");
    const [status, setStatus] = useState(currentFilters?.status || "");
    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const fetchCredits = async (params) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.credits.index"), {
                params,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            setLocalCredits(response.data);
        } catch (error) {
            console.error("Error fetching credits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstRender) { setIsFirstRender(false); return; }
        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        const delay = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);
            fetchCredits(params);
        }, 500);
        return () => clearTimeout(delay);
    }, [search, status]);

    const formatCurrency = (amount) =>
        `Rp ${new Intl.NumberFormat("id-ID").format(amount || 0)}`;

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    };

    const handleReset = () => { setSearch(""); setStatus(""); };

    const handlePageChange = (url) => {
        if (!url) return;
        const urlObj = new URL(url);
        const params = Object.fromEntries(urlObj.searchParams);
        window.history.replaceState({}, "", url);
        fetchCredits(params);
    };

    return (
        <MetronicAdminLayout title="Kelola Pengajuan Kredit">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Pengajuan Kredit</h2>
                    <p className="text-sm text-gray-500 mt-1">Monitor dan proses semua aplikasi kredit pembelian kendaraan.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5 flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pencarian</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={15} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-9 pr-3 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="No. kredit, nama pelanggan, motor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full sm:w-56 shrink-0">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                    <select
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="pengajuan_masuk">Pengajuan Masuk</option>
                        <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
                        <option value="verifikasi_dokumen">Verifikasi Dokumen</option>
                        <option value="dikirim_ke_leasing">Dikirim ke Leasing</option>
                        <option value="survey_dijadwalkan">Survey Dijadwalkan</option>
                        <option value="survey_berjalan">Survey Berjalan</option>
                        <option value="menunggu_keputusan_leasing">Menunggu Keputusan</option>
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                        <option value="dp_dibayar">DP Dibayar</option>
                        <option value="selesai">Selesai</option>
                    </select>
                </div>
                {(search || status) && (
                    <button
                        onClick={handleReset}
                        className="shrink-0 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={14} /> Reset
                    </button>
                )}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Memuat data...</p>
                        </div>
                    </div>
                )}
                <div className={`overflow-x-auto transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50/50">
                                <th className="px-6 py-4">No. Kredit</th>
                                <th className="px-6 py-4 hidden md:table-cell">Pelanggan</th>
                                <th className="px-6 py-4 hidden md:table-cell">Unit Motor</th>
                                <th className="px-6 py-4">Nilai Pengajuan</th>
                                <th className="px-6 py-4 hidden md:table-cell">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {localCredits.data && localCredits.data.length > 0 ? (
                                localCredits.data.map((credit) => (
                                    <tr key={credit.id} className="hover:bg-gray-50/50 group">
                                        {/* ID */}
                                        <td className="px-6 py-4">
                                            <div className="font-black text-indigo-600 font-mono">
                                                #{credit.transaction_id}
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium mt-0.5">
                                                Kredit ID {credit.id}
                                            </div>
                                            {/* Mobile info */}
                                            <div className="md:hidden mt-1.5 space-y-1">
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><User size={10} /> {credit.transaction?.name || credit.transaction?.user?.name || "N/A"}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><Bike size={10} /> {credit.transaction?.motor?.name || "N/A"}</div>
                                                <StatusBadge status={credit.status} />
                                            </div>
                                        </td>

                                        {/* Pelanggan */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200 shrink-0">
                                                    {getInitials(credit.transaction?.name || credit.transaction?.user?.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{credit.transaction?.name || credit.transaction?.user?.name || "N/A"}</div>
                                                    <div className="text-xs text-gray-400">{credit.transaction?.phone || credit.transaction?.user?.email || "-"}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Motor */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {credit.transaction?.motor?.image_path ? (
                                                        <img
                                                            src={`/storage/${credit.transaction.motor.image_path}`}
                                                            alt={credit.transaction.motor.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Bike size={16} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-xs leading-tight">{credit.transaction?.motor?.name || "N/A"}</div>
                                                    {credit.transaction?.motor?.brand && (
                                                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded">{credit.transaction.motor.brand}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Nilai */}
                                        <td className="px-6 py-4">
                                            <div className="font-black text-emerald-600">
                                                {formatCurrency(credit.approved_amount || credit.down_payment || 0)}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <StatusBadge status={credit.status} />
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-4">
                                            {/* Desktop */}
                                            <div className="hidden md:flex justify-center">
                                                <Link
                                                    href={route("admin.credits.show", credit.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white rounded-lg text-xs font-black transition-all shadow-sm shadow-indigo-100"
                                                >
                                                    <Eye size={13} /> Proses
                                                </Link>
                                            </div>

                                            {/* Mobile */}
                                            <div className="md:hidden relative flex justify-center">
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === credit.id ? null : credit.id)}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                {openDropdownId === credit.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                                                            <Link href={route("admin.credits.show", credit.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                                <Eye size={14} className="text-blue-500" /> Detail / Proses
                                                            </Link>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <CreditCard size={36} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-400 font-bold">Tidak ada pengajuan kredit.</p>
                                        <p className="text-gray-400 text-xs mt-1">Coba ubah filter pencarian Anda.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {localCredits.links && localCredits.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
                        <p className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-black text-gray-700">{localCredits.from}</span>–<span className="font-black text-gray-700">{localCredits.to}</span> dari <span className="font-black text-gray-700">{localCredits.total}</span> data
                        </p>
                        <div className="flex items-center gap-1">
                            {localCredits.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url}
                                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {link.label.includes("&laquo;") ? <ChevronLeft size={13} /> : link.label.includes("&raquo;") ? <ChevronRight size={13} /> : link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </MetronicAdminLayout>
    );
}
