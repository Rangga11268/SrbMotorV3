import React, { useState, useEffect } from "react";
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
    CPagination,
    CPaginationItem,
    CAvatar,
    CFormLabel,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilSearch,
    cilPlus,
    cilPencil,
    cilZoom,
    cilReload,
    cilBike,
    cilCreditCard,
    cilWarning,
} from "@coreui/icons";

export default function Index({
    transactions,
    filters,
    transactionTypes,
    statuses,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "");
    const [status, setStatus] = useState(filters.status || "");
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("admin.transactions.index"),
                { search, type, status },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, type, status]);

    const resetFilters = () => {
        setSearch("");
        setType("");
        setStatus("");
    };

    const getStatusBadge = (status) => {
        const map = {
            completed: { color: "success", label: "Selesai" },
            payment_confirmed: {
                color: "success",
                label: "Pembayaran Berhasil",
            },
            unit_preparation: { color: "info", label: "Persiapan Unit" },
            ready_for_delivery: { color: "primary", label: "Siap Dikirim" },
            new_order: { color: "warning", label: "Pesanan Baru" },
            waiting_payment: { color: "warning", label: "Menunggu Pembayaran" },
            menunggu_persetujuan: {
                color: "warning",
                label: "Verifikasi Berkas",
            },
            data_tidak_valid: { color: "danger", label: "Perbaiki Dokumen" },
            dikirim_ke_surveyor: { color: "info", label: "Proses Surveyor" },
            jadwal_survey: { color: "primary", label: "Jadwal Survey" },
            disetujui: { color: "success", label: "Kredit Disetujui" },
            ditolak: { color: "danger", label: "Kredit Ditolak" },
            cancelled: { color: "danger", label: "Dibatalkan" },
        };
        const badge = map[status] || {
            color: "secondary",
            label:
                status
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A",
        };
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

    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    return (
        <AdminLayout title="Manajemen Transaksi">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Transaksi</h2>
                    <p className="text-body-secondary mb-0 small">
                        Kelola seluruh data transaksi pelanggan dalam satu
                        dashboard
                    </p>
                </div>
                <Link
                    href={route("admin.transactions.create")}
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
                >
                    <CIcon icon={cilPlus} size="sm" />
                    Tambah Transaksi
                </Link>
            </div>

            {/* Filter Card */}
            <CCard className="mb-4 border-0 shadow-sm">
                <CCardBody>
                    <CRow className="g-3 align-items-end">
                        <CCol md={4}>
                            <CFormLabel className="small text-body-secondary">
                                Cari Transaksi
                            </CFormLabel>
                            <CInputGroup>
                                <CInputGroupText className="bg-transparent border-end-0">
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    className="border-start-0"
                                    placeholder="ID / nama pelanggan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel className="small text-body-secondary">
                                Tipe
                            </CFormLabel>
                            <CFormSelect
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Semua Tipe</option>
                                {transactionTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t === "CASH"
                                            ? "💵 Cash / Tunai"
                                            : "💳 Kredit"}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel className="small text-body-secondary">
                                Status
                            </CFormLabel>
                            <CFormSelect
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, (l) =>
                                                l.toUpperCase(),
                                            )}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={2}>
                            {(search || type || status) && (
                                <CButton
                                    color="light"
                                    className="w-100 d-flex align-items-center justify-content-center gap-1"
                                    onClick={resetFilters}
                                >
                                    <CIcon icon={cilReload} size="sm" />
                                    Reset
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
                                    No. Transaksi
                                </CTableHeaderCell>
                                <CTableHeaderCell>Pelanggan</CTableHeaderCell>
                                <CTableHeaderCell>Unit Motor</CTableHeaderCell>
                                <CTableHeaderCell>Total Bayar</CTableHeaderCell>
                                <CTableHeaderCell>
                                    Status Saat Ini
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-center">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {transactions.data.length > 0 ? (
                                transactions.data.map((trx) => {
                                    const customerName =
                                        trx.customer_name ||
                                        trx.user?.name ||
                                        "N/A";
                                    const isCash =
                                        trx.transaction_type === "CASH";
                                    return (
                                        <CTableRow
                                            key={trx.id}
                                            className="align-middle"
                                        >
                                            <CTableDataCell className="ps-4">
                                                <div className="d-flex flex-column">
                                                    <span className="fw-bold text-primary">
                                                        #
                                                        {trx.id
                                                            .toString()
                                                            .padStart(6, "0")}
                                                    </span>
                                                    <span
                                                        className="text-body-tertiary"
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        {new Date(
                                                            trx.created_at,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                        )}
                                                    </span>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex align-items-center gap-2">
                                                    <CAvatar
                                                        color={
                                                            isCash
                                                                ? "success"
                                                                : "info"
                                                        }
                                                        textColor="white"
                                                        size="sm"
                                                        className="fw-bold"
                                                    >
                                                        {getInitials(
                                                            customerName,
                                                        )}
                                                    </CAvatar>
                                                    <div>
                                                        <div className="fw-semibold">
                                                            {customerName}
                                                        </div>
                                                        <div className="text-body-tertiary small">
                                                            {trx.customer_phone ||
                                                                "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        className="bg-body-tertiary rounded-2 overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: 45,
                                                            height: 45,
                                                        }}
                                                    >
                                                        {trx.motor
                                                            ?.image_path ? (
                                                            <img
                                                                src={`/storage/${trx.motor.image_path}`}
                                                                alt={
                                                                    trx.motor
                                                                        .name
                                                                }
                                                                className="w-100 h-100 object-fit-cover"
                                                            />
                                                        ) : (
                                                            <CIcon
                                                                icon={cilBike}
                                                                className="text-body-tertiary"
                                                                size="sm"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="fw-medium small pb-1">
                                                            {trx.motor?.name ||
                                                                "Unit Dihapus"}
                                                        </div>
                                                        <CBadge
                                                            color="primary-subtle"
                                                            textColor="primary"
                                                            style={{
                                                                fontSize: 9,
                                                            }}
                                                        >
                                                            {trx.motor?.brand ||
                                                                "N/A"}
                                                        </CBadge>
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="fw-bold text-dark">
                                                    {formatRupiah(
                                                        trx.total_amount,
                                                    )}
                                                </div>
                                                <div className="mt-1 d-flex align-items-center gap-1">
                                                    <span
                                                        className={`badge-dot bg-${isCash ? "success" : "info"}`}
                                                    ></span>
                                                    <span
                                                        className="text-body-secondary"
                                                        style={{ fontSize: 11 }}
                                                    >
                                                        {isCash
                                                            ? "Tunai"
                                                            : "Kredit"}
                                                    </span>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex flex-column gap-1">
                                                    {getStatusBadge(trx.status)}
                                                    {trx.transaction_type ===
                                                        "CREDIT" &&
                                                        !trx.documents_complete && (
                                                            <div
                                                                className="text-danger d-flex align-items-center gap-1"
                                                                style={{
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                <CIcon
                                                                    icon={
                                                                        cilWarning
                                                                    }
                                                                    size="custom-unit"
                                                                    style={{
                                                                        width: 10,
                                                                    }}
                                                                />
                                                                Dokumen Belum
                                                                Lengkap
                                                            </div>
                                                        )}
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Link
                                                        href={route(
                                                            "admin.transactions.show",
                                                            trx.id,
                                                        )}
                                                        className="btn btn-sm btn-light border d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                        }}
                                                        title="Detail"
                                                    >
                                                        <CIcon
                                                            icon={cilZoom}
                                                            size="sm"
                                                        />
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.transactions.edit",
                                                            trx.id,
                                                        )}
                                                        className="btn btn-sm btn-warning d-flex align-items-center justify-content-center shadow-sm"
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                        }}
                                                        title="Edit"
                                                    >
                                                        <CIcon
                                                            icon={cilPencil}
                                                            size="sm"
                                                            className="text-white"
                                                        />
                                                    </Link>
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    );
                                })
                            ) : (
                                <CTableRow>
                                    <CTableDataCell
                                        colSpan={6}
                                        className="text-center py-5 text-body-tertiary"
                                    >
                                        Tidak ada data transaksi yang ditemukan.
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>

                {/* Pagination */}
                {transactions.links.length > 3 && (
                    <div className="card-footer d-flex justify-content-center py-3">
                        <CPagination>
                            {transactions.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                return (
                                    <CPaginationItem
                                        key={index}
                                        active={link.active}
                                        disabled={!link.url}
                                        href={link.url || "#"}
                                        as={link.url ? Link : "span"}
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
