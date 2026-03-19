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
import Button from "@/Components/UI/Button";
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

            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-primary/15 border border-primary/5 overflow-hidden">
                        {/* Icon Section */}
                        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg shadow-primary/10 flex items-center justify-center mb-4 relative">
                                <Mail
                                    className="w-12 h-12 text-primary animate-bounce"
                                    style={{ animationDuration: "2s" }}
                                />
                                <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                            </div>
                            <div className="text-center space-y-3">
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                    Verifikasi Email
                                </h1>
                                <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wide">
                                    Langkah terakhir sebelum Anda siap
                                </p>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-10 space-y-6">
                            {/* Email Info */}
                            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-2">
                                    Email Terdaftar
                                </p>
                                <p className="text-lg md:text-xl font-black text-gray-900 break-all">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    Link verifikasi telah dikirimkan ke email
                                    Anda. Cek inbox dan klik link untuk
                                    mengaktifkan akun Anda.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Periksa folder <strong>Spam</strong>{" "}
                                        atau <strong>Promosi</strong>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Link berlaku selama{" "}
                                        <strong>24 jam</strong>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Periksa koneksi internet Anda
                                    </li>
                                </ul>
                            </div>

                            {/* Status Messages */}
                            {status && (
                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top">
                                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-green-800 text-sm font-bold">
                                            Sukses!
                                        </p>
                                        <p className="text-green-700 text-sm">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top">
                                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-800 text-sm font-bold">
                                            Oops!
                                        </p>
                                        <p className="text-red-700 text-sm">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Resend Button */}
                            <Button
                                fullWidth
                                size="lg"
                                onClick={handleResendEmail}
                                disabled={loading}
                                className="h-14 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                            >
                                {loading && (
                                    <Loader className="w-5 h-5 animate-spin" />
                                )}
                                <span>
                                    {loading
                                        ? "Mengirim..."
                                        : "Kirim Ulang Email"}
                                </span>
                            </Button>

                            {/* Debug Mode Section */}
                            {isDebugMode() && (
                                <div className="border-t-2 border-gray-100 pt-6 space-y-4">
                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xl">🔧</span>
                                            <p className="text-xs font-black text-yellow-900 uppercase tracking-widest">
                                                Debug Verification
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Verification Link Display */}
                                            <div className="relative bg-white rounded-xl border border-yellow-200 p-3 overflow-hidden">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                            Verification Link
                                                        </p>
                                                        <p className="text-xs font-mono text-gray-700 break-all line-clamp-2 select-all">
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
                                                        className="shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copied ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
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
                                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Loader className="w-3.5 h-3.5 animate-spin" />
                                                                Verifying...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                Verify Now
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowDebugCode(
                                                                !showDebugCode,
                                                            )
                                                        }
                                                        className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors"
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
                                            <div className="bg-white rounded-xl border border-yellow-200 p-3">
                                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                                                    How to test:
                                                </p>
                                                <ol className="space-y-1.5 text-xs text-gray-600">
                                                    <li className="flex gap-2">
                                                        <span className="font-bold shrink-0">
                                                            1.
                                                        </span>
                                                        <span>
                                                            Copy verification
                                                            link di atas
                                                        </span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-bold shrink-0">
                                                            2.
                                                        </span>
                                                        <span>
                                                            Buka di tab baru
                                                            atau klik tombol
                                                            "Verify Now"
                                                        </span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-bold shrink-0">
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
                        <div className="border-t border-gray-100 px-8 md:px-10 py-6 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center md:text-left">
                                SRB Motor © 2026
                            </p>
                            <Link
                                href="/"
                                className="text-xs font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
