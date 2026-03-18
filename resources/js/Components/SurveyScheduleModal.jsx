import React, { useState } from "react";
import { router } from "@inertiajs/react";
import RichTextEditor from "@/Components/RichTextEditor";
import {
    CButton,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CAlert,
    CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSave, cilX } from "@coreui/icons";
import toast from "react-hot-toast";

export default function SurveyScheduleModal({
    visible,
    onClose,
    creditDetailId,
    surveySchedule = null,
    isReschedule = false,
}) {
    const [formData, setFormData] = useState({
        scheduled_date: surveySchedule?.scheduled_date || "",
        scheduled_time: surveySchedule?.scheduled_time || "",
        location: surveySchedule?.location || "",
        surveyor_name: surveySchedule?.surveyor_name || "",
        surveyor_phone: surveySchedule?.surveyor_phone || "",
        notes: surveySchedule?.notes || "",
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleNotesChange = (html) => {
        setFormData((prev) => ({
            ...prev,
            notes: html,
        }));
        if (errors.notes) {
            setErrors((prev) => ({
                ...prev,
                notes: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.scheduled_date) {
            newErrors.scheduled_date = "Tanggal survey harus diisi";
        }

        if (!formData.scheduled_time) {
            newErrors.scheduled_time = "Waktu survey harus diisi";
        }

        if (!formData.location || formData.location.trim().length < 5) {
            newErrors.location = "Lokasi harus diisi (minimal 5 karakter)";
        }

        if (
            !formData.surveyor_name ||
            formData.surveyor_name.trim().length < 3
        ) {
            newErrors.surveyor_name =
                "Nama surveyor harus diisi (minimal 3 karakter)";
        }

        if (
            !formData.surveyor_phone ||
            formData.surveyor_phone.trim().length < 10
        ) {
            newErrors.surveyor_phone =
                "Nomor surveyor harus diisi (minimal 10 digit)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Mohon isi semua field yang diperlukan");
            return;
        }

        setProcessing(true);

        router.post(
            route("credit-details.schedule-survey", creditDetailId),
            formData,
            {
                onSuccess: () => {
                    toast.success(
                        isReschedule
                            ? "Jadwal survey berhasil diubah"
                            : "Jadwal survey berhasil dibuat",
                    );
                    resetForm();
                    onClose();
                },
                onError: (errs) => {
                    toast.error("Gagal menyimpan jadwal survey");
                    setErrors(errs);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const resetForm = () => {
        setFormData({
            scheduled_date: "",
            scheduled_time: "",
            location: "",
            surveyor_name: "",
            surveyor_phone: "",
            notes: "",
        });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <CModal
            visible={visible}
            onClose={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
        >
            <CModalHeader closeButton className="bg-light border-bottom">
                <strong className="h5 mb-0">
                    {isReschedule
                        ? "🔄 Ubah Jadwal Survey"
                        : "Jadwalkan Survey Kredit"}
                </strong>
            </CModalHeader>
            <CModalBody className="p-4">
                {/* Info Alert */}
                <CAlert color="info" className="mb-4">
                    <small>
                        <strong>Perhatian:</strong> Pastikan data surveyor dan
                        lokasi sudah akurat. Notifikasi WhatsApp akan dikirim
                        otomatis ke customer setelah survey dijadwalkan.
                    </small>
                </CAlert>

                <form onSubmit={handleSubmit}>
                    {/* Tanggal Survey */}
                    <div className="mb-3">
                        <CFormLabel
                            htmlFor="scheduled_date"
                            className="fw-bold"
                        >
                            Tanggal Survey{" "}
                            <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                            id="scheduled_date"
                            type="date"
                            name="scheduled_date"
                            value={formData.scheduled_date}
                            onChange={handleChange}
                            invalid={!!errors.scheduled_date}
                            feedbackInvalid={errors.scheduled_date}
                            disabled={processing}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <small className="text-muted d-block mt-2">
                            Pilih tanggal pelaksanaan survey (minimum hari ini)
                        </small>
                    </div>

                    {/* Waktu Survey */}
                    <div className="mb-3">
                        <CFormLabel
                            htmlFor="scheduled_time"
                            className="fw-bold"
                        >
                            Waktu Survey (HH:MM){" "}
                            <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                            id="scheduled_time"
                            type="time"
                            name="scheduled_time"
                            value={formData.scheduled_time}
                            onChange={handleChange}
                            invalid={!!errors.scheduled_time}
                            feedbackInvalid={errors.scheduled_time}
                            disabled={processing}
                        />
                        <small className="text-muted d-block mt-2">
                            Format: 14:30 (contoh: jam 14 siang, 30 menit)
                        </small>
                    </div>

                    {/* Lokasi Survey */}
                    <div className="mb-3">
                        <CFormLabel htmlFor="location" className="fw-bold">
                            Lokasi Survey <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormTextarea
                            id="location"
                            name="location"
                            placeholder="Contoh: Jl. Ahmad Yani No. 123, Jakarta Selatan"
                            value={formData.location}
                            onChange={handleChange}
                            invalid={!!errors.location}
                            feedbackInvalid={errors.location}
                            disabled={processing}
                            rows={2}
                        />
                        <small className="text-muted d-block mt-2">
                            Alamat lengkap lokasi survey (minimal 5 karakter)
                        </small>
                    </div>

                    {/* Nama Surveyor */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <CFormLabel
                                htmlFor="surveyor_name"
                                className="fw-bold"
                            >
                                Nama Surveyor{" "}
                                <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                                id="surveyor_name"
                                type="text"
                                name="surveyor_name"
                                placeholder="Contoh: Budi Santoso"
                                value={formData.surveyor_name}
                                onChange={handleChange}
                                invalid={!!errors.surveyor_name}
                                feedbackInvalid={errors.surveyor_name}
                                disabled={processing}
                            />
                            <small className="text-muted d-block mt-2">
                                Nama surveyor dari bank/leasing partner
                            </small>
                        </div>

                        {/* Nomor Surveyor */}
                        <div className="col-md-6">
                            <CFormLabel
                                htmlFor="surveyor_phone"
                                className="fw-bold"
                            >
                                No. WhatsApp Surveyor{" "}
                                <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                                id="surveyor_phone"
                                type="tel"
                                name="surveyor_phone"
                                placeholder="Contoh: 081234567890"
                                value={formData.surveyor_phone}
                                onChange={handleChange}
                                invalid={!!errors.surveyor_phone}
                                feedbackInvalid={errors.surveyor_phone}
                                disabled={processing}
                            />
                            <small className="text-muted d-block mt-2">
                                Nomor WhatsApp surveyor (minimal 10 digit)
                            </small>
                        </div>
                    </div>

                    {/* Catatan Survey */}
                    <div className="mb-3">
                        <CFormLabel htmlFor="notes" className="fw-bold">
                            Catatan Survey (Opsional)
                        </CFormLabel>
                        <RichTextEditor
                            value={formData.notes}
                            onChange={handleNotesChange}
                            placeholder="Catatan hasil survey, kondisi aset, kelayakan kredit..."
                            error={errors.notes}
                            minHeight="200px"
                            disabled={processing}
                        />
                        <small className="text-muted d-block mt-2">
                            Gunakan editor untuk catatan detail tentang hasil
                            survey
                        </small>
                    </div>
                </form>
            </CModalBody>
            <CModalFooter className="bg-light border-top">
                <CButton
                    color="secondary"
                    onClick={handleClose}
                    disabled={processing}
                >
                    <CIcon icon={cilX} className="me-2" />
                    Batal
                </CButton>
                <CButton
                    color="primary"
                    onClick={handleSubmit}
                    disabled={processing}
                >
                    {processing && (
                        <CSpinner
                            component="span"
                            size="sm"
                            className="me-2"
                            aria-hidden="true"
                        />
                    )}
                    <CIcon icon={cilSave} className="me-2" />
                    {isReschedule ? "Ubah Jadwal" : "Buat Jadwal"}
                </CButton>
            </CModalFooter>
        </CModal>
    );
}
