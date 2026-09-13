import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoginFormModal from "./LoginFormModal";
import RegisterFormModal from "./RegisterFormModal";

export default function AuthModal({ visible, onClose, message = null }) {
    const [mode, setMode] = useState("login");

    const handleSwitch = (newMode) => {
        setMode(newMode);
    };

    const handleClose = () => {
        setMode("login");
        onClose();
    };

    return (
        <AnimatePresence mode="wait">
            {visible && (
                <>
                    {/* Backdrop with a hint of blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 400,
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-w-md w-full max-h-[90vh] overflow-y-auto flex flex-col rounded-none">
                            {/* Header: Pure   Style - Sharp, Blocky, Professional */}
                            <div className="relative bg-[#111111] px-8 py-8 text-white overflow-hidden shrink-0">
                                {/* Subtle Background Brand Accent */}
                                <div className="absolute top-0 right-0 w-32 h-full bg-[#1c69d4]/10 skew-x-[30deg] translate-x-16" />

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-1 bg-[#1c69d4]"></div>
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bbbbbb]">
                                                SRB MOTOR MEMBER
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-light uppercase tracking-[0.1em] leading-tight">
                                            {mode === "login" ? (
                                                <>
                                                    SILAKAN
                                                    <br />
                                                    <span className="font-bold text-[#1c69d4]">
                                                        MASUK
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    BUAT
                                                    <br />
                                                    <span className="font-bold text-[#1c69d4]">
                                                        AKUN
                                                    </span>
                                                </>
                                            )}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-1 text-[#757575] hover:text-white transition-colors"
                                    >
                                        <X size={20} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Message Area: For redirections or important notices */}
                            {message && (
                                <div className="px-8 pt-6 pb-0">
                                    <div className="bg-blue-50 border-l-4 border-[#1c69d4] px-4 py-3 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1c69d4] animate-pulse"></div>
                                        <p className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-widest leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Content Area */}
                            <div className="px-8 py-10">
                                {mode === "login" ? (
                                    <LoginFormModal onSwitch={handleSwitch} />
                                ) : (
                                    <RegisterFormModal
                                        onSwitch={handleSwitch}
                                    />
                                )}
                            </div>

                            {/* Footer Accent */}
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#1c69d4]/20 to-transparent"></div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
