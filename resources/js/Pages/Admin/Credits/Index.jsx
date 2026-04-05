import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
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
    CPaginationItem,
    CSpinner,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilZoom, cilReload, cilCreditCard, cilUser, cilBike, cilOptions } from "@coreui/icons";

export default function Index({
    credits: initialCredits,
    statuses: statusList,
    filters: currentFilters,
}) {
    const [localCredits, setLocalCredits] = useState(initialCredits);
    const [search, setSearch] = useState(currentFilters?.search || "");
    const [status, setStatus] = useState(currentFilters?.status || "");
    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const fetchCredits = async (params) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.credits.index"), {
                params,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            setLocalCredits(response.data);
        } catch (error) {
            console.error("Error fetching credits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);

            fetchCredits(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, status]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    const getStatusBadge = (status) => {
        const map = {
            pengajuan_masuk: { color: "info", label: "Pengajuan Masuk" },
            menunggu_persetujuan: {
                color: "warning",
                label: "Menunggu Persetujuan",
            },
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
    };

    const handleStatusFilter = (value) => {
        setStatus(value);
    };

    const handleReset = () => {
        setSearch("");
        setStatus("");
    };

    const handlePageChange = (url) => {
        if (!url) return;
        const urlObj = new URL(url);
        const params = Object.fromEntries(urlObj.searchParams);
        fetchCredits(params);

        // Update URL
        window.history.replaceState({}, "", url);
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
                        <CCol xs={12} md={6}>
                            <label className="small text-body-secondary mb-1">
                                Cari Kredit
                            </label>
                            <CInputGroup>
                                <CInputGroupText className="bg-transparent border-end-0">
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    className="border-start-0"
                                    placeholder="No. kredit, nama, motor..."
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol xs={12} sm={8} md={4}>
                            <label className="small text-body-secondary mb-1">
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
                                <option value="menunggu_persetujuan">
                                    Menunggu Persetujuan
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
                        <CCol xs={12} sm={4} md={2}>
                            {(search || status) && (
                                <CButton
                                    color="light"
                                    className="w-100 mt-md-0"
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
            <CCard className="border-0 shadow-sm overflow-hidden position-relative">
                {loading && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                            zIndex: 10,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <div className="text-center">
                            <CSpinner color="primary" />
                            <p className="mt-2 text-body-secondary small">
                                Memuat data...
                            </p>
                        </div>
                    </div>
                )}
                <CCardBody
                    className="p-0"
                    style={{ opacity: loading ? 0.6 : 1 }}
                >
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="text-body-secondary bg-body-tertiary">
                            <CTableRow>
                                <CTableHeaderCell className="ps-4">
                                    No. Kredit
                                </CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Pelanggan</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Motor</CTableHeaderCell>
                                <CTableHeaderCell>Jumlah</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {localCredits.data &&
                            localCredits.data.length > 0 ? (
                                localCredits.data.map((credit) => (
                                    <CTableRow key={credit.id}>
                                        <CTableDataCell className="ps-4">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-primary">
                                                    #{credit.transaction_id}
                                                </span>
                                                <div
                                                    className="d-md-none text-body-tertiary fw-normal mt-1 d-flex flex-column gap-1"
                                                    style={{ fontSize: 11 }}
                                                >
                                                    <div>
                                                        <CIcon icon={cilUser} size="custom" height={10} className="me-1" />
                                                        {credit.transaction?.name || credit.transaction?.user?.name || "N/A"}
                                                    </div>
                                                    <div>
                                                        <CIcon icon={cilBike} size="custom" height={10} className="me-1" />
                                                        {credit.transaction?.motor?.name || "N/A"}
                                                    </div>
                                                    <div className="mt-1">
                                                        {getStatusBadge(credit.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-md-table-cell">
                                            <div className="d-flex align-items-center gap-2">
                                                <CAvatar
                                                    color="primary"
                                                    textColor="white"
                                                    size="sm"
                                                    className="fw-bold"
                                                >
                                                    {getInitials(
                                                        credit.transaction
                                                            ?.name ||
                                                            credit.transaction
                                                                ?.user?.name,
                                                    )}
                                                </CAvatar>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {credit.transaction
                                                            ?.name ||
                                                            credit.transaction
                                                                ?.user?.name ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-body-tertiary small">
                                                        {credit.transaction
                                                            ?.phone ||
                                                            credit.transaction
                                                                ?.user?.email ||
                                                            "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-md-table-cell">
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
                                        <CTableDataCell className="d-none d-md-table-cell">
                                            {getStatusBadge(credit.status)}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <div className="d-flex justify-content-center">
                                                <Link
                                                    href={route("admin.credits.show", credit.id)}
                                                    className="btn btn-sm btn-primary px-3 d-none d-md-flex align-items-center gap-1"
                                                >
                                                    <CIcon icon={cilZoom} size="sm" />
                                                    <span>Proses</span>
                                                </Link>
                                                
                                                {/* Mobile Actions */}
                                                <div className="d-md-none">
                                                    <CDropdown alignment="end">
                                                        <CDropdownToggle
                                                            color="light"
                                                            size="sm"
                                                            caret={false}
                                                            className="p-1 border shadow-sm d-flex align-items-center justify-content-center"
                                                            style={{ width: 32, height: 32, borderRadius: 8 }}
                                                        >
                                                            <CIcon icon={cilOptions} size="sm" />
                                                        </CDropdownToggle>
                                                        <CDropdownMenu>
                                                            <CDropdownItem as={Link} href={route("admin.credits.show", credit.id)}>
                                                                <CIcon icon={cilZoom} className="me-2" /> Detail / Proses
                                                            </CDropdownItem>
                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                </div>
                                            </div>
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

                {/* Pagination */}
                {localCredits.links && localCredits.links.length > 3 && (
                    <div className="card-footer d-flex justify-content-center py-3 bg-white border-top-0">
                        <CPagination className="mb-0">
                            {localCredits.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                return (
                                    <CPaginationItem
                                        key={index}
                                        active={link.active}
                                        disabled={!link.url}
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        style={{
                                            cursor: link.url
                                                ? "pointer"
                                                : "default",
                                        }}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </CPaginationItem>
                                );
                            })}
                        </CPagination>
                    </div>
                )}
            </CCard>
        </AdminLayout>
    );
}
