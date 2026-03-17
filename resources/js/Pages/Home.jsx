import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    ChevronRight,
    Star,
    ShieldCheck,
    Truck,
    Clock,
    ArrowRight,
    Search,
    MapPin,
    Smartphone,
    Mail,
    Phone,
    Send,
    Bike,
    MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Home({ auth, popularMotors = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const { data, setData, post, processing, reset } = useForm({});

    const brands = [
        {
            name: "Honda",
            logo: "/assets/img/honda/Honda-Beat-Sporty-Deluxe-SmartKey-Matte-Black.png",
        }, // Mockup for logo
        { name: "Yamaha", logo: "/assets/img/honda/pcx 160.png" },
        { name: "Kawasaki", logo: "/assets/img/honda/adv 160.png" },
        { name: "Suzuki", logo: "/assets/img/honda/stylo.png" },
    ];

    return (
        <PublicLayout title="Beranda">
            {/* HERO SLIDER SECTION (Momotor Style) */}
            <section className="relative pt-[120px] md:pt-[140px] pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full h-[300px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
                        <img
                            src="/assets/img/banner.png"
                            alt="SRB Motor Hero"
                            className="relative w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 flex items-center p-8 md:px-24 md:py-0">
                            <div className="max-w-3xl space-y-6 pb-20 md:pb-28">
                                <div className="space-y-4 md:space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 border border-blue-400 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
                                            Trusted Dealer 2026
                                        </span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                                        <span className="text-blue-400">Selamat </span>
                                        <span className="text-blue-400">Datang </span>
                                        <span className="text-white">di SRB Motor</span>
                                    </h1>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-medium max-w-xl leading-relaxed drop-shadow-lg">
                                        Temukan motor impian Anda dengan layanan terbaik dari kami.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3 sm:gap-5 pt-4">
                                    <Link href="/motors">
                                        <button className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-2xl font-black text-sm sm:text-lg transition-all hover:pr-12 sm:hover:pr-14 hover:bg-blue-50 shadow-xl">
                                            <span className="relative z-10">Lihat Katalog</span>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <ArrowRight className="w-6 h-6 translate-x-4 group-hover:translate-x-0 transition-transform" />
                                            </div>
                                        </button>
                                    </Link>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-2xl font-bold text-sm sm:text-lg backdrop-blur-md transition-all hover:bg-white/10 flex items-center gap-2 sm:gap-3"
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        Konsultasi Gratis
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Search & Categories Overlay */}
                    <div className="relative -mt-12 md:-mt-20 z-20 px-4 sm:px-8 md:px-12">
                        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 md:p-12 border border-blue-50 max-w-5xl mx-auto transform transition-all hover:scale-[1.01]">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                {/* Search Component */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 sm:gap-4">
                                            <div className="p-2 bg-blue-100 rounded-xl">
                                                <Search className="w-6 h-6 text-blue-600" />
                                            </div>
                                            Cari Motor Impianmu
                                        </h3>
                                    </div>

                                    <div className="relative group">
                                        <div className="flex gap-2 sm:gap-3 p-3 bg-gray-50 border-2 border-transparent group-focus-within:border-blue-500 group-focus-within:bg-white rounded-3xl transition-all duration-300 shadow-inner">
                                            <div className="flex-1 flex items-center px-3 sm:px-4 gap-3 sm:gap-4">
                                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                    <Bike className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-focus-within:text-blue-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Lagi cari Honda PCX atau NMAX? Ketik di sini..."
                                                    className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-base md:text-lg font-bold py-2 sm:py-4 text-gray-800 placeholder:text-gray-400"
                                                />
                                            </div>
                                            <Button
                                                size="lg"
                                                className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-auto rounded-[1.25rem] font-black shadow-xl bg-blue-600 hover:bg-blue-500 hover:shadow-2xl active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap"
                                            >
                                                Cari
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Popular Searches */}
                                    <div className="flex items-center flex-wrap gap-2 sm:gap-3 pt-2">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Populer:
                                        </span>
                                        {[
                                            "Beat",
                                            "PCX",
                                            "NMAX",
                                            "Vario",
                                            "Aerox",
                                        ].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() =>
                                                    setSearchQuery(tag)
                                                }
                                                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 rounded-full text-xs sm:text-sm font-bold text-gray-600 transition-all active:scale-90 flex-shrink-0"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Shortcuts */}
                                <div className="md:w-80 flex flex-row md:flex-col gap-3 md:gap-4 mt-6 md:mt-0">
                                    <Link
                                        href="/motors"
                                        className="flex-1 group"
                                    >
                                        <div className="h-full p-6 bg-blue-50 hover:bg-blue-600 border border-blue-100 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-200 group-hover:-translate-y-1">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                                <Bike className="w-7 h-7" />
                                            </div>
                                            <span className="font-black text-gray-900 group-hover:text-white transition-colors text-xs uppercase tracking-widest">
                                                Motor Baru
                                            </span>
                                        </div>
                                    </Link>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        className="flex-1 group"
                                    >
                                        <div className="h-full p-6 bg-blue-50 hover:bg-blue-600 border border-blue-100 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-200 group-hover:-translate-y-1">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                                <MessageCircle className="w-7 h-7" />
                                            </div>
                                            <span className="font-black text-gray-900 group-hover:text-white transition-colors text-xs uppercase tracking-widest">
                                                Konsultasi WA
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MEREK UNGGULAN SECTION */}
            <section className="py-12 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-4xl font-black text-gray-900">
                                Merek Unggulan
                            </h2>
                            <p className="text-gray-500 font-medium">
                                Temukan motor impian Anda dari brand ternama
                            </p>
                        </div>
                        <Link
                            href="/motors"
                            className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:gap-3 transition-all"
                        >
                            Lihat Semua <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {brands.map((brand, index) => (
                            <Link
                                key={index}
                                href={`/motors?brand=${brand.name}`}
                                className="group relative p-6 md:p-10 rounded-2xl md:rounded-[32px] bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/30 hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center overflow-hidden"
                            >
                                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 mb-4 flex items-center justify-center">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <span className="relative z-10 text-xl md:text-2xl font-black text-gray-300 group-hover:text-primary transition-colors">
                                    {brand.name}
                                </span>

                                {/* Background Decorative Element */}
                                <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPULAR MOTORS (Already styled with ribbons from Phase 6) */}
            <section className="py-20 bg-[#F8F9FA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <Badge className="mb-3">Sedang Tren</Badge>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-none">
                                MOTOR{" "}
                                <span className="text-primary">POPULER</span>
                            </h2>
                        </div>
                        <Link
                            href="/motors"
                            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-sm transition-colors group"
                        >
                            Lihat Selengkapnya{" "}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {popularMotors.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <h3 className="text-xl font-bold text-gray-500 mb-2">
                                Tidak Ada Motor Populer
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Motor populer akan ditampilkan setelah ada data
                                yang tersedia.
                            </p>
                            <Link
                                href="/motors"
                                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            >
                                Lihat Semua Motor
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {popularMotors.slice(0, 4).map((motor, idx) => (
                                <motion.div
                                    key={motor.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={route("motors.show", motor.id)}>
                                        <Card
                                            hoverable
                                            className="h-full border-none shadow-xl hover:shadow-2xl shadow-gray-200/50 rounded-[2rem] overflow-hidden group bg-white"
                                        >
                                            <div className="relative h-60 bg-gray-100 overflow-hidden">
                                                <img
                                                    src={`/storage/${motor.image_path}`}
                                                    className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                                {/* Ribbon logic from Phase 6 */}
                                                {motor.promotions?.length >
                                                    0 && (
                                                    <div className="absolute top-4 left-0 flex flex-col gap-2 z-10 pointer-events-none">
                                                        {motor.promotions.map(
                                                            (promo, pIdx) => (
                                                                <div
                                                                    key={pIdx}
                                                                    className="bg-gradient-to-r from-primary to-primary-dark text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-r-full shadow-lg border border-white/20"
                                                                >
                                                                    <Star className="w-3 h-3 inline-block mr-1 -mt-0.5 fill-white" />
                                                                    {promo.badge_text ||
                                                                        promo.title}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-gray-500 border border-white/50 shadow-sm uppercase">
                                                    {motor.brand}
                                                </div>
                                            </div>
                                            <CardBody className="p-8 space-y-4">
                                                <h3 className="text-2xl font-black text-gray-900 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                                                    {motor.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                    <span className="flex items-center gap-1 uppercase tracking-wider">
                                                        <Zap className="w-3 h-3 text-blue-500 fill-blue-500" />{" "}
                                                        {motor.type}
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                                    <span className="flex items-center gap-1 uppercase tracking-wider">
                                                        <Clock className="w-3 h-3" />{" "}
                                                        {motor.year}
                                                    </span>
                                                </div>
                                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                            Harga Mulai
                                                        </p>
                                                        <p className="text-2xl font-black text-primary leading-none">
                                                            Rp{" "}
                                                            {parseInt(
                                                                motor.price,
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                                                        <ArrowRight className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* TRUST INDICATORS SECTION */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: (
                                    <ShieldCheck className="w-12 h-12 text-primary" />
                                ),
                                title: "Garansi Resmi",
                                desc: "Setiap unit bergaransi pabrikan resmi demi ketenangan berkendara Anda.",
                            },
                            {
                                icon: (
                                    <Clock className="w-12 h-12 text-primary" />
                                ),
                                title: "Proses Kilat",
                                desc: "Persetujuan kredit instan dengan mitra leasing terpercaya (BAF, Astra, dll).",
                            },
                            {
                                icon: (
                                    <Truck className="w-12 h-12 text-primary" />
                                ),
                                title: "Home Delivery",
                                desc: "Motor diantar langsung ke depan rumah Anda tanpa biaya tambahan.",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center space-y-4 group"
                            >
                                <div className="p-6 rounded-[2rem] bg-gray-50 group-hover:bg-primary/5 transition-colors group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {item.title}
                                </h4>
                                <p className="text-gray-500 font-medium leading-relaxed max-w-[280px]">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="section-py relative overflow-hidden" id="contact">
                {/* Subtle Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl opacity-50" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                                    Hubungi Kami
                                </span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1]">
                                    Punya <span className="text-primary italic">Pertanyaan?</span>
                                </h2>
                                <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Tim expert kami siap membantu Anda 24/7.
                                    Konsultasikan pilihan motor dan simulasi
                                    kredit Anda secara gratis.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-bold text-gray-700">Online 24/7</span>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-bold text-gray-700">Respon Cepat</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <a
                                href="https://wa.me/6281212345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-2 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 hover:border-primary/20"
                            >
                                <div className="flex items-center gap-6 p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500">
                                        <Phone className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                                            Whatsapp Bekasi
                                        </p>
                                        <p className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">
                                            0812-1234-5678
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </a>

                            <a
                                href="mailto:halo@srbmotor.id"
                                className="group p-2 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 hover:border-primary/20"
                            >
                                <div className="flex items-center gap-6 p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                                            Layanan Email
                                        </p>
                                        <p className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">
                                            halo@srbmotor.id
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
