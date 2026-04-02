import React, { useState } from "react";
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
    ArrowRight
} from "lucide-react";

export default function Help() {
    const { auth, settings } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);

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
            hoverText: "group-hover:text-[#1c69d4]"
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
            hoverText: "group-hover:text-blue-400"
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
            hoverText: "group-hover:text-blue-200"
        }
    ];

    return (
        <PublicLayout auth={auth} title="Bantuan Pelanggan - SRB Motor">
            <div className="flex-grow pt-28 bg-white">
                {/* HERO SECTION - BLACK */}
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">BANTUAN PELANGGAN</span>
                        </nav>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end">
                            <div className="space-y-6">
                                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">PUSAT DUKUNGAN TEKNIS & LAYANAN</span>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    APAKAH <br />
                                    ADA YANG BISA <br />
                                    KAMI <span className="text-[#1c69d4]">BANTU?</span>
                                </h1>
                            </div>
                            
                            <div className="relative group w-full max-w-md">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                    PENCARIAN KATA KUNCI
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ketik Pertanyaan Anda..."
                                        className="w-full bg-transparent border-0 border-b-2 border-gray-700 py-4 pl-0 pr-12 focus:border-[#1c69d4] focus:ring-0 outline-none transition-colors text-white font-bold uppercase placeholder-gray-600 text-lg"
                                    />
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6 group-focus-within:text-[#1c69d4] transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMMUNICATION CHANNELS */}
                <section className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
                            {supportChannels.map((channel, idx) => (
                                <div
                                    key={idx}
                                    className={`${channel.bg} ${channel.text} border-t lg:border-t-0 p-12 flex flex-col group cursor-pointer transition-colors`}
                                >
                                    <div className="mb-8">
                                        {channel.icon}
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">
                                        {channel.title}
                                    </h4>
                                    <p className={`font-light text-sm mb-12 ${channel.descClass || 'opacity-80'}`}>
                                        {channel.desc}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className={`font-bold text-[11px] uppercase tracking-widest ${channel.hoverText} transition-colors`}>
                                            {channel.value}
                                        </span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Title area */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-32">
                                <div className="w-8 h-1 bg-[#1c69d4] mb-6"></div>
                                <h2 className="text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter mb-4">
                                    TANYA JAWAB UMUM
                                </h2>
                                <p className="text-gray-500 font-light text-sm leading-relaxed mb-8">
                                    Jawaban komprehensif atas pertanyaan yang paling sering diajukan terkait administrasi, pembiayaan, dan ketentuan jaminan kualitas.
                                </p>
                            </div>
                        </div>

                        {/* Accordion area */}
                        <div className="w-full lg:w-2/3 space-y-12">
                            {faqs.map((category, catIdx) => (
                                <div key={catIdx}>
                                    <h3 className="text-[11px] font-bold text-[#1c69d4] uppercase tracking-[0.2em] mb-6 border-b border-gray-200 pb-2">
                                        {category.category}
                                    </h3>
                                    
                                    <div className="space-y-px bg-gray-200 border border-gray-200">
                                        {category.items.map((item, itemIdx) => {
                                            const key = `${catIdx}-${itemIdx}`;
                                            const isOpen = openFaq === key;
                                            
                                            // Handle simple search filtering
                                            if (searchQuery && !item.q.toLowerCase().includes(searchQuery.toLowerCase()) && !item.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                                                return null;
                                            }

                                            return (
                                                <div key={itemIdx} className="bg-white">
                                                    <button
                                                        onClick={() => setOpenFaq(isOpen ? null : key)}
                                                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        <span className="text-lg font-black text-black uppercase tracking-tight pr-8">
                                                            {item.q}
                                                        </span>
                                                        <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border ${isOpen ? 'border-[#1c69d4] bg-[#1c69d4] text-white' : 'border-gray-300 text-black'} transition-colors rounded-none`}>
                                                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                                                        </span>
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-6 pt-0 text-gray-600 font-light leading-relaxed border-t border-gray-50 ml-6">
                                                                    {item.a}
                                                                </div>
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
                </section>

                {/* OFFLINE SHOWROOM */}
                <section className="bg-black text-white py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">
                                    KUNJUNGI FASILITAS KAMI
                                </h2>
                                <p className="text-gray-400 font-light text-lg mb-10 max-w-md leading-relaxed">
                                    Interaksi langsung dengan tim ahli kami dan lihat langsung inventaris kendaraan dalam kondisi aslinya.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <MapPin className="w-6 h-6 text-[#1c69d4] flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-[11px] uppercase tracking-widest text-[#1c69d4] mb-1">ALAMAT SHOWROOM</p>
                                            <p className="font-light text-gray-300 leading-relaxed uppercase break-words">
                                                {settings?.contact_address || "Jalan Raya Utama No. 12, Bekasi Selatan, Jawa Barat 17144"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4 border-t border-gray-800">
                                        <div className="w-6 flex-shrink-0"></div>
                                        <div>
                                            <p className="font-bold text-[11px] uppercase tracking-widest text-[#1c69d4] mb-1">JAM OPERASIONAL</p>
                                            <p className="font-light text-gray-300 uppercase">
                                                {settings?.business_hours ? (
                                                    (() => {
                                                        try {
                                                            const hours = JSON.parse(settings.business_hours);
                                                            return (
                                                                <>
                                                                    SENIN - SABTU : {hours.monday || "08.00 - 17.00"} <br/>
                                                                    MINGGU / HARI BESAR : {hours.sunday || "TUTUP"}
                                                                </>
                                                            );
                                                        } catch(e) {
                                                            return "SENIN - SABTU : 08.00 - 17.00";
                                                        }
                                                    })()
                                                ) : (
                                                    <>
                                                        SENIN - SABTU : 08.00 - 17.00<br />
                                                        MINGGU / HARI BESAR : TUTUP
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative h-[400px] border border-gray-800 bg-gray-900 overflow-hidden flex items-center justify-center p-8 group cursor-pointer">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="absolute inset-0 bg-[#1c69d4] mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                                
                                <div className="text-center relative z-10">
                                    <MapPin className="w-12 h-12 text-[#1c69d4] mx-auto mb-4" />
                                    <span className="inline-block border border-[#1c69d4] text-[#1c69d4] px-6 py-3 font-bold uppercase tracking-[0.2em] text-[10px] group-hover:bg-[#1c69d4] group-hover:text-white transition-colors">
                                        BUKA GOOGLE MAPS
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
        </PublicLayout>
    );
}
