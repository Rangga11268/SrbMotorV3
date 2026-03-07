import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Modal from "@/Components/Modal";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CBadge,
    CButton,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CAvatar,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilSearch,
    cilTrash,
    cilEnvelopeClosed,
    cilReload,
    cilCommentSquare,
} from "@coreui/icons";
import { toast } from "react-hot-toast";

export default function Index({ contactMessages, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "danger",
        title: "",
        message: "",
        onConfirm: () => {},
    });

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("admin.contact.index"),
                { search },
                { preserveState: true },
            );
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const confirmDelete = (id) => {
        setModalConfig({
            isOpen: true,
            type: "danger",
            title: "Hapus Pesan",
            message:
                "Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.",
            onConfirm: () => handleDelete(id),
        });
    };

    const handleDelete = (id) => {
        router.delete(route("admin.contact.destroy", id), {
            onSuccess: () => {
                setModalConfig((prev) => ({ ...prev, isOpen: false }));
                toast.success("Pesan berhasil dihapus");
            },
            onError: () => {
                setModalConfig((prev) => ({ ...prev, isOpen: false }));
                toast.error("Gagal menghapus pesan");
            },
        });
    };

    return (
        <AdminLayout title="Pesan Kontak">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() =>
                    setModalConfig((prev) => ({ ...prev, isOpen: false }))
                }
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText="Hapus"
                onConfirm={modalConfig.onConfirm}
                type={modalConfig.type}
            />

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="h4 fw-bold mb-1">Pesan Masuk</h2>
                    <p className="text-body-secondary mb-0 small">
                        {contactMessages.total} pesan dari pelanggan
                    </p>
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
                                    placeholder="Cari nama, email, atau subjek..."
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

            {/* Messages List */}
            {contactMessages.data.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                    {contactMessages.data.map((message) => (
                        <CCard key={message.id} className="hover-shadow">
                            <CCardBody>
                                <div className="d-flex gap-3">
                                    <CAvatar
                                        color="primary"
                                        textColor="white"
                                        size="md"
                                        className="flex-shrink-0"
                                    >
                                        {message.name.charAt(0).toUpperCase()}
                                    </CAvatar>

                                    <div className="flex-grow-1 min-w-0">
                                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-0">
                                                    {message.subject}
                                                </h6>
                                                <div className="d-flex align-items-center gap-2 small text-body-secondary mt-1">
                                                    <span>{message.name}</span>
                                                    <span className="text-body-tertiary">
                                                        •
                                                    </span>
                                                    <a
                                                        href={`mailto:${message.email}`}
                                                        className="text-primary text-decoration-none"
                                                    >
                                                        {message.email}
                                                    </a>
                                                </div>
                                            </div>
                                            <span className="text-body-tertiary small">
                                                {new Date(
                                                    message.created_at,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="bg-body-tertiary rounded-3 p-3 mb-3">
                                            <p className="mb-0 text-body-secondary small">
                                                {message.message}
                                            </p>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <a
                                                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                                                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                            >
                                                <CIcon
                                                    icon={cilEnvelopeClosed}
                                                    size="sm"
                                                />
                                                Balas
                                            </a>
                                            <CButton
                                                color="danger"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    confirmDelete(message.id)
                                                }
                                                className="d-flex align-items-center gap-1"
                                            >
                                                <CIcon
                                                    icon={cilTrash}
                                                    size="sm"
                                                />
                                                Hapus
                                            </CButton>
                                        </div>
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>
                    ))}
                </div>
            ) : (
                <CCard>
                    <CCardBody className="text-center py-5">
                        <CIcon
                            icon={cilCommentSquare}
                            size="3xl"
                            className="text-body-tertiary mb-3"
                        />
                        <h5 className="fw-semibold text-body-secondary">
                            Kotak Masuk Kosong
                        </h5>
                        <p className="text-body-tertiary small mb-0">
                            Belum ada pesan masuk dari pelanggan.
                        </p>
                    </CCardBody>
                </CCard>
            )}

            {/* Pagination */}
            {contactMessages.links && contactMessages.links.length > 3 && (
                <div className="d-flex justify-content-center mt-4">
                    <CPagination>
                        {contactMessages.links.map((link, index) =>
                            link.url ? (
                                <CPaginationItem
                                    key={index}
                                    active={link.active}
                                    href={link.url}
                                    as={Link}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </CPaginationItem>
                            ) : (
                                <CPaginationItem key={index} disabled>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </CPaginationItem>
                            ),
                        )}
                    </CPagination>
                </div>
            )}
        </AdminLayout>
    );
}
