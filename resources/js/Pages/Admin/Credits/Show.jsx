import React, { useState, useEffect } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
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
    cilTrash,
    cilBan,
} from "@coreui/icons";
import { CheckCircle, XCircle, Eye } from "lucide-react";

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
        pengajuan_masuk: { label: "Pengajuan Masuk", color: "info" },
        menunggu_persetujuan: { label: "Menunggu Persetujuan", color: "info" },
        verifikasi_dokumen: { label: "Verifikasi Dokumen", color: "warning" },
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
        dibatalkan: { label: "Dibatalkan", color: "secondary" },
    };

    const currentStatus = statuses[credit.status] || {};

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

        // Auto-fill if user already selected leasing during order
        useEffect(() => {
            if (activeModal === "sendLeasing") {
                if (credit.leasing_provider_id) {
                    setData("leasing_provider_id", credit.leasing_provider_id);
                }
            }
        }, [activeModal]);

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
                        {/* Info if user already selected leasing */}
                        {credit.leasing_provider_id && (
                            <CAlert color="info" className="mb-4">
                                <strong>
                                    Penyedia Leasing Dipilih Pengguna:
                                </strong>{" "}
                                {credit.leasingProvider?.name}
                                <div className="small mt-2">
                                    Anda dapat mengubah pilihan jika diperlukan
                                </div>
                            </CAlert>
                        )}
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
                                placeholder="Masukkan nomor referensi (opsional)"
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
            approved_amount:
                credit.transaction?.credit_amount ||
                credit.transaction?.motor?.price - credit.dp_amount ||
                "",
            interest_rate: "2.5",
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

    function CompleteCreditModal() {
        const { data, setData, post, processing } = useForm({
            internal_notes: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.credits.complete", credit.id), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
            });
        };

        return (
            <CModal
                visible={activeModal === "completeCredit"}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Selesaikan Proses Kredit</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormLabel>Catatan Internal (Opsional)</CFormLabel>
                            <CFormTextarea
                                value={data.internal_notes}
                                onChange={(e) =>
                                    setData("internal_notes", e.target.value)
                                }
                                placeholder="Catat informasi penting tentang proses kredit ini..."
                                rows={4}
                            />
                        </div>
                        <CAlert color="info">
                            <strong>Perhatian:</strong> Menyelesaikan proses
                            kredit berarti customer dapat mulai mengambil motor
                            dan cicilan akan dimulai sesuai jadwal.
                        </CAlert>
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
                            Selesaikan
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        );
    }

    // Create a function to handle document reject modals dynamically
    function DocumentRejectModal({ documentId }) {
        const { data, setData, post, processing } = useForm({
            rejection_reason: "",
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            post(route("admin.documents.reject", documentId), {
                onFinish: () => {
                    setIsLoading(false);
                    setActiveModal(null);
                },
                onSuccess: () => {
                    Swal.fire("Berhasil!", "Dokumen telah ditolak.", "success");
                    window.location.reload();
                },
                onError: () => {
                    Swal.fire("Error", "Gagal menolak dokumen", "error");
                },
            });
        };

        return (
            <CModal
                visible={activeModal === `rejectDoc-${documentId}`}
                onClose={() => setActiveModal(null)}
            >
                <CModalHeader onClose={() => setActiveModal(null)}>
                    <CModalTitle>Tolak Dokumen</CModalTitle>
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
                                placeholder="Jelaskan alasan penolakan dokumen..."
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

    const handleCancel = () => {
        Swal.fire({
            title: "Batalkan Pengajuan?",
            text: "Status akan diubah menjadi Dibatalkan secara permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Batalkan",
            cancelButtonText: "Tutup",
            confirmButtonColor: "#6c757d",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route("admin.credits.cancel", credit.id));
            }
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: "Hapus Pengajuan?",
            text: "Data pengajuan dan transaksi terkait akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus Sekarang",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.credits.destroy", credit.id), {
                    onSuccess: () => {
                        router.visit(route("admin.credits.index"));
                    },
                });
            }
        });
    };

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
                <div className="d-flex gap-2">
                    {credit.status !== "dibatalkan" &&
                        credit.status !== "selesai" && (
                            <CButton
                                color="secondary"
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center gap-2"
                                onClick={handleCancel}
                            >
                                <CIcon icon={cilBan} size="sm" />
                                Batalkan
                            </CButton>
                        )}
                    <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        className="d-flex align-items-center gap-2"
                        onClick={handleDelete}
                    >
                        <CIcon icon={cilTrash} size="sm" />
                        Hapus
                    </CButton>
                </div>
            </div>

            <CRow className="g-4">
                <CCol xl={8}>
                    {/* Current Status */}
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-transparent border-bottom border-light py-3">
                            <strong className="fs-6">Status Saat Ini</strong>
                        </CCardHeader>
                        <CCardBody className="text-center py-4">
                            <CBadge
                                color={currentStatus.color}
                                className="fs-5"
                            >
                                {currentStatus.label || credit.status}
                            </CBadge>
                        </CCardBody>
                    </CCard>

                    {/* Customer & Motor Info */}
                    <CRow className="mb-4 g-4">
                        <CCol md={6}>
                            <CCard className="h-100 border-0 shadow-sm">
                                <CCardHeader className="bg-transparent border-bottom border-light">
                                    <strong className="fs-6">
                                        Data Pelanggan
                                    </strong>
                                </CCardHeader>
                                <CCardBody className="p-4">
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Nama
                                        </small>
                                        <strong>
                                            {credit.transaction?.name ||
                                                credit.transaction?.user?.name}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Email
                                        </small>
                                        <strong>
                                            {credit.transaction?.user?.email}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            No. HP
                                        </small>
                                        <strong>
                                            {credit.transaction?.phone ||
                                                credit.transaction?.user
                                                    ?.phone ||
                                                "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            NIK
                                        </small>
                                        <strong>
                                            {credit.transaction?.nik ||
                                                credit.transaction?.user?.nik ||
                                                "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Pekerjaan
                                        </small>
                                        <strong>
                                            {credit.transaction?.occupation ||
                                                credit.transaction?.user
                                                    ?.pekerjaan ||
                                                "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Pemasukan Bulanan
                                        </small>
                                        <strong>
                                            {credit.transaction?.monthly_income
                                                ? new Intl.NumberFormat(
                                                      "id-ID",
                                                      {
                                                          style: "currency",
                                                          currency: "IDR",
                                                      },
                                                  ).format(
                                                      credit.transaction
                                                          .monthly_income,
                                                  )
                                                : credit.transaction?.user
                                                        ?.pendapatan_bulanan
                                                  ? new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        },
                                                    ).format(
                                                        credit.transaction.user
                                                            .pendapatan_bulanan,
                                                    )
                                                  : "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Lama Bekerja
                                        </small>
                                        <strong>
                                            {credit.transaction
                                                ?.employment_duration || "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-0">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Alamat
                                        </small>
                                        <strong>
                                            {credit.transaction?.address ||
                                                credit.transaction?.user
                                                    ?.alamat ||
                                                "-"}
                                        </strong>
                                    </p>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={6}>
                            <CCard className="h-100 border-0 shadow-sm">
                                <CCardHeader className="bg-transparent border-bottom border-light">
                                    <strong className="d-flex align-items-center gap-2 fs-6">
                                        <CIcon icon={cilBike} size="sm" />
                                        Data Motor
                                    </strong>
                                </CCardHeader>
                                <CCardBody className="p-4">
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Motor
                                        </small>
                                        <strong>
                                            {credit.transaction?.motor?.name}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
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
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Jumlah Kredit
                                        </small>
                                        <strong>
                                            {formatCurrency(
                                                (credit.transaction?.motor
                                                    ?.price || 0) -
                                                    (credit.dp_amount || 0),
                                            )}
                                        </strong>
                                    </p>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>

                    {/* Credit Details */}
                    <CRow className="mb-4 g-4">
                        <CCol md={6}>
                            <CCard className="h-100 border-0 shadow-sm">
                                <CCardHeader className="bg-transparent border-bottom border-light">
                                    <strong className="d-flex align-items-center gap-2 fs-6">
                                        <CIcon icon={cilMoney} size="sm" />
                                        Detail Kredit
                                    </strong>
                                </CCardHeader>
                                <CCardBody className="p-4">
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Uang Muka
                                        </small>
                                        <strong>
                                            {formatCurrency(credit.dp_amount)}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Tenor
                                        </small>
                                        <strong>{credit.tenor} bulan</strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Cicilan Bulanan
                                        </small>
                                        <strong>
                                            {formatCurrency(
                                                credit.monthly_installment,
                                            )}
                                        </strong>
                                    </p>
                                    <p className="mb-0">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
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
                            <CCard className="h-100 border-0 shadow-sm">
                                <CCardHeader className="bg-transparent border-bottom border-light">
                                    <strong className="fs-6">
                                        Info Leasing
                                    </strong>
                                </CCardHeader>
                                <CCardBody className="p-4">
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Penyedia
                                        </small>
                                        <strong>
                                            {credit.leasing_provider?.name ||
                                                "Belum ditentukan"}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            No. Referensi
                                        </small>
                                        <strong>
                                            {credit.reference_number || "-"}
                                        </strong>
                                    </p>
                                    <p className="mb-3">
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
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
                                        <small
                                            className="text-body-secondary d-block fw-500 text-uppercase"
                                            style={{
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
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

                    {/* Document Status Alert */}
                    {credit.documents &&
                        credit.documents.length > 0 &&
                        (() => {
                            const pendingCount = credit.documents.filter(
                                (d) => d.approval_status === "pending",
                            ).length;
                            const approvedCount = credit.documents.filter(
                                (d) => d.approval_status === "approved",
                            ).length;
                            const rejectedCount = credit.documents.filter(
                                (d) => d.approval_status === "rejected",
                            ).length;

                            return (
                                <CAlert
                                    color={
                                        pendingCount > 0 ? "warning" : "success"
                                    }
                                    className="mb-4 border-0"
                                >
                                    <strong className="mb-2 d-block">
                                        Status Dokumen
                                    </strong>
                                    <div className="small mb-2">
                                        <span className="badge bg-success me-2">
                                            {approvedCount} Disetujui
                                        </span>
                                        <span className="badge bg-danger me-2">
                                            {rejectedCount} Ditolak
                                        </span>
                                        <span className="badge bg-warning">
                                            {pendingCount} Menunggu
                                        </span>
                                    </div>
                                    {pendingCount > 0 && (
                                        <div className="small mt-2">
                                            ⚠️ Semua dokumen harus disetujui
                                            atau ditolak sebelum melanjutkan
                                            verifikasi.
                                        </div>
                                    )}
                                </CAlert>
                            );
                        })()}

                    {/* Documents Section */}
                    {credit.documents && credit.documents.length > 0 && (
                        <CCard className="mb-4 border-0 shadow-sm">
                            <CCardHeader className="bg-transparent border-bottom border-light py-3">
                                <strong className="d-flex align-items-center gap-2 fs-6">
                                    <CIcon icon={cilNotes} size="sm" />
                                    Dokumen Pendukung ({credit.documents.length}
                                    )
                                </strong>
                            </CCardHeader>
                            <CCardBody className="p-0">
                                <div className="table-responsive">
                                    <table
                                        className="table table-sm table-hover mb-0"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        <thead className="table-light border-top border-bottom">
                                            <tr>
                                                <th className="ps-4 pe-3">
                                                    Tipe Dokumen
                                                </th>
                                                <th className="px-3">
                                                    Nama File
                                                </th>
                                                <th className="px-3">Status</th>
                                                <th className="ps-3 pe-4 text-end">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {credit.documents.map((doc) => (
                                                <tr
                                                    key={doc.id}
                                                    style={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <td className="ps-4 pe-3">
                                                        <small>
                                                            {doc.document_type}
                                                        </small>
                                                    </td>
                                                    <td className="px-3">
                                                        <a
                                                            href={`/storage/${doc.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-decoration-none fw-500"
                                                        >
                                                            {doc.original_name}
                                                        </a>
                                                    </td>
                                                    <td className="px-3">
                                                        <CBadge
                                                            color={
                                                                doc.approval_status ===
                                                                "approved"
                                                                    ? "success"
                                                                    : doc.approval_status ===
                                                                        "rejected"
                                                                      ? "danger"
                                                                      : "warning"
                                                            }
                                                        >
                                                            {doc.approval_status ===
                                                            "approved"
                                                                ? "Disetujui"
                                                                : doc.approval_status ===
                                                                    "rejected"
                                                                  ? "Ditolak"
                                                                  : "Menunggu"}
                                                        </CBadge>
                                                    </td>
                                                    <td className="ps-3 pe-4 text-end">
                                                        <div className="d-flex gap-2 justify-content-end">
                                                            {doc.approval_status ===
                                                                "pending" && (
                                                                <>
                                                                    <CButton
                                                                        color="success"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            Swal.fire(
                                                                                {
                                                                                    title: "Setujui Dokumen?",
                                                                                    text: doc.original_name,
                                                                                    icon: "question",
                                                                                    showCancelButton: true,
                                                                                    confirmButtonText:
                                                                                        "Setujui",
                                                                                    cancelButtonText:
                                                                                        "Batal",
                                                                                },
                                                                            ).then(
                                                                                (
                                                                                    result,
                                                                                ) => {
                                                                                    if (
                                                                                        result.isConfirmed
                                                                                    ) {
                                                                                        router.post(
                                                                                            route(
                                                                                                "admin.documents.approve",
                                                                                                doc.id,
                                                                                            ),
                                                                                            {},
                                                                                            {
                                                                                                onSuccess:
                                                                                                    () => {
                                                                                                        Swal.fire(
                                                                                                            "Berhasil",
                                                                                                            "Dokumen disetujui",
                                                                                                            "success",
                                                                                                        );
                                                                                                        window.location.reload();
                                                                                                    },
                                                                                                onError:
                                                                                                    () => {
                                                                                                        Swal.fire(
                                                                                                            "Gagal",
                                                                                                            "Error approve dokumen",
                                                                                                            "error",
                                                                                                        );
                                                                                                    },
                                                                                            },
                                                                                        );
                                                                                    }
                                                                                },
                                                                            );
                                                                        }}
                                                                        className="d-flex align-items-center gap-2"
                                                                        title="Setujui Dokumen"
                                                                    >
                                                                        <CheckCircle
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        Setujui
                                                                    </CButton>
                                                                    <CButton
                                                                        color="danger"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setActiveModal(
                                                                                `rejectDoc-${doc.id}`,
                                                                            );
                                                                        }}
                                                                        className="d-flex align-items-center gap-2"
                                                                        title="Tolak Dokumen"
                                                                    >
                                                                        <XCircle
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        Tolak
                                                                    </CButton>
                                                                </>
                                                            )}
                                                            <CButton
                                                                color="info"
                                                                size="sm"
                                                                as="a"
                                                                href={`/storage/${doc.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="d-flex align-items-center gap-2"
                                                                title="Download/Lihat Dokumen"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />
                                                                Lihat
                                                            </CButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CCardBody>
                        </CCard>
                    )}

                    {/* Survey Information */}
                    {(credit.survey_scheduled_date || credit.survey_notes) && (
                        <CCard className="mb-4 border-0 shadow-sm">
                            <CCardHeader className="bg-transparent border-bottom border-light py-3">
                                <strong className="d-flex align-items-center gap-2 fs-6">
                                    <CIcon icon={cilCalendar} size="sm" />
                                    Info Survey
                                </strong>
                            </CCardHeader>
                            <CCardBody className="p-4">
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
                                                {credit.survey_schedules
                                                    ?.length > 0 &&
                                                    credit.survey_schedules[
                                                        credit.survey_schedules
                                                            .length - 1
                                                    ].scheduled_time &&
                                                    ` jam ${credit.survey_schedules[credit.survey_schedules.length - 1].scheduled_time.slice(0, 5)}`}
                                            </strong>
                                        </p>
                                        <p className="mb-2">
                                            <small className="text-body-secondary d-block">
                                                Surveyor
                                            </small>
                                            <strong>
                                                {credit.survey_schedules
                                                    ?.length > 0
                                                    ? `${credit.survey_schedules[credit.survey_schedules.length - 1].surveyor_name} (${credit.survey_schedules[credit.survey_schedules.length - 1].surveyor_phone})`
                                                    : "-"}
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
                    <CCard className="border-0 shadow-sm">
                        <CCardHeader className="bg-transparent border-bottom border-light py-3">
                            <strong className="d-flex align-items-center gap-2 fs-6">
                                <CIcon icon={cilNotes} size="sm" />
                                Riwayat Perubahan
                            </strong>
                        </CCardHeader>
                        <CCardBody className="p-4">
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
                                                    {statuses[item.status]
                                                        ?.label || item.status}
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
                        <CCard
                            className="sticky-top border-0 shadow-sm"
                            style={{ top: "20px" }}
                        >
                            <CCardHeader className="bg-transparent border-bottom border-light py-3">
                                <strong className="fs-6">Aksi Tersedia</strong>
                            </CCardHeader>
                            <CCardBody className="d-flex flex-column gap-3 p-3">
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
                                            handleClick = () =>
                                                setActiveModal(
                                                    "completeCredit",
                                                );
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
                            <strong>Status:</strong> {credit.status} | Tidak ada
                            aksi tersedia
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
            <CompleteCreditModal />
            {/* Document Reject Modals */}
            {credit.documents &&
                credit.documents.map((doc) => (
                    <DocumentRejectModal key={doc.id} documentId={doc.id} />
                ))}
        </AdminLayout>
    );
}
