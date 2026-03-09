import React, { useState, useEffect } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
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
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilSave,
    cilTrash,
    cilFile,
    cilUser,
    cilBike,
    cilCreditCard,
} from "@coreui/icons";

export default function EditCombined({ transaction, motors, users }) {
    const [activeTab, setActiveTab] = useState(1);
    const { credit_detail, motor, user } = transaction;

    const { data, setData, put, processing, errors } = useForm({
        user_id: transaction.user_id || "",
        motor_id: transaction.motor_id || "",
        transaction_type: transaction.transaction_type || "CASH",
        notes: transaction.notes || "",
        // Credit specific fields (synced to credit_detail)
        credit_status: credit_detail?.credit_status || "menunggu_persetujuan",
        approved_amount: credit_detail?.approved_amount || "",
        tenor: credit_detail?.tenor || 12,
        down_payment: credit_detail?.down_payment || "",
        monthly_installment: credit_detail?.monthly_installment || "",
    });

    const [selectedMotor, setSelectedMotor] = useState(null);

    useEffect(() => {
        if (data.motor_id) {
            const motorObj = motors.find((m) => m.id == data.motor_id);
            setSelectedMotor(motorObj);
        } else {
            setSelectedMotor(null);
        }
    }, [data.motor_id, motors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare data for update
        const payload = {
            ...data,
            credit_detail:
                data.transaction_type === "CREDIT"
                    ? {
                          credit_status: data.credit_status,
                          approved_amount: data.approved_amount,
                          tenor: data.tenor,
                          down_payment: data.down_payment,
                          monthly_installment: data.monthly_installment,
                      }
                    : null,
        };

        router.put(
            route("admin.transactions.update", transaction.id),
            payload,
            {
                onSuccess: () => toast.success("Data berhasil diperbarui"),
                onError: () => toast.error("Gagal memperbarui data"),
            },
        );
    };

    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0);

    const creditStatusOptions = [
        {
            value: "menunggu_persetujuan",
            label: "Menunggu Persetujuan",
            color: "warning",
        },
        {
            value: "data_tidak_valid",
            label: "Data Tidak Valid",
            color: "danger",
        },
        {
            value: "dikirim_ke_surveyor",
            label: "Dikirim ke Surveyor",
            color: "info",
        },
        { value: "jadwal_survey", label: "Jadwal Survey", color: "primary" },
        { value: "disetujui", label: "Disetujui", color: "success" },
        { value: "ditolak", label: "Ditolak", color: "danger" },
    ];

    return (
        <AdminLayout title={`Edit Transaksi #${transaction.id}`}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h5 className="mb-1 fw-bold">Pusat Edit Transaksi</h5>
                    <p className="text-body-secondary small mb-0">
                        Kelola informasi umum dan status kredit dalam satu
                        tempat
                    </p>
                </div>
                <Link
                    href={route("admin.transactions.show", transaction.id)}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
            </div>

            <CCard className="mb-4">
                <CCardHeader className="bg-transparent p-0 border-0">
                    <CNav variant="tabs" className="border-bottom-0 px-3 pt-2">
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 1}
                                onClick={() => setActiveTab(1)}
                                role="button"
                                className="d-flex align-items-center gap-2"
                            >
                                <CIcon icon={cilUser} size="sm" />
                                Info Umum
                            </CNavLink>
                        </CNavItem>
                        {data.transaction_type === "CREDIT" && (
                            <CNavItem>
                                <CNavLink
                                    active={activeTab === 2}
                                    onClick={() => setActiveTab(2)}
                                    role="button"
                                    className="d-flex align-items-center gap-2"
                                >
                                    <CIcon icon={cilCreditCard} size="sm" />
                                    Proses Kredit
                                </CNavLink>
                            </CNavItem>
                        )}
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 3}
                                onClick={() => setActiveTab(3)}
                                role="button"
                                className="d-flex align-items-center gap-2"
                            >
                                <CIcon icon={cilFile} size="sm" />
                                Dokumen & Catatan
                            </CNavLink>
                        </CNavItem>
                    </CNav>
                </CCardHeader>
                <CCardBody className="p-4">
                    <form onSubmit={handleSubmit}>
                        <CTabContent>
                            <CTabPane visible={activeTab === 1}>
                                <CRow className="g-4">
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
                                    <CCol md={6}>
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
                                        <CFormLabel>
                                            Metode Transaksi
                                        </CFormLabel>
                                        <div className="d-flex gap-3 mt-1">
                                            <CFormCheck
                                                type="radio"
                                                name="transaction_type"
                                                id="typeCash"
                                                label="💵 Cash / Tunai"
                                                checked={
                                                    data.transaction_type ===
                                                    "CASH"
                                                }
                                                onChange={() =>
                                                    setData(
                                                        "transaction_type",
                                                        "CASH",
                                                    )
                                                }
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="transaction_type"
                                                id="typeCredit"
                                                label="💳 Kredit"
                                                checked={
                                                    data.transaction_type ===
                                                    "CREDIT"
                                                }
                                                onChange={() =>
                                                    setData(
                                                        "transaction_type",
                                                        "CREDIT",
                                                    )
                                                }
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </CTabPane>

                            <CTabPane visible={activeTab === 2}>
                                {data.transaction_type === "CREDIT" ? (
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <CFormLabel>
                                                Status Kredit
                                            </CFormLabel>
                                            <CFormSelect
                                                value={data.credit_status}
                                                onChange={(e) =>
                                                    setData(
                                                        "credit_status",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                {creditStatusOptions.map(
                                                    (opt) => (
                                                        <option
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </option>
                                                    ),
                                                )}
                                            </CFormSelect>
                                        </CCol>
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
                                                {[12, 24, 36, 48].map((t) => (
                                                    <option key={t} value={t}>
                                                        {t} Bulan
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                        <CCol md={4}>
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
                                            />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormLabel>
                                                Angsuran Per Bulan
                                            </CFormLabel>
                                            <CFormInput
                                                type="number"
                                                value={data.monthly_installment}
                                                onChange={(e) =>
                                                    setData(
                                                        "monthly_installment",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormLabel>
                                                Total Disetujui
                                            </CFormLabel>
                                            <CFormInput
                                                type="number"
                                                value={data.approved_amount}
                                                onChange={(e) =>
                                                    setData(
                                                        "approved_amount",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </CCol>
                                    </CRow>
                                ) : (
                                    <div className="text-center py-5 text-body-secondary">
                                        Tab ini hanya tersedia untuk transaksi
                                        Kredit.
                                    </div>
                                )}
                            </CTabPane>

                            <CTabPane visible={activeTab === 3}>
                                <CRow className="g-4">
                                    <CCol md={12}>
                                        <CFormLabel>
                                            Catatan Transaksi / Admin
                                        </CFormLabel>
                                        <CFormTextarea
                                            rows={5}
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            placeholder="Gunakan untuk catatan Surveyor, alasan penolakan, atau instruksi khusus..."
                                        />
                                    </CCol>
                                    <CCol md={12}>
                                        <div className="bg-body-tertiary p-3 rounded-3">
                                            <h6 className="fw-bold mb-2">
                                                Manajemen Dokumen
                                            </h6>
                                            <p className="small text-body-secondary mb-0">
                                                Gunakan halaman Detail Transaksi
                                                untuk mengunggah atau menghapus
                                                file dokumen KTP/KK.
                                            </p>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CTabPane>
                        </CTabContent>

                        <div className="mt-5 pt-3 border-top d-flex justify-content-end gap-2">
                            <CButton
                                type="submit"
                                color="primary"
                                className="px-4 py-2"
                                disabled={processing}
                            >
                                <CIcon icon={cilSave} className="me-2" />
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Semua Perubahan"}
                            </CButton>
                        </div>
                    </form>
                </CCardBody>
            </CCard>
        </AdminLayout>
    );
}
