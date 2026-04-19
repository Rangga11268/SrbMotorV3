import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Search, Plus, RefreshCw, Eye, Pencil, Trash2,
    MoreVertical, ShoppingCart, Bike, User, ChevronLeft, ChevronRight
} from "lucide-react";

const STATUS_MAP = {
    new_order:               { label: "Pesanan Masuk",          cls: "bg-amber-100 text-amber-700 border-amber-200" },
    waiting_payment:         { label: "Menunggu Pembayaran",    cls: "bg-amber-100 text-amber-700 border-amber-200" },
    pembayaran_dikonfirmasi: { label: "Pembayaran Dikonfirmasi",cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    payment_confirmed:       { label: "Pembayaran Dikonfirmasi",cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    unit_preparation:        { label: "Motor Disiapkan",        cls: "bg-blue-100 text-blue-700 border-blue-200" },
    ready_for_delivery:      { label: "Siap Dikirim/Ambil",     cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    dalam_pengiriman:        { label: "Dalam Pengiriman",       cls: "bg-purple-100 text-purple-700 border-purple-200" },
    completed:               { label: "Selesai",                cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    cancelled:               { label: "Dibatalkan",             cls: "bg-red-100 text-red-600 border-red-200" },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.cls}`}>
            {s.label}
        </span>
    );
};

export default function Index({ transactions: initialTransactions, filters, statuses }) {
    const [localTransactions, setLocalTransactions] = useState(initialTransactions);
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const fetchTransactions = async (params) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.transactions.index"), {
                params,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            setLocalTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
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
            fetchTransactions(params);
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

    const handleDelete = (transactionId) => {
        Swal.fire({
            title: "Hapus Transaksi?",
            text: "Data transaksi akan dihapus permanen dan tidak bisa dipulihkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.transactions.destroy", transactionId), {
                    onSuccess: () => fetchTransactions({ search, status }),
                    onError: () => Swal.fire("Error", "Gagal menghapus transaksi", "error"),
                });
            }
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        const urlObj = new URL(url);
        const params = Object.fromEntries(urlObj.searchParams);
        window.history.replaceState({}, "", url);
        fetchTransactions(params);
    };

    return (
        <MetronicAdminLayout title="Manajemen Transaksi Tunai">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Transaksi Tunai</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola dan pantau semua transaksi pembayaran tunai pelanggan.</p>
                </div>
                <Link
                    href={route("admin.transactions.create")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors shrink-0"
                >
                    <Plus size={16} /> Tambah Transaksi
                </Link>
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
                            placeholder="ID, nama, motor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full sm:w-52 shrink-0">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                    <select
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        {statuses?.map((s) => (
                            <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>
                        ))}
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
                {/* Loading Overlay */}
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
                                <th className="px-6 py-4">No. Transaksi</th>
                                <th className="px-6 py-4 hidden md:table-cell">Pelanggan</th>
                                <th className="px-6 py-4 hidden md:table-cell">Unit Motor</th>
                                <th className="px-6 py-4">Total Bayar</th>
                                <th className="px-6 py-4 hidden md:table-cell">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {localTransactions.data && localTransactions.data.length > 0 ? (
                                localTransactions.data.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-gray-50/50 group">
                                        {/* ID + tanggal */}
                                        <td className="px-6 py-4">
                                            <div className="font-black text-blue-600 font-mono">
                                                #{String(trx.id).padStart(6, "0")}
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium mt-0.5">
                                                {new Date(trx.created_at).toLocaleDateString("id-ID")}
                                            </div>
                                            {/* Mobile only - status + motor */}
                                            <div className="md:hidden mt-1.5 space-y-1">
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><User size={10} /> {trx.name || trx.user?.name || "N/A"}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><Bike size={10} /> {trx.motor?.name || "N/A"}</div>
                                                <StatusBadge status={trx.status} />
                                            </div>
                                        </td>

                                        {/* Pelanggan */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center border border-emerald-200 shrink-0">
                                                    {getInitials(trx.name || trx.user?.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{trx.name || trx.user?.name || "N/A"}</div>
                                                    <div className="text-xs text-gray-400">{trx.phone || trx.user?.phone || "-"}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Motor */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {trx.motor?.image_path ? (
                                                        <img src={`/storage/${trx.motor.image_path}`} alt={trx.motor.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Bike size={16} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-xs">{trx.motor?.name || "Unit Dihapus"}</div>
                                                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded">{trx.motor?.brand || "N/A"}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Total */}
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-900">{formatCurrency(trx.total_price)}</div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <StatusBadge status={trx.status} />
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-4 text-center">
                                            {/* Desktop */}
                                            <div className="hidden md:flex items-center justify-center gap-1.5">
                                                <Link
                                                    href={route("admin.transactions.show", trx.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Detail"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={route("admin.transactions.edit", trx.id)}
                                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(trx.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Mobile dropdown */}
                                            <div className="md:hidden relative">
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === trx.id ? null : trx.id)}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                {openDropdownId === trx.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                                                            <Link href={route("admin.transactions.show", trx.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                                <Eye size={14} className="text-blue-500" /> Detail
                                                            </Link>
                                                            <Link href={route("admin.transactions.edit", trx.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                                <Pencil size={14} className="text-amber-500" /> Edit
                                                            </Link>
                                                            <button onClick={() => { setOpenDropdownId(null); handleDelete(trx.id); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                                                                <Trash2 size={14} /> Hapus
                                                            </button>
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
                                        <ShoppingCart size={36} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-400 font-bold">Tidak ada transaksi tunai.</p>
                                        <p className="text-gray-400 text-xs mt-1">Coba ubah filter pencarian Anda.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {localTransactions.links && localTransactions.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
                        <p className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-black text-gray-700">{localTransactions.from}</span>–<span className="font-black text-gray-700">{localTransactions.to}</span> dari <span className="font-black text-gray-700">{localTransactions.total}</span> data
                        </p>
                        <div className="flex items-center gap-1">
                            {localTransactions.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                const isArrow = link.label.includes("&laquo;") || link.label.includes("&raquo;");
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
