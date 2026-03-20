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
    CBadge,
    CPagination,
    CPaginationItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilPlus,
    cilPencil,
    cilTrash,
    cilSearch,
    cilNewspaper,
} from "@coreui/icons";
import Swal from "sweetalert2";

export default function NewsIndex({ posts }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Berita akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.news.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Terhapus!",
                            "Berita berhasil dihapus.",
                            "success",
                        );
                    },
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "published":
                return <CBadge color="success">Dipublikasi</CBadge>;
            case "draft":
                return <CBadge color="warning">Draft</CBadge>;
            case "archived":
                return <CBadge color="secondary">Diarsip</CBadge>;
            default:
                return <CBadge color="info">{status}</CBadge>;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Berita" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">Daftar Berita</strong>
                            <Link href={route("admin.news.create")}>
                                <CButton color="primary">
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Tambah Berita
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
                                            Kategori
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Status
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Diterbitkan
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Views
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">
                                            Aksi
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {posts.data.map((post) => (
                                        <CTableRow key={post.id}>
                                            <CTableDataCell style={{ minWidth: '200px' }}>
                                                <div className="fw-bold text-truncate-2">
                                                    {post.title}
                                                </div>
                                                <small className="text-muted text-truncate d-block" style={{ maxWidth: '180px' }}>
                                                    {post.slug}
                                                </small>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-nowrap">
                                                {post.category?.name}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {getStatusBadge(post.status)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-nowrap">
                                                {post.published_at
                                                    ? formatDate(
                                                          post.published_at,
                                                      )
                                                    : "-"}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-nowrap">
                                                <CBadge color="info">
                                                    {post.views}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <Link
                                                    href={route(
                                                        "admin.news.edit",
                                                        post.id,
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
                                                <Link
                                                    href={route(
                                                        "admin.news.show",
                                                        post.id,
                                                    )}
                                                >
                                                    <CButton
                                                        color="success"
                                                        size="sm"
                                                        className="me-2 text-white"
                                                    >
                                                        <CIcon
                                                            icon={cilSearch}
                                                        />
                                                    </CButton>
                                                </Link>
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(post.id)
                                                    }
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {posts.data.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan="6"
                                                className="text-center py-4 text-muted"
                                            >
                                                <CIcon
                                                    icon={cilNewspaper}
                                                    size="xl"
                                                    className="d-block mx-auto mb-2 opacity-25"
                                                />
                                                Belum ada berita.
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>

                            {posts.last_page > 1 && (
                                <CPagination className="mt-4" align="center">
                                    {posts.current_page > 1 && (
                                        <>
                                            <CPaginationItem>
                                                <Link
                                                    href={posts.first_page_url}
                                                >
                                                    Pertama
                                                </Link>
                                            </CPaginationItem>
                                            <CPaginationItem>
                                                <Link
                                                    href={posts.prev_page_url}
                                                >
                                                    Sebelumnya
                                                </Link>
                                            </CPaginationItem>
                                        </>
                                    )}

                                    {posts.current_page > 1 && (
                                        <CPaginationItem>
                                            <Link
                                                href={`?page=${posts.current_page - 1}`}
                                            >
                                                {posts.current_page - 1}
                                            </Link>
                                        </CPaginationItem>
                                    )}

                                    <CPaginationItem active>
                                        {posts.current_page}
                                    </CPaginationItem>

                                    {posts.current_page < posts.last_page && (
                                        <CPaginationItem>
                                            <Link
                                                href={`?page=${posts.current_page + 1}`}
                                            >
                                                {posts.current_page + 1}
                                            </Link>
                                        </CPaginationItem>
                                    )}

                                    {posts.current_page < posts.last_page && (
                                        <>
                                            <CPaginationItem>
                                                <Link
                                                    href={posts.next_page_url}
                                                >
                                                    Berikutnya
                                                </Link>
                                            </CPaginationItem>
                                            <CPaginationItem>
                                                <Link
                                                    href={posts.last_page_url}
                                                >
                                                    Terakhir
                                                </Link>
                                            </CPaginationItem>
                                        </>
                                    )}
                                </CPagination>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
