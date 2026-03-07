import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-100 border-t border-gray-800">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-blue-400">
                            SRB Motors
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Platform dealer motor terpercaya dengan sistem
                            kredit terjangkau dan proses transparan.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 3a9 9 0 01-9 9m0-9a9 9 0 00-9 9m9-9v9m9-9h-9m9 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-2 9-2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Produk
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href="/motors"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Katalog Motor
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Kredit Motor
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Tukar Tambah
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Asuransi
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Perusahaan
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Karir
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Hubungi Kami
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Disclaimer
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>&copy; 2026 SRB Motors. All rights reserved.</p>
                        <p className="mt-4 md:mt-0">
                            Made with <span className="text-red-500">♥</span>{" "}
                            for Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
