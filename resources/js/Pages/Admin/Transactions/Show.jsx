import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import Swal from "sweetalert2";
import {
    ArrowLeft, Pencil, Save, X, Bike, User, Phone, Mail,
    MapPin, FileText, CreditCard, Calendar, FileCheck,
    Clock, AlertTriangle, ReceiptText, MessageCircle, Package
} from "lucide-react";

const STATUS_MAP = {
    new_order:               { label: "Pesanan Masuk",           cls: "bg-amber-100 text-amber-700 border-amber-200" },
    waiting_payment:         { label: "Menunggu Pembayaran",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
    pembayaran_dikonfirmasi: { label: "Pembayaran Dikonfirmasi", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    payment_confirmed:       { label: "Pembayaran Dikonfirmasi", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    unit_preparation:        { label: "Motor Disiapkan",         cls: "bg-blue-100 text-blue-700 border-blue-200" },
    ready_for_delivery:      { label: "Siap Dikirim/Ambil",      cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    dalam_pengiriman:        { label: "Dalam Pengiriman",        cls: "bg-purple-100 text-purple-700 border-purple-200" },
    completed:               { label: "Selesai",                 cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    cancelled:               { label: "Dibatalkan",              cls: "bg-red-100 text-red-600 border-red-200" },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.cls}`}>{s.label}</span>;
};

const InfoRow = ({ label, value }) => (
    <div className="py-3 border-b border-gray-100 last:border-0 flex flex-col sm:flex-row sm:items-start gap-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:w-40 shrink-0">{label}</span>
        <span className="text-sm font-bold text-gray-800">{value || <span className="text-gray-300 font-medium italic">—</span>}</span>
    </div>
);

export default function Show({ transaction, motors, users, availableUnits }) {
    const [isEditMode, setIsEditMode] = useState(false);

    const allocationForm = useForm({ motor_unit_id: transaction.motor_unit_id || "" });
    const { data, setData, put, processing, errors } = useForm({
        user_id:         transaction.user_id || "",
        motor_id:        transaction.motor_id || "",
        name:            transaction.name || "",
        nik:             transaction.nik || "",
        phone:           transaction.phone || "",
        email:           transaction.email || "",
        motor_color:     transaction.motor_color || "",
        delivery_method: transaction.delivery_method || "Ambil di Dealer",
        address:         transaction.address || "",
        notes:           transaction.notes || "",
        status:          transaction.status || "new_order",
        booking_fee:     transaction.booking_fee || 0,
        delivery_date:   transaction.delivery_date || "",
    });

    const formatCurrency = (n) => `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    const statusLabelMap = Object.fromEntries(Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label]));

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.update", transaction.id), {
            onSuccess: () => { setIsEditMode(false); Swal.fire({ title: "Berhasil!", text: "Transaksi telah diperbarui.", icon: "success", timer: 2000, showConfirmButton: false }); },
            onError: () => Swal.fire({ title: "Gagal!", text: "Terjadi kesalahan.", icon: "error" }),
        });
    };

    const confirmDelete = () => {
        Swal.fire({ title: "Hapus Transaksi?", text: "Data pembayaran dan detail transaksi akan dihapus.", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus", cancelButtonText: "Batal", confirmButtonColor: "#ef4444" })
            .then((result) => { if (result.isConfirmed) router.delete(route("admin.transactions.destroy", transaction.id), { onSuccess: () => router.visit(route("admin.transactions.index")) }); });
    };

    const handleCancel = () => {
        Swal.fire({ title: "Batalkan Transaksi?", text: "Status akan diubah menjadi Dibatalkan.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Tidak" })
            .then((result) => { if (result.isConfirmed) router.post(route("admin.transactions.updateStatus", transaction.id), { status: "cancelled" }); });
    };

    const motor = motors.find((m) => m.id == transaction.motor_id);
    const user = users.find((u) => u.id == transaction.user_id);
    const waUrl = `https://wa.me/${(transaction.phone || user?.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Halo ${transaction.name || user?.name}, saya admin SRB Motor. Terkait pesanan motor ${motor?.name || ""} Anda...`)}`;

    return (
        <MetronicAdminLayout title={`Transaksi #${String(transaction.id).padStart(6, "0")}`}>
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href={route("admin.transactions.index")} className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 rounded-lg transition-colors shadow-sm shrink-0">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">Transaksi Tunai <span className="text-blue-600 font-mono">#{String(transaction.id).padStart(6, "0")}</span></h2>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(transaction.created_at).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {!isEditMode ? (
                        <>
                            <StatusBadge status={transaction.status} />
                            <button onClick={() => setIsEditMode(true)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors shadow-sm">
                                <Pencil size={13} /> Edit
                            </button>
                            <a href={route("admin.transactions.invoice.preview", transaction.id)} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                                <ReceiptText size={13} /> Invoice
                            </a>
                            {transaction.status !== "cancelled" && (
                                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors">
                                    <AlertTriangle size={13} /> Batalkan
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button onClick={handleSubmit} disabled={processing} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold disabled:opacity-60">
                                {processing ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={13} />} Simpan
                            </button>
                            <button onClick={() => setIsEditMode(false)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold">
                                <X size={13} /> Batal
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* ===== LEFT (8 cols) ===== */}
                <div className="xl:col-span-8 space-y-6">
                    {/* Card: Data Pemesanan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <Bike size={16} className="text-blue-500" />
                            <h3 className="font-bold text-gray-800 text-sm">Data Pemesanan</h3>
                        </div>
                        <div className="p-6">
                            {isEditMode ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Pelanggan", key: "user_id", type: "select", options: users.map(u => ({ value: u.id, label: `${u.name} (${u.email})` })) },
                                        { label: "Motor", key: "motor_id", type: "select", options: motors.map(m => ({ value: m.id, label: m.name })) },
                                        { label: "Status", key: "status", type: "select", options: Object.entries(statusLabelMap).map(([k, v]) => ({ value: k, label: v })) },
                                        { label: "Booking Fee", key: "booking_fee", type: "number" },
                                        { label: "Estimasi Pengiriman", key: "delivery_date", type: "date" },
                                    ].map(({ label, key, type, options }) => (
                                        <div key={key}>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
                                            {type === "select" ? (
                                                <select value={data[key]} onChange={(e) => setData(key, e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </select>
                                            ) : (
                                                <input type={type} value={data[key]} onChange={(e) => setData(key, e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                                            )}
                                            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                                        </div>
                                    ))}
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Alamat</label>
                                        <textarea value={data.address} onChange={(e) => setData("address", e.target.value)} rows={3} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 resize-none" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Catatan</label>
                                        <textarea value={data.notes} onChange={(e) => setData("notes", e.target.value)} rows={2} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 resize-none" />
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    <InfoRow label="Nama Lengkap (KTP)" value={transaction.name || user?.name} />
                                    <InfoRow label="NIK" value={transaction.nik} />
                                    <div className="py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start gap-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:w-40 shrink-0">WhatsApp</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800">{transaction.phone || user?.phone || "—"}</span>
                                            {(transaction.phone || user?.phone) && (
                                                <a href={waUrl} target="_blank" className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-[10px] font-black transition-colors">
                                                    <MessageCircle size={10} /> WA
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <InfoRow label="Email" value={transaction.email || user?.email} />
                                    <div className="py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start gap-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:w-40 shrink-0">Motor</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800">{motor?.name || "N/A"}</span>
                                            {transaction.motor_color && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border">({transaction.motor_color})</span>}
                                        </div>
                                    </div>
                                    <div className="py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start gap-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:w-40 shrink-0">Metode Pengambilan</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${transaction.delivery_method === "Ambil di Dealer" ? "bg-sky-100 text-sky-700 border-sky-200" : "bg-indigo-100 text-indigo-700 border-indigo-200"}`}>{transaction.delivery_method || "Ambil di Dealer"}</span>
                                    </div>
                                    <InfoRow label="Alamat" value={transaction.address} />
                                    {transaction.delivery_date && (
                                        <div className="py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:w-40 shrink-0">Estimasi Pengiriman</span>
                                            <span className="flex items-center gap-2 text-sm font-bold text-blue-600">
                                                <Calendar size={14} />
                                                {new Date(transaction.delivery_date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.notes && <InfoRow label="Catatan Pembeli" value={`"${transaction.notes}"`} />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card: Riwayat Log */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            <h3 className="font-bold text-gray-800 text-sm">Riwayat Status & Log</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                                        <th className="px-6 py-3">Waktu</th>
                                        <th className="px-6 py-3">Perubahan Status</th>
                                        <th className="px-6 py-3">Oleh</th>
                                        <th className="px-6 py-3">Catatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transaction.logs && transaction.logs.length > 0 ? (
                                        transaction.logs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString("id-ID")}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {log.status_from && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">{statusLabelMap[log.status_from] || log.status_from}</span>}
                                                        {log.status_from && <span className="text-gray-400 text-xs">→</span>}
                                                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{statusLabelMap[log.status_to || log.status] || log.status_to || log.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="text-xs font-bold text-gray-800">{log.actor?.name || "System"}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase">{log.actor?.role === "admin" || log.actor?.role === "owner" ? "ADMIN" : log.actor?.role === "user" ? "PELANGGAN" : "SYSTEM"}</div>
                                                </td>
                                                <td className="px-6 py-3 text-xs text-gray-500">{log.notes || log.description || "—"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">Belum ada log rincian.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT SIDEBAR (4 cols) ===== */}
                <div className="xl:col-span-4 space-y-4">
                    {/* Ringkasan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm">Ringkasan Pembayaran</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold">No. Transaksi</span>
                                <span className="text-sm font-black text-blue-600 font-mono">#{String(transaction.id).padStart(6, "0")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold">Harga Motor</span>
                                <span className="text-sm font-bold text-gray-800">{formatCurrency(motor?.price)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold">Booking Fee</span>
                                <span className="text-sm font-bold text-gray-800">{formatCurrency(transaction.booking_fee)}</span>
                            </div>
                            <div className="pt-3 border-t border-dashed border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Bayar</span>
                                    <span className="text-lg font-black text-gray-900">{formatCurrency(transaction.total_price)}</span>
                                </div>
                            </div>
                            <div className="pt-1">
                                <StatusBadge status={transaction.status} />
                            </div>
                        </div>
                    </div>

                    {/* Foto Motor */}
                    {motor?.image_path && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm">Unit Motor</h3>
                            </div>
                            <div className="p-4">
                                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={`/storage/${motor.image_path}`} alt={motor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="mt-3">
                                    <p className="font-black text-gray-800 text-sm">{motor.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{motor.brand} · {motor.type} · {motor.year}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-red-100 bg-red-50/50">
                            <h3 className="font-bold text-red-700 text-sm flex items-center gap-2"><AlertTriangle size={14} /> Zona Bahaya</h3>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-500 text-xs leading-relaxed mb-3">Menghapus transaksi ini bersifat permanen dan tidak dapat dipulihkan.</p>
                            <button onClick={confirmDelete} className="w-full py-2.5 border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-black transition-colors">
                                Hapus Transaksi Ini
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MetronicAdminLayout>
    );
}
