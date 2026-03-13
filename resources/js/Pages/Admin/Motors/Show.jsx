import React, { useState } from "react";
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
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilArrowLeft, cilBike, cilStorage } from "@coreui/icons";

export default function Show({ motor }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route("admin.motors.destroy", motor.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
        });
    };

    return (
        <AdminLayout title={`Detail Motor: ${motor.name}`}>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Motor"
                message={`Apakah Anda yakin ingin menghapus "${motor.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={handleDelete}
                type="danger"
                processing={isDeleting}
            />

            {/* Back + Actions */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.motors.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <div className="d-flex gap-2">
                    <Link
                        href={route("admin.motors.edit", motor.id)}
                        className="btn btn-primary d-flex align-items-center gap-2"
                    >
                        <CIcon icon={cilPencil} size="sm" />
                        Edit
                    </Link>
                    <CButton
                        color="danger"
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="d-flex align-items-center gap-2"
                    >
                        <CIcon icon={cilTrash} size="sm" />
                        Hapus
                    </CButton>
                </div>
            </div>

            <CRow>
                {/* Image & Price */}
                <CCol lg={4} className="mb-4">
                    <CCard className="mb-4">
                        <CCardBody className="p-2">
                            <div
                                className="bg-body-tertiary rounded-2 overflow-hidden d-flex align-items-center justify-content-center"
                                style={{ aspectRatio: "4/3" }}
                            >
                                {motor.image_path ? (
                                    <img
                                        src={
                                            motor.image_path.startsWith("http")
                                                ? motor.image_path
                                                : `/storage/${motor.image_path}`
                                        }
                                        alt={motor.name}
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
                        </CCardBody>
                    </CCard>

                    <CCard>
                        <CCardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-body-secondary small fw-semibold">
                                    Status
                                </span>
                                <div className="d-flex flex-column align-items-end">
                                    {motor.available_units_count > 0 ? (
                                        <CBadge
                                            color="success"
                                            shape="rounded-pill"
                                        >
                                            Tersedia
                                        </CBadge>
                                    ) : (
                                        <CBadge color="danger" shape="rounded-pill">
                                            Kosong
                                        </CBadge>
                                    )}
                                    <div className="text-body-tertiary small mt-1 fw-bold">
                                        {motor.available_units_count} / {motor.units_count} Unit
                                    </div>
                                </div>
                            </div>
                            <div className="text-center p-3 bg-primary-subtle rounded-3">
                                <div className="text-body-secondary small mb-1">
                                    Harga
                                </div>
                                <div className="h4 fw-bold text-primary mb-0">
                                    Rp{" "}
                                    {new Intl.NumberFormat("id-ID").format(
                                        motor.price,
                                    )}
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Details */}
                <CCol lg={8}>
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="h4 mb-1 fw-bold">
                                        {motor.name}
                                    </h3>
                                    <div className="d-flex gap-2">
                                        <CBadge
                                            color="primary-subtle"
                                            textColor="primary"
                                        >
                                            {motor.brand}
                                        </CBadge>
                                        <CBadge
                                            color="secondary-subtle"
                                            textColor="secondary"
                                        >
                                            {motor.type || "Standard"}
                                        </CBadge>
                                        <CBadge
                                            color="secondary-subtle"
                                            textColor="secondary"
                                        >
                                            {motor.year}
                                        </CBadge>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {motor.promotions?.map((promo) => (
                                            <CBadge
                                                key={promo.id}
                                                color={promo.badge_color}
                                                textColor="white"
                                            >
                                                {promo.badge_text}
                                            </CBadge>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-body-tertiary small">
                                    ID: #{motor.id.toString().padStart(6, "0")}
                                </span>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <h6 className="fw-semibold mb-3 text-body-secondary">
                                Deskripsi (Spesifikasi & Promo)
                            </h6>
                            {motor.description ? (
                                <div
                                    className="text-body-secondary mb-0 HTML-content-wrapper"
                                    dangerouslySetInnerHTML={{
                                        __html: motor.description,
                                    }}
                                ></div>
                            ) : (
                                <p className="text-body-tertiary fst-italic mb-0">
                                    Belum ada deskripsi.
                                </p>
                            )}
                        </CCardBody>
                    </CCard>

                    {/* Physical Inventory Units Section */}
                    <CCard>
                        <CCardHeader className="bg-transparent border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">
                                <CIcon icon={cilStorage} className="me-2" />
                                Inventaris Fisik (Unit)
                            </h5>
                            <Link 
                                href={route('admin.motor-units.index', { motor_id: motor.id })}
                                className="btn btn-sm btn-link"
                            >
                                Kelola Semua Unit
                            </Link>
                        </CCardHeader>
                        <CCardBody className="p-0">
                            <CTable hover responsive className="mb-0">
                                <CTableHead className="bg-light">
                                    <CTableRow>
                                        <CTableHeaderCell className="small">No. Rangka</CTableHeaderCell>
                                        <CTableHeaderCell className="small">No. Mesin</CTableHeaderCell>
                                        <CTableHeaderCell className="small">Warna</CTableHeaderCell>
                                        <CTableHeaderCell className="small">Status</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {motor.units && motor.units.length > 0 ? (
                                        motor.units.map(unit => (
                                            <CTableRow key={unit.id} className="small">
                                                <CTableDataCell><code>{unit.frame_number}</code></CTableDataCell>
                                                <CTableDataCell><code>{unit.engine_number}</code></CTableDataCell>
                                                <CTableDataCell>{unit.color || '-'}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge color={
                                                        unit.status === 'available' ? 'success' : 
                                                        unit.status === 'booked' ? 'warning' : 
                                                        unit.status === 'sold' ? 'info' : 'secondary'
                                                    } shape="rounded-pill" style={{fontSize: '9px'}}>
                                                        {unit.status.toUpperCase()}
                                                    </CBadge>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={4} className="text-center py-3 text-body-tertiary small">
                                                Belum ada unit fisik yang didaftarkan untuk model ini.
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
