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
} from "lucide-react";

export default function Show({ user }) {
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
                                <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl overflow-hidden border border-gray-100">
                                    <div className="w-full h-full rounded-[2rem] bg-gray-50 flex items-center justify-center text-5xl font-black text-slate-900 uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white font-black text-[10px] px-4 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-widest">
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
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 space-y-2 border border-white">
                                <Link
                                    href={route("profile.show")}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 text-primary border border-primary/10 transition-all"
                                >
                                    <User className="w-5 h-5 shrink-0" />
                                    <span className="font-black uppercase tracking-widest text-sm">
                                        Informasi Profil
                                    </span>
                                    <span className="w-4 h-4 ml-auto">
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                </Link>
                                <Link
                                    href={route("motors.user-transactions")}
                                    className="flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                                >
                                    <ShoppingBag className="w-5 h-5 shrink-0 group-hover:text-primary" />
                                    <span className="font-black uppercase tracking-widest text-sm">
                                        Riwayat Pesanan
                                    </span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link
                                    href={route("installments.index")}
                                    className="flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                                >
                                    <CreditCard className="w-5 h-5 shrink-0 group-hover:text-primary" />
                                    <span className="font-black uppercase tracking-widest text-sm">
                                        Cicilan Saya
                                    </span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 border border-white text-center">
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-6">
                                    Otoritas Sesi
                                </p>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full h-14 rounded-2xl border-2 border-red-50 text-red-500 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-100 transition-all"
                                >
                                    <LogOut className="w-5 h-5" /> Keluar Sesi
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - MAIN DATA */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white overflow-hidden"
                            >
                                <div className="p-8 md:p-12 space-y-12">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                            <Fingerprint className="w-8 h-8 text-primary" />{" "}
                                            DATA AKUN
                                        </h2>
                                        {isCurrentUser && (
                                            <Link href={route("profile.edit")}>
                                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                                                    <Edit2 className="w-4 h-4" />{" "}
                                                    Edit Profil
                                                </button>
                                            </Link>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                Alamat Email
                                            </p>
                                            <p className="text-xl font-black text-gray-900 break-all">
                                                {user.email}
                                            </p>
                                            {user.email_verified_at ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-500 rounded-full text-[9px] font-black border border-green-100 uppercase tracking-widest">
                                                    <CheckCircle className="w-3 h-3" />{" "}
                                                    Terverifikasi
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-500 rounded-full text-[9px] font-black border border-yellow-100 uppercase tracking-widest">
                                                    <AlertTriangle className="w-3 h-3" />{" "}
                                                    Belum Terverifikasi
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                Member Sejak
                                            </p>
                                            <p className="text-xl font-black text-gray-900 flex items-center gap-3">
                                                <Calendar className="w-6 h-6 text-gray-200" />{" "}
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                Identitas Sistem (UUID)
                                            </p>
                                            <p className="text-xl font-mono font-black text-gray-900 flex items-center gap-3">
                                                <Hash className="w-6 h-6 text-gray-200" />{" "}
                                                {String(user.id).padStart(
                                                    6,
                                                    "0",
                                                )}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                Level Akses
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-6 h-6 text-gray-200" />
                                                <p className="text-xl font-black text-gray-900 uppercase">
                                                    {user.role === "admin"
                                                        ? "Administrator"
                                                        : "Public User"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-gray-50 grid md:grid-cols-2 gap-8">
                                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm">
                                                <Settings className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">
                                                Keamanan Akun
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                                Pastikan password Anda kuat dan
                                                rutin diperbarui. SRB Motors
                                                tidak pernah meminta password
                                                Anda melalui media apapun.
                                            </p>
                                        </div>
                                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm">
                                                <ShoppingBag className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">
                                                Status Transaksi
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                                Anda memiliki 0 pesanan aktif.
                                                Pantau status pengiriman dan
                                                verifikasi unit di menu riwayat
                                                pesanan.
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
