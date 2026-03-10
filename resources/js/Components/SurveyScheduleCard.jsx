import React, { useState } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CBadge,
    CButton,
    CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilCalendar,
    cilClock,
    cilLocationPin,
    cilUser,
    cilPhone,
    cilChevronDown,
    cilChevronUp,
} from "@coreui/icons";

export default function SurveyScheduleCard({
    surveySchedule,
    onReschedule,
    onConfirm,
    onCancel,
}) {
    const [expandHistory, setExpandHistory] = useState(false);

    if (!surveySchedule) {
        return null;
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "warning", label: "⏳ Pending" },
            confirmed: { color: "info", label: "✅ Confirmed" },
            completed: { color: "success", label: "✓ Completed" },
            cancelled: { color: "danger", label: "✗ Cancelled" },
        };
        return statusConfig[status] || { color: "secondary", label: status };
    };

    const statusConfig = getStatusBadge(surveySchedule.status);
    const surveyDate = new Date(surveySchedule.scheduled_date);
    const formattedDate = surveyDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <CCard className="mb-4 shadow-sm">
            <CCardHeader className="bg-light border-bottom d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center gap-3">
                    <strong className="h6 mb-0">📅 Jadwal Survey</strong>
                    <CBadge
                        color={statusConfig.color}
                        shape="rounded-pill"
                        className="px-3"
                    >
                        {statusConfig.label}
                    </CBadge>
                </div>
                {surveySchedule.status === "pending" && (
                    <div className="d-flex gap-2">
                        {onReschedule && (
                            <CButton
                                size="sm"
                                color="warning"
                                variant="outline"
                                onClick={onReschedule}
                                className="d-flex align-items-center gap-2"
                            >
                                🔄 Ubah Jadwal
                            </CButton>
                        )}
                        {onCancel && (
                            <CButton
                                size="sm"
                                color="danger"
                                variant="outline"
                                onClick={onCancel}
                                className="d-flex align-items-center gap-2"
                            >
                                ✕ Batalkan
                            </CButton>
                        )}
                    </div>
                )}
            </CCardHeader>

            <CCardBody className="p-4">
                <div className="row g-4">
                    {/* Tanggal & Waktu */}
                    <div className="col-md-6">
                        <div className="d-flex gap-3">
                            <div className="text-primary">
                                <CIcon icon={cilCalendar} size="xl" />
                            </div>
                            <div>
                                <small className="text-muted d-block">Tanggal</small>
                                <strong className="h6">{formattedDate}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="d-flex gap-3">
                            <div className="text-primary">
                                <CIcon icon={cilClock} size="xl" />
                            </div>
                            <div>
                                <small className="text-muted d-block">Waktu</small>
                                <strong className="h6">
                                    {surveySchedule.scheduled_time}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Lokasi */}
                    <div className="col-12">
                        <div className="d-flex gap-3">
                            <div className="text-primary">
                                <CIcon icon={cilLocationPin} size="xl" />
                            </div>
                            <div className="w-100">
                                <small className="text-muted d-block">Lokasi</small>
                                <strong className="h6">
                                    {surveySchedule.location}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Surveyor Info */}
                    <div className="col-md-6">
                        <div className="d-flex gap-3">
                            <div className="text-primary">
                                <CIcon icon={cilUser} size="xl" />
                            </div>
                            <div>
                                <small className="text-muted d-block">Surveyor</small>
                                <strong className="h6">
                                    {surveySchedule.surveyor_name}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="d-flex gap-3">
                            <div className="text-primary">
                                <CIcon icon={cilPhone} size="xl" />
                            </div>
                            <div>
                                <small className="text-muted d-block">
                                    No. WhatsApp
                                </small>
                                <strong className="h6">
                                    <a
                                        href={`https://wa.me/${surveySchedule.surveyor_phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                    >
                                        {surveySchedule.surveyor_phone}
                                    </a>
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Catatan */}
                    {surveySchedule.notes && (
                        <div className="col-12">
                            <div className="p-3 bg-light rounded-3 border">
                                <strong className="d-block mb-2">
                                    📝 Catatan Survey:
                                </strong>
                                <div
                                    className="text-body-secondary small prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: surveySchedule.notes,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    {surveySchedule.status === "pending" && (
                        <div className="col-12">
                            <div className="alert alert-info mb-0" role="alert">
                                <strong>💡 Tips:</strong> Customer akan menerima
                                notifikasi WhatsApp berisi detail jadwal survey ini.
                                Pastikan semua informasi sudah benar sebelum
                                disimpan.
                            </div>
                        </div>
                    )}
                </div>
            </CCardBody>
        </CCard>
    );
}
