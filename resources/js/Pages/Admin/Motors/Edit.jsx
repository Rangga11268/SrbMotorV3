import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm, router } from "@inertiajs/react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CFormTextarea,
    CCallout,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave, cilTrash, cilBike } from "@coreui/icons";
import toast from "react-hot-toast";

export default function Edit({ motor, promotions }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        name: motor.name || "",
        brand: motor.brand || "Yamaha",
        model: motor.model || "",
        price: motor.price || "",
        year: motor.year || new Date().getFullYear(),
        type: motor.type || "",
        tersedia: motor.tersedia,
        image: null,
        description: motor.description || "",
        promotion_ids: motor.promotions
            ? motor.promotions.map((p) => p.id)
            : [],
    });

    const [previewUrl, setPreviewUrl] = useState(
        motor.image_path
            ? motor.image_path.startsWith("http")
                ? motor.image_path
                : `/storage/${motor.image_path}`
            : null,
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const togglePromotion = (id) => {
        const currentIds = [...data.promotion_ids];
        const index = currentIds.indexOf(id);
        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            currentIds.push(id);
        }
        setData("promotion_ids", currentIds);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.motors.update", motor.id), {
            onSuccess: () => toast.success("Data motor berhasil diperbarui"),
        });
    };

    const handleDelete = () => {
        if (confirm("Apakah Anda yakin ingin menghapus motor ini?")) {
            router.delete(route("admin.motors.destroy", motor.id));
        }
    };

    return (
        <AdminLayout title="Edit Motor">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.motors.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <CBadge color="info" shape="rounded-pill" className="px-3 py-2">
                    Mode Edit
                </CBadge>
            </div>

            <form onSubmit={handleSubmit}>
                <CRow>
                    <CCol xl={8}>
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Data Utama</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={12}>
                                        <CFormLabel>Nama Motor</CFormLabel>
                                        <CFormInput
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            invalid={!!errors.name}
                                            feedbackInvalid={errors.name}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Merk</CFormLabel>
                                        <CFormSelect
                                            value={data.brand}
                                            onChange={(e) =>
                                                setData("brand", e.target.value)
                                            }
                                        >
                                            <option value="Yamaha">
                                                Yamaha
                                            </option>
                                            <option value="Honda">Honda</option>
                                            <option value="Kawasaki">
                                                Kawasaki
                                            </option>
                                            <option value="Suzuki">
                                                Suzuki
                                            </option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Tipe</CFormLabel>
                                        <CFormInput
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Harga (Rp)</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData("price", e.target.value)
                                            }
                                            invalid={!!errors.price}
                                            feedbackInvalid={errors.price}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Tahun</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.year}
                                            onChange={(e) =>
                                                setData("year", e.target.value)
                                            }
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Ketersediaan</CFormLabel>
                                        <div className="d-flex gap-2">
                                            <CButton
                                                type="button"
                                                color={
                                                    data.tersedia == 1
                                                        ? "success"
                                                        : "light"
                                                }
                                                onClick={() =>
                                                    setData("tersedia", 1)
                                                }
                                                className="flex-fill"
                                            >
                                                Tersedia
                                            </CButton>
                                            <CButton
                                                type="button"
                                                color={
                                                    data.tersedia == 0
                                                        ? "danger"
                                                        : "light"
                                                }
                                                onClick={() =>
                                                    setData("tersedia", 0)
                                                }
                                                className="flex-fill"
                                            >
                                                Kosong
                                            </CButton>
                                        </div>
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormLabel>
                                            Gambar Motor (opsional)
                                        </CFormLabel>
                                        <CFormInput
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <div className="form-text">
                                            Biarkan kosong jika tidak ingin
                                            mengubah gambar.
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4 shadow-sm border-0">
                            <CCardHeader className="bg-white border-bottom">
                                <strong>Pilih Promosi Aktif</strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="d-flex flex-wrap gap-2">
                                    {promotions.map((promo) => (
                                        <CButton
                                            key={promo.id}
                                            type="button"
                                            color={
                                                data.promotion_ids.includes(
                                                    promo.id,
                                                )
                                                    ? promo.badge_color
                                                    : "light"
                                            }
                                            variant={
                                                data.promotion_ids.includes(
                                                    promo.id,
                                                )
                                                    ? "solid"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                togglePromotion(promo.id)
                                            }
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <span
                                                className={`badge bg-${data.promotion_ids.includes(promo.id) ? "white text-" + promo.badge_color : promo.badge_color}`}
                                            >
                                                {promo.badge_text}
                                            </span>
                                            {promo.title}
                                        </CButton>
                                    ))}
                                    {promotions.length === 0 && (
                                        <div className="text-muted small italic">
                                            Tidak ada promosi aktif yang
                                            tersedia.
                                        </div>
                                    )}
                                </div>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>
                                    Deskripsi Motor (Spesifikasi & Promo)
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={12}>
                                        <CFormLabel>
                                            Konten Deskripsi (Mendukung Format
                                            HTML)
                                        </CFormLabel>
                                        <CFormTextarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            rows={8}
                                            placeholder="Tuliskan spesifikasi lengkap, keunggulan, dan promo motor ini..."
                                        />
                                        <div className="form-text mt-2">
                                            Anda bisa copy-paste dari
                                            spesifikasi pabrik atau tambahkan
                                            tabel secara manual. Nanti akan
                                            dirender sebagai Rich Text di
                                            halaman depan.
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                        <CButton
                            type="submit"
                            color="primary"
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="spinner-border spinner-border-sm" />
                            ) : (
                                <CIcon icon={cilSave} />
                            )}
                            Simpan Perubahan
                        </CButton>
                    </CCol>

                    <CCol xl={4}>
                        <div className="sticky-top" style={{ top: "5rem" }}>
                            <CCard className="mb-4">
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong>Pratinjau</strong>
                                </CCardHeader>
                                <CCardBody className="p-2">
                                    <div
                                        className="bg-body-tertiary rounded-2 overflow-hidden d-flex align-items-center justify-content-center mb-3"
                                        style={{ aspectRatio: "4/3" }}
                                    >
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        ) : (
                                            <CIcon
                                                icon={cilBike}
                                                size="3xl"
                                                className="text-body-tertiary"
                                            />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h5 className="fw-bold mb-1">
                                            {data.name || "Nama Motor"}
                                        </h5>
                                        <div className="text-body-secondary small mb-2">
                                            {data.brand} • {data.type || "Tipe"}{" "}
                                            • {data.year}
                                        </div>
                                        <div className="h5 text-primary fw-bold">
                                            Rp{" "}
                                            {data.price
                                                ? new Intl.NumberFormat(
                                                      "id-ID",
                                                  ).format(data.price)
                                                : "0"}
                                        </div>
                                        {data.tersedia == 1 ? (
                                            <CBadge
                                                color="success"
                                                shape="rounded-pill"
                                            >
                                                Tersedia
                                            </CBadge>
                                        ) : (
                                            <CBadge
                                                color="danger"
                                                shape="rounded-pill"
                                            >
                                                Kosong
                                            </CBadge>
                                        )}
                                    </div>
                                </CCardBody>
                            </CCard>

                            <CCard className="border-danger">
                                <CCardBody>
                                    <h6 className="text-danger fw-bold mb-2">
                                        <CIcon
                                            icon={cilTrash}
                                            size="sm"
                                            className="me-1"
                                        />
                                        Zona Bahaya
                                    </h6>
                                    <p className="text-body-secondary small mb-3">
                                        Menghapus motor ini akan menghilangkan
                                        data secara permanen.
                                    </p>
                                    <CButton
                                        color="danger"
                                        variant="outline"
                                        className="w-100"
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        Hapus Motor
                                    </CButton>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                </CRow>
            </form>
        </AdminLayout>
    );
}
