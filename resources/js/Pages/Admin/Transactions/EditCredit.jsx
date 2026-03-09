import React from "react";
import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CBadge,
    CAvatar,
    CCallout,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilSave,
    cilCheckCircle,
    cilXCircle,
    cilFile,
} from "@coreui/icons";

export default function EditCredit({ transaction }) {
    const { credit_detail, motor, user } = transaction;
    const documents = credit_detail?.documents || [];

    const { data, setData, put, processing, errors } = useForm({
        credit_status: credit_detail?.credit_status || "menunggu_persetujuan",
        approved_amount: credit_detail?.approved_amount || "",
        admin_notes: transaction.notes || "",
    });

    const creditStatusOptions = [
        {
            value: "menunggu_persetujuan",
            label: "Menunggu Persetujuan",
            color: "warning",
            desc: "Dokumen sedang ditinjau",
        },
        {
            value: "data_tidak_valid",
            label: "Data Tidak Valid",
            color: "danger",
            desc: "Dokumen perlu diperbaiki",
        },
        {
            value: "dikirim_ke_surveyor",
            label: "Dikirim ke Surveyor",
            color: "info",
            desc: "Menunggu jadwal survey",
        },
        {
            value: "jadwal_survey",
            label: "Jadwal Survey",
            color: "primary",
            desc: "Survey telah dijadwalkan",
        },
        {
            value: "disetujui",
            label: "Disetujui",
            color: "success",
            desc: "Kredit disetujui leasing",
        },
        {
            value: "ditolak",
            label: "Ditolak",
            color: "danger",
            desc: "Kredit ditolak leasing",
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.updateCredit", transaction.id), {
            onSuccess: () => toast.success("Status kredit berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui status"),
        });
    };

    const handleQuickApprove = () => {
        Swal.fire({
            title: "Setujui Kredit?",
            text: "Kredit akan ditandai sebagai DISETUJUI. Installment akan dibuat dan customer akan menerima notifikasi.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Setujui",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route("admin.transactions.updateCredit", transaction.id),
                    {
                        credit_status: "disetujui",
                        approved_amount:
                            data.approved_amount || motor?.price || 0,
                        admin_notes: data.admin_notes,
                    },
                    {
                        onSuccess: () =>
                            toast.success("Kredit berhasil disetujui"),
                        onError: () => toast.error("Gagal menyetujui kredit"),
                    },
                );
            }
        });
    };

    const handleQuickReject = () => {
        Swal.fire({
            title: "Tolak Kredit?",
            text: "Kredit akan ditandai sebagai DITOLAK. Customer akan menerima notifikasi penolakan.",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Tolak",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route("admin.transactions.updateCredit", transaction.id),
                    {
                        credit_status: "ditolak",
                        approved_amount: 0,
                        admin_notes: data.admin_notes,
                    },
                    {
                        onSuccess: () =>
                            toast.success("Kredit berhasil ditolak"),
                        onError: () => toast.error("Gagal menolak kredit"),
                    },
                );
            }
        });
    };

    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    const currentStatus = creditStatusOptions.find(
        (opt) => opt.value === data.credit_status,
    );

    return (
        <AdminLayout title={`Edit Kredit #${transaction.id}`}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.transactions.show", transaction.id)}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <CBadge color="info" shape="rounded-pill" className="px-3 py-2">
                    Mode Edit Kredit
                </CBadge>
            </div>

            <CRow>
                <CCol xl={8}>
                    <form onSubmit={handleSubmit}>
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Status Kredit</strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row g-3 mb-4">
                                    {creditStatusOptions.map((opt) => (
                                        <div
                                            className="col-md-4 col-6"
                                            key={opt.value}
                                        >
                                            <div
                                                role="button"
                                                onClick={() =>
                                                    setData(
                                                        "credit_status",
                                                        opt.value,
                                                    )
                                                }
                                                className={`border rounded-3 p-3 h-100 text-center transition-all ${
                                                    data.credit_status ===
                                                    opt.value
                                                        ? `border-${opt.color} bg-${opt.color}-subtle`
                                                        : "border-body-secondary bg-body-tertiary"
                                                }`}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <CBadge
                                                    color={
                                                        data.credit_status ===
                                                        opt.value
                                                            ? opt.color
                                                            : "secondary"
                                                    }
                                                    shape="rounded-pill"
                                                    className="mb-2"
                                                >
                                                    {opt.label}
                                                </CBadge>
                                                <p
                                                    className="text-body-secondary mb-0"
                                                    style={{ fontSize: 11 }}
                                                >
                                                    {opt.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {data.credit_status === "disetujui" && (
                                    <div className="bg-success-subtle rounded-3 p-3 mb-4">
                                        <CFormLabel className="fw-semibold text-success">
                                            Jumlah Disetujui
                                        </CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.approved_amount}
                                            onChange={(e) =>
                                                setData(
                                                    "approved_amount",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0"
                                        />
                                        <small className="text-body-secondary">
                                            Nominal yang disetujui pihak
                                            leasing/surveyor
                                        </small>
                                    </div>
                                )}

                                <CFormLabel>Catatan Admin</CFormLabel>
                                <CFormTextarea
                                    value={data.admin_notes}
                                    onChange={(e) =>
                                        setData("admin_notes", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Catatan internal proses kredit..."
                                />
                            </CCardBody>
                        </CCard>

                        <CRow className="g-3 mb-4">
                            <CCol md={4}>
                                <CButton
                                    type="button"
                                    color="danger"
                                    variant="outline"
                                    className="w-100 py-2"
                                    onClick={handleQuickReject}
                                >
                                    <CIcon
                                        icon={cilXCircle}
                                        size="sm"
                                        className="me-1"
                                    />
                                    Tolak
                                </CButton>
                            </CCol>
                            <CCol md={4}>
                                <CButton
                                    type="submit"
                                    color="primary"
                                    className="w-100 py-2"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                        <CIcon
                                            icon={cilSave}
                                            size="sm"
                                            className="me-1"
                                        />
                                    )}
                                    Simpan
                                </CButton>
                            </CCol>
                            <CCol md={4}>
                                <CButton
                                    type="button"
                                    color="success"
                                    variant="outline"
                                    className="w-100 py-2"
                                    onClick={handleQuickApprove}
                                >
                                    <CIcon
                                        icon={cilCheckCircle}
                                        size="sm"
                                        className="me-1"
                                    />
                                    Setujui
                                </CButton>
                            </CCol>
                        </CRow>
                    </form>

                    {/* Documents */}
                    <CCard>
                        <CCardHeader className="bg-transparent border-bottom d-flex justify-content-between">
                            <strong>Dokumen Pelanggan</strong>
                            <span className="text-body-secondary small">
                                {documents.length} dokumen
                            </span>
                        </CCardHeader>
                        <CCardBody>
                            {documents.length > 0 ? (
                                <CRow className="g-3">
                                    {documents.map((doc) => (
                                        <CCol sm={6} key={doc.id}>
                                            <div className="border rounded-3 p-3">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <CIcon
                                                        icon={cilFile}
                                                        className="text-primary"
                                                    />
                                                    <div>
                                                        <div className="fw-semibold small">
                                                            {doc.document_type}
                                                        </div>
                                                        <div
                                                            className="text-body-tertiary"
                                                            style={{
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            {new Date(
                                                                doc.created_at,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`/storage/${doc.file_path}`}
                                                    target="_blank"
                                                    className="btn btn-sm btn-outline-primary w-100"
                                                >
                                                    Lihat Dokumen
                                                </a>
                                            </div>
                                        </CCol>
                                    ))}
                                </CRow>
                            ) : (
                                <div className="text-center py-4 text-body-tertiary">
                                    Belum ada dokumen terupload.
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Sidebar */}
                <CCol xl={4}>
                    <div className="sticky-top" style={{ top: "5rem" }}>
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Data Pelanggan</strong>
                            </CCardHeader>
                            <CCardBody className="text-center">
                                <CAvatar
                                    color="primary"
                                    textColor="white"
                                    size="lg"
                                    className="mb-2"
                                >
                                    {(user?.name || "U")[0]}
                                </CAvatar>
                                <h6 className="fw-bold mb-0">
                                    {user?.name || "Unknown"}
                                </h6>
                                <p className="text-body-secondary small mb-3">
                                    {user?.email}
                                </p>
                                <div className="border-top pt-3 text-start">
                                    <div className="mb-2">
                                        <span className="text-body-tertiary small">
                                            Telepon:{" "}
                                        </span>
                                        <span>
                                            {transaction.customer_phone ||
                                                user?.phone_number ||
                                                "-"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-body-tertiary small">
                                            Pekerjaan:{" "}
                                        </span>
                                        <span>
                                            {transaction.customer_occupation ||
                                                "-"}
                                        </span>
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Ringkasan Kredit</strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="bg-body-tertiary rounded-3 p-3 mb-3">
                                    <div className="text-body-tertiary small">
                                        Unit
                                    </div>
                                    <div className="fw-bold">
                                        {motor?.name || "-"}
                                    </div>
                                    <div className="text-primary fw-bold mt-1">
                                        {formatRupiah(motor?.price)}
                                    </div>
                                </div>
                                <CRow className="g-2 mb-3">
                                    <CCol xs={6}>
                                        <div className="bg-body-tertiary rounded-3 p-3">
                                            <div className="text-body-tertiary small">
                                                DP
                                            </div>
                                            <div className="fw-bold">
                                                {formatRupiah(
                                                    credit_detail?.down_payment,
                                                )}
                                            </div>
                                        </div>
                                    </CCol>
                                    <CCol xs={6}>
                                        <div className="bg-body-tertiary rounded-3 p-3">
                                            <div className="text-body-tertiary small">
                                                Tenor
                                            </div>
                                            <div className="fw-bold">
                                                {credit_detail?.tenor || 0} bln
                                            </div>
                                        </div>
                                    </CCol>
                                </CRow>
                                <div className="bg-primary-subtle rounded-3 p-3 mb-3">
                                    <div className="text-primary small">
                                        Angsuran / Bulan
                                    </div>
                                    <div className="h5 fw-bold mb-0">
                                        {formatRupiah(
                                            credit_detail?.monthly_installment,
                                        )}
                                    </div>
                                </div>
                                <CBadge
                                    color={currentStatus?.color || "secondary"}
                                    className="w-100 py-2"
                                >
                                    Status:{" "}
                                    {currentStatus?.label || data.credit_status}
                                </CBadge>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
