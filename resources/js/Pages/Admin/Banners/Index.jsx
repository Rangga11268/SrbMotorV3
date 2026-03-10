import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
    CPagination,
    CPaginationItem,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash, cilImage } from "@coreui/icons";
import Swal from "sweetalert2";

export default function BannersIndex({ banners }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Banner akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.banners.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Terhapus!",
                            "Banner berhasil dihapus.",
                            "success",
                        );
                    },
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        return status === "active" ? (
            <CBadge color="success">Aktif</CBadge>
        ) : (
            <CBadge color="secondary">Nonaktif</CBadge>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Banner" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">Daftar Banner</strong>
                            <Link href={route("admin.banners.create")}>
                                <CButton color="primary">
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Tambah Banner
                                </CButton>
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CTable align="middle" bordered hover responsive>
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>
                                            Judul
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Gambar
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Status
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Urutan
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Tanggal Publikasi
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">
                                            Aksi
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {banners.data.map((banner) => (
                                        <CTableRow key={banner.id}>
                                            <CTableDataCell>
                                                <strong>{banner.title}</strong>
                                                {banner.description && (
                                                    <div className="small text-muted">
                                                        {banner.description.substring(
                                                            0,
                                                            50,
                                                        )}
                                                        {banner.description
                                                            .length > 50 &&
                                                            "..."}
                                                    </div>
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {banner.image_path ? (
                                                    <img
                                                        src={
                                                            banner.image_path
                                                        }
                                                        alt={banner.title}
                                                        style={{
                                                            maxWidth: "80px",
                                                            maxHeight: "50px",
                                                            objectFit: "cover",
                                                            borderRadius:
                                                                "4px",
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-muted">
                                                        <CIcon
                                                            icon={cilImage}
                                                        />
                                                    </div>
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {getStatusBadge(
                                                    banner.status,
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <span className="badge bg-info">
                                                    {banner.position}
                                                </span>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {formatDate(
                                                    banner.published_at,
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <Link
                                                    href={route(
                                                        "admin.banners.edit",
                                                        banner.id,
                                                    )}
                                                >
                                                    <CButton
                                                        color="info"
                                                        size="sm"
                                                        className="me-2 text-white"
                                                    >
                                                        <CIcon
                                                            icon={cilPencil}
                                                        />
                                                    </CButton>
                                                </Link>
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(banner.id)
                                                    }
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {banners.data.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan="6"
                                                className="text-center py-4 text-muted"
                                            >
                                                <CIcon
                                                    icon={cilImage}
                                                    size="xl"
                                                    className="d-block mx-auto mb-2 opacity-25"
                                                />
                                                Belum ada banner.
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>

                            {banners.last_page > 1 && (
                                <CPagination className="justify-content-end">
                                    <CPaginationItem
                                        disabled={banners.current_page === 1}
                                    >
                                        <Link
                                            href={banners.first_page_url}
                                            preserveScroll
                                        >
                                            Pertama
                                        </Link>
                                    </CPaginationItem>
                                    {Array.from({
                                        length: banners.last_page,
                                    }).map((_, i) => (
                                        <CPaginationItem
                                            key={i + 1}
                                            active={
                                                banners.current_page ===
                                                i + 1
                                            }
                                        >
                                            <Link
                                                href={`${banners.path}?page=${i + 1}`}
                                                preserveScroll
                                            >
                                                {i + 1}
                                            </Link>
                                        </CPaginationItem>
                                    ))}
                                    <CPaginationItem
                                        disabled={
                                            banners.current_page ===
                                            banners.last_page
                                        }
                                    >
                                        <Link
                                            href={banners.last_page_url}
                                            preserveScroll
                                        >
                                            Terakhir
                                        </Link>
                                    </CPaginationItem>
                                </CPagination>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
