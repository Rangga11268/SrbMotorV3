import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CFormInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilSave } from "@coreui/icons";

export default function Edit({ transaction, motors, users }) {
    const [selectedMotor, setSelectedMotor] = useState(
        motors.find((m) => m.id === transaction.motor_id),
    );

    const { data, setData, put, processing, errors } = useForm({
        user_id: transaction.user_id || "",
        motor_id: transaction.motor_id || "",
        customer_address: transaction.customer_address || "",
        booking_fee: transaction.booking_fee || 0,
        notes: transaction.notes || "",
        status: transaction.status || "new_order",
    });

    const handleMotorChange = (motorId) => {
        const motor = motors.find((m) => m.id == motorId);
        setSelectedMotor(motor);
        setData("motor_id", motorId);
    };

    const formatCurrency = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.update", transaction.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Transaksi telah diperbarui.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Gagal!",
                    text: Object.values(errors).join(", "),
                    icon: "error",
                });
            },
        });
    };

    const totalAmount =
        (selectedMotor?.price || 0) + (parseFloat(data.booking_fee) || 0);

    return (
        <AdminLayout title={`Edit Transaksi Tunai #${transaction.id}`}>
            <div className="mb-4">
                <Link
                    href={route("admin.transactions.show", transaction.id)}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
            </div>

            <CCard>
                <CCardHeader className="bg-transparent border-bottom">
                    <strong>Edit Transaksi #{transaction.id}</strong>
                </CCardHeader>
                <CCardBody>
                    <form onSubmit={handleSubmit}>
                        <CRow className="g-4">
                            {/* Pelanggan */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="user_id">
                                    Pelanggan *
                                </CFormLabel>
                                <CFormSelect
                                    id="user_id"
                                    value={data.user_id}
                                    onChange={(e) =>
                                        setData("user_id", e.target.value)
                                    }
                                    className={
                                        errors.user_id ? "is-invalid" : ""
                                    }
                                >
                                    <option value="">Pilih Pelanggan</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {errors.user_id && (
                                    <div className="invalid-feedback d-block">
                                        {errors.user_id}
                                    </div>
                                )}
                            </CCol>

                            {/* Motor */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="motor_id">
                                    Motor *
                                </CFormLabel>
                                <CFormSelect
                                    id="motor_id"
                                    value={data.motor_id}
                                    onChange={(e) =>
                                        handleMotorChange(e.target.value)
                                    }
                                    className={
                                        errors.motor_id ? "is-invalid" : ""
                                    }
                                >
                                    <option value="">Pilih Motor</option>
                                    {motors.map((motor) => (
                                        <option key={motor.id} value={motor.id}>
                                            {motor.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {errors.motor_id && (
                                    <div className="invalid-feedback d-block">
                                        {errors.motor_id}
                                    </div>
                                )}
                            </CCol>

                            {/* Harga Motor */}
                            {selectedMotor && (
                                <CCol md={6}>
                                    <CFormLabel>Harga Motor</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={formatCurrency(
                                            selectedMotor.price,
                                        )}
                                    />
                                </CCol>
                            )}

                            {/* Booking Fee */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="booking_fee">
                                    Booking Fee *
                                </CFormLabel>
                                <CFormInput
                                    id="booking_fee"
                                    type="number"
                                    value={data.booking_fee}
                                    onChange={(e) =>
                                        setData("booking_fee", e.target.value)
                                    }
                                    className={
                                        errors.booking_fee ? "is-invalid" : ""
                                    }
                                />
                                {errors.booking_fee && (
                                    <div className="invalid-feedback d-block">
                                        {errors.booking_fee}
                                    </div>
                                )}
                            </CCol>

                            {/* Total */}
                            <CCol md={6}>
                                <CFormLabel>Total Pembayaran</CFormLabel>
                                <CFormInput
                                    type="text"
                                    disabled
                                    className="fw-bold text-primary"
                                    value={formatCurrency(totalAmount)}
                                />
                            </CCol>

                            {/* Alamat */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="customer_address">
                                    Alamat Pengiriman
                                </CFormLabel>
                                <CFormTextarea
                                    id="customer_address"
                                    value={data.customer_address}
                                    onChange={(e) =>
                                        setData(
                                            "customer_address",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                />
                                {errors.customer_address && (
                                    <div className="invalid-feedback d-block">
                                        {errors.customer_address}
                                    </div>
                                )}
                            </CCol>

                            {/* Status */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="status">
                                    Status *
                                </CFormLabel>
                                <CFormSelect
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className={
                                        errors.status ? "is-invalid" : ""
                                    }
                                >
                                    <option value="new_order">
                                        Pesanan Baru
                                    </option>
                                    <option value="waiting_payment">
                                        Menunggu Pembayaran
                                    </option>
                                    <option value="payment_confirmed">
                                        Pembayaran Dikonfirmasi
                                    </option>
                                    <option value="unit_preparation">
                                        Persiapan Unit
                                    </option>
                                    <option value="ready_for_delivery">
                                        Siap Dikirim
                                    </option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                </CFormSelect>
                                {errors.status && (
                                    <div className="invalid-feedback d-block">
                                        {errors.status}
                                    </div>
                                )}
                            </CCol>

                            {/* Catatan */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="notes">Catatan</CFormLabel>
                                <CFormTextarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={2}
                                />
                                {errors.notes && (
                                    <div className="invalid-feedback d-block">
                                        {errors.notes}
                                    </div>
                                )}
                            </CCol>

                            {/* Submit */}
                            <CCol md={12}>
                                <div className="d-flex gap-2">
                                    <CButton
                                        color="primary"
                                        type="submit"
                                        disabled={processing}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <CIcon icon={cilSave} size="sm" />
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </CButton>
                                    <Link
                                        href={route(
                                            "admin.transactions.show",
                                            transaction.id,
                                        )}
                                        className="btn btn-outline-secondary"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </CCol>
                        </CRow>
                    </form>
                </CCardBody>
            </CCard>
        </AdminLayout>
    );
}
