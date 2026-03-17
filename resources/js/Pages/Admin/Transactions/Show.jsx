import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CBadge,
    CButton,
    CFormSelect,
    CFormLabel,
    CFormTextarea,
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilTrash,
    cilPencil,
    cilSave,
    cilX,
    cilBike,
} from "@coreui/icons";

export default function Show({ transaction, motors, users, availableUnits }) {
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Form for unit allocation
    const allocationForm = useForm({
        motor_unit_id: transaction.motor_unit_id || "",
    });

    const { data, setData, put, processing, errors } = useForm({
        user_id: transaction.user_id || "",
        motor_id: transaction.motor_id || "",
        name: transaction.name || "",
        nik: transaction.nik || "",
        phone: transaction.phone || "",
        email: transaction.email || "",
        motor_color: transaction.motor_color || "",
        delivery_method: transaction.delivery_method || "Ambil di Dealer",
        address: transaction.address || "",
        notes: transaction.notes || "",
        status: transaction.status || "new_order",
        booking_fee: transaction.booking_fee || 0,
        delivery_date: transaction.delivery_date || "",
    });

    const formatCurrency = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    const getStatusBadge = (status) => {
        const map = {
            new_order: { color: "warning", label: "Pesanan Masuk" },
            waiting_payment: { color: "warning", label: "Menunggu Pembayaran" },
            pembayaran_dikonfirmasi: {
                color: "success",
                label: "Pembayaran Dikonfirmasi",
            },
            unit_preparation: { color: "info", label: "Motor Disiapkan" },
            ready_for_delivery: { color: "primary", label: "Siap Dikirim/Ambil" },
            dalam_pengiriman: { color: "info", label: "Dalam Pengiriman" },
            completed: { color: "success", label: "Selesai" },
            cancelled: { color: "danger", label: "Dibatalkan" },
        };
        const badge = map[status] || { color: "secondary", label: status };
        return <CBadge color={badge.color}>{badge.label}</CBadge>;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.update", transaction.id), {
            onSuccess: () => {
                setIsEditMode(false);
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
                    text: "Terjadi kesalahan.",
                    icon: "error",
                });
            },
        });
    };

    const confirmDelete = () => {
        Swal.fire({
            title: "Hapus Transaksi?",
            text: "Data pembayaran dan detail transaksi akan dihapus.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    route("admin.transactions.destroy", transaction.id),
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Terhapus!",
                                "Transaksi berhasil dihapus.",
                                "success",
                            );
                            router.visit(route("admin.transactions.index"));
                        },
                    },
                );
            }
        });
    };

    const motor = motors.find((m) => m.id == transaction.motor_id);
    const user = users.find((u) => u.id == transaction.user_id);

    return (
        <AdminLayout title={`Transaksi Tunai #${transaction.id}`}>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <Link
                    href={route("admin.transactions.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>

                <div className="d-flex flex-wrap gap-2">
                    {!isEditMode ? (
                        <>
                            <CButton
                                color="primary"
                                size="sm"
                                onClick={() => setIsEditMode(true)}
                                className="d-flex align-items-center gap-2"
                            >
                                <CIcon icon={cilPencil} size="sm" />
                                Edit
                            </CButton>
                            {getStatusBadge(transaction.status)}
                            <a
                                href={route("admin.transactions.invoice.preview", transaction.id)}
                                target="_blank"
                                className="btn btn-info btn-sm text-white d-flex align-items-center gap-2"
                            >
                                <CIcon icon={cilSave} size="sm" />
                                Invoice
                            </a>
                            {transaction.status !== "cancelled" && (
                                <CButton
                                    color="secondary"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        Swal.fire({
                                            title: "Batalkan Transaksi?",
                                            text: "Status akan diubah menjadi Dibatalkan.",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Ya",
                                            cancelButtonText: "Tidak",
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                router.post(
                                                    route(
                                                        "admin.transactions.updateStatus",
                                                        transaction.id,
                                                    ),
                                                    {
                                                        status: "cancelled",
                                                    },
                                                );
                                            }
                                        });
                                    }}
                                >
                                    Batalkan
                                </CButton>
                            )}
                        </>
                    ) : (
                        <>
                            <CButton
                                color="success"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                <CIcon icon={cilSave} size="sm" />
                                Simpan
                            </CButton>
                            <CButton
                                color="secondary"
                                size="sm"
                                onClick={() => setIsEditMode(false)}
                            >
                                <CIcon icon={cilX} size="sm" />
                                Batal
                            </CButton>
                        </>
                    )}
                </div>
            </div>

            <CRow>
                <CCol xl={8}>
                    {/* Unit Info */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong className="d-flex align-items-center gap-2">
                                <CIcon icon={cilBike} size="sm" />
                                Data Unit Motor
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            {isEditMode ? (
                                <CRow className="g-3">
                                    <CCol md={6}>
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
                                            <option value="" disabled>Pilih Pelanggan</option>
                                            {users.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.email})
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Motor</CFormLabel>
                                        <CFormSelect
                                            value={data.motor_id}
                                            onChange={(e) =>
                                                setData(
                                                    "motor_id",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {motors.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormLabel>Alamat</CFormLabel>
                                        <CFormTextarea
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Status</CFormLabel>
                                        <CFormSelect
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value,
                                                )
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
                                            <option value="completed">
                                                Selesai
                                            </option>
                                            <option value="cancelled">
                                                Dibatalkan
                                            </option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Booking Fee</CFormLabel>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.booking_fee}
                                            onChange={(e) =>
                                                setData(
                                                    "booking_fee",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Estimasi Pengiriman</CFormLabel>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={data.delivery_date}
                                            onChange={(e) => setData("delivery_date", e.target.value)}
                                        />
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormLabel>Catatan</CFormLabel>
                                        <CFormTextarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            rows={2}
                                        />
                                    </CCol>
                                </CRow>
                            ) : (
                                <CRow className="g-4">
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Nama Lengkap (KTP)
                                            </p>
                                            <p className="fw-semibold">
                                                {transaction.name || user?.name || "N/A"}
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                NIK
                                            </p>
                                            <p className="fw-semibold">
                                                {transaction.nik || "-"}
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                WhatsApp
                                            </p>
                                            <p className="d-flex align-items-center gap-2">
                                                <span className="fw-semibold">{transaction.phone || user?.phone || "N/A"}</span>
                                                {(transaction.phone || user?.phone) && (
                                                    <a 
                                                        href={`https://wa.me/${(transaction.phone || user?.phone).replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${transaction.name || user?.name}, saya admin dari SRB Motor. Terkait pesanan motor ${motor?.name} Anda...`)}`}
                                                        target="_blank"
                                                        className="btn btn-success btn-sm py-0 px-2 rounded-pill"
                                                        style={{ fontSize: '10px' }}
                                                    >
                                                        Hubungi WA
                                                    </a>
                                                )}
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Email
                                            </p>
                                            <p className="fw-semibold">
                                                {transaction.email || user?.email || "-"}
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Motor
                                            </p>
                                            <p className="fw-semibold">
                                                {motor?.name || "N/A"} 
                                                {transaction.motor_color && <span className="text-body-secondary ms-1">({transaction.motor_color})</span>}
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Metode Penyerahan
                                            </p>
                                            <p className="fw-semibold">
                                                <CBadge color={transaction.delivery_method === 'Ambil di Dealer' ? 'info' : 'primary'} variant="outline">
                                                    {transaction.delivery_method || "Ambil di Dealer"}
                                                </CBadge>
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Harga Unit
                                            </p>
                                            <p className="fw-semibold text-primary">
                                                {formatCurrency(motor?.price)}
                                            </p>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Booking Fee
                                            </p>
                                            <p className="fw-semibold">
                                                {formatCurrency(transaction.booking_fee || 0)}
                                            </p>
                                        </div>
                                    </CCol>

                                    {/* Estimasi Pengiriman Display */}
                                    {transaction.delivery_date && (
                                        <CCol md={12}>
                                            <div className="p-3 bg-light rounded shadow-sm border-start border-4 border-info">
                                                <h7 className="d-block mb-3 fw-bold text-info">ESTIMASI PENGIRIMAN</h7>
                                                <CRow>
                                                    <CCol md={12}>
                                                        <p className="text-body-secondary small mb-1">Estimasi Tiba</p>
                                                        <p className="fw-bold mb-0 text-primary">
                                                            {new Date(transaction.delivery_date).toLocaleDateString("id-ID", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </CCol>
                                                </CRow>
                                            </div>
                                        </CCol>
                                    )}

                                    <CCol md={12}>
                                        <div>
                                            <p className="text-body-secondary small mb-1">
                                                Alamat Lengkap
                                            </p>
                                            <p className="fw-semibold">
                                                {transaction.address || "-"}
                                            </p>
                                        </div>
                                    </CCol>
                                    {transaction.notes && (
                                        <CCol md={12}>
                                            <div>
                                                <p className="text-body-secondary small mb-1">
                                                    Catatan Pembeli
                                                </p>
                                                <p className="fw-semibold italic">
                                                    "{transaction.notes}"
                                                </p>
                                            </div>
                                        </CCol>
                                    )}
                                </CRow>
                            )}
                        </CCardBody>
                    </CCard>



                    {/* Transaction Logs (PHASE 6) */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent">
                            <strong>Riwayat Status & Log Transaksi</strong>
                        </CCardHeader>
                        <CCardBody className="p-0">
                            <CTable hover responsive className="mb-0 small">
                                <CTableHead className="bg-light">
                                    <CTableRow>
                                        <CTableHeaderCell>Waktu</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                        <CTableHeaderCell>Actor</CTableHeaderCell>
                                        <CTableHeaderCell>Catatan</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {transaction.logs && transaction.logs.length > 0 ? (
                                        transaction.logs.map(log => (
                                            <CTableRow key={log.id}>
                                                <CTableDataCell className="text-nowrap">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge color="secondary" variant="outline" className="me-1">{log.status_from}</CBadge>
                                                    &rarr;
                                                    <CBadge color="primary" className="ms-1">{log.status_to}</CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {log.actor?.name || 'System'}
                                                    <div className="text-body-secondary" style={{fontSize: '9px'}}>{log.actor_type.toUpperCase()}</div>
                                                </CTableDataCell>
                                                <CTableDataCell>{log.notes || '-'}</CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={4} className="text-center py-3">Belum ada log rincian.</CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol xl={4}>
                    {/* Summary */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong>Ringkasan</strong>
                        </CCardHeader>
                        <CCardBody>
                            <div className="mb-3 pb-3 border-bottom">
                                <p className="text-body-secondary small mb-1">
                                    No. Transaksi
                                </p>
                                <p className="fw-bold text-primary">
                                    #
                                    {transaction.id.toString().padStart(6, "0")}
                                </p>
                            </div>
                            <div className="mb-3 pb-3 border-bottom">
                                <p className="text-body-secondary small mb-1">
                                    Tanggal
                                </p>
                                <p className="fw-semibold">
                                    {new Date(
                                        transaction.created_at,
                                    ).toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="mb-3 pb-3 border-bottom">
                                <p className="text-body-secondary small mb-1">
                                    Total Bayar
                                </p>
                                <p className="fw-bold fs-5 text-dark">
                                    {formatCurrency(transaction.total_price)}
                                </p>
                            </div>
                            <div>
                                <p className="text-body-secondary small mb-1">
                                    Status
                                </p>
                                <p>{getStatusBadge(transaction.status)}</p>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
