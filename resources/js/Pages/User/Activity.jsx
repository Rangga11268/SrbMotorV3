import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { 
    ChevronRight, Calendar, PenTool, CheckCircle, Clock, XCircle, 
    AlertCircle, ArrowRight, ShieldCheck, Settings, Users, 
    Fuel, MapPin, PhoneCall, CreditCard, ShoppingBag, History,
    MessageCircle, Package, ArrowLeft
} from "lucide-react";
import Swal from "sweetalert2";

export default function Activity({ appointments, orders, installments, auth, filters }) {
    const [activeTab, setActiveTab] = useState(filters.tab || "service");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { border: 'border-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50', icon: <Clock size={16} /> };
            case 'confirmed': return { border: 'border-blue-500', text: 'text-[#1c69d4]', bg: 'bg-blue-50', icon: <Calendar size={16} /> };
            case 'in_progress': return { border: 'border-purple-500', text: 'text-purple-600', bg: 'bg-purple-50', icon: <PenTool size={16} /> };
            case 'completed': return { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={16} /> };
            case 'cancelled': return { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={16} /> };
            default: return { border: 'border-gray-500', text: 'text-gray-600', bg: 'bg-gray-50', icon: <AlertCircle size={16} /> };
        }
    };

    const getOrderStatusStyle = (status) => {
        const statuses = {
            'new_order': { label: 'Pesanan Baru', color: 'blue' },
            'waiting_payment': { label: 'Menunggu Pembayaran', color: 'yellow' },
            'waiting_document': { label: 'Lengkapi Dokumen', color: 'orange' },
            'document_review': { label: 'Verifikasi Dokumen', color: 'purple' },
            'survey_scheduled': { label: 'Jadwal Survei', color: 'blue' },
            'survey_completed': { label: 'Survei Selesai', color: 'indigo' },
            'leasing_process': { label: 'Proses Leasing', color: 'cyan' },
            'approved': { label: 'Disetujui', color: 'green' },
            'rejected': { label: 'Ditolak', color: 'red' },
            'waiting_unit': { label: 'Menunggu Unit', color: 'blue' },
            'delivery': { label: 'Pengiriman', color: 'amber' },
            'completed': { label: 'Selesai', color: 'green' },
            'cancelled': { label: 'Dibatalkan', color: 'red' }
        };
        return statuses[status] || { label: status, color: 'gray' };
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(route('user.activity'), { tab }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout title="Aktivitas Saya - SRB Motor">
            <div className="pt-28 pb-24 min-h-screen bg-[#fafafa]">
                {/* HERO HEADER */}
                <section className="bg-black text-white py-20 relative overflow-hidden mb-12">
                     <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12 scale-150"></div>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1c69d4] mb-6">
                                <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                                <ChevronRight className="w-3 h-3 text-gray-700" />
                                <span className="text-gray-500">MY ACCOUNT</span>
                            </nav>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                AKTIVITAS <br />
                                <span className="text-[#1c69d4]">SAYA.</span>
                            </h1>
                            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs opacity-70">
                                Pantau pesanan, agenda servis, dan cicilan Anda dalam satu dashboard.
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                             <div className="w-16 h-16 bg-[#1c69d4] flex items-center justify-center text-white text-2xl font-black mb-2">
                                {auth.user.name.charAt(0)}
                             </div>
                             <p className="text-sm font-black uppercase tracking-widest">{auth.user.name}</p>
                             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{auth.user.email}</p>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* DASHBOARD TABS */}
                    <div className="flex flex-col md:flex-row gap-0 border border-gray-200 bg-white mb-12">
                        {[
                            { id: "service", label: "Agenda Servis", icon: <PenTool className="w-4 h-4" /> },
                            { id: "orders", label: "Pesanan Motor", icon: <ShoppingBag className="w-4 h-4" /> },
                            { id: "installments", label: "Cicilan Aktif", icon: <CreditCard className="w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-3 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-4 md:border-b-0 md:border-r last:border-r-0 border-gray-200 ${
                                    activeTab === tab.id 
                                    ? "bg-black text-white border-b-black md:border-r-black" 
                                    : "bg-white text-gray-400 hover:bg-gray-50 hover:text-black"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    <div className={`transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        {activeTab === "service" && (
                            <section className="space-y-12">
                                <div className="flex items-center justify-between gap-4 mb-8">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">AGENDA & RIWAYAT SERVIS</h2>
                                    <Link href={route('services.create')} className="px-6 py-3 bg-[#1c69d4] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> RESERVASI BARU
                                    </Link>
                                </div>

                                {appointments.data.length === 0 ? (
                                    <div className="text-center py-24 bg-white border border-dashed border-gray-300">
                                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-6">
                                            <History className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Belum ada agenda servis yang tercatat.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {appointments.data.map(app => {
                                            const st = getStatusStyle(app.status);
                                            return (
                                                <div key={app.id} className="bg-white border border-gray-200 shadow-sm group hover:border-[#1c69d4] transition-all overflow-hidden">
                                                    <div className="flex flex-col lg:flex-row">
                                                        {/* Left Info Bar */}
                                                        <div className="lg:w-1/4 p-8 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between">
                                                            <div>
                                                                <span className="text-[9px] font-black text-[#1c69d4] uppercase tracking-widest mb-2 block">BOOKING ID</span>
                                                                <h4 className="text-2xl font-black tracking-tighter">#SRB-{String(app.id).padStart(5, '0')}</h4>
                                                            </div>
                                                            <div className="mt-8">
                                                                <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 ${st.border} ${st.text} font-black text-[10px] uppercase tracking-widest`}>
                                                                    {st.icon}
                                                                    {app.status.replace('_', ' ')}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Middle Content */}
                                                        <div className="flex-1 p-8 grid md:grid-cols-2 gap-8">
                                                            <div className="space-y-6">
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">UNIT KENDARAAN</p>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-black">
                                                                            <Fuel className="w-5 h-5" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-black uppercase text-black">{app.motor_model}</p>
                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">{app.branch}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">WAKTU SERVIS</p>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-[#1c69d4]">
                                                                            <Calendar className="w-5 h-5" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-black uppercase text-black">{new Date(app.service_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">{app.service_time} WIB</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-6">
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">LAYANAN & KELUHAN</p>
                                                                    <div className="flex items-center gap-3 mb-4">
                                                                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                                                                            <PenTool className="w-5 h-5" />
                                                                        </div>
                                                                        <p className="text-sm font-black uppercase text-black">{app.service_type}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 p-4 border-l-4 border-[#1c69d4]">
                                                                        <p className="text-[10px] text-gray-600 font-bold italic leading-relaxed">
                                                                            "{app.complaint_notes || 'Tidak ada catatan keluhan spesifik.'}"
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right Actions */}
                                                        <div className="lg:w-1/6 p-8 flex flex-col justify-center items-center gap-4 bg-gray-50 lg:bg-white border-t lg:border-t-0 lg:border-l border-gray-100">
                                                            {(app.status === 'pending' || app.status === 'confirmed') && (
                                                                <button 
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            title: 'BATALKAN SERVIS?',
                                                                            text: "Berikan alasan pembatalan Anda:",
                                                                            input: 'textarea',
                                                                            showCancelButton: true,
                                                                            confirmButtonColor: '#000',
                                                                            cancelButtonColor: '#d33',
                                                                            confirmButtonText: 'YA, BATALKAN',
                                                                            cancelButtonText: 'TIDAK',
                                                                            customClass: {
                                                                                title: 'font-black uppercase tracking-tighter',
                                                                                confirmButton: 'rounded-none px-6 py-3 font-black text-[10px] uppercase tracking-widest',
                                                                                cancelButton: 'rounded-none px-6 py-3 font-black text-[10px] uppercase tracking-widest'
                                                                            }
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                router.post(route('services.cancel', app.id), {
                                                                                    reason: result.value || 'DIBATALKAN OLEH PELANGGAN.'
                                                                                });
                                                                            }
                                                                        });
                                                                    }}
                                                                    className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                                >
                                                                    BATALKAN
                                                                </button>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === "orders" && (
                            <section className="space-y-12">
                                <div className="flex items-center justify-between gap-4 mb-8">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">RIWAYAT PESANAN MOTOR</h2>
                                </div>
                                
                                {orders.data.length === 0 ? (
                                    <div className="text-center py-24 bg-white border border-dashed border-gray-300">
                                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-6">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Anda belum memiliki riwayat pesanan unit.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-8">
                                        {orders.data.map(order => {
                                            const st = getOrderStatusStyle(order.status);
                                            return (
                                                <div key={order.id} className="bg-white border border-gray-200 hover:border-black transition-all shadow-sm">
                                                    <div className="p-6 md:p-10">
                                                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 border-b border-gray-100 pb-10">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-32 h-24 bg-gray-50 p-4 border border-gray-100 flex items-center justify-center">
                                                                    <img 
                                                                        src={order.motor?.image_path ? `/storage/${order.motor.image_path}` : "/assets/img/no-image.webp"} 
                                                                        className="max-h-full max-w-full object-contain"
                                                                        alt={order.motor?.name}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{order.reference_number}</p>
                                                                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">{order.motor?.name}</h3>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-${st.color}-100 text-${st.color}-700 border border-${st.color}-200`}>
                                                                            {st.label}
                                                                        </span>
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{order.transaction_type} • {new Date(order.created_at).toLocaleDateString("id-ID")}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:items-end justify-center">
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">TOTAL PEMBAYARAN</p>
                                                                <p className="text-2xl font-black tracking-tighter text-black">IDR {parseInt(order.final_price).toLocaleString("id-ID")}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                                            <div className="flex items-center gap-12 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">METODE</span>
                                                                    <span className="text-xs font-black uppercase text-black">{order.payment_method}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">TENOR</span>
                                                                    <span className="text-xs font-black uppercase text-black">{order.transaction_type === 'CREDIT' ? `${order.creditDetail?.tenor} Bulan` : 'CASH'}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">DP/BOOKING</span>
                                                                    <span className="text-xs font-black uppercase text-black">IDR {parseInt(order.booking_fee || 0).toLocaleString("id-ID")}</span>
                                                                </div>
                                                            </div>
                                                            <Link href={route('motors.transaction.show', order.id)} className="w-full md:w-auto px-8 py-4 bg-black text-white hover:bg-[#1c69d4] hover:text-white font-black text-[10px] uppercase tracking-widest transition-all text-center">
                                                                DETAIL PESANAN
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === "installments" && (
                            <section className="space-y-12">
                                <div className="flex items-center justify-between gap-4 mb-8">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">TAGIHAN & CICILAN AKTIF</h2>
                                </div>

                                {installments.length === 0 ? (
                                    <div className="text-center py-24 bg-white border border-dashed border-gray-300">
                                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-6">
                                            <CreditCard className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Belum ada tagihan cicilan aktif.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-12">
                                        {installments.map(transaction => (
                                            <div key={transaction.id} className="bg-white border-t-8 border-t-black border x-border shadow-md">
                                                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-20 h-16 bg-gray-50 flex items-center justify-center p-3">
                                                            <img src={transaction.motor?.image_path ? `/storage/${transaction.motor.image_path}` : "/assets/img/no-image.webp"} className="max-h-full max-w-full object-contain" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TRANSAKSI #{transaction.id}</p>
                                                            <h3 className="text-xl font-black tracking-tighter uppercase">{transaction.motor?.name}</h3>
                                                        </div>
                                                    </div>
                                                    <Link href={route('installments.index')} className="text-[10px] font-black uppercase tracking-widest text-[#1c69d4] hover:text-black transition-colors flex items-center gap-2">
                                                        LIHAT DETAIL CICILAN <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left">
                                                        <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                                            <tr>
                                                                <th className="px-8 py-6">KE-</th>
                                                                <th className="px-8 py-6">JATUH TEMPO</th>
                                                                <th className="px-8 py-6">TAGIHAN</th>
                                                                <th className="px-8 py-6">STATUS</th>
                                                                <th className="px-8 py-6 text-right">AKSI</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {transaction.installments.map(inst => (
                                                                <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-8 py-6">
                                                                        <span className="text-xs font-black text-black">#{inst.installment_number === 0 ? 'DP/BOOK' : inst.installment_number}</span>
                                                                    </td>
                                                                    <td className="px-8 py-6 text-xs font-bold text-gray-600 uppercase">
                                                                        {new Date(inst.due_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </td>
                                                                    <td className="px-8 py-6">
                                                                        <p className="text-sm font-black text-black leading-none">IDR {parseInt(inst.amount).toLocaleString("id-ID")}</p>
                                                                        {inst.penalty_amount > 0 && <p className="text-[9px] font-bold text-red-500 uppercase mt-1">+ Denda: IDR {parseInt(inst.penalty_amount).toLocaleString("id-ID")}</p>}
                                                                    </td>
                                                                    <td className="px-8 py-6">
                                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none border ${
                                                                            inst.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                                            inst.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                            'bg-blue-50 text-blue-700 border-blue-200'
                                                                        }`}>
                                                                            {inst.status === 'pending' ? 'BELUM BAYAR' : inst.status === 'waiting_approval' ? 'MENUNGGU KONFIRMASI' : 'LUNAS'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-8 py-6 text-right">
                                                                        {inst.status === 'paid' ? (
                                                                            <a href={route('installments.receipt', inst.id)} className="inline-flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors border border-gray-100 hover:border-black">
                                                                                <Download className="w-4 h-4" /> KUITANSI
                                                                            </a>
                                                                        ) : (
                                                                            <Link href={route('installments.index')} className="px-5 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#1c69d4] hover:text-white transition-colors">
                                                                                BAYAR
                                                                            </Link>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Icons for small details
function Download(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    );
}
