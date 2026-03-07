import React from "react";
import { Link, useForm } from "@inertiajs/react";
import Navbar from "@/Components/Public/Navbar";
import Footer from "@/Components/Public/Footer";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";
import {
    ArrowRight,
    CheckCircle2,
    Star,
    Clock,
    MapPin,
    Phone,
    TrendingUp,
    ShieldCheck,
    Truck,
    Mail,
    MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Home({ auth, popularMotors = [] }) {
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

    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Garansi Kualitas",
            description:
                "Setiap unit melewati 150+ titik inspeksi ketat oleh teknisi ahli kami.",
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Persetujuan Cepat",
            description:
                "Proses verifikasi kredit kilat. Approval dalam hitungan jam, bukan hari.",
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: "Pengiriman Aman",
            description:
                "Layanan antar jemput unit gratis dan asuransi penuh selama perjalanan.",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar auth={auth} />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge variant="blue" size="md">
                                    Motor Impian Kamu Menunggu
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    Wujudkan Mimpi Berkendara dengan{" "}
                                    <span className="text-blue-600">
                                        SRB Motors
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Platform dealer motor terpercaya dengan
                                    proses approval kredit cepat, harga
                                    kompetitif, dan layanan purna jual terbaik.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={route("motors.index")}>
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        <span className="flex items-center gap-2">
                                            Jelajahi Katalog
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </Button>
                                </Link>
                                <a href="#features">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="w-full sm:w-auto"
                                    >
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </a>
                            </div>

                            {/* Trust Indicators */}
                            <div className="space-y-3 pt-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Dipercaya oleh ribuan pelanggan
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                            />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-2">
                                            4.9/5 (2,481 reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative h-[400px] md:h-[500px] flex items-center justify-center"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
                            <div className="absolute top-10 right-10 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-pulse" />

                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="/assets/img/banner.png"
                                    alt="SRB Motors Hero"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Stats */}
                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Ready Stock
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            150+ Unit
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/50">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-bold text-gray-900">
                                            Terverifikasi
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section
                id="features"
                className="py-20 md:py-32 bg-white relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10 opacity-50" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="blue" size="sm" className="mb-4">
                                Kenapa Kita?
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                                Pengalaman Beli Motor{" "}
                                <br className="hidden md:block" />
                                <span className="text-blue-600">
                                    Terbaik di Indonesia
                                </span>
                            </h2>
                            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Kami bukan sekadar dealer, kami adalah mitra
                                Anda dalam menemukan kendaraan impian dengan
                                layanan yang transparan dan bersahabat.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <Card
                                    hoverable
                                    className="h-full border border-gray-100 hover:border-blue-100 transition-all duration-300"
                                >
                                    <CardBody className="p-8 space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            {feature.icon}
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                        <div className="pt-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
                                            <span>Selengkapnya</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPULAR MOTORS SECTION */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100/50 rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
                    >
                        <div>
                            <Badge variant="blue" size="sm" className="mb-3">
                                Koleksi Pilihan
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                Motor{" "}
                                <span className="text-blue-600">
                                    Terpopuler
                                </span>
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Dipilih oleh ribuan pelanggan setia kami
                            </p>
                        </div>
                        <Link href={route("motors.index")}>
                            <Button variant="ghost" size="lg" className="group">
                                Lihat Semua Katalog
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>

                    {popularMotors && popularMotors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {popularMotors.slice(0, 4).map((motor, index) => (
                                <motion.div
                                    key={motor.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                >
                                    <Link href={route("motors.show", motor.id)}>
                                        <Card
                                            hoverable
                                            className="overflow-hidden group h-full border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300"
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                {motor.image ? (
                                                    <>
                                                        <img
                                                            src={motor.image}
                                                            alt={motor.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        {/* Overlay on Hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                        <div className="text-6xl mb-2">
                                                            🏍️
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            Foto Segera Hadir
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Badge Type */}
                                                <div className="absolute top-3 right-3">
                                                    <Badge
                                                        variant="blue"
                                                        className="shadow-md backdrop-blur-sm bg-white/90"
                                                    >
                                                        {motor.type ||
                                                            "Cash/Kredit"}
                                                    </Badge>
                                                </div>

                                                {/* Status Badge */}
                                                {motor.tersedia && (
                                                    <div className="absolute top-3 left-3">
                                                        <Badge
                                                            variant="green"
                                                            className="shadow-md backdrop-blur-sm bg-white/90"
                                                        >
                                                            Ready Stock
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card Body */}
                                            <CardBody className="p-5 space-y-4">
                                                {/* Brand & Year */}
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span className="font-semibold uppercase tracking-wide">
                                                        {motor.brand || "Motor"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {motor.year ||
                                                            new Date().getFullYear()}
                                                    </span>
                                                </div>

                                                {/* Motor Name */}
                                                <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {motor.name}
                                                </h3>

                                                {/* Model (if exists) */}
                                                {motor.model && (
                                                    <p className="text-sm text-gray-500 line-clamp-1">
                                                        {motor.model}
                                                    </p>
                                                )}

                                                {/* Price & CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            Harga Mulai
                                                        </p>
                                                        <p className="font-extrabold text-blue-600 text-xl">
                                                            {motor.price
                                                                ? `Rp ${parseInt(motor.price).toLocaleString("id-ID")}`
                                                                : "Hubungi"}
                                                        </p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                                <svg
                                    className="w-10 h-10 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Belum Ada Motor Tersedia
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Kami sedang memperbarui koleksi motor terbaru
                                untuk Anda
                            </p>
                            <Link href={route("motors.index")}>
                                <Button variant="secondary">
                                    Lihat Katalog Lengkap
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
                {/* Decorative Background Patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400 rounded-full blur-3xl" />
                </div>

                {/* Geometric Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-10"
                    >
                        {/* Badge & Heading */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-semibold text-white">
                                    Tim Siap Melayani 24/7
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                                Siap Wujudkan <br className="hidden md:block" />
                                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    Motor Impianmu?
                                </span>
                            </h2>

                            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                Konsultasi gratis dengan tim expert kami.
                                Dapatkan penawaran spesial dan solusi kredit
                                terbaik yang sesuai kebutuhanmu.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group"
                            >
                                <button className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:bg-blue-50 border-2 border-transparent hover:border-white/50">
                                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 font-medium">
                                            Chat Via
                                        </p>
                                        <p className="text-blue-600 font-extrabold">
                                            WhatsApp Kami
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.a>

                            <motion.a
                                href="#contact"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group"
                            >
                                <button className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>Kirim Pesan</span>
                                </button>
                            </motion.a>
                        </div>

                        {/* Trust Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-white/20"
                        >
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-extrabold mb-1">
                                    2,481+
                                </p>
                                <p className="text-blue-200 text-sm">
                                    Pelanggan Puas
                                </p>
                            </div>
                            <div className="text-center border-l border-r border-white/20">
                                <p className="text-3xl md:text-4xl font-extrabold mb-1">
                                    150+
                                </p>
                                <p className="text-blue-200 text-sm">
                                    Unit Ready Stock
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-extrabold mb-1">
                                    4.9/5
                                </p>
                                <p className="text-blue-200 text-sm">
                                    Rating Kepuasan
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section
                id="contact"
                className="py-24 md:py-32 bg-white relative overflow-hidden"
            >
                {/* Decorative background blur */}
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-gray-50 rounded-full blur-3xl opacity-60" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content - Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <Badge variant="blue" size="sm">
                                    Hubungi Kami
                                </Badge>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                    Konsultasikan{" "}
                                    <span className="text-blue-600">
                                        Kebutuhan Berkendara
                                    </span>{" "}
                                    Anda
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Punya pertanyaan tentang unit motor atau
                                    simulasi kredit? Tim expert SRB Motors siap
                                    membantu merekomendasikan pilihan terbaik
                                    untuk Anda.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 group hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            Email Kami
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            support@srbmotor.id
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 group hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            Live Chat
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Senin - Minggu (24/7)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100/50">
                                <div className="w-10 h-10 bg-white rounded-full flex-shrink-0 flex items-center justify-center text-blue-600 shadow-sm font-bold">
                                    i
                                </div>
                                <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                    Kami biasanya merespons pesan Anda dalam
                                    waktu kurang dari 30 menit selama jam kerja.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Content - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="shadow-2xl shadow-gray-200/50 border-0 p-2 md:p-4 bg-white/80 backdrop-blur-xl">
                                <CardBody className="p-6 md:p-8 space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Kirim Pesan
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Lengkapi formulir di bawah ini
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={submitContact}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">
                                                    Nama Lengkap
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                                                    placeholder="Nama Anda"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">
                                                    Alamat Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                                                    placeholder="email@anda.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">
                                                Pesan Pertanyaan
                                            </label>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        "message",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                rows="4"
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all resize-none placeholder:text-gray-400 font-medium"
                                                placeholder="Tulis detail pertanyaan Anda di sini..."
                                            />
                                        </div>

                                        <Button
                                            fullWidth
                                            size="lg"
                                            disabled={processing}
                                            className="h-14 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 group overflow-hidden relative"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                                {processing ? (
                                                    "Mengirim..."
                                                ) : (
                                                    <>
                                                        Kirim Sekarang
                                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </form>
                                </CardBody>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
