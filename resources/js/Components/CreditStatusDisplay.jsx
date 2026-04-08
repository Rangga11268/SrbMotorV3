import React from "react";
import {
    Inbox,
    FileCheck,
    Send,
    Calendar,
    HardHat,
    Hourglass,
    CheckCircle,
    XCircle,
    CreditCard,
    PartyPopper,
    AlertCircle,
    Activity,
    FileText,
    Info,
} from "lucide-react";

export default function CreditStatusDisplay({
    credit,
    transaction,
    showSurvey = true,
}) {

    const statusMap = {
        pengajuan_masuk: {
            label: "Aplikasi Diterima",
            description:
                "Aplikasi kredit Anda telah kami terima dan sedang diproses.",
            color: "blue",
            icon: Inbox,
        },
        verifikasi_dokumen: {
            label: "Verifikasi Dokumen",
            description:
                "Tim kami sedang memverifikasi dokumen yang Anda kirimkan.",
            color: "yellow",
            icon: FileCheck,
        },
        dikirim_ke_leasing: {
            label: "Dikirim ke Leasing",
            description:
                "Aplikasi Anda telah dikirim ke perusahaan leasing untuk diproses.",
            color: "blue",
            icon: Send,
        },
        survey_dijadwalkan: {
            label: "Survey Dijadwalkan",
            description: "Jadwal survey atas jaminan Anda telah dikonfirmasi.",
            color: "yellow",
            icon: Calendar,
        },
        survey_berjalan: {
            label: "Survey Sedang Berlangsung",
            description:
                "Proses survey sedang berlangsung. Mohon koordinasikan dengan surveyor.",
            color: "yellow",
            icon: HardHat,
        },
        menunggu_keputusan_leasing: {
            label: "Menunggu Keputusan",
            description:
                "Survey telah selesai. Kami menunggu keputusan dari pihak leasing.",
            color: "blue",
            icon: Hourglass,
        },
        disetujui: {
            label: "Disetujui",
            description:
                "Selamat! Kredit Anda telah disetujui. Silakan hubungi kami untuk melanjutkan.",
            color: "green",
            icon: CheckCircle,
        },
        ditolak: {
            label: "Ditolak",
            description: "Maaf, pengajuan kredit Anda telah ditolak.",
            color: "red",
            icon: XCircle,
        },
        dp_dibayar: {
            label: "DP Diterima",
            description:
                "Kami telah menerima pembayaran DP. Proses penyelesaian sedang berjalan.",
            color: "green",
            icon: CreditCard,
        },
        selesai: {
            label: "Selesai",
            description:
                "Proses kredit Anda telah selesai. Terima kasih telah memilih kami!",
            color: "green",
            icon: PartyPopper,
        },
        waiting_credit_approval: {
            label: "Menunggu Persetujuan",
            description: "Pesanan Anda sedang dalam antrian verifikasi kredit.",
            color: "blue",
            icon: Hourglass,
        },
    };

    const getStatusInfo = (status) => {
        return (
            statusMap[status] || {
                label: "Tidak Diketahui",
                description: `Status tidak dikenali: ${status}`,
                color: "gray",
                icon: AlertCircle,
            }
        );
    };

    const getColorClass = (color) => {
        const colorMap = {
            blue: "border-blue-400 bg-blue-50",
            yellow: "border-yellow-400 bg-yellow-50",
            green: "border-green-400 bg-green-50",
            red: "border-red-400 bg-red-50",
            gray: "border-gray-400 bg-gray-50",
        };
        return colorMap[color] || colorMap.gray;
    };

    if (!credit) return <div className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">DATA PENGAJUAN TIDAK TERSEDIA</div>;

    const currentStatus = credit?.status || credit?.credit_status || 'unknown';
    const statusInfo = getStatusInfo(currentStatus);

    // Dynamic data extraction from surveySchedules if available
    const latestSurvey = credit?.surveySchedules && credit?.surveySchedules.length > 0 
        ? [...credit.surveySchedules].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        : null;

    const surveyDate = latestSurvey?.scheduled_date || credit?.survey_scheduled_date;
    const surveyTime = latestSurvey?.scheduled_time || credit?.survey_scheduled_time;
    const surveyorName = latestSurvey?.surveyor_name || credit?.surveyor_name;
    const surveyorPhone = latestSurvey?.surveyor_phone || credit?.surveyor_phone;
    const surveyNotes = latestSurvey?.notes || credit?.survey_notes;

    const dpAmount = credit?.dp_amount || credit?.down_payment || 0;
    const motorPrice =
        transaction?.motor?.price ||
        transaction?.total_price ||
        transaction?.motor_price ||
        credit?.transaction?.motor_price ||
        0;
    const creditAmount = motorPrice - dpAmount;


    return (
        <div className="space-y-6">
            {/* Current Status Card */}
            <div
                className={`border-l-4 rounded-lg p-6 ${getColorClass(statusInfo.color)}`}
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white bg-opacity-50 rounded-xl">
                        <statusInfo.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {statusInfo.label}
                        </h3>
                        <p className="text-gray-600">
                            {statusInfo.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Credit Amount */}
                <div className="bg-white border rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Jumlah Kredit</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                        }).format(
                            creditAmount > 0
                                ? creditAmount
                                : motorPrice > 0
                                ? motorPrice
                                : 0,
                        )}
                    </p>


                </div>

                {/* Down Payment */}
                <div className="bg-white border rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Uang Muka (DP)</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                        }).format(dpAmount)}
                    </p>
                </div>

                {/* Tenor */}
                <div className="bg-white border rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Tenor Cicilan</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {credit.tenor} bulan
                    </p>
                </div>

                {/* Monthly Installment */}
                <div className="bg-white border rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Cicilan per Bulan</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                        }).format(credit.monthly_installment || 0)}
                    </p>
                </div>

                {/* Approved Amount */}
                {credit.approved_amount && (
                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-gray-600 text-sm">
                            Jumlah Disetujui
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(credit.approved_amount)}
                        </p>
                    </div>
                )}

                {/* Interest Rate */}
                {credit.interest_rate && (
                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-gray-600 text-sm">Bunga per Tahun</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {(credit.interest_rate * 100).toFixed(2)}%
                        </p>
                    </div>
                )}
            </div>
            {showSurvey && surveyDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Jadwal Survey
                    </h4>
                    <div className="space-y-2 text-gray-700">
                        <p>
                            <strong>Tanggal:</strong>{" "}
                            {new Date(
                                surveyDate,
                            ).toLocaleDateString("id-ID", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                        <p>
                            <strong>Waktu:</strong>{" "}
                            {surveyTime}
                        </p>
                        {showSurvey && surveyorName && (
                            <>
                                <p>
                                    <strong>Nama Surveyor:</strong>{" "}
                                    {surveyorName}
                                </p>
                                <p>
                                    <strong>No. Telepon:</strong>{" "}
                                    {surveyorPhone}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showSurvey && surveyNotes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Catatan Survey
                    </h4>
                    <p className="text-gray-700">{surveyNotes}</p>
                </div>
            )}

            {(credit.rejection_reason || credit.verification_notes) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Alasan Penolakan
                    </h4>
                    <p className="text-red-700">{credit.rejection_reason || credit.verification_notes}</p>
                </div>
            )}



            {/* Help Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" /> Butuh Bantuan?
                </h4>
                <p className="text-amber-800 text-sm">
                    Jika Anda memiliki pertanyaan tentang status kredit Anda,
                    silakan hubungi tim customer service kami melalui chat,
                    email, atau telepon.
                </p>
            </div>
        </div>
    );
}
