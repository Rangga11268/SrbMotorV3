import React from "react";
import Navbar from "@/Components/Public/Navbar";
import Footer from "@/Components/Public/Footer";
import { Toaster } from "react-hot-toast";
import { Head } from "@inertiajs/react";

export default function PublicLayout({ children, title, auth }) {
    return (
        <div className="public-theme-root">
            <Head title={title} />
            <Toaster position="top-center" />
            <Navbar auth={auth} />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </div>
    );
}
