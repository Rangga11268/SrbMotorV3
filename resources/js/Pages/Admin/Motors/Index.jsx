import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
    CCard,
    CCardBody,
    CCardHeader,
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
    cilTrash,
    cilZoom,
    cilReload,
    cilBike,
    cilStorage,
    cilOptions,
} from "@coreui/icons";

export default function Index({ motors: initialMotors, filters, brands }) {
    const [localMotors, setLocalMotors] = useState(initialMotors);
    const [search, setSearch] = useState(filters.search || "");
    const [brand, setBrand] = useState(filters.brand || "");
    const [status, setStatus] = useState(filters.status || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLocalMotors(initialMotors);
    }, [initialMotors]);

    const fetchMotors = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.motors.index"), {
                params: currentFilters,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            if (response.data.motors) {
                setLocalMotors(response.data.motors);
            }
        } catch (error) {
            console.error("Error fetching motors:", error);
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
        if (brand) params.brand = brand;
        if (status) params.status = status;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);

            fetchMotors(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, brand, status]);

    const handleSearch = (e) => e.preventDefault();

    const resetFilters = () => {
        setSearch("");
        setBrand("");
        setStatus("");
    };

    const confirmDelete = (motor) => {
        Swal.fire({
            title: `Hapus ${motor.name}?`,
            text: "Motor akan dihapus dari katalog permanen. Tindakan ini tidak bisa dibatalkan.",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.motors.destroy", motor.id), {
                    onSuccess: () => {
                        toast.success("Motor berhasil dihapus");
                    },
                    onError: () => {
                        toast.error("Gagal menghapus motor");
                    },
                });
            }
        });
    };

    return (
        <AdminLayout title="Manajemen Motor">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Motor</h2>
                    <p className="text-body-secondary mb-0 small">
                        Kelola seluruh data unit motor
                    </p>
                </div>
                <Link
                    href={route("admin.motors.create")}
                    className="btn btn-primary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilPlus} size="sm" />
                    Tambah Motor
                </Link>
            </div>

            {/* Filter Card */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className="g-3 align-items-end">
                        <CCol xs={12} md={4}>
                            <CInputGroup>
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    type="text"
                                    placeholder="Cari..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol xs={12} sm={6} md={3}>
                            <CFormSelect
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            >
                                <option value="">Semua Merk</option>
                                {brands && brands.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs={12} sm={6} md={3}>
                            <CFormSelect
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Tersedia</option>
                                <option value="0">Kosong</option>
                            </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={2}>
                            {(search || brand || status) && (
                                <CButton
                                    color="light"
                                    className="w-100 d-flex align-items-center justify-content-center gap-1 mt-md-0"
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
            <CCard className="position-relative">
                {loading && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                            zIndex: 10,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                    style={{ opacity: loading ? 0.5 : 1 }}
                >
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="text-body-secondary bg-body-tertiary">
                            <CTableRow>
                                <CTableHeaderCell>Motor</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">
                                    Merk / Tipe
                                </CTableHeaderCell>
                                <CTableHeaderCell>Harga</CTableHeaderCell>
                                <CTableHeaderCell>Stok & Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {loading ? (
                                // Skeleton loaders
                                Array(5)
                                    .fill(null)
                                    .map((_, index) => (
                                        <CTableRow
                                            key={`skeleton-${index}`}
                                            className="align-middle"
                                        >
                                            <CTableDataCell colSpan={5}>
                                                <div
                                                    style={{
                                                        height: "40px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                            ) : localMotors.data.length > 0 ? (
                                localMotors.data.map((motor) => (
                                    <CTableRow
                                        key={motor.id}
                                        className="align-middle"
                                    >
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="bg-body-tertiary rounded-2 overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: 56,
                                                        height: 42,
                                                    }}
                                                >
                                                    {motor.image_path ? (
                                                        <img
                                                            src={
                                                                motor.image_path.startsWith(
                                                                    "http",
                                                                )
                                                                    ? motor.image_path
                                                                    : `/storage/${motor.image_path}`
                                                            }
                                                            alt={motor.name}
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    ) : (
                                                        <CIcon
                                                            icon={cilBike}
                                                            className="text-body-tertiary"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold text-nowrap">
                                                        {motor.name}
                                                    </div>
                                                    <div className="d-md-none text-body-tertiary small text-nowrap">
                                                        {motor.brand} • {motor.type} • {motor.year}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-md-table-cell">
                                            <div className="fw-medium text-nowrap">
                                                {motor.brand}
                                            </div>
                                            <div className="text-body-tertiary small text-nowrap">
                                                {motor.type} • {motor.year}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <span className="fw-bold text-primary text-nowrap">
                                                Rp{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                ).format(motor.price)}
                                            </span>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {motor.tersedia || motor.tersedia === 1 ? (
                                                <CBadge color="success" shape="rounded-pill">Tersedia</CBadge>
                                            ) : (
                                                <CBadge color="danger" shape="rounded-pill">Kosong</CBadge>
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex gap-1 justify-content-end">
                                                {/* Desktop Actions */}
                                                <div className="d-none d-md-flex gap-1">
                                                    <Link
                                                        href={route("admin.motors.show", motor.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Detail"
                                                    >
                                                        <CIcon icon={cilZoom} size="sm" />
                                                    </Link>
                                                    <Link
                                                        href={route("admin.motors.edit", motor.id)}
                                                        className="btn btn-sm btn-outline-warning"
                                                        title="Edit"
                                                    >
                                                        <CIcon icon={cilPencil} size="sm" />
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(motor)}
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
                                                            <CDropdownItem as={Link} href={route("admin.motors.show", motor.id)}>
                                                                <CIcon icon={cilZoom} className="me-2" /> Detail
                                                            </CDropdownItem>
                                                            <CDropdownItem as={Link} href={route("admin.motors.edit", motor.id)}>
                                                                <CIcon icon={cilPencil} className="me-2" /> Edit
                                                            </CDropdownItem>
                                                            <CDropdownItem 
                                                                onClick={() => confirmDelete(motor)}
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
                                        colSpan={5}
                                        className="text-center py-5 text-body-tertiary"
                                    >
                                        Data tidak ditemukan.
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>

                {/* Pagination */}
                {localMotors.links.length > 3 && (
                    <div className="card-footer d-flex justify-content-center py-3">
                        <CPagination className="mb-0">
                            {localMotors.links.map((link, index) => {
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
