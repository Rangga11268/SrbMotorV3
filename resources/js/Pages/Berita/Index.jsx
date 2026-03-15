import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { ChevronRight, Search, Calendar } from "lucide-react";

export default function BeritaIndex({ posts, categories, filters }) {
    const [searchInput, setSearchInput] = useState(filters?.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || "",
    );
    const [sort, setSort] = useState(filters?.sort || "newest");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("berita.index"),
            {
                search: searchInput,
                category: selectedCategory,
                sort: sort,
            },
            { preserveScroll: true },
        );
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        router.get(
            route("berita.index"),
            {
                search: searchInput,
                category: categoryId,
                sort: sort,
            },
            { preserveScroll: true },
        );
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        router.get(
            route("berita.index"),
            {
                search: searchInput,
                category: selectedCategory,
                sort: newSort,
            },
            { preserveScroll: true },
        );
    };

    const handleClearFilters = () => {
        setSearchInput("");
        setSelectedCategory("");
        setSort("newest");
        router.get(route("berita.index"), {}, { preserveScroll: true });
    };

    return (
        <PublicLayout title="Berita & Artikel - SRB Motors">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Berita SRB Motor
                        </h1>
                        <p className="text-lg text-blue-100">
                            Dapatkan informasi terbaru tentang dunia otomotif
                            dari SRB Motor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Search */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                                Cari
                            </h3>
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) =>
                                            setSearchInput(e.target.value)
                                        }
                                        placeholder="Cari judul..."
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        <Search className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                                Kategori
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryFilter("")}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                        selectedCategory === ""
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
                                            selectedCategory ===
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
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                                Urutan
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleSortChange("newest")}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                        sort === "newest"
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    Terbaru
                                </button>
                                <button
                                    onClick={() => handleSortChange("oldest")}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                                        sort === "oldest"
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    Terlama
                                </button>
                            </div>
                        </div>

                        {(searchInput ||
                            selectedCategory ||
                            sort !== "newest") && (
                            <button
                                onClick={handleClearFilters}
                                className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium"
                            >
                                Hapus Filter
                            </button>
                        )}
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {posts.data.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
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
                                            className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                                        >
                                            {post.featured_image && (
                                                <Link
                                                    href={route(
                                                        "berita.show",
                                                        post.slug,
                                                    )}
                                                >
                                                    <img
                                                        src={
                                                            post.featured_image
                                                        }
                                                        alt={post.title}
                                                        className="w-full h-48 object-cover hover:brightness-90 transition"
                                                    />
                                                </Link>
                                            )}
                                            <div className="p-5">
                                                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                                    {post.category.name}
                                                </span>
                                                <Link
                                                    href={route(
                                                        "berita.show",
                                                        post.slug,
                                                    )}
                                                >
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                                                    {post.excerpt || post.title}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
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
                                                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold text-sm"
                                                >
                                                    Baca Selengkapnya
                                                    <ChevronRight className="w-4 h-4" />
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
                                                    href={posts.prev_page_url}
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
                                                    href={posts.next_page_url}
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
        </PublicLayout>
    );
}
