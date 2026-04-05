import React from "react";
import { usePage, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion } from "framer-motion";
import {
    Activity,
    ShoppingBag,
    ShieldCheck,
    CreditCard,
    User,
    Mail,
    Phone,
    ChevronRight,
    LogOut,
    Fingerprint,
    Edit2,
    CheckCircle,
    AlertTriangle,
    Calendar,
    Hash,
    Shield,
    Settings,
    ArrowLeft,
    ArrowRight,
    MapPin,
    Briefcase,
    Star,
} from "lucide-react";

export default function Show({ user, dashboard }) {
    const { auth } = usePage().props;
    const isCurrentUser = auth.user && auth.user.id === user.id;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <PublicLayout auth={auth} title={`Profil Saya - SRB Motors`}>
            {/* BACK BUTTON */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>

            <div className="flex-grow pt-[104px] pb-20">
                {/* HEADER / COVER AREA */}
                <div className="bg-gray-50 pt-16 pb-32 relative border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative"
                            >
                                <div className="w-40 h-40 rounded-none bg-white p-2 border-4 border-black overflow-hidden relative">
                                    <div className="w-full h-full rounded-none bg-gray-100 border border-gray-300 flex items-center justify-center text-5xl font-black text-black uppercase overflow-hidden">
                                        {user.profile_photo_path ? (
                                            <img
                                                src={
                                                    user.profile_photo_path.startsWith("http")
                                                        ? user.profile_photo_path
                                                        : `/storage/${user.profile_photo_path}`
                                                }
                                                alt={user.name}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = user.name.charAt(0);
                                                }}
                                            />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-[#1c69d4] text-white font-bold text-[10px] px-6 py-2 rounded-none border-2 border-black uppercase tracking-widest">
                                    {user.role}
                                </div>
                            </motion.div>

                            <div className="text-center md:text-left space-y-2 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
                                    {user.name}
                                </h1>
                                <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2 text-lg">
                                    <Mail className="w-5 h-5 text-blue-600" />{" "}
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN - NAV CARDS */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-none border-2 border-gray-200 p-6 space-y-2">
                                <Link
                                    href={route("profile.show")}
                                    className="flex items-center gap-4 p-4 rounded-none bg-black text-white transition-all"
                                >
                                    <User className="w-5 h-5 shrink-0" />
                                    <span className="font-bold uppercase tracking-widest text-[10px]">
                                        Informasi Profil
                                    </span>
                                    <span className="w-4 h-4 ml-auto">
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                </Link>
                                <Link
                                    href={route("motors.user-transactions")}
                                    className="flex items-center gap-4 p-4 rounded-none text-gray-400 border border-transparent hover:border-gray-300 hover:text-black transition-all group"
                                >
                                    <ShoppingBag className="w-5 h-5 shrink-0 group-hover:text-black" />
                                    <span className="font-bold uppercase tracking-widest text-[10px]">
                                        Riwayat Pesanan
                                    </span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link
                                    href={route("installments.index")}
                                    className="flex items-center gap-4 p-4 rounded-none text-gray-400 border border-transparent hover:border-gray-300 hover:text-black transition-all group"
                                >
                                    <CreditCard className="w-5 h-5 shrink-0 group-hover:text-black" />
                                    <span className="font-bold uppercase tracking-widest text-[10px]">
                                        Cicilan Saya
                                    </span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </div>

                            <div className="bg-white rounded-none border border-gray-300 p-8 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                    Otoritas Sesi
                                </p>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full h-14 rounded-none border border-rose-600 hover:bg-rose-600 text-rose-600 hover:text-white font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> KELUAR SESI
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - MAIN DATA & DASHBOARD */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* DASHBOARD SUMMARY CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* ORDER STATUS CARD */}
                                <Link 
                                    href={route("motors.user-transactions")}
                                    className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between hover:border-black transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-gray-100 text-gray-600">Terakhir</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status Pesanan</p>
                                        <p className="text-sm font-black text-black uppercase tracking-tight truncate">
                                            {dashboard.latest_transaction ? dashboard.latest_transaction.status.replace(/_/g, " ") : "Belum Ada"}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-[#1c69d4] uppercase tracking-widest">
                                        LIHAT RIWAYAT <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* INSTALLMENT CARD */}
                                <Link 
                                    href={route("installments.index")}
                                    className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between hover:border-black transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-amber-50 text-amber-600">Cicilan</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jatuh Tempo</p>
                                        <p className="text-sm font-black text-black uppercase tracking-tight">
                                            {dashboard.next_installment 
                                                ? new Date(dashboard.next_installment.due_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })
                                                : "Lunas / -"
                                            }
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-[#1c69d4] uppercase tracking-widest">
                                        BAYAR CICILAN <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* SERVICE CARD */}
                                <Link 
                                    href={route("services.index")}
                                    className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between hover:border-black transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <Calendar className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-blue-50 text-[#1c69d4]">Servis</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jadwal Booking</p>
                                        <p className="text-sm font-black text-black uppercase tracking-tight">
                                            {dashboard.upcoming_service 
                                                ? new Date(dashboard.upcoming_service.service_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })
                                                : "Belum Booking"
                                            }
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-[#1c69d4] uppercase tracking-widest">
                                        CEK JADWAL <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>


                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-none border border-gray-300 overflow-hidden"
                            >
                                <div className="p-8 md:p-12 space-y-12">
                                    <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                                        <h2 className="text-2xl font-black text-black flex items-center gap-3 tracking-widest uppercase">
                                            <Fingerprint className="w-6 h-6 text-black" />{" "}
                                            DATA AKUN
                                        </h2>
                                        {isCurrentUser && (
                                            <Link href={route("profile.edit")}>
                                                <button className="flex items-center gap-2 text-[10px] bg-black text-white hover:bg-transparent hover:text-black border border-black px-4 py-2 font-bold uppercase tracking-widest transition-colors rounded-none">
                                                    <Edit2 className="w-3 h-3" />{" "}
                                                    EDIT PROFIL
                                                </button>
                                            </Link>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Alamat Email
                                            </p>
                                            <p className="text-xl font-bold text-black break-all">
                                                {user.email}
                                            </p>
                                            {user.email_verified_at ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-600 rounded-none text-[9px] font-bold border border-emerald-600 uppercase tracking-widest">
                                                    <CheckCircle className="w-3 h-3" />{" "}
                                                    TERVERIFIKASI
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-amber-600 rounded-none text-[9px] font-bold border border-amber-600 uppercase tracking-widest">
                                                    <AlertTriangle className="w-3 h-3" />{" "}
                                                    BELUM TERVERIFIKASI
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Member Sejak
                                            </p>
                                            <p className="text-xl font-bold text-black flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400" />{" "}
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Identitas Sistem (UUID)
                                            </p>
                                            <p className="text-xl font-mono font-bold text-black flex items-center gap-3">
                                                <Hash className="w-5 h-5 text-gray-400" />{" "}
                                                {String(user.id).padStart(
                                                    6,
                                                    "0",
                                                )}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Level Akses
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-gray-400" />
                                                <p className="text-xl font-bold text-black uppercase">
                                                    {user.role === "admin"
                                                        ? "Administrator"
                                                        : "Public User"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Nomor WhatsApp
                                            </p>
                                            <p className="text-xl font-bold text-black flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-gray-400" />{" "}
                                                {user.phone || "-"}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                NIK (KTP)
                                            </p>
                                            <p className="text-xl font-bold text-black flex items-center gap-3">
                                                <Fingerprint className="w-5 h-5 text-gray-400" />{" "}
                                                {user.nik || "-"}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Pekerjaan
                                            </p>
                                            <p className="text-xl font-bold text-black flex items-center gap-3">
                                                <Briefcase className="w-5 h-5 text-gray-400" />{" "}
                                                {user.occupation || "-"}
                                            </p>
                                        </div>

                                        <div className="space-y-3 md:col-span-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Alamat Lengkap (KTP)
                                            </p>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                                                <p className="text-xl font-bold text-black">
                                                    {user.alamat || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-gray-200 grid md:grid-cols-2 gap-8">
                                        <div className="p-8 rounded-none bg-gray-50 border border-gray-300 space-y-4">
                                            <div className="w-12 h-12 rounded-none bg-white border border-gray-300 flex items-center justify-center text-black">
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-black uppercase text-[10px] tracking-widest">
                                                Keamanan Akun
                                            </h3>
                                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                                Pastikan password Anda kuat dan
                                                rutin diperbarui. SRB Motors
                                                tidak pernah meminta password
                                                Anda melalui media apapun.
                                            </p>
                                        </div>
                                        <div className="p-8 rounded-none bg-gray-50 border border-gray-300 space-y-4">
                                            <div className="w-12 h-12 rounded-none bg-white border border-gray-300 flex items-center justify-center text-black">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-black uppercase text-[10px] tracking-widest">
                                                Pemesanan Mudah
                                            </h3>
                                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                                Pantau status pengiriman dan
                                                verifikasi unit dengan nyaman 
                                                melalui panel riwayat
                                                pesanan Anda.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
