import { Link, usePage } from "@inertiajs/react";
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
    MapPin,
    HelpCircle,
    Download,
    ChevronRight,
    Shield,
    ShieldCheck,
    CreditCard as CreditCardIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Navbar({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Live Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await axios.get(route("api.motors.search"), {
                    params: { q: searchQuery },
                });
                setResults(response.data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const categories = [
        {
            label: "Motor Baru",
            href: "/motors",
            active: url.startsWith("/motors"),
        },
        { label: "Tentang Kami", href: "/about", active: url === "/about" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
            {/* Top Row: Logo, Search, Auth */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Logo />
                    </Link>

                    {/* Desktop Search & Location (Momotor Style) */}
                    <div className="hidden md:flex flex-1 items-center gap-2 max-w-3xl relative">
                        {/* Location Picker */}
                        <div className="relative flex-shrink-0">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Bekasi Only</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowResults(true)}
                                placeholder="Cari Motor Impianmu disini..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showResults &&
                                    (searchQuery || isSearching) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                                        >
                                            <div
                                                className="fixed inset-0 z-[-1]"
                                                onClick={() =>
                                                    setShowResults(false)
                                                }
                                            />
                                            {isSearching ? (
                                                <div className="p-8 text-center text-gray-500">
                                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                    <p className="text-xs font-bold uppercase tracking-wider">
                                                        Mencari...
                                                    </p>
                                                </div>
                                            ) : results.length > 0 ? (
                                                <div className="py-2">
                                                    {results.map((motor) => (
                                                        <Link
                                                            key={motor.id}
                                                            href={route(
                                                                "motors.show",
                                                                motor.id,
                                                            )}
                                                            onClick={() =>
                                                                setShowResults(
                                                                    false,
                                                                )
                                                            }
                                                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        motor.image_path
                                                                            ? `/storage/${motor.image_path}`
                                                                            : "/images/placeholder-motor.jpg"
                                                                    }
                                                                    alt={
                                                                        motor.name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                                    {motor.name}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                                                                        {
                                                                            motor.brand
                                                                        }
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-gray-400">
                                                                        •
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-gray-500">
                                                                        Rp{" "}
                                                                        {parseFloat(
                                                                            motor.price,
                                                                        ).toLocaleString(
                                                                            "id-ID",
                                                                        )}
                                                                    </span>
                                                                    {motor.promotions &&
                                                                        motor
                                                                            .promotions
                                                                            .length >
                                                                            0 && (
                                                                            <span className="ml-auto bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                                                PROMO
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href={route(
                                                            "motors.index",
                                                            {
                                                                search: searchQuery,
                                                            },
                                                        )}
                                                        onClick={() =>
                                                            setShowResults(
                                                                false,
                                                            )
                                                        }
                                                        className="block w-full text-center py-3 bg-gray-50 hover:bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary transition-colors border-t border-gray-100"
                                                    >
                                                        Lihat semua hasil untuk
                                                        "{searchQuery}"
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    <p className="text-sm font-bold">
                                                        Motor tidak ditemukan
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Coba kata kunci lain
                                                        atau merek yang berbeda
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Actions: Auth & CTA */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {auth.user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 px-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:block text-sm font-bold text-gray-700">
                                        Account
                                    </span>
                                    <ChevronDown
                                        className={`w-3 h-3 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-[-1]"
                                                onClick={() =>
                                                    setUserMenuOpen(false)
                                                }
                                            />
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 10,
                                                    scale: 0.95,
                                                }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                            >
                                                <div className="px-4 py-2 mb-2 border-b border-gray-50">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                                        Selamat Datang
                                                    </p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {auth.user.name}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route("profile.show")}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-primary" />{" "}
                                                    Profil Saya
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "motors.user-transactions",
                                                    )}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors"
                                                >
                                                    <ShoppingBag className="w-4 h-4 text-primary" />{" "}
                                                    Riwayat Pesanan
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "installments.index",
                                                    )}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors"
                                                >
                                                    <CreditCardIcon className="w-4 h-4 text-primary" />{" "}
                                                    Cicilan Saya
                                                </Link>

                                                {auth.user.role === "admin" && (
                                                    <Link
                                                        href={route(
                                                            "admin.dashboard",
                                                        )}
                                                        className="flex items-center gap-3 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-sm font-bold text-primary transition-colors border-y border-primary/10"
                                                    >
                                                        <Shield className="w-4 h-4" />{" "}
                                                        Dashboard Admin
                                                    </Link>
                                                )}

                                                <div className="h-px bg-gray-100 my-2 mx-2" />
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm font-bold text-red-600 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />{" "}
                                                    Keluar
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link
                                    href={route("login")}
                                    className="text-sm font-bold text-gray-700 hover:text-primary transition-colors px-2"
                                >
                                    Masuk/Daftar
                                </Link>
                                <Link href="/#contact">
                                    <Button
                                        size="md"
                                        className="font-black px-6"
                                    >
                                        Hubungi Kami
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Navigation Links */}
            <div className="hidden md:block bg-gray-50/50 border-t border-gray-100 py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                href={cat.href}
                                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${cat.active ? "text-primary" : "text-gray-500 hover:text-primary"}`}
                            >
                                {cat.label === "Motor Baru" && (
                                    <Bike className="w-3 h-3" />
                                )}
                                {cat.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="/#contact"
                            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-widest"
                        >
                            <HelpCircle className="w-3 h-3" />
                            Bantuan
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            {/* Mobile Search */}
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari motor..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                                />
                                {isSearching && searchQuery.length >= 2 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Mobile Search Results */}
                            <AnimatePresence>
                                {searchQuery.length >= 2 &&
                                    results.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-4 bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100"
                                        >
                                            {results.map((motor) => (
                                                <Link
                                                    key={motor.id}
                                                    href={route(
                                                        "motors.show",
                                                        motor.id,
                                                    )}
                                                    onClick={() => {
                                                        setMobileMenuOpen(
                                                            false,
                                                        );
                                                        setSearchQuery("");
                                                    }}
                                                    className="flex items-center gap-3 p-3 active:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-gray-100">
                                                        <img
                                                            src={
                                                                motor.image_path
                                                                    ? `/storage/${motor.image_path}`
                                                                    : "/images/placeholder-motor.jpg"
                                                            }
                                                            alt={motor.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 truncate">
                                                            {motor.name}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                                            {motor.brand}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-gray-300" />
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                            </AnimatePresence>

                            {categories.map((cat) => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl font-black text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    <span>{cat.label}</span>
                                    <ChevronDown className="-rotate-90 w-4 h-4" />
                                </Link>
                            ))}

                            {!auth.user && (
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    <Link href={route("login")}>
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            className="font-bold"
                                        >
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={route("register")}>
                                        <Button fullWidth className="font-bold">
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
