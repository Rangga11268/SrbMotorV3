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
            <div className="flex-grow pt-32">
                {/* HEADER SECTION */}
                <section className="bg-white border-b border-gray-100 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Link href="/" className="hover:underline">
                                        Home
                                    </Link>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-500">
                                        Tentang Kami
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                    Tentang{" "}
                                    <span className="text-blue-600">
                                        SRB Motors
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-500 font-medium max-w-2xl">
                                    Kami adalah revolusi dalam industri dealer
                                    motor. Menyediakan motor berkualitas tinggi
                                    dengan transparansi penuh dan jaminan
                                    kepuasan pelanggan.
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
                                className="rounded-[2rem] overflow-hidden shadow-xl"
                            >
                                <img
                                    src="/assets/img/about us.jpeg"
                                    alt="SRB Motors"
                                    className="w-full h-full object-cover"
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
                                    <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full mb-4">
                                        Didirikan 2020
                                    </span>
                                    <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                                        Revolusi Kultur Motor
                                    </h2>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Kami bukan sekadar dealer motor biasa. Kami
                                    adalah kolektif penggemar, insinyur, dan
                                    perfeksionis yang terobsesi dengan kualitas
                                    dan kepuasan pelanggan.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Didirikan atas keyakinan bahwa membeli motor
                                    bekas seharusnya tidak terasa seperti
                                    perjudian. Kami kurasi setiap kendaraan
                                    dengan standar tertinggi dan inspeksi
                                    menyeluruh.
                                </p>
                                <div className="pt-4">
                                    <Link
                                        href={route("motors.index")}
                                        className="inline-block px-8 py-3.5 bg-blue-600 text-white font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        Lihat Unit Kami
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
                    <div className="max-w-5xl mx-auto">
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
                                    className="text-center"
                                >
                                    <div className="text-5xl font-black text-blue-600 mb-2">
                                        {stat.value}
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision & Mission Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                            {/* Vision */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                viewport={{ once: true }}
                                className="bg-blue-50 rounded-[2rem] p-8 border border-blue-200"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-2xl">
                                        <Target
                                            className="text-blue-600"
                                            size={24}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 italic">
                                        Visi Kami
                                    </h3>
                                </div>
                                <p className="text-gray-700 text-lg">
                                    Mendefinisikan ulang pasar motor bekas
                                    melalui transparansi radikal, kualitas
                                    premium, dan layanan pelanggan yang luar
                                    biasa.
                                </p>
                            </motion.div>

                            {/* Mission */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                                className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-200"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-indigo-100 rounded-2xl">
                                        <Heart
                                            className="text-indigo-600"
                                            size={24}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 italic">
                                        Misi Kami
                                    </h3>
                                </div>
                                <p className="text-gray-700 text-lg">
                                    Memberikan akses kepada motor berkualitas
                                    tinggi dengan harga yang adil, inspeksi
                                    menyeluruh, dan dukungan purna jual yang
                                    responsif.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                Nilai Inti Kami
                            </h2>
                            <p className="text-gray-600 text-lg">
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
                                    className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
                                >
                                    <div className="bg-blue-50 rounded-2xl p-4 mb-4 w-fit group-hover:text-white transition-colors">
                                        {mission.icon}
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 mb-3">
                                        {mission.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {mission.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                                Siap Bergabung dengan Keluarga SRB?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Jelajahi koleksi motor berkualitas kami dan
                                temukan kendaraan impian Anda hari ini.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route("motors.index")}
                                    className="inline-block px-8 py-3.5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-500 hover:text-white hover:shadow-xl hover:shadow-blue-500/20 transition-all"
                                >
                                    Lihat Unit Kami
                                </Link>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-8 py-3.5 border-2 border-gray-200 text-gray-700 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-50 transition-all"
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
