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
import MotorCardSkeleton from "@/Components/Public/MotorCardSkeleton";

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

    const [wishlistIds, setWishlistIds] = useState(() => {
        if (auth?.wishlist_ids && Array.isArray(auth.wishlist_ids)) {
            return auth.wishlist_ids;
        }
        try {
            const saved = localStorage.getItem("srb_wishlist");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const toggleWishlist = async (motorId, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const isFav = wishlistIds.includes(motorId);
        const next = isFav
            ? wishlistIds.filter((id) => id !== motorId)
            : [...wishlistIds, motorId];

        setWishlistIds(next);
        try {
            localStorage.setItem("srb_wishlist", JSON.stringify(next));
        } catch (err) {}

        if (auth?.user) {
            try {
                const res = await axios.post(route("wishlist.toggle"), {
                    motor_id: motorId,
                });
                if (res.data?.wishlist) {
                    setWishlistIds(res.data.wishlist);
                }
            } catch (err) {
                console.error("Wishlist sync error:", err);
            }
        }
    };

    const [values, setValues] = useState({
        search: filters.search || "",
        brand: filters.brand || "",
        type: filters.type || "",
        year: filters.year || "",
        min_price: filters.min_price || "",
        max_price: filters.max_price || "",
        favorit: filters.favorit || "",
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

            if (searchValues.favorit === "1") {
                query.favorit = "1";
                query.favorit_ids = wishlistIds.join(",");
            }

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
                {/* HERO SECTION -   BLACK */}
                <section className="bg-black text-white pt-12 pb-24 border-b border-gray-800 relative">
                    <div className="absolute inset-0 bg-[#1c69d4] blur-[150px] opacity-10 rounded-full pointer-events-none transform -translate-y-12"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4] mb-8">
                            <Link
                                href="/"
                                className="hover:text-white transition-colors"
                            >
                                HOME
                            </Link>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400">
                                KATALOG KENDARAAN
                            </span>
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
                                <div className="bg-white p-8 rounded-none border border-gray-200 sticky top-28 shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-5 h-5 text-[#1c69d4]" />
                                            <h3 className="font-black text-black uppercase tracking-tighter text-2xl">
                                                FILTER
                                            </h3>
                                        </div>
                                        {Object.values(values).filter(Boolean).length > 0 && (
                                            <button
                                                onClick={resetFilters}
                                                className="group flex items-center gap-1 text-[9px] font-black text-red-500 hover:text-black uppercase tracking-[0.2em] transition-colors"
                                            >
                                                <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
                                                RESET
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        {/* Search */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                                    PENCARIAN
                                                </label>
                                                {values.search && (
                                                    <button onClick={() => setValues({...values, search: ""})} className="text-[9px] font-bold text-gray-400 hover:text-red-500">CLEAR</button>
                                                )}
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    name="search"
                                                    value={values.search}
                                                    onChange={handleChange}
                                                    placeholder="CARI MODEL..."
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-none pl-4 pr-10 py-3.5 focus:border-black focus:bg-white focus:ring-0 outline-none transition-all text-sm font-black text-black uppercase placeholder-gray-300"
                                                />
                                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-black transition-colors" />
                                            </div>
                                        </div>

                                        {/* Brand Chips */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                                    MEREK
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setValues({...values, brand: ""})}
                                                    className={`px-3 py-2.5 text-[10px] font-black border-2 transition-all text-center tracking-widest ${values.brand === "" ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                                                >
                                                    SEMUA
                                                </button>
                                                {brands.map((b) => (
                                                    <button
                                                        key={b}
                                                        onClick={() => setValues({...values, brand: b})}
                                                        className={`px-3 py-2.5 text-[10px] font-black border-2 transition-all text-center tracking-widest truncate ${values.brand === b ? 'bg-[#1c69d4] text-white border-[#1c69d4]' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                                                    >
                                                        {b.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Type Chips */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                                    KATEGORI
                                                </label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setValues({...values, type: ""})}
                                                    className={`px-4 py-2 text-[9px] font-black border-2 transition-all tracking-widest rounded-full ${values.type === "" ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                                                >
                                                    SEMUA
                                                </button>
                                                {types.map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setValues({...values, type: t})}
                                                        className={`px-4 py-2 text-[9px] font-black border-2 transition-all tracking-widest rounded-full ${values.type === t ? 'bg-[#1c69d4] text-white border-[#1c69d4]' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                                                    >
                                                        {t.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                            <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                                RENTANG HARGA
                                            </label>
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 group-focus-within:text-[#1c69d4]">RP</span>
                                                    <input
                                                        type="number"
                                                        name="min_price"
                                                        value={values.min_price}
                                                        onChange={handleChange}
                                                        placeholder="MINIMAL"
                                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-none pl-10 pr-4 py-3 focus:border-[#1c69d4] focus:bg-white focus:ring-0 outline-none transition-all text-xs font-black text-black uppercase placeholder-gray-300"
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 group-focus-within:text-[#1c69d4]">RP</span>
                                                    <input
                                                        type="number"
                                                        name="max_price"
                                                        value={values.max_price}
                                                        onChange={handleChange}
                                                        placeholder="MAKSIMAL"
                                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-none pl-10 pr-4 py-3 focus:border-[#1c69d4] focus:bg-white focus:ring-0 outline-none transition-all text-xs font-black text-black uppercase placeholder-gray-300"
                                                    />
                                                </div>
                                            </div>
                                            {(values.min_price || values.max_price) && (
                                                <button 
                                                    onClick={() => setValues({...values, min_price: "", max_price: ""})}
                                                    className="w-full py-2 text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest border border-dashed border-gray-200 hover:border-red-200 transition-all"
                                                >
                                                    RESET HARGA
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* MOBILE FILTER TRIGGER */}
                            <div className="lg:hidden flex gap-4 mb-6">
                                <button
                                    onClick={() =>
                                        setIsFiltersOpen(!isFiltersOpen)
                                    }
                                    className="flex-grow flex items-center justify-between px-6 py-4 bg-black border border-black rounded-none text-white font-bold uppercase tracking-widest text-[11px]"
                                >
                                    <span className="flex items-center gap-2">
                                        <SlidersHorizontal size={16} /> BUKA
                                        FILTER
                                    </span>
                                    {Object.values(values).filter(Boolean)
                                        .length > 0 && (
                                        <span className="bg-[#1c69d4] px-2 py-1 text-white">
                                            {
                                                Object.values(values).filter(
                                                    Boolean,
                                                ).length
                                            }{" "}
                                            AKTIF
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* GRID PRODUCT */}
                            <div className="lg:col-span-3">
                                {/* RESULTS HEADER */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-black"></div>
                                            <div>
                                                <h2 className="text-2xl font-black text-black uppercase tracking-tighter leading-none">
                                                    {values.favorit === "1" ? "MOTOR FAVORIT SAYA" : "HASIL PENCARIAN"}
                                                </h2>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    MENAMPILKAN {motors.total} UNIT {values.favorit === "1" ? "TERSIMPAN" : "TERBAIK"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextFav = values.favorit === "1" ? "" : "1";
                                                const newValues = { ...values, favorit: nextFav };
                                                setValues(newValues);
                                                fetchMotors(newValues);
                                            }}
                                            className={`flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all border ${
                                                values.favorit === "1"
                                                    ? "bg-red-500 text-white border-red-500 shadow-sm"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-500"
                                            }`}
                                        >
                                            <Heart size={14} className={values.favorit === "1" ? "fill-white" : "text-red-500"} />
                                            <span>Favorit ({wishlistIds.length})</span>
                                        </button>
                                    </div>
                                    
                                    {Object.values(values).filter(Boolean).length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(values).map(([key, value]) => {
                                                if (!value || key === 'min_price' || key === 'max_price') return null;
                                                return (
                                                    <div key={key} className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-600 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
                                                        <span className="opacity-50">{key}:</span> {value}
                                                        <button onClick={() => setValues({...values, [key]: ""})} className="hover:text-red-500 transition-colors ml-1 border-l border-gray-200 pl-1">
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200"
                                        >
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className="bg-white">
                                                    <MotorCardSkeleton />
                                                </div>
                                            ))}
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
                                                    transition={{
                                                        delay: i * 0.05,
                                                    }}
                                                    className="bg-white group"
                                                >
                                                    <Link
                                                        href={route(
                                                            "motors.show",
                                                            motor.id,
                                                        )}
                                                        className="block h-full flex flex-col"
                                                    >
                                                        {/* Image Container */}
                                                        <div className="relative aspect-[4/3] bg-white overflow-hidden p-6 border-b border-gray-100 flex items-center justify-center">
                                                            <img
                                                                src={
                                                                    motor.image ||
                                                                    (motor.image_path
                                                                        ? motor.image_path.startsWith('http') || motor.image_path.startsWith('/')
                                                                            ? motor.image_path
                                                                            : motor.image_path.startsWith('assets/')
                                                                            ? `/${motor.image_path}`
                                                                            : `/storage/${motor.image_path}`
                                                                        : "/assets/img/no-image.webp")
                                                                }
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = "/assets/img/no-image.webp";
                                                                }}
                                                                alt={motor.name}
                                                                className={`max-h-full object-contain transition-transform duration-500 group-hover:scale-105 ${!motor.tersedia ? "grayscale opacity-50" : ""}`}
                                                            />

                                                            {/* Brand Tag */}
                                                            <div className="absolute top-4 left-4 bg-gray-100 px-3 py-1 border border-gray-200">
                                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                                    {
                                                                        motor.brand
                                                                    }
                                                                </span>
                                                            </div>

                                                            {/* Favorite / Wishlist Button */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => toggleWishlist(motor.id, e)}
                                                                aria-label={
                                                                    wishlistIds.includes(motor.id)
                                                                        ? "Hapus dari favorit"
                                                                        : "Tambah ke favorit"
                                                                }
                                                                className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${
                                                                    wishlistIds.includes(motor.id)
                                                                        ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                                                                        : "bg-white/90 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-white"
                                                                }`}
                                                            >
                                                                <Heart
                                                                    size={15}
                                                                    className={
                                                                        wishlistIds.includes(motor.id)
                                                                            ? "fill-red-500 text-red-500 scale-110"
                                                                            : "text-current"
                                                                    }
                                                                />
                                                            </button>

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
                                                                <span>
                                                                    {motor.year}
                                                                </span>
                                                                <span className="w-1 h-1 bg-gray-300"></span>
                                                                <span className="truncate">
                                                                    {motor.type}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-xl font-black text-black uppercase tracking-tight leading-tight mb-6 group-hover:text-[#1c69d4] transition-colors line-clamp-2">
                                                                {motor.name}
                                                            </h3>

                                                            <div className="mt-auto flex items-end justify-between pt-6 border-t border-gray-100">
                                                                <div>
                                                                    <p className="text-lg font-light text-black">
                                                                        Rp{" "}
                                                                        {parseFloat(
                                                                            motor.price,
                                                                        ).toLocaleString(
                                                                            "id-ID",
                                                                        )}
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
                                                Modifikasi parameter pencarian
                                                Anda untuk melihat ketersediaan
                                                unit lainnya.
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
                                {!isLoading &&
                                    motors.links &&
                                    motors.links.length > 3 && (
                                        <div className="flex justify-center gap-1 pt-12">
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
                                                    className={`min-w-[48px] h-12 flex items-center justify-center font-bold text-[11px] transition-colors uppercase border ${
                                                        link.active
                                                            ? "bg-black text-white border-black"
                                                            : link.url
                                                              ? "bg-white text-black border-gray-200 hover:border-black"
                                                              : "opacity-30 cursor-not-allowed border-transparent text-gray-500 bg-gray-100"
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

                {/* MOBILE FILTER OVERLAY */}
                <AnimatePresence>
                    {isFiltersOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] lg:hidden"
                        >
                            <div
                                className="absolute inset-0 bg-black/80"
                                onClick={() => setIsFiltersOpen(false)}
                            />
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

                                <div className="space-y-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                            PENCARIAN
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="search"
                                                value={values.search}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-none px-4 py-4 outline-none text-black focus:border-black font-black uppercase text-[12px] transition-all"
                                                placeholder="NAMA UNIT..."
                                            />
                                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                            MEREK
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setValues({...values, brand: ""})}
                                                className={`px-3 py-3 text-[10px] font-black border-2 transition-all tracking-widest ${values.brand === "" ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}
                                            >
                                                SEMUA
                                            </button>
                                            {brands.map((b) => (
                                                <button
                                                    key={b}
                                                    onClick={() => setValues({...values, brand: b})}
                                                    className={`px-3 py-3 text-[10px] font-black border-2 transition-all tracking-widest truncate ${values.brand === b ? 'bg-[#1c69d4] text-white border-[#1c69d4]' : 'bg-white text-gray-400 border-gray-100'}`}
                                                >
                                                    {b.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                            KATEGORI
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setValues({...values, type: ""})}
                                                className={`px-4 py-2.5 text-[9px] font-black border-2 transition-all tracking-widest rounded-full ${values.type === "" ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}
                                            >
                                                SEMUA
                                            </button>
                                            {types.map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setValues({...values, type: t})}
                                                    className={`px-4 py-2.5 text-[9px] font-black border-2 transition-all tracking-widest rounded-full ${values.type === t ? 'bg-[#1c69d4] text-white border-[#1c69d4]' : 'bg-white text-gray-400 border-gray-100'}`}
                                                >
                                                    {t.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                            RENTANG HARGA
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                name="min_price"
                                                value={values.min_price}
                                                onChange={handleChange}
                                                placeholder="MIN"
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-black text-[11px]"
                                            />
                                            <input
                                                type="number"
                                                name="max_price"
                                                value={values.max_price}
                                                onChange={handleChange}
                                                placeholder="MAX"
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-black text-[11px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-px bg-gray-200 border-t border-gray-200 mt-auto -mx-8 -mb-8">
                                    <button
                                        onClick={resetFilters}
                                        className="py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                    >
                                        RESET
                                    </button>
                                    <button
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="py-5 bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-900 active:bg-black transition-colors"
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
