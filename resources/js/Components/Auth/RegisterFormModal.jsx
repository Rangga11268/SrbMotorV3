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
            <form className="space-y-4" onSubmit={submit}>
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Nama Anda"
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" /> {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="nama@email.com"
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" /> {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="••••••••"
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />{" "}
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="••••••••"
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirm ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />{" "}
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {processing ? (
                        "Loading..."
                    ) : (
                        <>
                            <UserPlus size={18} />
                            Buat Akun
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-bold">ATAU</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google OAuth */}
            <a href={route("auth.google")} className="w-full">
                <button
                    type="button"
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
                >
                    <img
                        src="/assets/icon/google-icon-logo.webp"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Daftar dengan Google
                </button>
            </a>

            {/* Switch to Login */}
            <div className="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?{" "}
                <button
                    onClick={() => onSwitch("login")}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Masuk di sini
                </button>
            </div>
        </div>
    );
}
