import React from "react";
import { Head } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen font-sans text-gray-900 bg-gray-50 selection:bg-blue-600 selection:text-white overflow-x-hidden">
                <main>{children}</main>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className:
                            "!rounded-2xl !font-medium !shadow-xl !bg-white !text-gray-900 !border !border-gray-100",
                    }}
                />
            </div>
        </>
    );
}
