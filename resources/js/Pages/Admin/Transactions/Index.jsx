import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
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
import {
    cilSearch,
    cilPlus,
    cilPencil,
    cilZoom,
    cilReload,
    cilBike,
    cilTrash,
    cilOptions,
    cilUser,
} from "@coreui/icons";

export default function Index({
    transactions: initialTransactions,
    filters,
    statuses,
}) {
    const [localTransactions, setLocalTransactions] =
        useState(initialTransactions);
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const fetchTransactions = async (params) => {
        setLoading(true);
        try {
            const response = await axios.get(
                route("admin.transactions.index"),
                {
                    params,
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                },
            );
            setLocalTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
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

            fetchTransactions(params);
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
            new_order: { color: "warning", label: "Pesanan Masuk" },
            waiting_payment: { color: "warning", label: "Menunggu Pembayaran" },
            pembayaran_dikonfirmasi: {
                color: "success",
                label: "Pembayaran Dikonfirmasi",
            },
            payment_confirmed: {
                color: "success",
                label: "Pembayaran Dikonfirmasi",
            },
            unit_preparation: { color: "info", label: "Motor Disiapkan" },
            ready_for_delivery: {
                color: "primary",
                label: "Siap Dikirim/Ambil",
            },
            dalam_pengiriman: { color: "info", label: "Dalam Pengiriman" },
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
    };

    const handleDelete = (transactionId) => {
        Swal.fire({
            title: "Hapus Transaksi?",
            text: "Data transaksi akan dihapus permanen dan tidak bisa dipulihkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    route("admin.transactions.destroy", transactionId),
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Terhapus!",
                                "Transaksi berhasil dihapus.",
                                "success",
                            );
                            fetchTransactions({ search, status });
                        },
                        onError: () => {
                            Swal.fire(
                                "Error",
                                "Gagal menghapus transaksi",
                                "error",
                            );
                        },
                    },
                );
            }
        });
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
        fetchTransactions(params);

        // Update URL
        window.history.replaceState({}, "", url);
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
                        <CCol xs={12} md={6}>
                            <label className="small text-body-secondary mb-1">
                                Cari Transaksi
                            </label>
                            <CInputGroup>
                                <CInputGroupText className="bg-transparent border-end-0">
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    className="border-start-0"
                                    placeholder="ID, nama, motor..."
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
                                {statuses?.map((s) => (
                                    <option key={s} value={s}>
                                        {s === "new_order"
                                            ? "Pesanan Masuk"
                                            : s === "waiting_payment"
                                              ? "Menunggu Pembayaran"
                                              : s === "pembayaran_dikonfirmasi"
                                                ? "Pembayaran Dikonfirmasi"
                                                : s === "payment_confirmed"
                                                  ? "Pembayaran Dikonfirmasi"
                                                  : s === "unit_preparation"
                                                    ? "Motor Disiapkan"
                                                    : s === "ready_for_delivery"
                                                      ? "Siap Dikirim/Ambil"
                                                      : s === "dalam_pengiriman"
                                                        ? "Dalam Pengiriman"
                                                        : s === "completed"
                                                          ? "Selesai"
                                                          : s === "cancelled"
                                                            ? "Dibatalkan"
                                                            : s
                                                                  .replace(
                                                                      /_/g,
                                                                      " ",
                                                                  )
                                                                  .replace(
                                                                      /\b\w/g,
                                                                      (l) =>
                                                                          l.toUpperCase(),
                                                                  )}
                                    </option>
                                ))}
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
                                    No. Transaksi
                                </CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Pelanggan</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Motor</CTableHeaderCell>
                                <CTableHeaderCell>Total Bayar</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {localTransactions.data &&
                            localTransactions.data.length > 0 ? (
                                localTransactions.data.map((trx) => (
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
                                                <div
                                                    className="d-md-none text-body-tertiary fw-normal mt-1 d-flex flex-column gap-1"
                                                    style={{ fontSize: 11 }}
                                                >
                                                    <div>
                                                        <CIcon icon={cilUser} size="custom" height={10} className="me-1" />
                                                        {trx.name || trx.user?.name || "N/A"}
                                                    </div>
                                                    <div>
                                                        <CIcon icon={cilBike} size="custom" height={10} className="me-1" />
                                                        {trx.motor?.name || "N/A"}
                                                    </div>
                                                    <div className="mt-1">
                                                        {getStatusBadge(trx.status)}
                                                    </div>
                                                </div>
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
                                        <CTableDataCell className="d-none d-md-table-cell">
                                            <div className="d-flex align-items-center gap-2">
                                                <CAvatar
                                                    color="success"
                                                    textColor="white"
                                                    size="sm"
                                                    className="fw-bold"
                                                >
                                                    {getInitials(
                                                        trx.name ||
                                                            trx.user?.name,
                                                    )}
                                                </CAvatar>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {trx.name ||
                                                            trx.user?.name ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-body-tertiary small">
                                                        {trx.phone ||
                                                            trx.user?.phone ||
                                                            "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-md-table-cell">
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
                                        <CTableDataCell className="d-none d-md-table-cell">
                                            {getStatusBadge(trx.status)}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <div className="d-flex gap-1 justify-content-center">
                                                {/* Desktop Actions */}
                                                <div className="d-none d-md-flex gap-1">
                                                    <Link
                                                        href={route("admin.transactions.show", trx.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Detail"
                                                    >
                                                        <CIcon icon={cilZoom} size="sm" />
                                                    </Link>
                                                    <Link
                                                        href={route("admin.transactions.edit", trx.id)}
                                                        className="btn btn-sm btn-outline-warning"
                                                        title="Edit"
                                                    >
                                                        <CIcon icon={cilPencil} size="sm" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(trx.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Hapus"
                                                    >
                                                        <CIcon icon={cilTrash} size="sm" />
                                                    </button>
                                                </div>

                                                {/* Mobile Actions Dropdown */}
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
                                                            <CDropdownItem as={Link} href={route("admin.transactions.show", trx.id)}>
                                                                <CIcon icon={cilZoom} className="me-2" /> Detail
                                                            </CDropdownItem>
                                                            <CDropdownItem as={Link} href={route("admin.transactions.edit", trx.id)}>
                                                                <CIcon icon={cilPencil} className="me-2" /> Edit
                                                            </CDropdownItem>
                                                            <CDropdownItem 
                                                                onClick={() => handleDelete(trx.id)}
                                                                className="text-danger"
                                                            >
                                                                <CIcon icon={cilTrash} className="me-2" /> Hapus
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

                {/* Pagination */}
                {localTransactions.links &&
                    localTransactions.links.length > 3 && (
                        <div className="card-footer d-flex justify-content-center py-3 bg-white border-top-0">
                            <CPagination className="mb-0">
                                {localTransactions.links.map((link, index) => {
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
