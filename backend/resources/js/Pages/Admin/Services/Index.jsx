import React, { useState } from "react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import { useForm, router, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import {
    Wrench,
    CalendarClock,
    User,
    Settings2,
    X,
    CheckCircle2,
    AlertCircle,
    Bike,
    MoreVertical,
    Plus,
    Trash2,
    Printer,
    FileSpreadsheet,
    Info
} from "lucide-react";


export default function ServicesIndex({ appointments }) {
    const [selectedService, setSelectedService] = useState(null);
    const [visible, setVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    
    const { data, setData, put, processing, reset } = useForm({
        status: "",
        total_cost: "",
        payment_status: "unpaid",
        payment_method: "",
        admin_notes: "",
        service_notes: "",
        service_items: []
    });

    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('status');


    // Format number to Rupiah display string (e.g. 150000 -> "150.000")
    const formatRupiah = (value) => {
        if (!value && value !== 0) return "";
        const num = parseFloat(String(value).replace(/\./g, "").replace(/,/g, "")) || 0;
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // Parse formatted display string back to raw number string
    const parseRupiah = (display) => {
        return display.replace(/\./g, "").replace(/[^0-9]/g, "");
    };

    const openModal = (app) => {
        setDropdownOpen(null);
        setSelectedService(app);
        setActiveTab('status');
        
        // Check if service_notes is JSON (meaning it contains items)
        let displayNotes = app.service_notes || "";
        try {
            const parsed = JSON.parse(displayNotes);
            if (Array.isArray(parsed)) {
                displayNotes = ""; // Clear notes if it's just the items JSON
            }
        } catch (e) {
            // Not JSON, keep as is
        }

        setData({
            status: app.status,
            total_cost: app.total_cost ? String(Math.round(Number(app.total_cost))) : "",
            payment_status: app.payment_status || "unpaid",
            payment_method: app.payment_method || "",
            admin_notes: app.admin_notes || "",
            service_notes: displayNotes,
            service_items: app.items || []
        });
        setItems(app.items || []);
        setVisible(true);
    };

    const addItem = () => {
        const newItems = [...items, { description: "", qty: 1, price: 0 }];
        setItems(newItems);
        setData('service_items', newItems);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setData('service_items', newItems);
        updateTotalCost(newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        setData('service_items', newItems);
        if (field !== 'description') {
            updateTotalCost(newItems);
        }
    };

    const updateTotalCost = (itemList) => {
        const total = itemList.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.qty || 1)), 0);
        setData('total_cost', String(total));
    };


    const handleUpdate = (e) => {
        e.preventDefault();
        put(route('admin.services.update-status', selectedService.id), {
            onSuccess: () => {
                setVisible(false);
                reset();
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Status reservasi servis telah diperbarui.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    borderRadius: '0px'
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat memperbarui status.',
                    icon: 'error',
                    confirmButtonColor: '#1c69d4',
                    borderRadius: '0px'
                });
            }
        });
    };

    const getBadgeStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in_progress': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <MetronicAdminLayout title="Manajemen Reservasi Servis">
            <Head title="Manajemen Servis" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Antrean Servis Cabang (SSM)</h2>
                <p className="text-sm text-gray-500 mt-1">Kelola kuota harian dan pantau tahap pengerjaan pelanggan secara real-time.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <CalendarClock size={18} className="text-blue-500" /> Jadwal Reservasi
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">No. Antrian</th>
                                <th className="px-6 py-4">Tanggal & Waktu</th>
                                <th className="px-6 py-4 hidden md:table-cell">Pelanggan & Unit</th>
                                <th className="px-6 py-4 hidden lg:table-cell text-center">Tipe Layanan</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CalendarClock size={32} className="text-gray-300" />
                                            <span>Tidak ada antrean servis saat ini.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : appointments.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="bg-blue-600 text-white text-center rounded-lg py-2 px-3 shadow-sm border border-blue-700 relative overflow-hidden">
                                            {/* decorative line */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 opacity-50"></div>
                                            <div className="text-[9px] font-bold uppercase tracking-widest text-blue-100 mb-0.5">Antrian</div>
                                            <div className="text-xl font-black">{app.queue_number || '---'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{new Date(app.service_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                        <div className="text-xs text-gray-500 font-medium">{app.service_time} WIB</div>
                                        <div className="inline-flex items-center mt-2 px-2 py-0.5 bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wider rounded">
                                            {app.branch}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0 border border-gray-200">
                                                <Bike size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 flex items-center gap-1.5 hover:text-blue-600 cursor-pointer transition-colors">
                                                    <User size={14} className="text-gray-400" /> {app.customer_name}
                                                </div>
                                                <div className="text-xs text-gray-500">{app.customer_phone}</div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-gray-800 text-white rounded text-[10px] font-bold tracking-widest border border-black shadow-sm">
                                                        {app.plate_number || 'NO PLAT'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                                                        {app.motor_model}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-center">
                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-widest rounded-md">
                                            {app.service_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getBadgeStyle(app.status)}`}>
                                            {app.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        
                                        {/* Desktop Action */}
                                        <div className="hidden md:flex justify-center">
                                            <button onClick={() => openModal(app)} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
                                                <Settings2 size={14} className="text-gray-400" /> KELOLA
                                            </button>
                                        </div>

                                        {/* Mobile Dropdown */}
                                        <div className="relative md:hidden inline-block text-left">
                                            <button onClick={() => setDropdownOpen(dropdownOpen === app.id ? null : app.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none">
                                                <MoreVertical size={16} />
                                            </button>
                                            <AnimatePresence>
                                                {dropdownOpen === app.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(null)}></div>
                                                        <motion.div 
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-40 py-1"
                                                        >
                                                            <button onClick={() => openModal(app)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                <Settings2 size={16} className="text-blue-500" /> Proses Servis
                                                            </button>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Modal for Processing Service */}
            <AnimatePresence>
                {visible && selectedService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setVisible(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />

                        {/* Modal Dialog */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-lg max-h-full"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
                                <h3 className="font-black tracking-tight text-gray-800 uppercase flex items-center gap-2">
                                    <Wrench size={18} className="text-blue-600" />
                                    PROSES ANTRIAN <span className="text-blue-600">#{selectedService.queue_number || '---'}</span>
                                </h3>
                                <button onClick={() => setVisible(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                {/* Data Summary Box */}
                                <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm space-y-3">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="font-bold text-blue-800">Identitas</div>
                                        <div className="col-span-2">
                                            <div className="font-bold text-gray-800">{selectedService.customer_name}</div>
                                            <div className="text-gray-500 text-xs mt-0.5">{selectedService.customer_phone}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="font-bold text-blue-800">Layanan</div>
                                        <div className="col-span-2">
                                            <span className="font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide border border-amber-200">{selectedService.service_type}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="font-bold text-blue-800">Unit Kendaraan</div>
                                        <div className="col-span-2 flex items-center gap-2 flex-wrap">
                                            <span className="px-2 py-0.5 bg-gray-800 text-white rounded text-[10px] font-bold tracking-widest shadow-sm">
                                                {selectedService.plate_number || 'NO PLAT'}
                                            </span>
                                            <span className="font-bold text-gray-700 text-sm uppercase">{selectedService.motor_model}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="font-bold text-blue-800 flex items-center gap-1"><AlertCircle size={14}/> Keluhan</div>
                                        <div className="col-span-2 italic text-gray-600 text-xs bg-white/60 p-2 rounded border border-blue-100">
                                            "{selectedService.complaint_notes || '-'}"
                                        </div>
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-100 mb-6 bg-gray-50/50 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setActiveTab('status')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'status' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Settings2 size={16} /> Status & Catatan
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('billing')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'billing' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <FileSpreadsheet size={16} /> Rincian Penagihan
                                    </button>
                                </div>

                                <form id="serviceUpdateForm" onSubmit={handleUpdate} className="space-y-5">
                                    {activeTab === 'status' && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-5"
                                        >
                                            {/* Status Picker */}
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Tahap Pengerjaan</label>
                                                <div className="relative group">
                                                    <select 
                                                        value={data.status} 
                                                        onChange={e => setData('status', e.target.value)}
                                                        className="bg-white border-2 border-gray-100 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block w-full p-3 font-bold transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="confirmed">Terkonfirmasi / Terjadwal (Confirmed)</option>
                                                        <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                                                        <option value="completed">Selesai (Completed)</option>
                                                        <option value="cancelled">Dibatalkan (Cancelled / Ditolak)</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <MoreVertical size={16} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes Section */}
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Catatan Layanan (Tampil di User)</label>
                                                        {items.length > 0 && (
                                                            <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                                                                <Info size={10} /> Rincian Jasa Aktif
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {items.length > 0 ? (
                                                        <div className="bg-gray-50 border-2 border-gray-100 p-4 rounded-xl text-center">
                                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                                                                "Detail rincian di tab sebelah akan otomatis menjadi catatan untuk pelanggan."
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <textarea 
                                                            rows="3" 
                                                            placeholder="Contoh: Voucher diskon 20% / Silakan ambil unit jam 3 sore" 
                                                            className="bg-blue-50/30 border-2 border-blue-100 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block w-full p-4 font-medium resize-none shadow-inner"
                                                            value={data.service_notes} 
                                                            onChange={e => setData('service_notes', e.target.value)}
                                                        ></textarea>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Log Masalah / Internal Admin</label>
                                                    <textarea 
                                                        rows="3" 
                                                        placeholder="Kerusakan ekstra pada rem / Ganti sparepart busi" 
                                                        className="bg-gray-50 border-2 border-gray-100 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-gray-200 focus:border-gray-400 block w-full p-4 font-medium shadow-inner resize-none"
                                                        value={data.admin_notes} 
                                                        onChange={e => setData('admin_notes', e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'billing' && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* Payment Information Summary */}
                                            <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 space-y-5 shadow-sm">
                                                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-1">
                                                    <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                                        <Printer size={16} />
                                                    </div>
                                                    <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">Ringkasan Pembayaran</h4>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div>
                                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Tagihan</label>
                                                        <div className="flex items-center bg-white border-2 border-gray-100 rounded-xl shadow-inner focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all overflow-hidden">
                                                            <span className="flex-shrink-0 bg-gray-50 border-r-2 border-gray-100 px-4 py-3 text-sm font-black text-gray-400 select-none">
                                                                Rp
                                                            </span>
                                                            <input 
                                                                type="text"
                                                                className="flex-1 bg-transparent text-gray-900 text-sm p-3 outline-none font-black"
                                                                value={formatRupiah(data.total_cost)}
                                                                onChange={e => setData('total_cost', parseRupiah(e.target.value))}
                                                                readOnly={items.length > 0}
                                                            />
                                                        </div>
                                                        {items.length > 0 && (
                                                            <p className="text-[10px] text-blue-500 font-black mt-2 uppercase tracking-tight flex items-center gap-1">
                                                                <CheckCircle2 size={10} /> Dihitung dari rincian
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status Bayar</label>
                                                        <select 
                                                            value={data.payment_status} 
                                                            onChange={e => setData('payment_status', e.target.value)}
                                                            className="bg-white border-2 border-gray-100 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block w-full p-3 font-bold transition-all"
                                                        >
                                                            <option value="unpaid">Belum Lunas (Unpaid)</option>
                                                            <option value="pending">Menunggu (Pending)</option>
                                                            <option value="paid">Lunas (Paid)</option>
                                                            <option value="waived">Digratiskan / Garansi (Waived)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Metode / Keterangan Bayar</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Cash, QRIS, Midtrans, atau Kupon KPB"
                                                        className="bg-white border-2 border-gray-100 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block w-full p-3 font-bold transition-all shadow-inner"
                                                        value={data.payment_method} 
                                                        onChange={e => setData('payment_method', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Itemized Billing Section */}
                                            <div className="bg-gray-50/50 rounded-2xl p-5 border-2 border-gray-100 shadow-sm overflow-hidden relative">
                                                <div className="flex items-center justify-between mb-5 relative z-10">
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <FileSpreadsheet size={14} className="text-blue-500" /> Rincian Jasa & Part
                                                        </h4>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Detail pengerjaan & penggantian</p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={addItem}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                                    >
                                                        <Plus size={14} strokeWidth={3} /> Tambah Item
                                                    </button>
                                                </div>

                                                <div className="space-y-3 relative z-10">
                                                    {items.length > 0 && (
                                                        <div className="hidden md:grid grid-cols-12 gap-2 px-4 mb-2">
                                                            <div className="col-span-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Deskripsi Item</div>
                                                            <div className="col-span-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Jumlah</div>
                                                            <div className="col-span-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Harga Satuan</div>
                                                            <div className="col-span-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</div>
                                                            <div className="col-span-1"></div>
                                                        </div>
                                                    )}

                                                    {items.length === 0 ? (
                                                        <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                                                            <p className="text-xs text-gray-400 font-bold italic uppercase tracking-wider">Belum ada item rincian.</p>
                                                            <p className="text-[10px] text-gray-400 mt-2">Gunakan tombol di atas untuk menambah jasa atau part.</p>
                                                        </div>
                                                    ) : (
                                                        items.map((item, idx) => (
                                                            <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-4 rounded-2xl border-2 border-gray-100 group hover:border-blue-100 transition-all shadow-sm">
                                                                <div className="col-span-12 md:col-span-5">
                                                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 md:hidden">Deskripsi</label>
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="Contoh: Ganti Oli Mesin"
                                                                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 text-xs rounded-lg p-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold shadow-inner"
                                                                        value={item.description}
                                                                        onChange={e => updateItem(idx, 'description', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-span-4 md:col-span-2">
                                                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 md:hidden">Qty</label>
                                                                    <input 
                                                                        type="number" 
                                                                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 text-xs rounded-lg p-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-center font-black shadow-inner"
                                                                        value={item.qty}
                                                                        onChange={e => updateItem(idx, 'qty', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-span-6 md:col-span-2">
                                                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 md:hidden">Harga</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 text-xs rounded-lg p-2.5 text-center outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black shadow-inner"
                                                                        value={formatRupiah(item.price)}
                                                                        onChange={e => updateItem(idx, 'price', parseRupiah(e.target.value))}
                                                                    />
                                                                </div>
                                                                <div className="col-span-6 md:col-span-2 text-right">
                                                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 md:hidden">Subtotal</label>
                                                                    <div className="text-[11px] font-black text-blue-600 px-2 py-1 bg-blue-50 rounded-lg border border-blue-100 inline-block min-w-[80px]">
                                                                        Rp {formatRupiah(parseFloat(item.price || 0) * parseInt(item.qty || 0))}
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-2 md:col-span-1 flex justify-center">
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => removeItem(idx)}
                                                                        className="text-gray-300 hover:text-rose-500 transition-all p-2 bg-gray-50 rounded-lg hover:bg-rose-500/10"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            </div>


                             {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    {selectedService.status === 'completed' && (
                                        <a 
                                            href={route('admin.services.receipt', selectedService.id)}
                                            target="_blank"
                                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                                        >
                                            <Printer size={14} /> CETAK STRUK
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setVisible(false)}
                                        className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-200 bg-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        form="serviceUpdateForm"
                                        type="submit" 
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-blue-500/20"
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : (
                                            <>
                                                <CheckCircle2 size={16} /> Update Status
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </MetronicAdminLayout>
    );
}
