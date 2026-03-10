import React, { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
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
    CFormTextarea,
    CFormSelect,
    CButton,
    CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSave, cilArrowLeft, cilImage } from "@coreui/icons";

export default function BannersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        image: null,
        button_text: "",
        button_url: "",
        status: "inactive",
        position: 0,
        published_at: "",
        expired_at: "",
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.banners.store"));
    };

    return (
        <AdminLayout>
            <Head title="Tambah Banner" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">Tambah Banner Baru</strong>
                            <Link
                                href={route("admin.banners.index")}
                                className="btn btn-sm btn-secondary"
                            >
                                <CIcon icon={cilArrowLeft} className="me-2" />
                                Kembali
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <CFormLabel htmlFor="title">
                                        Judul Banner *
                                    </CFormLabel>
                                    <CFormInput
                                        id="title"
                                        type="text"
                                        placeholder="Masukkan judul banner"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        isInvalid={!!errors.title}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback d-block">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <CFormLabel htmlFor="description">
                                        Deskripsi
                                    </CFormLabel>
                                    <CFormTextarea
                                        id="description"
                                        placeholder="Deskripsi banner"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <CFormLabel htmlFor="image">
                                        Gambar Banner
                                    </CFormLabel>
                                    <div className="mb-3">
                                        <input
                                            type="file"
                                            id="image"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            isInvalid={!!errors.image}
                                        />
                                        {errors.image && (
                                            <div className="invalid-feedback d-block">
                                                {errors.image}
                                            </div>
                                        )}
                                    </div>
                                    {imagePreview && (
                                        <div className="mt-3">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: "300px",
                                                    maxHeight: "200px",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <CFormLabel htmlFor="button_text">
                                            Teks Tombol
                                        </CFormLabel>
                                        <CFormInput
                                            id="button_text"
                                            type="text"
                                            placeholder="Contoh: Lihat Selengkapnya"
                                            value={data.button_text}
                                            onChange={(e) =>
                                                setData(
                                                    "button_text",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <CFormLabel htmlFor="button_url">
                                            URL Tombol
                                        </CFormLabel>
                                        <CFormInput
                                            id="button_url"
                                            type="url"
                                            placeholder="https://example.com"
                                            value={data.button_url}
                                            onChange={(e) =>
                                                setData(
                                                    "button_url",
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.button_url}
                                        />
                                        {errors.button_url && (
                                            <div className="invalid-feedback d-block">
                                                {errors.button_url}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <CFormLabel htmlFor="status">
                                            Status *
                                        </CFormLabel>
                                        <CFormSelect
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData("status", e.target.value)
                                            }
                                            isInvalid={!!errors.status}
                                        >
                                            <option value="inactive">
                                                Nonaktif
                                            </option>
                                            <option value="active">
                                                Aktif
                                            </option>
                                        </CFormSelect>
                                        {errors.status && (
                                            <div className="invalid-feedback d-block">
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <CFormLabel htmlFor="position">
                                            Urutan Tampilan *
                                        </CFormLabel>
                                        <CFormInput
                                            id="position"
                                            type="number"
                                            min="0"
                                            value={data.position}
                                            onChange={(e) =>
                                                setData(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.position}
                                        />
                                        {errors.position && (
                                            <div className="invalid-feedback d-block">
                                                {errors.position}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <CFormLabel htmlFor="published_at">
                                            Tanggal Publikasi
                                        </CFormLabel>
                                        <CFormInput
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) =>
                                                setData(
                                                    "published_at",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <CFormLabel htmlFor="expired_at">
                                            Tanggal Kadaluarsa
                                        </CFormLabel>
                                        <CFormInput
                                            id="expired_at"
                                            type="datetime-local"
                                            value={data.expired_at}
                                            onChange={(e) =>
                                                setData("expired_at", e.target.value)
                                            }
                                            isInvalid={!!errors.expired_at}
                                        />
                                        {errors.expired_at && (
                                            <div className="invalid-feedback d-block">
                                                {errors.expired_at}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mt-4">
                                    <CButton
                                        type="submit"
                                        color="primary"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <CSpinner
                                                component="span"
                                                size="sm"
                                                className="me-2"
                                            />
                                        )}
                                        <CIcon icon={cilSave} className="me-2" />
                                        Simpan Banner
                                    </CButton>
                                    <Link
                                        href={route("admin.banners.index")}
                                        className="btn btn-secondary"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
