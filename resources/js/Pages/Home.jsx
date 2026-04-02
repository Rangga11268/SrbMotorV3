import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    Star,
    ShieldCheck,
    Truck,
    Clock,
    ArrowRight,
    Search,
    MapPin,
    Bike,
    MessageCircle,
    Gauge,
    Phone,
    AlertCircle,
    Mail,
} from "lucide-react";

export default function Home({
    auth,
    popularMotors = [],
    brandAvailability = {},
    settings = {},
    news = [],
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const { data, setData, post, processing, reset } = useForm({});

    const brandLogos = {
        Honda: "/assets/img/honda/Honda-Beat-Sporty-Deluxe-SmartKey-Matte-Black.png",
        Yamaha: "/assets/img/yamaha/aerox_155.png",
    };

    const brands = [
        {
            name: "Honda",
            logo: brandLogos.Honda,
            available: brandAvailability.Honda?.available ?? false,
        },
        {
            name: "Yamaha",
            logo: brandLogos.Yamaha,
            available: brandAvailability.Yamaha?.available ?? false,
        },
    ];

    const formatPrice = (price) => parseInt(price).toLocaleString("id-ID");

    return (
        <PublicLayout title="Beranda">
            {/* HERO SLIDER SECTION (BMW Cinematic Style) */}
            <section className="relative w-full pt-20 min-h-[90vh] bg-[#111111] overflow-hidden flex flex-col justify-center">
                {/* Full Bleed Image (Cinematic lighting) */}
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                    <img
                        src="/assets/img/banner.png"
                        alt="SRB Motor Showcase"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#111111]/80 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12">
                    <div className="max-w-3xl space-y-8">
                        <div className="space-y-4">
                            <span className="text-[#1c69d4] uppercase tracking-[0.2em] text-xs font-bold font-sans">
                                Dealer Resmi & Terpercaya
                            </span>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] text-white font-light uppercase leading-[1.1] tracking-tight">
                                Tentukan
                                <br />
                                KENDARAAN
                                <br />
                                <span className="text-white font-bold">
                                    ANDA.
                                </span>
                            </h1>
                            <p className="text-[#bbbbbb] text-lg font-sans leading-relaxed max-w-xl">
                                Rasakan sensasi berkendara dengan unit terbaik
                                dari SRB Motor. Performa maksimal untuk
                                perjalanan tak terbatas.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Link href="/motors">
                                <button className="w-full sm:w-auto relative px-10 py-4 bg-[#ffffff] text-[#262626] font-bold uppercase text-xs tracking-widest transition-colors hover:bg-[#1c69d4] hover:text-white rounded-none border border-transparent shadow-none flex items-center justify-center gap-3">
                                    Lihat Koleksi
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <a
                                href={`https://wa.me/${(settings.contact_phone || "628978638849").replace(/\D/g, "")}`}
                                target="_blank"
                                className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border border-white font-bold uppercase text-xs tracking-widest transition-colors hover:bg-white hover:text-[#262626] rounded-none shadow-none flex items-center justify-center gap-3"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK SEARCH SECTION (Sharp Block) */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/3 space-y-2">
                        <h3 className="text-2xl font-light uppercase tracking-tight text-[#262626]">
                            Pencarian Cepat
                        </h3>
                        <p className="text-[#757575] text-sm">
                            Temukan unit spesifik
                        </p>
                    </div>
                    <div className="flex-1 w-full max-w-2xl">
                        <div className="flex flex-col sm:flex-row shadow-sm border border-gray-300 rounded-none bg-white">
                            <div className="flex-1 flex items-center px-4 py-2">
                                <Search className="w-5 h-5 text-[#b0b0b0] mr-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            searchQuery.trim()
                                        ) {
                                            router.get("/motors", {
                                                search: searchQuery,
                                            });
                                        }
                                    }}
                                    placeholder="Cth: NMAX, Beat, PCX..."
                                    className="w-full border-none focus:ring-0 text-base text-[#262626] bg-transparent py-3 placeholder:text-[#bbbbbb] font-sans"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        router.get("/motors", {
                                            search: searchQuery,
                                        });
                                    }
                                }}
                                className="px-8 py-4 bg-[#1c69d4] hover:bg-[#0653b6] text-white font-bold uppercase text-xs tracking-widest transition-colors rounded-none"
                            >
                                Cari Unit
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* MEREK UNGGULAN SECTION (Zero border radius) */}
            <section className="py-24 bg-[#f4f4f4]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-light text-[#262626] uppercase tracking-tight">
                                Merek{" "}
                                <span className="font-bold">Unggulan</span>
                            </h2>
                        </div>
                        <Link
                            href="/motors"
                            className="text-[#1c69d4] font-bold uppercase text-xs tracking-widest hover:text-[#0653b6] transition-colors flex items-center gap-2"
                        >
                            Eksplorasi Katalog{" "}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {brands.map((brand, index) => (
                            <Link
                                key={index}
                                href={`/motors?brand=${brand.name}`}
                                className={`relative group p-12 bg-white border border-gray-200 transition-colors duration-300 flex flex-col items-center justify-center min-h-[300px] overflow-hidden rounded-none ${
                                    !brand.available
                                        ? "opacity-50"
                                        : "hover:border-[#262626]"
                                }`}
                            >
                                <div className="absolute inset-0 bg-[#f9f9f9] transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-0"></div>
                                <div className="relative z-10 lg:w-48 lg:h-48 w-32 h-32 mb-8 flex items-center justify-center">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <h3 className="relative z-10 text-2xl font-light text-[#262626] uppercase tracking-widest">
                                    {brand.name}
                                </h3>

                                {!brand.available && (
                                    <div className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-none">
                                        Stok Kosong
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPULAR MOTORS (Sharp Geometry, Tight Layout) */}
            <section className="py-24 bg-white border-t border-gray-200">
                <div className="max-w-full mx-auto px-6 lg:px-12 xl:px-24">
                    <div className="mb-16">
                        <h2 className="text-4xl font-light text-[#262626] uppercase tracking-tight">
                            Unit <span className="font-bold">Populer</span>
                        </h2>
                    </div>

                    {popularMotors.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50 border border-gray-200 rounded-none">
                            <p className="text-[#757575] uppercase text-sm font-bold tracking-widest">
                                Data belum tersedia
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {popularMotors.slice(0, 4).map((motor, idx) => (
                                <Link
                                    key={motor.id}
                                    href={route("motors.show", motor.id)}
                                    className="group block"
                                >
                                    <div className="flex flex-col h-full rounded-none bg-white group-hover:bg-[#f9f9f9] transition-colors border border-transparent group-hover:border-gray-200 p-6 relative">
                                        {/* Status & Promo Badges - Sharp Rectangles */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                                            {!motor.tersedia && (
                                                <div className="bg-[#262626] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-transparent shadow-none rounded-none">
                                                    Terjual
                                                </div>
                                            )}
                                            {motor.promotions?.map(
                                                (promo, pIdx) => (
                                                    <div
                                                        key={pIdx}
                                                        className="bg-[#1c69d4] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-none"
                                                    >
                                                        {promo.badge_text ||
                                                            "PROMO"}
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <div className="relative h-56 mb-8 mt-6">
                                            <img
                                                src={
                                                    motor.image_path
                                                        ? `/storage/${motor.image_path}`
                                                        : "/assets/img/no-image.png"
                                                }
                                                className={`w-full h-full object-contain filter transition-transform duration-700 ease-out group-hover:scale-105 ${
                                                    !motor.tersedia
                                                        ? "opacity-30 grayscale"
                                                        : ""
                                                }`}
                                            />
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="text-[10px] text-[#757575] font-bold uppercase tracking-widest">
                                                {motor.brand} • {motor.year}
                                            </div>
                                            <h3 className="text-xl font-bold text-[#262626] uppercase leading-tight line-clamp-1">
                                                {motor.name}
                                            </h3>

                                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                                <div className="text-lg font-light text-[#262626]">
                                                    IDR{" "}
                                                    {formatPrice(motor.price)}
                                                </div>
                                                <div className="w-8 h-8 flex items-center justify-center text-[#1c69d4] border border-[#1c69d4] group-hover:bg-[#1c69d4] group-hover:text-white transition-colors duration-300">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* TRUST INDICATORS SECTION (Strict black on white) */}
            <section className="py-24 bg-[#111111] text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-3 gap-16 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                        {[
                            {
                                icon: (
                                    <ShieldCheck className="w-10 h-10 mb-6 text-[#1c69d4]" />
                                ),
                                title: "GARANSI RESMI",
                                desc: "Komitmen kami pada kualitas. Garansi penuh sesuai ketentuan pabrikan untuk setiap unit.",
                            },
                            {
                                icon: (
                                    <Clock className="w-10 h-10 mb-6 text-[#1c69d4]" />
                                ),
                                title: "PROSES EFISIEN",
                                desc: "Persetujuan pembiayaan yang instan. Bekerja sama dengan sistem terpadu.",
                            },
                            {
                                icon: (
                                    <Truck className="w-10 h-10 mb-6 text-[#1c69d4]" />
                                ),
                                title: "PENGIRIMAN UNIT",
                                desc: "Distribusi kendaraan diantarkan langsung ke kediaman Anda di seluruh cover area.",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center px-4 pt-10 md:pt-0"
                            >
                                {item.icon}
                                <h4 className="text-lg font-light uppercase tracking-[0.2em] mb-4">
                                    {item.title}
                                </h4>
                                <p className="text-[#bbbbbb] font-sans text-sm leading-relaxed max-w-xs">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWS & ARTICLES SECTION */}
            <section className="py-24 bg-[#f4f4f4] border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-end mb-16 border-b border-gray-300 pb-6">
                        <h2 className="text-4xl font-light text-[#262626] uppercase tracking-tight">
                            Info <span className="font-bold">Otomotif</span>
                        </h2>
                        <Link
                            href="/berita"
                            className="text-xs font-bold text-[#262626] uppercase tracking-widest hover:text-[#1c69d4] transition-colors flex items-center gap-2"
                        >
                            Selengkapnya <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {news.length === 0 ? (
                            <p className="text-[#757575] text-sm uppercase tracking-widest">
                                Informasi belum tesedia.
                            </p>
                        ) : (
                            news.slice(0, 3).map((item, idx) => (
                                <Link
                                    key={item.id}
                                    href={route("berita.show", item.slug)}
                                    className="group block"
                                >
                                    <div className="relative h-[250px] bg-black overflow-hidden rounded-none mb-6">
                                        <img
                                            src={
                                                item.featured_image
                                                    ? item.featured_image.startsWith(
                                                          "http",
                                                      )
                                                        ? new URL(
                                                              item.featured_image,
                                                          ).pathname
                                                        : item.featured_image
                                                    : "/assets/img/no-image.png"
                                            }
                                            alt={item.title}
                                            className="w-full h-full object-cover transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/assets/img/no-image.png";
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-[10px] text-[#757575] font-bold uppercase tracking-widest border-l-2 border-[#1c69d4] pl-2">
                                            {item.category?.name || "UMUM"} •{" "}
                                            {new Date(
                                                item.published_at ||
                                                    item.created_at,
                                            ).toLocaleDateString("id-ID")}
                                        </div>
                                        <h3 className="text-xl font-bold text-[#262626] leading-snug group-hover:text-[#1c69d4] transition-colors line-clamp-2 uppercase">
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* CONTACT / FOOTER BANNER */}
            <section className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 bg-[#262626] p-12 lg:p-20 relative overflow-hidden rounded-none">
                        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
                            <span className="text-[200px] leading-none absolute -right-10 -top-10 font-bold">
                                SRB
                            </span>
                        </div>
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl text-white font-light uppercase tracking-wide leading-tight mb-6">
                                Hubungi{" "}
                                <span className="font-bold">
                                    Konsultan Kami
                                </span>
                            </h2>
                            <p className="text-[#bbbbbb] font-sans">
                                Hubungi {settings.site_name || "SRB Motors"}{" "}
                                untuk konsultasi pemesanan, simulasi kredit,
                                maupun layanan purna jual kendaraan Anda.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <a
                                href={`https://wa.me/${(settings.contact_phone || "628978638849").replace(/\D/g, "")}`}
                                target="_blank"
                                className="px-8 py-4 bg-[#1c69d4] text-white hover:bg-[#0653b6] transition-colors uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-3"
                            >
                                <Phone className="w-4 h-4" /> Whatsapp
                            </a>
                            <a
                                href={`mailto:${settings.contact_email || "halo@srbmotor.id"}`}
                                className="px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-colors uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-3"
                            >
                                <Mail className="w-4 h-4" /> Email
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
