import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion } from "framer-motion";
import { 
    ChevronRight, Calendar, PenTool, CheckCircle, Clock, 
    XCircle, AlertCircle, ArrowRight, ShieldCheck, 
    Settings, Users, Fuel, MapPin, PhoneCall, Hash, Bike 
} from "lucide-react";

export default function History({ appointments }) {
    const { auth } = usePage().props;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'MENUNGGU' };
            case 'confirmed': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-[#1c69d4]', label: 'DIKONFIRMASI' };
            case 'in_progress': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'PENGERJAAN' };
            case 'completed': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'SELESAI' };
            case 'cancelled': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'DIBATALKAN' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: 'STATUS' };
        }
    };

    return (
        <PublicLayout auth={auth} title="Riwayat Antrian Servis - SRB Motor">
            <div className="flex-grow pt-28 bg-white min-h-screen pb-24">
                {/* Hero Header */}
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12 scale-150"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">RIWAYAT ANTRIAN</span>
                        </nav>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                                    ANTRIAN <br />
                                    <span className="text-[#1c69d4]">SAYA</span>
                                </h1>
                                <p className="text-gray-400 text-lg max-w-xl font-light tracking-wide italic">
                                    Pantau urutan pengerjaan motor Anda secara real-time. Tunjukkan tiket digital di bawah kepada petugas bengkel.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Link href={route('services.create')} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#1c69d4] hover:bg-white text-white hover:text-black font-black uppercase tracking-[0.2em] text-[12px] transition-all duration-300 rounded-none shadow-[0_0_50px_rgba(28,105,212,0.3)] hover:shadow-none">
                                    <Hash className="w-5 h-5" />
                                    AMBIL ANTRIAN BARU
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ACTIVE QUEUES SECTION */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-1 bg-black"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">DAFTAR ANTRIAN & RIWAYAT</h2>
                        </div>

                        {appointments.data && appointments.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {appointments.data.map((item, i) => {
                                    const style = getStatusStyle(item.status);
                                    return (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-white border-2 border-gray-100 hover:border-[#1c69d4] transition-all p-8 flex flex-col relative group"
                                        >
                                            {/* Queue Number Badge */}
                                            <div className="absolute top-0 right-0 p-6">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right mb-1">NO. ANTRIAN</p>
                                                <p className="text-5xl font-black text-[#1c69d4] leading-none tracking-tighter">
                                                    {item.queue_number || '---'}
                                                </p>
                                            </div>

                                            {/* Branch & Date */}
                                            <div className="mb-10">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 ${style.bg} ${style.border} border ${style.text} text-[10px] font-black uppercase tracking-widest`}>
                                                    {item.status === 'pending' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                    {style.label}
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    {item.branch}
                                                </p>
                                                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                    {new Date(item.service_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>

                                            {/* Vehicle Info */}
                                            <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">UNIT KENDARAAN</p>
                                                    <p className="text-xs font-black uppercase tracking-wider">{item.motor_model || 'UNIT SRB'}</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">PLAT NOMOR</p>
                                                        <p className="text-lg font-black text-black tracking-widest">
                                                            {item.plate_number || '---'}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 text-gray-300 group-hover:text-[#1c69d4] transition-colors">
                                                        <Bike size={24} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Small Print / ID */}
                                            <div className="mt-6 text-[8px] font-bold text-gray-300 uppercase tracking-widest flex justify-between">
                                                <span>ID TIKET: #{item.id}</span>
                                                <span>{item.service_time} WIB</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white border-4 border-dashed border-gray-100 py-32 flex flex-col items-center justify-center text-center">
                                <AlertCircle size={48} className="text-gray-200 mb-6" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2"> BELUM ADA ANTRIAN </h3>
                                <p className="text-gray-400 text-sm max-w-sm font-medium mb-10">
                                    Anda belum memiliki riwayat atau antrian servis aktif. Ambil nomor antrian digital Anda sekarang untuk memulai.
                                </p>
                                <Link href={route('services.create')} className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-[#1c69d4] transition-all">
                                    AMBIL ANTRIAN PERTAMA
                                </Link>
                            </div>
                        )}

                        {/* Pagination placeholder if needed */}
                        {appointments.prev_page_url || appointments.next_page_url ? (
                             <div className="mt-16 flex justify-center gap-4">
                                {appointments.prev_page_url && (
                                    <Link href={appointments.prev_page_url} className="px-6 py-3 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all">SEBELUMNYA</Link>
                                )}
                                {appointments.next_page_url && (
                                    <Link href={appointments.next_page_url} className="px-6 py-3 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all">BERIKUTNYA</Link>
                                )}
                             </div>
                        ) : null}
                    </div>
                </section>

                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
                            <div className="space-y-4 group">
                                <Users className="w-10 h-10 text-[#1c69d4] group-hover:scale-110 transition-transform mx-auto md:mx-0" />
                                <h3 className="text-xl font-black uppercase tracking-tight">MEKANIK AHLI</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Tim mekanik bersertifikat SSM dengan jam terbang tinggi khusus motor premium & harian.</p>
                            </div>
                            <div className="space-y-4 group">
                                <ShieldCheck className="w-10 h-10 text-[#1c69d4] group-hover:scale-110 transition-transform mx-auto md:mx-0" />
                                <h3 className="text-xl font-black uppercase tracking-tight">SPAREPART ASLI</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Jaminan keaslian suku cadang (Astra/AHM/YIMM) untuk performa motor yang tahan lama.</p>
                            </div>
                            <div className="space-y-4 group">
                                <Settings className="w-10 h-10 text-[#1c69d4] group-hover:scale-110 transition-transform mx-auto md:mx-0" />
                                <h3 className="text-xl font-black uppercase tracking-tight">ALAT MODERN</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Dilengkapi sistem diagnostik FI terkomputerisasi untuk pengecekan sensor yang akurat.</p>
                            </div>
                            <div className="space-y-4 group">
                                <Fuel className="w-10 h-10 text-[#1c69d4] group-hover:scale-110 transition-transform mx-auto md:mx-0" />
                                <h3 className="text-xl font-black uppercase tracking-tight">CEPAT & TEPAT</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Proses pengerjaan efisien tanpa mengorbankan kualitas. Rawat motor tanpa antre lama.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
