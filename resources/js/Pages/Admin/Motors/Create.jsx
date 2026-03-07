import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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
import { cilArrowLeft, cilSave, cilBike } from "@coreui/icons";
import toast from "react-hot-toast";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        brand: "Yamaha",
        model: "",
        price: "",
        year: new Date().getFullYear(),
        type: "",
        tersedia: 1,
        image: null,
        specifications: {
            engine_type: "",
            engine_size: "",
            fuel_system: "",
            transmission: "",
            max_power: "",
            max_torque: "",
            additional_specs: "",
        },
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.motors.store"), {
            onSuccess: () => toast.success("Motor berhasil ditambahkan"),
        });
    };

    const handleSpecChange = (key, value) => {
        setData("specifications", { ...data.specifications, [key]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    const specFields = [
        { key: "engine_type", label: "Tipe Mesin" },
        { key: "engine_size", label: "Kapasitas (cc)" },
        { key: "fuel_system", label: "Sistem Bahan Bakar" },
        { key: "transmission", label: "Transmisi" },
        { key: "max_power", label: "Tenaga Maksimum" },
        { key: "max_torque", label: "Torsi Maksimum" },
    ];

    return (
        <AdminLayout title="Tambah Motor Baru">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.motors.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <CBadge
                    color="success"
                    shape="rounded-pill"
                    className="px-3 py-2"
                >
                    Data Baru
                </CBadge>
            </div>

            <form onSubmit={handleSubmit}>
                <CRow>
                    {/* Main Form */}
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
                                            placeholder="Contoh: ZX-25R ABS SE"
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
                                            placeholder="Contoh: Sport"
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
                                            placeholder="0"
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
                                            placeholder="2025"
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
                                        <CFormLabel>Gambar Motor</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {errors.image && (
                                            <div className="text-danger small mt-1">
                                                {errors.image}
                                            </div>
                                        )}
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Spesifikasi Teknis</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    {specFields.map((spec) => (
                                        <CCol md={6} key={spec.key}>
                                            <CFormLabel>
                                                {spec.label}
                                            </CFormLabel>
                                            <CFormInput
                                                value={
                                                    data.specifications[
                                                        spec.key
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    handleSpecChange(
                                                        spec.key,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="-"
                                            />
                                        </CCol>
                                    ))}
                                    <CCol md={12}>
                                        <CFormLabel>
                                            Catatan Tambahan
                                        </CFormLabel>
                                        <CFormTextarea
                                            value={
                                                data.specifications
                                                    .additional_specs
                                            }
                                            onChange={(e) =>
                                                handleSpecChange(
                                                    "additional_specs",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="Detail teknis tambahan..."
                                        />
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
                            Simpan Motor Baru
                        </CButton>
                    </CCol>

                    {/* Preview Sidebar */}
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

                            <CCallout color="info">
                                <strong>Info</strong>
                                <p className="mb-0 small text-body-secondary">
                                    Motor yang ditambahkan akan otomatis muncul
                                    di galeri publik. Pastikan gambar memiliki
                                    resolusi tinggi.
                                </p>
                            </CCallout>
                        </div>
                    </CCol>
                </CRow>
            </form>
        </AdminLayout>
    );
}
