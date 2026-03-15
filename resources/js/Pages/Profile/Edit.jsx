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
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Settings
                                        size={24}
                                        className="text-blue-600"
                                    />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Pengaturan Akun
                                </h1>
                            </div>
                            <p className="text-gray-600">
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
                                        className={`p-4 rounded-lg border flex items-center gap-3 ${
                                            flash.success
                                                ? "bg-green-50 border-green-200 text-green-700"
                                                : "bg-red-50 border-red-200 text-red-700"
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
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
                                    >
                                        <ArrowLeft size={16} />
                                        Kembali
                                    </Link>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="md:col-span-3">
                                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
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
                                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <User
                                                            className="text-blue-600"
                                                            size={20}
                                                        />
                                                    </div>
                                                    Informasi Profil
                                                </h2>
                                                <UpdateProfileForm
                                                    user={user}
                                                />
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
                                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Key
                                                            className="text-blue-600"
                                                            size={20}
                                                        />
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
            className={`w-full text-left p-4 rounded-lg border transition-all ${
                active
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    <Icon size={18} />
                </div>
                <div>
                    <h3
                        className={`font-semibold text-sm ${
                            active ? "text-gray-900" : "text-gray-700"
                        }`}
                    >
                        {label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
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
                <label className="block text-sm font-semibold text-gray-900">
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
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Masukkan nama lengkap Anda"
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
                    <label className="block text-sm font-semibold text-gray-900">
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
                            className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Masukkan email Anda"
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
                    <label className="block text-sm font-semibold text-gray-900">
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
                            className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="0812..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                            className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="16 digit NIK"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                            className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Sesuai KTP"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                    Alamat Lengkap
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                         <CheckCircle size={18} />
                    </div>
                    <textarea
                        value={data.alamat}
                        onChange={(e) => setData("alamat", e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px]"
                        placeholder="Alamat lengkap sesuai KTP"
                    />
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <Save size={18} />
                    Simpan Perubahan
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
                <label className="block text-sm font-semibold text-gray-900">
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
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Masukkan password saat ini"
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
                <label className="block text-sm font-semibold text-gray-900">
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
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Minimal 8 karakter"
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
                <label className="block text-sm font-semibold text-gray-900">
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
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Ulangi password baru Anda"
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
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <Save size={18} />
                    {processing ? "Menyimpan..." : "Ubah Password"}
                </button>
            </div>
        </form>
    );
}
