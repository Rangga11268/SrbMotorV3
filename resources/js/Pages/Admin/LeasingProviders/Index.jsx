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
import { cilPlus, cilPencil, cilTrash, cilIndustry } from "@coreui/icons";
import Swal from "sweetalert2";

export default function Index({ providers }) {
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
                                    {providers.data.map((provider, index) => (
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
                                                        src={provider.logo_path}
                                                        alt={provider.name}
                                                        height="30"
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
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {providers.data.length === 0 && (
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
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
