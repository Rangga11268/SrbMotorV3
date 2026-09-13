import React from "react";
import { Link } from "@inertiajs/react";
import {
    Facebook,
    Instagram,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    Sparkles,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-24 pb-12 overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                    {/* Left Brand Area */}
                    <div className="md:col-span-5 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                                Dealer Terpercaya
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                            Temukan motor impianmu <br />
                            <span className="text-gray-500">
                                dimulai di sini.
                            </span>
                        </h2>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="#"
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300"
                            >
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-3 md:col-start-7">
                        <h4 className="font-body text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                            Menu
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/#home"
                                    className="text-lg font-display font-medium hover:text-accent transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/motors"
                                    className="text-lg font-display font-medium hover:text-accent transition-colors"
                                >
                                    Koleksi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-lg font-display font-medium hover:text-accent transition-colors"
                                >
                                    Tentang
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-body text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                            Kontak
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                    WhatsApp
                                </span>
                                <a
                                    href="tel:08978638849"
                                    className="text-lg font-display font-medium hover:text-accent transition-colors"
                                >
                                    089-7863-8849
                                </a>
                            </li>
                            <li className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                    Email
                                </span>
                                <a
                                    href="mailto:darrelrangga@gmail.com"
                                    className="text-lg font-display font-medium hover:text-accent transition-colors"
                                >
                                    hello@srbmotors.id
                                </a>
                            </li>
                            <li className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                    Lokasi
                                </span>
                                <span className="text-sm text-gray-300 leading-relaxed">
                                    Jl. Lori Sakti No. 22, Bekasi Utara,
                                    <br /> Indonesia
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Massive Footer Text */}
                <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="text-xs text-gray-500 font-mono">
                        &copy; {new Date().getFullYear()} SRB Motors Corp.{" "}
                        <br /> Didesain untuk para pemberani.
                    </div>
                    <h1 className="text-[12vw] leading-none font-display font-black tracking-tighter text-white opacity-20 select-none pointer-events-none mix-blend-overlay">
                        SRBMOTORS
                    </h1>
                </div>
            </div>
        </footer>
    );
}
