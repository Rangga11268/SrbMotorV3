import React from "react";
import {
    Inbox,
    CreditCard,
    CheckCircle,
    HardHat,
    Truck,
    PartyPopper,
    AlertCircle,
    Activity,
    FileType,
    Info,
    Fingerprint,
    Cpu,
    XCircle
} from "lucide-react";

export default function CashStatusDisplay({ transaction }) {
    const statusMap = {
        new_order: {
            label: "Pesanan Masuk",
            description: "Pesanan Anda telah kami terima dan sedang diverifikasi oleh tim kami.",
            color: "blue",
            icon: Inbox,
            step: 1
        },
        waiting_payment: {
            label: "Menunggu Pembayaran",
            description: "Silakan lakukan pembayaran sesuai dengan instruksi yang diberikan.",
            color: "yellow",
            icon: CreditCard,
            step: 2
        },
        pembayaran_dikonfirmasi: {
            label: "Pembayaran Dikonfirmasi",
            description: "Pembayaran Anda telah kami verifikasi. Terima kasih!",
            color: "green",
            icon: CheckCircle,
            step: 3
        },
        unit_preparation: {
            label: "Motor Disiapkan",
            description: "Tim teknis kami sedang menyiapkan unit motor pilihan Anda.",
            color: "blue",
            icon: HardHat,
            step: 4
        },
        ready_for_delivery: {
            label: "Siap Dikirim/Ambil",
            description: "Motor Anda telah siap! Silakan tunggu pengiriman atau datang ke dealer.",
            color: "blue",
            icon: Truck,
            step: 5
        },
        dalam_pengiriman: {
            label: "Dalam Pengiriman",
            description: "Motor sedang dalam perjalanan menuju alamat Anda.",
            color: "blue",
            icon: Truck,
            step: 5
        },
        completed: {
            label: "Selesai",
            description: "Transaksi telah selesai. Selamat menikmati motor baru Anda!",
            color: "green",
            icon: PartyPopper,
            step: 6
        },
        cancelled: {
            label: "Dibatalkan",
            description: "Pesanan ini telah dibatalkan.",
            color: "red",
            icon: XCircle,
            step: 0
        }
    };

    const steps = [
        { label: "Masuk", status: "new_order" },
        { label: "Bayar", status: "waiting_payment" },
        { label: "Lunas", status: "pembayaran_dikonfirmasi" },
        { label: "Siap", status: "unit_preparation" },
        { label: "Kirim", status: "ready_for_delivery" },
        { label: "Selesai", status: "completed" }
    ];

    const getStatusInfo = (status) => {
        return (
            statusMap[status] || {
                label: "Status: " + status,
                description: "Status sedang diperbarui oleh sistem.",
                color: "gray",
                icon: Activity,
                step: 1
            }
        );
    };

    const statusInfo = getStatusInfo(transaction.status);
    const currentStep = statusInfo.step;

    const getColorClass = (color) => {
        const colorMap = {
            blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800",
            yellow: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800",
            green: "border-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-800",
            red: "border-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-800",
            gray: "border-gray-500 bg-gray-50 dark:bg-gray-900/10 dark:border-gray-800",
        };
        return colorMap[color] || colorMap.gray;
    };

    return (
        <div className="space-y-8">
            {/* 6-Stage Stepper */}
            <div className="relative pt-4 px-2">
                <div className="flex items-center justify-between relative z-10">
                    {steps.map((step, index) => {
                        const stepNum = index + 1;
                        const isCompleted = currentStep > stepNum || transaction.status === 'completed';
                        const isActive = currentStep === stepNum;
                        
                        return (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                    isCompleted 
                                        ? "bg-green-500 border-green-200 dark:border-green-900 text-white" 
                                        : isActive
                                            ? "bg-blue-600 border-blue-200 dark:border-blue-900 text-white scale-110 shadow-lg"
                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                                }`}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{stepNum}</span>}
                                </div>
                                <span className={`mt-2 text-xs font-bold transition-all duration-300 ${
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Horizontal Progress Bar */}
                <div className="absolute top-9 left-0 w-full px-12 z-0">
                    <div className="h-1 bg-slate-200 dark:bg-slate-700 w-full rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-700 ease-in-out" 
                            style={{ width: `${Math.max(0, (Math.min(currentStep, 6) - 1) / 5 * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Status Highlight Card */}
            <div className={`border-l-4 rounded-xl p-6 shadow-sm overflow-hidden transition-all duration-300 ${getColorClass(statusInfo.color)}`}>
                <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${
                        statusInfo.color === 'blue' ? 'text-blue-600' :
                        statusInfo.color === 'green' ? 'text-green-600' :
                        statusInfo.color === 'yellow' ? 'text-yellow-600' : 'text-slate-600'
                    }`}>
                        <statusInfo.icon className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            {statusInfo.label}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400">
                            {statusInfo.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Technical Data (Only visible if available) */}
            {(transaction.frame_number || transaction.engine_number) && (
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <h5 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-blue-600" /> Data Teknis Kendaraan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {transaction.frame_number && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Fingerprint className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Nomor Rangka</p>
                                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tracking-widest">{transaction.frame_number}</p>
                                </div>
                            </div>
                        )}
                        {transaction.engine_number && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <Cpu className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Nomor Mesin</p>
                                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tracking-widest">{transaction.engine_number}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 italic">
                        * Gunakan nomor di atas untuk keperluan asuransi atau pengecekan resmi.
                    </div>
                </div>
            )}
        </div>
    );
}
