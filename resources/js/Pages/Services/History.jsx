import { Link, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import PublicLayout from "@/Layouts/PublicLayout";
import { ChevronRight, Calendar, PenTool, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Settings, Users, Fuel, MapPin, PhoneCall } from "lucide-react";

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
            <div className="flex-grow pt-28 bg-white min-h-screen pb-24">
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12 scale-150"></div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">SRB SERVICE CENTER</span>
                        </nav>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                                    PREMIUM <br />
                                    <span className="text-[#1c69d4]">SERVICE</span>
                                </h1>
                                <p className="text-gray-400 text-lg max-w-xl font-light tracking-wide italic">
                                    "Kualitas dealer resmi, harga bengkel spesialis. Rawat performa berkala Anda dengan standar mekanik SSM."
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Link href={route('services.create')} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#1c69d4] hover:bg-white text-white hover:text-black font-black uppercase tracking-[0.2em] text-[12px] transition-all duration-300 rounded-none shadow-[0_0_50px_rgba(28,105,212,0.3)] hover:shadow-none">
                                    <Calendar className="w-5 h-5" />
                                    RESERVASI SEKARANG
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white border-b border-gray-100">
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

                <section className="py-24 bg-gray-50 overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-1 bg-black"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">LOKASI BENGKEL RESMI</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { name: "SSM JATIASIH (BEKASI)", address: "Jl. Jatiasih Raya No.123, Jatiasih, Kota Bekasi", jam: "08:00 - 17:00", phone: "0812-XXXX-XXXX" },
                                { name: "SSM MEKAR SARI (BEKASI)", address: "Jl. Raya Mekarsari No.45, Bekasi Timur", jam: "08:00 - 17:00", phone: "0812-XXXX-XXXX" },
                                { name: "SSM DEPOK (DEPOK)", address: "Jl. Margonda Raya No.78, Kota Depok", jam: "08:00 - 17:00", phone: "0812-XXXX-XXXX" },
                                { name: "SSM BOGOR (BOGOR)", address: "Jl. Pajajaran No.12, Kota Bogor", jam: "08:00 - 17:00", phone: "0812-XXXX-XXXX" },
                            ].map((branch, i) => (
                                <div key={i} className="bg-white p-8 border border-gray-200 flex flex-col justify-between hover:border-[#1c69d4] transition-colors group shadow-sm">
                                    <div>
                                        <h4 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-[#1c69d4] transition-colors">{branch.name}</h4>
                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                <p className="text-sm text-gray-500">{branch.address}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <p className="text-sm font-bold uppercase tracking-widest text-black">{branch.jam}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1c69d4] border-b border-[#1c69d4] w-fit pb-1 hover:text-black hover:border-black transition-colors">
                                        <PhoneCall className="w-3 h-3" /> HUBUNGI BENGKEL
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-black text-white p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1c69d4] blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none text-white">APA YANG PERLU <br /> <span className="text-[#1c69d4]">SAYA PERSIAPKAN?</span></h2>
                                    <p className="text-gray-400 mb-8 font-light">Mohon pastikan poin-poin berikut siap saat Anda tiba di lokasi servis demi kenyamanan bersama.</p>
                                    
                                    <div className="space-y-6">
                                        {[
                                            { title: "STNK ASLI", desc: "Wajib dibawa untuk verifikasi identitas kendaraan." },
                                            { title: "BUKU SERVIS", desc: "Penting untuk pencatatan garansi dan riwayat fisik." },
                                            { title: "DATANG TEPAT WAKTU", desc: "Saran kedatangan 10 menit sebelum slot waktu Anda." },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full border border-[#1c69d4] flex items-center justify-center text-[10px] font-bold text-[#1c69d4] flex-shrink-0 mt-1">{i+1}</div>
                                                <div>
                                                    <h5 className="font-black uppercase tracking-widest text-xs mb-1 text-white">{item.title}</h5>
                                                    <p className="text-gray-500 text-xs">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="aspect-square bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-500 group-hover:border-[#1c69d4]">
                                            <ShieldCheck className="w-16 h-16 text-[#1c69d4] opacity-20" />
                                        </div>
                                        <div className="aspect-square bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-500 group-hover:border-[#1c69d4] delay-75">
                                            <Calendar className="w-16 h-16 text-[#1c69d4] opacity-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-[#1c69d4] text-white p-12 md:p-20 relative overflow-hidden group">
                             {/* Abstract geometric background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-black blur-[120px] opacity-20"></div>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                    CEK STATUS <br />
                                    <span className="text-black">KENDARAAN ANDA?</span>
                                </h2>
                                <p className="text-white/80 font-medium max-w-2xl uppercase tracking-widest text-sm leading-relaxed">
                                    Pantau jadwal servis, riwayat pengerjaan mekanik, hingga status cicilan Anda secara real-time di Dashboard Aktivitas.
                                </p>
                                <div className="pt-8">
                                    <Link 
                                        href={route('user.activity')} 
                                        className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black hover:bg-black hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-none"
                                    >
                                        BUKA DASHBOARD SAYA <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
