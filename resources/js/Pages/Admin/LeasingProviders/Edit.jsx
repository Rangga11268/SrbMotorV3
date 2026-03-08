import React, { useState } from "react";
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
    CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave } from "@coreui/icons";

export default function Edit({ provider }) {
    const { data, setData, post, processing, errors } = useForm({
        name: provider.name || "",
        logo: null,
        _method: "PUT",
    });

    const [preview, setPreview] = useState(
        provider.logo_path ? `/storage/${provider.logo_path}` : null,
    );

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData("logo", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.leasing-providers.update", provider.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Leasing Provider" />
            <CRow>
                <CCol md={8}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="bg-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Edit Leasing Provider</h5>
                                <Link
                                    href={route(
                                        "admin.leasing-providers.index",
                                    )}
                                >
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
                                    <CFormLabel className="font-weight-bold">
                                        Nama Leasing Provider
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Contoh: BAF (Bussan Auto Finance)"
                                        invalid={!!errors.name}
                                    />
                                    {errors.name && (
                                        <div className="text-danger small mt-1">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <CFormLabel className="font-weight-bold">
                                        Logo (Opsional)
                                    </CFormLabel>
                                    {preview && (
                                        <div className="mb-2">
                                            <img
                                                src={preview}
                                                alt="Logo saat ini"
                                                style={{
                                                    maxHeight: 80,
                                                    objectFit: "contain",
                                                }}
                                                className="border rounded p-2 bg-light"
                                            />
                                            <div className="text-muted small mt-1">
                                                Logo saat ini
                                            </div>
                                        </div>
                                    )}
                                    <CFormInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        invalid={!!errors.logo}
                                    />
                                    <div className="text-muted small mt-1">
                                        Biarkan kosong jika tidak ingin mengubah
                                        logo. Format: JPG, PNG, WebP, SVG. Maks
                                        2MB.
                                    </div>
                                    {errors.logo && (
                                        <div className="text-danger small mt-1">
                                            {errors.logo}
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid mt-4">
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
                                        Perbarui Provider
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
