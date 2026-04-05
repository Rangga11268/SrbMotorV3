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

                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-1 bg-[#1c69d4]"></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">RIWAYAT & AGENDA SAYA</h2>
                    </div>

                    {appointments.data.length === 0 ? (
                        <div className="text-center py-32 bg-gray-50 border border-gray-200">
                            <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center text-gray-300 mx-auto mb-8 rounded-none">
                                <PenTool className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">BELUM ADA AGENDA</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-8">Anda belum memiliki riwayat servis atau reservasi aktif.</p>
                            <Link href={route('services.create')} className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-[#1c69d4] border border-black font-black uppercase tracking-widest text-[11px] transition-all duration-300 rounded-none mx-auto">
                                AJUKAN SERVIS SEKARANG <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {appointments.data.map(app => {
                                const st = getStatusStyle(app.status);
                                return (
                                    <div key={app.id} className="bg-white border hover:shadow-2xl transition-all duration-500 border-gray-200 flex flex-col rounded-none overflow-hidden group">
                                        {/* Status Progress Tracking (Top Bar) */}
                                        <div className="flex w-full bg-gray-50 border-b border-gray-100">
                                            {['pending', 'confirmed', 'in_progress', 'completed'].map((step, idx) => {
                                                const statuses = ['pending', 'confirmed', 'in_progress', 'completed'];
                                                const currentIdx = statuses.indexOf(app.status);
                                                const isPast = currentIdx >= idx;
                                                const labels = { pending: 'Antrean', confirmed: 'Jadwal', in_progress: 'Servis', completed: 'Selesai' };
                                                
                                                if (app.status === 'cancelled' && idx > 0) return null;

                                                return (
                                                    <div key={step} className={`flex-grow py-4 px-4 flex items-center justify-center gap-3 border-r last:border-r-0 border-gray-100 transition-colors ${isPast ? 'bg-[#1c69d4]/5' : ''}`}>
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isPast ? 'bg-[#1c69d4] text-white shadow-[0_0_15px_rgba(28,105,212,0.5)]' : 'bg-gray-200 text-gray-400'}`}>
                                                            {isPast ? <CheckCircle size={12} /> : idx + 1}
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPast ? 'text-[#1c69d4]' : 'text-gray-400'}`}>
                                                            {labels[step]}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            {app.status === 'cancelled' && (
                                                <div className="flex-grow py-4 px-4 flex items-center justify-center gap-3 bg-red-50 text-red-600">
                                                    <XCircle size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dibatalkan</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-start relative">
                                            {/* Section 1: Identity */}
                                            <div className="md:w-1/4 space-y-6 w-full md:border-r border-gray-100 md:pr-12">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1c69d4] mb-3">BOOKING ID</p>
                                                    <h3 className="text-3xl font-black tracking-tighter text-black leading-none">#SRB-{String(app.id).padStart(5, '0')}</h3>
                                                </div>
                                                <div className="pt-6 border-t border-gray-50">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">UNIT KENDARAAN</p>
                                                    <h4 className="text-lg font-black text-black uppercase tracking-tight">{app.motor_model}</h4>
                                                    <div className="mt-4 flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 text-[#1c69d4]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-black bg-gray-100 px-2 py-1">{app.branch}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2: Details */}
                                            <div className="md:w-2/4 grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:border-r border-gray-100 md:pr-12">
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">WAKTU KUNJUNGAN</p>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-[#1c69d4]">
                                                                <Calendar size={18} />
                                                            </div>
                                                            <span className="text-sm font-black text-black uppercase leading-none">{new Date(app.service_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-[#1c69d4]">
                                                                <Clock size={18} />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-600 leading-none">{app.service_time} WIB</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">LAYANAN & KELUHAN</p>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 bg-black flex items-center justify-center text-white">
                                                                <PenTool size={18} />
                                                            </div>
                                                            <span className="text-sm font-black text-black uppercase leading-none">{app.service_type}</span>
                                                        </div>
                                                        <div className="bg-gray-50 p-4 border-l-4 border-[#1c69d4] relative group/notes">
                                                            <p className="text-[9px] font-black text-[#1c69d4] uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                <AlertCircle size={10} /> CATATAN KELUHAN
                                                            </p>
                                                            <p className="text-xs text-black font-bold uppercase tracking-wide leading-relaxed line-clamp-3">
                                                                "{app.complaint_notes || 'TIDAK ADA KELUHAN SPESIFIK.'}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Status Specifics */}
                                                {(app.status === 'cancelled' && app.cancel_reason) && (
                                                    <div className="col-span-1 md:col-span-2 p-4 bg-red-50 border border-red-100">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-2">ALASAN PEMBATALAN ({app.cancelled_by === 'user' ? 'ANDA' : 'PENGELOLA'})</p>
                                                        <p className="text-xs font-bold text-red-700 uppercase tracking-wide leading-relaxed">"{app.cancel_reason}"</p>
                                                    </div>
                                                )}

                                                {app.service_notes && (
                                                    <div className="col-span-1 md:col-span-2 p-5 bg-[#1c69d4]/5 border border-[#1c69d4]/20 flex items-start gap-4">
                                                        <CheckCircle className="w-5 h-5 text-[#1c69d4] flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-[#1c69d4] mb-2">CATATAN LAYANAN & BENEFIT ADMIN</p>
                                                            <p className="text-xs font-black text-black uppercase leading-relaxed tracking-wider">{app.service_notes}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {app.admin_notes && (
                                                    <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 border border-gray-200 border-l-4 border-gray-400">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">INFO TAMBAHAN ADMIN</p>
                                                        <p className="text-xs text-gray-600 italic font-medium leading-relaxed">"{app.admin_notes}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Section 3: Actions */}
                                            <div className="md:w-1/4 flex flex-col justify-between h-full space-y-8 w-full md:items-end">
                                                <div className="space-y-4 md:text-right w-full">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">BUTUH BANTUAN?</p>
                                                    <button className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 hover:border-[#1c69d4] text-[10px] font-black uppercase tracking-widest text-black transition-all duration-300 w-full md:w-auto justify-center group/call">
                                                        <PhoneCall size={14} className="group-hover/call:rotate-12 transition-transform" /> HUBUNGI CABANG
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-4 w-full md:items-end">
                                                    {(app.status === 'pending' || app.status === 'confirmed') && new Date(app.service_date) >= new Date(new Date().setHours(0,0,0,0)) && (
                                                        <button 
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: 'BATALKAN SERVIS?',
                                                                    text: "Informasikan alasan pembatalan Anda kepada kami:",
                                                                    icon: 'warning',
                                                                    input: 'textarea',
                                                                    inputPlaceholder: 'Contoh: Ada keperluan mendadak...',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#000',
                                                                    cancelButtonColor: '#d33',
                                                                    confirmButtonText: 'YA, BATALKAN',
                                                                    cancelButtonText: 'TIDAK',
                                                                    background: '#fff',
                                                                    borderRadius: '0px',
                                                                    customClass: {
                                                                        title: 'font-black uppercase tracking-tighter text-2xl',
                                                                        confirmButton: 'rounded-none px-8 py-3 font-black uppercase tracking-widest text-[11px]',
                                                                        cancelButton: 'rounded-none px-8 py-3 font-black uppercase tracking-widest text-[11px]'
                                                                    }
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        router.post(route('services.cancel', app.id), {
                                                                            reason: result.value || 'DIBATALKAN SECARA MANDIRI OLEH PELANGGAN.'
                                                                        }, {
                                                                            onSuccess: () => {
                                                                                Swal.fire({
                                                                                    title: 'BERHASIL DIBATALKAN',
                                                                                    text: 'Reservasi Anda telah dihapus dari antrean aktif.',
                                                                                    icon: 'success',
                                                                                    borderRadius: '0px',
                                                                                    confirmButtonColor: '#1c69d4',
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }}
                                                            className="text-[10px] uppercase font-black text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 border border-red-500 tracking-[0.2em] transition-all text-center w-full md:w-fit"
                                                        >
                                                            BATALKAN RESERVASI
                                                        </button>
                                                    )}
                                                    <div className={`px-6 py-3 border-2 ${st.border} ${st.text} text-[11px] font-black uppercase tracking-[0.3em] bg-white shadow-xl flex items-center gap-2 justify-center w-full md:w-fit`}>
                                                        <div className={`w-2 h-2 rounded-full ${st.text.replace('text', 'bg')}`}></div>
                                                        {app.status.replace('_', ' ')}
                                                    </div>
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
