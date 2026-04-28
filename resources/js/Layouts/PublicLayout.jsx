import React from "react";
import Navbar from "@/Components/Public/Navbar";
import Footer from "@/Components/Public/Footer";
import FloatingWA from "@/Components/Public/FloatingWA";
import { Toaster } from "react-hot-toast";
import { Head, usePage } from "@inertiajs/react";

export default function PublicLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <div className="public-theme-root">
            <Head title={title} />
            <Toaster position="top-center" />
            <Navbar auth={auth} />
            <main className="min-h-screen">{children}</main>
            <FloatingWA />
            <Footer />
        </div>
    );
}
