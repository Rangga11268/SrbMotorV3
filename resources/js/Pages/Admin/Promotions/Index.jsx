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
import {
    cilPlus,
    cilPencil,
    cilTrash,
    cilSearch,
    cilReload,
} from "@coreui/icons";
import Swal from "sweetalert2";
import {
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CPagination,
    CPaginationItem,
} from "@coreui/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Index({ promotions: initialPromotions, filters }) {
    const [localPromotions, setLocalPromotions] = useState(initialPromotions);
    const [search, setSearch] = useState(filters?.search || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchPromotions = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.promotions.index"), {
                params: currentFilters,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            if (response.data.promotions) {
                setLocalPromotions(response.data.promotions);
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
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

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);

            fetchPromotions(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

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
