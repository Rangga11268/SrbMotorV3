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
} from "@coreui/icons";

export default function Index({ motors: initialMotors, filters }) {
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
                        <CCol md={4}>
                            <CInputGroup>
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    type="text"
                                    placeholder="Cari nama motor..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3}>
                            <CFormSelect
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            >
                                <option value="">Semua Merk</option>
                                <option value="Yamaha">Yamaha</option>
                                <option value="Honda">Honda</option>
                                <option value="Kawasaki">Kawasaki</option>
                                <option value="Suzuki">Suzuki</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                            <CFormSelect
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Tersedia</option>
                                <option value="0">Kosong</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={2}>
                            {(search || brand || status) && (
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
                                <CTableHeaderCell>Merk / Tipe</CTableHeaderCell>
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
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
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
                                                    <div className="fw-semibold">
                                                        {motor.name}
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                                        {motor.promotions?.map(
                                                            (promo) => {
                                                                const lightColors =
                                                                    [
                                                                        "orange",
                                                                        "yellow",
                                                                        "lime",
                                                                        "cyan",
                                                                        "aqua",
                                                                        "gold",
                                                                        "silver",
                                                                        "white",
                                                                        "lightyellow",
                                                                        "lightblue",
                                                                        "yellowgreen",
                                                                    ];
                                                                const isLight =
                                                                    lightColors.includes(
                                                                        (
                                                                            promo.badge_color ||
                                                                            ""
                                                                        ).toLowerCase(),
                                                                    ) ||
                                                                    (
                                                                        promo.badge_color ||
                                                                        ""
                                                                    ).startsWith(
                                                                        "#ff",
                                                                    ) ||
                                                                    (
                                                                        promo.badge_color ||
                                                                        ""
                                                                    ).startsWith(
                                                                        "#fd",
                                                                    ) ||
                                                                    (
                                                                        promo.badge_color ||
                                                                        ""
                                                                    ).startsWith(
                                                                        "#fe",
                                                                    );
                                                                return (
                                                                    <span
                                                                        key={
                                                                            promo.id
                                                                        }
                                                                        className="badge rounded-pill"
                                                                        style={{
                                                                            backgroundColor:
                                                                                promo.badge_color ||
                                                                                "#3b82f6",
                                                                            color: isLight
                                                                                ? "#111827"
                                                                                : "#ffffff",
                                                                            fontSize:
                                                                                "10px",
                                                                            padding:
                                                                                "3px 8px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            promo.badge_text
                                                                        }
                                                                    </span>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="fw-medium">
                                                {motor.brand}
                                            </div>
                                            <div className="text-body-tertiary small">
                                                {motor.type} • {motor.year}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <span className="fw-bold text-primary">
                                                Rp{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                ).format(motor.price)}
                                            </span>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center gap-2">
                                                {motor.available_units_count > 0 ? (
                                                    <CBadge color="success" shape="rounded-pill">Tersedia</CBadge>
                                                ) : (
                                                    <CBadge color="danger" shape="rounded-pill">Kosong</CBadge>
                                                )}
                                                <div className="d-flex flex-column lh-1">
                                                    <div className="fw-bold small">
                                                        {motor.available_units_count} / {motor.units_count}
                                                    </div>
                                                    <div className="text-body-tertiary" style={{ fontSize: '9px' }}>
                                                        Stok Unit
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex gap-1 justify-content-end">
                                                <Link
                                                    href={route(
                                                        "admin.motors.show",
                                                        motor.id,
                                                    )}
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Detail"
                                                >
                                                    <CIcon
                                                        icon={cilZoom}
                                                        size="sm"
                                                    />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.motor-units.index",
                                                        { motor_id: motor.id }
                                                    )}
                                                    className="btn btn-sm btn-outline-info"
                                                    title="Lihat Unit (Stok)"
                                                >
                                                    <CIcon
                                                        icon={cilStorage}
                                                        size="sm"
                                                    />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.motors.edit",
                                                        motor.id,
                                                    )}
                                                    className="btn btn-sm btn-outline-warning"
                                                    title="Edit"
                                                >
                                                    <CIcon
                                                        icon={cilPencil}
                                                        size="sm"
                                                    />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(motor)
                                                    }
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Hapus"
                                                >
                                                    <CIcon
                                                        icon={cilTrash}
                                                        size="sm"
                                                    />
                                                </button>
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
                        <CPagination>
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
