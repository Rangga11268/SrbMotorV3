import React from "react";

export default function Logo({ className = "h-8 w-auto", iconOnly = false }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="relative flex items-center justify-center">
                <img
                    src="/assets/icon/logo trans.png"
                    alt="SRB Motors Logo"
                    className="w-10 h-10 object-contain drop-shadow-md"
                />
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
