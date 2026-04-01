import React from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Target,
    Heart,
    Users,
    Trophy,
    CheckCircle,
    Star,
    ArrowLeft,
    ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
    const { auth } = usePage().props;

    const stats = [
        { label: "Unit Terjual", value: "500+" },
        { label: "Kepuasan Pelanggan", value: "99%" },
        { label: "Tahun Berdiri", value: "5" },
    ];

    const missions = [
        {
            icon: <CheckCircle className="text-blue-600" size={24} />,
            title: "Seleksi Terkurasi",
            description:
                "Hanya motor terbaik yang lolos dari inspeksi ketat kami.",
        },
        {
            icon: <Trophy className="text-blue-600" size={24} />,
            title: "Pengujian Ketat",
            description:
                "150-poin inspeksi teknisi oleh mekanik bersertifikat.",
        },
        {
            icon: <Heart className="text-blue-600" size={24} />,
            title: "Transparansi",
            description:
                "Laporan riwayat lengkap dan harga jelas tanpa biaya tersembunyi.",
        },
        {
            icon: <Users className="text-blue-600" size={24} />,
            title: "Komunitas",
            description:
                "Membangun ekosistem penggemar motor, bukan hanya pelanggan.",
        },
    ];

    return (
        <PublicLayout title="Tentang Kami">
            <div className="flex-grow pt-24 md:pt-32 bg-slate-50 dark:bg-slate-900">
                {/* HEADER SECTION */}
                <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-16 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70 transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                    <Link
                                        href="/"
                                        className="hover:text-blue-700 transition"
                                    >
                                        Home
                                    </Link>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Tentang Kami
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                                    Tentang{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                                        SRB Motor
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
                                    SRB Motor merupakan dealer kendaraan yang
                                    beroperasi di bawah naungan SSM sebagai
                                    mitra resmi dalam distribusi dan pembiayaan
                                    kendaraan. Menyediakan kendaraan dengan
                                    kualitas unggul, transparansi penuh, dan
                                    jaminan kepuasan pelanggan.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Image */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                                className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200 dark:ring-slate-800"
                            >
                                <img
                                    src="/assets/img/about us.jpeg"
                                    alt="SRB Motors Team"
                                    className="w-full h-full object-cover aspect-[4/5]"
                                />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div>
                                    <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-widest rounded-full mb-4 ring-1 ring-blue-500/20">
                                        Didirikan 2020
                                    </span>
                                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                                        Mitra Resmi SSM
                                    </h2>
                                </div>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    Sistem ini dibuat untuk dealer independen
                                    yang bekerja sama dengan pihak induk (SSM)
                                    dalam distribusi dan pembiayaan. Kami
                                    memastikan Anda mendapat kendaraan terbaik.
                                </p>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Didirikan atas keyakinan bahwa membeli motor
                                    bekas seharusnya tidak terasa seperti
                                    perjudian. Kami beroperasi di bawah naungan
                                    SSM, merawat setiap kendaraan dengan standar
                                    tertinggi dan inspeksi menyeluruh.
                                </p>
                                <div className="pt-6">
                                    <Link
                                        href={route("motors.index")}
                                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold uppercase tracking-wider text-sm rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                                    >
                                        Lihat Unit Tersedia
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-white dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-slate-800 relative">
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center p-6"
                                >
                                    <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-400 mb-3 tracking-tight">
                                        {stat.value}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision & Mission Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 lg:mb-32">
                            {/* Vision */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-10 lg:p-12 border border-blue-100 dark:border-slate-700 shadow-xl shadow-blue-900/5 relative overflow-hidden"
                            >
                                {/* Decorative circle */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-slate-800 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>

                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                        <Target
                                            className="text-blue-600"
                                            size={28}
                                        />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Visi Kami
                                    </h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-lg lg:text-xl leading-relaxed font-medium relative z-10">
                                    Mendefinisikan ulang batas standar kualitas
                                    pasar motor bekas. Memberikan pengalaman
                                    yang setara bahkan lebih memuaskan dari
                                    membeli unit baru, melalui inovasi,
                                    keandalan, dan transparansi absolut.
                                </p>
                            </motion.div>

                            {/* Mission Intro */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                                className="flex flex-col justify-center"
                            >
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                    Misi & Komitmen
                                </h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mb-8">
                                    Setiap motor yang keluar dari showroom kami
                                    membawa jaminan kualitas. Inilah yang
                                    membedakan SRB Motors.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="bg-slate-50 dark:bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                                Nilai Inti Kami
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                Empat pilar yang memandu setiap keputusan kami
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {missions.map((mission, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110  group-hover:text-white transition-all text-blue-600">
                                        {mission.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                        {mission.title}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {mission.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/5 mask-radial-gradient pointer-events-none"></div>
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                                Siap Bergabung dengan{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                                    Keluarga SRB?
                                </span>
                            </h2>
                            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 font-medium">
                                Jelajahi koleksi motor berkualitas kami dan
                                temukan kendaraan impian Anda hari ini.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route("motors.index")}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                                >
                                    Lihat Unit Kami
                                </Link>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                                >
                                    Follow Instagram
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
