import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { ChevronRight, Search, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function BeritaIndex({
    posts: initialPosts,
    categories,
    filters,
}) {
    const [posts, setPosts] = useState(initialPosts);
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState({
        search: filters?.search || "",
        category: filters?.category || "",
        sort: filters?.sort || "newest",
    });

    const fetchPosts = useCallback(async (searchValues) => {
        setIsLoading(true);
        try {
            const query = Object.keys(searchValues).reduce((acc, key) => {
                if (searchValues[key]) acc[key] = searchValues[key];
                return acc;
            }, {});

            const response = await axios.get(route("berita.index"), {
                params: query,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
            });

            setPosts(response.data.posts);

            const queryString = new URLSearchParams(query).toString();
            window.history.pushState(
                {},
                "",
                `${window.location.pathname}${queryString ? "?" + queryString : ""}`,
            );
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts(values);
        }, 500);

        return () => clearTimeout(timer);
    }, [values, fetchPosts]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Triggered by useEffect debouncing values.search
    };

    const handleCategoryFilter = (categoryId) => {
        setValues((v) => ({ ...v, category: categoryId }));
    };

    const handleSortChange = (newSort) => {
        setValues((v) => ({ ...v, sort: newSort }));
    };

    const handleClearFilters = () => {
        setValues({
            search: "",
            category: "",
            sort: "newest",
        });
    };

    return (
        <PublicLayout title="Berita & Artikel - SRB Motors">
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
                                        Berita & Artikel
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                    Wawasan &{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                                        Berita Terbaru
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
                                    Dapatkan informasi terbaru tentang dunia
                                    otomotif, tips perawatan, dan update terkini
                                    dari SRB Motor.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-max">
                            {/* Search */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                                <h3 className="font-black text-lg mb-4 text-slate-900 dark:text-white uppercase tracking-wider">
                                    Cari
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={values.search}
                                        onChange={(e) =>
                                            setValues((v) => ({
                                                ...v,
                                                search: e.target.value,
                                            }))
                                        }
                                        placeholder="Cari judul..."
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                                <h3 className="font-black text-lg mb-4 text-slate-900 dark:text-white uppercase tracking-wider">
                                    Kategori
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleCategoryFilter("")}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                            values.category === ""
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        Semua
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                handleCategoryFilter(cat.id)
                                            }
                                            className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                                values.category ===
                                                cat.id.toString()
                                                    ? "bg-blue-600 text-white"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                                <h3 className="font-black text-lg mb-4 text-slate-900 dark:text-white uppercase tracking-wider">
                                    Urutan
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() =>
                                            handleSortChange("newest")
                                        }
                                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                            values.sort === "newest"
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        Terbaru
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleSortChange("oldest")
                                        }
                                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                            values.sort === "oldest"
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        Terlama
                                    </button>
                                </div>
                            </div>

                            {(values.search ||
                                values.category ||
                                values.sort !== "newest") && (
                                <button
                                    onClick={handleClearFilters}
                                    className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium"
                                >
                                    Hapus Filter
                                </button>
                            )}
                        </aside>

                        {/* Content */}
                        <div className="lg:col-span-3 relative min-h-[400px]">
                            {/* Loading Overlay */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                                                Memuat...
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {posts.data.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-12 text-center">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase">
                                        Tidak Ada Berita
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                        Coba dengan filter yang berbeda
                                    </p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Lihat Semua
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                        {posts.data.map((post) => (
                                            <article
                                                key={post.id}
                                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 group flex flex-col"
                                            >
                                                <Link
                                                    href={route(
                                                        "berita.show",
                                                        post.slug,
                                                    )}
                                                    className="block overflow-hidden relative aspect-[16/10]"
                                                >
                                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                                    <img
                                                        src={
                                                            post.featured_image || "/assets/img/no-image.png"
                                                        }
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/img/no-image.png";
                                                        }}
                                                    />
                                                </Link>
                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                            {post.category.name}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(
                                                                post.published_at,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={route(
                                                            "berita.show",
                                                            post.slug,
                                                        )}
                                                    >
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
                                                            {post.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                                        {post.excerpt ||
                                                            post.title}
                                                    </p>
                                                    
                                                    <Link
                                                        href={route(
                                                            "berita.show",
                                                            post.slug,
                                                        )}
                                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-sm transition-colors mt-auto"
                                                    >
                                                        Baca Selengkapnya
                                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    {posts.last_page > 1 && (
                                        <nav className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-8">
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {posts.from}-{posts.to} dari{" "}
                                                {posts.total}
                                            </div>
                                            <div className="flex gap-2">
                                                {posts.prev_page_url && (
                                                    <Link
                                                        href={
                                                            posts.prev_page_url
                                                        }
                                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                    >
                                                        ← Sebelumnya
                                                    </Link>
                                                )}
                                                {Array.from({
                                                    length: posts.last_page,
                                                }).map((_, i) => {
                                                    const page = i + 1;
                                                    return (
                                                        <Link
                                                            key={page}
                                                            href={`${route("berita.index")}?page=${page}`}
                                                            className={`px-3 py-2 rounded-lg transition ${
                                                                page ===
                                                                posts.current_page
                                                                    ? "bg-blue-600 text-white font-semibold"
                                                                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            }`}
                                                        >
                                                            {page}
                                                        </Link>
                                                    );
                                                })}
                                                {posts.next_page_url && (
                                                    <Link
                                                        href={
                                                            posts.next_page_url
                                                        }
                                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                    >
                                                        Berikutnya →
                                                    </Link>
                                                )}
                                            </div>
                                        </nav>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </PublicLayout>
    );
}
