import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    Mail,
    CheckCircle,
    AlertCircle,
    Loader,
    Copy,
    Eye,
    EyeOff,
} from "lucide-react";
import axios from "axios";

export default function VerifyEmail() {
    const { user } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showDebugCode, setShowDebugCode] = useState(false);

    const handleResendEmail = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(route("verification.send"));
            setStatus(
                "Email verifikasi telah dikirim ke email Anda. Silakan periksa inbox.",
            );
        } catch (err) {
            setError("Gagal mengirim email verifikasi. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDebugVerify = async (method) => {
        if (!isDebugMode()) return;

        setLoading(true);
        try {
            await axios.post(route("verification.verify-debug", { method }));
            setStatus("✓ Email berhasil diverifikasi (mode debug)");
        } catch (err) {
            setError("Gagal memverifikasi email");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isDebugMode = () => {
        return (
            document.documentElement.getAttribute("data-debug-mode") === "true"
        );
    };

    return (
        <>
            <Head title="Verifikasi Email" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* Main Card */}
                    <div className="bg-white rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Icon Section */}
                        <div className="relative bg-gray-50 border-b-2 border-black p-8 md:p-12 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center mb-4">
                                <Mail className="w-10 h-10 text-black animate-bounce" style={{ animationDuration: "2s" }} />
                            </div>
                            <div className="text-center space-y-3">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-none uppercase tracking-tight">
                                    Verifikasi Email
                                </h1>
                                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                    Langkah terakhir sebelum Anda siap
                                </p>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-10 space-y-6">
                            {/* Email Info */}
                            <div className="bg-gray-50 border-2 border-black p-6 rounded-none">
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">
                                    Email Terdaftar
                                </p>
                                <p className="text-lg md:text-xl font-black text-gray-900 break-all select-all">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <p className="text-gray-600 text-xs font-bold uppercase tracking-wide leading-relaxed">
                                    Link verifikasi telah dikirimkan ke email Anda. Cek inbox dan klik link untuk mengaktifkan akun Anda.
                                </p>
                                <ul className="space-y-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-black shrink-0" />
                                        Periksa folder <strong>Spam</strong> atau <strong>Promosi</strong>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-black shrink-0" />
                                        Link berlaku selama <strong>24 jam</strong>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-black shrink-0" />
                                        Periksa koneksi internet Anda
                                    </li>
                                </ul>
                            </div>

                            {/* Status Messages */}
                            {status && (
                                <div className="bg-white border-2 border-emerald-600 p-4 flex items-start gap-3 rounded-none animate-in slide-in-from-top">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                            Sukses!
                                        </p>
                                        <p className="text-gray-800 text-xs font-bold mt-1">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-white border-2 border-red-600 p-4 flex items-start gap-3 rounded-none animate-in slide-in-from-top">
                                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">
                                            Oops!
                                        </p>
                                        <p className="text-gray-800 text-xs font-bold mt-1">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Resend Button */}
                            <button
                                onClick={handleResendEmail}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-transparent text-white hover:text-black border-2 border-black py-4 font-black uppercase text-[10px] tracking-widest transition-colors rounded-none"
                            >
                                {loading && (
                                    <Loader className="w-4 h-4 animate-spin" />
                                )}
                                <span>
                                    {loading
                                        ? "MENGIRIM..."
                                        : "KIRIM ULANG EMAIL"}
                                </span>
                            </button>

                            {/* Debug Mode Section */}
                            {isDebugMode() && (
                                <div className="border-t-2 border-black pt-6 space-y-4">
                                    <div className="bg-white border-2 border-yellow-500 p-5 rounded-none shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xl">🔧</span>
                                            <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">
                                                Debug Verification
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Verification Link Display */}
                                            <div className="bg-white border-2 border-black p-3 rounded-none">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                            Verification Link
                                                        </p>
                                                        <p className="text-[10px] font-mono text-gray-700 break-all select-all font-bold">
                                                            {route(
                                                                "verification.verify",
                                                                {
                                                                    id:
                                                                        user?.id ||
                                                                        "USER_ID",
                                                                    hash: "VERIFICATION_HASH",
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                route(
                                                                    "verification.verify",
                                                                    {
                                                                        id:
                                                                            user?.id ||
                                                                            "USER_ID",
                                                                        hash: "VERIFICATION_HASH",
                                                                    },
                                                                ),
                                                            )
                                                        }
                                                        className="shrink-0 p-2 hover:bg-gray-100 border border-transparent hover:border-black rounded-none transition-all"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copied ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400 hover:text-black" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Test Actions */}
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() =>
                                                            handleDebugVerify(
                                                                "mark_verified",
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className="flex-1 bg-yellow-500 hover:bg-transparent text-black hover:text-yellow-600 border-2 border-yellow-500 font-black py-2.5 px-3 rounded-none text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Loader className="w-3.5 h-3.5 animate-spin" />
                                                                VERIFYING...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                VERIFY NOW
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowDebugCode(
                                                                !showDebugCode,
                                                            )
                                                        }
                                                        className="p-2.5 bg-gray-100 hover:bg-black text-gray-700 hover:text-white border-2 border-black rounded-none transition-colors"
                                                        title="Toggle code view"
                                                    >
                                                        {showDebugCode ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Debug Instructions */}
                                            <div className="bg-white border-2 border-black p-3 rounded-none">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                    How to test:
                                                </p>
                                                <ol className="space-y-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                                    <li className="flex gap-2">
                                                        <span className="shrink-0">
                                                            1.
                                                        </span>
                                                        <span>
                                                            Copy verification
                                                            link di atas
                                                        </span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="shrink-0">
                                                            2.
                                                        </span>
                                                        <span>
                                                            Buka di tab baru
                                                            atau klik tombol
                                                            "Verify Now"
                                                        </span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="shrink-0">
                                                            3.
                                                        </span>
                                                        <span>
                                                            Email Anda akan
                                                            segera terverifikasi
                                                        </span>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-black px-8 md:px-10 py-6 bg-gray-50 flex items-center justify-between">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#bbbbbb] hover:text-black transition-colors uppercase tracking-wider"
                            >
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
