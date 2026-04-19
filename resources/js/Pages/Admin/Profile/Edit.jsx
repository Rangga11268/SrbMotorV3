import React from "react";
import { Link, useForm, usePage, Head } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import { 
    Save, User, Lock, Key, Shield, ShieldCheck, 
    ChevronRight, Mail, Calendar, Activity, 
    CheckCircle2, AlertCircle, Info
} from "lucide-react";

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
        <MetronicAdminLayout title="Pengaturan Profil">
            <div className="max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Profil Saya</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola informasi identitas dan keamanan akun administrator Anda.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Navigation/Summary */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                            <div className="px-6 pb-6 relative">
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-2xl bg-white p-1 -mt-12 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-3xl border border-indigo-100 uppercase">
                                            {user.name.charAt(0)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <h3 className="text-lg font-black text-gray-800">{user.name}</h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                                        <ShieldCheck size={12} /> {user.role === 'owner' ? 'Owner Account' : 'Administrator'}
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-xs">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Terdaftar</p>
                                            <p className="text-xs font-bold text-gray-700">
                                                {new Date(user.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-xs">
                                            <Activity size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status Keamanan</p>
                                            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Aktif & Aman
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Notice */}
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                            <div className="flex gap-3">
                                <Info size={18} className="text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">Catatan Penting</h4>
                                    <p className="text-[11px] text-amber-700 leading-relaxed">
                                        Setiap perubahan pada nama atau email akan langsung berpengaruh pada sesi login Anda selanjutnya. Gunakan password yang kuat (minimal 8 karakter kombinasi huruf & angka).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Profile Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-800">Informasi Dasar</h3>
                                        <p className="text-xs text-gray-400">Update data identitas profil Anda.</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submitProfile} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest ml-1">
                                            Nama Lengkap
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <User size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder-gray-400"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1">
                                                <AlertCircle size={10} /> {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest ml-1">
                                            Alamat Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Mail size={16} />
                                            </div>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder-gray-400"
                                                placeholder="nama@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1">
                                                <AlertCircle size={10} /> {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {processing ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-800">Keamanan Kata Sandi</h3>
                                        <p className="text-xs text-gray-400">Ganti password secara berkala untuk menjaga keamanan akun.</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submitPassword} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest ml-1">
                                        Password Saat Ini
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Key size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData("current_password", e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold placeholder-gray-400"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {passwordErrors.current_password && (
                                        <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1">
                                            <AlertCircle size={10} /> {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest ml-1">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData("password", e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold placeholder-gray-400"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {passwordErrors.password && (
                                            <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1">
                                                <AlertCircle size={10} /> {passwordErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest ml-1">
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Shield size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData("password_confirmation", e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold placeholder-gray-400"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        <Key size={16} />
                                        {passwordProcessing ? "MEMPROSES..." : "UPDATE SECURITY"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400 text-center md:text-left max-w-lg">
                        SRB Motor Admin Panel &copy; {new Date().getFullYear()} - Versi 2.4.0. Dikembangkan untuk efisiensi manajemen operasional diler.
                    </p>
                    <Link href="/" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-2 group/link">
                        Kembali ke Website
                        <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </MetronicAdminLayout>
    );
}
