import React from "react";
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
    CFormCheck,
    CButton,
    CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSave, cilArrowLeft } from "@coreui/icons";

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        icon: "",
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"));
    };

    return (
        <AdminLayout>
            <Head title="Tambah Kategori Berita" />
            <CRow>
                <CCol xs={12} lg={8}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">
                                Tambah Kategori Berita Baru
                            </strong>
                            <Link
                                href={route("admin.categories.index")}
                                className="btn btn-sm btn-secondary"
                            >
                                <CIcon icon={cilArrowLeft} className="me-2" />
                                Kembali
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="name">
                                        Nama Kategori *
                                    </CFormLabel>
                                    <CFormInput
                                        id="name"
                                        type="text"
                                        placeholder="Contoh: Berita Promo, Tips & Trik"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        isInvalid={!!errors.name}
                                        feedbackInvalid={errors.name}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="description">
                                        Deskripsi Kategori
                                    </CFormLabel>
                                    <CFormTextarea
                                        id="description"
                                        rows={3}
                                        placeholder="Deskripsi singkat kategori ini"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        isInvalid={!!errors.description}
                                        feedbackInvalid={errors.description}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormLabel htmlFor="icon">
                                        Kelas Icon (Optional)
                                    </CFormLabel>
                                    <CFormInput
                                        id="icon"
                                        type="text"
                                        placeholder="Contoh: cilNewspaper, cilTag"
                                        value={data.icon}
                                        onChange={(e) =>
                                            setData("icon", e.target.value)
                                        }
                                        isInvalid={!!errors.icon}
                                        feedbackInvalid={errors.icon}
                                    />
                                    <small className="text-muted d-block mt-1">
                                        Dari @coreui/icons (contoh:
                                        cilNewspaper)
                                    </small>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="order">
                                                Urutan Tampilan
                                            </CFormLabel>
                                            <CFormInput
                                                id="order"
                                                type="number"
                                                min="0"
                                                value={data.order}
                                                onChange={(e) =>
                                                    setData(
                                                        "order",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.order}
                                                feedbackInvalid={errors.order}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <CFormCheck
                                                id="is_active"
                                                label="Kategori Aktif"
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_active",
                                                        e.target.checked,
                                                    )
                                                }
                                            />
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
                                        Simpan Kategori
                                    </CButton>
                                    <Link
                                        href={route("admin.categories.index")}
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
