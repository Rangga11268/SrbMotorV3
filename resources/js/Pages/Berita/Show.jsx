import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ChevronLeft, Calendar, User, Share2, Facebook, MessageCircle, Link as LinkIcon } from 'lucide-react';

export default function BeritaShow({ post, relatedPosts, previousPost, nextPost }) {
    const handleShare = (platform) => {
        const url = window.location.href;
        const title = post.title;
        const text = `${title} - SRB Motor`;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert('Link disalin ke clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Link href={route('berita.index')} className="hover:text-blue-600">Berita</Link>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white">{post.category.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Article */}
                    <article className="lg:col-span-2">
                        {/* Back Button */}
                        <Link href={route('berita.index')} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6 font-medium">
                            <ChevronLeft className="w-4 h-4" />
                            Kembali ke Berita
                        </Link>

                        {/* Featured Image */}
                        {post.featured_image && (
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-96 object-cover rounded-lg mb-8"
                            />
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
                            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                                {post.category.name}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.published_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            {post.views && (
                                <span className="text-slate-500 dark:text-slate-500">
                                    {post.views} kali dibaca
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            {post.title}
                        </h1>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Bagikan:</span>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition"
                                title="Bagikan ke WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleShare('facebook')}
                                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                                title="Bagikan ke Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleShare('copy')}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                                title="Salin link"
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="prose dark:prose-invert max-w-none mb-12">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed" />
                        </div>

                        {/* Navigation */}
                        {(previousPost || nextPost) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-700 pt-8">
                                {previousPost ? (
                                    <Link
                                        href={route('berita.show', previousPost.slug)}
                                        className="group p-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                                    >
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">← Artikel Sebelumnya</div>
                                        <div className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                            {previousPost.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                                {nextPost ? (
                                    <Link
                                        href={route('berita.show', nextPost.slug)}
                                        className="group p-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition text-right"
                                    >
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Artikel Berikutnya →</div>
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
                    <aside className="lg:col-span-1">
                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    Artikel Terkait
                                </h3>
                                <div className="space-y-4">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.id}
                                            href={route('berita.show', relatedPost.slug)}
                                            className="block group"
                                        >
                                            <div className="relative overflow-hidden rounded-lg mb-2">
                                                {relatedPost.featured_image && (
                                                    <img
                                                        src={relatedPost.featured_image}
                                                        alt={relatedPost.title}
                                                        className="w-full h-32 object-cover group-hover:brightness-90 transition"
                                                    />
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 text-sm">
                                                {relatedPost.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(relatedPost.published_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA Box */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-lg shadow p-6 text-white">
                            <h3 className="text-lg font-bold mb-2">Tertarik dengan Motor Kami?</h3>
                            <p className="text-sm text-blue-100 mb-4">
                                Lihat katalog lengkap dan dapatkan penawaran terbaik hari ini.
                            </p>
                            <Link
                                href={route('motors.index')}
                                className="inline-block w-full text-center bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition"
                            >
                                Lihat Katalog Motor
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
