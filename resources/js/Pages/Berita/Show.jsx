import React from "react";
import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    ChevronLeft,
    Calendar,
    User,
    Share2,
    Facebook,
    MessageCircle,
    Link as LinkIcon,
} from "lucide-react";

export default function BeritaShow({
    post,
    relatedPosts,
    previousPost,
    nextPost,
}) {
    const handleShare = (platform) => {
        const url = window.location.href;
        const title = post.title;
        const text = `${title} - SRB Motor`;

        if (platform === "whatsapp") {
            window.open(
                `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
            );
        } else if (platform === "facebook") {
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            );
        } else if (platform === "copy") {
            navigator.clipboard.writeText(url);
            alert("Link disalin ke clipboard!");
        }
    };

    return (
        <PublicLayout title={post.title}>
            {/* Breadcrumb */}
            <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Link
                            href={route("berita.index")}
                            className="hover:text-blue-600"
                        >
                            Berita
                        </Link>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white">
                            {post.category.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Article */}
                    <article className="lg:col-span-2">
                        {/* Back Button */}
                        <Link
                            href={route("berita.index")}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold mb-8 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Kembali ke Berita
                        </Link>

                        {/* Text Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="inline-block bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full tracking-wide">
                                    {post.category.name}
                                </span>
                                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.published_at).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        },
                                    )}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
                                <div className="text-sm text-slate-500 font-medium">
                                    {post.views && (
                                        <span>{post.views} kali dibaca</span>
                                    )}
                                </div>
                                {/* Share Buttons */}
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 text-sm font-medium mr-2 hidden sm:inline">
                                        Bagikan:
                                    </span>
                                    <button
                                        onClick={() => handleShare("whatsapp")}
                                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                                        title="Bagikan ke WhatsApp"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleShare("facebook")}
                                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                        title="Bagikan ke Facebook"
                                    >
                                        <Facebook className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleShare("copy")}
                                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        title="Salin link"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {post.featured_image && (
                            <div className="relative mb-12 rounded-[2rem] overflow-hidden shadow-lg aspect-[16/9]">
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="article-content mb-16 px-4 md:px-0 max-w-none">
                            <div
                                className="prose prose-lg md:prose-xl prose-slate dark:prose-invert 
                                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                                prose-img:rounded-[2rem] prose-img:shadow-2xl
                                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold hover:prose-a:text-blue-700
                                prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:italic
                                max-w-3xl mx-auto"
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            />
                        </div>

                        {/* Navigation */}
                        {(previousPost || nextPost) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-700 pt-8">
                                {previousPost ? (
                                    <Link
                                        href={route(
                                            "berita.show",
                                            previousPost.slug,
                                        )}
                                        className="group p-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                                    >
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            ← Artikel Sebelumnya
                                        </div>
                                        <div className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                            {previousPost.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                                {nextPost ? (
                                    <Link
                                        href={route(
                                            "berita.show",
                                            nextPost.slug,
                                        )}
                                        className="group p-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition text-right"
                                    >
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            Artikel Berikutnya →
                                        </div>
                                        <div className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                            {nextPost.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                            </div>
                        )}
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 lg:sticky lg:top-24 h-max">
                        {relatedPosts.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">
                                    Artikel Terkait
                                </h3>
                                <div className="space-y-6">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.id}
                                            href={route(
                                                "berita.show",
                                                relatedPost.slug,
                                            )}
                                            className="group flex gap-4 items-center"
                                        >
                                            <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-24 h-24">
                                                {relatedPost.featured_image ? (
                                                    <img
                                                        src={
                                                            relatedPost.featured_image
                                                        }
                                                        alt={relatedPost.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700" />
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 text-sm leading-snug mb-1 transition-colors">
                                                    {relatedPost.title}
                                                </h4>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 ring-1 ring-slate-200 dark:ring-slate-700 rounded-full px-2 py-0.5 w-max">
                                                    <Calendar className="w-3 h-3 text-blue-500" />
                                                    {new Date(
                                                        relatedPost.published_at,
                                                    ).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA Box */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                            
                            <h3 className="text-xl font-black mb-3 relative z-10">
                                Tertarik dengan Motor Kami?
                            </h3>
                            <p className="text-sm text-blue-100 mb-6 font-medium relative z-10">
                                Lihat katalog lengkap dan dapatkan penawaran
                                terbaik hari ini.
                            </p>
                            <Link
                                href={route("motors.index")}
                                className="inline-block w-full text-center bg-white text-blue-700 font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all relative z-10"
                            >
                                Lihat Katalog Motor
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </PublicLayout>
    );
}
