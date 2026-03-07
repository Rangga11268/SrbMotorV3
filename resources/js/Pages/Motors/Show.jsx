import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Public/Navbar";
import Footer from "@/Components/Public/Footer";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";
import { motion } from "framer-motion";
import {
    Calendar,
    Info,
    CheckCircle2,
    XCircle,
    ShoppingCart,
    FileText,
    MessageCircle,
    ArrowLeft,
    Share2,
    ShieldCheck,
    Gauge,
    Cpu,
    Zap,
    MapPin,
    PenTool,
    Activity,
    ChevronRight,
    ArrowRight,
    Phone,
    Clock,
    Tag,
} from "lucide-react";

export default function Show({ motor, relatedMotors }) {
    const { auth } = usePage().props;

    const openWhatsApp = (e) => {
        e.preventDefault();
        const phoneNumber = "6281234567890";
        const message = encodeURIComponent(
            `Halo SRB Motors, saya tertarik dengan unit ${
                motor.name
            } (Rp ${parseFloat(motor.price).toLocaleString("id-ID")}). Bisa minta info lebih lanjut?`
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    // Helper to format spec keys
    const formatSpecKey = (key) => {
        const keyMap = {
            plate_number: "Plat Nomor",
            engine_number: "No. Mesin",
            frame_number: "No. Rangka",
            bpkb_name: "Nama BPKB",
            stnk_name: "Nama STNK",
            tax_expiry: "Pajak",
            registration_expiry: "Kaleng",
            kilometer: "Odometer",
            color: "Warna",
            transmission: "Transmisi",
            condition: "Kondisi",
        };
        return (
            keyMap[key] ||
            key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        );
    };

    const getSpecIcon = (key) => {
        const iconMap = {
            kilometer: <Gauge className="w-5 h-5" />,
            transmission: <Cpu className="w-5 h-5" />,
            color: <PenTool className="w-5 h-5" />,
            condition: <ShieldCheck className="w-5 h-5" />,
            plate_number: <MapPin className="w-5 h-5" />,
        };
        return iconMap[key] || <Zap className="w-5 h-5" />;
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Head title={`${motor.name} - SRB Motors`} />
            <Navbar auth={auth} />

            <main className="flex-grow pt-24 pb-20">
                {/* BREADCRUMBS */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={route("motors.index")} className="hover:text-blue-600">Katalog</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 line-clamp-1">{motor.name}</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        
                        {/* LEFT COLUMN - GALLERY & IMAGE */}
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                <img
                                    src={motor.image_path ? `/storage/${motor.image_path}` : "/images/placeholder-motor.jpg"}
                                    alt={motor.name}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Status Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-3">
                                    <Badge variant="blue" size="md" className="shadow-lg backdrop-blur-md bg-white/90">
                                        {motor.brand}
                                    </Badge>
                                    <Badge variant={motor.tersedia ? "green" : "red"} size="md" className="shadow-lg backdrop-blur-md bg-white/90">
                                        {motor.tersedia ? "Unit Tersedia" : "Unit Terjual"}
                                    </Badge>
                                </div>
                            </motion.div>

                            {/* Trust Badges under image */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    <span className="text-xs font-bold text-blue-900">Lulus Inspeksi</span>
                                </div>
                                <div className="p-4 bg-green-50 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    <span className="text-xs font-bold text-green-900">Surat Lengkap</span>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-600" />
                                    <span className="text-xs font-bold text-yellow-900">Siap Pakai</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - DETAILS */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm font-semibold text-blue-600 uppercase tracking-widest">
                                    <span>{motor.brand}</span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    <span>{motor.type}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                    {motor.name}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <div className="text-3xl font-black text-blue-600">
                                        Rp {parseFloat(motor.price).toLocaleString("id-ID")}
                                    </div>
                                    <Badge variant="gray" size="md">Tahun {motor.year}</Badge>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {motor.tersedia ? (
                                    <>
                                        <div className="flex-grow">
                                            <Link href={route("motors.cash-order", motor.id)}>
                                                <Button fullWidth size="lg" className="h-14 text-lg">
                                                    <ShoppingCart className="w-5 h-5 mr-2" /> Beli Cash
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex-grow">
                                            <Link href={route("motors.credit-order", motor.id)}>
                                                <Button fullWidth size="lg" variant="secondary" className="h-14 text-lg border-2">
                                                    <FileText className="w-5 h-5 mr-2" /> Ajukan Kredit
                                                </Button>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <Button fullWidth size="lg" disabled className="h-14 opacity-50 grayscale cursor-not-allowed">
                                        <XCircle className="w-5 h-5 mr-2" /> Unit Tidak Tersedia
                                    </Button>
                                )}
                            </div>

                            <button 
                                onClick={openWhatsApp}
                                className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-100"
                            >
                                <Phone className="w-5 h-5 fill-current" /> Tanya Admin via WhatsApp
                            </button>

                            {/* SPECIFICATIONS GRID */}
                            <div className="space-y-6 pt-8 border-t border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Spesifikasi Kendaraan</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {motor.specifications && Object.entries(motor.specifications_array || {}).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {getSpecIcon(key)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formatSpecKey(key)}</p>
                                                <p className="font-bold text-gray-900">{value || "-"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            {motor.details && (
                                <div className="space-y-4 pt-8 border-t border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">Deskripsi Tambahan</h3>
                                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        {motor.details}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* RELATED MOTORS */}
                {relatedMotors && relatedMotors.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Unit Terkait</h2>
                                <p className="text-gray-500">Mungkin Anda juga tertarik dengan unit ini</p>
                            </div>
                            <Link href={route("motors.index")}>
                                <Button variant="ghost" className="group">
                                    Lihat Semua <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedMotors.map((m) => (
                                <Link key={m.id} href={route("motors.show", m.id)}>
                                    <Card hoverable className="overflow-hidden border border-gray-100">
                                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                                            <img 
                                                src={m.image_path ? `/storage/${m.image_path}` : "/images/placeholder-motor.jpg"} 
                                                alt={m.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge variant="blue" size="sm" className="bg-white/90 backdrop-blur-sm">{m.brand}</Badge>
                                            </div>
                                        </div>
                                        <CardBody className="p-4 space-y-3">
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{m.name}</h4>
                                            <div className="flex items-center justify-between">
                                                <p className="text-blue-600 font-extrabold text-lg">
                                                    Rp {parseFloat(m.price).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
