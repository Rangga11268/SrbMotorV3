import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CFormCheck,
    CButton,
    CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave } from "@coreui/icons";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        badge_text: "",
        badge_color: "orange",
        valid_until: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.promotions.store"));
    };

    return (
        <AdminLayout>
            <Head title="Tambah Promosi" />
            <CRow>
                <CCol md={8}>
                    <CCard className="mb-4 shadow-sm border-0">
                        <CCardHeader className="bg-white border-bottom-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 font-weight-bold">
                                    Tambah Promosi Baru
                                </h5>
                                <Link href={route("admin.promotions.index")}>
                                    <CButton
                                        color="secondary"
                                        variant="outline"
                                        size="sm"
                                    >
                                        <CIcon
                                            icon={cilArrowLeft}
                                            className="me-2"
                                        />
                                        Kembali
                                    </CButton>
                                </Link>
                            </div>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <CForm onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <CFormLabel className="font-weight-bold text-muted small text-uppercase">
                                        Judul Promosi
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="Contoh: Promo Lebaran 2024"
                                        invalid={!!errors.title}
                                    />
                                    {errors.title && (
                                        <div className="text-danger small mt-1">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                <CRow className="mb-4">
                                    <CCol md={6}>
                                        <CFormLabel className="font-weight-bold text-muted small text-uppercase">
                                            Teks Badge
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            value={data.badge_text}
                                            onChange={(e) =>
                                                setData(
                                                    "badge_text",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Diskon 2 Juta"
                                            invalid={!!errors.badge_text}
                                        />
                                        {errors.badge_text && (
                                            <div className="text-danger small mt-1">
                                                {errors.badge_text}
                                            </div>
                                        )}
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel className="font-weight-bold text-muted small text-uppercase">
                                            Warna Badge
                                        </CFormLabel>
                                        <CFormSelect
                                            value={data.badge_color}
                                            onChange={(e) =>
                                                setData(
                                                    "badge_color",
                                                    e.target.value,
                                                )
                                            }
                                            invalid={!!errors.badge_color}
                                        >
                                            <option value="orange">
                                                Orange
                                            </option>
                                            <option value="blue">Biru</option>
                                            <option value="success">
                                                Hijau
                                            </option>
                                            <option value="danger">
                                                Merah
                                            </option>
                                            <option value="warning">
                                                Kuning
                                            </option>
                                            <option value="info">Cyan</option>
                                        </CFormSelect>
                                        {errors.badge_color && (
                                            <div className="text-danger small mt-1">
                                                {errors.badge_color}
                                            </div>
                                        )}
                                    </CCol>
                                </CRow>

                                <div className="mb-4">
                                    <CFormLabel className="font-weight-bold text-muted small text-uppercase">
                                        Berlaku Sampai (Opsional)
                                    </CFormLabel>
                                    <CFormInput
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) =>
                                            setData(
                                                "valid_until",
                                                e.target.value,
                                            )
                                        }
                                        invalid={!!errors.valid_until}
                                    />
                                    {errors.valid_until && (
                                        <div className="text-danger small mt-1">
                                            {errors.valid_until}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <CFormCheck
                                        id="is_active"
                                        label="Aktifkan Promosi"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                </div>

                                <div className="d-grid mt-5">
                                    <CButton
                                        color="primary"
                                        type="submit"
                                        disabled={processing}
                                        size="lg"
                                    >
                                        <CIcon
                                            icon={cilSave}
                                            className="me-2"
                                        />
                                        Simpan Promosi
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={4}>
                    <CAlert
                        color="info"
                        className="border-0 shadow-sm border-start border-4 border-info"
                    >
                        <h6 className="font-weight-bold">Tips</h6>
                        <p className="small mb-0">
                            Pilih warna yang kontras dengan gambar motor. Teks
                            badge sebaiknya singkat dan padat (maksimal 20
                            karakter) agar mudah terbaca di pita promosi.
                        </p>
                    </CAlert>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
