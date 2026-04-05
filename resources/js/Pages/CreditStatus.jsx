import React from "react";
import { Link, Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    FileText, 
    Calendar, 
    User, 
    MessageCircle,
    Info,
    Bike,
    TrendingUp,
    ShieldCheck,
    CreditCard,
    ArrowRight,
    Search,
    ChevronRight,
    Printer,
    Download
} from "lucide-react";

export default function CreditStatus({ auth, credit, transaction }) {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    const statuses = {
        pengajuan_masuk: {
            label: "Pengajuan Diterima",
            color: "bg-blue-600",
            textColor: "text-blue-700",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
            icon: <FileText className="w-5 h-5" />,
            description: "Pengajuan kredit Anda telah kami terima dan akan segera diproses.",
        },
        menunggu_persetujuan: {
            label: "Verifikasi Dokumen",
            color: "bg-amber-500",
            textColor: "text-amber-700",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100",
            icon: <Clock className="w-5 h-5" />,
            description: "Tim verifikator kami sedang meninjau kelengkapan dokumen yang Anda unggah.",
        },
        data_tidak_valid: {
            label: "Dokumen Perlu Diperbaiki",
            color: "bg-red-600",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
            borderColor: "border-red-100",
            icon: <AlertCircle className="w-5 h-5" />,
            description: "Terdapat dokumen yang kurang jelas atau tidak valid. Silakan periksa catatan perbaikan.",
        },
        dokumen_ditolak: {
            label: "Dokumen Ditolak",
            color: "bg-red-600",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
            borderColor: "border-red-100",
            icon: <AlertCircle className="w-5 h-5" />,
            description: "Dokumen yang Anda unggah ditolak. Silakan cek catatan admin dan perbaiki dokumen tersebut.",
        },

        dikirim_ke_surveyor: {
            label: "Persiapan Survey",
            color: "bg-indigo-600",
            textColor: "text-indigo-700",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100",
            icon: <User className="w-5 h-5" />,
            description: "Data Anda telah diteruskan ke tim surveyor leasing untuk penjadwalan survey.",
        },
        jadwal_survey: {
            label: "Jadwal Survey Dibuat",
            color: "bg-[#1c69d4]",
            textColor: "text-[#1c69d4]",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
            icon: <Calendar className="w-5 h-5" />,
            description: "Jadwal survey telah ditentukan. Surveyor akan menghubungi Anda untuk konfirmasi lokasi.",
        },
        disetujui: {
            label: "Pengajuan Disetujui",
            color: "bg-emerald-600",
            textColor: "text-emerald-700",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100",
            icon: <CheckCircle2 className="w-5 h-5" />,
            description: "Selamat! Pengajuan kredit Anda telah disetujui. Silakan selesaikan pembayaran DP.",
        },
        ditolak: {
            label: "Pengajuan Ditolak",
            color: "bg-gray-900",
            textColor: "text-gray-900",
            bgColor: "bg-gray-100",
            borderColor: "border-gray-200",
            icon: <AlertCircle className="w-5 h-5" />,
            description: "Mohon maaf, saat ini pengajuan kredit Anda belum dapat kami setujui.",
        },
    };

    const currentStatus = statuses[credit.status] || statuses.pengajuan_masuk;

    // Define main stages for the premium stepper
    const steps = [
        { 
            id: 1, 
            name: "Pengajuan", 
            description: "Dokumen Terkirim",
            isCompleted: true,
            isActive: credit.status === 'pengajuan_masuk'
        },
        { 
            id: 2, 
            name: "Verifikasi", 
            description: "Review Dokumen",
            isCompleted: !['pengajuan_masuk'].includes(credit.status),
            isActive: credit.status === 'menunggu_persetujuan' || credit.status === 'data_tidak_valid'
        },
        { 
            id: 3, 
            name: "Survey", 
            description: "Kunjungan Lapangan",
            isCompleted: ['disetujui', 'selesai', 'dp_dibayar', 'ditolak'].includes(credit.status),
            isActive: ['dikirim_ke_surveyor', 'jadwal_survey'].includes(credit.status)
        },
        { 
            id: 4, 
            name: "Persetujuan", 
            description: "Final Status",
            isCompleted: ['selesai', 'dp_dibayar'].includes(credit.status),
            isActive: ['disetujui', 'ditolak'].includes(credit.status)
        }
    ];

    const handleWhatsAppAdmin = () => {
        const phone = "6289520000000"; // Dynamic in future
        const text = `Halo Admin SRB Motor, saya ingin menanyakan status pengajuan kredit saya.\n\nID Transaksi: #${transaction.id}\nUnit: ${transaction.motor?.name}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <PublicLayout auth={auth} title="Status Kredit">
            <div className="flex-grow pt-[104px] pb-24 bg-white">
                
                {/* HERO SECTION - BMW BLACK STYLE */}
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <Link href={route("motors.user-transactions")} className="hover:text-white transition-colors">RIWAYAT</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">STATUS KREDIT</span>
                        </nav>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                                    STATUS <br />
                                    <span className="text-[#1c69d4]">PENGAJUAN</span>
                                </h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-none ${currentStatus.color.replace('bg-', 'bg-opacity-80 bg-')}`}></div>
                                        <span className="text-sm font-black uppercase tracking-widest">{currentStatus.label}</span>
                                    </div>
                                    <div className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase h-full flex items-center">
                                        REF: #{transaction.id}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-end gap-2 text-right">
                                <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">UPDATE TERAKHIR</p>
                                <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                    {new Date(credit.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                    <div className="grid lg:grid-cols-3 gap-12">
                        
                        {/* LEFT COLUMN: PROGRESS STEPPER & DETAILS */}
                        <div className="lg:col-span-2 space-y-12">
                            
                            {/* PREMIUM STEPPER CARD */}
                            <div className="bg-white border-x border-b border-gray-200 p-8 sm:p-12 shadow-2xl">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {steps.map((step, i) => (
                                        <div key={step.id} className="relative flex flex-col items-center">
                                            {/* Connector Line */}
                                            {i < steps.length - 1 && (
                                                <div className="hidden md:block absolute top-[25px] left-[calc(50%+30px)] w-[calc(100%-60px)] h-px bg-gray-100 overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-[#1c69d4] transition-all duration-1000 ${step.isCompleted ? 'w-full' : 'w-0'}`}
                                                    ></div>
                                                </div>
                                            )}
                                            
                                            {/* Icon/Number */}
                                            <div className={`w-[50px] h-[50px] flex items-center justify-center border-2 mb-4 transition-all duration-500 ${
                                                step.isCompleted 
                                                    ? "bg-[#1c69d4] border-[#1c69d4] text-white" 
                                                    : step.isActive 
                                                        ? "bg-white border-[#1c69d4] text-[#1c69d4] ring-8 ring-blue-50" 
                                                        : "bg-white border-gray-200 text-gray-300"
                                            }`}>
                                                {step.isCompleted ? <CheckCircle2 size={24} strokeWidth={3} /> : <span className="text-base font-black tracking-tighter">{step.id}</span>}
                                            </div>
                                            
                                            {/* Label */}
                                            <div className="text-center">
                                                <h4 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${step.isActive ? "text-[#1c69d4]" : "text-gray-900"}`}>
                                                    {step.name}
                                                </h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 pt-12 border-t border-gray-100">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className={`p-5 rounded-none ${currentStatus.color} text-white shrink-0`}>
                                            <Info size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-3 leading-none">
                                                ESTIMASI & <span className="text-[#1c69d4]">INFORMASI</span>
                                            </h3>
                                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                                {currentStatus.description}
                                            </p>
                                            
                                            {/* ACTION PANEL */}
                                            <div className="bg-gray-50 p-6 border border-gray-200">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">CATATAN TIM VERIFIKASI</p>
                                                <p className="text-gray-800 font-bold italic border-l-4 border-[#1c69d4] pl-5 leading-snug">
                                                    "{credit.verification_notes || "Verifikasi sedang berlangsung. Mohon pastikan dokumen Anda asli dan jelas (tidak buram)."}"
                                                </p>
                                                
                                                <div className="mt-8 flex flex-wrap gap-4">
                                                    {["pengajuan_masuk", "data_tidak_valid", "dokumen_ditolak"].includes(credit.status) && (
                                                        <Link 
                                                            href={route("motors.manage-documents", transaction.id)}
                                                            className="px-8 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                                        >
                                                            PERBAIKI DOKUMEN SEKARANG
                                                        </Link>
                                                    )}

                                                    {credit.status === 'disetujui' && (
                                                        <Link 
                                                            href={route("motors.transaction.show", transaction.id)}
                                                            className="px-10 py-3 bg-[#1c69d4] text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                                                        >
                                                            LANJUT PEMBAYARAN DP
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SURVEY SCHEDULE - PREMIUM BLACK CARD */}
                            {credit.status === 'jadwal_survey' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-black text-white p-10 sm:p-14 relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[#1c69d4] opacity-0 group-hover:opacity-5 transition-opacity duration-1000"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row gap-12">
                                        <div className="shrink-0 flex flex-col items-center justify-center p-8 border border-gray-800 min-w-[200px]">
                                            <Calendar className="w-16 h-16 text-[#1c69d4] mb-6" />
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">TANGGAL</p>
                                            <p className="text-3xl font-black text-white tracking-tighter leading-none">
                                                {new Date(credit.survey_scheduled_date).getDate()}
                                            </p>
                                            <p className="text-xs font-black uppercase tracking-widest">
                                                {new Date(credit.survey_scheduled_date).toLocaleDateString("id-ID", { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex-1 space-y-8">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none text-[#1c69d4]">
                                                    JADWAL SURVEY <br />
                                                    <span className="text-white">TELAH DISIAPKAN</span>
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                                    Surveyor kami akan melakukan kunjungan ke alamat Anda untuk melakukan pengecekan data terakhir. Harap pastikan Anda berada di lokasi pada waktu yang telah ditentukan.
                                                </p>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-gray-800">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">WAKTU KUNJUNGAN</p>
                                                    <p className="text-xl font-black uppercase tracking-widest">PUKUL {credit.survey_scheduled_time}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">PETUGAS SURVEYOR</p>
                                                    <p className="text-xl font-black uppercase tracking-tighter">{credit.surveyor_name}</p>
                                                    <p className="text-sm font-bold text-[#1c69d4]">{credit.surveyor_phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: SIDEBAR INFO */}
                        <div className="space-y-12">
                            
                            {/* MOTOR SUMMARY CARD */}
                            <div className="p-10 bg-white border border-gray-200">
                                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-6 mb-8 group overflow-hidden">
                                    <img 
                                        src={`/storage/${transaction.motor?.image_path}`} 
                                        alt={transaction.motor?.name}
                                        className="max-h-full w-auto object-contain transition-all duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-1">{transaction.motor?.name}</h3>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">{transaction.motor?.brand} • {transaction.motor?.type}</p>
                                
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">HARGA OTR</span>
                                        <span className="text-lg font-black text-black leading-none">{formatCurrency(transaction.motor?.price)}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                        <div className="text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1c69d4] block mb-1">UANG MUKA</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">ESTIMASI DP</span>
                                        </div>
                                        <span className="text-lg font-black text-black leading-none">{formatCurrency(credit.dp_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">TENOR</span>
                                        <span className="text-sm font-black text-black uppercase tracking-widest">{credit.tenor} BULAN</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-5 -mx-5 -mb-5">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1c69d4]">CICILAN</span>
                                        <span className="text-2xl font-black text-black tracking-tighter">{formatCurrency(credit.monthly_installment)}/BLN</span>
                                    </div>
                                </div>
                            </div>

                            {/* SUPPORT CARD */}
                            <div className="bg-[#1c69d4] text-white p-10 relative overflow-hidden group">
                                <div className="absolute -bottom-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <ShieldCheck size={180} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">BUTUH <br />BANTUAN?</h4>
                                    <p className="text-xs font-bold text-blue-100 opacity-80 uppercase tracking-widest mb-10 leading-relaxed">
                                        Hubungi tim verifikasi kami melalui WhatsApp jika ada kendala dalam pengunggahan atau jadwal survey.
                                    </p>
                                    <button 
                                        onClick={handleWhatsAppAdmin}
                                        className="w-full bg-black text-white px-6 py-5 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        <MessageCircle size={20} /> HUBUNGI ADMIN
                                    </button>
                                </div>
                            </div>

                            {/* QUICK ACTIONS */}
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => window.print()}
                                    className="flex items-center justify-center gap-2 py-4 border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:border-black transition-all"
                                >
                                    <Printer size={16} /> PRINT
                                </button>
                                <Link 
                                    href={route("motors.index")}
                                    className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-200 transition-all"
                                >
                                    <TrendingUp size={16} /> KATALOG
                                </Link>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </PublicLayout>
    );
}
