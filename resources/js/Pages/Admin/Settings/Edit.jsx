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
    Plus,
    Trash2,
    PenTool,
} from "lucide-react";

import {
    getSettingFieldConfig,
    getCategoryConfig,
} from "@/Config/SettingsConfig";


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

    const categoryConfig = getCategoryConfig(category);


    const handleJsonArrayChange = (index, arrayIndex, value, action = 'edit') => {
        const updatedSettings = [...data.settings];
        try {
            let list = [];
            try {
                list = JSON.parse(updatedSettings[index].value || "[]");
            } catch (e) {
                list = [];
            }
            
            if (!Array.isArray(list)) list = [];

            if (action === 'edit') {
                list[arrayIndex] = value;
            } else if (action === 'delete') {
                list.splice(arrayIndex, 1);
            } else if (action === 'add') {
                list.push("");
            }
            
            updatedSettings[index].value = JSON.stringify(list);
            setData("settings", updatedSettings);
        } catch (e) {
            console.error("Error updating JSON array:", e);
        }
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
        const fieldConfig = getSettingFieldConfig(category, setting.key);


        // Special handling for business_hours and service_business_hours
        if (setting.key === "business_hours" || setting.key === "service_business_hours") {
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
                            {fieldConfig?.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{fieldConfig?.helper || setting.description}</p>
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

        // Special handling for service_branches (list of strings)
        if (setting.key === "service_branches") {
            let branches = [];
            try {
                branches = typeof setting.value === "string" 
                    ? JSON.parse(setting.value || "[]") 
                    : setting.value;
                if (!Array.isArray(branches)) branches = [];
            } catch (e) {
                branches = [];
            }

            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="font-weight-bold text-dark mb-2">
                                <PenTool size={20} className="me-2" />
                                {fieldConfig?.label || setting.key}
                            </h6>
                            <p className="text-muted small mb-0">{fieldConfig?.helper || setting.description}</p>
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-primary btn-sm rounded-pill px-3"
                            onClick={() => handleJsonArrayChange(index, null, null, 'add')}
                        >
                            <Plus size={16} className="me-1" /> Tambah Cabang
                        </button>
                    </div>
                    <div className="row g-3">
                        {branches.map((branch, bIndex) => (
                            <div key={bIndex} className="col-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <small className="fw-bold text-muted">{bIndex + 1}</small>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Nama Cabang (Contoh: SSM BEKASI)"
                                        value={branch}
                                        onChange={(e) => handleJsonArrayChange(index, bIndex, e.target.value, 'edit')}
                                    />
                                    <button 
                                        className="btn btn-outline-danger" 
                                        type="button"
                                        onClick={() => handleJsonArrayChange(index, bIndex, null, 'delete')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {branches.length === 0 && (
                            <div className="col-12 text-center py-3 text-muted small border rounded bg-white">
                                Belum ada cabang. Klik "Tambah Cabang" untuk memulai.
                            </div>
                        )}
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
                            {fieldConfig?.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{fieldConfig?.helper || setting.description}</p>
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
                            {fieldConfig?.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-3">{fieldConfig?.helper || setting.description}</p>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={fieldConfig?.placeholder || "https://..."}
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
                            {fieldConfig?.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{fieldConfig?.helper || setting.description}</p>
                    </div>
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder={fieldConfig?.placeholder}
                        value={data.settings[index].value || ""}
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                    />
                </div>
            );
        }

        // File upload for images
        if (fieldConfig?.type === "file" || setting.key === "site_logo") {
            return (
                <div key={index} className="card border-0 bg-light p-4 mb-4">
                    <div className="mb-3">
                        <h6 className="font-weight-bold text-dark mb-2">
                            <Upload size={20} className="me-2" />
                            {fieldConfig?.label || setting.key}
                        </h6>
                        <p className="text-muted small mb-0">{fieldConfig?.helper || setting.description}</p>
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
                    {fieldConfig?.label || setting.key}
                    </h6>
                    <p className="text-muted small mb-0">{fieldConfig?.helper || setting.description}</p>
                </div>
                <input
                    type={
                        fieldConfig?.type === "number"
                            ? "number"
                            : setting.key.includes("email")
                              ? "email"
                              : setting.key.includes("phone")
                                ? "tel"
                                : "text"
                    }
                    className="form-control"
                    placeholder={fieldConfig?.placeholder}
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
            <Head title={`Edit ${categoryConfig?.label || category}`} />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm border-0 rounded-4 overflow-hidden">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white border-bottom py-4 px-4">
                            <div>
                                <h1 className="h4 fw-black text-dark mb-1">
                                    {categoryConfig?.label || category}
                                </h1>
                                <p className="text-muted small mb-0">
                                    {categoryConfig?.description || "Kelola pengaturan website Anda"}
                                </p>
                            </div>
                            <Link
                                href={route("admin.settings.index")}
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                            >
                                <CIcon icon={cilArrowLeft} className="me-2" />
                                Kembali
                            </Link>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <CForm onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {data.settings.map((setting, index) =>
                                        renderInputField(setting, index),
                                    )}
                                </div>

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
