import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, ArrowLeft } from "lucide-react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.update"));
    };

    return (
        <>
            <Head title="Setel Ulang Kata Sandi" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* Main Card */}
                    <div className="bg-white rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Header/Icon Section */}
                        <div className="relative bg-gray-50 border-b-2 border-black p-8 md:p-12 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center mb-4">
                                <Lock className="w-10 h-10 text-black" />
                            </div>
                            <div className="text-center space-y-3">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-none uppercase tracking-tight">
                                    Setel Ulang Sandi
                                </h1>
                                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                    Masukkan kata sandi baru Anda di bawah ini
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-8 md:p-10 space-y-6">
                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                                        Alamat Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            placeholder="NAMA@EMAIL.COM"
                                            className="block w-full bg-white border-2 border-black py-4 pl-12 pr-4 text-xs font-bold text-[#262626] placeholder:text-[#bbbbbb] focus:ring-0 focus:border-blue-600 transition-all rounded-none uppercase tracking-widest"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle className="h-3 w-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                                        Kata Sandi Baru
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full bg-white border-2 border-black py-4 pl-12 pr-12 text-xs font-bold text-[#262626] focus:ring-0 focus:border-blue-600 transition-all rounded-none tracking-widest"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#bbbbbb] hover:text-[#262626] transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={14} />
                                            ) : (
                                                <Eye size={14} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle className="h-3 w-3" /> {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Password Confirmation */}
                                <div>
                                    <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                                        Konfirmasi Kata Sandi Baru
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full bg-white border-2 border-black py-4 pl-12 pr-12 text-xs font-bold text-[#262626] focus:ring-0 focus:border-blue-600 transition-all rounded-none tracking-widest"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#bbbbbb] hover:text-[#262626] transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={14} />
                                            ) : (
                                                <Eye size={14} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle className="h-3 w-3" /> {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-3 bg-black hover:bg-transparent text-white hover:text-black border-2 border-black py-4 font-black uppercase text-[10px] tracking-widest transition-colors rounded-none"
                                >
                                    {processing && (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    )}
                                    <span>
                                        {processing
                                            ? "MENYIMPAN..."
                                            : "SIMPAN SANDI BARU"}
                                    </span>
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-black px-8 md:px-10 py-6 bg-gray-50 flex items-center justify-between">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#bbbbbb] hover:text-black transition-colors uppercase tracking-wider"
                            >
                                <ArrowLeft size={14} />
                                KEMBALI KE BERANDA
                            </Link>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                SRB Motor © 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
