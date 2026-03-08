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
    const { data, setData, post, processing, reset } = useForm({
        name: "",
        email: "",
        message: "",
    });

    const submitContact = (e) => {
        e.preventDefault();
        post(route("contact.submit"), {
            onSuccess: () => {
                toast.success("Pesan berhasil dikirim!");
                reset();
            },
            onError: () => toast.error("Gagal mengirim pesan."),
        });
    };

    const banners = [
        {
            image: "/assets/img/banner.png",
            title: "Promo Kredit Motor Honda 2026",
            subtitle: "DP Mulai 1 Jutaan, Angsuran Ringan & Proses Cepat",
        },
        {
            image: "/assets/img/banner.png", // Reusing for demo, in real scenarios these would be different
            title: "Gebyar Yamaha Awal Tahun",
            subtitle:
                "Dapatkan Cashback hingga 5 Juta Rupiah untuk unit tertentu",
        },
    ];

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
        <PublicLayout auth={auth} title="Beranda">
            {/* HERO SLIDER SECTION (Momotor Style) */}
            <section className="relative pt-[120px] md:pt-[140px] pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Swiper
                        modules={[Autoplay, Pagination, EffectFade]}
                        effect="fade"
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        className="rounded-3xl overflow-hidden h-[300px] md:h-[520px] shadow-2xl border border-gray-100"
                    >
                        {banners.map((banner, index) => (
                            <SwiperSlide key={index}>
                                {({ isActive }) => (
                                    <div className="relative w-full h-full group overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="relative w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                                            onLoad={(e) =>
                                                e.target.previousSibling.remove()
                                            }
                                        />
                                        {/* High-Contrast Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 flex items-center p-8 md:px-24 md:py-0">
                                            <AnimatePresence mode="wait">
                                                {isActive && (
                                                    <div className="max-w-3xl space-y-6 pb-20 md:pb-28">
                                                        <div className="space-y-4 md:space-y-6">
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -20,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                }}
                                                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 border border-blue-400 shadow-lg"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
                                                                    Trusted
                                                                    Dealer 2026
                                                                </span>
                                                            </motion.div>

                                                            <motion.h1
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: -50,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    x: 50,
                                                                }}
                                                                transition={{
                                                                    duration: 0.7,
                                                                    ease: "easeOut",
                                                                }}
                                                                className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                                                            >
                                                                {banner.title
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            word,
                                                                            i,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={
                                                                                    i <
                                                                                    2
                                                                                        ? "text-blue-400"
                                                                                        : "text-white"
                                                                                }
                                                                            >
                                                                                {
                                                                                    word
                                                                                }{" "}
                                                                            </span>
                                                                        ),
                                                                    )}
                                                            </motion.h1>

                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: -50,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    x: 50,
                                                                }}
                                                                transition={{
                                                                    duration: 0.7,
                                                                    delay: 0.2,
                                                                    ease: "easeOut",
                                                                }}
                                                                className="text-sm md:text-base lg:text-lg !text-white font-medium max-w-xl leading-relaxed drop-shadow-lg"
                                                            >
                                                                {
                                                                    banner.subtitle
                                                                }
                                                            </motion.p>
                                                        </div>

                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.9,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                scale: 0.9,
                                                            }}
                                                            transition={{
                                                                duration: 0.4,
                                                                delay: 0.4,
                                                            }}
                                                            className="flex flex-wrap gap-5 pt-4"
                                                        >
                                                            <Link href="/motors">
                                                                <button className="group relative overflow-hidden px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg transition-all hover:pr-14 hover:bg-blue-50 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                                                    <span className="relative z-10">
                                                                        Lihat
                                                                        Katalog
                                                                    </span>
                                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                                        <ArrowRight className="w-6 h-6 translate-x-4 group-hover:translate-x-0 transition-transform" />
                                                                    </div>
                                                                    {/* Shine effect logic handled by tailwind animation if available, otherwise static hover */}
                                                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                                                                </button>
                                                            </Link>
                                                            <a
                                                                href="https://wa.me/6281234567890"
                                                                target="_blank"
                                                                className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-2xl font-bold text-lg backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 flex items-center gap-3"
                                                            >
                                                                <MessageCircle className="w-6 h-6" />
                                                                Konsultasi
                                                                Gratis
                                                            </a>
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Quick Search & Categories Overlay */}
                    <div className="relative -mt-12 md:-mt-20 z-20 px-4 md:px-12">
                        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-blue-50 max-w-5xl mx-auto transform transition-all hover:scale-[1.01]">
                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Search Component */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 rounded-xl">
                                                <Search className="w-6 h-6 text-blue-600" />
                                            </div>
                                            Cari Motor Impianmu
                                        </h3>
                                    </div>

                                    <div className="relative group">
                                        <div className="flex gap-3 p-3 bg-gray-50 border-2 border-transparent group-focus-within:border-blue-500 group-focus-within:bg-white rounded-3xl transition-all duration-300 shadow-inner">
                                            <div className="flex-1 flex items-center px-4 gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                    <Bike className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
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
                                                    className="w-full bg-transparent border-none focus:ring-0 text-base md:text-lg font-bold py-4 text-gray-800 placeholder:text-gray-400"
                                                />
                                            </div>
                                            <Button
                                                size="xl"
                                                className="px-10 rounded-[1.25rem] font-black shadow-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-sm uppercase tracking-widest"
                                            >
                                                Cari
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Popular Searches */}
                                    <div className="flex items-center flex-wrap gap-3 pt-2">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">
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
                                                className="px-5 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 rounded-full text-sm font-bold text-gray-600 transition-all active:scale-90"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Shortcuts */}
                                <div className="md:w-72 flex flex-row md:flex-col gap-4">
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
                            <Badge className="mb-3">🔥 Sedang Tren</Badge>
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
                                            {motor.promotions?.length > 0 && (
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
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
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

            {/* CONTACT FOOTER SECTION */}
            <section className="bg-primary pt-24 pb-32 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-white rounded-[50%] rotate-45" />
                </div>

                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                    id="contact"
                >
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-3xl flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="space-y-4 text-center lg:text-left">
                                <Badge className="bg-primary/10 text-primary border-none">
                                    Hubungi Kami
                                </Badge>
                                <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                                    Punya{" "}
                                    <span className="text-primary underline">
                                        Pertanyaan?
                                    </span>
                                </h2>
                                <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                    Tim expert kami siap membantu Anda 24/7.
                                    Konsultasikan pilihan motor dan simulasi
                                    kredit Anda secara gratis.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <a
                                    href="https://wa.me/6281212345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 flex items-center gap-5 group hover:bg-blue-600 hover:border-blue-600 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-200"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:bg-white group-hover:text-blue-600 group-hover:rotate-12 transition-all">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest transition-colors">
                                            Whatsapp Bekasi
                                        </p>
                                        <p className="text-sm font-black text-slate-900 transition-colors">
                                            0812-1234-5678
                                        </p>
                                    </div>
                                </a>
                                <a
                                    href="mailto:halo@srbmotor.id"
                                    className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 flex items-center gap-5 group hover:bg-primary hover:border-primary transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/20"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/30 group-hover:bg-white group-hover:text-primary group-hover:rotate-12 transition-all">
                                        <Mail className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest transition-colors">
                                            Layanan Email
                                        </p>
                                        <p className="text-sm font-black text-slate-900 leading-none mt-1 transition-colors">
                                            halo@srbmotor.id
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <form
                                onSubmit={submitContact}
                                className="space-y-6"
                            >
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                        Pesan Anda
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900 resize-none"
                                        placeholder="Saya tertarik dengan motor Honda..."
                                    />
                                </div>
                                <Button
                                    fullWidth
                                    size="lg"
                                    className="h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group flex items-center justify-center gap-3"
                                >
                                    <span>Kirim Pesan</span>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
