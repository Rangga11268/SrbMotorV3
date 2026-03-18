import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Check, AlertCircle, Mail, Smartphone, Loader } from "lucide-react";

export default function DebugVerificationMode({ user }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm({});
    const [verified, setVerified] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState("email");

    const handleQuickVerify = (method) => {
        setVerificationMethod(method);
        post(route("verification.verify-debug", { method }), {
            onSuccess: () => {
                setVerified(true);
                setTimeout(() => {
                    window.location.href = route("motors.user-transactions");
                }, 2000);
            },
        });
    };

    if (verified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Verifikasi Berhasil!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Akun Anda telah diverifikasi. Mengarahkan ke
                        dashboard...
                    </p>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 animate-pulse"
                            style={{ animation: "pulse 1s infinite" }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Verifikasi Akun
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Selamat datang, {user?.name}!
                    </p>
                </div>

                {/* Debug Mode Banner */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-bold text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        MODE DEBUG: Verifikasi Instan
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                        Klik tombol di bawah untuk verifikasi langsung tanpa
                        menunggu email atau SMS.
                    </p>
                </div>

                {/* Email Verification */}
                <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Verifikasi via Email
                    </h3>
                    <button
                        onClick={() => handleQuickVerify("email")}
                        disabled={processing}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing && verificationMethod === "email" ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Memverifikasi...
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4" />
                                Verifikasi Email Sekarang
                            </>
                        )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Email: {user?.email}
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-bold">
                        ATAU
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Phone Verification */}
                <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        Verifikasi via OTP
                    </h3>
                    <button
                        onClick={() => handleQuickVerify("phone")}
                        disabled={processing}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing && verificationMethod === "phone" ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Memverifikasi...
                            </>
                        ) : (
                            <>
                                <Smartphone className="w-4 h-4" />
                                Verifikasi OTP Sekarang
                            </>
                        )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        OTP akan dikirim instant ke nomor Anda
                    </p>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600">
                        <strong>Catatan untuk Developer:</strong> Mode debug ini
                        memungkinkan Anda menguji verification flow tanpa
                        menunggu email/SMS nyata. Fitur ini hanya tersedia saat
                        env
                        <code className="text-red-600 font-bold">
                            {" "}
                            DEBUG_MODE=true
                        </code>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
