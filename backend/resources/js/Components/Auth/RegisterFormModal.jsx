import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    AlertCircle,
    Mail,
    Lock,
    User,
    UserPlus,
} from "lucide-react";

export default function RegisterFormModal({ onSwitch }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <div className="space-y-6">
            <form className="space-y-5" onSubmit={submit}>
                {/* Name */}
                <div>
                    <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                        Nama Lengkap
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-[#bbbbbb] group-focus-within:text-[#1c69d4] transition-colors" />
                        </div>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="NAMA LENGKAP ANDA"
                            className="block w-full bg-white border border-gray-200 py-3.5 pl-12 pr-4 text-xs font-bold text-[#262626] placeholder:text-[#bbbbbb] focus:ring-1 focus:ring-[#1c69d4] focus:border-[#1c69d4] transition-all rounded-none uppercase tracking-widest"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-2 text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                        Alamat Email
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-[#bbbbbb] group-focus-within:text-[#1c69d4] transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="NAMA@EMAIL.COM"
                            className="block w-full bg-white border border-gray-200 py-3.5 pl-12 pr-4 text-xs font-bold text-[#262626] placeholder:text-[#bbbbbb] focus:ring-1 focus:ring-[#1c69d4] focus:border-[#1c69d4] transition-all rounded-none uppercase tracking-widest"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                        <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                            Kata Sandi
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-3.5 w-3.5 text-[#bbbbbb] group-focus-within:text-[#1c69d4] transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="••••••••"
                                className="block w-full bg-white border border-gray-200 py-3.5 pl-10 pr-10 text-xs font-bold text-[#262626] placeholder:text-[#bbbbbb] focus:ring-1 focus:ring-[#1c69d4] focus:border-[#1c69d4] transition-all rounded-none tracking-widest"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#bbbbbb] hover:text-[#262626] transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff size={14} />
                                ) : (
                                    <Eye size={14} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em] mb-2.5">
                            Konfirmasi
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-3.5 w-3.5 text-[#bbbbbb] group-focus-within:text-[#1c69d4] transition-colors" />
                            </div>
                            <input
                                type={showConfirm ? "text" : "password"}
                                required
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                placeholder="••••••••"
                                className="block w-full bg-white border border-gray-200 py-3.5 pl-10 pr-10 text-xs font-bold text-[#262626] placeholder:text-[#bbbbbb] focus:ring-1 focus:ring-[#1c69d4] focus:border-[#1c69d4] transition-all rounded-none tracking-widest"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#bbbbbb] hover:text-[#262626] transition-colors"
                            >
                                {showConfirm ? (
                                    <EyeOff size={14} />
                                ) : (
                                    <Eye size={14} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {(errors.password || errors.password_confirmation) && (
                    <p className="mt-2 text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />{" "}
                        {errors.password || errors.password_confirmation}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full relative group overflow-hidden bg-[#1c69d4] py-4 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                >
                    <div className="absolute inset-0 bg-[#262626] -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.3em]">
                        {processing ? (
                            "MEMPROSES..."
                        ) : (
                            <>
                                <UserPlus size={14} strokeWidth={3} />
                                DAFTAR SEKARANG
                            </>
                        )}
                    </span>
                </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative z-10 px-4 bg-white text-[8px] font-black text-[#dddddd] uppercase tracking-[0.4em]">
                    OPSI LAIN
                </span>
            </div>

            {/* Google OAuth */}
            <a href={route("auth.google")} className="block">
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-4 py-3.5 border border-gray-200 hover:border-[#1c69d4] transition-all group rounded-none"
                >
                    <img
                        src="/assets/icon/google-icon-logo.webp"
                        alt="Google"
                        className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                    />
                    <span className="text-[9px] font-bold text-[#262626] uppercase tracking-widest">
                        DAFTAR DENGAN GOOGLE
                    </span>
                </button>
            </a>

            {/* Switch to Login */}
            <div className="pt-2 text-center">
                <p className="text-[9px] font-bold text-[#bbbbbb] uppercase tracking-widest">
                    Sudah punya akun?{" "}
                    <button
                        onClick={() => onSwitch("login")}
                        className="ml-1.5 text-[#1c69d4] hover:text-[#262626] border-b border-[#1c69d4] border-opacity-30 hover:border-opacity-100 transition-all pb-0.5"
                    >
                        MASUK DI SINI
                    </button>
                </p>
            </div>
        </div>
    );
}
