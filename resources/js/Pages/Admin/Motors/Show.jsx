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
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilArrowLeft, cilBike } from "@coreui/icons";

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

    const specs = Array.isArray(motor.specifications)
        ? motor.specifications.reduce(
              (acc, spec) => ({ ...acc, [spec.spec_key]: spec.spec_value }),
              {},
          )
        : motor.specifications || {};

    const specItems = [
        { label: "Tipe Mesin", value: specs.engine_type },
        {
            label: "Kapasitas",
            value: specs.engine_size ? `${specs.engine_size} cc` : null,
        },
        { label: "Sistem Bahan Bakar", value: specs.fuel_system },
        { label: "Transmisi", value: specs.transmission },
        {
            label: "Tenaga Maks",
            value: specs.max_power ? `${specs.max_power} kW` : null,
        },
        {
            label: "Torsi Maks",
            value: specs.max_torque ? `${specs.max_torque} Nm` : null,
        },
    ];

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
                                        src={`/storage/${motor.image_path}`}
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
                                {motor.tersedia ? (
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
                                </div>
                                <span className="text-body-tertiary small">
                                    ID: #{motor.id.toString().padStart(6, "0")}
                                </span>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <h6 className="fw-semibold mb-3 text-body-secondary">
                                Spesifikasi Teknis
                            </h6>
                            <CTable borderless responsive className="mb-0">
                                <CTableBody>
                                    {specItems.map(
                                        (item, i) =>
                                            item.value && (
                                                <CTableRow key={i}>
                                                    <CTableHeaderCell
                                                        className="text-body-secondary ps-0"
                                                        style={{ width: "40%" }}
                                                    >
                                                        {item.label}
                                                    </CTableHeaderCell>
                                                    <CTableDataCell className="fw-medium">
                                                        {item.value}
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ),
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>

                    {motor.details && (
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Deskripsi</strong>
                            </CCardHeader>
                            <CCardBody>
                                <p className="text-body-secondary mb-0 white-space-pre-line">
                                    {motor.details}
                                </p>
                            </CCardBody>
                        </CCard>
                    )}

                    {specs.additional_specs && (
                        <CCard>
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Catatan Tambahan</strong>
                            </CCardHeader>
                            <CCardBody>
                                <p className="text-body-secondary mb-0">
                                    {specs.additional_specs}
                                </p>
                            </CCardBody>
                        </CCard>
                    )}
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
