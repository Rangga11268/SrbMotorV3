import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion } from "framer-motion";
import { 
    ChevronRight, ChevronLeft, Calendar, PenTool, CheckCircle, Clock, 
    XCircle, AlertCircle, ArrowRight, ShieldCheck, 
    Settings, Users, Fuel, MapPin, PhoneCall, Hash, Bike, 
    Wrench, Sparkles, ArrowLeft
} from "lucide-react";

export default function History({ appointments }) {
    const { auth } = usePage().props;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'MENUNGGU KONFIRMASI' };
            case 'confirmed': return { bg: 'bg-[#1c69d4]/5', border: 'border-[#1c69d4]/20', text: 'text-[#1c69d4]', label: 'DIKONFIRMASI' };
            case 'in_progress': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'DALAM PENGERJAAN' };
            case 'completed': return { bg: 'bg-black', border: 'border-black', text: 'text-white', label: 'SELESAI' };
            case 'cancelled': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'DIBATALKAN' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: 'STATUS' };
        }
    };

    return (
        <PublicLayout auth={auth} title="Antrian Servis Saya - SRB Motor">
            <div className="flex-grow pt-28 bg-white min-h-screen pb-24">
                {/* Hero Header - Standardized Industrial Style */}
                <section className="bg-black text-white pt-24 pb-32 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1c69d4] to-transparent opacity-50"></div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none scale-[2]">
                        <Wrench size={180} />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-10">
                            <Link 
                                href="/"
                                className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-gray-500 hover:text-white transition-all group uppercase"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                                KEMBALI KE BERANDA
                            </Link>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                            <div className="max-w-3xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-px bg-[#1c69d4]"></div>
                                    <p className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase italic">SERVICE TRACKER</p>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 italic">
                                    ANTRIAN <br />
                                    <span className="text-[#1c69d4]">SERVIS</span> SAYA
                                </h1>
                                <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl uppercase tracking-widest leading-relaxed opacity-70">
                                    PANTAL PENGERJAAN MOTOR ANDA SECARA PERSONAL. GUNAKAN TIKET DIGITAL UNTUK CHECK-IN DI LOKASI BENGKEL RESMI KAMI.
                                </p>
                            </div>
                            
                            <Link href={route('services.create')} className="w-full lg:w-auto inline-flex items-center justify-center gap-4 px-12 py-6 bg-white hover:bg-[#1c69d4] text-black hover:text-white font-black uppercase tracking-[0.25em] text-[10px] transition-all duration-500 rounded-none shadow-2xl group">
                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                BOOKING SERVIS BARU
                            </Link>
                        </div>
                    </div>
                </section>

                        {/* LISTING SECTION */}
                <section className="py-24 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-0.5 bg-black"></div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">DAFTAR ANTRIAN & TIKET</h2>
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-5 py-3 border border-gray-100 shadow-sm italic text-center md:text-left">
                                * Klik pada kartu antrian untuk melihat tiket digital
                            </div>
                        </div>

                        {appointments.data && appointments.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {appointments.data.map((item, i) => {
                                    const style = getStatusStyle(item.status);
                                    return (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link 
                                                href={route('services.show', item.id)}
                                                className="block bg-white border border-gray-200 hover:border-black transition-all p-0 relative group shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] h-full flex flex-col group overflow-hidden"
                                            >
                                                {/* Card Header Strip */}
                                                <div className={`h-1.5 w-full ${style.bg.replace('bg-', 'bg-') || 'bg-gray-100'}`} style={{ backgroundColor: item.status === 'completed' ? '#000' : (item.status === 'confirmed' ? '#1c69d4' : undefined) }}></div>
                                                
                                                <div className="p-10 flex flex-col h-full">
                                                    {/* Top Section */}
                                                    <div className="flex justify-between items-start mb-10">
                                                        <div className={`inline-flex items-center gap-2 px-4 py-2 border font-black text-[9px] uppercase tracking-widest italic ${style.bg} ${style.border} ${style.text}`}>
                                                            {style.label}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">NO. ANTRIAN</p>
                                                            <p className="text-5xl font-black text-black leading-none italic group-hover:text-[#1c69d4] transition-colors">{item.queue_number || '---'}</p>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="space-y-8">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-3 text-gray-400">
                                                                <MapPin size={12} className="group-hover:text-[#1c69d4] transition-colors" />
                                                                <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{item.branch}</p>
                                                            </div>
                                                            <h3 className="text-sm font-black uppercase text-black italic tracking-tight leading-tight">
                                                                {new Date(item.service_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </h3>
                                                            <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-[0.2em]">{item.service_time} WIB</p>
                                                        </div>

                                                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                                            <div>
                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">UNIT & PLAT</p>
                                                                <p className="text-[11px] font-black uppercase text-black tracking-wider">{item.motor_model || 'UNIT SRB'}</p>
                                                                <p className="text-[9px] font-bold text-[#1c69d4] mt-1 tracking-[0.2em]">{item.plate_number || '---'}</p>
                                                            </div>
                                                            <div className="w-12 h-12 bg-gray-50 flex items-center justify-center group-hover:bg-[#1c69d4] group-hover:text-white transition-all transform group-hover:rotate-12">
                                                                <Bike size={22} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Footer / CTA */}
                                                    <div className="mt-auto pt-10 flex items-center justify-between">
                                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">ID: #{item.id}</span>
                                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1c69d4] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                            LIHAT TIKET <ArrowRight size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
                                <AlertCircle size={56} className="text-gray-100 mb-8" />
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic"> BELUM ADA ANTRIAN AKTIF </h3>
                                <p className="text-gray-400 text-sm max-w-sm font-medium mb-12 uppercase leading-relaxed tracking-wider italic">
                                    Reservasi jadwal servis Anda sekarang untuk mendapatkan nomor antrian prioritas di bengkel kami.
                                </p>
                                <Link href={route('services.create')} className="px-14 py-6 bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#1c69d4] transition-all shadow-xl">
                                    AMBIL ANTRIAN SEKARANG
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {appointments.prev_page_url || appointments.next_page_url ? (
                             <div className="mt-20 flex justify-center items-center gap-8">
                                {appointments.prev_page_url && (
                                    <Link href={appointments.prev_page_url} className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    </Link>
                                )}
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">POCKET {appointments.current_page} OF {appointments.last_page}</span>
                                {appointments.next_page_url && (
                                    <Link href={appointments.next_page_url} className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all group">
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                             </div>
                        ) : null}
                    </div>
                </section>

                {/* USP Section - Standardized Premium */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                            {[
                                { icon: Users, title: 'EXPERT MECHANICS', desc: 'Mekanik tersertifikasi khusus motor Honda & Yamaha dengan standar bengkel resmi.' },
                                { icon: ShieldCheck, title: 'GENUINE PARTS', desc: 'Jaminan 100% suku cadang asli untuk keamanan berkendara Anda.' },
                                { icon: Settings, title: 'MODERN TOOLS', desc: 'Sistem diagnostik terkomputerisasi untuk akurasi pengecekan sensor digital.' },
                                { icon: Sparkles, title: 'SERVICE GUARANTEE', desc: 'Garansi pengerjaan 7 hari untuk kepuasan maksimal setiap pelanggan.' }
                            ].map((usp, index) => (
                                <div key={index} className="space-y-6 group cursor-default">
                                    <div className="w-14 h-14 bg-gray-50 flex items-center justify-center group-hover:bg-[#1c69d4] transition-all duration-500 relative overflow-hidden">
                                        <usp.icon size={24} className="text-[#1c69d4] group-hover:text-white transition-colors relative z-10" />
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight italic">{usp.title}</h3>
                                    <p className="text-gray-500 text-[11px] leading-relaxed font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">{usp.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
