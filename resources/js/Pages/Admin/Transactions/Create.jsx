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
    CCallout,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave } from "@coreui/icons";

export default function Create({ motors, users }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        motor_id: "",
        transaction_type: "CASH",
        payment_method: "cash",
        notes: "",
        tenor: 12,
        down_payment: "",
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
        post(route("admin.transactions.store"));
    };

    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    return (
        <AdminLayout title="Buat Transaksi Baru">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.transactions.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <CBadge
                    color="success"
                    shape="rounded-pill"
                    className="px-3 py-2"
                >
                    Transaksi Baru
                </CBadge>
            </div>

            <form onSubmit={handleSubmit}>
                <CRow>
                    <CCol xl={8}>
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Data Transaksi</strong>
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
                                            invalid={!!errors.user_id}
                                            feedbackInvalid={errors.user_id}
                                        >
                                            <option value="">
                                                -- Pilih Pelanggan --
                                            </option>
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
                                            invalid={!!errors.motor_id}
                                            feedbackInvalid={errors.motor_id}
                                        >
                                            <option value="">
                                                -- Pilih Unit --
                                            </option>
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
                                                💵 Tunai (Cash)
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
                                                💳 Angsuran (Credit)
                                            </CButton>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {data.transaction_type === "CREDIT" && (
                            <CCard className="mb-4 border-primary">
                                <CCardHeader className="bg-primary-subtle border-bottom">
                                    <strong className="text-primary">
                                        Konfigurasi Angsuran
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
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="spinner-border spinner-border-sm" />
                            ) : (
                                <CIcon icon={cilSave} />
                            )}
                            Proses Transaksi
                        </CButton>
                    </CCol>

                    {/* Sidebar */}
                    <CCol xl={4}>
                        <div className="sticky-top" style={{ top: "5rem" }}>
                            <CCard className="mb-4">
                                <CCardHeader className="bg-transparent border-bottom">
                                    <strong>Ringkasan Order</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="bg-body-tertiary rounded-3 p-3 mb-3">
                                        <div className="text-body-tertiary small">
                                            Unit Terpilih
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
                                                    Metode
                                                </div>
                                                <div className="fw-bold">
                                                    {data.transaction_type}
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol xs={6}>
                                            <div className="bg-body-tertiary rounded-3 p-3">
                                                <div className="text-body-tertiary small">
                                                    Pelanggan
                                                </div>
                                                <div className="fw-bold text-truncate">
                                                    {users.find(
                                                        (u) =>
                                                            u.id ==
                                                            data.user_id,
                                                    )?.name || "-"}
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
                                                <div className="text-body-tertiary small text-end mt-1">
                                                    + Bunga & Biaya Admin
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
