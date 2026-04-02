import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { ChevronRight, Calendar, PenTool, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft } from "lucide-react";

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
                <section className="bg-black text-white pt-6 pb-16 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4]">
                                <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                                <ChevronRight className="w-3 h-3 text-gray-600" />
                                <span className="text-gray-400">RIWAYAT SERVIS</span>
                            </nav>
                        <div className="flex justify-between items-end">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                                CATATAN <span className="text-[#1c69d4]">PERAWATAN</span>
                            </h1>
                            <Link href={route('services.create')} className="px-6 py-3 bg-[#1c69d4] hover:bg-white text-white hover:text-black font-black uppercase tracking-widest text-[11px] transition-colors rounded-none">
                                BUAT RESERVASI BARU
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {appointments.data.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50 border border-gray-200 p-12">
                            <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">TIDAK ADA DATA</h3>
                            <p className="text-gray-500 font-light text-sm">Anda belum memiliki riwayat servis atau reservasi aktif.</p>
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
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">JADWAL</p>
                                                <h4 className="text-lg font-black text-black uppercase tracking-tight">{new Date(app.service_date).toLocaleDateString("id-ID")}</h4>
                                                <p className="text-sm font-bold text-gray-600 uppercase">{app.service_time}</p>
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
