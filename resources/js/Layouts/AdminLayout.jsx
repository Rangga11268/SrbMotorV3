import React, { useState, useEffect } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "../../css/admin.css";
import {
    CSidebar,
    CSidebarNav,
    CSidebarHeader,
    CSidebarFooter,
    CNavItem,
    CNavTitle,
    CHeader,
    CHeaderToggler,
    CHeaderNav,
    CContainer,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownDivider,
    CAvatar,
    CBadge,
    CFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilSpeedometer,
    cilBike,
    cilCart,
    cilPeople,
    cilChartLine,
    cilEnvelopeClosed,
    cilAccountLogout,
    cilUser,
    cilSettings,
    cilMenu,
    cilGlobeAlt,
    cilCheckCircle,
    cilXCircle,
    cilX,
    cilBell,
    cilStar,
    cilBuilding,
    cilCalculator,
    cilTag,
    cilNewspaper,
    cilImage,
    cilCreditCard,
    cilStorage,
    cilHistory,
} from "@coreui/icons";
import { AnimatePresence, motion } from "framer-motion";

function AdminLayoutContent({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarShow, setSidebarShow] = useState(() => {
        // Load sidebar state from localStorage, default to true (open)
        const saved = localStorage.getItem("adminSidebarShow");
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("adminSidebarShow", JSON.stringify(sidebarShow));
    }, [sidebarShow]);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navItems = [
        {
            name: "Dashboard",
            href: route("admin.dashboard"),
            icon: cilSpeedometer,
            active: route().current("admin.dashboard"),
        },
        {
            name: "Motor",
            href: route("admin.motors.index"),
            icon: cilBike,
            active: route().current("admin.motors.*"),
        },

        {
            name: "Pengajuan Kredit",
            href: route("admin.credits.index"),
            icon: cilCreditCard,
            active: route().current("admin.credits.*"),
        },
        {
            name: "Transaksi Tunai",
            href: route("admin.transactions.index"),
            icon: cilCart,
            active: route().current("admin.transactions.*"),
        },
        {
            name: "Pengguna",
            href: route("admin.users.index"),
            icon: cilPeople,
            active: route().current("admin.users.*"),
        },
        {
            name: "Laporan",
            href: route("admin.reports.index"),
            icon: cilChartLine,
            active: route().current("admin.reports.*"),
        },

        {
            name: "Provider Leasing",
            href: route("admin.leasing-providers.index"),
            icon: cilBuilding,
            active: route().current("admin.leasing-providers.*"),
        },

    ];

    const contentMenuItems = [
        {
            name: "Berita",
            href: route("admin.news.index"),
            icon: cilNewspaper,
            active: route().current("admin.news.*"),
        },
        {
            name: "Kategori Berita",
            href: route("admin.categories.index"),
            icon: cilTag,
            active: route().current("admin.categories.*"),
        },

    ];

    useEffect(() => {
        document.documentElement.classList.add("admin-mode");
        return () => document.documentElement.classList.remove("admin-mode");
    }, []);

    return (
        <div className="admin-theme-wrapper">
            <div className="min-vh-100 d-flex bg-light">
                <Head title={title || "Admin"} />

                {/* Flash Toast */}
                <AnimatePresence>
                    {showFlash && (flash.success || flash.error) && (
                        <motion.div
                            initial={{ opacity: 0, x: 60, y: 0 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: 60 }}
                            className="position-fixed top-0 end-0 m-4 d-flex align-items-start gap-3 shadow-lg rounded-3 border"
                            style={{
                                zIndex: 9999,
                                maxWidth: 380,
                                padding: "14px 18px",
                                backgroundColor: flash.success
                                    ? "#f0fdf4"
                                    : "#fef2f2",
                                borderColor: flash.success
                                    ? "#bbf7d0"
                                    : "#fecaca",
                            }}
                        >
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                style={{
                                    width: 32,
                                    height: 32,
                                    backgroundColor: flash.success
                                        ? "#dcfce7"
                                        : "#fee2e2",
                                }}
                            >
                                <CIcon
                                    icon={
                                        flash.success
                                            ? cilCheckCircle
                                            : cilXCircle
                                    }
                                    style={{
                                        color: flash.success
                                            ? "#16a34a"
                                            : "#dc2626",
                                    }}
                                />
                            </div>
                            <div className="flex-grow-1">
                                <div
                                    className="fw-semibold small"
                                    style={{
                                        color: flash.success
                                            ? "#166534"
                                            : "#991b1b",
                                    }}
                                >
                                    {flash.success ? "Berhasil!" : "Gagal!"}
                                </div>
                                <div
                                    className="small"
                                    style={{
                                        color: flash.success
                                            ? "#15803d"
                                            : "#b91c1c",
                                    }}
                                >
                                    {flash.success || flash.error}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFlash(false)}
                                className="btn btn-sm p-0 border-0 lh-1"
                                style={{ color: "#94a3b8" }}
                            >
                                <CIcon icon={cilX} size="sm" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ======== SIDEBAR ======== */}
                <CSidebar
                    className="sidebar-admin"
                    colorScheme="dark"
                    visible={sidebarShow}
                    onVisibleChange={(visible) => setSidebarShow(visible)}
                >
                    <CSidebarHeader className="border-bottom px-3">
                        <a
                            href="/"
                            className="d-flex align-items-center gap-3 text-decoration-none"
                        >
                            <img
                                src="/assets/icon/logo trans.png"
                                alt="Logo"
                                style={{
                                    width: 32,
                                    height: 32,
                                    objectFit: "contain",
                                }}
                            />
                            <div className="d-flex flex-column">
                                <span className="sidebar-brand-text">
                                    SRB Motors
                                </span>
                                <span className="sidebar-brand-sub">
                                    Admin Panel
                                </span>
                            </div>
                        </a>
                    </CSidebarHeader>

                    <CSidebarNav>
                        <CNavTitle>Menu Utama</CNavTitle>
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`nav-link ${item.active ? "active" : ""}`}
                                >
                                    <CIcon
                                        icon={item.icon}
                                        customClassName="nav-icon"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        <CNavTitle className="mt-3">Manajemen Konten</CNavTitle>
                        {contentMenuItems.map((item) => (
                            <li className="nav-item" key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`nav-link ${item.active ? "active" : ""}`}
                                >
                                    <CIcon
                                        icon={item.icon}
                                        customClassName="nav-icon"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        <CNavTitle className="mt-3">Pengaturan</CNavTitle>
                        <li className="nav-item">
                            <Link
                                href={route("admin.settings.index")}
                                className={`nav-link ${route().current("admin.settings.*") ? "active" : ""}`}
                            >
                                <CIcon
                                    icon={cilSettings}
                                    customClassName="nav-icon"
                                />
                                Pengaturan Website
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                href={route("admin.profile.show")}
                                className={`nav-link ${route().current("admin.profile.*") ? "active" : ""}`}
                            >
                                <CIcon
                                    icon={cilUser}
                                    customClassName="nav-icon"
                                />
                                Profil Saya
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/" className="nav-link">
                                <CIcon
                                    icon={cilGlobeAlt}
                                    customClassName="nav-icon"
                                />
                                Lihat Website
                            </a>
                        </li>
                    </CSidebarNav>

                    <CSidebarFooter className="border-top p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
                                style={{
                                    width: 38,
                                    height: 38,
                                    background:
                                        "linear-gradient(135deg, #4361ee, #6366f1)",
                                    fontSize: 14,
                                }}
                            >
                                {auth.user.name.charAt(0)}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <div
                                    className="fw-semibold text-truncate text-white"
                                    style={{ fontSize: 13 }}
                                >
                                    {auth.user.name}
                                </div>
                                <div style={{ fontSize: 11, color: "#64748b" }}>
                                    Administrator
                                </div>
                            </div>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="btn btn-sm p-1 border-0"
                                style={{ color: "#64748b" }}
                                title="Keluar"
                            >
                                <CIcon icon={cilAccountLogout} size="lg" />
                            </Link>
                        </div>
                    </CSidebarFooter>
                </CSidebar>

                {/* ======== MAIN CONTENT ======== */}
                <div className="wrapper d-flex flex-column flex-grow-1">
                    {/* Header */}
                    <CHeader className="header-admin border-bottom px-4">
                        <CHeaderToggler
                            className="header-toggler"
                            onClick={() => setSidebarShow(!sidebarShow)}
                        >
                            <CIcon icon={cilMenu} size="lg" />
                        </CHeaderToggler>

                        <div className="ms-3 d-flex align-items-center">
                            <h1 className="header-title mb-0">{title}</h1>
                        </div>

                        <CHeaderNav className="ms-auto d-flex align-items-center gap-2">
                            {/* User Menu */}
                            <CDropdown variant="nav-item" alignment="end">
                                <CDropdownToggle
                                    caret={false}
                                    className="d-flex align-items-center gap-2 py-0"
                                >
                                    <div className="d-none d-md-block text-end me-2">
                                        <div
                                            className="fw-semibold small"
                                            style={{ color: "#0f172a" }}
                                        >
                                            {auth.user.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "#94a3b8",
                                            }}
                                        >
                                            Admin
                                        </div>
                                    </div>
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                                        style={{
                                            width: 36,
                                            height: 36,
                                            background:
                                                "linear-gradient(135deg, #4361ee, #6366f1)",
                                            fontSize: 14,
                                        }}
                                    >
                                        {auth.user.name.charAt(0)}
                                    </div>
                                </CDropdownToggle>
                                <CDropdownMenu
                                    className="shadow-lg border"
                                    style={{ borderRadius: 12, minWidth: 200 }}
                                >
                                    <div className="px-3 py-2">
                                        <div className="fw-bold small">
                                            {auth.user.name}
                                        </div>
                                        <div
                                            className="text-body-tertiary"
                                            style={{ fontSize: 11 }}
                                        >
                                            {auth.user.email}
                                        </div>
                                    </div>
                                    <CDropdownDivider />
                                    <CDropdownItem
                                        as={Link}
                                        href={route("admin.profile.show")}
                                    >
                                        <CIcon
                                            icon={cilUser}
                                            className="me-2"
                                        />
                                        Profil Saya
                                    </CDropdownItem>
                                    <CDropdownItem as={Link} href="/">
                                        <CIcon
                                            icon={cilGlobeAlt}
                                            className="me-2"
                                        />
                                        Lihat Website
                                    </CDropdownItem>
                                    <CDropdownDivider />
                                    <CDropdownItem
                                        as={Link}
                                        href={route("logout")}
                                        method="post"
                                        className="text-danger"
                                    >
                                        <CIcon
                                            icon={cilAccountLogout}
                                            className="me-2"
                                        />
                                        Keluar
                                    </CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CHeaderNav>
                    </CHeader>

                    {/* Page Content */}
                    <div className="body flex-grow-1 admin-body">
                        <CContainer fluid className="px-4 py-4">
                            {children}
                        </CContainer>
                    </div>

                    {/* Footer */}
                    <CFooter className="footer-admin px-4">
                        <div>
                            <span
                                className="fw-semibold"
                                style={{ color: "#475569" }}
                            >
                                SRB Motors
                            </span>
                            <span className="ms-1" style={{ color: "#94a3b8" }}>
                                &copy; {new Date().getFullYear()}
                            </span>
                        </div>
                        <div className="ms-auto">
                            <span style={{ color: "#cbd5e1", fontSize: 12 }}>
                                Admin Panel v2.0
                            </span>
                        </div>
                    </CFooter>
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout(props) {
    return <AdminLayoutContent {...props} />;
}
