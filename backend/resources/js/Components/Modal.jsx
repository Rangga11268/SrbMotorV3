import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

/**
 * A reusable Modal component with modern styling and animations.
 *
 * Props:
 * - isOpen: boolean - whether the modal is visible
 * - onClose: function - handler to close the modal
 * - title: string - modal title
 * - message: string - main content message
 * - confirmText: string - text for the confirm button (default: "Confirm")
 * - cancelText: string - text for the cancel button (default: "Cancel")
 * - onConfirm: function - handler when confirm is clicked
 * - type: "danger" | "success" | "info" | "warning" - determines styling (default: "info")
 * - processing: boolean - shows loading state on confirm button
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    type = "info",
    processing = false,
}) {
    // Config based on type
    const typeConfig = {
        danger: {
            icon: AlertTriangle,
            iconColor: "text-red-600 dark:text-red-400",
            iconBg: "bg-red-100 dark:bg-red-900/30",
            confirmBtn:
                "bg-red-600 hover:bg-red-700 hover:text-white text-white dark:bg-red-600 dark:hover:bg-red-500",
            focusRing: "focus:ring-red-500",
        },
        success: {
            icon: CheckCircle,
            iconColor: "text-green-600 dark:text-green-400",
            iconBg: "bg-green-100 dark:bg-green-900/30",
            confirmBtn:
                "bg-green-600 hover:bg-green-700 hover:text-white text-white dark:bg-green-600 dark:hover:bg-green-500",
            focusRing: "focus:ring-green-500",
        },
        warning: {
            icon: AlertTriangle,
            iconColor: "text-orange-600 dark:text-orange-400",
            iconBg: "bg-orange-100 dark:bg-orange-900/30",
            confirmBtn:
                "bg-orange-600 hover:bg-orange-700 hover:text-white text-white dark:bg-orange-600 dark:hover:bg-orange-500",
            focusRing: "focus:ring-orange-500",
        },
        info: {
            icon: Info,
            iconColor: "text-[#1c69d4]",
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            confirmBtn:
                "bg-[#1c69d4] hover:bg-blue-700 hover:text-white text-white",
            focusRing: "focus:ring-blue-500",
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    {/* Hardware-accelerated backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed inset-0 bg-black/60 transition-opacity"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="relative w-full max-w-md z-[10002] will-change-transform"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-6 sm:p-7">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`p-3 rounded-xl shrink-0 ${config.iconBg}`}
                                    >
                                        <Icon
                                            className={config.iconColor}
                                            size={24}
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 pt-0.5">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-7 flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        disabled={processing}
                                        className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={processing}
                                        className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all ${config.confirmBtn} ${config.focusRing}`}
                                    >
                                        {processing
                                            ? "Memproses..."
                                            : confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
