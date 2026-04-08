import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Hash, CheckCircle2, AlertCircle, FileText, ChevronLeft, Phone, Wrench, Sparkles, Zap, ArrowRight, Wallet, Receipt, ShieldCheck, Printer, Clock, ArrowLeft } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import PublicLayout from "@/Layouts/PublicLayout";
import { toast } from 'react-hot-toast';

export default function Show({ appointment }) {
    const { auth } = usePage().props;

    if (!appointment) return null;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-[#1c69d4]/10', border: 'border-[#1c69d4]', text: 'text-[#1c69d4]', label: 'MENUNGGU KONFIRMASI', icon: Clock };
            case 'confirmed': return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', label: 'DIKONFIRMASI', icon: CheckCircle2 };
            case 'in_progress': return { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', label: 'PENGERJAAN MEKANIK', icon: Wrench };
            case 'completed': return { bg: 'bg-black', border: 'border-black', text: 'text-white', label: 'SELESAI & SIAP AMBIL', icon: Sparkles };
            case 'cancelled': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', label: 'DIBATALKAN', icon: X };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: 'STATUS', icon: AlertCircle };
        }
    };

    const handleCancel = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan reservasi servis ini?')) {
            router.post(route('services.cancel', appointment.id), {
                _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            }, {
                onSuccess: () => toast.success('Reservasi berhasil dibatalkan'),
                onError: () => toast.error('Gagal membatalkan reservasi')
            });
        }
    };

    const statusStyle = getStatusStyle(appointment.status);

    return (
        <PublicLayout auth={auth} title={`Tiket Antrian #${appointment.queue_number} - SRB Motor`}>
            <div className="flex-grow bg-gray-50 min-h-screen pb-32">
                {/* Standardized Hero Header for Detail Page */}
                <section className="bg-black text-white pt-[160px] pb-56 border-b border-gray-800 relative overflow-hidden mb-12">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-10">
                            <Link 
                                href={route('services.index')}
                                className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-gray-500 hover:text-white transition-all group uppercase"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                                KEMBALI KE RIWAYAT
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                            <div className="max-w-3xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-px bg-[#1c69d4]"></div>
                                    <p className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase italic text-white/50">TIKET DIGITAL</p>
                                </div>
                                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic">
                                    DETAIL <br/>
                                    <span className="text-[#1c69d4]">ANTRIAN</span> #{appointment.queue_number}
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 -mt-48 text-black">

                    {/* MAIN TICKET CONTAINER */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-[0_60px_120px_rgba(0,0,0,0.2)] relative overflow-hidden"
                    >
                        {/* Decorative Ticket Perforation Appearance */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-gray-50 rounded-full z-20 hidden md:block" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-gray-50 rounded-full z-20 hidden md:block" />

                        {/* TICKET HEADER / BRANDING */}
                        <div className="bg-black text-white p-10 md:p-14 relative overflow-hidden">
                             {/* Large Background Icon */}
                             <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-[3] pointer-events-none">
                                <Zap size={100} className="text-[#1c69d4]" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                <div>
                                    <span className="text-[11px] font-black text-[#1c69d4] uppercase tracking-[0.6em] mb-4 block">SERVIS RESMI SRB MOTOR</span>
                                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-3 text-white uppercase italic">DIGITAL TICKET</h2>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">ID TRANSAKSI: #{appointment.id} / {new Date(appointment.created_at).getTime()}</p>
                                </div>
                                
                                <button onClick={() => window.print()} className="shrink-0 w-16 h-16 bg-white/10 hover:bg-[#1c69d4] text-white flex items-center justify-center transition-all group">
                                    <Printer size={28} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* TICKET BODY */}
                        <div className="flex flex-col md:flex-row">
                            {/* Left: Queue Primary Info */}
                            <div className="w-full md:w-[45%] p-10 md:p-14 bg-white border-r border-dashed border-gray-200">
                                <div className="space-y-12">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">NOMOR ANTRIAN ANDA</p>
                                        <div className="relative inline-block">
                                            <h2 className="text-8xl md:text-9xl font-black italic tracking-tighter text-black leading-none">{appointment.queue_number || '---'}</h2>
                                            <div className="absolute -top-4 -right-4">
                                                <Sparkles className="text-[#1c69d4] animate-pulse" size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-8 border-t border-gray-100">
                                        <div className={`inline-flex items-center gap-3 px-5 py-2.5 border italic font-black text-[10px] tracking-widest uppercase ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                                            <statusStyle.icon size={14} />
                                            {statusStyle.label}
                                        </div>

                                        <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest italic pr-8">
                                            * Harap hadir di bengkel minimal 10 menit sebelum jadwal untuk proses pendaftaran ulang.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Details Info */}
                            <div className="flex-1 p-10 md:p-16 space-y-14 bg-gray-50/30">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 shadow-sm bg-white w-fit px-2 py-1">
                                            <Calendar size={10} className="text-[#1c69d4]" /> JADWAL
                                        </p>
                                        <p className="text-sm font-black text-black uppercase tracking-tight">{new Date(appointment.service_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        <p className="text-xl font-black text-[#1c69d4] tracking-tighter mt-1">{appointment.service_time} <span className="text-[10px] text-gray-400 uppercase">WIB</span></p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 shadow-sm bg-white w-fit px-2 py-1">
                                            <MapPin size={10} className="text-[#1c69d4]" /> LOKASI
                                        </p>
                                        <p className="text-sm font-black text-black uppercase tracking-tight">{appointment.branch}</p>
                                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Dealer Service Center</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">PELANGGAN</p>
                                        <p className="text-sm font-black uppercase text-black line-clamp-1">{appointment.customer_name || 'GUEST'}</p>
                                        <p className="text-[10px] font-bold text-[#1c69d4] mt-1 tracking-widest">{appointment.customer_phone || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">LAYANAN DIPESAN</p>
                                        <p className="text-sm font-black uppercase text-[#1c69d4]">{appointment.service_type || 'SERVIS BERKALA'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">UNIT MOTOR</p>
                                        <p className="text-sm font-black uppercase text-black italic">{appointment.motor_model || 'UNIT SRB'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">PLAT NOMOR</p>
                                        <p className="text-sm font-black uppercase text-black tracking-[0.2em]">{appointment.plate_number || '---'}</p>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">CATATAN KELUHAN</p>
                                    <div className="p-6 bg-white border-2 border-dashed border-gray-100 italic text-[11px] text-gray-500 font-bold leading-relaxed uppercase tracking-wider">
                                        "{appointment.complaint_notes || 'Tidak ada catatan keluhan tambahan.'}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TICKET FOOTER */}
                        <div className="p-8 md:px-12 md:py-10 bg-gray-50 border-t border-gray-200 flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <div className="w-12 h-12 bg-white flex items-center justify-center rotate-3 shadow-md shrink-0">
                                    <ShieldCheck size={24} className="text-[#1c69d4]" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">GARANSI SERVIS SSM</h4>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pr-4 leading-relaxed">
                                        Berlaku 7 hari atau 500km sejak pengerjaan selesai. Simpan tiket digital ini sebagai bukti klaim.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <a href="https://wa.me/6282218880456" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-300 hover:border-[#1c69d4] text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                    <Phone size={14} /> BANTUAN
                                </a>
                                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                     <button 
                                        onClick={handleCancel}
                                        className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                    >
                                        BATALKAN RESERVASI
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* HELP BANNER */}
                    <div className="mt-12 p-8 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                             <Receipt size={120} />
                        </div>
                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            <div className="w-14 h-14 bg-[#1c69d4] flex items-center justify-center shrink-0">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1 italic">BUTUH LAYANAN EKSPRES?</h4>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Gunakan layanan Pit-Express untuk pengerjaan ganti oli & ban di bawah 20 menit.</p>
                            </div>
                        </div>
                        <Link href="/bantuan" className="w-full md:w-auto px-8 py-4 bg-[#1c69d4] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all relative z-10 text-center">
                            LEARN MORE
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
