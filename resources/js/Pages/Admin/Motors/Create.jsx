import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
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
    CFormSwitch,
    CCallout,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave, cilBike } from "@coreui/icons";
import toast from "react-hot-toast";

export default function Create({ promotions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        brand: "Yamaha",
        model: "",
        price: "",
        year: new Date().getFullYear(),
        type: "",
        image: null,
        image: null,
        description: "",
        min_dp_amount: 0,
        promotion_ids: [],
        tersedia: true,
        colors: [],
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [colorInput, setColorInput] = useState("");

    const handleAddColor = (e) => {
        if (e.key === 'Enter' && colorInput.trim() !== '') {
            e.preventDefault();
            if (!data.colors.includes(colorInput.trim())) {
                setData("colors", [...data.colors, colorInput.trim()]);
            }
            setColorInput("");
        }
    };

    const handleRemoveColor = (colorToRemove) => {
        setData("colors", data.colors.filter(c => c !== colorToRemove));
    };

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
        post(route("admin.motors.store"), {
            onSuccess: () => toast.success("Motor berhasil ditambahkan"),
        });
    };

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
                                        <CFormLabel>DP Minimum (Rp)</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            value={data.min_dp_amount}
                                            onChange={(e) =>
                                                setData("min_dp_amount", e.target.value)
                                            }
                                            placeholder="Contoh: 600000"
                                            invalid={!!errors.min_dp_amount}
                                            feedbackInvalid={errors.min_dp_amount}
                                        />
                                    </CCol>
                                    <CCol md={4}>
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
                                    <CCol md={8}>
                                        <CFormLabel>Warna Tersedia (Tekan Enter untuk menambah)</CFormLabel>
                                        <CFormInput
                                            value={colorInput}
                                            onChange={(e) => setColorInput(e.target.value)}
                                            onKeyDown={handleAddColor}
                                            placeholder="Contoh: Merah, Hitam Doff..."
                                        />
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {data.colors.map((color, index) => (
                                                <CBadge key={index} color="info" shape="rounded-pill" className="p-2 d-flex align-items-center gap-1">
                                                    {color}
                                                    <span 
                                                        className="ms-1 cursor-pointer fw-bold" 
                                                        style={{cursor: 'pointer'}} 
                                                        onClick={() => handleRemoveColor(color)}
                                                    >
                                                        &times;
                                                    </span>
                                                </CBadge>
                                            ))}
                                            {data.colors.length === 0 && <span className="text-muted small">Belum ada warna yang ditambahkan.</span>}
                                        </div>
                                    </CCol>
                                    <CCol md={12}>
                                        <CCard className="bg-light border-0">
                                            <CCardBody className="py-2 px-3 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="fw-semibold">Status Ketersediaan</div>
                                                    <div className="small text-muted">Tentukan apakah motor ini sedang tersedia di dealer.</div>
                                                </div>
                                                <CFormSwitch 
                                                    size="xl" 
                                                    checked={data.tersedia}
                                                    onChange={(e) => setData("tersedia", e.target.checked)}
                                                />
                                            </CCardBody>
                                        </CCard>
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
                                <strong>
                                    Deskripsi & Spesifikasi Motor
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={12}>
                                        <CFormLabel>
                                            Deskripsi Motor (Spesifikasi &
                                            Fitur)
                                        </CFormLabel>
                                        <RichTextEditor
                                            value={data.description}
                                            onChange={(html) =>
                                                setData("description", html)
                                            }
                                            placeholder="Tuliskan spesifikasi lengkap dan keunggulan motor ini dengan formatting..."
                                            minHeight="400px"
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
                                        <CBadge
                                            color="info"
                                            shape="rounded-pill"
                                        >
                                            Stok: 0 Unit
                                        </CBadge>
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
