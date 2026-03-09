import React, { useState, useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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
    CFormTextarea,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave, cilTrash } from "@coreui/icons";

export default function Edit({ transaction, motors, users }) {
    const {
        data,
        setData,
        put,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        user_id: transaction.user_id || "",
        motor_id: transaction.motor_id || "",
        transaction_type: transaction.transaction_type || "CASH",
        notes: transaction.notes || "",
        tenor: transaction.credit_detail?.tenor || 12,
        down_payment: transaction.credit_detail?.down_payment || "",
    });

    const [selectedMotor, setSelectedMotor] = useState(null);

    useEffect(() => {
        if (data.motor_id) {
            const motor = motors.find((m) => m.id == data.motor_id);
            setSelectedMotor(motor);
        } else {
            setSelectedMotor(null);
        }
    }, [data.motor_id, motors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.update", transaction.id));
    };

    const handleDelete = () => {
        if (
            confirm(
                "Menghapus transaksi ini akan menghilangkan semua data terkait. Lanjutkan?",
            )
        ) {
            destroy(route("admin.transactions.destroy", transaction.id));
        }
    };

    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    return (
        <AdminLayout title={`Edit Transaksi #${transaction.id}`}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h5 className="mb-1 fw-bold">Edit Data Transaksi</h5>
                    <p className="text-body-secondary small mb-0">
                        Ubah informasi umum: pelanggan, motor, jenis transaksi,
                        dan catatan
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Link
                        href={route("admin.transactions.show", transaction.id)}
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                    >
                        <CIcon icon={cilArrowLeft} size="sm" />
                        Kembali
                    </Link>
                    <CBadge
                        color="warning"
                        shape="rounded-pill"
                        className="px-3 py-2"
                    >
                        Edit Umum
                    </CBadge>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <CRow>
                    <CCol xl={8}>
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Modifikasi Data</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={12}>
                                        <CFormLabel>Pelanggan</CFormLabel>
                                        <CFormSelect
                                            value={data.user_id}
                                            onChange={(e) =>
                                                setData(
                                                    "user_id",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {users.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormLabel>Unit Motor</CFormLabel>
                                        <CFormSelect
                                            value={data.motor_id}
                                            onChange={(e) =>
                                                setData(
                                                    "motor_id",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {motors.map((motor) => (
                                                <option
                                                    key={motor.id}
                                                    value={motor.id}
                                                >
                                                    {motor.name} -{" "}
                                                    {formatRupiah(motor.price)}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormLabel>Tipe Transaksi</CFormLabel>
                                        <div className="d-flex gap-2">
                                            <CButton
                                                type="button"
                                                color={
                                                    data.transaction_type ===
                                                    "CASH"
                                                        ? "success"
                                                        : "light"
                                                }
                                                onClick={() =>
                                                    setData(
                                                        "transaction_type",
                                                        "CASH",
                                                    )
                                                }
                                                className="flex-fill"
                                            >
                                                💵 Tunai
                                            </CButton>
                                            <CButton
                                                type="button"
                                                color={
                                                    data.transaction_type ===
                                                    "CREDIT"
                                                        ? "primary"
                                                        : "light"
                                                }
                                                onClick={() =>
                                                    setData(
                                                        "transaction_type",
                                                        "CREDIT",
                                                    )
                                                }
                                                className="flex-fill"
                                            >
                                                💳 Kredit
                                            </CButton>
                                        </div>
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormLabel>Catatan</CFormLabel>
                                        <CFormTextarea
                                            value={data.notes || ""}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            rows={3}
                                            placeholder="Catatan internal..."
                                        />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {data.transaction_type === "CREDIT" && (
                            <CCard className="mb-4 border-primary">
                                <CCardHeader className="bg-primary-subtle border-bottom">
                                    <strong className="text-primary">
                                        Data Kredit
                                    </strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CRow className="g-3">
                                        <CCol md={6}>
                                            <CFormLabel>
                                                Tenor (Bulan)
                                            </CFormLabel>
                                            <CFormSelect
                                                value={data.tenor}
                                                onChange={(e) =>
                                                    setData(
                                                        "tenor",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                {[12, 24, 36, 48].map((m) => (
                                                    <option key={m} value={m}>
                                                        {m} Bulan
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel>
                                                Uang Muka (DP)
                                            </CFormLabel>
                                            <CFormInput
                                                type="number"
                                                value={data.down_payment}
                                                onChange={(e) =>
                                                    setData(
                                                        "down_payment",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="0"
                                                invalid={!!errors.down_payment}
                                                feedbackInvalid={
                                                    errors.down_payment
                                                }
                                            />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        )}

                        <CButton
                            type="submit"
                            color="primary"
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-4"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="spinner-border spinner-border-sm" />
                            ) : (
                                <CIcon icon={cilSave} />
                            )}
                            Simpan Perubahan
                        </CButton>

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
                                    Menghapus transaksi akan menghilangkan semua
                                    data pembayaran dan dokumen terkait secara
                                    permanen.
                                </p>
                                <CButton
                                    color="danger"
                                    variant="outline"
                                    className="w-100"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    Hapus Transaksi
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol xl={4}>
                        <div className="sticky-top" style={{ top: "5rem" }}>
                            <CCard>
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong>Info Saat Ini</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="bg-body-tertiary rounded-3 p-3 mb-3">
                                        <div className="text-body-tertiary small">
                                            Unit
                                        </div>
                                        <div className="fw-bold">
                                            {selectedMotor
                                                ? selectedMotor.name
                                                : "Belum dipilih"}
                                        </div>
                                        {selectedMotor && (
                                            <div className="text-primary fw-bold mt-1">
                                                {formatRupiah(
                                                    selectedMotor.price,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <CRow className="g-2">
                                        <CCol xs={6}>
                                            <div className="bg-body-tertiary rounded-3 p-3">
                                                <div className="text-body-tertiary small">
                                                    Tipe
                                                </div>
                                                <div className="fw-bold">
                                                    {
                                                        transaction.transaction_type
                                                    }
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol xs={6}>
                                            <div className="bg-body-tertiary rounded-3 p-3">
                                                <div className="text-body-tertiary small">
                                                    Status
                                                </div>
                                                <div className="fw-bold text-truncate">
                                                    {(
                                                        transaction.status || ""
                                                    ).replace(/_/g, " ")}
                                                </div>
                                            </div>
                                        </CCol>
                                    </CRow>

                                    {data.transaction_type === "CREDIT" &&
                                        selectedMotor &&
                                        data.down_payment && (
                                            <div className="bg-primary-subtle rounded-3 p-3 mt-3">
                                                <div className="text-primary small fw-semibold">
                                                    Estimasi Kredit
                                                </div>
                                                <div className="d-flex justify-content-between mt-1">
                                                    <span className="small">
                                                        Pokok Hutang
                                                    </span>
                                                    <span className="fw-bold">
                                                        {formatRupiah(
                                                            selectedMotor.price -
                                                                data.down_payment,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                </CRow>
            </form>
        </AdminLayout>
    );
}
