import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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
} from "@coreui/icons";
import toast from "react-hot-toast";

export default function Index({ motors, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [brand, setBrand] = useState(filters.brand || "");
    const [status, setStatus] = useState(filters.status || "");
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("admin.motors.index"),
                { search, brand, status },
                { preserveState: true, replace: true },
            );
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
        if (confirm(`Apakah Anda yakin ingin menghapus ${motor.name}?`)) {
            router.delete(route("admin.motors.destroy", motor.id), {
                onSuccess: () => toast.success("Data unit berhasil dihapus"),
            });
        }
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
            <CCard>
                <CCardBody className="p-0">
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="text-body-secondary bg-body-tertiary">
                            <CTableRow>
                                <CTableHeaderCell>Motor</CTableHeaderCell>
                                <CTableHeaderCell>Merk / Tipe</CTableHeaderCell>
                                <CTableHeaderCell>Harga</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {motors.data.length > 0 ? (
                                motors.data.map((motor) => (
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
                                            {motor.tersedia ? (
                                                <CBadge
                                                    color="success"
                                                    shape="rounded-pill"
                                                >
                                                    Tersedia
                                                </CBadge>
                                            ) : (
                                                <CBadge
                                                    color="danger"
                                                    shape="rounded-pill"
                                                >
                                                    Kosong
                                                </CBadge>
                                            )}
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
                {motors.links.length > 3 && (
                    <div className="card-footer d-flex justify-content-center py-3">
                        <CPagination>
                            {motors.links.map((link, index) => {
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
