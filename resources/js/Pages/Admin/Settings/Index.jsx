import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilSettings,
    cilPhone,
    cilGlobeAlt,
    cilColorPalette,
    cilMoney,
    cilEnvelopeClosed,
} from "@coreui/icons";

export default function SettingsIndex({ settings }) {
    const [activeTab, setActiveTab] = useState("general");

    const categories = {
        general: {
            label: "Umum",
            icon: cilSettings,
            description: "Pengaturan dasar website",
        },
        contact: {
            label: "Kontak",
            icon: cilPhone,
            description: "Informasi kontak bisnis",
        },
        social: {
            label: "Media Sosial",
            icon: cilGlobeAlt,
            description: "Tautan media sosial",
        },
        branding: {
            label: "Branding",
            icon: cilColorPalette,
            description: "Identitas visual brand",
        },
        financing: {
            label: "Pembiayaan",
            icon: cilMoney,
            description: "Pengaturan cicilan",
        },
        email: {
            label: "Email",
            icon: cilEnvelopeClosed,
            description: "Konfigurasi email",
        },
    };

    const getSettingsByCategory = (category) => {
        return settings[category] || [];
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Website" />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4 shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
                            <strong className="h5 mb-0">
                                Pengaturan Website
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CNav variant="tabs" role="tablist">
                                {Object.entries(categories).map(
                                    ([key, cat]) => (
                                        <CNavItem key={key} role="presentation">
                                            <CNavLink
                                                active={activeTab === key}
                                                component="button"
                                                role="tab"
                                                aria-selected={
                                                    activeTab === key
                                                }
                                                onClick={() =>
                                                    setActiveTab(key)
                                                }
                                            >
                                                <CIcon
                                                    icon={cat.icon}
                                                    className="me-2"
                                                />
                                                {cat.label}
                                            </CNavLink>
                                        </CNavItem>
                                    ),
                                )}
                            </CNav>

                            <CTabContent className="mt-4">
                                {Object.entries(categories).map(
                                    ([category, cat]) => (
                                        <CTabPane
                                            key={category}
                                            role="tabpanel"
                                            aria-labelledby={`tab-${category}`}
                                            visible={activeTab === category}
                                        >
                                            <div className="mb-4">
                                                <p className="text-muted mb-3">
                                                    {cat.description}
                                                </p>
                                                <Link
                                                    href={route(
                                                        "admin.settings.edit",
                                                        category,
                                                    )}
                                                >
                                                    <CButton color="primary">
                                                        Edit Pengaturan
                                                    </CButton>
                                                </Link>
                                            </div>

                                            {getSettingsByCategory(category)
                                                .length > 0 ? (
                                                <div className="space-y-2">
                                                    {getSettingsByCategory(
                                                        category,
                                                    ).map((setting) => (
                                                        <div
                                                            key={setting.id}
                                                            className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 border"
                                                        >
                                                            <div>
                                                                <div className="fw-semibold">
                                                                    {
                                                                        setting.key
                                                                    }
                                                                </div>
                                                                <small className="text-muted">
                                                                    {
                                                                        setting.description
                                                                    }
                                                                </small>
                                                            </div>
                                                            <div className="text-end">
                                                                <small className="d-block text-truncate mw-300">
                                                                    {setting.value &&
                                                                    setting
                                                                        .value
                                                                        .length >
                                                                        50
                                                                        ? setting.value.substring(
                                                                              0,
                                                                              50,
                                                                          ) +
                                                                          "..."
                                                                        : setting.value}
                                                                </small>
                                                                <span className="badge bg-secondary">
                                                                    {
                                                                        setting.type
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="alert alert-info">
                                                    Belum ada pengaturan di
                                                    kategori ini
                                                </div>
                                            )}
                                        </CTabPane>
                                    ),
                                )}
                            </CTabContent>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
