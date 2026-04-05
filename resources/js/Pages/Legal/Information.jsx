import React, { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, 
    BookOpen, 
    ShieldCheck, 
    Lock, 
    CheckCircle2, 
    Search,
    Bike,
    FileCheck,
    Calendar,
    Truck,
    ArrowRight
} from "lucide-react";

export default function Information({ initialTab = "guide" }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        { id: "guide", label: "Panduan Pemesanan", icon: <BookOpen className="w-4 h-4" /> },
        { id: "terms", label: "Syarat & Ketentuan", icon: <ShieldCheck className="w-4 h-4" /> },
        { id: "privacy", label: "Kebijakan Privasi", icon: <Lock className="w-4 h-4" /> },
    ];

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const renderGuide = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                    LANGKAH MUDAH MEMILIKI KENDARAAN <span className="text-[#1c69d4]">IMPIAN</span>
                </h2>
                <p className="text-gray-500 font-light max-w-2xl leading-relaxed">
                    Kami mempermudah proses kepemilikan motor di SRB Motor dengan sistem yang transparan, cepat, dan sepenuhnya terdigitalisasi.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                {[
                    {
                        step: "01",
                        title: "PILIH UNIT",
                        desc: "Telusuri katalog premium kami dan temukan motor yang sesuai dengan gaya hidup Anda.",
                        icon: <Bike className="w-8 h-8 text-[#1c69d4]" />
                    },
                    {
                        step: "02",
                        title: "VERIFIKASI",
                        desc: "Lengkapi data diri dan dokumen (KTP/KK) melalui sistem enkripsi kami yang aman.",
                        icon: <FileCheck className="w-8 h-8 text-[#1c69d4]" />
                    },
                    {
                        step: "03",
                        title: "SURVEI & APPROVAL",
                        desc: "Tim kami atau mitra leasing akan melakukan verifikasi cepat dalam 1x24 jam.",
                        icon: <Calendar className="w-8 h-8 text-[#1c69d4]" />
                    },
                    {
                        step: "04",
                        title: "PENGIRIMAN",
                        desc: "Unit akan diantar langsung ke depan pintu rumah Anda setelah proses tuntas.",
                        icon: <Truck className="w-8 h-8 text-[#1c69d4]" />
                    }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 group hover:bg-gray-50 transition-colors relative overflow-hidden">
                        <span className="text-5xl font-black text-gray-100 absolute -right-2 -bottom-2 group-hover:text-blue-50 transition-colors">
                            {item.step}
                        </span>
                        <div className="mb-6 relative z-10">{item.icon}</div>
                        <h4 className="text-lg font-black text-black mb-3 uppercase tracking-tight relative z-10">{item.title}</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed tracking-wide relative z-10">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-[#1c69d4] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight">SIAP MEMULAI PERJALANAN ANDA?</h3>
                    <p className="text-blue-100 font-light text-sm uppercase tracking-[0.15em]">Telusuri katalog terbaru kami sekarang juga.</p>
                </div>
                <button className="bg-white text-black px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                    BUKA KATALOG <ArrowRight className="inline-block ml-2 w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );

    const renderTerms = () => (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="prose prose-sm md:prose-base max-w-none space-y-10"
        >
            <div className="space-y-4 not-prose">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                    SYARAT & <span className="text-[#1c69d4]">KETENTUAN</span>
                </h2>
                <p className="text-gray-500 font-light max-w-2xl leading-relaxed">
                    Terakhir Diperbarui: 1 April 2026
                </p>
            </div>

            <div className="space-y-8 text-gray-700 font-light leading-relaxed">
                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> 1. Ketentuan Umum
                    </h3>
                    <p>
                        SRB Motor adalah platform resmi penjualan sepeda motor bekas premium. Dengan menggunakan layanan kami, Anda menyetujui seluruh ketentuan yang tertulis di halaman ini. Seluruh transaksi yang dilakukan melalui platform ini dilindungi oleh hukum perdagangan yang berlaku di Republik Indonesia.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> 2. Harga dan Pembayaran
                    </h3>
                    <p>
                        Harga yang tertera adalah harga OTR (On The Road) wilayah setempat kecuali disebutkan lain. Kami menerima pembayaran via Tunai (Cash) dan Kredit melalui mitra lembaga pembiayaan resmi (Leasing). Pembayaran dianggap sah apabila dilakukan melalui rekening resmi perusahaan atau kanal pembayaran daring yang disediakan di platform.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> 3. Pembatalan dan Pengembalian
                    </h3>
                    <p>
                        Pembatalan pesanan yang disebabkan oleh penolakan pengajuan kredit oleh pihak Leasing akan diikuti dengan pengembalian dana (refund) 100% tanpa potongan operasional. Namun, pembatalan sepihak oleh pelanggan setelah unit disiapkan akan dikenakan biaya administrasi sesuai kebijakan yang berlaku saat itu.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> 4. Jaminan Kualitas (Garansi)
                    </h3>
                    <p>
                        Setiap unit motor mendapatkan jaminan mesin selama 6 bulan atau 5.000 KM. Garansi tidak berlaku apabila terjadi kerusakan akibat kelalaian penggunaan, kecelakaan, atau modifikasi mesin oleh pihak ketiga tanpa persetujuan tertulis dari SRB Motor.
                    </p>
                </section>
            </div>
        </motion.div>
    );

    const renderPrivacy = () => (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="prose prose-sm md:prose-base max-w-none space-y-10"
        >
            <div className="space-y-4 not-prose">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                    KEBIJAKAN <span className="text-[#1c69d4]">PRIVASI</span>
                </h2>
                <p className="text-gray-500 font-light max-w-2xl leading-relaxed">
                    Kami berkomitmen untuk melindungi setiap data yang Anda percayakan kepada kami.
                </p>
            </div>

            <div className="space-y-8 text-gray-700 font-light leading-relaxed">
                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> Pengumpulan Data
                    </h3>
                    <p>
                        Kami mengumpulkan informasi identitas pelanggan seperti Nama, Nomor HP, Email, dan unggahan dokumen (KTP/KK) semata-mata untuk keperluan verifikasi transaksi dan pengajuan kredit. Kami juga menggunakan integrasi Google Auth untuk mempermudah anda masuk ke platform kami secara aman.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> Berbagi Data Pihak Ketiga
                    </h3>
                    <p>
                        Untuk keperluan pengajuan kredit, data Anda akan dibagikan kepada mitra lembaga pembiayaan (Leasing) pilihan Anda. Mitra kami terikat oleh kontrak kerahasiaan dan diatur oleh Otoritas Jasa Keuangan (OJK). Kami tidak akan pernah menjual atau membagikan data Anda ke pihak iklan pihak ketiga manapun.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#1c69d4]"></span> Hak Anda
                    </h3>
                    <p>
                        Anda memiliki hak penuh untuk meminta penghapusan data atau perbaikan informasi di database kami. Hubungi tim representatif kami melalui kanal bantuan resmi untuk melakukan permintaan terkait data privasi Anda.
                    </p>
                </section>
            </div>
        </motion.div>
    );

    return (
        <PublicLayout auth={auth} title="Informasi & Kebijakan - SRB Motor">
            <div className="bg-white min-h-screen pt-28 pb-32">
                {/* Header Section */}
                <div className="bg-black text-white py-12 border-b border-gray-800 mb-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c69d4] mb-4">
                            <span>INFO CENTER</span>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">LAYANAN & KEBIJAKAN</span>
                        </nav>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            CENTRAL <br />
                            <span className="text-[#1c69d4]">INFORMATION</span>
                        </h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-40 space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-6 py-5 font-black uppercase tracking-widest text-[11px] transition-all group border ${
                                            activeTab === tab.id 
                                            ? "bg-black text-white border-black" 
                                            : "bg-transparent text-gray-500 border-gray-100 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            {tab.icon}
                                            {tab.label}
                                        </span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "translate-x-1" : "opacity-0 group-hover:opacity-50"}`} />
                                    </button>
                                ))}
                                <div className="pt-8 mt-8 border-t border-gray-100 space-y-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BUTUH BANTUAN LAIN?</p>
                                    <button className="flex items-center gap-3 text-xs font-black uppercase text-black hover:text-[#1c69d4] transition-colors">
                                        <Search className="w-4 h-4" /> PUSAT BANTUAN (FAQ)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-9 border-l border-gray-100 lg:pl-16 min-h-[600px]">
                            <AnimatePresence mode="wait">
                                {activeTab === "guide" && renderGuide()}
                                {activeTab === "terms" && renderTerms()}
                                {activeTab === "privacy" && renderPrivacy()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
