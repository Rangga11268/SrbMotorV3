import { Link } from "@inertiajs/react";
import Logo from "./Logo";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Bike,
    ShieldCheck,
    CreditCard,
    ChevronRight,
} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        produk: [
            { label: "Katalog Motor", href: "/motors", icon: Bike },
            { label: "Promo Spesial", href: "#", icon: null },
            { label: "Simulasi Kredit", href: "#", icon: CreditCard },
            {
                label: "Lacak Pesanan",
                href: route("motors.user-transactions"),
                icon: ShieldCheck,
            },
        ],
        perusahaan: [
            { label: "Tentang SRB Motors", href: "/about" },
            { label: "Hubungi Kami", href: "/#contact" },
            { label: "Syarat & Ketentuan", href: "#" },
            { label: "Kebijakan Privasi", href: "#" },
        ],
        bantuan: [
            { label: "Pusat Bantuan (FAQ)", href: "#" },
            { label: "Panduan Pemesanan", href: "#" },
            { label: "Persyaratan Kredit", href: "#" },
            { label: "Lokasi Dealer", href: "#" },
        ],
    };

    return (
        <footer className="relative bg-[#050B14] text-gray-300 overflow-hidden pt-20 border-t border-gray-800">
            {/* Background Aesthetic Glows */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
            <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-8">
                        <Link href="/" className="inline-block">
                            <Logo className="h-10 text-white brightness-110 drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]" />
                        </Link>
                        <p className="text-gray-400 text-[15px] leading-relaxed max-w-sm">
                            Menghadirkan pengalaman premium membeli motor impian
                            Anda. Transparan, aman, dan tanpa proses
                            berbelit-belit.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-5 pt-2">
                            <div className="flex items-start gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 shadow-lg">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-gray-200 font-bold text-sm tracking-wide">
                                        Showroom Pusat
                                    </h5>
                                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                        Jl. Raya Utama No. 123, <br />
                                        Jakarta Timur, Indonesia
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-blue-400 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500 transition-all duration-300 shadow-lg">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-gray-200 font-bold text-sm tracking-wide">
                                        Layanan Pelanggan (24/7)
                                    </h5>
                                    <p className="text-sm text-gray-400 mt-1 font-medium tracking-wider">
                                        +62 812 3456 7890
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Grid */}
                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                        {/* Box 1 */}
                        <div className="space-y-6">
                            <h4 className="text-white font-extrabold tracking-widest text-xs uppercase opacity-90 relative inline-block">
                                Jelajahi
                                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.produk.map((link, i) => {
                                    const Icon = link.icon;
                                    return (
                                        <li key={i}>
                                            <Link
                                                href={link.href}
                                                className="text-[14px] text-gray-400 font-medium hover:text-white hover:translate-x-1.5 flex items-center gap-2 transition-all duration-300 group"
                                            >
                                                {Icon ? (
                                                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                                ) : (
                                                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                                )}
                                                {link.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Box 2 */}
                        <div className="space-y-6">
                            <h4 className="text-white font-extrabold tracking-widest text-xs uppercase opacity-90 relative inline-block">
                                Perusahaan
                                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.perusahaan.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            className="text-[14px] text-gray-400 font-medium hover:text-white hover:translate-x-1.5 flex items-center gap-2 transition-all duration-300 group"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Box 3 */}
                        <div className="space-y-6 col-span-2 md:col-span-1">
                            <h4 className="text-white font-extrabold tracking-widest text-xs uppercase opacity-90 relative inline-block">
                                Bantuan
                                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.bantuan.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            className="text-[14px] text-gray-400 font-medium hover:text-white hover:translate-x-1.5 flex items-center gap-2 transition-all duration-300 group"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter & Socials Glassmorphism Box */}
                <div className="mt-20 p-8 rounded-3xl bg-gray-800/20 border border-gray-700/30 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full"></div>

                    <div className="space-y-2 relative z-10 text-center lg:text-left">
                        <h4 className="text-white font-bold text-lg">
                            Dapatkan Penawaran Eksklusif
                        </h4>
                        <p className="text-sm text-gray-400">
                            Jadilah yang pertama tahu promo motor terbaru.
                        </p>
                    </div>

                    <div className="flex-grow max-w-md w-full relative z-10">
                        <div className="flex items-center bg-gray-900/50 border border-gray-700/50 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all">
                            <div className="pl-4 text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="Masukkan alamat email..."
                                className="w-full bg-transparent border-none text-white focus:ring-0 text-sm px-4 placeholder:text-gray-500"
                            />
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-blue-600/25 flex-shrink-0">
                                Berlangganan
                            </button>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-3 relative z-10">
                        {[Instagram, Facebook, Youtube].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 shadow-md"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#03060C] py-6 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500 font-medium">
                            &copy; {currentYear} SRB Motors. Hak Cipta
                            Dilindungi.
                        </p>
                        <div className="flex items-center gap-3 sm:gap-6 opacity-60">
                            {[
                                "Kredit Mudah",
                                "OJK Verified",
                                "Aman Dipercaya",
                            ].map((text, i) => (
                                <span
                                    key={i}
                                    className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 flex items-center gap-1.5"
                                >
                                    <ShieldCheck className="w-3 h-3 text-gray-500" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
