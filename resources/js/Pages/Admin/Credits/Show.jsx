import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CFormTextarea,
    CBadge,
    CAlert,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilCheck,
    cilX,
    cilCheckAlt,
    cilNotes,
    cilCalendar,
    cilMoney,
    cilBike,
} from "@coreui/icons";

export default function Show({
    credit,
    availableTransitions,
    timeline,
    leasingProviders,
}) {
    const [activeModal, setActiveModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    const statuses = {
        pengajuan_masuk: {
            label: "Pengajuan Masuk",
            color: "info",
        },
        verifikasi_dokumen: {
            label: "Verifikasi Dokumen",
            color: "warning",
        },
        dikirim_ke_leasing: {
            label: "Dikirim ke Leasing",
            color: "info",
        },
        survey_dijadwalkan: {
            label: "Survey Dijadwalkan",
            color: "warning",
        },
        survey_berjalan: {
            label: "Survey Berjalan",
            color: "warning",
        },
        menunggu_keputusan_leasing: {
            label: "Menunggu Keputusan",
            color: "info",
        },
        disetujui: { label: "Disetujui", color: "success" },
        ditolak: { label: "Ditolak", color: "danger" },
        dp_dibayar: { label: "DP Dibayar", color: "success" },
        selesai: { label: "Selesai", color: "success" },
    };

    const currentStatus = statuses[credit.credit_status] || {};

    // Modal Components
    function VerifyDocumentsModal() {
        const { data, setData, post, processing } = useForm({
            internal_notes: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.verify-documents", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "verify"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Verifikasi Dokumen</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Catatan Internal</CFormLabel>
                            <CFormTextarea
                                rows="3"
                                value={data.internal_notes}
                                onChange={(e) =>
                                    setData("internal_notes", e.target.value)
                                }
                                placeholder="Masukkan catatan verifikasi dokumen..."
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="primary"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Lanjutkan
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    function RejectModal({ action }) {
        const { data, setData, post, processing } = useForm({
            rejection_reason: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route(action, credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "reject"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Tolak Pengajuan</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Alasan Penolakan</CFormLabel>
                            <CFormTextarea
                                rows="3"
                                value={data.rejection_reason}
                                onChange={(e) =>
                                    setData("rejection_reason", e.target.value)
                                }
                                placeholder="Jelaskan alasan penolakan..."
                                required
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="danger"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Tolak
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    function SendToLeasingModal() {
        const { data, setData, post, processing } = useForm({
            leasing_provider_id: "",
            leasing_application_ref: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.send-to-leasing", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "sendLeasing"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Kirim ke Leasing</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Pilih Penyedia Leasing</CFormLabel>
                            <CFormSelect
                                value={data.leasing_provider_id}
                                onChange={(e) =>
                                    setData(
                                        "leasing_provider_id",
                                        e.target.value,
                                    )
                                }
                                required
                            >
                                <option value="">-- Pilih Leasing --</option>
                                {leasingProviders.map((provider) => (
                                    <option
                                        key={provider.id}
                                        value={provider.id}
                                    >
                                        {provider.name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Nomor Referensi Aplikasi</CFormLabel>
                            <CFormInput
                                type="text"
                                value={data.leasing_application_ref}
                                onChange={(e) =>
                                    setData(
                                        "leasing_application_ref",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan nomor referensi..."
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="primary"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Kirim
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    function ScheduleSurveyModal() {
        const { data, setData, post, processing } = useForm({
            survey_scheduled_date: "",
            survey_scheduled_time: "",
            surveyor_name: "",
            surveyor_phone: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.schedule-survey", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "survey"}
                onClose={() => setActiveModal(null)}
                size="lg"
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Jadwalkan Survey</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <CRow>
                            <CCol md={6} className="mb-3">
                                <CFormLabel>Tanggal</CFormLabel>
                                <CFormInput
                                    type="date"
                                    value={data.survey_scheduled_date}
                                    onChange={(e) =>
                                        setData(
                                            "survey_scheduled_date",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </CCol>
                            <CCol md={6} className="mb-3">
                                <CFormLabel>Jam</CFormLabel>
                                <CFormInput
                                    type="time"
                                    value={data.survey_scheduled_time}
                                    onChange={(e) =>
                                        setData(
                                            "survey_scheduled_time",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md={6} className="mb-3">
                                <CFormLabel>Nama Surveyor</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={data.surveyor_name}
                                    onChange={(e) =>
                                        setData("surveyor_name", e.target.value)
                                    }
                                    required
                                />
                            </CCol>
                            <CCol md={6} className="mb-3">
                                <CFormLabel>No. HP Surveyor</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={data.surveyor_phone}
                                    onChange={(e) =>
                                        setData(
                                            "surveyor_phone",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="primary"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Jadwalkan
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    function CompleteSurveyModal() {
        const { data, setData, post, processing } = useForm({
            survey_notes: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.complete-survey", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "completeSurvey"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Selesaikan Survey</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Catatan Survey</CFormLabel>
                            <CFormTextarea
                                rows="4"
                                value={data.survey_notes}
                                onChange={(e) =>
                                    setData("survey_notes", e.target.value)
                                }
                                placeholder="Masukkan hasil dan catatan survey..."
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="primary"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Selesai
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    function ApproveCreditModal() {
        const { data, setData, post, processing } = useForm({
            approved_amount: credit.transaction?.credit_amount || "",
            interest_rate: "0.015",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.approve", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "approve"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Setujui Kredit</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Jumlah Persetujuan</CFormLabel>
                            <CFormInput
                                type="number"
                                value={data.approved_amount}
                                onChange={(e) =>
                                    setData("approved_amount", e.target.value)
                                }
                                required
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Suku Bunga (%)</CFormLabel>
                            <CFormInput
                                type="number"
                                value={data.interest_rate}
                                onChange={(e) =>
                                    setData("interest_rate", e.target.value)
                                }
                                required
                                step="0.01"
                                min="0"
                                max="100"
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="success"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Setujui
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    function RecordDPModal() {
        const { data, setData, post, processing } = useForm({
            dp_payment_method: "bank_transfer",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.record-dp-payment", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "recordDP"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Catat Pembayaran DP</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Metode Pembayaran</CFormLabel>
                            <CFormSelect
                                value={data.dp_payment_method}
                                onChange={(e) =>
                                    setData("dp_payment_method", e.target.value)
                                }
                                required
                            >
                                <option value="bank_transfer">
                                    Transfer Bank
                                </option>
                                <option value="cash">Tunai</option>
                                <option value="check">Cek</option>
                                <option value="other">Lainnya</option>
                            </CFormSelect>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => setActiveModal(null)}
                        >
                            Batal
                        </CButton>
                        <CButton
                            type="submit"
                            color="success"
                            disabled={processing || isLoading}
                        >
                            {processing || isLoading ? (
                                <CSpinner size="sm" />
                            ) : null}{" "}
                            Catat
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    return (
        <AdminLayout title={`Detail Pengajuan Kredit #${credit.id}`}>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <Link
                    href={route("admin.credits.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <h3 className="mb-0">
                    Transaksi #{credit.transaction_id} - {currentStatus.label}
                </h3>
            </div>

            <CRow>
                <CCol xl={8}>
                    {/* Current Status */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong>Status Saat Ini</strong>
                        </CCardHeader>
                        <CCardBody className="text-center py-4">
                            <CBadge
                                color={currentStatus.color}
                                className="fs-5"
                            >
                                {currentStatus.label || credit.credit_status}
                            </CBadge>
                        </CCardBody>
                    </CCard>

                    {/* Customer & Motor Info */}
                    <CRow className="mb-4">
                        <CCol md={6}>
                            <CCard>
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong>Data Pelanggan</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Nama
                                        </small>
                                        <strong>
                                            {credit.transaction?.user?.name}
                                        </strong>
                                    </p>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Email
                                        </small>
                                        <strong>
                                            {credit.transaction?.user?.email}
                                        </strong>
                                    </p>
                                    <p className="mb-0">
                                        <small className="text-body-secondary d-block">
                                            No. HP
                                        </small>
                                        <strong>
                                            {credit.transaction?.user?.phone ||
                                                "-"}
                                        </strong>
                                    </p>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={6}>
                            <CCard>
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong className="d-flex align-items-center gap-2">
                                        <CIcon icon={cilBike} size="sm" />
                                        Data Motor
                                    </strong>
                                </CCardHeader>
                                <CCardBody>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Motor
                                        </small>
                                        <strong>
                                            {credit.transaction?.motor?.name}
                                        </strong>
                                    </p>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Harga
                                        </small>
                                        <strong>
                                            {formatCurrency(
                                                credit.transaction?.motor
                                                    ?.price,
                                            )}
                                        </strong>
                                    </p>
                                    <p className="mb-0">
                                        <small className="text-body-secondary d-block">
                                            Jumlah Kredit
                                        </small>
                                        <strong>
                                            {formatCurrency(
                                                credit.transaction
                                                    ?.credit_amount,
                                            )}
                                        </strong>
                                    </p>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>

                    {/* Credit Details */}
                    <CRow className="mb-4">
                        <CCol md={6}>
                            <CCard>
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong className="d-flex align-items-center gap-2">
                                        <CIcon icon={cilMoney} size="sm" />
                                        Detail Kredit
                                    </strong>
                                </CCardHeader>
                                <CCardBody>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Uang Muka
                                        </small>
                                        <strong>
                                            {formatCurrency(
                                                credit.down_payment,
                                            )}
                                        </strong>
                                    </p>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Tenor
                                        </small>
                                        <strong>{credit.tenor} bulan</strong>
                                    </p>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Cicilan Bulanan
                                        </small>
                                        <strong>
                                            {formatCurrency(
                                                credit.monthly_installment,
                                            )}
                                        </strong>
                                    </p>
                                    <p className="mb-0">
                                        <small className="text-body-secondary d-block">
                                            Suku Bunga
                                        </small>
                                        <strong>
                                            {(
                                                credit.interest_rate * 100
                                            ).toFixed(2)}
                                            %
                                        </strong>
                                    </p>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={6}>
                            <CCard>
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong>Info Leasing</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Penyedia
                                        </small>
                                        <strong>
                                            {credit.leasingProvider?.name ||
                                                "Belum ditentukan"}
                                        </strong>
                                    </p>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            No. Referensi
                                        </small>
                                        <strong>
                                            {credit.leasing_application_ref ||
                                                "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-2">
                                        <small className="text-body-secondary d-block">
                                            Tangal Keputusan
                                        </small>
                                        <strong>
                                            {credit.leasing_decision_date
                                                ? new Date(
                                                      credit.leasing_decision_date,
                                                  ).toLocaleDateString("id-ID")
                                                : "Menunggu"}
                                        </strong>
                                    </p>
                                    <p className="mb-0">
                                        <small className="text-body-secondary d-block">
                                            DP Dibayar
                                        </small>
                                        <strong>
                                            {credit.dp_paid_date
                                                ? new Date(
                                                      credit.dp_paid_date,
                                                  ).toLocaleDateString("id-ID")
                                                : "Belum dibayar"}
                                        </strong>
                                    </p>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>

                    {/* Survey Information */}
                    {(credit.survey_scheduled_date || credit.survey_notes) && (
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong className="d-flex align-items-center gap-2">
                                    <CIcon icon={cilCalendar} size="sm" />
                                    Info Survey
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                {credit.survey_scheduled_date && (
                                    <>
                                        <p className="mb-2">
                                            <small className="text-body-secondary d-block">
                                                Tanggal Dijadwalkan
                                            </small>
                                            <strong>
                                                {new Date(
                                                    credit.survey_scheduled_date,
                                                ).toLocaleDateString("id-ID")}
                                                {" jam "}
                                                {credit.survey_scheduled_time}
                                            </strong>
                                        </p>
                                        <p className="mb-2">
                                            <small className="text-body-secondary d-block">
                                                Surveyor
                                            </small>
                                            <strong>
                                                {credit.surveyor_name} (
                                                {credit.surveyor_phone})
                                            </strong>
                                        </p>
                                    </>
                                )}
                                {credit.survey_notes && (
                                    <div>
                                        <small className="text-body-secondary d-block mb-1">
                                            Catatan Survey
                                        </small>
                                        <div className="bg-light p-2 rounded small">
                                            {credit.survey_notes}
                                        </div>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    )}

                    {/* Rejection Reason */}
                    {credit.rejection_reason && (
                        <CAlert color="danger" className="mb-4">
                            <strong>Alasan Penolakan:</strong>{" "}
                            {credit.rejection_reason}
                        </CAlert>
                    )}

                    {/* Timeline */}
                    <CCard>
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong className="d-flex align-items-center gap-2">
                                <CIcon icon={cilNotes} size="sm" />
                                Riwayat Perubahan
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            {timeline && timeline.length > 0 ? (
                                <div className="timeline">
                                    {timeline.map((item, index) => (
                                        <div
                                            key={index}
                                            className="d-flex gap-3 mb-3"
                                        >
                                            <div className="timeline-marker mt-1">
                                                <span className="badge bg-secondary rounded-circle">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">
                                                    {item.label}
                                                </h6>
                                                <p className="text-muted small mb-1">
                                                    {new Date(
                                                        item.date,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </p>
                                                {item.notes && (
                                                    <p className="small mb-0">
                                                        {item.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted small mb-0">
                                    Belum ada riwayat
                                </p>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Action Panel */}
                <CCol xl={4}>
                    {availableTransitions &&
                    Object.keys(availableTransitions).length > 0 ? (
                        <CCard className="sticky-top" style={{ top: "20px" }}>
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Aksi Tersedia</strong>
                            </CCardHeader>
                            <CCardBody className="d-flex flex-column gap-2">
                                {Object.entries(availableTransitions).map(
                                    ([key, label]) => {
                                        let handleClick = () => {}; // Default
                                        let buttonColor = "primary";

                                        if (key === "verifikasi_dokumen") {
                                            handleClick = () =>
                                                setActiveModal("verify");
                                        } else if (
                                            key === "dikirim_ke_leasing"
                                        ) {
                                            handleClick = () =>
                                                setActiveModal("sendLeasing");
                                        } else if (
                                            key === "survey_dijadwalkan"
                                        ) {
                                            handleClick = () =>
                                                setActiveModal("survey");
                                        } else if (
                                            key === "menunggu_keputusan_leasing"
                                        ) {
                                            handleClick = () =>
                                                setActiveModal(
                                                    "completeSurvey",
                                                );
                                        } else if (key === "disetujui") {
                                            handleClick = () =>
                                                setActiveModal("approve");
                                            buttonColor = "success";
                                        } else if (key === "ditolak") {
                                            handleClick = () =>
                                                setActiveModal("reject");
                                            buttonColor = "danger";
                                        } else if (key === "dp_dibayar") {
                                            handleClick = () =>
                                                setActiveModal("recordDP");
                                            buttonColor = "success";
                                        } else if (key === "survey_berjalan") {
                                            handleClick = () =>
                                                setActiveModal(
                                                    "completeSurvey",
                                                );
                                        } else if (key === "selesai") {
                                            buttonColor = "success";
                                        }

                                        return (
                                            <CButton
                                                key={key}
                                                color={buttonColor}
                                                onClick={handleClick}
                                                size="sm"
                                                className="w-100"
                                            >
                                                {label}
                                            </CButton>
                                        );
                                    },
                                )}
                            </CCardBody>
                        </CCard>
                    ) : (
                        <CAlert color="info" className="sticky-top">
                            <strong>Status:</strong> {credit.credit_status} |
                            Tidak ada aksi tersedia
                        </CAlert>
                    )}
                </CCol>
            </CRow>

            {/* Modals */}
            <VerifyDocumentsModal />
            <RejectModal action="admin.credits.reject-document" />
            <SendToLeasingModal />
            <ScheduleSurveyModal />
            <CompleteSurveyModal />
            <ApproveCreditModal />
            <RecordDPModal />
        </AdminLayout>
    );
}
