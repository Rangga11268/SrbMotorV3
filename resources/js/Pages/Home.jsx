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
    X,
    Users,
    Award,
    CheckCircle,
    CreditCard,
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

            {/* STATS COUNTER BAR (High Contrast) */}
            <section className="bg-[#111111] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { label: "Unit Terjual", value: "10.000+", icon: <Bike className="w-5 h-5 text-[#1c69d4]" /> },
                            { label: "Teknisi Ahli", value: "25+", icon: <Award className="w-5 h-5 text-[#1c69d4]" /> },
                            { label: "Pelanggan Puas", value: "8.500+", icon: <Users className="w-5 h-5 text-[#1c69d4]" /> },
                            { label: "Tahun Pengalaman", value: "12 Tahun", icon: <Clock className="w-5 h-5 text-[#1c69d4]" /> },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start gap-3">
                                <div className="flex items-center gap-3">
                                    {stat.icon}
                                    <span className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">{stat.value}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">{stat.label}</span>
                            </div>
                        ))}
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

            {/* PURCHASE GUIDE / WORKFLOW (Sharp Geometry) */}
            <section className="py-24 bg-[#f9f9f9]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center lg:text-left">
                    <div className="mb-16 space-y-4">
                        <span className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase">PROSES PEMESANAN</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#262626] uppercase tracking-tighter leading-none">
                            LANGKAH <span className="text-gray-400">MUDAH.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { step: "01", title: "Pilih Unit", desc: "Eksplorasi katalog motor Honda & Yamaha terbaru sesuai kebutuhan Anda.", icon: <Search className="w-6 h-6"/> },
                            { step: "02", title: "Konsultasi", desc: "Hubungi konsultan kami untuk simulasi kredit atau negosiasi harga cash.", icon: <MessageCircle className="w-6 h-6"/> },
                            { step: "03", title: "Verifikasi", desc: "Lengkapi dokumen pendukung untuk proses administrasi yang cepat.", icon: <ShieldCheck className="w-6 h-6"/> },
                            { step: "04", title: "Unit Dikirim", desc: "Motor Anda diantarkan langsung ke depan pintu rumah oleh tim kami.", icon: <Truck className="w-6 h-6"/> },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 p-10 hover:border-[#1c69d4] transition-colors relative group">
                                <div className="absolute top-10 right-10 text-4xl font-black text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.step}</div>
                                <div className="w-12 h-12 bg-[#1c69d4] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h4 className="text-lg font-black text-[#262626] uppercase tracking-widest mb-4">{item.title}</h4>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* SERVICE & MAINTENANCE SECTION (Cinematic Industrial) */}
            <section className="relative py-20 md:py-32 bg-black overflow-hidden group">
                {/* Background Image with Parallax-like effect */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/img/servis-center.png" 
                        alt="Service Center" 
                        className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-12 mb-20 border-b border-white/10 pb-16">
                        <div className="max-w-4xl space-y-4 md:space-y-6 w-full">
                            <div className="flex items-center gap-4 justify-center lg:justify-start">
                                <div className="w-8 h-px bg-[#1c69d4]"></div>
                                <span className="text-[#1c69d4] font-black text-[9px] md:text-[10px] tracking-[0.4em] uppercase">PERAWATAN & SUKU CADANG</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95] lg:leading-[0.9]">
                                LAYANAN <br/>
                                <span className="text-white">PURNA JUAL</span>
                            </h2>
                            <p className="text-gray-400 font-medium text-[10px] md:text-xs lg:text-base max-w-xl lg:max-w-none mx-auto lg:mx-0 uppercase tracking-widest leading-relaxed opacity-70 mt-4 lg:mt-0">
                                Melalui Sinar Surya Motor (SRB MOTOR - SSM), nikmati performa terbaik bagi kendaraan Yamaha & Honda Anda dengan suku cadang asli dan teknisi bersertifikasi.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row lg:flex-row gap-4 w-full lg:w-auto">
                            <Link 
                                href="/services/booking"
                                className="px-10 py-5 bg-[#1c69d4] hover:bg-white hover:text-black text-white font-black text-[11px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 w-full"
                            >
                                <Clock className="w-4 h-4" /> BOOKING SERVIS
                            </Link>
                            <Link 
                                href="/motors"
                                className="px-10 py-5 bg-transparent border border-white hover:bg-white hover:text-black text-white font-black text-[11px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                            >
                                <Search className="w-4 h-4" /> SUKU CADANG
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
                        {[
                            {
                                icon: <Gauge className="w-8 h-8 text-[#1c69d4]" />,
                                title: "CEK MENYELURUH",
                                desc: "Pemeriksaan 21 titik gratis untuk setiap kunjungan servis rutin pertama Anda."
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-[#1c69d4]" />,
                                title: "SUKU CADANG ASLI",
                                desc: "Jaminan ketersediaan suku cadang orisinal untuk menjaga garansi kendaraan tetap aktif."
                            },
                            {
                                icon: <MapPin className="w-8 h-8 text-[#1c69d4]" />,
                                title: "ANTAR JEMPUT",
                                desc: "Layanan penjemputan unit di lokasi Anda untuk area cakupan tertentu."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 md:p-12 hover:bg-white/5 transition-colors group/card">
                                {item.icon}
                                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-widest mt-6 md:mt-8 mb-3 md:mb-4">{item.title}</h4>
                                <p className="text-gray-500 font-medium text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINANCING PARTNERS (Credibility) */}
            <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-shrink-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">MITRA<br/>PEMBIAYAAN</p>
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 md:gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                            {/* Financing Partner Placeholders */}
                            <span className="text-2xl font-black text-black tracking-tighter">ADIRA FINANCE</span>
                            <span className="text-2xl font-black text-black tracking-tighter">OTO FINANCE</span>
                            <span className="text-2xl font-black text-black tracking-tighter">FIF GROUP</span>
                            <span className="text-2xl font-black text-black tracking-tighter">MUF MANDIRI</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CUSTOMER REVIEWS (Social Proof) */}
            <section className="py-32 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="space-y-4">
                            <span className="text-[#1c69d4] font-black text-[10px] tracking-[0.4em] uppercase">EVIDENCE OF EXCELLENCE</span>
                            <h2 className="text-5xl font-black text-[#262626] uppercase tracking-tighter leading-none">
                                APA KATA <span className="text-gray-400">MEREKA?</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 border border-gray-200 bg-white p-6">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <span className="text-[11px] font-black text-[#262626] uppercase tracking-[0.2em]">Rating Rata-rata 4.9/5</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Andi Saputra", date: "2 minggu lalu", text: "Pelayanan sangat cepat. Kredit disetujui dalam hitungan jam dan unit langsung dikirim besoknya. Rekomendasi sekali!" },
                            { name: "Siti Rahma", date: "1 bulan lalu", text: "Motor Honda PCX saya sampai dengan mulus. Teknisi servis di SRB juga sangat detail saat menjelaskan perawatan pertama." },
                            { name: "Budi Hermawan", date: "3 bulan lalu", text: "Harga paling jujur dibanding dealer lain yang sudah saya kunjungi. Bonusnya juga banyak. Terima kasih SRB Motor!" }
                        ].map((review, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-10 hover:shadow-xl transition-all h-full flex flex-col group">
                                <div className="flex text-[#1c69d4] mb-8 group-hover:scale-110 transition-transform">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 font-medium italic text-base leading-relaxed mb-8 flex-grow">"{review.text}"</p>
                                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h5 className="font-black text-[#262626] uppercase text-[12px] tracking-widest">{review.name}</h5>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{review.date}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xs uppercase">SRB</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* DIGITAL SHOWROOM CTA (Cinematic High-Impact) */}
            <section className="relative py-40 bg-black overflow-hidden group">
                <div className="absolute inset-0 z-0">
                    <motion.img 
                        src="/assets/img/digital-showroom.png" 
                        alt="Digital Showroom" 
                        className="w-full h-full object-cover opacity-40 scale-110 group-hover:scale-100 transition-transform duration-[2000ms] ease-out select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <span className="text-[#1c69d4] font-black text-[10px] tracking-[0.5em] uppercase block">SRB MOTOR - SINAR SURYA MOTOR DIGITAL</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                SHOWROOM <br/>
                                <span className="text-outline text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>DIGITAL</span>
                            </h2>
                            <p className="text-gray-400 font-medium text-sm md:text-lg max-w-2xl mx-auto uppercase tracking-widest leading-relaxed opacity-80">
                                Temukan unit impian Anda dari katalog lengkap Yamaha & Honda. <br className="hidden md:block"/>
                                Transaksi aman, proses cepat, dan unit siap diantarkan.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link 
                                href="/motors"
                                className="inline-flex items-center gap-6 px-16 py-6 bg-white text-black hover:bg-[#1c69d4] hover:text-white transition-all duration-500 font-black text-[12px] tracking-[0.3em] uppercase group/btn relative overflow-hidden shadow-[0_0_50px_rgba(28,105,212,0.3)] hover:shadow-[0_0_80px_rgba(28,105,212,0.6)]"
                            >
                                <span className="relative z-10">EKSPLORASI SELURUH MODEL</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-3 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                            </Link>
                        </motion.div>

                        {/* Fine Industrial Detail */}
                        <div className="flex items-center gap-4 pt-12 opacity-30">
                            <div className="w-12 h-px bg-white/30 text-xs"></div>
                            <span className="text-[9px] font-black tracking-widest uppercase">SRB MOTOR - EST. 2012</span>
                            <div className="w-12 h-px bg-white/30"></div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
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
                                className="px-8 py-4 bg-[#1c69d4] border border-[#1c69d4] text-white hover:bg-transparent hover:text-[#1c69d4] transition-colors uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-3"
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
