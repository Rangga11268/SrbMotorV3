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
    Shield,
    Cpu,
    Fingerprint,
    ScanFace,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Edit({ user }) {
    const { auth, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <PublicLayout auth={auth} title="Pusat Komando">
            <div className="flex-grow pt-[104px]">
                <div className="bg-surface-dark min-h-screen pb-20 overflow-hidden relative">
                    {/* Background FX */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-4 backdrop-blur-md">
                                        <Cpu
                                            size={12}
                                            className="text-accent"
                                        />
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">
                                            Akses Sistem Diizinkan
                                        </span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-display font-black text-white leading-none">
                                        PUSAT{" "}
                                        <span className="text-accent text-glow">
                                            KOMANDO
                                        </span>
                                    </h1>
                                    <p className="text-white/40 mt-2 font-mono text-sm max-w-md">
                                        Kelola protokol identitas dan kunci
                                        keamanan akun Anda.
                                    </p>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/40 transition-all duration-500"></div>
                                    <div className="relative w-24 h-24 rounded-full border border-white/10 bg-black/50 overflow-hidden group-hover:border-accent transition-colors">
                                        <div className="absolute inset-0 flex items-center justify-center text-white/20 font-display font-bold text-4xl group-hover:text-accent transition-colors">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="absolute inset-0 bg-[url('/assets/img/grid.svg')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-black text-[10px] font-bold rounded-full uppercase tracking-widest whitespace-nowrap">
                                        Online
                                    </div>
                                </div>
                            </div>

                            {/* Flash Messages */}
                            <AnimatePresence>
                                {(flash.success || flash.error) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-8"
                                    >
                                        <div
                                            className={`p-4 rounded-xl border flex items-center gap-3 font-mono text-sm ${
                                                flash.success
                                                    ? "bg-accent/10 border-accent/20 text-accent"
                                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                                            }`}
                                        >
                                            {flash.success ? (
                                                <CheckCircle size={18} />
                                            ) : (
                                                <AlertCircle size={18} />
                                            )}
                                            <span>
                                                {flash.success || flash.error}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main Interface */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Sidebar / Tabs */}
                                <div className="lg:col-span-4 space-y-4">
                                    <TabButton
                                        active={activeTab === "profile"}
                                        onClick={() => setActiveTab("profile")}
                                        icon={ScanFace}
                                        label="PROTOKOL IDENTITAS"
                                        desc="Info Personal & Kontak"
                                    />
                                    <TabButton
                                        active={activeTab === "password"}
                                        onClick={() => setActiveTab("password")}
                                        icon={Fingerprint}
                                        label="KUNCI KEAMANAN"
                                        desc="Manajemen Password"
                                    />

                                    <div className="pt-8 mt-8 border-t border-white/5">
                                        <Link
                                            href={route("profile.show")}
                                            className="flex items-center gap-3 px-6 py-4 rounded-xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors group"
                                        >
                                            <ArrowLeft
                                                size={18}
                                                className="group-hover:-translate-x-1 transition-transform"
                                            />
                                            <span className="font-bold text-xs tracking-widest uppercase">
                                                Akhiri Sesi
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="lg:col-span-8">
                                    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 min-h-[400px] relative overflow-hidden">
                                        {/* Scan Line Animation */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-20 animate-[scan_3s_linear_infinite]"></div>

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
                                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                        <Activity
                                                            size={18}
                                                            className="text-accent"
                                                        />
                                                        KONFIGURASI IDENTITAS
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
                                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                        <Shield
                                                            size={18}
                                                            className="text-accent"
                                                        />
                                                        PEMBARUAN KEAMANAN
                                                    </h2>
                                                    <UpdatePasswordForm />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
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
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                active
                    ? "bg-accent/10 border-accent/50 shadow-[0_0_20px_rgba(190,242,100,0.1)]"
                    : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
            }`}
        >
            <div className="flex items-center gap-4 relative z-10">
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        active
                            ? "bg-accent text-black"
                            : "bg-white/5 text-white/50 group-hover:text-white"
                    }`}
                >
                    <Icon size={20} />
                </div>
                <div>
                    <h3
                        className={`font-bold text-sm tracking-widest ${
                            active
                                ? "text-white"
                                : "text-white/70 group-hover:text-white"
                        }`}
                    >
                        {label}
                    </h3>
                    <p className="text-[10px] text-white/30 font-mono mt-0.5 uppercase">
                        {desc}
                    </p>
                </div>
            </div>
            {active && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent"></div>
            )}
        </button>
    );
}

function UpdateProfileForm({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("profile.update"));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
                    Nama Tampilan
                </label>
                <div className="relative group">
                    <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm"
                        placeholder="MASUKKAN NAMA LENGKAP"
                    />
                </div>
                {errors.name && (
                    <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {errors.name}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
                    Alamat Komunikasi
                </label>
                <div className="relative group">
                    <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                        size={18}
                    />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm"
                        placeholder="MASUKKAN ALAMAT EMAIL"
                    />
                </div>
                {errors.email && (
                    <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {errors.email}
                    </span>
                )}
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-accent transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {processing ? (
                        <Activity className="animate-spin" size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    SIMPAN KONFIGURASI
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
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
                    Kunci Protokol Saat Ini
                </label>
                <div className="relative group">
                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm"
                        placeholder="••••••••"
                    />
                </div>
                {errors.current_password && (
                    <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {errors.current_password}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
                    Kunci Protokol Baru
                </label>
                <div className="relative group">
                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm"
                        placeholder="MIN 8 KARAKTER"
                    />
                </div>
                {errors.password && (
                    <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {errors.password}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
                    Konfirmasi Kunci Protokol
                </label>
                <div className="relative group">
                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm"
                        placeholder="ULANGI PASSWORD BARU"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-accent transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {processing ? (
                        <Activity className="animate-spin" size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    PERBARUI KEAMANAN
                </button>
            </div>
        </form>
    );
}
