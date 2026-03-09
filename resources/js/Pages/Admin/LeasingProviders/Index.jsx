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
    CAvatar,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilPlus,
    cilPencil,
    cilTrash,
    cilIndustry,
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

export default function Index({ providers: initialProviders, filters }) {
    const [localProviders, setLocalProviders] = useState(initialProviders);
    const [search, setSearch] = useState(filters?.search || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchProviders = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(
                route("admin.leasing-providers.index"),
                {
                    params: currentFilters,
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                },
            );
            if (response.data.providers) {
                setLocalProviders(response.data.providers);
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
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

            fetchProviders(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data leasing provider akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.leasing-providers.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Terhapus!",
                            "Provider berhasil dihapus.",
                            "success",
                        );
                    },
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Leasing" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">
                                Daftar Leasing Provider
                            </strong>
                            <Link
                                href={route("admin.leasing-providers.create")}
                            >
                                <CButton color="primary">
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Tambah Provider
                                </CButton>
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CRow className="mb-3 g-3">
                                <CCol md={12}>
                                    <CInputGroup>
                                        <CInputGroupText>
                                            <CIcon icon={cilSearch} size="sm" />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Cari nama leasing..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                        {search && (
                                            <CButton
                                                color="light"
                                                onClick={() => setSearch("")}
                                                className="d-flex align-items-center"
                                            >
                                                <CIcon
                                                    icon={cilReload}
                                                    size="sm"
                                                />
                                            </CButton>
                                        )}
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                            <CTable
                                align="middle"
                                bordered
                                hover
                                responsive
                                className="mb-0"
                            >
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell
                                            className="text-center"
                                            style={{ width: "40px" }}
                                        >
                                            #
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Nama Provider
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Logo
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">
                                            Aksi
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {localProviders.data.map(
                                        (provider, index) => (
                                            <CTableRow key={provider.id}>
                                                <CTableDataCell className="text-center">
                                                    {index + 1}
                                                </CTableDataCell>
                                                <CTableDataCell className="font-weight-bold">
                                                    {provider.name}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {provider.logo_path ? (
                                                        <img
                                                            src={
                                                                provider.logo_path
                                                            }
                                                            alt={provider.name}
                                                            style={{
                                                                maxHeight:
                                                                    "30px",
                                                                maxWidth:
                                                                    "100px",
                                                                objectFit:
                                                                    "contain",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="bg-light p-2 rounded text-muted small d-inline-block">
                                                            No Logo
                                                        </div>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <Link
                                                        href={route(
                                                            "admin.leasing-providers.edit",
                                                            provider.id,
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
                                                            handleDelete(
                                                                provider.id,
                                                            )
                                                        }
                                                    >
                                                        <CIcon
                                                            icon={cilTrash}
                                                        />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ),
                                    )}
                                    {localProviders.data.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan="4"
                                                className="text-center py-4 text-muted"
                                            >
                                                <CIcon
                                                    icon={cilIndustry}
                                                    size="xl"
                                                    className="d-block mx-auto mb-2 opacity-25"
                                                />
                                                Belum ada data leasing provider.
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>

                            {localProviders.links.length > 3 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <CPagination>
                                        {localProviders.links.map(
                                            (link, index) => (
                                                <CPaginationItem
                                                    key={index}
                                                    active={link.active}
                                                    disabled={!link.url}
                                                    href={link.url || "#"}
                                                    as={
                                                        link.url ? Link : "span"
                                                    }
                                                >
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                </CPaginationItem>
                                            ),
                                        )}
                                    </CPagination>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
