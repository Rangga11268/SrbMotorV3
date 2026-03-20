import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
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
    CButton,
    CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSave, cilArrowLeft, cilInfo } from "@coreui/icons";
import { Link } from "@inertiajs/react";
import {
    Clock,
    MapPin,
    Mail,
    Phone,
    Palette,
    Globe,
    Upload,
    X,
} from "lucide-react";

// Settings metadata untuk user-friendly labels dan descriptions
const settingsMetadata = {
    site_name: {
        label: "Nama Website",
        description: "Nama yang ditampilkan di seluruh website",
        placeholder: "Contoh: SRB Motors",
        help: "Gunakan nama toko Anda yang resmi",
    },
    site_description: {
        label: "Deskripsi Website",
        description: "Deskripsi singkat tentang bisnis Anda",
        placeholder:
            "Contoh: Platform dealer motor terpercaya dengan layanan terbaik",
        help: "Jelaskan singkat apa yang membuat bisnis Anda istimewa",
    },
    site_logo: {
        label: "Logo Website",
        description: "Upload logo untuk website Anda",
        help: "Format: PNG, JPG. Max 2MB. Akan di-upload otomatis",
        type: "file",
    },
    contact_email: {
        label: "Email Kontak",
        description: "Email utama untuk menerima pesan",
        placeholder: "Contoh: info@srbmotors.com",
        help: "Email yang dapat diakses untuk mengirim pesan ke pelanggan",
    },
    contact_phone: {
        label: "Nomor Telepon",
        description: "Nomor telepon utama",
        placeholder: "Contoh: +6281234567890",
        help: "Sertakan kode negara (+62 untuk Indonesia)",
    },
    contact_whatsapp: {
        label: "Nomor WhatsApp",
        description: "Nomor WhatsApp untuk customer service",
        placeholder: "Contoh: 6281234567890",
        help: "Nomor untuk chat WhatsApp (tanpa +)",
    },
    contact_address: {
        label: "Alamat Kantor",
        description: "Alamat lengkap lokasi bisnis Anda",
        placeholder: "Contoh: Jl. Raya Utama No. 123, Jakarta Selatan",
        help: "Sertakan jalan, nomor, kota, dan provinsi",
    },
    contact_city: {
        label: "Kota",
        description: "Nama kota kantor utama",
        placeholder: "Contoh: Jakarta",
        help: "Hanya nama kota saja",
    },
    business_hours: {
        label: "Jam Operasional",
        description: "Jam buka dan tutup toko untuk setiap hari",
        help: "Edit jam untuk setiap hari dalam seminggu",
    },
    social_facebook: {
        label: "Facebook",
        description: "URL halaman Facebook Anda",
        placeholder: "Contoh: https://facebook.com/srbmotors",
        help: "Salin URL dari halaman Facebook Anda",
    },
    social_instagram: {
        label: "Instagram",
        description: "URL akun Instagram Anda",
        placeholder: "Contoh: https://instagram.com/srbmotors",
        help: "Salin URL dari profil Instagram Anda",
    },
    social_youtube: {
        label: "YouTube",
        description: "URL channel YouTube Anda",
        placeholder: "Contoh: https://youtube.com/@srbmotors",
        help: "Salin URL dari channel YouTube Anda",
    },
    social_tiktok: {
        label: "TikTok",
        description: "URL akun TikTok Anda",
        placeholder: "Contoh: https://tiktok.com/@srbmotors",
        help: "Salin URL dari profil TikTok Anda",
    },
    email_from_name: {
        label: "Nama Pengirim Email",
        description: "Nama yang tampil sebagai pengirim email",
        placeholder: "Contoh: SRB Motors",
        help: "Nama toko di email yang dikirim ke pelanggan",
    },
    email_from_address: {
        label: "Email Pengirim",
        description: "Email yang digunakan untuk mengirim email otomatis",
        placeholder: "Contoh: noreply@srbmotors.com",
        help: "Email sistem (biasanya noreply@)",
    },
};

const categoryLabels = {
    general: "Pengaturan Umum",
    contact: "Informasi Kontak",
    social: "Media Sosial",
    email: "Konfigurasi Email",
};

