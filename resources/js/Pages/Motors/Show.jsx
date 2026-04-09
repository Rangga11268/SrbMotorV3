import React, { useState, useEffect, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion } from "framer-motion";
import {
    ChevronRight,
    ArrowLeft,
    Shield,
    Star,
    CheckCircle,
    ShoppingBag,
    Bike,
    Smartphone,
    MapPin,
    ArrowRight,
    Info,
    PenTool,
    ShieldCheck,
    CheckCircle2,
    Wrench,
    ShoppingCart,
    FileText,
    Phone,
    Calendar,
    Palette,
    Settings,
    Check,
    AlertCircle,
    User,
    Sparkles,
    FileCheck,
    Activity,
} from "lucide-react";

export default function Show({ motor, relatedMotors, settings = {} }) {
    const { auth } = usePage().props;
    const [selectedTenor, setSelectedTenor] = useState(36);
    const [dpAmount, setDpAmount] = useState(
        parseFloat(motor.min_dp_amount || motor.price * 0.2),
    );

    const monthlyInstallment = useMemo(() => {
        const principal = parseFloat(motor.price) - dpAmount;
        if (principal <= 0) return 0;

        const interestRate = 0.015; // 1.5% Flat
        const totalInterest = principal * interestRate * selectedTenor;
        return Math.round((principal + totalInterest) / selectedTenor);
    }, [motor.price, dpAmount, selectedTenor]);

    const handleDpChange = (e) => {
        const value = e.target.value;
        const cleaned = value.replace(/[^\d]/g, "");
        setDpAmount(parseFloat(cleaned) || 0);
    };

    const formatNumberDisplay = (numStr) => {
        if (!numStr && numStr !== 0) return "";
        const strValue = String(numStr);
        const cleanNum = strValue.replace(/[^\d]/g, "");
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const openWhatsApp = (e) => {
        e.preventDefault();
        const phoneNumber =
            settings.contact_phone?.replace(/\D/g, "") || "628978638849";
        const message = encodeURIComponent(
            `Halo SRB Motors, saya tertarik dengan unit ${
                motor.name
            } (Rp ${parseFloat(motor.price).toLocaleString("id-ID")}). Bisa minta info lebih lanjut?`,
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    //   Blue
    const accentColor = "#1c69d4";

    return (
        <PublicLayout auth={auth} title={`${motor.name} - SRB Motor`}>
            {/* HERO PRESENTATION: Full Black, Cinematic */}
            <section className="bg-black pt-28 pb-20 relative overflow-hidden text-white border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    {/* Typographic Block */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="mb-2">
                            <Link
                                href={route("motors.index")}
                                className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                KEMBALI KE KATALOG
                            </Link>
                        </div>
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-4">
                            <Link
                                href="/"
                                className="hover:text-white transition-colors"
                            >
                                HOME
                            </Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <Link
                                href={route("motors.index")}
                                className="hover:text-white transition-colors"
                            >
                                KATALOG
                            </Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">{motor.brand}</span>
                        </nav>

                        <div>
                            <div className="flex gap-2 mb-3">
                                <span className="bg-white text-black px-3 py-1 font-bold text-[10px] uppercase tracking-widest rounded-none">
                                    PREMIUM UNIT
                                </span>
                                {!motor.tersedia && (
                                    <span className="bg-red-600 text-white px-3 py-1 font-bold text-[10px] uppercase tracking-widest rounded-none">
                                        TERJUAL
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
                                {motor.name}
                            </h1>
                            <p className="text-2xl font-light text-gray-400 tracking-tight">
                                Rp{" "}
                                {parseInt(motor.price).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>

                    {/* Image Presentation */}
                    <div className="w-full md:w-1/2 flex justify-center relative">
                        <div className="absolute inset-0 bg-[#1c69d4] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
                        <img
                            src={
                                motor.image_path
                                    ? `/storage/${motor.image_path}`
                                    : "/assets/img/no-image.webp"
                            }
                            alt={motor.name}
                            className={`w-full max-w-[500px] object-contain relative z-10 ${!motor.tersedia ? "grayscale opacity-70" : ""}`}
                        />
                    </div>
                </div>
            </section>

            {/* CONTENT & SIDEBAR */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-8 space-y-16">
                            {/* SPECS */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
                                    <span className="w-8 h-1 bg-[#1c69d4]"></span>{" "}
                                    SPESIFIKASI TEKNIS
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-none">
                                    {[
                                        { label: "TAHUN", value: motor.year },
                                        {
                                            label: "WARNA",
                                            value:
                                                Array.isArray(motor.colors) &&
                                                motor.colors.length > 0
                                                    ? motor.colors.join(", ")
                                                    : "BERAGAM",
                                        },
                                        {
                                            label: "TRANSMISI",
                                            value: motor.type
                                                ?.toLowerCase()
                                                .includes("matic")
                                                ? "MATIC"
                                                : "MANUAL",
                                        },
                                        {
                                            label: "STATUS",
                                            value: motor.tersedia
                                                ? "TERSEDIA"
                                                : "TERJUAL",
                                        },
                                    ].map((spec, i) => (
                                        <div
                                            key={i}
                                            className="bg-white p-6 flex flex-col justify-center items-start group hover:bg-gray-50 transition-colors"
                                        >
                                            <p className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-[0.2em] mb-1">
                                                {spec.label}
                                            </p>
                                            <p className="text-lg font-black text-black uppercase tracking-tight">
                                                {spec.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DESC */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
                                    <span className="w-8 h-1 bg-[#1c69d4]"></span>{" "}
                                    KETERANGAN
                                </h2>
                                <div
                                    className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed prose-p:mb-6 prose-strong:font-black prose-strong:text-black"
                                    dangerouslySetInnerHTML={{
                                        __html: motor.description,
                                    }}
                                />
                            </div>

                            {/* FEATURES */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "GARANSI MESIN",
                                        desc: "1 TAHUN COVERAGE",
                                    },
                                    {
                                        title: "LEGALITAS JELAS",
                                        desc: "STNK & BPKB READY",
                                    },
                                    {
                                        title: "FULL SERVICE",
                                        desc: "GRATIS SERVIS 1X",
                                    },
                                ].map((benefit, i) => (
                                    <div
                                        key={i}
                                        className="border border-gray-200 p-8 rounded-none hover:border-[#1c69d4] transition-colors bg-gray-50"
                                    >
                                        <h4 className="text-lg font-black text-black mb-2 uppercase tracking-tight">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR - FIXED PANELS */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* ACTION PANEL */}
                            <div className="bg-black text-white p-8 rounded-none">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    HARGA KENDARAAN
                                </p>
                                <div className="text-4xl font-black tracking-tighter mb-8 leading-none">
                                    Rp{" "}
                                    {parseInt(motor.price).toLocaleString(
                                        "id-ID",
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {motor.tersedia ? (
                                        <>
                                            <Link
                                                href={route(
                                                    "motors.cash-order",
                                                    motor.id,
                                                )}
                                                className="block"
                                            >
                                                <button className="w-full bg-[#1c69d4] text-white font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-none hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                                    PEMBELIAN TUNAI
                                                </button>
                                            </Link>
                                            <Link
                                                href={route(
                                                    "motors.credit-order",
                                                    motor.id,
                                                )}
                                                className="block"
                                            >
                                                <button className="w-full bg-transparent border border-white text-white font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-none hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                                                    PENGAJUAN KREDIT
                                                </button>
                                            </Link>
                                        </>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full bg-gray-800 text-gray-500 font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-none cursor-not-allowed"
                                        >
                                            UNIT TERJUAL
                                        </button>
                                    )}
                                    <button
                                        onClick={openWhatsApp}
                                        className="w-full bg-white text-black font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-none hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Phone size={16} /> HUBUNGI KAMI
                                    </button>
                                </div>
                            </div>

                            {/* FINANCING SIMULATION */}
                            <div className="border border-gray-200 p-8 rounded-none bg-white">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-sm font-black text-black uppercase tracking-widest">
                                        SIMULASI KREDIT
                                    </h3>
                                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 uppercase">
                                        ESTIMASI
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            <span>UANG MUKA (DP)</span>
                                            {dpAmount <
                                                parseFloat(
                                                    motor.min_dp_amount,
                                                ) && (
                                                <span className="text-red-500">
                                                    MIN. DP REQUIRED
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">
                                                Rp
                                            </span>
                                            <input
                                                type="text"
                                                value={formatNumberDisplay(
                                                    dpAmount,
                                                )}
                                                onChange={handleDpChange}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-none py-3 pl-12 pr-4 font-black text-black focus:border-[#1c69d4] focus:ring-0 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            TENOR
                                        </span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[12, 24, 36].map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() =>
                                                        setSelectedTenor(t)
                                                    }
                                                    className={`py-3 rounded-none text-[11px] font-bold tracking-widest transition-colors ${selectedTenor === t ? "bg-[#1c69d4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                                >
                                                    {t} BLN
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                            ANGSURAN PER BULAN
                                        </p>
                                        <p className="text-3xl font-black text-black tracking-tighter">
                                            Rp{" "}
                                            {monthlyInstallment.toLocaleString(
                                                "id-ID",
                                            )}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                                            *BUNGA FLAT 1.5% - OTR BEKASI
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* RELATED MOTORS */}
                    {relatedMotors?.length > 0 && (
                        <div className="mt-24 pt-16 border-t border-gray-200">
                            <div className="flex items-end justify-between mb-12">
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
                                    <span className="w-8 h-1 bg-black"></span>{" "}
                                    UNIT TERKAIT
                                </h2>
                                <Link
                                    href="/motors"
                                    className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] hover:text-black transition-colors"
                                >
                                    LIHAT SEMUA{" "}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                                {relatedMotors.map((m) => (
                                    <Link
                                        key={m.id}
                                        href={route("motors.show", m.id)}
                                        className="bg-white group overflow-hidden flex flex-col"
                                    >
                                        <div className="p-8 pb-0 h-48 flex items-center justify-center bg-white relative">
                                            {!m.tersedia && (
                                                <div className="absolute top-4 left-4 z-20">
                                                    <span className="bg-red-600 text-white px-3 py-1 font-bold text-[10px] uppercase tracking-widest rounded-none shadow-sm">
                                                        TERJUAL
                                                    </span>
                                                </div>
                                            )}
                                            <img
                                                src={
                                                    m.image_path
                                                        ? `/storage/${m.image_path}`
                                                        : "/assets/img/no-image.webp"
                                                }
                                                className={`max-h-full object-contain transition-transform duration-500 ${m.tersedia ? 'group-hover:scale-105' : 'grayscale opacity-70'}`}
                                                alt={m.name}
                                            />
                                        </div>
                                        <div className="p-6 mt-auto">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                {m.brand}
                                            </p>
                                            <h4 className={`text-lg font-black uppercase tracking-tight mb-2 limit-1-line transition-colors ${m.tersedia ? 'text-black group-hover:text-[#1c69d4]' : 'text-gray-500 line-through decoration-red-500 decoration-2'}`}>
                                                {m.name}
                                            </h4>
                                            <p className={`text-lg font-light ${m.tersedia ? 'text-gray-600' : 'text-gray-400'}`}>
                                                Rp{" "}
                                                {parseInt(
                                                    m.price,
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
