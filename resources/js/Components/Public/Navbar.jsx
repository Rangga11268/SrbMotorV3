import { Link } from "@inertiajs/react";
import { useState } from "react";
import Button from "../UI/Button";

export default function Navbar({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/motors", label: "Daftar Motor" },
        { href: "/contact", label: "Hubungi Kami" },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex-shrink-0 font-bold text-xl text-blue-600"
                    >
                        SRB Motors
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-150 font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <span className="text-sm text-gray-700">
                                    {auth.user.name}
                                </span>
                                <Link href={route("dashboard")}>
                                    <Button size="md">Dashboard</Button>
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    <Button variant="secondary" size="md">
                                        Keluar
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route("login")}>
                                    <Button variant="ghost" size="md">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href={route("register")}>
                                    <Button size="md">Daftar</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none p-2"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-gray-700 hover:text-blue-600 font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route("dashboard")}
                                        className="block w-full"
                                    >
                                        <Button fullWidth size="md">
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
                                            size="md"
                                        >
                                            Keluar
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="block w-full"
                                    >
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            size="md"
                                        >
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="block w-full"
                                    >
                                        <Button fullWidth size="md">
                                            Daftar
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
