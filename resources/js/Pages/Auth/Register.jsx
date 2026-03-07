import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    AlertCircle,
    Mail,
    Lock,
    UserPlus,
    User,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-blue-600 selection:text-white bg-white">
            <Head title="Daftar Akun - SRB Motor" />

            {/* Left Box: Premium Image Split (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                {/* Background Image */}
                <img
                    // Using the requested image
                    src="/assets/img/banner.png"
                    alt="Premium Motorcycles"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />

                {/* Elegant Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-blue-900/40" />

                <div className="relative z-10 flex flex-col justify-end p-20 w-full h-full text-white">
                    <div className="inline-flex flex-col gap-4 mb-10">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-400" />
                            <span className="text-lg font-medium">
                                Transaksi Dijamin Aman 100%
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-400" />
                            <span className="text-lg font-medium">
                                Proses Pengajuan Kredit Cepat
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-400" />
                            <span className="text-lg font-medium">
                                Lacak Order Real-time
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                        Bergabung
                        <br />
                        Bersama Kami.
                    </h1>
                    <p className="text-lg text-gray-300 max-w-md">
                        Buat akun sekarang dan nikmati kemudahan bertransaksi,
                        klaim promo eksklusif, serta pantau status pengiriman
                        motor idaman Anda dengan mudah.
                    </p>

                    {/* Minimalist Pattern */}
                    <svg
                        className="absolute top-20 left-20 w-64 h-64 text-white/5 transform -rotate-45"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                    >
                        <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                    </svg>
                </div>
            </div>

            {/* Right Box: Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-8 px-6 sm:px-12 lg:px-20 relative z-10 bg-white border-l border-gray-100/50">
                <div className="flex justify-between items-center">
                    <Link
                        href={route("home")}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>
                    <div className="font-bold text-xl tracking-tight text-gray-900">
                        SRB<span className="text-blue-600">Motor.</span>
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto py-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Buat Akun Baru
                        </h2>
                        <p className="mt-2 text-base text-gray-500">
                            Isi formulir di bawah ini dengan data yang valid
                            untuk mendaftar.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form className="space-y-5" onSubmit={submit}>
                            {/* Full Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Nama Lengkap
                                </label>
                                <div className="relative mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <User
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="block w-full rounded-2xl border-0 py-3.5 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all hover:bg-gray-50 focus:bg-white focus:shadow-md focus:shadow-blue-500/10"
                                        placeholder="Ketik nama sesuai KTP"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4" />{" "}
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Alamat Email
                                </label>
                                <div className="relative mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Mail
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="block w-full rounded-2xl border-0 py-3.5 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all hover:bg-gray-50 focus:bg-white focus:shadow-md focus:shadow-blue-500/10"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4" />{" "}
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-900"
                                    >
                                        Kata Sandi
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Lock
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            required
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full rounded-2xl border-0 py-3.5 pl-11 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all hover:bg-gray-50 focus:bg-white focus:shadow-md focus:shadow-blue-500/10"
                                            placeholder="Min. 8 kar."
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Eye
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                            <AlertCircle className="h-4 w-4 shrink-0" />{" "}
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-900"
                                    >
                                        Konfirmasi
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Lock
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full rounded-2xl border-0 py-3.5 pl-11 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all hover:bg-gray-50 focus:bg-white focus:shadow-md focus:shadow-blue-500/10"
                                            placeholder="Ulangi"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Eye
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-3 py-4 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    {processing ? (
                                        <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10 flex items-center gap-2">
                                                <UserPlus size={18} />
                                                Daftar Sekarang
                                                <ArrowRight
                                                    size={18}
                                                    className="group-hover:translate-x-1 transition-transform ml-1"
                                                />
                                            </span>
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 flex items-center"
                                    aria-hidden="true"
                                >
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white px-6 text-gray-400">
                                        atau daftar cepat menggunakan
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href={route("auth.google")}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-3 py-4 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:ring-gray-300 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Lanjutkan dengan Google
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="text-center text-sm text-gray-500">
                    Sudah punya akun?{" "}
                    <Link
                        href={route("login")}
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Masuk di sini
                    </Link>
                </div>
            </div>

            {/* Inject Shimmer Animation for the generic auth aesthetic */}
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}
