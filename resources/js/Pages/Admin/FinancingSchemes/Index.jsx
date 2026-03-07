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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash, cilCalculator } from "@coreui/icons";
import Swal from "sweetalert2";

export default function Index({ schemes }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Skema cicilan akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.financing-schemes.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Terhapus!",
                            "Skema berhasil dihapus.",
                            "success",
                        );
                    },
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Skema Cicilan" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">
                                Daftar Skema Cicilan
                            </strong>
                            <Link
                                href={route("admin.financing-schemes.create")}
                            >
                                <CButton color="primary">
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Tambah Skema
                                </CButton>
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CTable align="middle" bordered hover responsive>
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>
                                            Motor
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Provider
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Tenor
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            DP (Uang Muka)
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Cicilan / Bln
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">
                                            Aksi
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {schemes.data.map((scheme) => (
                                        <CTableRow key={scheme.id}>
                                            <CTableDataCell>
                                                {scheme.motor?.name}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {scheme.provider?.name}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {scheme.tenor} Bulan
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                Rp{" "}
                                                {parseFloat(
                                                    scheme.dp_amount,
                                                ).toLocaleString("id-ID")}
                                            </CTableDataCell>
                                            <CTableDataCell className="font-weight-bold text-primary">
                                                Rp{" "}
                                                {parseFloat(
                                                    scheme.monthly_installment,
                                                ).toLocaleString("id-ID")}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <Link
                                                    href={route(
                                                        "admin.financing-schemes.edit",
                                                        scheme.id,
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
                                                        handleDelete(scheme.id)
                                                    }
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {schemes.data.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan="6"
                                                className="text-center py-4 text-muted"
                                            >
                                                <CIcon
                                                    icon={cilCalculator}
                                                    size="xl"
                                                    className="d-block mx-auto mb-2 opacity-25"
                                                />
                                                Belum ada data skema cicilan.
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
