import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader, ArrowLeft } from "lucide-react";
import Button from "@/Components/UI/Button";

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

            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-primary/15 border border-primary/5 overflow-hidden">
                        {/* Header/Icon Section */}
                        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg shadow-primary/10 flex items-center justify-center mb-4 relative">
                                <Lock
                                    className="w-12 h-12 text-primary"
                                />
                                <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                            </div>
                            <div className="text-center space-y-3">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                    Setel Ulang Sandi
                                </h1>
                                <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wide">
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
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="NAMA@EMAIL.COM"
                                        className="block w-full bg-gray-50 border border-gray-200 py-3.5 px-4 text-xs font-bold text-[#262626] focus:ring-1 focus:ring-primary focus:border-primary transition-all rounded-none uppercase tracking-widest"
                                    />
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
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full bg-white border border-gray-200 py-3.5 pl-4 pr-12 text-xs font-bold text-[#262626] focus:ring-1 focus:ring-primary focus:border-primary transition-all rounded-none tracking-widest"
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
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full bg-white border border-gray-200 py-3.5 pl-4 pr-12 text-xs font-bold text-[#262626] focus:ring-1 focus:ring-primary focus:border-primary transition-all rounded-none tracking-widest"
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

                                <Button
                                    fullWidth
                                    size="lg"
                                    type="submit"
                                    disabled={processing}
                                    className="h-14 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                >
                                    {processing && (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    )}
                                    <span>
                                        {processing
                                            ? "Memproses..."
                                            : "Simpan Sandi Baru"}
                                    </span>
                                </Button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 px-8 md:px-10 py-6 bg-gray-50 flex items-center justify-between">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#bbbbbb] hover:text-primary transition-colors uppercase tracking-wider"
                            >
                                <ArrowLeft size={14} />
                                Kembali ke Beranda
                            </Link>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                SRB Motor © 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
