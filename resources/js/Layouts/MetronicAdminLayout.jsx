import React, { useState, useEffect } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import {
    LayoutDashboard,
    Bike,
    CreditCard,
    ShoppingCart,
    Users,
    BarChart3,
    Wrench,
    Settings,
    UserCircle,
    Globe,
    LogOut,
    CheckCircle2,
    XCircle,
    X,
    Menu,
    ChevronLeft,
    MapPin,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationBell from "../Components/Notification/NotificationBell";

export default function MetronicAdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;

    const [sidebarShow, setSidebarShow] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("metronicSidebarShow");
            if (saved !== null) {
                try {
                    const parsed = JSON.parse(saved);
                    if (window.innerWidth < 1024) return false;
                    return parsed;
                } catch (e) {
                    return true;
                }
            }
            return window.innerWidth >= 1024;
        }
        return true;
    });

    const [showFlash, setShowFlash] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarShow(false);
            } else {
                setSidebarShow(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("metronicSidebarShow", JSON.stringify(sidebarShow));
        }
    }, [sidebarShow]);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const isOwner = auth.user.role === 'owner';
    const roleLabel = isOwner ? 'Pemilik (Owner)' : 'Administrator';
    const roleBadgeColor = isOwner ? 'from-amber-500 to-orange-600' : 'from-[#3699FF] to-[#0070e3]';

    const navItems = [
        { name: "Dashboard", href: route("admin.dashboard"), icon: LayoutDashboard, active: route().current("admin.dashboard") },
        { name: "Motor", href: route("admin.motors.index"), icon: Bike, active: route().current("admin.motors.*") },
        { name: "Pengajuan Kredit", href: route("admin.credits.index"), icon: CreditCard, active: route().current("admin.credits.*") },
        { name: "Transaksi Tunai", href: route("admin.transactions.index"), icon: ShoppingCart, active: route().current("admin.transactions.*") },
        ...(isOwner ? [
            { name: "Pengguna", href: route("admin.users.index"), icon: Users, active: route().current("admin.users.*") },
            { name: "Laporan", href: route("admin.reports.index"), icon: BarChart3, active: route().current("admin.reports.*") },
        ] : []),
        { name: "Manajemen Servis", href: "/admin/services", icon: Wrench, active: route().current("admin.services.*") },
        { name: "Manajemen Cabang", href: route("admin.branches.index"), icon: MapPin, active: route().current("admin.branches.*") },
    ];

    const settingItems = [
        { name: "Pengaturan Website", href: route("admin.settings.index"), icon: Settings, active: route().current("admin.settings.*") },
        { name: "Profil Saya", href: route("admin.profile.show"), icon: UserCircle, active: route().current("admin.profile.*") },
        { name: "Lihat Website", href: "/", icon: Globe, active: false },
    ];

    return (
        <div className="flex h-screen w-full max-w-[100vw] bg-[#F3F6F9] font-sans antialiased overflow-hidden">
            <Head title={title || "Admin Panel"} />

            {/* Flash Toast */}
            <AnimatePresence>
                {showFlash && (flash.success || flash.error) && (
                    <motion.div
                        initial={{ opacity: 0, x: 60, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        className={`fixed top-4 right-4 z-[9999] max-w-sm w-full shadow-lg rounded-lg border p-4 flex items-start gap-3 ${flash.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                    >
                        <div className={`flex items-center justify-center rounded-full shrink-0 w-8 h-8 ${flash.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {flash.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </div>
                        <div className="flex-1">
                            <div className={`text-sm font-semibold ${flash.success ? 'text-green-800' : 'text-red-800'}`}>
                                {flash.success ? "Berhasil!" : "Gagal!"}
                            </div>
                            <div className={`text-sm ${flash.success ? 'text-green-700' : 'text-red-700'}`}>
                                {flash.success || flash.error}
                            </div>
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Overlay mobile */}
            <AnimatePresence>
                {sidebarShow && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarShow(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ====== SIDEBAR (METRONIC STYLE) ====== */}
            <aside
                className={`fixed lg:static top-0 left-0 z-50 h-full w-[265px] bg-[#1E1E2D] flex flex-col transition-all duration-300 ease-in-out ${sidebarShow ? "translate-x-0" : "-translate-x-full lg:hidden lg:w-0 lg:opacity-0"}`}
            >
                {/* Brand */}
                <div className="h-[70px] flex items-center justify-between px-6 bg-[#1A1A27]">
                    <a href="/" className="flex items-center gap-3 decoration-transparent">
                        <img src="/assets/icon/logo-trans.webp" alt="Logo" className="w-8 h-8 object-contain" />
                        <div>
                            <div className="text-white font-bold text-sm tracking-wide">SRB MOTOR</div>
                            <div className="text-[#A2A3B7] text-[10px] tracking-widest uppercase">Admin Panel</div>
                        </div>
                    </a>
                    {/* Close switch for mobile */}
                    <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarShow(false)}>
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto py-5 custom-scrollbar">
                    <div className="px-6 mb-2">
                        <span className="text-[#6D6D80] text-[10px] font-bold uppercase tracking-widest uppercase block">Menu Utama</span>
                    </div>
                    <nav className="flex flex-col gap-1 px-4 mb-6">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${item.active ? "bg-[#1B1B29] text-white" : "text-[#A2A3B7] hover:text-white hover:bg-[#1B1B29]"}`}
                            >
                                <item.icon size={18} className={item.active ? "text-[#3699FF]" : "text-[#6D6D80]"} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="px-6 mb-2">
                        <span className="text-[#6D6D80] text-[10px] font-bold uppercase tracking-widest uppercase block">Pengaturan</span>
                    </div>
                    <nav className="flex flex-col gap-1 px-4">
                        {settingItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${item.active ? "bg-[#1B1B29] text-white" : "text-[#A2A3B7] hover:text-white hover:bg-[#1B1B29]"}`}
                            >
                                <item.icon size={18} className={item.active ? "text-[#3699FF]" : "text-[#6D6D80]"} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer User Info */}
                <div className="p-4 bg-[#1A1A27]">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${roleBadgeColor} flex items-center justify-center text-white font-bold overflow-hidden`}>
                            {auth.user.profile_photo_path ? (
                                <img src={`/storage/${auth.user.profile_photo_path}`} alt="User" className="w-full h-full object-cover" />
                            ) : auth.user.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-white text-sm font-semibold truncate">{auth.user.name}</div>
                            <div className={`text-xs font-medium ${isOwner ? 'text-amber-400' : 'text-[#A2A3B7]'}`}>{roleLabel}</div>
                        </div>
                        <Link href={route("logout")} method="post" as="button" className="text-[#6D6D80] hover:text-white p-2">
                            <LogOut size={18} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ====== MAIN WRAPPER ====== */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F3F6F9] overflow-hidden">
                {/* Header Metronic Style */}
                <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarShow(!sidebarShow)} className="p-2 -ml-2 text-gray-500 hover:text-[#3699FF] hover:bg-blue-50 rounded-lg transition-colors">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800 hidden sm:block truncate">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Component */}
                        <NotificationBell />

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-semibold text-gray-800">{auth.user.name}</div>
                                    <div className={`text-xs font-medium ${isOwner ? 'text-amber-500' : 'text-gray-500'}`}>{roleLabel}</div>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                                    {auth.user.profile_photo_path ? (
                                        <img src={`/storage/${auth.user.profile_photo_path}`} alt="User" className="w-full h-full object-cover" />
                                    ) : auth.user.name.charAt(0)}
                                </div>
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                        >
                                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                                <div className="font-semibold text-gray-800">{auth.user.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{auth.user.email}</div>
                                            </div>
                                            <div className="py-2">
                                                <Link href={route('admin.profile.show')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                                    <UserCircle size={16} className="text-gray-400" /> Profil Saya
                                                </Link>
                                                <Link href="/" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                                    <Globe size={16} className="text-gray-400" /> Lihat Website
                                                </Link>
                                            </div>
                                            <div className="py-2 border-t border-gray-100">
                                                <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm text-red-600 transition-colors">
                                                    <LogOut size={16} className="text-red-400" /> Keluar
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                    {children}
                </main>

                {/* Footer Metronic */}
                <footer className="h-14 bg-white border-t border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 text-sm">
                    <div className="text-gray-500">
                        <span className="font-semibold text-gray-700">SRB Motor</span> &copy; {new Date().getFullYear()}
                    </div>
                    <div className="text-gray-400 text-xs flex gap-4">
                        <a href="/" className="hover:text-blue-500 transition-colors">About</a>
                        <a href="/" className="hover:text-blue-500 transition-colors">Support</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