export default function SettingsEdit({ category, settings }) {
    const { data, setData, put, processing, errors } = useForm({
        settings: settings.map((setting) => ({
            key: setting.key,
            value: setting.value,
            type: setting.type,
            description: setting.description,
        })),
    });

    const [filePreview, setFilePreview] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const handleSettingChange = (index, field, value) => {
        const updatedSettings = [...data.settings];
        updatedSettings[index][field] = value;
        setData("settings", updatedSettings);
    };

    const handleBusinessHourChange = (index, day, value) => {
        const updatedSettings = [...data.settings];
        try {
            const hours = JSON.parse(updatedSettings[index].value || "{}");
            hours[day] = value;
            updatedSettings[index].value = JSON.stringify(hours);
            setData("settings", updatedSettings);
        } catch (e) {
            console.error("Error parsing business hours:", e);
        }
    };

    const handleFileUpload = async (index, file) => {
        if (!file) return;

        // Validate file-
        const validTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(file.type)) {
            alert("Format file harus PNG atau JPG");
            return;
        }

        if (file.size > maxSize) {
            alert("Ukuran file max 2MB");
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setFilePreview((prev) => ({
                ...prev,
                [data.settings[index].key]: e.target.result,
            }));
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploadProgress((prev) => ({
            ...prev,
            [data.settings[index].key]: 0,
        }));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("field", data.settings[index].key);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    const current = prev[data.settings[index].key] || 0;
                    if (current < 90) {
                        return {
                            ...prev,
                            [data.settings[index].key]:
                                current + Math.random() * 30,
                        };
                    }
                    clearInterval(progressInterval);
                    return prev;
                });
            }, 200);

            const response = await fetch(route("admin.settings.upload"), {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error("Upload gagal");
            }

            const result = await response.json();

            // Update setting value dengan path dari server
            const updatedSettings = [...data.settings];
            updatedSettings[index].value = result.path;
            setData("settings", updatedSettings);

            setUploadProgress((prev) => ({
                ...prev,
                [data.settings[index].key]: 100,
            }));

            // Clear progress setelah 1 detik
            setTimeout(() => {
                setUploadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[data.settings[index].key];
                    return newProgress;
                });
            }, 1000);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file: " + error.message);
            setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress[data.settings[index].key];
                return newProgress;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.settings.update", category));
    };

    const getMetadata = (key) => {
        return settingsMetadata[key] || {};
    };

    const daysOfWeek = [
        { key: "monday", label: "Senin" },
        { key: "tuesday", label: "Selasa" },
        { key: "wednesday", label: "Rabu" },
        { key: "thursday", label: "Kamis" },
        { key: "friday", label: "Jumat" },
        { key: "saturday", label: "Sabtu" },
        { key: "sunday", label: "Minggu" },
    ];

    const renderInputField = (setting, index) => {
        const metadata = getMetadata(setting.key);

        // Special handling for business_hours
        if (setting.key === "business_hours") {
            let hours = {};
            try {
                const parseValue =
                    typeof setting.value === "string"
                        ? JSON.parse(setting.value || "{}")
                        : setting.value;
                hours = parseValue || {};
            } catch (e) {
                console.error("Error parsing business hours:", e);
                // If parse fails, try splitting by commas
                try {
                    const values = setting.value?.split(",") || [];
                    if (values.length === 0) {
                        hours = {};
                    } else {
                        // If it's a simple string, we'll let it show the 7-day form anyway
                        hours = {};
                    }
                } catch (err) {
                    hours = {};
                }
            }

            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3">
                        <h6 className="font-weight-bold text-dark mb-2">
                            <Clock size={20} className="me-2" />
                            {metadata.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{metadata.help}</p>
                    </div>
                    <div className="row g-3">
                        {daysOfWeek.map(({ key: dayKey, label: dayLabel }) => (
                            <div key={dayKey} className="col-md-6">
                                <label className="form-label small fw-bold text-dark">
                                    {dayLabel}
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Contoh: 08:00 - 17:00"
                                    value={hours[dayKey] || ""}
                                    onChange={(e) =>
                                        handleBusinessHourChange(
                                            index,
                                            dayKey,
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Color picker for brand colors
        if (setting.key.includes("color") && setting.type === "string") {
            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3">
                        <h6 className="font-weight-bold text-dark mb-2">
                            <Palette size={20} className="me-2" />
                            {metadata.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{metadata.help}</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <input
                            type="color"
                            className="form-control form-control-color"
                            style={{ width: "80px", height: "40px" }}
                            value={data.settings[index].value || "#2563EB"}
                            onChange={(e) =>
                                handleSettingChange(
                                    index,
                                    "value",
                                    e.target.value,
                                )
                            }
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={data.settings[index].value || ""}
                            onChange={(e) =>
                                handleSettingChange(
                                    index,
                                    "value",
                                    e.target.value,
                                )
                            }
                            placeholder="#2563EB"
                        />
                    </div>
                </div>
            );
        }

        // URL fields
        if (setting.key.includes("social") || setting.key.includes("url")) {
            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3">
                        <h6 className="font-weight-bold text-dark mb-2">
                            <Globe size={20} className="me-2" />
                            {metadata.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-3">{metadata.help}</p>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={metadata.placeholder || "https://..."}
                        value={data.settings[index].value || ""}
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                    />
                </div>
            );
        }

        // Text area for long text
        if (setting.type === "text") {
            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3">
                        <h6 className="font-weight-bold text-dark mb-2">
                            {metadata.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{metadata.help}</p>
                    </div>
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder={metadata.placeholder}
                        value={data.settings[index].value || ""}
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                    />
                </div>
            );
        }

        // File upload for images
        if (metadata.type === "file") {
            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3">
                        <h6 className="font-weight-bold text-dark mb-2">
                            <Upload size={20} className="me-2" />
                            {metadata.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{metadata.help}</p>
                    </div>

                    {/* Show preview if exists */}
                    {(filePreview[setting.key] || setting.value) && (
                        <div className="mb-3">
                            <div
                                className="rounded border border-2"
                                style={{
                                    maxWidth: "200px",
                                    overflow: "hidden",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <img
                                    src={
                                        filePreview[setting.key] ||
                                        setting.value
                                    }
                                    alt="Preview"
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        display: "block",
                                    }}
                                />
                            </div>
                            <small className="text-muted d-block mt-2">
                                Path: {setting.value}
                            </small>
                        </div>
                    )}

                    {/* Upload progress */}
                    {uploadProgress[setting.key] && (
                        <div className="mb-3">
                            <div
                                className="progress"
                                style={{ height: "25px" }}
                            >
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    aria-valuenow={uploadProgress[setting.key]}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{
                                        width: `${uploadProgress[setting.key]}%`,
                                    }}
                                >
                                    {Math.round(uploadProgress[setting.key])}%
                                </div>
                            </div>
                        </div>
                    )}

                    {/* File input */}
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        className="form-control"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFileUpload(index, e.target.files[0]);
                            }
                        }}
                        disabled={uploadProgress[setting.key]}
                    />
                    <small className="text-muted d-block mt-2">
                        Format: PNG, JPG. Max 2MB. Auto-upload ke server.
                    </small>
                </div>
            );
        }

        // Default text input
        return (
            <div key={index} className="card border-0 bg-light p-4 mb-4">
                <div className="mb-3">
                    <h6 className="font-weight-bold text-dark mb-2">
                        {metadata.label || setting.key}
                    </h6>
                    <p className="text-muted small mb-0">{metadata.help}</p>
                </div>
                <input
                    type={
                        setting.type === "number"
                            ? "number"
                            : setting.key.includes("email")
                              ? "email"
                              : setting.key.includes("phone")
                                ? "tel"
                                : "text"
                    }
                    className="form-control"
                    placeholder={metadata.placeholder}
                    value={data.settings[index].value || ""}
                    onChange={(e) =>
                        handleSettingChange(index, "value", e.target.value)
                    }
                />
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${categoryLabels[category] || category}`} />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <div>
                                <strong className="h5 mb-0">
                                    {categoryLabels[category] || category}
                                </strong>
                                <p className="text-muted small mb-0 mt-1">
                                    Ubah pengaturan{" "}
                                    {categoryLabels[category]?.toLowerCase() ||
                                        category}
                                </p>
                            </div>
                            <Link
                                href={route("admin.settings.index")}
                                className="btn btn-sm btn-secondary"
                            >
                                <CIcon icon={cilArrowLeft} className="me-2" />
                                Kembali
                            </Link>
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={handleSubmit}>
                                {data.settings.map((setting, index) =>
                                    renderInputField(setting, index),
                                )}

                                <div className="d-flex gap-2 mt-5">
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
                                        Simpan Perubahan
                                    </CButton>
                                    <Link
                                        href={route("admin.settings.index")}
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
