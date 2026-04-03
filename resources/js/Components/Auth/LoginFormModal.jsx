import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    AlertCircle,
    Mail,
    Lock,
    LogIn,
    ArrowRight,
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function LoginFormModal({ onSwitch }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    const handleGoogleLogin = () => {
        window.location.href = route("auth.google");
    };

    return (
        <div className="space-y-6">
            <form className="space-y-5" onSubmit={submit}>
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

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-2.5">
                        <label className="block text-[9px] font-black text-[#262626] uppercase tracking-[0.2em]">
                            Kata Sandi
                        </label>
                        <a
                            href="#"
                            className="text-[8px] font-bold text-[#bbbbbb] hover:text-[#1c69d4] uppercase tracking-widest transition-colors"
                        >
                            Lupa?
                        </a>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-[#bbbbbb] group-focus-within:text-[#1c69d4] transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="••••••••"
                            className="block w-full bg-white border border-gray-200 py-3.5 pl-12 pr-12 text-xs font-bold text-[#262626] placeholder:text-[#bbbbbb] focus:ring-1 focus:ring-[#1c69d4] focus:border-[#1c69d4] transition-all rounded-none tracking-widest"
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
                            <AlertCircle className="h-3 w-3" />{" "}
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="peer h-4 w-4 appearance-none border border-gray-300 checked:border-[#1c69d4] checked:bg-[#1c69d4] transition-all cursor-pointer rounded-none"
                            />
                            <div className="absolute opacity-0 peer-checked:opacity-100 text-white transition-opacity pointer-events-none">
                                <ArrowRight size={10} strokeWidth={4} />
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-[#bbbbbb] group-hover:text-[#262626] uppercase tracking-widest transition-colors">
                            Ingat saya
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full relative group overflow-hidden bg-[#262626] py-4 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                >
                    <div className="absolute inset-0 bg-[#1c69d4] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.3em]">
                        {processing ? (
                            "MEMPROSES..."
                        ) : (
                            <>
                                <LogIn size={14} strokeWidth={3} />
                                MASUK SEKARANG
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
                        LANJUT DENGAN GOOGLE
                    </span>
                </button>
            </a>

            {/* Switch to Register */}
            <div className="pt-2 text-center">
                <p className="text-[9px] font-bold text-[#bbbbbb] uppercase tracking-widest">
                    Belum punya akun?{" "}
                    <button
                        onClick={() => onSwitch("register")}
                        className="ml-1.5 text-[#1c69d4] hover:text-[#262626] border-b border-[#1c69d4] border-opacity-30 hover:border-opacity-100 transition-all pb-0.5"
                    >
                        DAFTAR DISINI
                    </button>
                </p>
            </div>
        </div>
    );
}
