import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    ChevronRight,
    Search,
    Filter,
    X,
    TrendingUp,
    Heart,
    LayoutGrid,
    RotateCcw,
    SlidersHorizontal,
    Loader2,
    Calendar,
    Gauge,
} from "lucide-react";
import axios from "axios";

export default function Index({
    auth,
    motors: initialMotors,
    filters,
    brands: initialBrands,
    types: initialTypes,
    years: initialYears,
}) {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [motors, setMotors] = useState(initialMotors);
    const [brands, setBrands] = useState(initialBrands);
    const [types, setTypes] = useState(initialTypes);
    const [years, setYears] = useState(initialYears);

    const [values, setValues] = useState({
        search: filters.search || "",
        brand: filters.brand || "",
        type: filters.type || "",
        year: filters.year || "",
        min_price: filters.min_price || "",
        max_price: filters.max_price || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((values) => ({
            ...values,
            [name]: value,
        }));
    };

    const fetchMotors = useCallback(async (searchValues) => {
        setIsLoading(true);
        try {
            const query = Object.keys(searchValues).reduce((acc, key) => {
                if (searchValues[key]) acc[key] = searchValues[key];
                return acc;
            }, {});

            const response = await axios.get(route("motors.index"), {
                params: query,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
            });

            setMotors(response.data.motors);
            if (response.data.brands) setBrands(response.data.brands);
            if (response.data.types) setTypes(response.data.types);
            if (response.data.years) setYears(response.data.years);

            const queryString = new URLSearchParams(query).toString();
            window.history.pushState(
                {},
                "",
                `${window.location.pathname}${queryString ? "?" + queryString : ""}`,
            );
        } catch (error) {
            console.error("Error fetching motors:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMotors(values);
        }, 500);

        return () => clearTimeout(timer);
    }, [values, fetchMotors]);

    const resetFilters = () => {
        setValues({
            search: "",
            brand: "",
            type: "",
            year: "",
            min_price: "",
            max_price: "",
        });
    };

    return (
        <PublicLayout auth={auth} title="Katalog Motor - SRB Motor">
            <div className="flex-grow pt-28 bg-white">
                {/* HERO SECTION - BMW BLACK */}
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative">
                    <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">KATALOG KENDARAAN</span>
                        </nav>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    INVENTARIS <br />
                                    <span className="text-[#1c69d4]">
                                        KENDARAAN
                                    </span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-6 rounded-none">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                        {motors.total} UNIT
                                    </p>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-1">
                                        TERSEDIA HARI INI
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <main className="flex-grow py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-4 gap-12">
                            {/* SIDEBAR FILTERS (Desktop) */}
                            <aside className="hidden lg:block space-y-8">
                                <div className="bg-white p-8 rounded-none border border-gray-200 sticky top-28">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                                        <h3 className="font-black text-black uppercase tracking-tighter text-2xl">
                                            FILTER
                                        </h3>
                                        <button
                                            onClick={resetFilters}
                                            className="text-[10px] font-bold text-[#1c69d4] hover:text-black uppercase tracking-widest transition-colors"
                                        >
                                            RESET DATA
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Search */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                CARI MODEL
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    name="search"
                                                    value={values.search}
                                                    onChange={handleChange}
                                                    placeholder="NAMA UNIT..."
                                                    className="w-full bg-transparent border border-gray-300 rounded-none pl-4 pr-10 py-3 focus:border-[#1c69d4] focus:ring-0 outline-none transition-colors text-sm font-black text-black uppercase placeholder-gray-400"
                                                />
                                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#1c69d4] transition-colors" />
                                            </div>
                                        </div>

                                        {/* Brand */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                MEREK KENDARAAN
                                            </label>
                                            <select
                                                name="brand"
                                                value={values.brand}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border border-gray-300 rounded-none px-4 py-3 focus:border-[#1c69d4] focus:ring-0 outline-none transition-colors text-sm font-bold uppercase text-black"
                                            >
                                                <option value="">SEMUA MEREK</option>
                                                {brands.map((b) => (
                                                    <option key={b} value={b}>
                                                        {b}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Type */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                TIPE KENDARAAN
                                            </label>
                                            <select
                                                name="type"
                                                value={values.type}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border border-gray-300 rounded-none px-4 py-3 focus:border-[#1c69d4] focus:ring-0 outline-none transition-colors text-sm font-bold uppercase text-black"
                                            >
                                                <option value="">SEMUA TIPE</option>
                                                {types.map((t) => (
                                                    <option key={t} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                RENTANG HARGA (IDR)
                                            </label>
                                            <div className="grid grid-cols-2 gap-px border border-gray-300 bg-gray-300">
                                                <input
                                                    type="number"
                                                    name="min_price"
                                                    value={values.min_price}
                                                    onChange={handleChange}
                                                    placeholder="MINIMAL"
                                                    className="w-full bg-white border-none rounded-none px-4 py-3 focus:ring-inset focus:ring-2 focus:ring-[#1c69d4] outline-none transition-colors text-xs font-bold uppercase text-black"
                                                />
                                                <input
                                                    type="number"
                                                    name="max_price"
                                                    value={values.max_price}
                                                    onChange={handleChange}
                                                    placeholder="MAKSIMAL"
                                                    className="w-full bg-white border-none rounded-none px-4 py-3 focus:ring-inset focus:ring-2 focus:ring-[#1c69d4] outline-none transition-colors text-xs font-bold uppercase text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* MOBILE FILTER TRIGGER */}
                            <div className="lg:hidden flex gap-4 mb-6">
                                <button
                                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                    className="flex-grow flex items-center justify-between px-6 py-4 bg-black border border-black rounded-none text-white font-bold uppercase tracking-widest text-[11px]"
                                >
                                    <span className="flex items-center gap-2">
                                        <SlidersHorizontal size={16} /> BUKA FILTER
                                    </span>
                                    {Object.values(values).filter(Boolean).length > 0 && (
                                        <span className="bg-[#1c69d4] px-2 py-1 text-white">
                                            {Object.values(values).filter(Boolean).length} AKTIF
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* GRID PRODUCT */}
                            <div className="lg:col-span-3">
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-none p-12"
                                        >
                                            <Loader2 className="w-12 h-12 text-[#1c69d4] animate-spin mb-6" />
                                            <h3 className="text-xl font-black text-black uppercase tracking-tighter">
                                                MENGAKSES DATABASE
                                            </h3>
                                        </motion.div>
                                    ) : motors.data.length > 0 ? (
                                        <motion.div
                                            key="content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200"
                                        >
                                            {motors.data.map((motor, i) => (
                                                <motion.div
                                                    key={motor.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="bg-white group"
                                                >
                                                    <Link
                                                        href={route("motors.show", motor.id)}
                                                        className="block h-full flex flex-col"
                                                    >
                                                        {/* Image Container */}
                                                        <div className="relative aspect-[4/3] bg-white overflow-hidden p-6 border-b border-gray-100 flex items-center justify-center">
                                                            <img
                                                                src={motor.image_path ? `/storage/${motor.image_path}` : "/assets/img/no-image.png"}
                                                                alt={motor.name}
                                                                className={`max-h-full object-contain transition-transform duration-500 group-hover:scale-105 ${!motor.tersedia ? "grayscale opacity-50" : ""}`}
                                                            />
                                                            
                                                            {/* Brand Tag */}
                                                            <div className="absolute top-4 left-4 bg-gray-100 px-3 py-1 border border-gray-200">
                                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{motor.brand}</span>
                                                            </div>

                                                            {/* Status Tag */}
                                                            {!motor.tersedia && (
                                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                                                                    <span className="border-2 border-white text-white px-4 py-1 font-black text-xl uppercase tracking-widest">
                                                                        TERJUAL
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Card Body */}
                                                        <div className="p-6 flex flex-col flex-grow">
                                                            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                                                                <span>{motor.year}</span>
                                                                <span className="w-1 h-1 bg-gray-300"></span>
                                                                <span className="truncate">{motor.type}</span>
                                                            </div>
                                                            <h3 className="text-xl font-black text-black uppercase tracking-tight leading-tight mb-6 group-hover:text-[#1c69d4] transition-colors line-clamp-2">
                                                                {motor.name}
                                                            </h3>
                                                            
                                                            <div className="mt-auto flex items-end justify-between pt-6 border-t border-gray-100">
                                                                <div>
                                                                    <p className="text-lg font-light text-black">
                                                                        Rp {parseFloat(motor.price).toLocaleString("id-ID")}
                                                                    </p>
                                                                </div>
                                                                <div className="w-10 h-10 bg-black flex items-center justify-center text-white group-hover:bg-[#1c69d4] transition-colors rounded-none">
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-none p-12"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
                                                <Search size={32} />
                                            </div>
                                            <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">
                                                TIDAK ADA HASIL
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-8">
                                                Modifikasi parameter pencarian Anda untuk melihat ketersediaan unit lainnya.
                                            </p>
                                            <button
                                                className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-[11px] rounded-none hover:bg-gray-800 transition-colors"
                                                onClick={resetFilters}
                                            >
                                                RESET FILTER
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* PAGINATION */}
                                {!isLoading && motors.links && motors.links.length > 3 && (
                                    <div className="flex justify-center gap-1 pt-12">
                                        {motors.links.map((link, k) => (
                                            <button
                                                key={k}
                                                disabled={!link.url}
                                                onClick={() => {
                                                    if (link.url) {
                                                        const urlParams = new URLSearchParams(new URL(link.url).search);
                                                        const pageParams = Object.fromEntries(urlParams.entries());
                                                        fetchMotors({ ...values, ...pageParams });
                                                    }
                                                }}
                                                className={`min-w-[48px] h-12 flex items-center justify-center font-bold text-[11px] transition-colors uppercase border ${
                                                    link.active
                                                        ? "bg-black text-white border-black"
                                                        : link.url
                                                          ? "bg-white text-black border-gray-200 hover:border-black"
                                                          : "opacity-30 cursor-not-allowed border-transparent text-gray-500 bg-gray-100"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label.replace("Previous", "&laquo;").replace("Next", "&raquo;"),
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* MOBILE FILTER OVERLAY */}
                <AnimatePresence>
                    {isFiltersOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] lg:hidden"
                        >
                            <div className="absolute inset-0 bg-black/80" onClick={() => setIsFiltersOpen(false)} />
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", duration: 0.3 }}
                                className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-8 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                                    <h3 className="text-2xl font-black text-black uppercase tracking-tighter">
                                        FILTER
                                    </h3>
                                    <button
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="text-gray-400 hover:text-black transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-8 flex-grow overflow-y-auto">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CARI</label>
                                        <input
                                            type="text"
                                            name="search"
                                            value={values.search}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-[11px]"
                                            placeholder="NAMA UNIT..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">MEREK</label>
                                        <select
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-[11px]"
                                        >
                                            <option value="">SEMUA</option>
                                            {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TIPE</label>
                                        <select
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-[11px]"
                                        >
                                            <option value="">SEMUA</option>
                                            {types.map((t) => (<option key={t} value={t}>{t}</option>))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-px bg-gray-300 border border-gray-300 mt-auto">
                                    <button
                                        onClick={resetFilters}
                                        className="py-4 bg-white text-black font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50"
                                    >
                                        RESET
                                    </button>
                                    <button
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="py-4 bg-black text-white font-bold text-[11px] uppercase tracking-widest hover:bg-gray-900"
                                    >
                                        TERAPKAN
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PublicLayout>
    );
}
