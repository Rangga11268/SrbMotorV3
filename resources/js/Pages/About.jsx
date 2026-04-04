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
        { label: "UNIT TERJUAL", value: "500+" },
        { label: "KEPUASAN", value: "99%" },
        { label: "TAHUN BERDIRI", value: "5" },
    ];

    const missions = [
        {
            icon: <CheckCircle className="text-white" size={24} />,
            title: "SELEKSI TERKURASI",
            description: "Hanya unit dengan kondisi prima yang lolos standar kendali mutu ketat kami.",
        },
        {
            icon: <Trophy className="text-white" size={24} />,
            title: "PENGUJIAN KETAT",
            description: "150-poin inspeksi teknis dikerjakan langsung oleh mekanik bersertifikat penuh.",
        },
        {
            icon: <Heart className="text-white" size={24} />,
            title: "TRANSPARANSI MUTLAK",
            description: "Dokumentasi legal menyeluruh dan penetapan harga final, tanpa manipulasi.",
        },
        {
            icon: <Users className="text-white" size={24} />,
            title: "ORIENTASI KOMUNITAS",
            description: "Kemitraan jangka panjang dan dukungan after-sales berkelanjutan.",
        },
    ];

    return (
        <PublicLayout auth={auth} title="Tentang Kami - SRB Motor">
            <div className="flex-grow pt-28 bg-white">
                
                {/* HERO SECTION - BLACK */}
                <section className="bg-black text-white py-24 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">TENTANG KAMI</span>
                        </nav>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    MENGUBAH <br />
                                    <span className="text-[#1c69d4]">STANDAR.</span>
                                </h1>
                                <p className="text-xl text-gray-400 font-light max-w-lg">
                                    SRB Motor beroperasi sebagai dealer independen terafiliasi dengan SSM, menetapkan tolok ukur baru dalam distribusi dan pembiayaan kendaraan roda dua.
                                </p>
                            </div>
                            <div className="hidden lg:block relative h-[400px]">
                                <div className="absolute inset-0 bg-[#1c69d4] blur-3xl opacity-20 transform -rotate-12 translate-x-10 pointer-events-none"></div>
                                <div className="absolute right-0 top-0 w-full h-full flex items-center justify-center z-10">
                                    <div className="p-12 border border-gray-800 bg-black/40 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-700">
                                        <img 
                                            src={usePage().props.settings?.site_logo || "/assets/icon/logo.webp"} 
                                            alt="SRB Motor Logo" 
                                            className="h-32 w-auto object-contain opacity-80"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS STRIP - GRAY */}
                <section className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="py-12 px-6 flex flex-col justify-center items-center text-center"
                                >
                                    <div className="text-5xl font-black text-black tracking-tighter mb-2">
                                        {stat.value}
                                    </div>
                                    <p className="text-[#1c69d4] font-bold uppercase tracking-widest text-[11px]">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STORY & VISION */}
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Image Block */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 h-[600px] bg-black relative"
                        >
                            <img
                                src="/assets/img/about-us.webp"
                                alt="SRB Motors Team"
                                className="w-full h-full object-cover grayscale opacity-80"
                            />
                            <div className="absolute bottom-0 left-0 bg-[#1c69d4] px-6 py-4">
                                <span className="text-white font-black text-2xl uppercase tracking-widest">EST. 2020</span>
                            </div>
                        </motion.div>

                        {/* Text Block */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="lg:col-span-7 flex flex-col justify-center space-y-12"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="w-12 h-1 bg-black"></span>
                                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                        FILOSOFI KAMI
                                    </h2>
                                </div>
                                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                                    <p>
                                        Didirikan atas satu keyakinan mendasar: proses akuisisi kendaraan bermotor seharusnya presisi, logis, dan sepenuhnya transparan. Kami lahir untuk menghapus stigma "perjudian" pada pasar motor sekunder.
                                    </p>
                                    <p>
                                        Sebagai mitra terverifikasi SSM, kami memadukan standarisasi korporat dengan kelincahan dealer independen. Setiap kendaraan yang masuk ke garasi kami tidak sekadar dicuci; unit tersebut dibongkar, diperiksa, dan dipulihkan kembali ke titik optimal performanya.
                                    </p>
                                    <p className="text-black font-bold uppercase tracking-widest text-[12px] pt-4">
                                        "KAMI TIDAK MENJUAL KENDARAAN. KAMI MENJUAL KEPASTIAN."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* VISUAL BREAK */}
                <div className="w-full h-px bg-gray-200"></div>

                {/* THE PILLARS (Grid Matrix) */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16">
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
                                PILAR OPERASIONAL
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">4 FONDASI STANDAR KERJA SRB MOTOR</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                            {missions.map((mission, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-10 flex flex-col hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-black flex items-center justify-center mb-8 group-hover:bg-[#1c69d4] transition-colors">
                                        {mission.icon}
                                    </div>
                                    <h4 className="text-lg font-black text-black mb-4 uppercase tracking-tighter">
                                        {mission.title}
                                    </h4>
                                    <p className="text-gray-600 font-light text-sm">
                                        {mission.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* JARINGAN SSM */}
                <section className="bg-gray-100 py-24 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16">
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
                                JARINGAN MITRA BENGKEL SSM
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">DUKUNGAN AFTER-SALES DI BERBAGAI KOTA</p>
                            <p className="text-gray-600 font-light mt-4 max-w-2xl leading-relaxed">
                                Sebagai tambahan fasilitas, kami bermitra dengan jaringan bengkel resmi SSM untuk memastikan pelanggan SRB Motor memiliki akses mudah ke layanan servis terstandarisasi. Jam operasional seluruh cabang 08.00–17.00 WIB setiap hari.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-300 border border-gray-300">
                            {[
                                { name: "SSM JATIASIH", city: "BEKASI", addr: "Jl. Raya Jatimekar No.17, Jatimekar, Kec. Jatiasih" },
                                { name: "SSM MEKAR SARI", city: "BEKASI", addr: "Jl. Mekar Sari No.39, Bekasi Jaya, Kec. Bekasi Tim." },
                                { name: "SSM DEPOK", city: "DEPOK", addr: "Jl. Tirta Mulya 5 No.78, Tirtajaya, Kec. Sukmajaya" },
                                { name: "SSM BOGOR", city: "BOGOR", addr: "Jl. Raya Tajur No.39D, Tajur, Kec. Bogor Tim." },
                                { name: "SSM TANGERANG", city: "TANGERANG", addr: "Jl. Imam Bonjol No.100A, Karawaci" }
                            ].map((branch, i) => (
                                <div key={i} className="bg-white p-8 flex flex-col hover:bg-gray-50 cursor-pointer group">
                                    <h4 className="text-lg font-black text-black uppercase tracking-tighter mb-2">{branch.name}</h4>
                                    <p className="text-[#1c69d4] font-bold text-[10px] uppercase tracking-widest mb-4">{branch.city}</p>
                                    <p className="text-gray-600 font-light text-sm flex-grow mb-6">{branch.addr}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <a href={`https://maps.google.com/?q=${encodeURIComponent(branch.addr + ', ' + branch.city)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-[#1c69d4] transition-colors">
                                            MAPS/NAVIGASI <ChevronRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                            {/* Empty filler block to make the grid perfect 3 cols */}
                            <div className="bg-gray-100 p-8 flex items-center justify-center">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">EKSPLORASI LEBIH LANJUT</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FULL WIDTH CTA */}
                <section className="bg-[#1c69d4] text-white py-24">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-10">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                            BUKTIKAN KENDALI MUTU KAMI SECARA LANGSUNG
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route("motors.index")}
                                className="px-8 py-5 bg-black text-white font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-white hover:text-black transition-colors"
                            >
                                AKSES KATALOG
                            </Link>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-5 bg-transparent border border-white text-white font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-white hover:text-black transition-colors"
                            >
                                @SRBMOTOR
                            </a>
                        </div>
                    </div>
                </section>
                
            </div>
        </PublicLayout>
    );
}
