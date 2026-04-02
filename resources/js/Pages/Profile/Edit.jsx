import React, { useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    User,
    Mail,
    Lock,
    Save,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    Settings,
    Key,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Edit({ user }) {
    const { auth, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <PublicLayout auth={auth} title="Pengaturan Akun">
            <div className="flex-grow pt-[104px] pb-20">
                <div className="bg-white min-h-screen">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-black text-white rounded-none border border-black">
                                    <Settings
                                        size={24}
                                    />
                                </div>
                                <h1 className="text-4xl font-black text-black tracking-widest uppercase">
                                    LENGKAPI PROFIL
                                </h1>
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                Kelola informasi profil dan keamanan akun Anda
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Flash Messages */}
                        <AnimatePresence>
                            {(flash.success || flash.error) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8"
                                >
                                    <div
                                        className={`p-4 rounded-none border flex items-center gap-3 ${
                                            flash.success
                                                ? "bg-white border-emerald-600 text-emerald-600"
                                                : "bg-white border-rose-600 text-rose-600"
                                        }`}
                                    >
                                        {flash.success ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <AlertCircle size={20} />
                                        )}
                                        <span className="font-medium">
                                            {flash.success || flash.error}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Sidebar */}
                            <div className="md:col-span-1">
                                <div className="space-y-2">
                                    <TabButton
                                        active={activeTab === "profile"}
                                        onClick={() => setActiveTab("profile")}
                                        icon={User}
                                        label="Profil"
                                        desc="Informasi Pribadi"
                                    />
                                    <TabButton
                                        active={activeTab === "password"}
                                        onClick={() => setActiveTab("password")}
                                        icon={Key}
                                        label="Keamanan"
                                        desc="Ubah Password"
                                    />
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <Link
                                        href={route("profile.show")}
                                        className="flex items-center gap-2 px-4 py-2 text-black hover:text-[#1c69d4] font-bold text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        <ArrowLeft size={14} />
                                        KEMBALI
                                    </Link>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="md:col-span-3">
                                <div className="bg-white border border-gray-300 rounded-none p-8">
                                    <AnimatePresence mode="wait">
                                        {activeTab === "profile" ? (
                                            <motion.div
                                                key="profile"
                                                initial={{
                                                    opacity: 0,
                                                    x: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    x: -20,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                }}
                                            >
                                                <h2 className="text-2xl font-black text-black uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                                                    <div className="p-2 bg-black text-white rounded-none">
                                                        <User size={20} />
                                                    </div>
                                                    Informasi Profil
                                                </h2>
                                                <UpdateProfileForm user={user} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="password"
                                                initial={{
                                                    opacity: 0,
                                                    x: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    x: -20,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                }}
                                            >
                                                <h2 className="text-2xl font-black text-black uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                                                    <div className="p-2 bg-black text-white rounded-none">
                                                        <Key size={20} />
                                                    </div>
                                                    Keamanan
                                                </h2>
                                                <UpdatePasswordForm />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function TabButton({ active, onClick, icon: Icon, label, desc }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-none border transition-all ${
                active
                    ? "bg-black border-black text-white"
                    : "bg-white border-gray-300 hover:border-black text-gray-500 hover:text-black"
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-none flex items-center justify-center transition-colors border ${
                        active
                            ? "bg-white text-black border-white"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                >
                    <Icon size={18} />
                </div>
                <div>
                    <h3
                        className={`font-black text-[10px] uppercase tracking-widest ${
                            active ? "text-white" : "text-black"
                        }`}
                    >
                        {label}
                    </h3>
                    <p className={`text-[9px] uppercase tracking-widest mt-0.5 ${active ? "text-gray-300" : "text-gray-400"}`}>{desc}</p>
                </div>
            </div>
        </button>
    );
}

function UpdateProfileForm({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        nik: user.nik || "",
        alamat: user.alamat || "",
        pekerjaan: user.occupation || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("profile.update"));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                    Nama Lengkap
                </label>
                <div className="relative">
                    <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black font-bold placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                        placeholder="NAMA SESUAI KTP"
                    />
                </div>
                {errors.name && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                        Email
                    </label>
                    <div className="relative">
                        <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black font-bold placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                            placeholder="EMAIL AKTIF ANDA"
                        />
                    </div>
                    {errors.email && (
                        <span className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.email}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                        Nomor WhatsApp
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                             <CheckCircle size={18} />
                        </div>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black font-bold placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                            placeholder="0812..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                        NIK (KTP)
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                             <CheckCircle size={18} />
                        </div>
                        <input
                            type="text"
                            value={data.nik}
                            onChange={(e) => setData("nik", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black font-bold placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                            placeholder="16 DIGIT NIK"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                        Pekerjaan
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                             <CheckCircle size={18} />
                        </div>
                        <input
                            type="text"
                            value={data.pekerjaan}
                            onChange={(e) => setData("pekerjaan", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black font-bold placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                            placeholder="NAMA PEKERJAAN"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                    Alamat Lengkap
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                         <CheckCircle size={18} />
                    </div>
                    <textarea
                        value={data.alamat}
                        onChange={(e) => setData("alamat", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black font-bold placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all min-h-[100px] font-mono"
                        placeholder="ALAMAT LENGKAP"
                    />
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-8 py-4 bg-[#1c69d4] text-white font-bold text-[10px] uppercase tracking-widest rounded-none border border-[#1c69d4] hover:bg-black hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <Save size={16} />
                    SIMPAN PERUBAHAN
                </button>
            </div>
        </form>
    );
}

function UpdatePasswordForm() {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("profile.password.update"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                    Password Saat Ini
                </label>
                <div className="relative">
                    <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                        placeholder="PASSWORD SAAT INI"
                    />
                </div>
                {errors.current_password && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.current_password}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                    Password Baru
                </label>
                <div className="relative">
                    <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                        placeholder="MIN. 8 KARAKTER"
                    />
                </div>
                {errors.password && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black">
                    Konfirmasi Password Baru
                </label>
                <div className="relative">
                    <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-10 pr-4 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-all font-mono"
                        placeholder="ULANGI PASSWORD"
                    />
                </div>
                {errors.password_confirmation && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password_confirmation}
                    </span>
                )}
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-8 py-4 bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-none border border-black hover:bg-transparent hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <Save size={16} />
                    {processing ? "MENYIMPAN..." : "UBAH PASSWORD"}
                </button>
            </div>
        </form>
    );
}
