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
            { label: "Panduan Pemesanan", href: route("guide") },
            { label: "Syarat & Ketentuan", href: route("terms") },
            { label: "Kebijakan Privasi", href: route("privacy") },
        ],
    };

    return (
        <footer className="bg-[#111111] text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    {/* Brand + Contact */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/"
                                    className="inline-block transition-transform hover:opacity-80"
                                >
                                    <Logo className="h-8" dark={true} />
                                </Link>
                                <div className="h-6 w-px bg-gray-700"></div>
                                <img
                                    src="/assets/img/logoSSM.webp"
                                    alt="SSM Logo"
                                    className="h-6 w-auto object-contain brightness-0 invert"
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c69d4] leading-none">
                                    Official Authorized Dealer
                                </p>
                                <p className="text-xs font-bold text-[#bbbbbb] uppercase tracking-widest">
                                    Sinar Surya Motor (SSM)
                                </p>
                            </div>
                        </div>
                        <p className="text-sm font-light text-[#bbbbbb] leading-relaxed max-w-xs">
                            {settings.site_description ||
                                "Dealer motor terpercaya dengan proses kredit mudah, transparan, dan bergaransi resmi."}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-4 h-4 text-[#1c69d4] mt-0.5 shrink-0" />
                                <span className="text-sm font-light text-[#bbbbbb]">
                                    {settings.contact_address ||
                                        "Jl. Raya Utama No. 123, Jakarta Timur"}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-4 h-4 text-[#1c69d4] shrink-0" />
                                <a
                                    href={`https://wa.me/${settings.contact_phone?.replace(/\D/g, "") || "628978638849"}`}
                                    className="text-sm font-light text-[#bbbbbb] hover:text-white transition-colors"
                                >
                                    {settings.contact_phone ||
                                        "+62 812 3456 7890"}
                                </a>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-4 h-4 text-[#1c69d4] shrink-0" />
                                <a
                                    href={`mailto:${settings.contact_email || "halo@srbmotor.id"}`}
                                    className="text-sm font-light text-[#bbbbbb] hover:text-white transition-colors"
                                >
                                    {settings.contact_email ||
                                        "halo@srbmotor.id"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <h4 className="text-[#757575] text-[10px] font-bold uppercase tracking-[0.2em]">
                                Produk & Layanan
                            </h4>
                            <ul className="space-y-4">
                                {links.produk.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-xs font-bold uppercase tracking-widest text-[#bbbbbb] hover:text-white flex items-center gap-2 transition-colors group"
                                        >
                                            <ChevronRight className="w-3 h-3 text-[#1c69d4]" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[#757575] text-[10px] font-bold uppercase tracking-[0.2em]">
                                Bantuan Khusus
                            </h4>
                            <ul className="space-y-4">
                                {links.bantuan.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-xs font-bold uppercase tracking-widest text-[#bbbbbb] hover:text-white flex items-center gap-2 transition-colors group"
                                        >
                                            <ChevronRight className="w-3 h-3 text-[#1c69d4]" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Leasing Partners */}
                    <div className="md:col-span-4 space-y-8">
                        <h4 className="text-[#757575] text-[10px] font-bold uppercase tracking-[0.2em]">
                            Mitra Pembiayaan
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: "ADIRA", logo: "/assets/img/adira.webp" },
                                { name: "FIF", logo: "/assets/img/fif.webp" },
                                { name: "OTO", logo: "/assets/img/oto.webp" },
                                { name: "MUF", logo: "/assets/img/muf.webp" },
                                { name: "BAF", logo: "/assets/img/baf.webp" },
                            ].map((provider, i) => (
                                <div
                                    key={i}
                                    title={provider.name}
                                    className="bg-white border border-gray-800 p-4 flex items-center justify-center h-20 transition-colors rounded-none hover:bg-[#f9f9f9]"
                                >
                                    <img
                                        src={provider.logo}
                                        alt={provider.name}
                                        className="max-h-8 max-w-full object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                                "block";
                                        }}
                                    />
                                    <span
                                        className="text-[10px] font-bold text-[#262626] uppercase tracking-widest"
                                        style={{ display: "none" }}
                                    >
                                        {provider.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#757575] leading-relaxed">
                            Proses difasilitasi oleh lembaga pembiayaan resmi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800 py-6 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] text-[#757575] font-bold uppercase tracking-[0.2em]">
                            &copy; {currentYear} SRB MOTOR
                        </p>
                        <div className="h-3 w-px bg-gray-800"></div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#757575] uppercase tracking-widest">
                                A Part of
                            </span>
                            <img
                                src="/assets/img/logoSSM.webp"
                                alt="SSM"
                                className="h-3 w-auto brightness-0 invert opacity-50"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-[#757575] uppercase tracking-widest flex items-center gap-2 border border-gray-800 px-3 py-1">
                            <ShieldCheck className="w-3 h-3 text-[#1c69d4]" />
                            Terverifikasi
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
                                    className="w-10 h-10 border border-gray-800 text-[#757575] bg-transparent flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors rounded-none"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
