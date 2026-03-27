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
        const value = e.target.value;
        const cleaned = value.replace(/[^\d]/g, "");
        setDpAmount(parseFloat(cleaned) || 0);
    };

    // Format number untuk display: 4700000 -> 4.700.000
    const formatNumberDisplay = (numStr) => {
        if (!numStr && numStr !== 0) return "";
        const strValue = String(numStr);
        const cleanNum = strValue.replace(/[^\d]/g, "");
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const openWhatsApp = (e) => {
        e.preventDefault();
        const phoneNumber = settings.contact_phone?.replace(/\D/g, "") || "628978638849";
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
            <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70 transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-start md:flex-row md:items-end justify-between gap-8 md:gap-6">
                        <div className="space-y-4">
                            {/* BREADCRUMBS */}
                            <nav className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                <Link href="/" className="hover:text-blue-700 transition">
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                <Link
                                    href={route("motors.index")}
                                    className="hover:text-blue-700 transition"
                                >
                                    Katalog Motor
                                </Link>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                    {motor.name}
                                </span>
                            </nav>
                            
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                        Premium Unit
                                    </Badge>
                                    {!motor.tersedia && (
                                        <Badge variant="danger" className="font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                            Sudah Terjual
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                                    {motor.name.split(' ').map((word, i) => (
                                        <span key={i} className={i === 0 ? "" : "text-blue-600 dark:text-blue-400 ml-2 md:ml-3"}>
                                            {word}
                                        </span>
                                    ))}
                                </h1>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-0">
                            <Link
                                href={route("motors.index")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px] md:text-xs rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Katalog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex-grow pb-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* LEFT COLUMN - CONTENT (8 cols) */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* MAIN IMAGE CARD */}
                             <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-100 dark:border-slate-700 relative group"
                            >
                                <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-8 md:p-12 overflow-hidden">
                                    {/* Decorative Bloom */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
                                    
                                    <img
                                        src={
                                            motor.image_path
                                                ? `/storage/${motor.image_path}`
                                                : "/assets/img/no-image.png"
                                        }
                                        alt={motor.name}
                                        className="max-w-[85%] max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Brand & Type Labels */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                                        <span className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            {motor.brand}
                                        </span>
                                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                            {motor.type}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CONTENT CARD */}
                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-slate-100 dark:border-slate-700 space-y-12">
                                {/* SPECIFICATIONS */}
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                        <Info className="text-blue-600" size={24} />
                                        Spesifikasi Utama
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                                        {[
                                            { icon: <Calendar size={20} />, label: "Tahun", value: motor.year, color: "text-blue-600" },
                                            { 
                                                icon: <Palette size={20} />, 
                                                label: "Warna", 
                                                value: Array.isArray(motor.colors) && motor.colors.length > 0 
                                                    ? motor.colors.join(", ") 
                                                    : "Beragam", 
                                                color: "text-purple-600" 
                                            },
                                            { icon: <Settings size={20} />, label: "Transmisi", value: motor.type?.toLowerCase().includes("matic") ? "Matic" : "Manual", color: "text-orange-600" },
                                            { icon: motor.tersedia ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />, label: "Status", value: motor.tersedia ? "Tersedia" : "Terjual", color: motor.tersedia ? "text-green-600" : "text-red-600" }
                                        ].map((spec, i) => (
                                            <div key={i} className="flex flex-col items-center md:items-start gap-2">
                                                <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center ${spec.color}`}>
                                                    {spec.icon}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {spec.label}
                                                    </p>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white">
                                                        {spec.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-700">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                        <FileText className="text-blue-600" size={24} />
                                        Informasi Detail
                                    </h3>
                                    <div
                                        className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed
                                            prose-p:mb-4 prose-li:mb-2 prose-strong:text-slate-900 dark:prose-strong:text-white"
                                        dangerouslySetInnerHTML={{
                                            __html: motor.description,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* FEATURES GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: <ShieldCheck size={28} />, title: "Garansi Mesin", desc: "Jaminan 1 tahun unit", color: "bg-blue-600" },
                                    { icon: <FileCheck size={28} />, title: "Surat Lengkap", desc: "STNK & BPKB ready", color: "bg-emerald-600" },
                                    { icon: <Wrench size={28} />, title: "Full Service", desc: "Gratis servis pertama", color: "bg-orange-600" }
                                ].map((benefit, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md group">
                                        <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${benefit.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                                            {benefit.icon}
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{benefit.title}</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{benefit.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN - STICKY SIDEPANE (4 cols) */}
                        <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                            {/* PRICE CARD */}
                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Harga Jual Cash</p>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Rp {parseInt(motor.price).toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {motor.tersedia ? (
                                        <>
                                            <Link href={route("motors.cash-order", motor.id)} className="block">
                                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3">
                                                    <ShoppingCart size={20} />
                                                    BELI SEKARANG
                                                </button>
                                            </Link>
                                            <Link href={route("motors.credit-order", motor.id)} className="block">
                                                <button className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 text-sm">
                                                    <FileText size={20} />
                                                    AJUKAN KREDIT
                                                </button>
                                            </Link>
                                        </>
                                    ) : (
                                        <button disabled className="w-full bg-slate-100 dark:bg-slate-700 text-slate-400 font-black py-4 rounded-2xl cursor-not-allowed">
                                            UNIT TERJUAL
                                        </button>
                                    )}
                                    <button 
                                        onClick={openWhatsApp}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
                                    >
                                        <Phone size={20} className="fill-white" />
                                        CHAT WHATSAPP
                                    </button>
                                </div>
                            </div>

                            {/* FINANCING SIMULATION */}
                            {motor.tersedia && (
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-blue-100/70">Simulasi Kredit</h3>
                                            <Badge className="bg-blue-500/30 text-blue-200 border-none">ESTIMASI</Badge>
                                        </div>

                                        <div className="space-y-6">
                                            {/* DP Input */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                                                    <span>Uang Muka (DP)</span>
                                                    {dpAmount < parseFloat(motor.min_dp_amount) && <span className="text-red-400">Min. DP required</span>}
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">Rp</span>
                                                    <input 
                                                        type="text"
                                                        value={formatNumberDisplay(dpAmount)}
                                                        onChange={handleDpChange}
                                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 font-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tenor Select */}
                                            <div className="space-y-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Tenor (Bulan)</span>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[12, 24, 36].map((t) => (
                                                        <button 
                                                            key={t}
                                                            onClick={() => setSelectedTenor(t)}
                                                            className={`py-2.5 rounded-xl text-xs font-black transition-all ${selectedTenor === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                                        >
                                                            {t} bln
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Monthly Result */}
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Angsuran / Bulan</p>
                                                <div className="flex items-baseline justify-center gap-2">
                                                    <span className="text-3xl font-black text-white tracking-tight">
                                                        Rp {monthlyInstallment.toLocaleString("id-ID")}
                                                    </span>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">*Bunga Flat 1.5% - OTR Bekasi</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* SELLER INFORMATION CARD - REPOSITIONED */}
                             <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-[2.5rem] border border-blue-100 dark:border-slate-700 shadow-lg">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Informasi Penjual</h4>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-md border-2 border-blue-100 dark:border-slate-600 overflow-hidden p-2">
                                        <img 
                                            src="/assets/icon/logo trans.png" 
                                            alt="SRB Motors" 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                                            {motor.user?.name || "SRB Motors"}
                                        </h3>
                                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Verified Dealer</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-xs font-medium">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        <span>{settings.contact_phone || "+62 897 8638 849"}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{settings.contact_address || "Bekasi, Jawa Barat"}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
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
                                                            : "/assets/img/no-image.png"
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
