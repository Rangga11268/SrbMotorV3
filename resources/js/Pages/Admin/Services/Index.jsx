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
    MoreVertical
} from "lucide-react";

export default function ServicesIndex({ appointments }) {
    const [selectedService, setSelectedService] = useState(null);
    const [visible, setVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    
    const { data, setData, put, processing, reset } = useForm({
        status: "",
        admin_notes: "",
        service_notes: ""
    });

    const openModal = (app) => {
        setDropdownOpen(null);
        setSelectedService(app);
        setData({
            status: app.status,
            admin_notes: app.admin_notes || "",
            service_notes: app.service_notes || ""
        });
        setVisible(true);
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

                                <form id="serviceUpdateForm" onSubmit={handleUpdate} className="space-y-4">
                                    {/* Status Picker */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Ubah Status Pengerjaan</label>
                                        <select 
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)}
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm font-medium"
                                        >
                                            <option value="confirmed">Terkonfirmasi / Terjadwal (Confirmed)</option>
                                            <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                                            <option value="completed">Selesai (Completed)</option>
                                            <option value="cancelled">Dibatalkan (Cancelled / Ditolak)</option>
                                        </select>
                                    </div>

                                    {/* Notes to User */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 text-blue-600">Catatan Layanan (Tampil di Aplikasi User)</label>
                                        <textarea 
                                            rows="2" 
                                            placeholder="Contoh: Voucher Diskon Jasa 20% / Silakan ambil unit jam 3" 
                                            className="bg-white border border-blue-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm resize-none"
                                            value={data.service_notes} 
                                            onChange={e => setData('service_notes', e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* Internal Notes */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Log Masalah / Internal Admin</label>
                                        <textarea 
                                            rows="2" 
                                            placeholder="Kerusakan ekstra pada rem / Ganti sparepart busi" 
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-400 block w-full p-2.5 shadow-inner resize-none"
                                            value={data.admin_notes} 
                                            onChange={e => setData('admin_notes', e.target.value)}
                                        ></textarea>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
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
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </MetronicAdminLayout>
    );
}
