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
import { cilSave, cilArrowLeft } from "@coreui/icons";
import { Link } from "@inertiajs/react";

export default function SettingsEdit({ category, settings }) {
    const { data, setData, put, processing, errors } = useForm({
        settings: settings.map((setting) => ({
            key: setting.key,
            value: setting.value,
            type: setting.type,
            description: setting.description,
        })),
    });

    const handleSettingChange = (index, field, value) => {
        const updatedSettings = [...data.settings];
        updatedSettings[index][field] = value;
        setData("settings", updatedSettings);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.settings.update", category));
    };

    const categoryLabels = {
        general: "Pengaturan Umum",
        contact: "Informasi Kontak",
        social: "Media Sosial",
        branding: "Branding",
        financing: "Pembiayaan",
        email: "Konfigurasi Email",
    };

    const renderInputField = (setting, index) => {
        switch (setting.type) {
            case "text":
                return (
                    <CFormTextarea
                        key={index}
                        label={setting.key}
                        value={data.settings[index].value || ""}
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                        rows={3}
                        className="mb-3"
                    />
                );
            case "number":
                return (
                    <CFormInput
                        key={index}
                        type="number"
                        label={setting.key}
                        value={data.settings[index].value || ""}
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                        className="mb-3"
                    />
                );
            case "boolean":
                return (
                    <div key={index} className="mb-3">
                        <CFormLabel>{setting.key}</CFormLabel>
                        <select
                            className="form-select"
                            value={data.settings[index].value || "false"}
                            onChange={(e) =>
                                handleSettingChange(index, "value", e.target.value)
                            }
                        >
                            <option value="false">Tidak</option>
                            <option value="true">Ya</option>
                        </select>
                    </div>
                );
            case "json":
                return (
                    <CFormTextarea
                        key={index}
                        label={setting.key}
                        value={
                            typeof data.settings[index].value === "string"
                                ? data.settings[index].value
                                : JSON.stringify(data.settings[index].value, null, 2)
                        }
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                        rows={5}
                        className="mb-3"
                        style={{ fontFamily: "monospace" }}
                    />
                );
            default:
                return (
                    <CFormInput
                        key={index}
                        label={setting.key}
                        value={data.settings[index].value || ""}
                        onChange={(e) =>
                            handleSettingChange(index, "value", e.target.value)
                        }
                        className="mb-3"
                    />
                );
        }
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
                                {data.settings.map((setting, index) => (
                                    <div key={index} className="mb-4 p-3 bg-light rounded-3 border">
                                        <small className="d-block text-muted mb-2">
                                            {setting.description}
                                        </small>
                                        {renderInputField(setting, index)}
                                        <small className="text-muted">
                                            Tipe: <strong>{setting.type}</strong>
                                        </small>
                                    </div>
                                ))}

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
                                        <CIcon icon={cilSave} className="me-2" />
                                        Simpan Pengaturan
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
