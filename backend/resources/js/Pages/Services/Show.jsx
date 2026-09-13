import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Calendar, MapPin, Hash, CheckCircle2, AlertCircle, FileText, ChevronLeft, 
    Phone, Wrench, Settings, Activity, ArrowRight, Wallet, Receipt, 
    ShieldCheck, Printer, Clock, ArrowLeft, CreditCard, Info
} from 'lucide-react';
import axios from 'axios';
import { Link, usePage, router } from '@inertiajs/react';
import PublicLayout from "@/Layouts/PublicLayout";
import Swal from 'sweetalert2';

export default function Show({ appointment }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = React.useState('ticket');

    if (!appointment) return null;
    
    // ... same helper functions ...
    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-[#1c69d4]/10', border: 'border-[#1c69d4]', text: 'text-[#1c69d4]', label: 'MENUNGGU KONFIRMASI', icon: Clock };
            case 'confirmed': return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', label: 'TERKONFIRMASI (SLOT AMAN)', icon: CheckCircle2 };
            case 'in_progress': return { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', label: 'PENGERJAAN MEKANIK', icon: Wrench };
            case 'completed': return { bg: 'bg-black', border: 'border-black', text: 'text-white', label: 'SELESAI & SIAP AMBIL', icon: ShieldCheck };
            case 'cancelled': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', label: 'DIBATALKAN', icon: X };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: 'STATUS', icon: AlertCircle };
        }
    };

    // ... handleCancel, handlePayment effects ...
    useEffect(() => {
        const scriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-XXXXX';
        
        let scriptTag = document.createElement('script');
        scriptTag.src = scriptUrl;
        scriptTag.setAttribute('data-client-key', clientKey);
        
        document.body.appendChild(scriptTag);
        
        return () => {
            if (document.body.contains(scriptTag)) {
                document.body.removeChild(scriptTag);
            }
        }
    }, []);

    const handleCancel = () => {
        Swal.fire({
            title: 'BATALKAN RESERVASI?',
            text: "Reservasi yang sudah dibatalkan tidak dapat dikembalikan.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'YA, BATALKAN',
            cancelButtonText: 'TIDAK',
            borderRadius: '0px',
            background: '#ffffff',
            color: '#000000',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('services.cancel', appointment.id), {
                    _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                }, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'BERHASIL',
                            text: 'Reservasi Anda telah dibatalkan.',
                            icon: 'success',
                            confirmButtonColor: '#1c69d4',
                            borderRadius: '0px'
                        });
                    }
                });
            }
        });
    };

    const handlePayment = async () => {
        try {
            const response = await axios.post(route('services.pay', appointment.id));
            const data = response.data;
            if (data.token) {
                window.snap.pay(data.token, {
                    onSuccess: () => window.location.reload(),
                    onPending: () => window.location.reload(),
                    onError: () => Swal.fire('Gagal', 'Terjadi kesalahan pada pembayaran.', 'error'),
                });
            }
        } catch (err) {
            Swal.fire('Error', 'Gagal menghubungi server pembayaran.', 'error');
        }
    };

    const statusStyle = getStatusStyle(appointment.status);

    return (
        <PublicLayout auth={auth} title={`Tiket Antrian #${appointment.queue_number} - SRB Motor`}>
            <div className="flex-grow bg-gray-50 min-h-screen pb-32">
                {/* Standardized Hero Header */}
                <section className="bg-black text-white pt-[160px] pb-48 border-b border-gray-800 relative overflow-hidden mb-8">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-8">
                            <Link href={route('services.index')} className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-gray-500 hover:text-white transition-all group uppercase">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> KEMBALI KE RIWAYAT
                            </Link>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div>
                                <p className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase mb-4 italic">SERVICE HUB</p>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                                    PENGELOLAAN <span className="text-[#1c69d4]">ANTRIAN</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                                <button 
                                    onClick={() => setActiveTab('ticket')}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ticket' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                                >
                                    1. E-TIKET MASUK
                                </button>
                                <button 
                                    onClick={() => setActiveTab('billing')}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'bg-[#1c69d4] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white'}`}
                                >
                                    2. TAGIHAN & BAYAR
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 -mt-32 text-black">
                    <AnimatePresence mode="wait">
                        {activeTab === 'ticket' ? (
                            <motion.div 
                                key="ticket"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white shadow-[0_60px_120px_rgba(0,0,0,0.15)] relative overflow-hidden rounded-sm"
                            >
                                {/* Decorative Ticket Perforation */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-gray-50 rounded-full z-20 hidden md:block border border-gray-100" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-gray-50 rounded-full z-20 hidden md:block border border-gray-100" />

                                <div className="bg-black text-white p-10 md:p-14 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-[3] pointer-events-none">
                                        <Receipt size={100} className="text-[#1c69d4]" />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                        <div>
                                            <span className="text-[11px] font-black text-[#1c69d4] uppercase tracking-[0.6em] mb-4 block">SRB MOTOR OFFICIAL</span>
                                            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-white uppercase italic">E-PASS TICKET</h2>
                                        </div>
                                        <div className={`px-6 py-3 border font-black text-[11px] tracking-widest uppercase italic shadow-lg ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                                            {statusStyle.label}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-[45%] p-10 md:p-14 bg-white border-r border-dashed border-gray-200 text-center md:text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">TUNJUKKAN NO. ANTRIAN</p>
                                        <h2 className="text-9xl md:text-[11rem] font-black italic tracking-tighter text-black leading-none mb-8">{appointment.queue_number || '---'}</h2>
                                        <div className="space-y-4 pt-8 border-t border-gray-100">
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                                                    <MapPin size={20} className="text-[#1c69d4]" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LOKASI BENGKEL</p>
                                                    <p className="text-sm font-black text-black uppercase">{appointment.branch}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-10 md:p-14 space-y-10 bg-gray-50/20">
                                        <div className="bg-black text-white p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2 opacity-20"><Info size={32} /></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 text-[#1c69d4]">INSTRUKSI CHECK-IN:</h4>
                                            <p className="text-xs font-bold leading-relaxed uppercase tracking-wider italic">
                                                {appointment.status === 'pending' ? "MOHON TUNGGU KONFIRMASI ADMIN SEBELUM KE BENGKEL." : "TIKET VALID. SILAKAN DATANG KE LOKASI BENGKEL DAN TUNJUKKAN HALAMAN INI KEPADA PETUGAS."}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">JADWAL KEDATANGAN</p>
                                                <p className="text-sm font-black text-black uppercase">{new Date(appointment.service_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                <p className="text-lg font-black text-[#1c69d4] tracking-tighter mt-1">{appointment.service_time} WIB</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">UNIT KENDARAAN</p>
                                                <p className="text-sm font-black text-black uppercase italic">{appointment.motor_model || 'UNIT SRB'}</p>
                                                <p className="text-[11px] font-black text-[#1c69d4] tracking-[0.2em] mt-1">{appointment.plate_number || '---'}</p>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-gray-100 flex flex-col items-center">
                                            <div className="flex gap-1 h-12 mb-4 opacity-30">
                                                {[...Array(30)].map((_, i) => <div key={i} className="bg-black" style={{ width: `${[1, 2, 3][i % 3]}px` }}></div>)}
                                            </div>
                                            <p className="text-[8px] font-mono text-gray-400 tracking-[0.5em]">*{appointment.id}{new Date(appointment.created_at).getTime()}*</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="billing"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white shadow-[0_60px_120px_rgba(0,0,0,0.15)] relative overflow-hidden border border-gray-100"
                            >
                                <div className="p-10 md:p-14">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-black text-white flex items-center justify-center shadow-lg"><Wallet size={20} /></div>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">RINCIAN <span className="text-[#1c69d4]">PEMBAYARAN</span></h3>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed max-w-md">
                                                Berikut adalah rincian pengerjaan dan penggantian part untuk unit anda. Silakan lakukan pelunasan sesuai instruksi di bawah.
                                            </p>
                                        </div>
                                        <div className="text-right p-6 bg-gray-50 border border-gray-100 min-w-[200px]">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic text-right">TOTAL TAGIHAN</p>
                                            <p className="text-4xl font-black text-black tracking-tighter">Rp {Number(appointment.total_cost || 0).toLocaleString('id-ID')}</p>
                                            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 font-black text-[9px] uppercase tracking-widest border ${
                                                appointment.payment_status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                appointment.payment_status === 'waived' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                                {appointment.payment_status === 'paid' ? 'LUNAS' : appointment.payment_status === 'waived' ? 'DIGRATISKAN' : 'BELUM LUNAS'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Itemized Table */}
                                    <div className="mb-12">
                                        <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-black mb-4">
                                            <div className="col-span-6 text-[10px] font-black uppercase tracking-widest text-gray-400">DESKRIPSI JASA & PART</div>
                                            <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">QTY</div>
                                            <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">SUBTOTAL</div>
                                        </div>
                                        {appointment.items && appointment.items.length > 0 ? (
                                            <div className="space-y-4">
                                                {appointment.items.map((item, idx) => (
                                                    <div key={idx} className="grid grid-cols-12 gap-4 items-center">
                                                        <div className="col-span-6">
                                                            <p className="text-sm font-black text-black uppercase tracking-tight leading-tight">{item.description}</p>
                                                            <p className="text-[10px] font-bold text-[#1c69d4] mt-1 italic">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                                        </div>
                                                        <div className="col-span-2 text-center text-sm font-black">{item.qty}</div>
                                                        <div className="col-span-4 text-right text-sm font-black">Rp {Number(item.price * item.qty).toLocaleString('id-ID')}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 bg-gray-50 text-center border-2 border-dashed border-gray-100 italic font-bold text-gray-400 uppercase text-xs">
                                                RINCIAN BELUM TERSEDIA
                                            </div>
                                        )}
                                    </div>

                                    {/* Next Step & Admin Notes */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                        <div className="bg-blue-50/50 p-8 border border-blue-100 group">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-[#1c69d4] flex items-center gap-2">
                                                <CheckCircle2 size={16} /> CARA BAYAR & AMBIL UNIT
                                            </h4>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold text-blue-900 leading-relaxed uppercase tracking-wider italic">
                                                    {appointment.status === 'completed' && appointment.payment_status === 'unpaid' 
                                                        ? "PEMBAYARAN DAPAT DILAKUKAN MELALUI TOMBOL ONLINE DI SEBELAH ATAU TUNAI DI KASIR BENGKEL. HARAP TUNJUKKAN HALAMAN INI SAAT PENGAMBILAN UNIT."
                                                        : "TUNGGU KONFIRMASI DARI MEKANIK UNTUK TOTAL TAGIHAN DAN STATUS PENGERJAAN."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            {appointment.admin_notes && (
                                                <div className="bg-black text-white p-8 group">
                                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-3 text-[#1c69d4]">PESAN DARI BENGKEL:</h4>
                                                    <p className="text-xs font-bold italic leading-relaxed opacity-80">"{appointment.admin_notes}"</p>
                                                </div>
                                            )}
                                            {appointment.payment_status === 'unpaid' && Number(appointment.total_cost || 0) > 0 && (
                                                <button 
                                                    onClick={handlePayment}
                                                    className="w-full bg-[#1c69d4] hover:bg-black text-white p-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
                                                >
                                                    <CreditCard size={18} /> BAYAR ONLINE SEKARANG
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Support Banner */}
                    <div className="mt-12 p-8 bg-white border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8 group relative overflow-hidden">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-12 h-12 bg-gray-50 flex items-center justify-center group-hover:bg-[#1c69d4] group-hover:text-white transition-all"><Phone size={20} /></div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 italic">BUTUH BANTUAN LAYANAN?</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Hubungi tim support kami melalui WhatsApp di 0822-1888-0456</p>
                            </div>
                        </div>
                        <a href="https://wa.me/6282218880456" target="_blank" className="px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1c69d4] transition-all relative z-10 shadow-lg">
                            HUBUNGI ADMIN
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
