import React from "react";
import { useComparison } from "@/Contexts/ComparisonContext";
import { Link } from "@inertiajs/react";
import { X, ArrowRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComparisonFloatingBar() {
    const { selectedMotors, removeFromCompare, clearComparison } =
        useComparison();

    if (selectedMotors.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
                <div className="bg-surface-dark/90 backdrop-blur-xl border border-white/10 text-white rounded-full p-2 pl-4 shadow-2xl flex items-center justify-between ring-1 ring-white/20">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Layers size={20} className="text-primary" />
                            <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-surface-dark">
                                {selectedMotors.length}
                            </span>
                        </div>
                        <span className="text-sm font-bold tracking-wide text-gray-200">
                            Bandingkan Unit
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route("motors.compare")}
                            className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary-dark hover:text-white transition-all flex items-center gap-1 group"
                        >
                            Bandingkan{" "}
                            <ArrowRight
                                size={14}
                                className="group-hover:translate-x-0.5 transition-transform"
                            />
                        </Link>
                        <button
                            onClick={clearComparison}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
