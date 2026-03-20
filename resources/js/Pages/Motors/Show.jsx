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
} from "lucide-react";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";

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
        const val = parseFloat(e.target.value) || 0;
        setDpAmount(val);
    };

    const openWhatsApp = (e) => {
        e.preventDefault();
        const phoneNumber = settings.contact_whatsapp?.replace(/\D/g, "") || "6281234567890";
        const message = encodeURIComponent(
            `Halo SRB Motors, saya tertarik dengan unit ${
                motor.name
            } (Rp ${parseFloat(motor.price).toLocaleString("id-ID")}). Bisa minta info lebih lanjut?`,
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <PublicLayout auth={auth} title={`${motor.name} - SRB Motors`}>
            {/* PREMIUM HEADER SECTION */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[#060d18] z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* BREADCRUMBS */}
                    <nav className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase mb-8">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">HOME</Link>
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                        <Link href={route("motors.index")} className="text-gray-400 hover:text-white transition-colors">KATALOG</Link>
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                        <span className="text-blue-400 truncate max-w-[200px]">{motor.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Premium Unit</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
                                {motor.name.split(' ').map((word, i) => (
                                    <span key={i} className={i === 0 ? "text-white" : "text-blue-500 ml-3"}>{word} </span>
                                ))}
                            </h1>
                        </div>
                        <Link
                            href={route("motors.index")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:text-blue-400 transition-all uppercase tracking-widest backdrop-blur-md group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Katalog
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-grow pb-20 bg-white dark:bg-[#060d18]">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                        {/* LEFT COLUMN - CONTENT */}
                        <div className="flex-grow space-y-8">
                            {/* MAIN IMAGE CARD */}
                             <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-[#0d1b2e] rounded-[3rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-gray-100 dark:border-blue-900/30 relative"
                            >
                                <div className="relative aspect-[16/10] md:aspect-[16/9] bg-gradient-to-br from-gray-50 to-white dark:from-[#0d1b2e] dark:to-[#060d18] flex items-center justify-center p-8 md:p-12 overflow-hidden">
                                    {/* Decor */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
                                    </div>
                                    
                                    <img
                                        src={
                                            motor.image_path
                                                ? `/storage/${motor.image_path}`
                                                : "/images/placeholder-motor.jpg"
                                        }
                                        alt={motor.name}
                                        className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Brand & Type Labels */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                                        <div className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                            {motor.brand}
                                        </div>
                                        <div className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
                                            {motor.type}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* DETAIL SPECIFICATIONS TABS (Conceptually) */}
                            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/20 border border-white space-y-12">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 mb-8">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Info className="w-6 h-6 text-primary" />
                                            </div>
                                            Spesifikasi Kendaraan
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Year Spec */}
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                                                <div className="relative bg-white rounded-2xl p-5 border-2 border-blue-100 group-hover:border-blue-500 transition-all duration-300 space-y-3 h-full">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                                        <Calendar className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                            Tahun
                                                        </p>
                                                        <p className="text-2xl font-black text-gray-900">
                                                            {motor.year}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Color Spec */}
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                                                <div className="relative bg-white rounded-2xl p-5 border-2 border-purple-100 group-hover:border-purple-500 transition-all duration-300 space-y-3 h-full">
                                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                                        <Palette className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                            Warna
                                                        </p>
                                                        <p className="text-lg font-black text-gray-900">
                                                            {motor.color ||
                                                                "Beragam"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Transmission Spec */}
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                                                <div className="relative bg-white rounded-2xl p-5 border-2 border-orange-100 group-hover:border-orange-500 transition-all duration-300 space-y-3 h-full">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                                        <Settings className="w-5 h-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                            Transmisi
                                                        </p>
                                                        <p className="text-lg font-black text-gray-900 uppercase">
                                                            {motor.type?.includes(
                                                                "matic",
                                                            )
                                                                ? "Otomatis"
                                                                : "Manual"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Spec */}
                                            <div className="relative group">
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-r ${motor.tersedia ? "from-green-600 to-emerald-400" : "from-red-600 to-rose-400"} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300`}
                                                />
                                                <div
                                                    className={`relative bg-white rounded-2xl p-5 border-2 ${motor.tersedia ? "border-green-100 group-hover:border-green-500" : "border-red-100 group-hover:border-red-500"} transition-all duration-300 space-y-3 h-full`}
                                                >
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${motor.tersedia ? "bg-green-50" : "bg-red-50"}`}
                                                    >
                                                        {motor.tersedia ? (
                                                            <Check className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                            Status
                                                        </p>
                                                        <p
                                                            className={`text-lg font-black ${motor.tersedia ? "text-green-600" : "text-red-600"}`}
                                                        >
                                                            {motor.tersedia
                                                                ? "Tersedia"
                                                                : "Terjual"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-8 border-t border-gray-100">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                            <PenTool className="w-6 h-6 text-purple-600" />
                                        </div>
                                        Deskripsi & Catatan
                                    </h2>
                                    <div
                                        className="prose prose-lg prose-primary max-w-none text-gray-600 font-medium leading-relaxed bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-[2rem] border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300"
                                        dangerouslySetInnerHTML={{
                                            __html: motor.description,
                                        }}
                                    />
                                </div>

                                {/* FEATURES & BENEFITS */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            icon: (
                                                <ShieldCheck className="w-6 h-6 text-white" />
                                            ),
                                            title: "Garansi 1 Thn",
                                            desc: "Perlindungan mesin harian",
                                            bgGradient:
                                                "from-blue-600 to-blue-500",
                                            borderColor: "border-blue-200",
                                        },
                                        {
                                            icon: (
                                                <FileCheck className="w-6 h-6 text-white" />
                                            ),
                                            title: "Surat Aman",
                                            desc: "STNK & BPKB ready",
                                            bgGradient:
                                                "from-green-600 to-green-500",
                                            borderColor: "border-green-200",
                                        },
                                        {
                                            icon: (
                                                <Wrench className="w-6 h-6 text-white" />
                                            ),
                                            title: "Checkup Gratis",
                                            desc: "Servis berkala pertama",
                                            bgGradient:
                                                "from-purple-600 to-purple-500",
                                            borderColor: "border-purple-200",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`group relative overflow-hidden rounded-2xl p-6 border-2 ${item.borderColor} transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-1`}
                                        >
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                            />
                                            <div className="relative space-y-4">
                                                <div
                                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - STICKY PRICE CARD */}
                        <div className="lg:w-[400px] shrink-0">
                            <div className="sticky top-32 space-y-6">
                                <Card className="rounded-[3rem] shadow-2xl shadow-gray-200/50 border-white overflow-hidden bg-white">
                                    <CardBody className="p-8 space-y-8">
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                                                Harga Jual
                                            </p>
                                            <h1 className="text-4xl font-black text-gray-900">
                                                Rp{" "}
                                                {parseInt(
                                                    motor.price,
                                                ).toLocaleString("id-ID")}
                                            </h1>
                                            {motor.tersedia && (
                                                <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest mt-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    UNIT READY STOCK
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4 pt-8 border-t border-gray-100">
                                            {motor.tersedia ? (
                                                <>
                                                    <Link
                                                        href={route(
                                                            "motors.cash-order",
                                                            motor.id,
                                                        )}
                                                        className="block group"
                                                    >
                                                        <Button
                                                            fullWidth
                                                            size="lg"
                                                            className="h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/40 transform group-hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                                        >
                                                            <ShoppingCart className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                                            <span>
                                                                Beli Cash
                                                                Sekarang
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "motors.credit-order",
                                                            motor.id,
                                                        )}
                                                        className="block group"
                                                    >
                                                        <Button
                                                            fullWidth
                                                            size="lg"
                                                            variant="secondary"
                                                            className="h-16 rounded-2xl font-black text-lg border-2 group-hover:shadow-lg transform group-hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                                        >
                                                            <FileText className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                                            <span>
                                                                Ajukan Kredit
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    size="lg"
                                                    disabled
                                                    className="h-16 rounded-2xl font-black text-lg grayscale opacity-50 cursor-not-allowed"
                                                >
                                                    Unit Sudah Terjual
                                                </Button>
                                            )}

                                            <button
                                                onClick={openWhatsApp}
                                                className="w-full h-16 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:shadow-2xl hover:shadow-green-200/50 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl group transform hover:-translate-y-1"
                                            >
                                                <Phone className="w-5 h-5 fill-white group-hover:animate-bounce transition-all" />
                                                <span>Tanya via WhatsApp</span>
                                            </button>
                                        </div>

                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                                            <div className="flex items-center gap-3 text-primary">
                                                <ShieldCheck className="w-6 h-6" />
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
                                                    Transaksi 100% Aman
                                                </p>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                                                Pembayaran dilakukan setelah
                                                verifikasi unit dan dokumen. SRB
                                                Motors menjamin keamanan data
                                                dan transaksi Anda.
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* DYNAMIC LEASING SIMULATION */}
                                {motor.tersedia && (
                                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">
                                                Simulasi Cicilan
                                            </h3>
                                            <Badge className="bg-primary/10 text-primary">
                                                ESTIMASI
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            Uang Muka (DP)
                                                        </label>
                                                        {dpAmount <
                                                            parseFloat(
                                                                motor.min_dp_amount,
                                                            ) && (
                                                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                                                Min. DP: Rp{" "}
                                                                {parseInt(
                                                                    motor.min_dp_amount,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                                                            Rp
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={dpAmount}
                                                            onChange={
                                                                handleDpChange
                                                            }
                                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl font-bold text-gray-900 focus:outline-none transition-colors ${dpAmount < parseFloat(motor.min_dp_amount) ? "border-red-200 focus:border-red-500" : "border-gray-100 focus:border-primary"}`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Tenor (Bulan)
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[12, 24, 36].map(
                                                            (t) => (
                                                                <button
                                                                    key={t}
                                                                    onClick={() =>
                                                                        setSelectedTenor(
                                                                            t,
                                                                        )
                                                                    }
                                                                    className={`py-2 rounded-xl font-black text-xs transition-all border-2 ${selectedTenor === t ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-gray-100 text-gray-400 hover:border-primary/30"}`}
                                                                >
                                                                    {t} bln
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                                    <Activity className="w-12 h-12" />
                                                </div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                                                    Estimasi Angsuran
                                                </p>
                                                <p className="text-3xl font-black text-primary">
                                                    Rp{" "}
                                                    {monthlyInstallment.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-bold mt-2 italic uppercase">
                                                    *Bunga flat 1.5% per bulan
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={route(
                                                "motors.credit-order",
                                                motor.id,
                                            )}
                                            className="flex items-center justify-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:gap-3 transition-all pt-2"
                                        >
                                            Ajukan Sekarang{" "}
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SELLER INFORMATION SECTION */}
                    <div className="mt-16 pt-12 border-t border-gray-100">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            Informasi Penjual
                        </h2>
                        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6 md:p-8 rounded-[2rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-blue-100 overflow-hidden p-2">
                                    <img 
                                        src="/assets/icon/logo trans.png" 
                                        alt="SRB Motors" 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                                        {motor.user?.name || "SRB Motors"}
                                    </h3>
                                    <div className="space-y-3 text-sm md:text-base">
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            <span>
                                                {settings.contact_whatsapp ||
                                                    "Hubungi melalui WhatsApp"}
                                            </span>
                                        </p>
                                        <p className="text-gray-600 flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>
                                                {settings.contact_address ||
                                                    "Lokasi tidak tersedia"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RELATED MOTORS SECTION */}
                    {relatedMotors?.length > 0 && (
                        <div className="mt-32 space-y-12">
                            <div className="flex items-end justify-between">
                                <div>
                                    <Badge className="mb-4 px-4 py-1.5 bg-blue-50 text-blue-600 border-none font-black text-[10px] uppercase tracking-widest">
                                        Mungkin Anda Suka
                                    </Badge>
                                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-none tracking-tight">
                                        UNIT{" "}
                                        <span className="text-primary">
                                            TERKAIT
                                        </span>
                                    </h2>
                                </div>
                                <Link
                                    href="/motors"
                                    className="hidden md:flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-sm transition-colors group"
                                >
                                    Lihat Semua{" "}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedMotors.map((m, idx) => (
                                    <Link
                                        key={m.id}
                                        href={route("motors.show", m.id)}
                                    >
                                        <Card
                                            hoverable
                                            className="h-full border-none shadow-lg hover:shadow-2xl shadow-gray-200/50 rounded-[2rem] overflow-hidden group bg-white"
                                        >
                                            <div className="relative h-48 bg-gray-50 overflow-hidden">
                                                <img
                                                    src={
                                                        m.image_path
                                                            ? `/storage/${m.image_path}`
                                                            : "/images/placeholder-motor.jpg"
                                                    }
                                                    className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-gray-500 border border-white/50 shadow-sm uppercase">
                                                    {m.brand}
                                                </div>
                                            </div>
                                            <CardBody className="p-6 space-y-3">
                                                <h4 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                                                    {m.name}
                                                </h4>
                                                <p className="text-xl font-black text-primary leading-none">
                                                    Rp{" "}
                                                    {parseInt(
                                                        m.price,
                                                    ).toLocaleString("id-ID")}
                                                </p>
                                            </CardBody>
                                        </Card>
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
