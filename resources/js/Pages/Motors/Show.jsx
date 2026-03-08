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
    Activity,
    ShoppingCart,
    FileText,
    Phone,
} from "lucide-react";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";

export default function Show({ motor, relatedMotors }) {
    const { auth } = usePage().props;
    const [selectedProviderId, setSelectedProviderId] = React.useState(
        motor.financing_schemes?.[0]?.provider_id || null,
    );
    const [selectedTenor, setSelectedTenor] = React.useState(
        motor.financing_schemes?.[0]?.tenor || null,
    );

    const schemesByProvider = React.useMemo(() => {
        if (!motor.financing_schemes) return {};
        return motor.financing_schemes.reduce((acc, scheme) => {
            const providerId = scheme.provider_id;
            if (!acc[providerId]) {
                acc[providerId] = {
                    provider: scheme.provider,
                    schemes: [],
                };
            }
            acc[providerId].schemes.push(scheme);
            return acc;
        }, {});
    }, [motor.financing_schemes]);

    const activeProvider = schemesByProvider[selectedProviderId];
    const activeScheme =
        activeProvider?.schemes.find((s) => s.tenor === selectedTenor) ||
        activeProvider?.schemes[0];

    React.useEffect(() => {
        if (activeProvider && !activeScheme) {
            setSelectedTenor(activeProvider.schemes[0]?.tenor);
        }
    }, [selectedProviderId, activeProvider, activeScheme]);

    const openWhatsApp = (e) => {
        e.preventDefault();
        const phoneNumber = "6281234567890";
        const message = encodeURIComponent(
            `Halo SRB Motors, saya tertarik dengan unit ${
                motor.name
            } (Rp ${parseFloat(motor.price).toLocaleString("id-ID")}). Bisa minta info lebih lanjut?`,
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <PublicLayout auth={auth} title={`${motor.name} - SRB Motors`}>
            <div className="flex-grow pt-24 md:pt-[104px] pb-20">
                {/* BREADCRUMBS & BACK BUTTON */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <Link
                                href="/"
                                className="hover:text-primary transition-colors"
                            >
                                HOME
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link
                                href={route("motors.index")}
                                className="hover:text-primary transition-colors uppercase"
                            >
                                KATALOG
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-gray-900 uppercase truncate max-w-[150px] md:max-w-none">
                                {motor.name}
                            </span>
                        </div>
                        <Link
                            href={route("motors.index")}
                            className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-primary transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" /> KEMBALI
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                        {/* LEFT COLUMN - CONTENT */}
                        <div className="flex-grow space-y-8">
                            {/* MAIN IMAGE CARD */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white"
                            >
                                <div className="relative aspect-[16/10] md:aspect-[16/9] bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8 md:p-12">
                                    <img
                                        src={
                                            motor.image_path
                                                ? `/storage/${motor.image_path}`
                                                : "/images/placeholder-motor.jpg"
                                        }
                                        alt={motor.name}
                                        className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                    />

                                    {/* Brand & Type Labels */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-3">
                                        <div className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl">
                                            {motor.brand}
                                        </div>
                                        <div className="bg-white text-primary px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-primary/10 shadow-xl shadow-gray-200/50">
                                            {motor.type}
                                        </div>
                                    </div>

                                    {/* Ribbons */}
                                    {motor.promotions?.length > 0 && (
                                        <div className="absolute bottom-10 left-0 flex flex-col gap-3 pointer-events-none">
                                            {motor.promotions.map(
                                                (promo, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gradient-to-r from-primary to-blue-900 text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-8 py-4 rounded-r-full shadow-2xl border-l-[6px] border-white/50 flex items-center gap-3 transform -translate-x-1"
                                                    >
                                                        <Star className="w-4 h-4 fill-white animate-pulse" />
                                                        {promo.badge_text ||
                                                            promo.title}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* DETAIL SPECIFICATIONS TABS (Conceptually) */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/20 border border-white space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                                        <Info className="w-6 h-6 text-primary" />{" "}
                                        Informasi Kendaraan
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="space-y-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                Tahun
                                            </p>
                                            <p className="text-lg font-black text-gray-900">
                                                {motor.year}
                                            </p>
                                        </div>
                                        <div className="space-y-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                Warna
                                            </p>
                                            <p className="text-lg font-black text-gray-900">
                                                {motor.color || "Beragam"}
                                            </p>
                                        </div>
                                        <div className="space-y-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                Transmisi
                                            </p>
                                            <p className="text-lg font-black text-gray-900 uppercase">
                                                {motor.type?.includes("matic")
                                                    ? "Otomatis"
                                                    : "Manual"}
                                            </p>
                                        </div>
                                        <div className="space-y-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
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

                                <div className="space-y-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                                        <PenTool className="w-6 h-6 text-primary" />{" "}
                                        Deskripsi & Catatan
                                    </h2>
                                    <div
                                        className="prose prose-lg prose-primary max-w-none text-gray-600 font-medium leading-relaxed bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100"
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
                                                <ShieldCheck className="w-6 h-6 text-primary" />
                                            ),
                                            title: "Garansi 1 Thn",
                                            desc: "Perlindungan mesin harian",
                                        },
                                        {
                                            icon: (
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                            ),
                                            title: "Surat Aman",
                                            desc: "STNK & BPKB ready",
                                        },
                                        {
                                            icon: (
                                                <Activity className="w-6 h-6 text-primary" />
                                            ),
                                            title: "Checkup Gratis",
                                            desc: "Servis berkala pertama",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-white border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - STICKY PRICE CARD */}
                        <div className="lg:w-[400px] shrink-0">
                            <div className="sticky top-32 space-y-6">
                                <Card className="rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border-white overflow-hidden bg-white">
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

                                        <div className="space-y-4 pt-8 border-t border-gray-50">
                                            {motor.tersedia ? (
                                                <>
                                                    <Link
                                                        href={route(
                                                            "motors.cash-order",
                                                            motor.id,
                                                        )}
                                                        className="block"
                                                    >
                                                        <Button
                                                            fullWidth
                                                            size="lg"
                                                            className="h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group flex items-center justify-center gap-3"
                                                        >
                                                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                                                        className="block"
                                                    >
                                                        <Button
                                                            fullWidth
                                                            size="lg"
                                                            variant="secondary"
                                                            className="h-16 rounded-2xl font-black text-lg border-2 group flex items-center justify-center gap-3"
                                                        >
                                                            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                                                className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-200/50 group"
                                            >
                                                <Phone className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
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

                                {/* LEASING QUICK SIMULATION (If available) */}
                                {motor.financing_schemes?.length > 0 && (
                                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-white space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">
                                                Simulasi Cicilan
                                            </h3>
                                            <Badge className="bg-primary/10 text-primary">
                                                ESTIMASI
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                        Uang Muka (DP)
                                                    </p>
                                                    <p className="font-black text-gray-900">
                                                        Rp{" "}
                                                        {parseInt(
                                                            activeScheme?.dp_amount ||
                                                                0,
                                                        ).toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                        Tenor
                                                    </p>
                                                    <p className="font-black text-gray-900">
                                                        {activeScheme?.tenor}{" "}
                                                        Bulan
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                                                    Angsuran Per Bulan
                                                </p>
                                                <p className="text-2xl font-black text-primary">
                                                    Rp{" "}
                                                    {parseInt(
                                                        activeScheme?.monthly_installment ||
                                                            0,
                                                    ).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={route(
                                                "motors.credit-order",
                                                motor.id,
                                            )}
                                            className="flex items-center justify-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:gap-3 transition-all"
                                        >
                                            Sesuaikan simulasi{" "}
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RELATED MOTORS SECTION */}
                    {relatedMotors?.length > 0 && (
                        <div className="mt-32 space-y-12">
                            <div className="flex items-end justify-between">
                                <div>
                                    <Badge className="mb-3">
                                        Mungkin Anda Suka
                                    </Badge>
                                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-none">
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
