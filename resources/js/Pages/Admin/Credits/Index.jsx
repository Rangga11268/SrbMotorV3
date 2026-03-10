import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CBadge,
    CButton,
    CFormInput,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CAvatar,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilZoom, cilReload, cilCreditCard } from "@coreui/icons";

export default function Index({
    credits,
    statuses: statusList,
    filters: currentFilters,
}) {
    const [search, setSearch] = useState(currentFilters?.search || "");
    const [status, setStatus] = useState(currentFilters?.status || "");

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    const getStatusBadge = (status) => {
        const map = {
            pengajuan_masuk: { color: "info", label: "Pengajuan Masuk" },
            verifikasi_dokumen: {
                color: "warning",
                label: "Verifikasi Dokumen",
            },
            dikirim_ke_leasing: { color: "info", label: "Dikirim ke Leasing" },
            survey_dijadwalkan: {
                color: "warning",
                label: "Survey Dijadwalkan",
            },
            survey_berjalan: { color: "warning", label: "Survey Berjalan" },
            menunggu_keputusan_leasing: {
                color: "info",
                label: "Menunggu Keputusan",
            },
            disetujui: { color: "success", label: "Disetujui" },
            ditolak: { color: "danger", label: "Ditolak" },
            dp_dibayar: { color: "success", label: "DP Dibayar" },
            selesai: { color: "success", label: "Selesai" },
        };
        const badge = map[status] || { color: "secondary", label: status };
        return (
            <CBadge
                color={badge.color}
                shape="rounded-pill"
                className="px-3 py-1"
            >
                {badge.label}
            </CBadge>
        );
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route("admin.credits.index"), {
            search: value || undefined,
            status: status || undefined,
        });
    };

    const handleStatusFilter = (value) => {
        setStatus(value);
        router.get(route("admin.credits.index"), {
            search: search || undefined,
            status: value || undefined,
        });
    };

    const handleReset = () => {
        setSearch("");
        setStatus("");
        router.get(route("admin.credits.index"));
    };

    return (
        <AdminLayout title="Kelola Pengajuan Kredit">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Pengajuan Kredit</h2>
                    <p className="text-body-secondary mb-0 small">
                        Proses dan monitor aplikasi kredit dari pelanggan
                    </p>
                </div>
            </div>

            {/* Filter Card */}
            <CCard className="mb-4 border-0 shadow-sm">
                <CCardBody>
                    <CRow className="g-3 align-items-end">
                        <CCol md={6}>
                            <label className="small text-body-secondary">
                                Cari Kredit
                            </label>
                            <CInputGroup>
                                <CInputGroupText className="bg-transparent border-end-0">
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    className="border-start-0"
                                    placeholder="No. transaksi / nama pelanggan..."
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={4}>
                            <label className="small text-body-secondary">
                                Status
                            </label>
                            <CFormSelect
                                value={status}
                                onChange={(e) =>
                                    handleStatusFilter(e.target.value)
                                }
                            >
                                <option value="">Semua Status</option>
                                <option value="pengajuan_masuk">
                                    Pengajuan Masuk
                                </option>
                                <option value="verifikasi_dokumen">
                                    Verifikasi Dokumen
                                </option>
                                <option value="dikirim_ke_leasing">
                                    Dikirim ke Leasing
                                </option>
                                <option value="survey_dijadwalkan">
                                    Survey Dijadwalkan
                                </option>
                                <option value="survey_berjalan">
                                    Survey Berjalan
                                </option>
                                <option value="menunggu_keputusan_leasing">
                                    Menunggu Keputusan
                                </option>
                                <option value="disetujui">Disetujui</option>
                                <option value="ditolak">Ditolak</option>
                                <option value="dp_dibayar">DP Dibayar</option>
                                <option value="selesai">Selesai</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={2}>
                            {(search || status) && (
                                <CButton
                                    color="light"
                                    className="w-100"
                                    onClick={handleReset}
                                >
                                    <CIcon icon={cilReload} size="sm" /> Reset
                                </CButton>
                            )}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Data Table */}
            <CCard className="border-0 shadow-sm overflow-hidden">
                <CCardBody className="p-0">
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="text-body-secondary bg-body-tertiary">
                            <CTableRow>
                                <CTableHeaderCell className="ps-4">
                                    No. Kredit
                                </CTableHeaderCell>
                                <CTableHeaderCell>Pelanggan</CTableHeaderCell>
                                <CTableHeaderCell>Motor</CTableHeaderCell>
                                <CTableHeaderCell>Jumlah</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {credits.data && credits.data.length > 0 ? (
                                credits.data.map((credit) => (
                                    <CTableRow key={credit.id}>
                                        <CTableDataCell className="ps-4">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-primary">
                                                    #{credit.transaction_id}
                                                </span>
                                                <span
                                                    className="text-body-tertiary"
                                                    style={{ fontSize: 11 }}
                                                >
                                                    {new Date(
                                                        credit.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                    )}
                                                </span>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center gap-2">
                                                <CAvatar
                                                    color="primary"
                                                    textColor="white"
                                                    size="sm"
                                                    className="fw-bold"
                                                >
                                                    {getInitials(
                                                        credit.transaction?.user
                                                            ?.name,
                                                    )}
                                                </CAvatar>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {credit.transaction
                                                            ?.user?.name ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-body-tertiary small">
                                                        {credit.transaction
                                                            ?.user?.email ||
                                                            "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center gap-2">
                                                <CIcon
                                                    icon={cilCreditCard}
                                                    size="lg"
                                                    className="text-muted"
                                                />
                                                <div>
                                                    <div className="fw-semibold">
                                                        {credit.transaction
                                                            ?.motor?.name ||
                                                            "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-bold text-success">
                                                {formatCurrency(
                                                    credit.approved_amount ||
                                                        credit.down_payment ||
                                                        0,
                                                )}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {getStatusBadge(
                                                credit.credit_status,
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <Link
                                                href={route(
                                                    "admin.credits.show",
                                                    credit.id,
                                                )}
                                                className="btn btn-sm btn-info"
                                            >
                                                <CIcon
                                                    icon={cilZoom}
                                                    size="sm"
                                                />{" "}
                                                Proses
                                            </Link>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell
                                        colSpan="6"
                                        className="text-center py-4"
                                    >
                                        <p className="text-body-secondary mb-0">
                                            Tidak ada pengajuan kredit
                                        </p>
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </AdminLayout>
    );
}
