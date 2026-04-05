import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    Search,
    MessageSquare,
    Phone,
    Mail,
    MapPin,
    Plus,
    Minus,
    ArrowRight,
    BookOpen,
    ShieldCheck,
    Lock,
    HelpCircle,
    Bike,
    FileCheck,
    Calendar,
    Truck
} from "lucide-react";

export default function Help({ initialTab = "faq" }) {
    const { auth, settings } = usePage().props;

    // Parse business hours
    const businessHours = React.useMemo(() => {
        try {
            return typeof settings?.business_hours === 'string' 
                ? JSON.parse(settings.business_hours) 
                : settings?.business_hours || {};
        } catch (e) {
            return {};
        }
    }, [settings?.business_hours]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const tabs = [
        { id: "faq", label: "FAQ & BANTUAN", icon: <HelpCircle className="w-4 h-4" /> },
        { id: "guide", label: "PANDUAN PEMESANAN", icon: <BookOpen className="w-4 h-4" /> },
        { id: "terms", label: "SYARAT & KETENTUAN", icon: <ShieldCheck className="w-4 h-4" /> },
        { id: "privacy", label: "KEBIJAKAN PRIVASI", icon: <Lock className="w-4 h-4" /> },
    ];

    const faqs = [
        {
            category: "PROSES PEMBELIAN",
            items: [
                {
                    q: "Bagaimana standar proses verifikasi kredit di SRB Motor?",
                    a: "Proses verifikasi dilakukan melalui mitra leasing terdaftar kami. Setelah Anda mengisi pengajuan, tim analis akan menghubungi maksimal 1x24 jam untuk melakukan penjadwalan survei. Data yang dibutuhkan minimal berupa E-KTP, KK, dan Bukti Penghasilan."
                },
                {
                    q: "Apakah DP (Down Payment) bisa dikembalikan jika pengajuan ditolak?",
                    a: "Ya. Kami menerapkan kebijakan transparansi mutlak. Jika pengajuan kredit ditolak secara sistem oleh mitra pembiayaan kami, maka 100% uang muka yang telah masuk akan dikembalikan (refund) tanpa potongan operasional apapun dalam estimasi 2-3 hari kerja."
                },
                {
                    q: "Berapa lama proses dari pembelian cash hingga motor dikirim?",
                    a: "Untuk pembelian tunai (cash) pada unit 'Ready Stock', proses administrasi dan PDI (Pre-Delivery Inspection) memakan waktu 4-6 jam. Unit dapat dikirimkan ke domisili Anda di hari yang sama (same-day delivery) asalkan pembayaran diselesaikan sebelum pukul 13.00."
                }
            ]
        },
        {
            category: "LAYANAN PURNA JUAL (AFTER-SALES)",
            items: [
                {
                    q: "Apakah seluruh unit dilengkapi dengan garansi?",
                    a: "Ya. Setiap unit sekunder yang keluar dari fasilitas SRB Motor mendapatkan Garansi Mesin Khusus selama 6 Bulan atau 5.000 KM (mana yang tercapai terlebih dahulu), mencakup blok mesin utama dan transmisi."
                },
                {
                    q: "Bagaimana prosedur klaim servis gratis?",
                    a: "Pelanggan dapat melakukan booking servis langsung melalui panel 'Akun Saya > Booking Servis'. Cukup tunjukkan Invoice asli (digital/fisik) dan Buku Perawatan SRB saat jadwal kedatangan Anda."
                }
            ]
        }
    ];

    const supportChannels = [
        {
            icon: <Phone size={24} />,
            title: "TELEPON LANGSUNG",
            desc: "Layanan respons cepat untuk situasi urgensi.",
            value: settings?.contact_phone || "+62 897-8638-849",
            bg: "bg-white",
            text: "text-black",
            descClass: "text-gray-500",
            border: "border-gray-200",
            hoverText: "group-hover:text-[#1c69d4]",
            hoverBg: "hover:bg-gray-50"
        },
        {
            icon: <MessageSquare size={24} />,
            title: "CHAT WHATSAPP",
            desc: "Jalur komunikasi utama tim representatif kami.",
            value: settings?.contact_phone || "Klik untuk Memulai Percakapan",
            bg: "bg-black",
            text: "text-white",
            descClass: "text-gray-400",
            border: "border-black",
            hoverText: "group-hover:text-blue-400",
            hoverBg: "hover:bg-[#1c69d4]" // Turn blue on hover for consistent premium feel
        },
        {
            icon: <Mail size={24} />,
            title: "EMAIL KORPORAT",
            desc: "Untuk keperluan B2B, legal, dan kerja sama.",
            value: settings?.contact_email || "support@srbmotor.com",
            bg: "bg-[#1c69d4]",
            text: "text-white",
            descClass: "text-blue-100",
            border: "border-[#1c69d4]",
            hoverText: "group-hover:text-blue-200",
            hoverBg: "hover:bg-black" // Turn black on hover
        }
    ];

    const renderFaqTab = () => (
        <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200">
                {supportChannels.map((channel, idx) => (
                    <div
                        key={idx}
                        className={`${channel.bg} ${channel.text} p-10 flex flex-col group cursor-pointer transition-all duration-500 ${channel.hoverBg}`}
                    >
                        <div className="mb-6">{channel.icon}</div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">{channel.title}</h4>
                        <p className={`font-light text-xs mb-8 ${channel.descClass || 'opacity-80'}`}>{channel.desc}</p>
                        <div className="mt-auto flex items-center justify-between">
                            <span className={`font-bold text-[10px] uppercase tracking-widest ${channel.hoverText} transition-colors`}>
                                {channel.value}
                            </span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-12">
                {faqs.map((category, catIdx) => (
                    <div key={catIdx}>
                        <h3 className="text-[11px] font-bold text-[#1c69d4] uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2">
                            {category.category}
                        </h3>
                        <div className="space-y-px bg-gray-100 border border-gray-100">
                            {category.items.map((item, itemIdx) => {
                                const key = `${catIdx}-${itemIdx}`;
                                const isOpen = openFaq === key;
                                if (searchQuery && !item.q.toLowerCase().includes(searchQuery.toLowerCase()) && !item.a.toLowerCase().includes(searchQuery.toLowerCase())) return null;
                                return (
                                    <div key={itemIdx} className="bg-white">
                                        <button onClick={() => setOpenFaq(isOpen ? null : key)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left">
                                            <span className="text-lg font-black text-black uppercase tracking-tight pr-8">{item.q}</span>
                                            <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border ${isOpen ? 'border-[#1c69d4] bg-[#1c69d4] text-white' : 'border-gray-200 text-black'} transition-colors`}>
                                                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <div className="p-6 pt-0 text-gray-500 font-light leading-relaxed border-t border-gray-50 ml-6 text-sm">{item.a}</div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGuideTab = () => (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Header Introduction */}
            <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black leading-tight">
                    LANGKAH MUDAH MEMILIKI KENDARAAN <span className="text-[#1c69d4]">IMPIAN</span>
                </h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] leading-loose max-w-lg">
                    Prosedur kepemilikan unit di SRB Motor dirancang untuk efisiensi maksimal, transparansi, dan keamanan data sepenuhnya.
                </p>
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative space-y-32">
                {/* Connecting Line (Vertical) */}
                <div className="absolute left-[39px] top-10 bottom-10 w-px bg-gray-100 lg:block hidden"></div>

                {[
                    {
                        step: "01",
                        title: "EKSPLORASI & PEMILIHAN",
                        icon: <Bike className="w-8 h-8" />,
                        desc: "Telusuri katalog premium kami yang selalu diperbarui setiap hari.",
                        customer: [
                            "Cek detail spesifikasi & galeri foto unit",
                            "Lakukan simulasi kredit di halaman produk",
                            "Pilih opsi pembayaran (Cash/Kredit)"
                        ],
                        srb: "Tim kami melakukan pengecekan kualitas fisik menyeluruh sebelum unit masuk ke katalog."
                    },
                    {
                        step: "02",
                        title: "VERIFIKASI & ADMINISTRASI",
                        icon: <FileCheck className="w-8 h-8" />,
                        desc: "Lengkapi data identitas Anda melalui sistem enkripsi kami.",
                        customer: [
                            "Siapkan E-KTP & Kartu Keluarga (KK)",
                            "Isi formulir pemesanan secara digital",
                            "Tunggu konfirmasi tim via WhatsApp/Email"
                        ],
                        srb: "Data Anda dienkripsi secara aman dan hanya dapat diakses oleh tim verifikator resmi.",
                        require: ["E-KTP", "Kartu Keluarga", "Bukti Penghasilan"]
                    },
                    {
                        step: "03",
                        title: "SURVEI & APPROVAL",
                        icon: <Calendar className="w-8 h-8" />,
                        desc: "Proses verifikasi akhir oleh mitra pembiayaan kami (Leasing).",
                        customer: [
                            "Terima kunjungan survei (jika diperlukan)",
                            "Pahami rincian kontrak dan asuransi",
                            "Terima notifikasi approval dalam 1x24 jam"
                        ],
                        srb: "Kami menjalin komunikasi intensif dengan mitra leasing untuk memastikan approval cepat."
                    },
                    {
                        step: "04",
                        title: "PENGIRIMAN & SERAH TERIMA",
                        icon: <Truck className="w-8 h-8" />,
                        desc: "Unit siap dikirimkan langsung ke domisili Anda.",
                        customer: [
                            "Konfirmasi jadwal pengiriman unit",
                            "Lakukan serah terima & cek fisik unit",
                            "Penandatanganan tanda terima pengiriman"
                        ],
                        srb: "PDI Akhir (Pre-Delivery Inspection) dilakukan sekali lagi sebelum unit diberangkatkan.",
                        cta: true
                    }
                ].map((item, i) => (
                    <div key={i} className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 group last:pb-0">
                        {/* Step Marker */}
                        <div className="lg:col-span-1 flex flex-col items-center">
                            <div className="w-20 h-20 bg-white border-2 border-gray-100 flex items-center justify-center text-black font-black text-2xl group-hover:border-[#1c69d4] group-hover:bg-[#1c69d4] group-hover:text-white transition-all duration-500 z-10">
                                {item.step}
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="lg:col-span-11 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="p-5 bg-gray-50 text-[#1c69d4] group-hover:bg-blue-50 transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-black">{item.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-50/50 p-8 md:p-12 border border-gray-100 group-hover:border-blue-100 transition-colors">
                                {/* Checklist Customer */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-[#1c69d4] uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#1c69d4] rounded-full"></div> TINDAKAN PELANGGAN
                                    </p>
                                    <ul className="space-y-4">
                                        {item.customer.map((li, liIdx) => (
                                            <li key={liIdx} className="flex gap-4 text-xs font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                                                <div className="w-1 h-4 bg-gray-200 mt-0.5"></div>
                                                {li}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Checklist SRB */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div> PROSES INTERNAL SRB
                                    </p>
                                    <p className="text-[11px] font-medium text-gray-500 italic leading-loose uppercase tracking-wider">
                                        "{item.srb}"
                                    </p>
                                    {item.require && (
                                        <div className="pt-6 flex flex-wrap gap-2">
                                            {item.require.map((req, rIdx) => (
                                                <span key={rIdx} className="px-3 py-1.5 bg-white border border-gray-200 text-[9px] font-black uppercase tracking-widest text-[#1c69d4]">
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Final Call to Action */}
            <div className="bg-black p-12 text-center space-y-10 group overflow-hidden relative">
                <div className="absolute inset-0 bg-[#1c69d4] opacity-0 group-hover:opacity-10 transition-opacity blur-3xl pointer-events-none"></div>
                <div className="space-y-3 relative z-10">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">SIAP UNTUK MEMULAI?</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">UNIT TERBAIK KAMI SEDANG MENUNGGU ANDA</p>
                </div>
                <Link 
                    href="/motors" 
                    className="inline-flex items-center gap-6 bg-[#1c69d4] text-white px-12 py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all relative z-10"
                >
                    LIHAT KATALOG TERBARU <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );

    const LegalTabContent = ({ title, sections }) => {
        const [localActiveSection, setLocalActiveSection] = useState(sections[0]?.h || "");

        return (
            <div className="space-y-12 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-black">{title}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Pusat Dokumentasi Hukum SRB Motor • Terakhir Diperbarui: 1 April 2026</p>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 border border-black text-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all group">
                        <FileCheck className="w-4 h-4 group-hover:scale-110 transition-transform" /> VERSI CETAK (PDF)
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                    <div className="lg:col-span-4">
                        <div className="sticky top-44 space-y-4">
                            <p className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-[0.2em] mb-6">DAFTAR ISI DOKUMEN</p>
                            <nav className="space-y-2">
                                {sections.map((section, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setLocalActiveSection(section.h);
                                            const el = document.getElementById(`section-${idx}`);
                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }}
                                        className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-l-2 ${
                                            localActiveSection === section.h 
                                            ? "border-[#1c69d4] bg-blue-50/30 text-[#1c69d4]" 
                                            : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                                        }`}
                                    >
                                        Pasal {idx + 1}: {section.h}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-12">
                        {sections.map((section, i) => (
                            <section 
                                key={i} 
                                id={`section-${i}`}
                                className={`p-8 md:p-10 border transition-all duration-500 ${
                                    localActiveSection === section.h ? "border-[#1c69d4] bg-white shadow-xl shadow-blue-100/20" : "border-gray-100 bg-white"
                                }`}
                                onMouseEnter={() => setLocalActiveSection(section.h)}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-none transition-colors ${localActiveSection === section.h ? "bg-[#1c69d4] text-white" : "bg-gray-100 text-gray-400"}`}>
                                        {section.icon || <FileCheck className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-[#1c69d4] tracking-[0.2em] uppercase">PASAL {i + 1}</span>
                                        <h3 className="text-xl font-black text-black uppercase tracking-tight">{section.h}</h3>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 font-light leading-relaxed uppercase tracking-wide">
                                        {section.p}
                                    </p>
                                    {section.list && (
                                        <ul className="space-y-3 pt-4">
                                            {section.list.map((li, liIdx) => (
                                                <li key={liIdx} className="flex gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                                    <span className="text-[#1c69d4]">•</span>
                                                    {li}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <PublicLayout auth={auth} title="Pusat Informasi & Bantuan - SRB Motor">
            <div className="bg-white min-h-screen pt-28">
                {/* UNIFIED HERO */}
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1c69d4] opacity-10 pointer-events-none blur-[100px] -translate-x-1/2"></div>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-700" />
                            <span className="text-gray-500">SUPPORT CENTER</span>
                        </nav>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    APAKAH ADA YANG <br />
                                    BISA KAMI <span className="text-[#1c69d4]">BANTU?</span>
                                </h1>
                            </div>
                            
                            <div className="relative group w-full max-w-md ml-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="KATA KUNCI PENCARIAN..."
                                        className="w-full bg-transparent border-0 border-b-2 border-gray-800 py-4 pl-0 pr-12 focus:border-[#1c69d4] focus:ring-0 outline-none transition-all text-white font-black uppercase tracking-widest placeholder-gray-700"
                                    />
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 w-6 h-6 group-focus-within:text-[#1c69d4] transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TABBED NAVIGATION */}
                <div className="border-b border-gray-100 sticky top-[72px] bg-white z-40">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="flex overflow-x-auto no-scrollbar gap-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-6 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${
                                        activeTab === tab.id ? "text-black" : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        {tab.id === activeTab && <span className="w-1.5 h-1.5 bg-[#1c69d4] rounded-full"></span>}
                                        {tab.label}
                                    </span>
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTabSupport" className="absolute bottom-0 left-0 right-0 h-1 bg-[#1c69d4]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "faq" && renderFaqTab()}
                            {activeTab === "guide" && renderGuideTab()}
                            {activeTab === "terms" && (
                                <LegalTabContent 
                                    title="SYARAT & KETENTUAN" 
                                    sections={[
                                        { 
                                            h: "Ketentuan Umum", 
                                            icon: <HelpCircle className="w-5 h-5" />,
                                            p: "SRB Motor adalah platform resmi penjualan sepeda motor bekas premium. Setiap transaksi melalui platform ini dilindungi oleh hukum perdagangan yang berlaku di Republik Indonesia.",
                                            list: ["Pengguna wajib berusia minimal 17 tahun", "Memiliki identitas resmi (KTP/SIM)", "Setuju mematuhi kode etik transaksi aman"]
                                        },
                                        { 
                                            h: "Harga & Pembayaran", 
                                            icon: <Bike className="w-5 h-5" />,
                                            p: "Harga yang tertera adalah OTR wilayah setempat. Kami menerima pembayaran Tunai dan Kredit melalui mitra lembaga pembiayaan resmi (Leasing).",
                                            list: ["Harga sewaktu-waktu dapat berubah sebelum ada booking fee", "Pembayaran sah hanya melalui rekening PT Sinar Surya Motor", "Bukti transfer wajib diunggah ke sistem untuk verifikasi"]
                                        },
                                        { 
                                            h: "Pembatalan & Refund", 
                                            icon: <MessageSquare className="w-5 h-5" />,
                                            p: "Kami menghargai fleksibilitas Anda. Kebijakan pengembalian dana kami dirancang untuk melindungi kedua belah pihak.",
                                            list: ["Refund 100% jika pengajuan kredit ditolak leasing", "Potongan administrasi 5% jika pembatalan sepihak setelah unit siap", "Proses refund memakan waktu 3-5 hari kerja"]
                                        },
                                        { 
                                            h: "Garansi Kualitas", 
                                            icon: <ShieldCheck className="w-5 h-5" />,
                                            p: "Setiap unit motor mendapatkan jaminan mesin selama 6 bulan atau 5.000 KM. Garansi mencakup komponen transmisi dan blok mesin utama.",
                                            list: ["Wajib melakukan servis rutin di bengkel rekanan", "Garansi batal jika ada modifikasi ilegal", "Klaim garansi wajib menyertakan sertifikat inspeksi"]
                                        }
                                    ]} 
                                />
                            )}
                            {activeTab === "privacy" && (
                                <LegalTabContent 
                                    title="KEBIJAKAN PRIVASI" 
                                    sections={[
                                        { 
                                            h: "Pengumpulan Data", 
                                            icon: <Lock className="w-5 h-5" />,
                                            p: "Kami mengumpulkan data Anda semata-mata untuk keperluan verifikasi transaksi dan pengajuan kredit yang aman.",
                                            list: ["Data identitas (KTP/KK)", "Informasi kontak (WA/Email)", "Data perangkat untuk keamanan sistem"]
                                        },
                                        { 
                                            h: "Keamanan Dokumen", 
                                            icon: <FileCheck className="w-5 h-5" />,
                                            p: "Setiap dokumen yang diunggah diproses melalui enkripsi AES-256 dan hanya dapat diakses oleh pihak berwenang.",
                                            list: ["Storage cloud terenkripsi", "Akses terbatas bagi tim analis", "Audit keamanan sistem secara berkala"]
                                        },
                                        { 
                                            h: "Berbagi Pihak Ketiga", 
                                            icon: <Truck className="w-5 h-5" />,
                                            p: "Data Anda hanya dibagikan kepada mitra Leasing pilihan Anda yang telah terdaftar dan diawasi oleh OJK.",
                                            list: ["Mitra leasing (BAF, Adira, dll)", "Layanan pengiriman (Logistik internal)", "Pihak asuransi (jika memilih opsi asuransi)"]
                                        },
                                        { 
                                            h: "Transparansi Google", 
                                            icon: <Mail className="w-5 h-5" />,
                                            p: "Integrasi Google Auth hanya untuk mempermudah login tanpa menyimpan password Anda di database kami.",
                                            list: ["Hanya mengambil Nama & Email profil", "Tidak ada tracking aktivitas browser lain", "Opsi hapus tautan akun kapan saja"]
                                        }
                                    ]} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </section>

                {/* REUSED OFFLINE SHOWROOM (Only on FAQ tab for better flow if desired, or always) */}
                {activeTab === "faq" && (
                    <section className="bg-black text-white py-24 border-t border-gray-900">
                        <div className="max-w-7xl mx-auto px-6 md:px-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">KUNJUNGI FASILITAS KAMI</h2>
                                    <p className="text-gray-400 font-light text-lg mb-10 max-w-sm leading-relaxed uppercase tracking-wide">Temui tim ahli kami dan lihat inventaris kendaraan dalam kondisi aslinya.</p>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <MapPin className="w-6 h-6 text-[#1c69d4] shrink-0" />
                                            <div>
                                                <p className="font-bold text-[11px] uppercase tracking-widest text-[#1c69d4] mb-1">ALAMAT SHOWROOM</p>
                                                <p className="font-light text-gray-300 uppercase break-words">{settings?.contact_address || "Jl. Raya Utama No. 12, Bekasi Selatan"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4 border-t border-gray-800">
                                            <div className="w-6 shrink-0"></div>
                                            <div>
                                                <p className="font-bold text-[11px] uppercase tracking-widest text-[#1c69d4] mb-1">JAM OPERASIONAL</p>
                                                <p className="font-light text-gray-300 uppercase leading-relaxed">
                                                    {businessHours.monday === businessHours.saturday 
                                                        ? `SENIN - SABTU : ${businessHours.monday}` 
                                                        : `SENIN - JUMAT : ${businessHours.monday || "PAGI-SORE"}, SABTU: ${businessHours.saturday || "PAGI-SIANG"}`
                                                    } <br/>
                                                    MINGGU : {businessHours.sunday || "TUTUP"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-[400px] border border-gray-800 bg-gray-900 overflow-hidden flex items-center justify-center p-8 group cursor-pointer">
                                    <div className="absolute inset-0 bg-[#1c69d4] mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                                    <div className="text-center relative z-10">
                                        <MapPin className="w-12 h-12 text-[#1c69d4] mx-auto mb-4" />
                                        <span className="inline-block border border-[#1c69d4] text-[#1c69d4] px-8 py-4 font-black uppercase tracking-widest text-[10px] group-hover:bg-[#1c69d4] group-hover:text-white transition-all">BUKA GOOGLE MAPS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
