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
    MapPin,
    Zap,
    Hash,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
    const { auth, settings = {} } = usePage().props;

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

                {/* STATS STRIP */}
                <section className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="py-12 px-6 flex flex-col justify-center items-center text-center"
                                >
                                    <div className="text-5xl font-black text-black tracking-tighter mb-2">{stat.value}</div>
                                    <p className="text-[#1c69d4] font-bold uppercase tracking-widest text-[11px]">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TWO NETWORK CLASSIFICATIONS */}
                
                {/* 1. JARINGAN DEALER UTAMA (WITH WORKSHOPS) */}
                <section className="py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16">
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
                                DEALER UTAMA & PUSAT LAYANAN (SSM)
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">STANDAR LAYANAN PURNA JUAL (BENGKEL & SUKU CADANG)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: "SSM MEKAR SARI (PUSAT)", addr: "Jl. Mekar Sari No.39, Bekasi Jaya, Kec. Bekasi Tim." },
                                { name: "SSM JATIASIH", addr: "Jl. Raya Jatimekar No.17, Jatimekar, Kec. Jatiasih" },
                                { name: "SSM DEPOK", addr: "Jl. Tirta Mulya 5 No.78, Tirtajaya, Kec. Sukmajaya" },
                                { name: "SSM BOGOR", addr: "Jl. Raya Tajur No.39D, Tajur, Kec. Bogor Tim." },
                                { name: "SSM TANGERANG", addr: "Jl. Imam Bonjol No.100A, Karawaci" }
                            ].map((branch, i) => (
                                <div key={i} className="bg-gray-50 p-8 border border-gray-100 hover:border-[#1c69d4] transition-all group">
                                    <h4 className="text-lg font-black text-black uppercase tracking-tighter mb-3">{branch.name}</h4>
                                    <p className="text-gray-500 font-light text-xs mb-6 leading-relaxed">{branch.addr}</p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="px-3 py-1 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest border border-green-200">
                                            FASILITAS BENGKEL AKTIF
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. JARINGAN PENJUALAN (SALES NETWORK - NO WORKSHOPS) */}
                <section className="py-24 bg-[#fafafa]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16">
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4 text-center">
                                JARINGAN PENJUALAN (SALES NETWORK)
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] text-center italic">CABANG KHUSUS PENJUALAN UNIT & SHOWROOM (SETARA SRB)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "SRB MOTOR (CABANG INI)", addr: "Showroom Utama SRB Motor - Bekasi" },
                                { name: "SSM PONDOK UNGU", addr: "Jl. Sultan Agung No.12, Pondok Ungu, Bekasi" },
                                { name: "SSM ALINDA", addr: "Jl. Raya Alinda No.8, Bekasi Utara" }
                            ].map((branch, i) => (
                                <div key={i} className="bg-white p-10 border-2 border-black hover:bg-black hover:text-white transition-all duration-500 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                                        <ShieldCheck size={100} />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 relative z-10">{branch.name}</h4>
                                    <p className="text-xs font-light text-gray-400 group-hover:text-gray-500 mb-8 leading-relaxed relative z-10 italic">
                                        "Sales network terafiliasi SSM. Fokus pada distribusi unit motor pilihan dengan kualitas inspeksi standar tinggi."
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-gray-100 group-hover:border-gray-800 relative z-10">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">SALES ONLY POINT</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-1 bg-black"></span>
                                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">FILOSOFI KAMI</h2>
                            </div>
                            <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                                <p>Didirikan atas satu keyakinan mendasar: proses akuisisi kendaraan bermotor seharusnya presisi, logis, dan sepenuhnya transparan.</p>
                                <p>Sebagai mitra terverifikasi SSM, kami memadukan standarisasi korporat dengan kelincahan dealer independen.</p>
                                <p className="text-black font-bold uppercase tracking-widest text-[12px] pt-4">"KAMI TIDAK MENJUAL KENDARAAN. KAMI MENJUAL KEPASTIAN."</p>
                            </div>
                        </div>
                         <div className="bg-black aspect-video relative overflow-hidden">
                             <img src="/assets/img/about-us.webp" className="w-full h-full object-cover opacity-60 grayscale" alt="About SRB" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="p-8 border border-white/20 backdrop-blur-md">
                                     <span className="text-white font-black text-4xl uppercase tracking-widest">EST. 2020</span>
                                 </div>
                             </div>
                         </div>
                    </div>
                </section>

                {/* FULL WIDTH CTA */}
                <section className="bg-[#1c69d4] text-white py-24">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-10">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">BUKTIKAN KENDALI MUTU KAMI SECARA LANGSUNG</h2>
                        <div className="flex flex-row gap-4 justify-center">
                            <Link href={route("motors.index")} className="px-8 py-5 bg-black text-white font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-white hover:text-black transition-colors">AKSES KATALOG</Link>
                        </div>
                    </div>
                </section>
                
            </div>
        </PublicLayout>
    );
}
