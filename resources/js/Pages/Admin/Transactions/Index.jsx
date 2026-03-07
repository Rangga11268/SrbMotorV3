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
            approved: { color: "success", label: "Disetujui" },
            disetujui: { color: "success", label: "Disetujui" },
            ready_for_delivery: { color: "success", label: "Siap Kirim" },
            payment_confirmed: {
                color: "info",
                label: "Pembayaran Dikonfirmasi",
            },
            lunas: { color: "success", label: "Lunas" },
            pending: { color: "warning", label: "Pending" },
            menunggu_persetujuan: {
                color: "warning",
                label: "Menunggu Persetujuan",
            },
            new_order: { color: "info", label: "Order Baru" },
            waiting_payment: { color: "warning", label: "Menunggu Pembayaran" },
            unit_preparation: { color: "info", label: "Persiapan Unit" },
            dikirim_ke_surveyor: {
                color: "info",
                label: "Dikirim ke Surveyor",
            },
            jadwal_survey: { color: "info", label: "Jadwal Survey" },
            rejected: { color: "danger", label: "Ditolak" },
            ditolak: { color: "danger", label: "Ditolak" },
            data_tidak_valid: { color: "danger", label: "Data Tidak Valid" },
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
            <CBadge color={badge.color} shape="rounded-pill">
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

    return (
        <AdminLayout title="Manajemen Transaksi">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Transaksi</h2>
                    <p className="text-body-secondary mb-0 small">
                        Kelola seluruh data transaksi pelanggan
                    </p>
                </div>
                <Link
                    href={route("admin.transactions.create")}
                    className="btn btn-primary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilPlus} size="sm" />
                    Tambah Transaksi
                </Link>
            </div>

            {/* Filter Card */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className="g-3 align-items-end">
                        <CCol md={4}>
                            <CInputGroup>
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Cari ID / nama pelanggan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3}>
                            <CFormSelect
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Semua Tipe</option>
                                {transactionTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={3}>
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
            <CCard>
                <CCardBody className="p-0">
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="text-body-secondary bg-body-tertiary">
                            <CTableRow>
                                <CTableHeaderCell>ID</CTableHeaderCell>
                                <CTableHeaderCell>Pelanggan</CTableHeaderCell>
                                <CTableHeaderCell>Unit</CTableHeaderCell>
                                <CTableHeaderCell>Nominal</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Tanggal</CTableHeaderCell>
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
                                            className="align-middle cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        "admin.transactions.show",
                                                        trx.id,
                                                    ),
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <CTableDataCell>
                                                <span className="fw-bold text-primary">
                                                    #
                                                    {trx.id
                                                        .toString()
                                                        .padStart(6, "0")}
                                                </span>
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
                                                            width: 40,
                                                            height: 40,
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
                                                        <div className="fw-medium small">
                                                            {trx.motor?.name ||
                                                                "Unit Dihapus"}
                                                        </div>
                                                        <div
                                                            className="text-body-tertiary"
                                                            style={{
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            {trx.motor?.brand ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="fw-bold">
                                                    Rp{" "}
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                    ).format(trx.total_amount)}
                                                </div>
                                                <CBadge
                                                    color={
                                                        isCash
                                                            ? "success"
                                                            : "info"
                                                    }
                                                    shape="rounded-pill"
                                                    size="sm"
                                                    className="mt-1"
                                                >
                                                    {isCash
                                                        ? "Tunai"
                                                        : "Kredit"}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex flex-column gap-1">
                                                    {getStatusBadge(trx.status)}
                                                    {trx.transaction_type ===
                                                        "CREDIT" &&
                                                        !trx.documents_complete && (
                                                            <CBadge
                                                                color="warning"
                                                                shape="rounded-pill"
                                                                className="d-flex align-items-center gap-1"
                                                                style={{
                                                                    width: "fit-content",
                                                                }}
                                                            >
                                                                <CIcon
                                                                    icon={
                                                                        cilWarning
                                                                    }
                                                                    size="xs"
                                                                />
                                                                Dokumen Belum
                                                                Lengkap
                                                            </CBadge>
                                                        )}
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="small text-body-secondary">
                                                {new Date(
                                                    trx.created_at,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </CTableDataCell>
                                            <CTableDataCell
                                                className="text-center"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Link
                                                        href={route(
                                                            "admin.transactions.show",
                                                            trx.id,
                                                        )}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Detail"
                                                    >
                                                        <CIcon
                                                            icon={cilZoom}
                                                            size="sm"
                                                        />
                                                    </Link>
                                                    {trx.transaction_type ===
                                                        "CREDIT" && (
                                                        <Link
                                                            href={route(
                                                                "admin.transactions.editCredit",
                                                                trx.id,
                                                            )}
                                                            className="btn btn-sm btn-outline-info"
                                                            title="Edit Kredit"
                                                        >
                                                            <CIcon
                                                                icon={
                                                                    cilCreditCard
                                                                }
                                                                size="sm"
                                                            />
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={route(
                                                            "admin.transactions.edit",
                                                            trx.id,
                                                        )}
                                                        className="btn btn-sm btn-outline-warning"
                                                        title="Edit"
                                                    >
                                                        <CIcon
                                                            icon={cilPencil}
                                                            size="sm"
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
                                        colSpan={7}
                                        className="text-center py-5 text-body-tertiary"
                                    >
                                        Tidak ada data transaksi.
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
