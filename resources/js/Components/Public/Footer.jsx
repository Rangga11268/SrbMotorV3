import { Link, usePage } from "@inertiajs/react";
import Logo from "./Logo";
import {
    Facebook,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";

export default function Footer() {
    const {
        props: { leasingProviders = [], settings = {} },
    } = usePage();
    const currentYear = new Date().getFullYear();

    const links = {
        produk: [
            { label: "Katalog Motor", href: "/motors" },
            { label: "Simulasi Kredit", href: "#" },
            { label: "Pesanan Saya", href: route("motors.user-transactions") },
        ],
        bantuan: [
            { label: "Panduan Pemesanan", href: "#" },
            { label: "Syarat & Ketentuan", href: "#" },
            { label: "Kebijakan Privasi", href: "#" },
        ],
    };

    return (
        <footer className="bg-gradient-to-b from-[#0d1b2e] to-[#060d18] text-gray-400 border-t border-blue-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-py-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Brand + Contact */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
                                    <Logo className="h-9" dark={true} />
                                </Link>
                                <div className="h-6 w-px bg-white/20"></div>
                                <img 
                                    src="/assets/img/logoSSM.webp" 
                                    alt="SSM Logo" 
                                    className="h-6 w-auto object-contain brightness-125"
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 opacity-80 leading-none">
                                    Official Authorized Dealer
                                </p>
                                <p className="text-sm font-bold text-gray-400">
                                    Bagian dari Sinar Surya Motor (SSM)
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            {settings.site_description ||
                                "Dealer motor terpercaya dengan proses kredit mudah, transparan, dan cepat."}
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-500">
                                    {settings.contact_address ||
                                        "Jl. Raya Utama No. 123, Jakarta Timur"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                                <a
                                    href={`https://wa.me/${settings.contact_phone?.replace(/\D/g, "") || "628978638849"}`}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {settings.contact_phone ||
                                        "+62 812 3456 7890"}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                                <a
                                    href={`mailto:${settings.contact_email || "halo@srbmotor.id"}`}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {settings.contact_email ||
                                        "halo@srbmotor.id"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] opacity-50">
                                Produk
                            </h4>
                            <ul className="space-y-3">
                                {links.produk.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors group"
                                        >
                                            <ChevronRight className="w-3 h-3 text-blue-800 group-hover:text-blue-400 transition-colors" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] opacity-50">
                                Bantuan
                            </h4>
                            <ul className="space-y-3">
                                {links.bantuan.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors group"
                                        >
                                            <ChevronRight className="w-3 h-3 text-blue-800 group-hover:text-blue-400 transition-colors" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Leasing Partners */}
                    <div className="md:col-span-4 space-y-6">
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] opacity-50">
                            Mitra Leasing
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "BAF", logo: "/assets/img/baf.png" },
                                { name: "ADIRA", logo: "/assets/img/adira.png" },
                            ].map((provider, i) => (
                                <div
                                    key={i}
                                    title={provider.name}
                                    className="bg-white rounded-xl p-3 flex items-center justify-center h-16 overflow-hidden shadow-lg shadow-black/20 hover:scale-105 transition-transform"
                                >
                                    <img
                                        src={provider.logo}
                                        alt={provider.name}
                                        className="max-h-12 max-w-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "block";
                                        }}
                                    />
                                    <span 
                                        className="text-[10px] font-black text-gray-800 uppercase tracking-widest"
                                        style={{ display: "none" }}
                                    >
                                        {provider.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
                            Kami bekerja sama dengan mitra leasing terpercaya untuk memudahkan kepemilikan motor Anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-blue-900/20 py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] text-gray-600 font-medium tracking-wide">
                            &copy; {currentYear} SRB Motor
                        </p>
                        <div className="h-3 w-px bg-gray-800"></div>
                        <div className="flex items-center gap-2 group cursor-help">
                            <span className="text-[10px] text-gray-600">Powered by</span>
                            <img 
                                src="/assets/img/logoSSM.webp" 
                                alt="SSM" 
                                className="h-3.5 w-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                            <span className="text-[10px] font-black text-gray-500 tracking-tighter opacity-50 group-hover:opacity-100 transition-all duration-500">SSM</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-blue-500" />{" "}
                            OJK Verified
                        </span>
                        <div className="flex items-center gap-2">
                            {[
                                { Icon: Instagram, key: "social_instagram" },
                                { Icon: Facebook, key: "social_facebook" },
                                { Icon: Youtube, key: "social_youtube" },
                            ].map(({ Icon, key }, i) => (
                                <a
                                    key={i}
                                    href={settings[key] || "#"}
                                    target={settings[key] ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-500 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
