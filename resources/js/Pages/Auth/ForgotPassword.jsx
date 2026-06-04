import React from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Mail, CheckCircle, AlertCircle, Loader, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const { status: propStatus } = usePage().props;
    const flash = usePage().props.flash || {};
    const status = propStatus || flash.status;

    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Lupa Kata Sandi" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* Main Card */}
                    <div className="bg-white rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Header/Icon Section */}
                        <div className="relative bg-gray-50 border-b-2 border-black p-8 md:p-12 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center mb-4">
                                <Mail className="w-10 h-10 text-black" />
                            </div>
                            <div className="text-center space-y-3">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-none uppercase tracking-tight">
                                    Lupa Sandi?
                                </h1>
                                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                    Masukkan email Anda untuk menerima link reset
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-8 md:p-10 space-y-6">
                            {status && (
                                <div className="bg-white border-2 border-emerald-600 p-4 flex items-start gap-3 rounded-none animate-in slide-in-from-top">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                            Sukses Terkirim
                                        </p>
                                        <p className="text-gray-800 text-xs font-bold mt-1">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
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
                                            ? "MENGIRIM..."
                                            : "KIRIM LINK RESET"}
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
                                KEMBALI
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
