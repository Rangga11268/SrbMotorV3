import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    Search,
    Filter,
    X,
    TrendingUp,
    Zap,
    Heart,
    LayoutGrid,
    RotateCcw,
    SlidersHorizontal,
    Loader2,
    Calendar,
    Clock,
} from "lucide-react";
import axios from "axios";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";

export default function Index({
    auth,
    motors: initialMotors,
    filters,
    brands,
    types,
    years,
}) {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [motors, setMotors] = useState(initialMotors);
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

            // Update local state with new motors data
            setMotors(response.data.motors);

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
            {/* HEADER SECTION */}
            <section className="bg-white border-b border-gray-200 pt-28 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                <Link href="/" className="hover:underline">
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-500">
                                    Katalog Motor
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                                Jelajahi{" "}
                                <span className="text-blue-600">
                                    Koleksi Kami
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Temukan berbagai pilihan motor berkualitas
                                dengan harga terbaik dan kondisi terjamin untuk
                                menemani perjalanan Anda.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {motors.total} Unit Tersedia
                                </p>
                                <p className="text-xs text-gray-500">
                                    Diperbarui hari ini
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <main className="flex-grow py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* SIDEBAR FILTERS (Desktop) */}
                        <aside className="hidden lg:block space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Filter className="w-4 h-4" /> Filter
                                        Pencarian
                                    </h3>
                                    <button
                                        onClick={resetFilters}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Reset
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Search */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Cari Model
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="search"
                                                value={values.search}
                                                onChange={handleChange}
                                                placeholder="Nama motor..."
                                                className="w-full bg-gray-50 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Brand */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Merek
                                        </label>
                                        <select
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-2.5 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
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
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Tipe
                                        </label>
                                        <select
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-2.5 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
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
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Rentang Harga
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                name="min_price"
                                                value={values.min_price}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
                                            />
                                            <input
                                                type="number"
                                                name="max_price"
                                                value={values.max_price}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
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
                                className="flex-grow flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold shadow-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal size={18} /> Filter Unit
                                </span>
                                {Object.values(values).filter(Boolean).length >
                                    0 && (
                                    <Badge variant="blue" size="sm">
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
                                        className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-[2rem] p-12 shadow-sm"
                                    >
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Memuat Data...
                                        </h3>
                                        <p className="text-gray-500">
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
                                                        className="h-full overflow-hidden group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                                                    >
                                                        {/* Image Container */}
                                                        <div className="relative h-56 bg-gray-100 overflow-hidden">
                                                            <img
                                                                src={
                                                                    motor.image_path
                                                                        ? `/storage/${motor.image_path}`
                                                                        : "/images/placeholder-motor.jpg"
                                                                }
                                                                alt={motor.name}
                                                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                                                                    !motor.tersedia
                                                                        ? "grayscale brightness-75"
                                                                        : ""
                                                                }`}
                                                            />

                                                            {/* Status Overlay */}
                                                            {!motor.tersedia && (
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                    <span className="px-6 py-2 bg-red-600 text-white font-black text-xl uppercase tracking-widest -rotate-12 border-2 border-white shadow-lg">
                                                                        TERJUAL
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Badges */}
                                                            <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
                                                                <Badge
                                                                    variant="blue"
                                                                    size="sm"
                                                                    className="shadow-sm backdrop-blur-sm bg-white/90"
                                                                >
                                                                    {
                                                                        motor.brand
                                                                    }
                                                                </Badge>
                                                                <Badge
                                                                    variant={
                                                                        motor.tersedia
                                                                            ? "green"
                                                                            : "red"
                                                                    }
                                                                    size="sm"
                                                                    className="shadow-sm backdrop-blur-sm bg-white/90"
                                                                >
                                                                    {motor.tersedia
                                                                        ? "Tersedia"
                                                                        : "Stok Habis"}
                                                                </Badge>
                                                            </div>

                                                            {/* Promo Ribbons (Momotor Style) */}
                                                            {motor.promotions &&
                                                                motor.promotions
                                                                    .length >
                                                                    0 && (
                                                                    <div className="absolute bottom-3 left-0 flex flex-col gap-2 z-10 pointer-events-none w-full pr-4">
                                                                        {motor.promotions
                                                                            .slice(
                                                                                0,
                                                                                2,
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    promo,
                                                                                    pIndex,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            pIndex
                                                                                        }
                                                                                        className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-r-xl shadow-xl shadow-blue-500/20 border border-blue-400/30 self-start truncate max-w-full"
                                                                                    >
                                                                                        <span className="mr-1.5">
                                                                                            ✨
                                                                                        </span>
                                                                                        {promo.badge_text ||
                                                                                            promo.title}
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                    </div>
                                                                )}
                                                        </div>

                                                        {/* Card Body */}
                                                        <CardBody className="p-6 space-y-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />{" "}
                                                                        {
                                                                            motor.year
                                                                        }
                                                                    </span>
                                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                                    <span className="flex items-center gap-1 uppercase">
                                                                        <Clock className="w-3 h-3" />{" "}
                                                                        {
                                                                            motor.type
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                                    {motor.name}
                                                                </h3>
                                                            </div>

                                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                                        Mulai
                                                                        Harga
                                                                    </p>
                                                                    <p className="text-2xl font-black text-blue-600 tracking-tight">
                                                                        Rp{" "}
                                                                        {parseFloat(
                                                                            motor.price,
                                                                        ).toLocaleString(
                                                                            "id-ID",
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
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
                                        className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-[2rem] p-12 shadow-sm"
                                    >
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                            <Search size={48} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            Motor Tidak Ditemukan
                                        </h3>
                                        <p className="text-gray-500 max-w-sm mb-8">
                                            Maaf, kami tidak menemukan motor
                                            yang sesuai dengan kriteria
                                            pencarian Anda. Coba ubah filter
                                            atau kata kunci lainnya.
                                        </p>
                                        <Button
                                            variant="secondary"
                                            onClick={resetFilters}
                                        >
                                            Hapus Semua Filter
                                        </Button>
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
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                                        : link.url
                                                          ? "bg-white text-gray-600 border-gray-200 hover:border-blue-600 hover:text-blue-600"
                                                          : "opacity-40 cursor-not-allowed border-transparent text-gray-400"
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
                            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Filter Pencarian
                                </h3>
                                <button
                                    onClick={() => setIsFiltersOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">
                                        Cari Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="search"
                                        value={values.search}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 outline-none"
                                        placeholder="Cari..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">
                                        Merek
                                    </label>
                                    <select
                                        name="brand"
                                        value={values.brand}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 outline-none"
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
                                    <label className="text-sm font-bold text-gray-700">
                                        Tipe
                                    </label>
                                    <select
                                        name="type"
                                        value={values.type}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 outline-none"
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
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        fullWidth
                                        onClick={() => setIsFiltersOpen(false)}
                                    >
                                        Lihat Hasil
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PublicLayout>
    );
}
