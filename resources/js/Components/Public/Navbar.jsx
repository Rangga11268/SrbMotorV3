import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Button from "../UI/Button";
import Logo from "./Logo";
import {
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    User,
    Bike,
    Phone,
    Search,
    ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Dynamic scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        {
            href: "/motors",
            label: "Daftar Motor",
            icon: <Bike className="w-4 h-4" />,
        },
        {
            href: "/contact",
            label: "Hubungi Kami",
            icon: <Phone className="w-4 h-4" />,
        },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-gray-200 py-2 shadow-sm"
                    : "bg-white border-b border-transparent py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
                            >
                                <div className="flex items-center gap-2 font-semibold text-sm">
                                    {link.label}
                                </div>
                                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth / User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-gray-50 border border-gray-200 hover:border-blue-300 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[120px]">
                                            {auth.user.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-medium">
                                            Customer
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 z-[-1]"
                                                onClick={() =>
                                                    setUserMenuOpen(false)
                                                }
                                            />
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                    y: 10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                    y: 10,
                                                }}
                                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-gray-100 py-2.5 overflow-hidden"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        Akun Saya
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route("profile.show")}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href={route("profile.edit")}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profil
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "motors.user-transactions",
                                                    )}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Pesanan Saya
                                                </Link>
                                                <div className="h-px bg-gray-100 my-2 mx-2" />
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Keluar
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={route("login")}>
                                    <Button
                                        variant="ghost"
                                        size="md"
                                        className="font-bold text-gray-700 hover:bg-gray-50"
                                    >
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href={route("register")}>
                                    <Button
                                        size="md"
                                        className="shadow-lg shadow-blue-200"
                                    >
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-900 border border-gray-100 bg-gray-50 p-2 rounded-xl"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-4 p-4 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        {link.icon}
                                    </div>
                                    {link.label}
                                </Link>
                            ))}

                            <hr className="my-4 border-gray-100" />

                            {auth.user ? (
                                <div className="space-y-2 pb-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route("profile.show")}
                                        className="block w-full"
                                    >
                                        <Button fullWidth size="lg">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="block w-full"
                                    >
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            size="lg"
                                        >
                                            Keluar
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pb-4">
                                    <Link href={route("login")}>
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            size="lg"
                                        >
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={route("register")}>
                                        <Button fullWidth size="lg">
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
