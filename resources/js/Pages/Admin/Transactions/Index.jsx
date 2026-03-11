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
import {
    cilSearch,
    cilPlus,
    cilPencil,
    cilZoom,
    cilReload,
    cilBike,
} from "@coreui/icons";

export default function Index({
    transactions: initialTransactions,
    filters,
    statuses,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    const getStatusBadge = (status) => {
        const map = {
            new_order: { color: "warning", label: "Pesanan Baru" },
            waiting_payment: { color: "warning", label: "Menunggu Pembayaran" },
            payment_confirmed: {
                color: "success",
                label: "Pembayaran Dikonfirmasi",
            },
            unit_preparation: { color: "info", label: "Persiapan Unit" },
            ready_for_delivery: { color: "primary", label: "Siap Dikirim" },
            completed: { color: "success", label: "Selesai" },
            cancelled: { color: "danger", label: "Dibatalkan" },
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
        router.get(route("admin.transactions.index"), {
            search: value || undefined,
            status: status || undefined,
        });
    };

    const handleStatusFilter = (value) => {
        setStatus(value);
        router.get(route("admin.transactions.index"), {
            search: search || undefined,
            status: value || undefined,
        });
    };

    const handleReset = () => {
        setSearch("");
        setStatus("");
        router.get(route("admin.transactions.index"));
    };

    return (
        <AdminLayout title="Manajemen Transaksi Tunai">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Transaksi Tunai</h2>
                    <p className="text-body-secondary mb-0 small">
                        Kelola transaksi pembayaran tunai pelanggan
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
                        <CCol md={6}>
                            <label className="small text-body-secondary">
                                Cari Transaksi
                            </label>
                            <CInputGroup>
                                <CInputGroupText className="bg-transparent border-end-0">
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    className="border-start-0"
                                    placeholder="ID / nama pelanggan..."
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
                                {statuses?.map((s) => (
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
                                    No. Transaksi
                                </CTableHeaderCell>
                                <CTableHeaderCell>Pelanggan</CTableHeaderCell>
                                <CTableHeaderCell>Motor</CTableHeaderCell>
                                <CTableHeaderCell>Total Bayar</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {initialTransactions.data &&
                            initialTransactions.data.length > 0 ? (
                                initialTransactions.data.map((trx) => (
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
                                                    style={{ fontSize: 11 }}
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
                                                    color="success"
                                                    textColor="white"
                                                    size="sm"
                                                    className="fw-bold"
                                                >
                                                    {getInitials(
                                                        trx.customer_name ||
                                                            trx.user?.name,
                                                    )}
                                                </CAvatar>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {trx.customer_name ||
                                                            trx.user?.name ||
                                                            "N/A"}
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
                                                    {trx.motor?.image_path ? (
                                                        <img
                                                            src={`/storage/${trx.motor.image_path}`}
                                                            alt={trx.motor.name}
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
                                                        style={{ fontSize: 9 }}
                                                    >
                                                        {trx.motor?.brand ||
                                                            "N/A"}
                                                    </CBadge>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-bold text-dark">
                                                {formatCurrency(
                                                    trx.total_price,
                                                )}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {getStatusBadge(trx.status)}
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
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell
                                        colSpan={6}
                                        className="text-center py-5 text-body-tertiary"
                                    >
                                        Tidak ada transaksi tunai yang
                                        ditemukan.
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
