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
            <div className="flex-grow pt-[104px]">
                {/* BACK BUTTON */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
                <div className="bg-white min-h-screen">
                    {/* Hero Section */}
                    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                                    Tentang SRB Motors
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Kami adalah revolusi dalam industri dealer
                                    motor. Menyediakan motor berkualitas tinggi
                                    dengan transparansi penuh dan jaminan
                                    kepuasan pelanggan.
                                </p>
                            </motion.div>
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
                                    className="rounded-lg overflow-hidden shadow-lg"
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
                                        <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                                            Didirikan 2020
                                        </span>
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                            Revolusi Kultur Motor
                                        </h2>
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Kami bukan sekadar dealer motor biasa.
                                        Kami adalah kolektif penggemar,
                                        insinyur, dan perfeksionis yang
                                        terobsesi dengan kualitas dan kepuasan
                                        pelanggan.
                                    </p>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Didirikan atas keyakinan bahwa membeli
                                        motor bekas seharusnya tidak terasa
                                        seperti perjudian. Kami kurasi setiap
                                        kendaraan dengan standar tertinggi dan
                                        inspeksi menyeluruh.
                                    </p>
                                    <div className="pt-4">
                                        <Link
                                            href={route("motors.index")}
                                            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
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
                                        <div className="text-5xl font-bold text-blue-600 mb-2">
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
                                    className="bg-blue-50 rounded-lg p-8 border border-blue-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Target
                                                className="text-blue-600"
                                                size={24}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
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
                                    className="bg-indigo-50 rounded-lg p-8 border border-indigo-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-indigo-100 rounded-lg">
                                            <Heart
                                                className="text-indigo-600"
                                                size={24}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Misi Kami
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-lg">
                                        Memberikan akses kepada motor
                                        berkualitas tinggi dengan harga yang
                                        adil, inspeksi menyeluruh, dan dukungan
                                        purna jual yang responsif.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Nilai Inti Kami
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Empat pilar yang memandu setiap keputusan
                                    kami
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
                                        className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="bg-blue-50 rounded-lg p-3 mb-4 w-fit">
                                            {mission.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
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
                                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                    Siap Bergabung dengan Keluarga SRB?
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Jelajahi koleksi motor berkualitas kami dan
                                    temukan kendaraan impian Anda hari ini.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route("motors.index")}
                                        className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all"
                                    >
                                        Lihat Unit Kami
                                    </Link>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Follow Instagram
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
