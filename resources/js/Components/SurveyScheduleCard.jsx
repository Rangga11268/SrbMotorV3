import React from "react";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    AlertCircle,
} from "lucide-react";

export default function SurveyScheduleCard({
    surveySchedule,
    onReschedule,
    onConfirm,
    onCancel,
}) {
    if (!surveySchedule) {
        return null;
    }

    // Status color configurations
    const getStatusConfig = (status) => {
        const config = {
            pending: {
                badge: "bg-yellow-100 text-yellow-800",
                label: "⏳ Pending",
            },
            confirmed: {
                badge: "bg-blue-100 text-blue-800",
                label: "Confirmed",
            },
            completed: {
                badge: "bg-green-100 text-green-800",
                label: "Completed",
            },
            cancelled: {
                badge: "bg-red-100 text-red-800",
                label: "✗ Cancelled",
            },
        };
        return config[status] || config.pending;
    };

    const statusConfig = getStatusConfig(surveySchedule.status);
    const surveyDate = new Date(surveySchedule.scheduled_date);
    const formattedDate = surveyDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm mb-4">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Jadwal Survey
                    </h3>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badge}`}
                    >
                        {statusConfig.label}
                    </span>
                </div>
                {surveySchedule.status === "pending" && (
                    <div className="flex gap-2">
                        {onReschedule && (
                            <button
                                onClick={onReschedule}
                                className="px-3 py-1.5 text-sm font-medium text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:hover:bg-yellow-950 transition-colors"
                            >
                                🔄 Ubah Jadwal
                            </button>
                        )}
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-3 py-1.5 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-950 transition-colors"
                            >
                                ✕ Batalkan
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Tanggal */}
                <div className="flex gap-4">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tanggal
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                {/* Waktu */}
                <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Waktu
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {surveySchedule.scheduled_time}
                        </p>
                    </div>
                </div>

                {/* Lokasi */}
                <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Lokasi
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {surveySchedule.location}
                        </p>
                    </div>
                </div>

                {/* Surveyor */}
                <div className="flex gap-4">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Surveyor
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {surveySchedule.surveyor_name}
                        </p>
                    </div>
                </div>

                {/* No. WhatsApp */}
                <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            No. WhatsApp
                        </p>
                        <a
                            href={`https://wa.me/${surveySchedule.surveyor_phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {surveySchedule.surveyor_phone}
                        </a>
                    </div>
                </div>

                {/* Catatan */}
                {surveySchedule.notes && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            📝 Catatan Survey
                        </p>
                        <div
                            className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: surveySchedule.notes,
                            }}
                        />
                    </div>
                )}

                {/* Info Box */}
                {surveySchedule.status === "pending" && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>💡 Tips:</strong> Customer akan menerima
                            notifikasi WhatsApp berisi detail jadwal survey ini.
                            Pastikan semua informasi sudah benar sebelum
                            disimpan.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
