import React, { useState, useEffect } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
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
    ShieldCheck,
    Phone,
    Clock,
    ExternalLink,
    Wrench,
    Store,
    Navigation,
    MessageSquare,
    Info,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function About({ branches: initialBranches = [] }) {
    const { auth, settings = {} } = usePage().props;
    
    const [branches, setBranches] = useState(initialBranches);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterService, setFilterService] = useState(false);
    const [sortBy, setSortBy] = useState("name"); // 'name' or 'distance'

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

    // Find nearest branch using GPS (Simplified version of Branches/Index.jsx)
    const findNearestBranch = () => {
        if (!navigator.geolocation) {
            setError("Browser Anda tidak mendukung GPS");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Fetch all branches with distance to enable sorting
                    const allResponse = await fetch(
                        `/api/branches/with-distance?latitude=${latitude}&longitude=${longitude}`
                    );
                    const allData = await allResponse.json();
                    
                    if (allData.success) {
                        setBranches(allData.data);
                        setSortBy("distance");
                        
                        // Scroll to branches section
                        document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' });
                    }
                } catch (err) {
                    setError("Gagal mengambil data lokasi dari server");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                if (err.code === 1) { // PERMISSION_DENIED
                    setError("Akses lokasi ditolak. Silakan klik ikon gembok di alamat browser Anda dan pilih 'Allow/Izinkan' untuk lokasi.");
                } else {
                    setError("Gagal mendeteksi lokasi. Pastikan GPS Anda aktif.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const filteredBranches = branches
        .filter((branch) => !filterService || branch.can_service)
        .sort((a, b) => {
            if (sortBy === "distance" && a.distance !== undefined && b.distance !== undefined) {
                return a.distance - b.distance;
            }
            return a.name.localeCompare(b.name);
        });

    return (
        <PublicLayout auth={auth} title="Tentang Kami - SRB Motor">
            <Head>
                <meta name="description" content="Pelajari lebih lanjut tentang SRB Motor, jaringan dealer motor premium dengan standar inspeksi ketat dan transparansi mutlak." />
            </Head>
            
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
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    MENGUBAH <br />
                                    <span className="text-[#1c69d4]">STANDAR.</span>
                                </h1>
                                <p className="text-xl text-gray-400 font-light max-w-lg italic">
                                    "SRB Motor bukan sekadar dealer. Kami adalah kurator kendaraan roda dua yang menetapkan tolok ukur baru dalam kualitas, transparansi, dan layanan distribusi purna-jual."
                                </p>
                            </motion.div>
                            <div className="hidden lg:block relative h-[400px]">
                                <div className="absolute inset-0 bg-[#1c69d4] blur-3xl opacity-20 transform -rotate-12 translate-x-10 pointer-events-none"></div>
                                <div className="absolute right-0 top-0 w-full h-full flex items-center justify-center z-10">
                                    <div className="p-12 border border-gray-800 bg-black/40 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-700">
                                        <img 
                                            src={settings?.site_logo || "/assets/icon/logo.webp"} 
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
                                    viewport={{ once: true }}
                                    className="py-12 px-6 flex flex-col justify-center items-center text-center"
                                >
                                    <div className="text-5xl font-black text-black tracking-tighter mb-2">{stat.value}</div>
                                    <p className="text-[#1c69d4] font-bold uppercase tracking-widest text-[11px]">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* DYNAMIC BRANCH NETWORK SECTION */}
                <section id="branches" className="py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4 leading-none">
                                    JARINGAN <span className="text-[#1c69d4]">NASIONAL.</span>
                                </h2>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-6">STANDAR LAYANAN TERPADU DI SELURUH CABANG SRB MOTOR & SSM</p>
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                                    <button 
                                        onClick={findNearestBranch}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1c69d4] transition-all disabled:opacity-50"
                                    >
                                        <Navigation size={12} className={loading ? "animate-spin" : ""} />
                                        {loading ? "MENCARI..." : "CABANG TERDEKAT"}
                                    </button>
                                    <label className="inline-flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={filterService}
                                                onChange={(e) => setFilterService(e.target.checked)}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#1c69d4] transition-all"></div>
                                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-all"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 group-hover:text-black uppercase tracking-widest transition-colors">HANYA WORKSHOP</span>
                                    </label>
                                </div>
                                {error && (
                                    <div className="mt-4 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                                        <AlertCircle size={12} /> {error}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 text-right">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">FILTER URUTAN</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent border-b-2 border-black text-xs font-black uppercase tracking-widest focus:outline-none py-1 cursor-pointer"
                                >
                                    <option value="name">URUTKAN: NAMA</option>
                                    <option value="distance" disabled={!branches.some(b => b.distance)}>URUTKAN: JARAK TERDEKAT</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            <AnimatePresence mode="popLayout">
                                {filteredBranches.map((branch, i) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        key={branch.code} 
                                        className="relative group flex flex-col"
                                    >
                                        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#1c69d4] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                        
                                        <div className="bg-gray-50/50 p-8 border border-gray-100 group-hover:bg-white group-hover:shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex-grow">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-white border border-gray-100 text-black">
                                                    {branch.can_service ? <Wrench size={18} /> : <Store size={18} />}
                                                </div>
                                                {branch.is_main_branch && (
                                                    <span className="text-[8px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">PUSAT</span>
                                                )}
                                                {branch.distance && (
                                                    <span className="text-[8px] font-black text-[#1c69d4] uppercase tracking-widest">{branch.distance} KM</span>
                                                )}
                                            </div>

                                            <h4 className="text-xl font-black text-black uppercase tracking-tighter mb-4 leading-tight group-hover:text-[#1c69d4] transition-colors">{branch.name}</h4>
                                            
                                            <div className="space-y-4 mb-8">
                                                <div className="flex gap-3">
                                                    <MapPin size={12} className="text-gray-400 shrink-0 mt-1" />
                                                    <p className="text-[11px] text-gray-500 font-light leading-relaxed truncate-2-lines">{branch.address}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone size={12} className="text-gray-400 shrink-0" />
                                                    <a href={`tel:${branch.phone}`} className="text-[10px] font-bold text-gray-800 hover:text-[#1c69d4] font-mono tracking-tight">{branch.phone}</a>
                                                </div>
                                                {branch.operational_hours && (
                                                    <div className="flex items-start gap-3">
                                                        <Clock size={12} className="text-gray-400 shrink-0 mt-0.5" />
                                                        <div className="text-[10px] font-medium text-gray-600">
                                                            <span>{branch.operational_hours.monday}</span>
                                                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">SETIAP HARI</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                                <a 
                                                    href={branch.maps_url} 
                                                    target="_blank" 
                                                    className="flex items-center justify-center gap-2 py-3 border border-gray-200 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                                >
                                                    <ExternalLink size={10} /> MAPS
                                                </a>
                                                {branch.whatsapp && (
                                                    <a 
                                                        href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, "")}`} 
                                                        target="_blank" 
                                                        className="flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 text-[#25D366] text-[9px] font-black uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all"
                                                    >
                                                        <MessageSquare size={10} /> CHAT
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
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
                         <div className="bg-black aspect-video relative overflow-hidden group">
                             <img src="/assets/img/about-us.webp" className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-110 transition-transform duration-700" alt="About SRB" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="p-8 border border-white/20 backdrop-blur-md">
                                     <span className="text-white font-black text-4xl uppercase tracking-widest">EST. 2023</span>
                                 </div>
                             </div>
                         </div>
                    </div>
                </section>

                {/* FULL WIDTH CTA */}
                <section className="bg-[#1c69d4] text-white py-24">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-10">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
                            BUKTIKAN KENDALI MUTU KAMI <br />
                            <span className="text-black">SECARA LANGSUNG.</span>
                        </h2>
                        <div className="flex flex-row gap-4 justify-center">
                            <Link href={route("motors.index")} className="px-8 py-5 bg-black text-white font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-white hover:text-black transition-colors shadow-2xl">AKSES KATALOG</Link>
                        </div>
                    </div>
                </section>
                
            </div>
        </PublicLayout>
    );
}
