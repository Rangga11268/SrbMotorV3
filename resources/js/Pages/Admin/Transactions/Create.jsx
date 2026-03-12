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

export default function Create({ motors, users }) {
    const [selectedMotor, setSelectedMotor] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        motor_id: "",
        name: "",
        nik: "",
        phone: "",
        email: "",
        motor_color: "",
        delivery_method: "Ambil di Dealer",
        address: "",
        booking_fee: 0,
        notes: "",
        status: "new_order",
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
        post(route("admin.transactions.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Transaksi baru telah dibuat.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                const errorMessage = Object.values(errors).join(", ");
                Swal.fire({
                    title: "Gagal!",
                    text:
                        errorMessage ||
                        "Terjadi kesalahan saat membuat transaksi.",
                    icon: "error",
                });
            },
        });
    };

    const totalAmount = selectedMotor?.price || 0;

    return (
        <AdminLayout title="Buat Transaksi Tunai Baru">
            <div className="mb-4">
                <Link
                    href={route("admin.transactions.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
            </div>

            <CCard>
                <CCardHeader className="bg-transparent border-bottom">
                    <strong>Buat Transaksi Tunai Baru</strong>
                </CCardHeader>
                <CCardBody>
                    <form onSubmit={handleSubmit}>
                        <CRow className="g-4">
                            {/* Pelanggan */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="user_id">
                                    Pelanggan{" "}
                                    <span className="text-danger">*</span>
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
                                    Motor <span className="text-danger">*</span>
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
                                            {motor.name} -{" "}
                                            {formatCurrency(motor.price)}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {errors.motor_id && (
                                    <div className="invalid-feedback d-block">
                                        {errors.motor_id}
                                    </div>
                                )}
                            </CCol>

                            <CCol md={12}>
                                <hr />
                                <h6>Informasi Pembeli (Sesuai KTP)</h6>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="name">Nama Lengkap <span className="text-danger">*</span></CFormLabel>
                                <CFormInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Nama Lengkap KTP"
                                />
                                {errors.name && <div className="text-danger small">{errors.name}</div>}
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="nik">NIK</CFormLabel>
                                <CFormInput
                                    id="nik"
                                    value={data.nik}
                                    onChange={(e) => setData("nik", e.target.value)}
                                    placeholder="16 Digit NIK"
                                />
                                {errors.nik && <div className="text-danger small">{errors.nik}</div>}
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="phone">Nomor WA <span className="text-danger">*</span></CFormLabel>
                                <CFormInput
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    placeholder="62812..."
                                />
                                {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="email">Email</CFormLabel>
                                <CFormInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <div className="text-danger small">{errors.email}</div>}
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="motor_color">Warna Motor</CFormLabel>
                                <CFormInput
                                    id="motor_color"
                                    value={data.motor_color}
                                    onChange={(e) => setData("motor_color", e.target.value)}
                                    placeholder="Pilihan Warna"
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="delivery_method">Metode Penyerahan</CFormLabel>
                                <CFormSelect
                                    id="delivery_method"
                                    value={data.delivery_method}
                                    onChange={(e) => setData("delivery_method", e.target.value)}
                                >
                                    <option value="Ambil di Dealer">Ambil di Dealer</option>
                                    <option value="Kirim ke Rumah">Kirim ke Rumah</option>
                                </CFormSelect>
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
                                    Booking Fee{" "}
                                    <span className="text-danger">*</span>
                                </CFormLabel>
                                <CFormInput
                                    id="booking_fee"
                                    type="number"
                                    value={data.booking_fee}
                                    onChange={(e) =>
                                        setData("booking_fee", e.target.value)
                                    }
                                    placeholder="0"
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
                                <CFormLabel htmlFor="address">
                                    Alamat Pengiriman
                                </CFormLabel>
                                <CFormTextarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Masukkan alamat pengiriman..."
                                />
                                {errors.address && (
                                    <div className="invalid-feedback d-block">
                                        {errors.address}
                                    </div>
                                )}
                            </CCol>

                            {/* Status */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="status">
                                    Status{" "}
                                    <span className="text-danger">*</span>
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
                                        Pesanan Masuk
                                    </option>
                                    <option value="waiting_payment">
                                        Menunggu Pembayaran
                                    </option>
                                    <option value="pembayaran_dikonfirmasi">
                                        Pembayaran Dikonfirmasi
                                    </option>
                                    <option value="unit_preparation">
                                        Motor Disiapkan
                                    </option>
                                    <option value="ready_for_delivery">
                                        Siap Dikirim/Ambil
                                    </option>
                                    <option value="dalam_pengiriman">
                                        Dalam Pengiriman
                                    </option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </CFormSelect>
                                {errors.status && (
                                    <div className="invalid-feedback d-block">
                                        {errors.status}
                                    </div>
                                )}
                            </CCol>

                            {/* Catatan */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="notes">
                                    Catatan Internal
                                </CFormLabel>
                                <CFormTextarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={2}
                                    placeholder="Tambahkan catatan atau informasi penting..."
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
                                        disabled={
                                            processing ||
                                            !data.user_id ||
                                            !data.motor_id
                                        }
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <CIcon icon={cilSave} size="sm" />
                                        {processing
                                            ? "Membuat..."
                                            : "Buat Transaksi"}
                                    </CButton>
                                    <Link
                                        href={route("admin.transactions.index")}
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
