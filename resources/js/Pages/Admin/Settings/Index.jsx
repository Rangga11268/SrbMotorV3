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
    cilEnvelopeClosed,
    cilInfo,
    cilPencil,
} from "@coreui/icons";
import {
    settingsConfig,
    getFieldLabel,
    getFieldHelper,
} from "@/Config/SettingsConfig";

export default function SettingsIndex({ settings }) {
    const [activeTab, setActiveTab] = useState("general");

    const categories = {
        general: {
            label: "Umum",
            icon: cilSettings,
            description: "Pengaturan dasar website dan brand",
        },
        contact: {
            label: "Kontak",
            icon: cilPhone,
            description: "Informasi kontak bisnis untuk pelanggan",
        },
        social: {
            label: "Media Sosial",
            icon: cilGlobeAlt,
            description: "Link profil media sosial untuk terhubung",
        },
        email: {
            label: "Email",
            icon: cilEnvelopeClosed,
            description: "Konfigurasi sistem email untuk notifikasi",
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
                                                <div className="space-y-3">
                                                    {getSettingsByCategory(
                                                        category,
                                                    ).map((setting) => (
                                                        <div
                                                            key={setting.id}
                                                            className="p-4 bg-white rounded-3 border border-light-subtle"
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div className="flex-grow-1">
                                                                    <div className="fw-bold text-dark">
                                                                        {getFieldLabel(
                                                                            category,
                                                                            setting.key,
                                                                        )}
                                                                    </div>
                                                                    <small className="text-muted d-block mt-1">
                                                                        {getFieldHelper(
                                                                            category,
                                                                            setting.key,
                                                                        ) ||
                                                                            setting.description}
                                                                    </small>
                                                                    {setting.value && (
                                                                        <div className="mt-2 p-2 bg-light rounded-2">
                                                                            <small className="d-block text-truncate text-monospace">
                                                                                <strong>
                                                                                    Nilai:
                                                                                </strong>{" "}
                                                                                {setting.value &&
                                                                                setting
                                                                                    .value
                                                                                    .length >
                                                                                    60
                                                                                    ? setting.value.substring(
                                                                                          0,
                                                                                          60,
                                                                                      ) +
                                                                                      "..."
                                                                                    : setting.value}
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="alert alert-info d-flex align-items-center gap-3">
                                                    <CIcon
                                                        icon={cilInfo}
                                                        size="lg"
                                                    />
                                                    <div>
                                                        <strong>
                                                            Belum ada pengaturan
                                                        </strong>
                                                        <p className="mb-0 small text-muted">
                                                            Pengaturan untuk
                                                            kategori ini akan
                                                            muncul setelah
                                                            diatur
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 d-flex justify-content-between">
                                                <p className="text-muted small">
                                                    Terakhir diubah:{" "}
                                                    {new Date().toLocaleDateString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                                <Link
                                                    href={route(
                                                        "admin.settings.edit",
                                                        category,
                                                    )}
                                                >
                                                    <CButton
                                                        color="primary"
                                                        size="sm"
                                                    >
                                                        <CIcon
                                                            icon={cilPencil}
                                                            className="me-2"
                                                        />
                                                        Edit{" "}
                                                        {
                                                            categories[
                                                                activeTab
                                                            ]?.label
                                                        }
                                                    </CButton>
                                                </Link>
                                            </div>
                                        </CTabPane>
                                    ),
                                )}
                            </CTabContent>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Info Box */}
            <CRow>
                <CCol xs={12}>
                    <CCard className="bg-light border-0">
                        <CCardBody>
                            <div className="d-flex align-items-start gap-3">
                                <CIcon
                                    icon={cilInfo}
                                    size="xl"
                                    className="text-primary flex-shrink-0 mt-1"
                                />
                                <div>
                                    <strong className="d-block mb-2">
                                        Panduan Pengaturan
                                    </strong>
                                    <ul className="mb-0 small">
                                        <li>
                                            Klik tombol <strong>"Edit"</strong>{" "}
                                            untuk mengubah pengaturan di
                                            kategori masing-masing
                                        </li>
                                        <li>
                                            Setiap field memiliki penjelasan
                                            untuk memandu Anda mengisi nilai
                                            yang benar
                                        </li>
                                        <li>
                                            Perubahan akan tersimpan otomatis
                                            dan langsung berdampak ke website
                                        </li>
                                        <li>
                                            Hubungi tim teknis jika tidak yakin
                                            dengan pengaturan yang diperlukan
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
