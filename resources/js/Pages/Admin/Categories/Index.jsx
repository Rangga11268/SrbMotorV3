import React, { useState } from "react";
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
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash, cilTag } from "@coreui/icons";
import Swal from "sweetalert2";

export default function CategoriesIndex({ categories }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Kategori akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.categories.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Terhapus!",
                            "Kategori berhasil dihapus.",
                            "success",
                        );
                    },
                });
            }
        });
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <CBadge color="success">Aktif</CBadge>
        ) : (
            <CBadge color="secondary">Nonaktif</CBadge>
        );
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Kategori Berita" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">
                                Daftar Kategori Berita
                            </strong>
                            <Link href={route("admin.categories.create")}>
                                <CButton color="primary">
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Tambah Kategori
                                </CButton>
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CTable align="middle" bordered hover responsive>
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>
                                            Nama Kategori
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Slug
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Deskripsi
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Status
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Urutan
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">
                                            Aksi
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {categories.data.map((category) => (
                                        <CTableRow key={category.id}>
                                            <CTableDataCell>
                                                <strong>{category.name}</strong>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <code className="text-muted">
                                                    {category.slug}
                                                </code>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {category.description ? (
                                                    <span className="text-muted small">
                                                        {category.description.substring(
                                                            0,
                                                            50,
                                                        )}
                                                        {category.description
                                                            .length > 50 &&
                                                            "..."}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">
                                                        -
                                                    </span>
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {getStatusBadge(
                                                    category.is_active,
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <span className="badge bg-info">
                                                    {category.order}
                                                </span>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <Link
                                                    href={route(
                                                        "admin.categories.edit",
                                                        category.id,
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
                                                        handleDelete(category.id)
                                                    }
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {categories.data.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan="6"
                                                className="text-center py-4 text-muted"
                                            >
                                                <CIcon
                                                    icon={cilTag}
                                                    size="xl"
                                                    className="d-block mx-auto mb-2 opacity-25"
                                                />
                                                Belum ada kategori.
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
