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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash } from "@coreui/icons";
import Swal from "sweetalert2";

export default function Index({ promotions }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data promosi akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.promotions.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Terhapus!",
                            "Promosi berhasil dihapus.",
                            "success",
                        );
                    },
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Promosi" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader className="d-flex justify-content-between align-items-center">
                            <strong>Daftar Promosi</strong>
                            <Link href={route("admin.promotions.create")}>
                                <CButton color="primary" size="sm">
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Tambah Promosi
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
                                            Teks Badge
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Warna
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Status
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Berlaku Sampai
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Aksi
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {promotions.data.map((promo) => (
                                        <CTableRow key={promo.id}>
                                            <CTableDataCell>
                                                {promo.title}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {promo.badge_text ? (
                                                    <span
                                                        className="badge rounded-pill"
                                                        style={{
                                                            backgroundColor:
                                                                promo.badge_color,
                                                            color: [
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
                                                            ].includes(
                                                                (
                                                                    promo.badge_color ||
                                                                    ""
                                                                ).toLowerCase(),
                                                            )
                                                                ? "#111827"
                                                                : "#ffffff",
                                                            padding: "4px 10px",
                                                        }}
                                                    >
                                                        {promo.badge_text}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted small">
                                                        -
                                                    </span>
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {promo.badge_color}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {promo.is_active ? (
                                                    <CBadge color="success">
                                                        Aktif
                                                    </CBadge>
                                                ) : (
                                                    <CBadge color="secondary">
                                                        Non-aktif
                                                    </CBadge>
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {promo.valid_until
                                                    ? new Date(
                                                          promo.valid_until,
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                      )
                                                    : "-"}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <Link
                                                    href={route(
                                                        "admin.promotions.edit",
                                                        promo.id,
                                                    )}
                                                >
                                                    <CButton
                                                        color="info"
                                                        size="sm"
                                                        className="me-2"
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
                                                        handleDelete(promo.id)
                                                    }
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {promotions.data.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan="6"
                                                className="text-center"
                                            >
                                                Belum ada data promosi.
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
