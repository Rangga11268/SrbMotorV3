import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm, router } from "@inertiajs/react";
import RichTextEditor from "@/Components/RichTextEditor";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
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
    CFormSwitch,
    CCallout,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave, cilTrash, cilBike } from "@coreui/icons";
import { Banknote, Coins } from "lucide-react";

export default function Edit({ motor, promotions, brands }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        name: motor.name || "",
        brand: motor.brand || "Yamaha",
        model: motor.model || "",
        price: motor.price || "",
        year: motor.year || new Date().getFullYear(),
        type: motor.type || "",
        image: null,
        description: motor.description || "",
        min_dp_amount: motor.min_dp_amount || 0,
        promotion_ids: motor.promotions
            ? motor.promotions.map((p) => p.id)
            : [],
        tersedia: motor.tersedia === true || motor.tersedia === 1,
        colors: motor.colors || [],
    });

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
        
        const finalColors = [...data.colors];
        if (colorInput.trim() !== '' && !finalColors.includes(colorInput.trim())) {
            finalColors.push(colorInput.trim());
        }

        router.post(route("admin.motors.update", motor.id), {
            ...data,
            colors: finalColors,
        }, {
            forceFormData: true,
            onSuccess: () => toast.success("Data motor berhasil diperbarui"),
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: "Hapus Motor?",
            text: "Motor akan dihapus dari katalog. Tindakan ini tidak bisa dibatalkan.",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.motors.destroy", motor.id), {
                    onSuccess: () => {
                        toast.success("Motor berhasil dihapus");
                    },
                    onError: () => {
                        toast.error("Gagal menghapus motor");
                    },
                });
            }
        });
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
                                            <option value="">Pilih Merk</option>
                                            {brands && brands.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
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
                                            placeholder="Edit spesifikasi lengkap dan keunggulan motor dengan formatting..."
                                            error={errors.description}
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
                                        <CBadge
                                            color={motor.available_units_count > 0 ? "success" : "danger"}
                                            shape="rounded-pill"
                                        >
                                            Stok: {motor.available_units_count} Unit
                                        </CBadge>
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
