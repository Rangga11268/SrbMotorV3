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
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";

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

            // Use Axios to fetch data
            const response = await axios.get(route("motors.index"), {
                params: query,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
            });

            // Update local state with new motors and options
            setMotors(response.data.motors);
            if (response.data.brands) setBrands(response.data.brands);
            if (response.data.types) setTypes(response.data.types);
            if (response.data.years) setYears(response.data.years);

            // Optional: Update URL without reloading to keep Inertia state clean
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
        <PublicLayout auth={auth} title="Katalog Motor">
            <div className="flex-grow pt-24 md:pt-32 bg-slate-50 dark:bg-slate-900">
                {/* HEADER SECTION */}
                <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-16 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70 transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                    <Link href="/" className="hover:text-blue-700 transition">
                                        Home
                                    </Link>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Katalog Motor
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                    Jelajahi{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                                        Koleksi Kami
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
                                    Temukan berbagai pilihan motor berkualitas
                                    dengan harga terbaik dan kondisi terjamin untuk
                                    menemani perjalanan Anda.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white relative z-10">
                                        {motors.total} Unit Tersedia
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">
                                        Diperbarui hari ini
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700 relative z-10">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <main className="flex-grow py-12 lg:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* SIDEBAR FILTERS (Desktop) */}
                        <aside className="hidden lg:block space-y-8">
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider text-sm">
                                        <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Filter
                                        Pencarian
                                    </h3>
                                    <button
                                        onClick={resetFilters}
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Reset
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Search */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                            Cari Model
                                        </label>
                                        <div className="relative group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="text"
                                                name="search"
                                                value={values.search}
                                                onChange={handleChange}
                                                placeholder="Nama motor..."
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-400/10 focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Brand */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                            Merek
                                        </label>
                                        <select
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-400/10 focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white appearance-none"
                                        >
                                            <option value="">
                                                Semua Merek
                                            </option>
                                            {brands.map((b) => (
                                                <option key={b} value={b}>
                                                    {b}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Type */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                            Tipe
                                        </label>
                                        <select
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-400/10 focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white appearance-none"
                                        >
                                            <option value="">Semua Tipe</option>
                                            {types.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                            Rentang Harga
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="number"
                                                name="min_price"
                                                value={values.min_price}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-400/10 focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                            />
                                            <input
                                                type="number"
                                                name="max_price"
                                                value={values.max_price}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-400/10 focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
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
                                className="flex-grow flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs shadow-sm hover:shadow-md transition-shadow"
                            >
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal size={18} className="text-blue-600 dark:text-blue-400" /> Filter Unit
                                </span>
                                {Object.values(values).filter(Boolean).length >
                                    0 && (
                                    <Badge variant="blue" size="sm" className="bg-blue-600 dark:bg-blue-500 text-white border-transparent">
                                        {
                                            Object.values(values).filter(
                                                Boolean,
                                            ).length
                                        }
                                    </Badge>
                                )}
                            </button>
                        </div>

                        {/* GRID PRODUCT */}
                        <div className="lg:col-span-3 space-y-10">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-12 shadow-sm"
                                    >
                                        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Memuat Data...
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Mencari motor terbaik untuk Anda
                                        </p>
                                    </motion.div>
                                ) : motors.data.length > 0 ? (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                    >
                                        {motors.data.map((motor, i) => (
                                            <motion.div
                                                key={motor.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: i * 0.05,
                                                }}
                                            >
                                                <Link
                                                    href={route(
                                                        "motors.show",
                                                        motor.id,
                                                    )}
                                                >
                                                    <Card
                                                        hoverable
                                                        className="h-full overflow-hidden group border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 bg-white dark:bg-slate-800"
                                                    >
                                                        {/* Image Container */}
                                                        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                            <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-500 z-10" />
                                                            <img
                                                                src={
                                                                    motor.image_path
                                                                        ? `/storage/${motor.image_path}`
                                                                        : "/images/placeholder-motor.jpg"
                                                                }
                                                                alt={motor.name}
                                                                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                                                                    !motor.tersedia
                                                                        ? "grayscale brightness-75"
                                                                        : ""
                                                                }`}
                                                            />

                                                            {/* Status Overlay */}
                                                            {!motor.tersedia && (
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                                                    <span className="px-6 py-2 bg-red-600/90 backdrop-blur-sm text-white font-black text-xl uppercase tracking-widest -rotate-12 border-2 border-white/50 shadow-2xl">
                                                                        TERJUAL
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Badges */}
                                                            <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-20">
                                                                <Badge
                                                                    variant="blue"
                                                                    size="sm"
                                                                    className="shadow-sm backdrop-blur-md bg-white/90 dark:bg-slate-900/90 text-blue-700 dark:text-blue-400 font-bold border border-white/20 dark:border-slate-700/50"
                                                                >
                                                                    {
                                                                        motor.brand
                                                                    }
                                                                </Badge>
                                                                <Badge
                                                                    variant={
                                                                        motor.tersedia
                                                                            ? "blue"
                                                                            : "default"
                                                                    }
                                                                    size="sm"
                                                                    className={`shadow-sm backdrop-blur-md font-bold border border-white/20 dark:border-slate-700/50 ${
                                                                        motor.tersedia
                                                                            ? "bg-blue-600/90 text-white"
                                                                            : "bg-slate-800/90 text-white"
                                                                    }`}
                                                                >
                                                                    {motor.tersedia
                                                                        ? "Tersedia"
                                                                        : "Stok Habis"}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Card Body */}
                                                        <CardBody className="p-6 lg:p-7 space-y-5">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Calendar className="w-3.5 h-3.5" />{" "}
                                                                        {
                                                                            motor.year
                                                                        }
                                                                    </span>
                                                                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                                                                    <span className="flex items-center gap-1.5 line-clamp-1">
                                                                        <Gauge className="w-3.5 h-3.5" />{" "}
                                                                        {
                                                                            motor.type
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight tracking-tight">
                                                                    {motor.name}
                                                                </h3>
                                                            </div>

                                                            <div className="pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
                                                                        Mulai
                                                                        Harga
                                                                    </p>
                                                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                                                                        Rp{" "}
                                                                        {parseFloat(
                                                                            motor.price,
                                                                        ).toLocaleString(
                                                                            "id-ID",
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 group-hover:shadow-md group-hover:shadow-blue-500/20">
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
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
                                        className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-12 shadow-sm"
                                    >
                                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                                            <Search size={48} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                                            Motor Tidak Ditemukan
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                                            Maaf, kami tidak menemukan motor
                                            yang sesuai dengan kriteria
                                            pencarian Anda. Coba ubah filter
                                            atau kata kunci lainnya.
                                        </p>
                                        <button
                                            className="px-6 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 font-bold rounded-xl transition-colors"
                                            onClick={resetFilters}
                                        >
                                            Hapus Semua Filter
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* PAGINATION */}
                            {!isLoading &&
                                motors.links &&
                                motors.links.length > 3 && (
                                    <div className="flex justify-center gap-2 pt-10">
                                        {motors.links.map((link, k) => (
                                            <button
                                                key={k}
                                                disabled={!link.url}
                                                onClick={() => {
                                                    if (link.url) {
                                                        const urlParams =
                                                            new URLSearchParams(
                                                                new URL(
                                                                    link.url,
                                                                ).search,
                                                            );
                                                        const pageParams =
                                                            Object.fromEntries(
                                                                urlParams.entries(),
                                                            );
                                                        fetchMotors({
                                                            ...values,
                                                            ...pageParams,
                                                        });
                                                    }
                                                }}
                                                className={`min-w-[48px] h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all border ${
                                                    link.active
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                                                        : link.url
                                                          ? "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                                                          : "opacity-40 cursor-not-allowed border-transparent text-slate-400 dark:text-slate-500"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label
                                                        .replace(
                                                            "Previous",
                                                            "&laquo;",
                                                        )
                                                        .replace(
                                                            "Next",
                                                            "&raquo;",
                                                        ),
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </main>

            {/* MOBILE FILTER OVERLAY (Drawer effect) */}
            <AnimatePresence>
                {isFiltersOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] lg:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsFiltersOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 p-8 shadow-2xl border-l border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Filter Pencarian
                                </h3>
                                <button
                                    onClick={() => setIsFiltersOpen(false)}
                                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Cari Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="search"
                                        value={values.search}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm"
                                        placeholder="Cari..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Merek
                                    </label>
                                    <select
                                        name="brand"
                                        value={values.brand}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm"
                                    >
                                        <option value="">Semua Merek</option>
                                        {brands.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Tipe
                                    </label>
                                    <select
                                        name="type"
                                        value={values.type}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm"
                                    >
                                        <option value="">Semua Tipe</option>
                                        {types.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 text-sm"
                                    >
                                        Terapkan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </PublicLayout>
    );
}
