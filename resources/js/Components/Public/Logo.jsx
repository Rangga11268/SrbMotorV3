import React from "react";

export default function Logo({ className = "h-8 w-auto", iconOnly = false }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-12 opacity-20 animate-pulse"></div>

                {/* Main Icon Shape */}
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-200">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-white"
                    >
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                </div>
            </div>

            {!iconOnly && (
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                        SRB<span className="text-blue-600">MOTORS</span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                        Trusted Dealer
                    </span>
                </div>
            )}
        </div>
    );
}
