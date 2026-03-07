import React, { useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Star,
    Target,
    Heart,
    Zap,
    Users,
    Trophy,
    ArrowUpRight,
    Search,
    ShieldCheck,
} from "lucide-react";

export default function About() {
    const { auth } = usePage().props;
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <PublicLayout auth={auth} title="Tentang Kami">
            <div className="flex-grow pt-[104px]">
                {/* HERO SECTION - VERTICAL MASSIVE TYPE */}
                <section
                    ref={targetRef}
                    className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-dark pt-20"
                >
                    {/* Background Noise & Gradient */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
                    </div>

                    <motion.div
                        style={{ opacity }}
                        className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center"
                    >
                        <h1 className="flex flex-col text-[13vw] leading-[0.85] font-display font-black text-white tracking-tighter mix-blend-difference">
                            <span className="self-start ml-4 md:ml-20">
                                JATI
                            </span>
                            <span className="self-center text-accent/20 stroke-text-white backdrop-blur-sm">
                                DIRI
                            </span>
                            <span className="self-end mr-4 md:mr-20">KAMI</span>
                        </h1>
                    </motion.div>

                    {/* Floating Image Parallax */}
                    <motion.div
                        style={{ y }}
                        className="absolute inset-0 z-0 flex items-center justify-center opacity-40 mix-blend-overlay pointer-events-none"
                    >
                        <img
                            src="/assets/img/about us.jpeg"
                            alt="Garage"
                            className="w-full h-full object-cover grayscale opacity-50"
                        />
                    </motion.div>
                </section>

                {/* MANIFESTO / STORY */}
                <section className="py-32 bg-surface-dark relative z-10">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-6 block">
                                    Est. 2020
                                </span>
                                <h2 className="text-5xl md:text-7xl font-display font-black text-white leading-[0.9] tracking-tighter mb-10">
                                    REVOLUSI <br />
                                    KULTUR
                                </h2>
                            </div>
                            <div className="space-y-8">
                                <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
                                    Kami bukan dealer biasa. Kami adalah
                                    kolektif penggemar, insinyur, dan
                                    perfeksionis yang terobsesi dengan seni
                                    gerak.
                                </p>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    Didirikan atas keyakinan bahwa membeli motor
                                    bekas seharusnya tidak terasa seperti
                                    perjudian. Seharusnya terasa seperti
                                    upgrade. Kami kurasi, kami inspeksi, dan
                                    kami jamin kualitas yang menyaingi pabrikan.
                                </p>
                                <div className="pt-8">
                                    <span className="font-handwriting text-4xl text-white opacity-80 rotate-[-5deg] block">
                                        SRB Team
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KINETIC STATS */}
                <section className="py-20 bg-accent text-black border-y-4 border-black">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black/10">
                            {[
                                { label: "UNIT TERJUAL", value: "500+" },
                                { label: "KEPUASAN", value: "99%" },
                                { label: "TAHUN BERDIRI", value: "05" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="py-8 md:py-0 md:px-12 text-center group cursor-default"
                                >
                                    <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-300">
                                        {stat.value}
                                    </h3>
                                    <p className="text-sm font-bold tracking-[0.3em] uppercase">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* VISION & MISSION - BENTO GRID REIMAGINED */}
                <section className="py-32 bg-surface-dark relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Vision Card */}
                            <div className="lg:col-span-8 bg-zinc-900 rounded-[2rem] p-12 border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
                                    <Target size={200} className="text-white" />
                                </div>
                                <h3 className="text-2xl text-accent font-bold mb-4 uppercase tracking-widest">
                                    Visi
                                </h3>
                                <p className="text-4xl md:text-5xl font-display font-bold text-white leading-tight max-w-2xl relative z-10">
                                    Mendefinisikan ulang pasar motor bekas
                                    melalui transparansi radikal dan kualitas.
                                </p>
                            </div>

                            {/* Decoration / Image */}
                            <div className="lg:col-span-4 bg-zinc-900 rounded-[2rem] border border-white/5 overflow-hidden relative group">
                                <img
                                    src="/assets/img/about us.jpeg"
                                    alt="About Us"
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Mission */}
                            <div className="lg:col-span-12 bg-zinc-900 rounded-[2rem] p-12 border border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    <div className="md:col-span-1">
                                        <h3 className="text-2xl text-accent font-bold mb-4 uppercase tracking-widest">
                                            Misi
                                        </h3>
                                        <h4 className="text-4xl font-display font-bold text-white">
                                            Tiga Pilar SRB.
                                        </h4>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {[
                                            {
                                                title: "Seleksi Terkurasi",
                                                desc: "Hanya 1% motor terbaik yang masuk ke showroom kami.",
                                            },
                                            {
                                                title: "Pengujian Ketat",
                                                desc: "150-poin inspeksi teknis oleh mekanik bersertifikat.",
                                            },
                                            {
                                                title: "Kejujuran Radikal",
                                                desc: "Laporan riwayat lengkap dan harga transparan. Tanpa rahasia.",
                                            },
                                            {
                                                title: "Komunitas Utama",
                                                desc: "Membangun budaya pengendara, bukan sekadar daftar pelanggan.",
                                            },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="space-y-2 group"
                                            >
                                                <div className="w-2 h-2 bg-accent rounded-full mb-4 group-hover:w-8 transition-all duration-300"></div>
                                                <h5 className="text-xl font-bold text-white">
                                                    {item.title}
                                                </h5>
                                                <p className="text-gray-400 text-sm">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TEAM / CTA */}
                <section className="py-32 bg-black text-white text-center border-t border-white/10">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-8">
                            GABUNG{" "}
                            <span className="text-accent">GERAKAN KAMI.</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-12 text-lg">
                            Ikuti sosial media kami untuk info terbaru, tips
                            berkendara, dan event komunitas.
                        </p>
                        <div className="flex justify-center gap-6">
                            <Link
                                href="/motors"
                                className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full"
                            >
                                Lihat Unit
                            </Link>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full rounded-r-none border-r-0"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full rounded-l-none"
                            >
                                TikTok
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
