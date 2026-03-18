import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoginFormModal from "./LoginFormModal";
import RegisterFormModal from "./RegisterFormModal";

export default function AuthModal({ visible, onClose }) {
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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            {/* Header dengan Logo */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-6 flex justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/assets/icon/logo.png"
                                        alt="SRB Motor"
                                        className="h-10 w-10 object-contain"
                                    />
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {mode === "login"
                                                ? "Masuk"
                                                : "Daftar"}
                                        </h2>
                                        <p className="text-xs text-gray-500 font-medium">
                                            SRB Motor
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all flex-shrink-0"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {mode === "login" ? (
                                    <LoginFormModal onSwitch={handleSwitch} />
                                ) : (
                                    <RegisterFormModal
                                        onSwitch={handleSwitch}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
