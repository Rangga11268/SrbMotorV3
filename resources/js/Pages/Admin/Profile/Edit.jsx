import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Save, User, Lock, Key, Shield, ShieldCheck, ChevronRight } from "lucide-react";

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitProfile = (e) => {
        e.preventDefault();
        put(route("admin.profile.update"));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        putPassword(route("admin.profile.password.update"), {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AdminLayout title="KONFIGURASI PROFIL">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Control Panel */}
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h2 className="text-slate-400 font-mono uppercase tracking-widest text-[10px] mb-2 font-bold">
                            MODUL KEAMANAN & PERSONALISASI
                        </h2>
                        <h1 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-10 bg-primary rounded-full"></span>
                            PROFIL ADMIN
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Information Section */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors"></div>

                        <div className="p-8 border-b border-slate-50 flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-primary/20">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2">
                                    INFORMASI DASAR
                                    <ShieldCheck
                                        size={20}
                                        className="text-primary"
                                    />
                                </h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    DATA IDENTITAS SISTEM
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={submitProfile}
                            className="p-8 space-y-8"
                        >
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    NAMA LENGKAP
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm font-bold text-slate-900 placeholder-slate-300 transition-all outline-none"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    ALAMAT EMAIL
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary transition-colors">
                                        <span className="text-xl font-black font-mono">
                                            @
                                        </span>
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm font-bold text-slate-900 placeholder-slate-300 transition-all outline-none"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black font-display uppercase tracking-widest transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {processing
                                        ? "MENYIMPAN..."
                                        : "SIMPAN PERUBAHAN"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-red-500/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-red-500/10 transition-colors"></div>

                        <div className="p-8 border-b border-slate-50 flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-black text-3xl">
                                <Lock size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2">
                                    KEAMANAN AKUN
                                    <Shield
                                        size={20}
                                        className="text-red-500"
                                    />
                                </h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    ENKRIPSI DATA KATA SANDI
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={submitPassword}
                            className="p-8 space-y-8"
                        >
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    PASSWORD SAAT INI
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-red-500 transition-colors">
                                        <Key size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "current_password",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-sm font-bold text-slate-900 placeholder-slate-300 transition-all outline-none"
                                    />
                                </div>
                                {passwordErrors.current_password && (
                                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                        {passwordErrors.current_password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    PASSWORD BARU
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-red-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-sm font-bold text-slate-900 placeholder-slate-300 transition-all outline-none"
                                    />
                                </div>
                                {passwordErrors.password && (
                                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                        {passwordErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    KONFIRMASI PASSWORD BARU
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-red-500 transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={
                                            passwordData.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-sm font-bold text-slate-900 placeholder-slate-300 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black font-display uppercase tracking-widest transition-all shadow-lg hover:shadow-red-500/30 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Key size={20} />
                                    {passwordProcessing
                                        ? "MEMPROSES..."
                                        : "UPDATE SECURITY"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="bg-[#111111] rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-1000"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-black font-display tracking-tight uppercase">
                                    INFORMASI AKUN & AKSES
                                </h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    METADATA ADMINISTRATOR SISTEM
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">TINGKAT AKSES</p>
                                    <p className="text-sm font-black text-primary uppercase">FULL ADMINISTRATOR</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">STATUS AKUN</p>
                                    <p className="text-sm font-black text-green-400 uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        AKTIF & TERVERIFIKASI
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">BERGABUNG SEJAK</p>
                                    <p className="text-sm font-black uppercase italic">
                                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">VERSI SISTEM</p>
                            <div className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary font-black text-xs tracking-widest">
                                SRB MOTOR V2.4.0
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 opacity-60">
                        <p className="text-[10px] text-slate-500 font-medium max-w-lg">
                            * Halaman ini hanya dapat diakses oleh akun dengan otorisasi Administrator. Pastikan Anda melakukan logout setelah selesai menggunakan panel admin pada perangkat publik.
                        </p>
                        <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group/link">
                            LIHAT FRONT-END
                            < ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
