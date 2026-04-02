import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { ChevronRight, Calendar, PenTool, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";

export default function History({ appointments }) {
    const { auth } = usePage().props;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { border: 'border-yellow-500', text: 'text-yellow-600', icon: <Clock size={16} /> };
            case 'confirmed': return { border: 'border-blue-500', text: 'text-[#1c69d4]', icon: <Calendar size={16} /> };
            case 'in_progress': return { border: 'border-purple-500', text: 'text-purple-600', icon: <PenTool size={16} /> };
            case 'completed': return { border: 'border-green-500', text: 'text-green-600', icon: <CheckCircle size={16} /> };
            case 'cancelled': return { border: 'border-red-500', text: 'text-red-600', icon: <XCircle size={16} /> };
            default: return { border: 'border-gray-500', text: 'text-gray-600', icon: <AlertCircle size={16} /> };
        }
    };

    return (
        <PublicLayout auth={auth} title="Riwayat Servis - SRB Motor">
            <div className="flex-grow pt-28 bg-white min-h-screen">
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12 scale-150"></div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">RIWAYAT SERVIS</span>
                        </nav>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    CATATAN <br className="hidden md:block"/>
                                    <span className="text-[#1c69d4]">PERAWATAN</span>
                                </h1>
                                <p className="text-gray-400 text-sm max-w-xl font-medium tracking-wide">
                                    Pantau jadwal rawat jalan dan rekam jejak servis kendaraan Anda di bengkel resmi SRB Motor.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-6 rounded-none">
                                <div className="text-right flex flex-col justify-between h-full">
                                    <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                        {appointments.data.length > 0 ? `${appointments.data.length} AGENDA` : "TIDAK AKTIF"}
                                    </p>
                                    <Link href={route('services.create')} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1c69d4] hover:bg-white text-white hover:text-black font-black uppercase tracking-widest text-[11px] transition-colors rounded-none whitespace-nowrap border border-[#1c69d4] hover:border-white">
                                        <ArrowRight className="w-4 h-4" />
                                        BUAT RESERVASI
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {appointments.data.length === 0 ? (
                        <div className="text-center py-32 bg-gray-50 border border-gray-200">
                            <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center text-gray-300 mx-auto mb-8 rounded-none">
                                <PenTool className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">TIDAK ADA DATA</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-8">Anda belum memiliki riwayat servis atau reservasi aktif.</p>
                            
                            <Link href={route('services.create')} className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-transparent hover:text-black hover:border-black border border-transparent font-black uppercase tracking-widest text-[11px] transition-colors rounded-none mx-auto">
                                AJUKAN SERVIS SEKARANG <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.data.map(app => {
                                const st = getStatusStyle(app.status);
                                return (
                                    <div key={app.id} className="bg-white border hover:shadow-lg transition-shadow duration-300 border-gray-200 p-0 flex flex-col md:flex-row rounded-none overflow-hidden">
                                        <div className={`w-2 md:w-4 flex-shrink-0 bg-white border-r ${st.border} border-r-4`}></div>
                                        <div className="p-6 md:p-8 flex-grow grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                                            
                                            {/* Kendaraan */}
                                            <div className="col-span-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">UNIT</p>
                                                <h4 className="text-lg font-black text-black uppercase tracking-tight line-clamp-1">{app.motor_brand} {app.motor_type}</h4>
                                                <p className="text-sm font-bold text-[#1c69d4] uppercase">{app.license_plate}</p>
                                            </div>

                                            {/* Jadwal */}
                                            <div className="col-span-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">JADWAL & LOKASI</p>
                                                <h4 className="text-lg font-black text-black uppercase tracking-tight">{new Date(app.service_date).toLocaleDateString("id-ID")}</h4>
                                                <p className="text-sm font-bold text-gray-600 uppercase mb-1">{app.service_time}</p>
                                                <p className="text-[10px] font-black text-[#1c69d4] uppercase tracking-widest">{app.branch}</p>
                                            </div>

                                            {/* Estimasi / KM */}
                                            <div className="col-span-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">DATA</p>
                                                <p className="text-sm font-bold text-black uppercase">KM: {app.current_km.toLocaleString()}</p>
                                                {app.status === 'completed' && app.estimated_cost ? (
                                                    <p className="text-sm font-black text-[#1c69d4]">Rp {parseFloat(app.estimated_cost).toLocaleString("id-ID")}</p>
                                                ) : (
                                                    <p className="text-xs font-light text-gray-500 uppercase">{app.service_type}</p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-1 text-left md:text-right flex flex-col justify-center">
                                                <div className={`inline-flex items-center gap-2 font-black uppercase text-[11px] tracking-widest ${st.text} bg-gray-50 border border-gray-100 px-4 py-2 w-max md:ms-auto`}>
                                                    {st.icon} {app.status.replace('_', ' ')}
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
