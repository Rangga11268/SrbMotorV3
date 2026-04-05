import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import Modal from "@/Components/Modal";
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CBadge,
    CButton,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CAvatar,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormTextarea,
    CFormLabel,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilSearch,
    cilTrash,
    cilShieldAlt,
    cilUser,
    cilReload,
    cilPeople,
    cilCheckCircle,
    cilXCircle,
    cilOptions,
} from "@coreui/icons";
import { toast } from "react-hot-toast";

export default function Index({ users: initialUsers, filters }) {
    const [localUsers, setLocalUsers] = useState(initialUsers);
    const [search, setSearch] = useState(filters.search || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async (currentFilters) => {
        setLoading(true);
        try {
            const response = await axios.get(route("admin.users.index"), {
                params: currentFilters,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            if (response.data.users) {
                setLocalUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "danger",
        title: "",
        message: "",
        confirmText: "Konfirmasi",
        onConfirm: () => {},
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const params = {};
        if (search) params.search = search;

        const delayDebounceFn = setTimeout(() => {
            const url = new URL(window.location.href);
            url.search = new URLSearchParams(params).toString();
            window.history.replaceState({}, "", url);

            fetchUsers(params);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const confirmDelete = (user) => {
        if (user.id === filters.current_user_id) {
            toast.error("Anda tidak dapat menghapus akun sendiri");
            return;
        }
        setModalConfig({
            isOpen: true,
            type: "danger",
            title: "Hapus Pengguna",
            message: `Apakah Anda yakin ingin menghapus akun "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: "Hapus",
            onConfirm: () => handleDelete(user.id),
        });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        router.delete(route("admin.users.destroy", id), {
            onSuccess: () => {
                setModalConfig((prev) => ({ ...prev, isOpen: false }));
                setProcessing(false);
                toast.success("Pengguna berhasil dihapus");
            },
            onError: () => {
                setProcessing(false);
                toast.error("Gagal menghapus pengguna");
            },
        });
    };

    const confirmRoleChange = (user, newRole) => {
        const isPromoting = newRole === "admin";
        setModalConfig({
            isOpen: true,
            type: isPromoting ? "info" : "warning",
            title: isPromoting ? "Promosikan ke Admin" : "Turunkan ke User",
            message: isPromoting
                ? `Berikan akses Administrator kepada "${user.name}"?`
                : `Cabut hak akses Administrator dari "${user.name}"?`,
            confirmText: isPromoting ? "Promosikan" : "Turunkan",
            onConfirm: () => handleRoleChange(user.id, newRole),
        });
    };

    const handleRoleChange = (id, newRole) => {
        setProcessing(true);
        router.put(
            route("admin.users.update", id),
            { role: newRole },
            {
                onSuccess: () => {
                    setModalConfig((prev) => ({ ...prev, isOpen: false }));
                    setProcessing(false);
                    toast.success(`Role berhasil diubah ke ${newRole}`);
                },
                onError: () => {
                    setProcessing(false);
                    toast.error("Gagal mengubah role");
                },
            },
        );
    };

    const handleToggleVerify = (user) => {
        setProcessing(true);
        router.post(
            route("admin.users.toggle-verify", user.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    toast.success(`Status verifikasi ${user.name} berhasil diubah`);
                },
                onError: () => {
                    setProcessing(false);
                    toast.error("Gagal mengubah status verifikasi");
                },
            }
        );
    };

    const getInitials = (name) =>
        name
            ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
            : "??";

    const getAvatarColor = (name) => {
        const colors = ["primary", "success", "danger", "warning", "info"];
        return colors[name.charCodeAt(0) % colors.length];
    };

    return (
        <AdminLayout title="Manajemen Pengguna">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() =>
                    setModalConfig((prev) => ({ ...prev, isOpen: false }))
                }
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirm}
                type={modalConfig.type}
                processing={processing}
            />

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Daftar Pengguna</h2>
                    <p className="text-body-secondary mb-0 small">
                        Kelola akun dan hak akses pengguna
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2 bg-body-tertiary rounded-3 px-3 py-2">
                    <CIcon icon={cilPeople} className="text-primary" />
                    <span className="text-body-secondary small">Total:</span>
                    <span className="fw-bold">{localUsers.total}</span>
                </div>
            </div>

            {/* Filter */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className="g-3 align-items-end">
                        <CCol md={8}>
                            <CInputGroup>
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={4}>
                            {search && (
                                <CButton
                                    color="light"
                                    className="w-100 d-flex align-items-center justify-content-center gap-1"
                                    onClick={() => setSearch("")}
                                >
                                    <CIcon icon={cilReload} size="sm" />
                                    Reset
                                </CButton>
                            )}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Table */}
            <CCard className="position-relative">
                {loading && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                            zIndex: 10,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <div className="text-center">
                            <CSpinner color="primary" />
                            <p className="mt-2 text-body-secondary small">
                                Memuat data...
                            </p>
                        </div>
                    </div>
                )}
                <CCardBody
                    className="p-0"
                    style={{ opacity: loading ? 0.5 : 1 }}
                >
                    <CTable hover responsive className="mb-0">
                        <CTableHead className="text-body-secondary bg-body-tertiary">
                            <CTableRow>
                                <CTableHeaderCell>Pengguna</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Email</CTableHeaderCell>
                                <CTableHeaderCell>Role</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-md-table-cell">Status</CTableHeaderCell>
                                <CTableHeaderCell className="d-none d-lg-table-cell">Terdaftar</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">
                                    Aksi
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {loading ? (
                                // Skeleton loaders
                                Array(5)
                                    .fill(null)
                                    .map((_, index) => (
                                        <CTableRow
                                            key={`skeleton-${index}`}
                                            className="align-middle"
                                        >
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        height: "20px",
                                                        backgroundColor:
                                                            "#e9ecef",
                                                        borderRadius: "4px",
                                                        animation:
                                                            "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                            ) : localUsers.data.length > 0 ? (
                                localUsers.data.map((user) => (
                                    <CTableRow
                                        key={user.id}
                                        className="align-middle"
                                    >
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center gap-3">
                                                <CAvatar
                                                    src={
                                                        user.profile_photo_path
                                                            ? (user.profile_photo_path.startsWith('http') 
                                                                ? user.profile_photo_path 
                                                                : `/storage/${user.profile_photo_path}`) 
                                                            : (user.profile_photo_url || null)
                                                    }
                                                    color={user.profile_photo_path || user.profile_photo_url ? undefined : getAvatarColor(user.name)}
                                                    textColor="white"
                                                    size="md"
                                                >
                                                    {!(user.profile_photo_path || user.profile_photo_url) && getInitials(user.name)}
                                                </CAvatar>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {user.name}
                                                    </div>
                                                    <div className="d-md-none text-body-tertiary small d-flex flex-column gap-1 mt-1">
                                                        <div>{user.email}</div>
                                                        <div>
                                                            {user.email_verified_at ? (
                                                                <CBadge color="success-obtle" textColor="success" className="p-0 border-0" style={{ fontSize: '10px' }}>Terverifikasi</CBadge>
                                                            ) : (
                                                                <CBadge color="danger-subtle" textColor="danger" className="p-0 border-0" style={{ fontSize: '10px' }}>Belum Verifikasi</CBadge>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: '9px' }}>
                                                            Bergabung: {new Date(user.created_at).toLocaleDateString("id-ID")}
                                                        </div>
                                                    </div>
                                                    <div className="text-body-tertiary small d-none d-md-block">
                                                        ID: #
                                                        {user.id
                                                            .toString()
                                                            .padStart(6, "0")}
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-md-table-cell text-body-secondary small">
                                            {user.email}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {user.role === "admin" ? (
                                                <CBadge
                                                    color="primary"
                                                    shape="rounded-pill"
                                                >
                                                    Administrator
                                                </CBadge>
                                            ) : (
                                                <CBadge
                                                    color="secondary"
                                                    shape="rounded-pill"
                                                >
                                                    Pengguna
                                                </CBadge>
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-md-table-cell">
                                            {user.email_verified_at ? (
                                                <CBadge color="success" shape="rounded-pill">Terverifikasi</CBadge>
                                            ) : (
                                                <CBadge color="danger" shape="rounded-pill">Belum Verifikasi</CBadge>
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell className="d-none d-lg-table-cell small text-body-secondary">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex gap-1 justify-content-center">
                                                {/* Desktop Buttons */}
                                                <div className="d-none d-md-flex gap-1">
                                                    {user.role === "admin" ? (
                                                        <CButton color="warning" variant="outline" size="sm" onClick={() => confirmRoleChange(user, "user")} title="Turunkan ke User">
                                                            <CIcon icon={cilUser} size="sm" />
                                                        </CButton>
                                                    ) : (
                                                        <CButton color="primary" variant="outline" size="sm" onClick={() => confirmRoleChange(user, "admin")} title="Promosikan ke Admin">
                                                            <CIcon icon={cilShieldAlt} size="sm" />
                                                        </CButton>
                                                    )}
                                                    <CButton color={user.email_verified_at ? "danger" : "success"} variant="outline" size="sm" onClick={() => handleToggleVerify(user)} title={user.email_verified_at ? "Batalkan Verifikasi" : "Verifikasi Manual"}>
                                                        <CIcon icon={user.email_verified_at ? cilXCircle : cilCheckCircle} size="sm" />
                                                    </CButton>
                                                    <CButton color="danger" variant="outline" size="sm" onClick={() => confirmDelete(user)} title="Hapus">
                                                        <CIcon icon={cilTrash} size="sm" />
                                                    </CButton>
                                                </div>

                                                {/* Mobile Dropdown */}
                                                <div className="d-md-none">
                                                    <CDropdown alignment="end">
                                                        <CDropdownToggle
                                                            color="light"
                                                            size="sm"
                                                            caret={false}
                                                            className="p-1 border shadow-sm d-flex align-items-center justify-content-center"
                                                            style={{ width: 32, height: 32, borderRadius: 8 }}
                                                        >
                                                            <CIcon icon={cilOptions} size="sm" />
                                                        </CDropdownToggle>
                                                        <CDropdownMenu>
                                                            <CDropdownItem onClick={() => user.role === 'admin' ? confirmRoleChange(user, 'user') : confirmRoleChange(user, 'admin')}>
                                                                <CIcon icon={user.role === 'admin' ? cilUser : cilShieldAlt} className="me-2" />
                                                                {user.role === 'admin' ? 'Turunkan ke User' : 'Promosikan ke Admin'}
                                                            </CDropdownItem>
                                                            <CDropdownItem onClick={() => handleToggleVerify(user)}>
                                                                <CIcon icon={user.email_verified_at ? cilXCircle : cilCheckCircle} className="me-2" />
                                                                {user.email_verified_at ? 'Batalkan Verifikasi' : 'Verifikasi Manual'}
                                                            </CDropdownItem>
                                                            <CDropdownItem onClick={() => confirmDelete(user)} className="text-danger">
                                                                <CIcon icon={cilTrash} className="me-2" /> Hapus
                                                            </CDropdownItem>
                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell
                                        colSpan={5}
                                        className="text-center py-5 text-body-tertiary"
                                    >
                                        Tidak ada data pengguna.
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>

                {localUsers.links.length > 3 && (
                    <div className="card-footer d-flex justify-content-center py-3">
                        <CPagination>
                            {localUsers.links.map((link, index) => {
                                if (!link.url && !link.label) return null;
                                return (
                                    <CPaginationItem
                                        key={index}
                                        active={link.active}
                                        disabled={!link.url}
                                        href={link.url || "#"}
                                        as={link.url ? Link : "span"}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </CPaginationItem>
                                );
                            })}
                        </CPagination>
                    </div>
                )}
            </CCard>
        </AdminLayout>
    );
}

const getInitials = (name) => {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const getAvatarColor = (name) => {
    const colors = [
        "primary",
        "success",
        "info",
        "warning",
        "danger",
        "secondary",
    ];
    const index = name.length % colors.length;
    return colors[index];
};
