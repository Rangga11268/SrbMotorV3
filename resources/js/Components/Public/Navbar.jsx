import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Button from "../UI/Button";
import Logo from "./Logo";
import AuthModal from "../Auth/AuthModal";
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
    Wrench,
    CreditCard as CreditCardIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import NotificationBell from "../Notification/NotificationBell";

export default function Navbar({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState(null);
    const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);

        // Handle login redirect from middleware
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("login_required")) {
            setAuthModalMessage(
                "Sesi Diperlukan: Silakan masuk untuk mengakses fitur perbaikan dan servis.",
            );
            setAuthModalVisible(true);
            // Clean up the URL (optional but cleaner)
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
            );
        }

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
            active: url.split("?")[0] === "/motors",
        },
        {
            label: "Servis",
            href: "/services",
            active: url.startsWith("/services"),
        },
        ...(auth?.user
            ? [
                  {
                      label: "Aktivitas Saya",
                      href: route("user.activity"),
                      active: url.startsWith("/account/activity"),
                  },
              ]
            : []),
        {
            label: "Tentang Kami",
            href: "/about",
            active: url.split("?")[0] === "/about",
        },
        {
            label: "Bantuan",
            href: "/bantuan",
            active: url.split("?")[0] === "/bantuan",
        },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            {/* Top Row: Logo, Search, Auth */}
            <div className="max-w-full mx-auto px-4 md:px-6 lg:px-12 py-4">
                <div className="flex items-center justify-between gap-4 md:gap-12">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex flex-row items-center gap-4 flex-shrink-0 group"
                    >
                        <Logo />
                    </Link>

                    {/* Authorized Dealer Badge (Hidden on mobile/tablet) */}
                    <div className="hidden xl:flex items-center gap-6">
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#262626]">
                                Authorized Dealer
                            </span>
                        </div>
                    </div>

                    {/* Desktop Search & Location (  Style - Sharp Block) */}
                    <div className="hidden md:flex flex-1 items-center max-w-3xl relative gap-0 border border-gray-300">
                        {/* Location Picker / Branches */}
                        <div className="relative flex-shrink-0 border-r border-gray-300 bg-gray-50 group/branch">
                            <button
                                onClick={() =>
                                    setBranchDropdownOpen(!branchDropdownOpen)
                                }
                                className="flex items-center gap-2 px-6 py-3 text-[10px] font-bold text-[#262626] hover:bg-[#f9f9f9] transition-colors uppercase tracking-[0.2em] rounded-none"
                            >
                                <MapPin className="w-4 h-4 text-[#1c69d4]" />
                                <span>BEKASI (PUSAT)</span>
                                <ChevronDown
                                    className={`w-3 h-3 text-[#262626] transition-transform duration-300 ${branchDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {branchDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[-1]"
                                            onClick={() =>
                                                setBranchDropdownOpen(false)
                                            }
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 0 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 0 }}
                                            className="absolute top-full left-[-1px] w-[300px] bg-white border border-gray-300 border-t-0 shadow-2xl z-50 rounded-none overflow-hidden"
                                        >
                                            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                                <p className="text-[9px] font-black text-[#757575] uppercase tracking-[0.3em] mb-1">
                                                    HIRARKI BISNIS
                                                </p>
                                                <p className="text-xs font-black text-[#262626] uppercase">
                                                    PUSAT & JARINGAN CABANG
                                                </p>
                                            </div>
                                            <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                                                {/* PUSAT & SALES NETWORK */}
                                                <div className="px-6 py-3 bg-[#f9f9f9]/50 border-b border-gray-100">
                                                    <p className="text-[8px] font-black text-[#1c69d4] uppercase tracking-[0.2em]">
                                                        PUSAT & JARINGAN SALES (DEALER)
                                                    </p>
                                                </div>
                                                <div className="py-1">
                                                    {[
                                                        {
                                                            name: "SSM MEKAR SARI",
                                                            loc: "BEKASI (PUSAT & BENGKEL)",
                                                            isSales: true,
                                                        },
                                                        {
                                                            name: "SRB MOTOR",
                                                            loc: "BEKASI UTARA (CABANG)",
                                                            url: "https://maps.app.goo.gl/kK1BtQhsT6cE1rs56",
                                                            isSales: true,
                                                        },
                                                        {
                                                            name: "SSM PONDOK UNGU",
                                                            loc: "BEKASI UTARA (CABANG)",
                                                            url: "https://maps.app.goo.gl/arrJgbYHcUs3pkY26",
                                                            isSales: true,
                                                        },
                                                        {
                                                            name: "SSM ALINDA",
                                                            loc: "BEKASI UTARA (CABANG)",
                                                            url: "https://maps.app.goo.gl/jRoPMJs3enBPLor2A",
                                                            isSales: true,
                                                        },
                                                    ].map((branch, i) => (
                                                        <a
                                                            key={i}
                                                            href={branch.url || "#"}
                                                            target={branch.url ? "_blank" : "_self"}
                                                            rel="noopener noreferrer"
                                                            className="block px-6 py-3 hover:bg-[#f9f9f9] group/item cursor-pointer transition-colors border-l-2 border-transparent hover:border-[#1c69d4]"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center text-[#262626] rounded-none">
                                                                        <Bike className="w-3 h-3" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-bold text-[#262626] uppercase tracking-wider group-hover/item:text-[#1c69d4]">
                                                                            {branch.name}
                                                                        </p>
                                                                        <p className="text-[8px] font-medium text-[#757575] uppercase tracking-widest mt-0.5">
                                                                            {branch.loc}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-3 h-3 text-gray-300 group-hover/item:text-[#1c69d4] group-hover/item:translate-x-1 transition-all" />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>

                                                {/* SSM SERVICE NETWORK */}
                                                <div className="px-6 py-3 bg-[#f9f9f9]/50 border-y border-gray-100">
                                                    <p className="text-[8px] font-black text-[#757575] uppercase tracking-[0.2em]">
                                                        JARINGAN SERVIS SSM (BENGKEL)
                                                    </p>
                                                </div>
                                                <div className="py-1">
                                                    {[
                                                        {
                                                            name: "SSM DEPOK",
                                                            loc: "DEPOK (BENGKEL)",
                                                        },
                                                        {
                                                            name: "SSM BOGOR",
                                                            loc: "BOGOR (BENGKEL)",
                                                        },
                                                        {
                                                            name: "SSM TANGERANG",
                                                            loc: "TANGERANG (BENGKEL)",
                                                        },
                                                    ].map((branch, i) => (
                                                        <div
                                                            key={i}
                                                            className="block px-6 py-3 hover:bg-[#A855F7]/10 group/item cursor-pointer transition-colors border-l-2 border-transparent hover:border-[#A855F7]"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center text-[#757575] rounded-none">
                                                                        <Wrench className="w-3 h-3" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-bold text-[#757575] uppercase tracking-wider group-hover/item:text-[#A855F7]">
                                                                            {branch.name}
                                                                        </p>
                                                                        <p className="text-[8px] font-medium text-[#757575] uppercase tracking-widest mt-0.5">
                                                                            {branch.loc}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-3 h-3 text-gray-300 group-hover/item:text-[#A855F7] group-hover/item:translate-x-1 transition-all" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                                <p className="text-[8px] text-[#757575] font-bold uppercase leading-relaxed tracking-widest">
                                                    * Seluruh unit SRB Motor
                                                    dapat dilayani di seluruh
                                                    jaringan SSM.
                                                </p>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 relative group bg-white">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-[#757575] group-focus-within:text-[#1c69d4] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowResults(true)}
                                placeholder="Pencarian Unit..."
                                className="w-full h-[46px] pl-14 pr-6 bg-transparent border-none text-sm font-light text-[#262626] placeholder:text-[#bbbbbb] focus:ring-0 outline-none uppercase tracking-widest"
                            />

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showResults &&
                                    (searchQuery || isSearching) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-full left-0 md:w-[480px] mt-0 bg-white border border-gray-300 border-t-0 shadow-lg z-50 rounded-none overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                                        >
                                            <div
                                                className="fixed inset-0 z-[-1]"
                                                onClick={() =>
                                                    setShowResults(false)
                                                }
                                            />
                                            {isSearching ? (
                                                <div className="p-8 text-center text-[#757575]">
                                                    <div className="w-6 h-6 border-2 border-[#1c69d4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">
                                                        Memuat...
                                                    </p>
                                                </div>
                                            ) : results.length > 0 ? (
                                                <div className="flex flex-col">
                                                    <div className="py-2">
                                                        {results.map(
                                                            (motor) => (
                                                                <Link
                                                                    key={
                                                                        motor.id
                                                                    }
                                                                    href={route(
                                                                        "motors.show",
                                                                        motor.id,
                                                                    )}
                                                                    onClick={() => {
                                                                        setShowResults(
                                                                            false,
                                                                        );
                                                                        setSearchQuery(
                                                                            "",
                                                                        );
                                                                    }}
                                                                    className="flex items-center gap-6 p-5 border-b border-gray-100 hover:bg-[#f9f9f9] transition-colors group"
                                                                >
                                                                    <div className="w-20 h-16 flex items-center justify-center shrink-0 bg-gray-50">
                                                                        <img
                                                                            src={`/storage/${motor.image_path}`}
                                                                            alt={
                                                                                motor.name
                                                                            }
                                                                            className={`h-full object-contain ${
                                                                                !motor.tersedia
                                                                                    ? "grayscale opacity-50"
                                                                                    : ""
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 pr-4">
                                                                        <div className="flex flex-col gap-1">
                                                                            <h4 className="text-[11px] font-bold text-[#262626] uppercase tracking-[0.15em] leading-tight group-hover:text-[#1c69d4] transition-colors">
                                                                                {
                                                                                    motor.name
                                                                                }
                                                                            </h4>
                                                                            {!motor.tersedia && (
                                                                                <span className="inline-block w-fit text-[8px] font-bold bg-[#111111] text-white px-2 py-0.5 uppercase tracking-widest rounded-none">
                                                                                    TERJUAL
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-[10px] font-bold text-[#1c69d4] mt-2 tracking-widest">
                                                                            IDR{" "}
                                                                            {parseInt(
                                                                                motor.price,
                                                                            ).toLocaleString(
                                                                                "id-ID",
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
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
                                                        className="block w-full text-center py-4 bg-[#f9f9f9] hover:bg-[#1c69d4] text-[10px] hover:text-white font-bold uppercase tracking-widest transition-colors"
                                                    >
                                                        Lihat Seluruh Hasil
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-[#757575]">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">
                                                        Tidak Ada Unit Yang
                                                        Sesuai
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Actions: Auth & CTA */}
                    <div className="flex items-center gap-4">
                        {auth?.user && (
                            <div className="hidden sm:block">
                                <NotificationBell />
                            </div>
                        )}
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-3 py-2 px-4 hover:bg-[#f9f9f9] transition-colors border border-transparent rounded-none"
                                >
                                    <div className="w-8 h-8 rounded-none bg-[#262626] flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden">
                                        {auth.user.profile_photo_path ? (
                                            <img
                                                src={
                                                    auth.user.profile_photo_path.startsWith(
                                                        "http",
                                                    )
                                                        ? auth.user
                                                              .profile_photo_path
                                                        : `/storage/${auth.user.profile_photo_path}`
                                                }
                                                alt={auth.user.name}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.parentElement.innerHTML =
                                                        auth.user.name.charAt(
                                                            0,
                                                        );
                                                }}
                                            />
                                        ) : (
                                            auth.user.name.charAt(0)
                                        )}
                                    </div>
                                    <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-bold text-[#262626]">
                                        AKUN SAYA
                                    </span>
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
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute right-0 mt-4 w-64 bg-white shadow-xl border border-gray-300 z-50 rounded-none"
                                            >
                                                <div className="px-6 py-4 border-b border-gray-200">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#757575] mb-1">
                                                        PENGGUNA
                                                    </p>
                                                    <p className="text-sm font-bold text-[#262626] uppercase">
                                                        {auth.user.name}
                                                    </p>
                                                </div>
                                                <div className="py-2">
                                                    <Link
                                                        href={route(
                                                            "profile.show",
                                                        )}
                                                        className="flex items-center gap-4 px-6 py-3 hover:bg-[#1c69d4] hover:text-white text-xs font-bold text-[#262626] uppercase tracking-widest transition-colors"
                                                    >
                                                        Profil Saya
                                                    </Link>
                                                    {auth.user.role ===
                                                        "admin" && (
                                                        <a
                                                            href={route(
                                                                "admin.dashboard",
                                                            )}
                                                            className="flex items-center gap-4 px-6 py-3 bg-[#111111] text-white hover:bg-white hover:text-[#111111] border border-[#111111] transition-colors text-xs font-bold uppercase tracking-widest"
                                                        >
                                                            Dashboard Admin
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={route(
                                                            "user.activity",
                                                        )}
                                                        className="flex items-center gap-4 px-6 py-3 hover:bg-[#1c69d4] hover:text-white text-xs font-bold text-[#262626] uppercase tracking-widest transition-colors"
                                                    >
                                                        Aktivitas Saya
                                                    </Link>
                                                </div>
                                                <div className="border-t border-gray-200" />
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center gap-4 px-6 py-4 hover:bg-white hover:text-red-600 border border-transparent hover:border-red-600 text-white bg-red-600 text-xs font-bold uppercase tracking-widest transition-colors text-left"
                                                >
                                                    Keluar Akun
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setAuthModalMessage(null);
                                    setAuthModalVisible(true);
                                }}
                                className="text-[10px] font-bold text-[#262626] uppercase tracking-[0.2em] hover:text-[#1c69d4] transition-colors py-2 px-4"
                            >
                                Masuk / Daftar
                            </button>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-[#262626] hover:bg-[#f9f9f9] rounded-none"
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Navigation Links */}
            <div className="hidden md:block bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <div className="flex items-center space-x-0">
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                href={cat.href}
                                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${cat.active ? "text-[#262626] border-[#1c69d4]" : "text-[#757575] border-transparent hover:text-[#1c69d4]"}`}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* The "Bantuan" link is now part of the categories for consistent active underline */}
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
                        className="md:hidden bg-[#111111] overflow-hidden"
                    >
                        <div className="p-6 space-y-2">
                            {/* Mobile Search */}
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Keywords..."
                                    className="w-full px-4 py-3 bg-[#262626] border border-gray-800 text-white text-xs font-bold uppercase tracking-widest focus:ring-0 focus:border-[#1c69d4] outline-none rounded-none"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>

                            {/* Mobile Search Results */}
                            <AnimatePresence>
                                {(searchQuery || isSearching) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="bg-[#262626] border border-gray-800 mb-8 max-h-[300px] overflow-y-auto"
                                    >
                                        {isSearching ? (
                                            <div className="p-6 text-center text-gray-400">
                                                <div className="w-5 h-5 border-2 border-[#1c69d4] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                                <p className="text-[9px] font-bold uppercase tracking-widest">
                                                    Memuat...
                                                </p>
                                            </div>
                                        ) : results.length > 0 ? (
                                            <div className="flex flex-col">
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
                                                        className="flex items-center gap-4 p-4 border-b border-gray-800 hover:bg-[#1c69d4] transition-colors group"
                                                    >
                                                        <div className="w-14 h-10 flex items-center justify-center shrink-0 bg-[#333333]">
                                                            <img
                                                                src={`/storage/${motor.image_path}`}
                                                                alt={motor.name}
                                                                className="h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 pr-2">
                                                            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest leading-tight truncate">
                                                                {motor.name}
                                                            </h4>
                                                            <p className="text-[9px] font-bold text-[#1c69d4] mt-1 group-hover:text-white transition-colors">
                                                                IDR{" "}
                                                                {parseInt(
                                                                    motor.price,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                                <Link
                                                    href={route(
                                                        "motors.index",
                                                        { search: searchQuery },
                                                    )}
                                                    onClick={() => {
                                                        setMobileMenuOpen(
                                                            false,
                                                        );
                                                        setSearchQuery("");
                                                    }}
                                                    className="block w-full text-center py-3 bg-[#111111] text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                                                >
                                                    Lihat Semua
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center text-gray-500">
                                                <p className="text-[9px] font-bold uppercase tracking-widest">
                                                    Tidak Ditemukan
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {categories.map((cat) => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-4 border-b border-gray-800 text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em] hover:text-white transition-colors"
                                >
                                    {cat.label}
                                </Link>
                            ))}

                            {!auth.user && (
                                <div className="grid grid-cols-2 gap-4 pt-8">
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setAuthModalMessage(null);
                                            setAuthModalVisible(true);
                                        }}
                                        className="py-4 border border-white text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-none"
                                    >
                                        LOGIN
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AuthModal
                visible={authModalVisible}
                message={authModalMessage}
                onClose={() => {
                    setAuthModalVisible(false);
                    setAuthModalMessage(null);
                }}
            />
        </nav>
    );
}
