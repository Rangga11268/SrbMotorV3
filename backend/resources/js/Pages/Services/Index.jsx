import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Wrench,
    ShieldCheck,
    Clock,
    MapPin,
    Phone,
    Smartphone,
    QrCode,
    CheckCircle2,
    ArrowRight,
    Bike,
    AlertCircle,
    CalendarCheck,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesIndex({
    branches = [],
    servicePackages = [],
    settings = {},
    hasActiveHistory = false,
}) {
    const { auth } = usePage().props;
    const whatsappNumber = (settings.contact_phone || "628978638849").replace(/\D/g, "");

    return (
        <PublicLayout title="Bengkel Resmi & Servis Motor - SRB Motor">
            {/* HERO SECTION */}
            <section className="relative w-full pt-32 pb-24 bg-[#0B1120] text-white overflow-hidden">
                {/* Ambient Lighting */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1c69d4]/15 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1c69d4]/20 border border-[#1c69d4]/40 text-[#38bdf8] text-[10px] font-bold tracking-[0.2em] uppercase">
                            <Wrench className="w-3.5 h-3.5" />
                            Bengkel Resmi Yamaha & Honda
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light uppercase tracking-tight leading-[1.15]">
                            Perawatan Motor Presisi,{" "}
                            <span className="font-bold text-white block sm:inline">Bebas Antre.</span>
                        </h1>

                        <p className="text-[#94a3b8] text-base sm:text-lg font-sans leading-relaxed max-w-2xl">
                            Percayakan motor Anda pada mekanik ahli bersertifikasi resmi pabrikan. Didukung peralatan scanner injeksi modern, suku cadang 100% orisinil, ruang tunggu ber-AC, dan garansi servis pengerjaan.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <a
                                href="#booking-app"
                                className="px-8 py-4 bg-[#1c69d4] hover:bg-[#1557b0] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-colors shadow-lg shadow-blue-900/30"
                            >
                                <Smartphone className="w-4 h-4" />
                                Ambil Antrean di Aplikasi Mobile
                            </a>

                            <a
                                href={`https://wa.me/${whatsappNumber}?text=Halo%20Bengkel%20SRB%20Motor,%20saya%20ingin%20konsultasi%20jadwal%20servis%20motor%20saya.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-4 border border-white/20 hover:border-white text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
                            >
                                <Phone className="w-4 h-4 text-emerald-400" />
                                Konsultasi WhatsApp
                            </a>

                            {auth?.user && (
                                <Link
                                    href="/services/history"
                                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
                                >
                                    Riwayat Servis Saya
                                    <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* WORKSHOP FACILITIES (4 VALUE PILLARS) */}
            <section className="py-16 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-[#1c69d4]" />,
                                title: "Suku Cadang 100% Orisinil",
                                desc: "Hanya menggunakan spare part asli pabrikan Yamalube & AHM Oil resmi bergaransi.",
                            },
                            {
                                icon: <Wrench className="w-8 h-8 text-[#1c69d4]" />,
                                title: "Mekanik Bersertifikat",
                                desc: "Teknisi terlatih dan berpengalaman dengan sertifikasi standar ATPM nasional.",
                            },
                            {
                                icon: <Clock className="w-8 h-8 text-[#1c69d4]" />,
                                title: "Scanner Injeksi Modern",
                                desc: "Pemeriksaan diagnosa kelistrikan dan ECU akurat menggunakan komputerisasi terkini.",
                            },
                            {
                                icon: <Sparkles className="w-8 h-8 text-[#1c69d4]" />,
                                title: "Ruang Tunggu Nyaman",
                                desc: "Fasilitas ruang tunggu ber-AC, free Wi-Fi, air mineral & kopi, serta display unit.",
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-3 p-6 bg-slate-50 border border-slate-200/80">
                                <div>{item.icon}</div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">{item.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICE PACKAGES & TRANSPARENT PRICING */}
            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-[0.2em]">
                            Transparansi Biaya & Pelayanan
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-slate-900">
                            Pilihan Paket <span className="font-bold">Servis Resmi</span>
                        </h2>
                        <p className="text-sm text-slate-600">
                            Estimasi biaya terstandar dan transparan tanpa biaya tersembunyi.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {servicePackages.map((pkg, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-[#1c69d4] transition-colors shadow-sm"
                            >
                                <div className="space-y-4">
                                    <div className="inline-block px-3 py-1 bg-blue-50 text-[#1c69d4] text-[10px] font-bold uppercase tracking-wider">
                                        Estimasi {pkg.duration}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                                        {pkg.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {pkg.desc}
                                    </p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mulai Dari</div>
                                        <div className="text-base font-extrabold text-[#1c69d4]">{pkg.price}</div>
                                    </div>
                                    <a
                                        href="#booking-app"
                                        className="p-2.5 bg-slate-100 hover:bg-[#1c69d4] hover:text-white text-slate-700 transition-colors"
                                        title="Pilih Paket Ini di Aplikasi"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THE APP HOOK (Mengapa Booking di Aplikasi Mobile SRB) */}
            <section id="booking-app" className="py-24 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0A0F1D] text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1c69d4]/20 border border-[#1c69d4]/40 text-[#38bdf8] text-[10px] font-bold tracking-[0.2em] uppercase">
                                <Smartphone className="w-3.5 h-3.5" />
                                Akses Prioritas & Bebas Antre
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight leading-tight">
                                Booking Antrean Bengkel Lebih Praktis{" "}
                                <span className="font-bold text-white block sm:inline">Lewat Aplikasi Mobile.</span>
                            </h2>
                            <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed max-w-xl">
                                Dapatkan kepastian jam pengerjaan mekanik, nomor antrean digital, dan notifikasi live langsung di smartphone Anda saat motor Anda sedang dikerjakan.
                            </p>

                            <div className="space-y-3 pt-2">
                                {[
                                    "Pilih paket servis, cabang bengkel, dan jam kedatangan dalam 3 langkah mudah.",
                                    "Klaim kupon servis berkala (KPB 1-4) & garansi resmi mesin 3 tahun.",
                                    "Pengingat ganti oli otomatis agar performa mesin motor tetap prima.",
                                    "Riwayat pengerjaan dan faktur digital tersimpan aman di saku Anda.",
                                ].map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                        <span className="text-xs text-[#cbd5e1]">{point}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-6">
                                <a
                                    href="/downloads/srb-motor-app.apk"
                                    className="px-8 py-4 bg-[#1c69d4] hover:bg-[#1557b0] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-colors shadow-lg shadow-blue-900/30"
                                >
                                    <Smartphone className="w-4 h-4" />
                                    Unduh Aplikasi Android (.APK)
                                </a>

                                <Link
                                    href="/services/booking"
                                    className="px-6 py-4 border border-white/20 hover:border-white text-[#94a3b8] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Gunakan Form Web Standar →
                                </Link>
                            </div>
                        </div>

                        {/* Interactive App Mockup & QR Code */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-sm bg-gradient-to-b from-white/10 to-white/5 p-6 border border-white/15 backdrop-blur-md shadow-2xl">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-white">Tiket Antrean Live</span>
                                    </div>
                                    <span className="text-[10px] text-[#38bdf8] font-bold tracking-widest">SRB MOBILE</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-[#1e293b]/90 border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor Antrean Hari Ini</span>
                                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-bold uppercase">Siap Dilayani</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-3xl font-black text-white">A-05</div>
                                                <div className="text-[11px] text-slate-300">Servis Berkala + Oli</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-white">10:30 WIB</div>
                                                <div className="text-[10px] text-slate-400">Pit 2 - SSM Mekar Sari</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code Container */}
                                    <div className="p-4 bg-white text-slate-900 flex items-center gap-4">
                                        <div className="p-2 border border-slate-300 bg-slate-50 shrink-0">
                                            <QrCode className="w-14 h-14 text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-black uppercase tracking-wider text-slate-900">Scan QR Code di HP</div>
                                            <p className="text-[10px] text-slate-600 leading-tight">
                                                Buka kamera smartphone untuk langsung mengunduh Aplikasi SRB Motor.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WORKSHOP BRANCH LOCATIONS */}
            <section className="py-24 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-[0.2em]">
                            JARINGAN BENGKEL RESMI PARTNER
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-slate-900">
                            Lokasi <span className="font-bold">Bengkel Resmi SSM Group</span>
                        </h2>
                        <p className="text-sm text-slate-600">
                            Layanan servis berkala dan perawatan resmi SRB Motor dilayani di 2 Bengkel Resmi Yamaha SSM Group (Cabang Mekar Sari & Jatiasih R-Shop) dengan mekanik tersertifikasi pabrikan dan jaminan suku cadang orisinil.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {branches.map((b, i) => (
                            <div key={i} className="p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[#1c69d4]">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{b.name}</h4>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed pl-6">{b.address}</p>
                                    {b.phone && (
                                        <p className="text-xs text-slate-500 pl-6 flex items-center gap-1.5 pt-1">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            <span>{b.phone}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-200/60 pl-6 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buka: 08.00 - 16.30 WIB</span>
                                    <a
                                        href={`https://wa.me/${(b.phone || settings.contact_phone || "628978638849").replace(/\D/g, "")}?text=Halo%20${encodeURIComponent(b.name)},%20saya%20ingin%20tanya%20jadwal%20servis.`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] font-bold text-[#1c69d4] hover:underline uppercase tracking-wider flex items-center gap-1"
                                    >
                                        WhatsApp <ChevronRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EMERGENCY BREAKDOWN ASSISTANCE BANNER */}
            <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-600 text-white shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-wider text-white">Motor Mogok di Jalan atau Butuh Towing Darurat?</h3>
                                <p className="text-xs text-slate-400">Tim mekanik dan armada towing SRB Motor siap melayani kendala darurat Anda.</p>
                            </div>
                        </div>

                        <a
                            href={`https://wa.me/${whatsappNumber}?text=EMERGENCY:%20Motor%20saya%20mengalami%20kendala%20mogok/kerusakan%20di%20jalan,%20mohon%20bantuan%20segera.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-rose-900/30"
                        >
                            <Phone className="w-4 h-4" />
                            Hubungi Hotline Darurat
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
