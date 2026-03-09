import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    List,
    UserCircle,
    ShoppingBag,
    Sparkles,
    CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { auth } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/#home", label: "Beranda" },
        { href: "/about", label: "Tentang" },
        { href: "/motors", label: "Koleksi" },
    ];

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isScrolled ? "py-4" : "py-8"
            }`}
        >
            <div
                className={`transition-all duration-700 backdrop-blur-3xl border shadow-2xl relative group ${
                    isScrolled
                        ? "w-[90%] md:w-[850px] h-16 rounded-full border-white/10"
                        : "w-[95%] md:w-[1200px] h-20 rounded-2xl border-white/5"
                }`}
            >
                {/* Clipped Background Layer */}
                <div
                    className={`absolute inset-0 overflow-hidden rounded-[inherit] ${
                        isScrolled ? "bg-black/80" : "bg-black/40"
                    }`}
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none noise-bg mix-blend-overlay"></div>
                </div>

                {/* Content Container (Allows Overflow) */}
                <div className="w-full h-full grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center px-6 relative z-10">
                    {/* Logo - Left Align */}
                    <Link
                        href="/"
                        className="relative z-10 flex items-center gap-2 group/logo justify-self-start"
                    >
                        <div
                            className={`flex items-center justify-center transition-all duration-500 ${
                                isScrolled ? "scale-90" : "scale-100"
                            }`}
                        >
                            <Sparkles
                                size={isScrolled ? 18 : 22}
                                className="text-accent animate-pulse"
                            />
                        </div>
                        <span
                            className={`font-display font-extrabold tracking-tight text-white transition-all duration-500 ${
                                isScrolled ? "text-lg" : "text-2xl"
                            }`}
                        >
                            SRB
                        </span>
                    </Link>

                    {/* Desktop Nav - Center Align */}
                    <nav className="hidden md:flex items-center justify-center gap-8 justify-self-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-medium transition-colors hover:text-accent font-body tracking-wide ${
                                    isScrolled ? "text-gray-400" : "text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions - Right Align */}
                    <div className="relative z-10 flex items-center justify-end gap-3 justify-self-end">
                        {auth.user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="flex items-center gap-2 pr-2 pl-2 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-black font-bold text-xs">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span
                                        className={`text-xs font-bold text-white max-w-[80px] truncate ${
                                            isScrolled
                                                ? "hidden lg:block"
                                                : "block"
                                        }`}
                                    >
                                        {auth.user.name.split(" ")[0]}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: 15,
                                                scale: 0.9,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 15,
                                                scale: 0.9,
                                            }}
                                            className="absolute right-0 top-full mt-4 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-neon overflow-hidden p-1.5"
                                        >
                                            <div className="px-3 py-2 border-b border-white/5 mb-2">
                                                <p className="text-[10px] font-bold text-accent uppercase tracking-wider">
                                                    Akun
                                                </p>
                                                <p className="text-xs font-medium text-white truncate">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                            {[
                                                {
                                                    href: route("profile.show"),
                                                    label: "Profil",
                                                    icon: UserCircle,
                                                },
                                                {
                                                    href: route(
                                                        "motors.user-transactions",
                                                    ),
                                                    label: "Pesanan",
                                                    icon: List,
                                                },
                                                {
                                                    href: route(
                                                        "installments.index",
                                                    ),
                                                    label: "Cicilan",
                                                    icon: CreditCard,
                                                },
                                            ].map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={item.href}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-xs font-medium"
                                                >
                                                    <item.icon size={14} />{" "}
                                                    {item.label}
                                                </Link>
                                            ))}

                                            {auth.user.role === "admin" && (
                                                <Link
                                                    href={route(
                                                        "admin.dashboard",
                                                    )}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 text-accent transition-colors text-xs font-medium mt-1"
                                                >
                                                    <LayoutDashboard
                                                        size={14}
                                                    />{" "}
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <div className="h-px bg-white/5 my-1.5" />
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors text-xs font-bold"
                                            >
                                                <LogOut size={14} /> Keluar
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("login")}
                                    className={`text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors ${
                                        isScrolled
                                            ? "text-gray-400"
                                            : "text-white"
                                    }`}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-4 py-1.5 bg-white text-black rounded-full text-xs font-bold hover:bg-accent transition-colors"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="md:hidden p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X size={18} />
                            ) : (
                                <Menu size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Fullscreen Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
                    >
                        <nav className="flex flex-col gap-6 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-4xl font-display font-black text-white hover:text-accent transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!auth.user && (
                                <div className="flex flex-col gap-4 mt-8">
                                    <Link
                                        href={route("login")}
                                        className="text-xl font-body text-gray-400 hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="px-8 py-3 bg-accent text-black rounded-full font-bold"
                                    >
                                        Mulai Sekarang
                                    </Link>
                                </div>
                            )}
                        </nav>

                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute bottom-10 p-4 rounded-full bg-white/10 text-white hover:bg-red-500/20 hover:text-red-500 transition-colors"
                        >
                            <X size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
