import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    ShoppingCart,
    FileText,
    Settings,
    Trash2,
} from "lucide-react";
import { useComparison } from "@/Contexts/ComparisonContext";
import { motion } from "framer-motion";

export default function Compare({ motors }) {
    const { removeFromCompare } = useComparison();

    // Helper to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const { auth } = usePage().props;

    return (
        <PublicLayout auth={auth} title="Bandingkan Motor">
            <div className="flex-grow pt-[104px]">
                <div className="bg-gray-50 min-h-screen py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <Link
                                    href={route("motors.index")}
                                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-2 font-bold transition-colors"
                                >
                                    <ArrowLeft size={18} /> Kembali ke Katalog
                                </Link>
                                <h1 className="text-3xl font-extrabold text-gray-900">
                                    Perbandingan Motor
                                </h1>
                            </div>
                        </div>

                        {motors.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Settings
                                        size={40}
                                        className="text-gray-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Belum ada motor yang dipilih
                                </h3>
                                <p className="text-gray-500 mb-8">
                                    Silakan pilih motor dari katalog untuk mulai
                                    membandingkan.
                                </p>
                                <Link
                                    href={route("motors.index")}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-dark-blue transition-colors"
                                >
                                    Lihat Katalog
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto pb-4">
                                <div className="min-w-[800px] bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="p-6 w-48 bg-gray-50/50 border-b border-r border-gray-100 font-bold text-gray-500 uppercase tracking-wider text-sm sticky left-0 z-10">
                                                    Detail Motor
                                                </th>
                                                {motors.map((motor) => (
                                                    <th
                                                        key={motor.id}
                                                        className="p-6 border-b border-gray-100 min-w-[280px] align-top relative group"
                                                    >
                                                        <div className="absolute top-4 right-4 z-20">
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            "Hapus motor ini dari perbandingan?",
                                                                        )
                                                                    ) {
                                                                        removeFromCompare(
                                                                            motor.id,
                                                                        );
                                                                        // Optional: Refresh page logic via Inertia or rely on Context to update local storage and redirect if needed
                                                                        window.location.reload();
                                                                    }
                                                                }}
                                                                className="bg-white/80 backdrop-blur p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-gray-200"
                                                                title="Hapus"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="h-48 bg-gray-50 rounded-2xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={`/storage/${motor.image_path}`}
                                                                alt={motor.name}
                                                                className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 min-h-[56px]">
                                                            {motor.name}
                                                        </h3>
                                                        <div className="text-primary font-extrabold text-2xl mb-4">
                                                            {formatCurrency(
                                                                motor.price,
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            {motor.tersedia ? (
                                                                <>
                                                                    <Link
                                                                        href={route(
                                                                            "motors.cash-order",
                                                                            motor.id,
                                                                        )}
                                                                        className="w-full py-2 bg-green-600 text-white rounded-lg font-bold text-sm text-center shadow-lg shadow-green-200 hover:bg-green-500 hover:text-white transition-colors"
                                                                    >
                                                                        Beli
                                                                        Tunai
                                                                    </Link>
                                                                    <Link
                                                                        href={route(
                                                                            "motors.credit-order",
                                                                            motor.id,
                                                                        )}
                                                                        className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm text-center shadow-lg shadow-blue-200 hover:bg-blue-500 hover:text-white transition-colors"
                                                                    >
                                                                        Ajukan
                                                                        Kredit
                                                                    </Link>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    disabled
                                                                    className="w-full py-2 bg-gray-200 text-gray-400 rounded-lg font-bold text-sm cursor-not-allowed"
                                                                >
                                                                    Stok Habis
                                                                </button>
                                                            )}
                                                            <Link
                                                                href={route(
                                                                    "motors.show",
                                                                    motor.id,
                                                                )}
                                                                className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg font-bold text-sm text-center hover:bg-gray-50 transition-colors"
                                                            >
                                                                Detail Lengkap
                                                            </Link>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Basic Specs */}
                                            <tr>
                                                <td className="p-4 bg-gray-50/30 border-b border-r border-gray-100 font-bold text-gray-600 sticky left-0 z-10">
                                                    Brand
                                                </td>
                                                {motors.map((motor) => (
                                                    <td
                                                        key={motor.id}
                                                        className="p-4 border-b border-gray-100 font-medium text-gray-800"
                                                    >
                                                        {motor.brand}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="p-4 bg-gray-50/30 border-b border-r border-gray-100 font-bold text-gray-600 sticky left-0 z-10">
                                                    Tipe
                                                </td>
                                                {motors.map((motor) => (
                                                    <td
                                                        key={motor.id}
                                                        className="p-4 border-b border-gray-100 font-medium text-gray-800"
                                                    >
                                                        {motor.type}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="p-4 bg-gray-50/30 border-b border-r border-gray-100 font-bold text-gray-600 sticky left-0 z-10">
                                                    Tahun
                                                </td>
                                                {motors.map((motor) => (
                                                    <td
                                                        key={motor.id}
                                                        className="p-4 border-b border-gray-100 font-medium text-gray-800"
                                                    >
                                                        {motor.year}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="p-4 bg-gray-50/30 border-b border-r border-gray-100 font-bold text-gray-600 sticky left-0 z-10">
                                                    Status
                                                </td>
                                                {motors.map((motor) => (
                                                    <td
                                                        key={motor.id}
                                                        className="p-4 border-b border-gray-100"
                                                    >
                                                        {motor.tersedia ? (
                                                            <span className="inline-flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-md">
                                                                <CheckCircle
                                                                    size={14}
                                                                />{" "}
                                                                Tersedia
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-md">
                                                                <XCircle
                                                                    size={14}
                                                                />{" "}
                                                                Terjual
                                                            </span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Dynamic Specifications */}
                                            <tr className="bg-gray-100/50">
                                                <td
                                                    colSpan={motors.length + 1}
                                                    className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100 sticky left-0 z-10"
                                                >
                                                    Deskripsi Tambahan
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-blue-50/5 transition-colors">
                                                <td className="p-4 bg-gray-50/30 border-b border-r border-gray-100 font-bold text-gray-600 sticky left-0 z-10 align-top">
                                                    Deskripsi (Spesifikasi &
                                                    Promo)
                                                </td>
                                                {motors.map((motor) => (
                                                    <td
                                                        key={motor.id}
                                                        className="p-4 border-b border-gray-100 text-gray-800 text-sm align-top HTML-content-wrapper"
                                                    >
                                                        {motor.description ? (
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: motor.description,
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 italic">
                                                                Belum ada
                                                                deskripsi.
                                                            </span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
