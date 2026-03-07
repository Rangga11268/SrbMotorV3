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
} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        produk: [
            {
                label: "Katalog Motor",
                href: "/motors",
                icon: <Bike className="w-4 h-4" />,
            },
            { label: "Promo Terbaru", href: "#", icon: null },
            {
                label: "Simulasi Kredit",
                href: "#",
                icon: <CreditCard className="w-4 h-4" />,
            },
            {
                label: "Cek Status Dokumen",
                href: route("motors.user-transactions"),
                icon: <ShieldCheck className="w-4 h-4" />,
            },
        ],
        perusahaan: [
            { label: "Tentang Kami", href: "/about" },
            { label: "Hubungi Kami", href: "/contact" },
            { label: "Syarat & Ketentuan", href: "#" },
            { label: "Kebijakan Privasi", href: "#" },
        ],
        bantuan: [
            { label: "FAQ", href: "#" },
            { label: "Cara Pemesanan", href: "#" },
            { label: "Panduan Kredit", href: "#" },
            { label: "Lokasi Dealer", href: "#" },
        ],
    };

    return (
        <footer className="bg-[#0B0F19] text-gray-300">
            {/* Top Footer: Brand & Quick Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-8">
                        <Link href="/">
                            <Logo className="h-10 text-white" />
                        </Link>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            Solusi terbaik untuk memiliki motor impian secara
                            tunai maupun kredit. Proses{" "}
                            <span className="text-white font-bold underline decoration-blue-600">
                                cepat
                            </span>
                            , syarat{" "}
                            <span className="text-white font-bold underline decoration-blue-600">
                                mudah
                            </span>
                            , dan pelayanan{" "}
                            <span className="text-white font-bold underline decoration-blue-600">
                                terjamin
                            </span>
                            .
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">
                                        Lokasi Kami
                                    </h5>
                                    <p className="text-sm text-gray-400 mt-1 italic">
                                        Jl. Raya Utama No. 123, Jakarta Timur
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">
                                        Layanan Konsumen
                                    </h5>
                                    <p className="text-sm text-gray-400 mt-1">
                                        +62 812 3456 7890
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columns Grid */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Produk */}
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">
                                Produk
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.produk.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-medium hover:text-blue-500 hover:translate-x-1 flex items-center gap-2 transition-all"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Perusahaan */}
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">
                                Informasi
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.perusahaan.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-medium hover:text-blue-500 hover:translate-x-1 flex items-center gap-2 transition-all"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Bantuan */}
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">
                                Dukungan
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.bantuan.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-medium hover:text-blue-500 hover:translate-x-1 flex items-center gap-2 transition-all"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter / Social */}
                <div className="mt-20 pt-10 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        {[Instagram, Facebook, Twitter, Youtube].map(
                            (Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all"
                                >
                                    <Icon size={20} />
                                </a>
                            ),
                        )}
                    </div>

                    <div className="bg-gray-800/50 p-1.5 rounded-2xl flex items-center min-w-full sm:min-w-[400px]">
                        <input
                            type="email"
                            placeholder="Email address..."
                            className="bg-transparent border-none focus:ring-0 text-sm px-4 flex-grow placeholder:text-gray-500"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40">
                            Join News
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-black/40 py-8 border-t border-gray-800/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-500 font-medium">
                            &copy; {currentYear} SRB Motors. All rights
                            reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            {[
                                "Partner Resmi",
                                "OJK Terawasi",
                                "Pembayaran Aman",
                            ].map((text, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 italic"
                                >
                                    # {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
