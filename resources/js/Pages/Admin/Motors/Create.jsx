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
import { router } from "@inertiajs/react";
import { Banknote, Coins } from "lucide-react";

export default function Create({ promotions, brands }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        brand: "Yamaha",
        model: "",
        price: "",
        year: new Date().getFullYear(),
        type: "",
        image: null,
        description: "",

        min_dp_amount: 0,
        promotion_ids: [],
        tersedia: true,
        colors: [],
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [colorInput, setColorInput] = useState("");

    // Helper for currency formatting
    const formatNumberDisplay = (numStr) => {
        if (numStr === null || numStr === undefined || numStr === "") return "";
        // Ambil bagian bulat saja (ignore decimal dari database)
        const strValue = String(numStr).split('.')[0];
        const cleanNum = strValue.replace(/[^\d]/g, "");
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseFormattedNumber = (str) => {
        return String(str).replace(/[^\d]/g, "");
    };

    const handlePriceChange = (value) => {
        setData("price", parseFormattedNumber(value));
    };

    const handleMinDpChange = (value) => {
        setData("min_dp_amount", parseFormattedNumber(value));
    };

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
        
        const finalColors = [...data.colors];
        if (colorInput.trim() !== '' && !finalColors.includes(colorInput.trim())) {
            finalColors.push(colorInput.trim());
        }

        router.post(route("admin.motors.store"), {
            ...data,
            colors: finalColors,
        }, {
            forceFormData: true,
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
                                            <option value="">Pilih Merk</option>
                                            {brands && brands.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                            {/* Allow manual entry if needed or just keep it simple for now */}
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
                                        <CFormLabel>Harga</CFormLabel>
                                        <div className="position-relative">
                                            <div 
                                                className="position-absolute d-flex align-items-center justify-content-center text-secondary" 
                                                style={{ left: '12px', top: '0', bottom: '0', zIndex: 10 }}
                                            >
                                                <Banknote size={18} />
                                            </div>
                                            <CFormInput
                                                type="text"
                                                className="ps-5 py-2 rounded-3"
                                                style={{ border: '2px solid #e2e8f0' }}
                                                value={formatNumberDisplay(data.price)}
                                                onChange={(e) =>
                                                    handlePriceChange(e.target.value)
                                                }
                                                placeholder="0"
                                                invalid={!!errors.price}
                                            />
                                        </div>
                                        {errors.price && <div className="text-danger small mt-1">{errors.price}</div>}
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>DP Minimum</CFormLabel>
                                        <div className="position-relative">
                                            <div 
                                                className="position-absolute d-flex align-items-center justify-content-center text-secondary" 
                                                style={{ left: '12px', top: '0', bottom: '0', zIndex: 10 }}
                                            >
                                                <Coins size={18} />
                                            </div>
                                            <CFormInput
                                                type="text"
                                                className="ps-5 py-2 rounded-3"
                                                style={{ border: '2px solid #e2e8f0' }}
                                                value={formatNumberDisplay(data.min_dp_amount)}
                                                onChange={(e) =>
                                                    handleMinDpChange(e.target.value)
                                                }
                                                placeholder="600.000"
                                                invalid={!!errors.min_dp_amount}
                                            />
                                        </div>
                                        {errors.min_dp_amount && <div className="text-danger small mt-1">{errors.min_dp_amount}</div>}
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
                                        <div className="d-flex gap-2">
                                            <CFormInput
                                                value={colorInput}
                                                onChange={(e) => setColorInput(e.target.value)}
                                                onKeyDown={handleAddColor}
                                                placeholder="Contoh: Merah, Hitam Doff..."
                                            />
                                            <CButton 
                                                type="button" 
                                                color="info" 
                                                variant="outline"
                                                onClick={() => {
                                                    if (colorInput.trim() !== '') {
                                                        if (!data.colors.includes(colorInput.trim())) {
                                                            setData("colors", [...data.colors, colorInput.trim()]);
                                                        }
                                                        setColorInput("");
                                                    }
                                                }}
                                            >
                                                Tambah
                                            </CButton>
                                        </div>
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
