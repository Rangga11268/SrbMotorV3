import React, { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
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
import { cilSave, cilArrowLeft } from "@coreui/icons";

export default function NewsCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: "",
        title: "",
        content: "",
        excerpt: "",
        featured_image: null,
        status: "draft",
        published_at: "",
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("featured_image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.news.store"));
    };

    return (
        <AdminLayout>
            <Head title="Tambah Berita" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">
                                Tambah Berita Baru
                            </strong>
                            <Link
                                href={route("admin.news.index")}
                                className="btn btn-sm btn-secondary"
                            >
                                <CIcon icon={cilArrowLeft} className="me-2" />
                                Kembali
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-8">
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="title">
                                                Judul Berita
                                            </CFormLabel>
                                            <CFormInput
                                                id="title"
                                                type="text"
                                                placeholder="Masukkan judul berita"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.title}
                                                feedbackInvalid={errors.title}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel htmlFor="excerpt">
                                                Ringkasan (Excerpt)
                                            </CFormLabel>
                                            <CFormTextarea
                                                id="excerpt"
                                                rows={2}
                                                placeholder="Ringkasan singkat berita untuk preview"
                                                value={data.excerpt}
                                                onChange={(e) =>
                                                    setData(
                                                        "excerpt",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.excerpt}
                                                feedbackInvalid={errors.excerpt}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel htmlFor="content">
                                                Konten Berita
                                            </CFormLabel>
                                            <RichTextEditor
                                                value={data.content}
                                                onChange={(html) =>
                                                    setData("content", html)
                                                }
                                                placeholder="Tulis konten berita dengan formatting di sini..."
                                                error={errors.content}
                                                minHeight="400px"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mb-3 p-3 bg-light rounded-3 border">
                                            <h6 className="mb-3">
                                                Pengaturan Publikasi
                                            </h6>

                                            <div className="mb-3">
                                                <CFormLabel htmlFor="category">
                                                    Kategori
                                                </CFormLabel>
                                                <CFormSelect
                                                    id="category"
                                                    value={data.category_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "category_id",
                                                            e.target.value,
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.category_id
                                                    }
                                                    feedbackInvalid={
                                                        errors.category_id
                                                    }
                                                >
                                                    <option value="">
                                                        Pilih Kategori
                                                    </option>
                                                    {categories.map((cat) => (
                                                        <option
                                                            key={cat.id}
                                                            value={cat.id}
                                                        >
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </CFormSelect>
                                            </div>

                                            <div className="mb-3">
                                                <CFormLabel htmlFor="status">
                                                    Status
                                                </CFormLabel>
                                                <CFormSelect
                                                    id="status"
                                                    value={data.status}
                                                    onChange={(e) =>
                                                        setData(
                                                            "status",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="draft">
                                                        Draft
                                                    </option>
                                                    <option value="published">
                                                        Dipublikasi
                                                    </option>
                                                    <option value="archived">
                                                        Diarsip
                                                    </option>
                                                </CFormSelect>
                                            </div>

                                            {data.status === "published" && (
                                                <div className="mb-3">
                                                    <CFormLabel htmlFor="published_at">
                                                        Tanggal Publikasi
                                                    </CFormLabel>
                                                    <CFormInput
                                                        id="published_at"
                                                        type="datetime-local"
                                                        value={
                                                            data.published_at
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "published_at",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3 p-3 bg-light rounded-3 border">
                                            <h6 className="mb-3">
                                                Gambar Unggulan
                                            </h6>
                                            <div className="mb-3">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <small className="text-muted d-block mt-2">
                                                    Format: JPG, PNG, GIF (Max
                                                    5MB)
                                                </small>
                                            </div>

                                            {imagePreview && (
                                                <div className="mb-3">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
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
                                                aria-hidden="true"
                                            />
                                        )}
                                        <CIcon
                                            icon={cilSave}
                                            className="me-2"
                                        />
                                        Simpan Berita
                                    </CButton>
                                    <Link
                                        href={route("admin.news.index")}
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
