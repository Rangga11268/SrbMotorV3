import React, { useState, useEffect } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import Modal from "@/Components/Modal";
import SurveyScheduleModal from "@/Components/SurveyScheduleModal";
import SurveyScheduleCard from "@/Components/SurveyScheduleCard";
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
    CFormInput,
    CFormTextarea,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CProgress,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilTrash,
    cilPencil,
    cilSave,
    cilX,
    cilFile,
    cilCheckCircle,
    cilXCircle,
    cilUser,
    cilBike,
    cilCreditCard,
    cilMap,
} from "@coreui/icons";
import { toast } from "react-hot-toast";

export default function ShowConsolidated({
    transaction: initialTransaction,
    motors,
    users,
}) {
    const [transaction, setTransaction] = useState(initialTransaction);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "info",
        title: "",
        message: "",
        onConfirm: () => {},
        confirmText: "Konfirmasi",
    });
    const [processingAction, setProcessingAction] = useState(false);
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    const { credit_detail, motor, user } = transaction;
    const documents = credit_detail?.documents || [];

    // Form state untuk edit
    const { data, setData, put, processing, errors } = useForm({
        user_id: transaction.user_id || "",
        motor_id: transaction.motor_id || "",
        transaction_type: transaction.transaction_type || "CASH",
        customer_address: transaction.customer_address || "",
        notes: transaction.notes || "",
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

    const formatRupiah = (n) =>
        `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    const formatStatus = (status) =>
        (status || "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

    const formatPaymentMethod = (method) => {
        if (!method) return "-";
        return method
            .replace("midtrans_", "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const getStatusColor = (status) => {
        if (
            [
                "completed",
                "disetujui",
                "ready_for_delivery",
                "payment_confirmed",
                "paid",
            ].includes(status)
        )
            return "success";
        if (
            [
                "menunggu_persetujuan",
                "new_order",
                "waiting_payment",
                "unit_preparation",
                "dikirim_ke_surveyor",
                "jadwal_survey",
                "waiting_approval",
            ].includes(status)
        )
            return "warning";
        if (
            [
                "ditolak",
                "data_tidak_valid",
                "cancelled",
                "rejected",
                "overdue",
            ].includes(status)
        )
            return "danger";
        return "info";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
                onSuccess: () => {
                    setIsEditMode(false);
                    Swal.fire({
                        title: "Berhasil!",
                        text: "Data transaksi telah diperbarui.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        background: "#ffffff",
                        customClass: {
                            title: "text-success fw-bold",
                            popup: "rounded-4 shadow-lg border-0",
                        },
                    });
                },
                onError: () => {
                    Swal.fire({
                        title: "Gagal!",
                        text: "Mohon periksa kembali form Anda.",
                        icon: "error",
                        background: "#ffffff",
                        customClass: {
                            title: "text-danger fw-bold",
                            popup: "rounded-4 shadow-lg border-0",
                        },
                    });
                },
            },
        );
    };

    const handleStatusUpdate = (e) => {
        const newStatus = e.target.value;
        const selectedOption = creditStatusOptions.find(
            (opt) => opt.value === newStatus,
        );
        const statusLabel = selectedOption
            ? selectedOption.label
            : formatStatus(newStatus);

        setModalConfig({
            isOpen: true,
            title: "Konfirmasi Perubahan Status",
            message: `Anda akan mengubah status transaksi ini menjadi "${statusLabel}". Lanjutkan?`,
            type: "info",
            confirmText: "Ya, Ubah Status",
            onConfirm: () => processStatusUpdate(newStatus),
        });
    };

    const processStatusUpdate = async (newStatus) => {
        setProcessingAction(true);
        try {
            await axios.post(
                route("admin.transactions.updateStatus", transaction.id),
                { status: newStatus },
            );

            setTransaction((prev) => ({ ...prev, status: newStatus }));
            setData("credit_status", newStatus);
            setModalConfig((prev) => ({ ...prev, isOpen: false }));

            Swal.fire({
                title: "Berhasil!",
                text: "Status transaksi telah diperbarui.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                background: "#ffffff",
                customClass: {
                    title: "text-success fw-bold",
                    popup: "rounded-4 shadow-lg border-0",
                },
            });
        } catch (error) {
            Swal.fire({
                title: "Gagal!",
                text: "Terjadi kesalahan saat memperbarui status.",
                icon: "error",
                background: "#ffffff",
                customClass: {
                    title: "text-danger fw-bold",
                    popup: "rounded-4 shadow-lg border-0",
                },
            });
        } finally {
            setProcessingAction(false);
        }
    };

    const confirmDelete = () => {
        setModalConfig({
            isOpen: true,
            title: "Hapus Transaksi",
            message:
                "Menghapus transaksi akan menghilangkan semua data pembayaran dan dokumen terkait. Lanjutkan?",
            type: "danger",
            confirmText: "Hapus",
            onConfirm: () => processDelete(),
        });
    };

    const processDelete = () => {
        setProcessingAction(true);
        router.delete(route("admin.transactions.destroy", transaction.id), {
            onSuccess: () => {
                setProcessingAction(false);
                toast.success("Transaksi berhasil dihapus");
            },
            onError: () => {
                setProcessingAction(false);
                toast.error("Gagal menghapus transaksi");
            },
        });
    };

    const paidInstallments =
        transaction.installments?.filter((i) => i.status === "paid").length ||
        0;
    const totalInstallments = credit_detail?.tenor || 0;
    const progressPercentage =
        totalInstallments > 0
            ? Math.round((paidInstallments / totalInstallments) * 100)
            : 0;

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
        <AdminLayout title={`Transaksi #${transaction.id}`}>
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
                processing={processingAction}
            />

            {/* Top Bar */}
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
                                Edit Transaksi
                            </CButton>
                            <CBadge
                                color={getStatusColor(transaction.status)}
                                shape="rounded-pill"
                                className="px-3 py-2"
                            >
                                {formatStatus(transaction.status)}
                            </CBadge>
                            <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={confirmDelete}
                            >
                                <CIcon icon={cilTrash} size="sm" />
                            </CButton>
                        </>
                    ) : (
                        <>
                            <CButton
                                color="success"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="d-flex align-items-center gap-2"
                            >
                                <CIcon icon={cilSave} size="sm" />
                                {processing ? "Menyimpan..." : "Simpan"}
                            </CButton>
                            <CButton
                                color="secondary"
                                size="sm"
                                onClick={() => setIsEditMode(false)}
                                className="d-flex align-items-center gap-2"
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
                    {/* UNIT INFO CARD */}
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
                                        <CFormLabel>Alamat Lengkap</CFormLabel>
                                        <CFormTextarea
                                            value={data.customer_address}
                                            onChange={(e) =>
                                                setData(
                                                    "customer_address",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="Alamat pengiriman unit..."
                                        />
                                    </CCol>
                                </CRow>
                            ) : (
                                <div className="d-flex flex-column flex-md-row gap-4">
                                    <div
                                        className="bg-body-tertiary rounded-3 overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{
                                            width: 180,
                                            aspectRatio: "16/10",
                                        }}
                                    >
                                        {motor?.image_path ? (
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
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1">
                                            {motor?.name}
                                        </h5>
                                        <p className="text-body-secondary small mb-3">
                                            {motor?.type} • {motor?.year}
                                        </p>
                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <div className="bg-body-tertiary rounded-2 p-2">
                                                    <div className="text-body-tertiary small">
                                                        Harga OTR
                                                    </div>
                                                    <div className="fw-bold small">
                                                        {formatRupiah(
                                                            motor?.price,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="bg-body-tertiary rounded-2 p-2">
                                                    <div className="text-body-tertiary small">
                                                        Tipe
                                                    </div>
                                                    <div className="fw-bold small">
                                                        <CBadge
                                                            color={
                                                                transaction.transaction_type ===
                                                                "CASH"
                                                                    ? "success"
                                                                    : "info"
                                                            }
                                                        >
                                                            {
                                                                transaction.transaction_type
                                                            }
                                                        </CBadge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-body-secondary small mb-0">
                                            <strong>Alamat:</strong>{" "}
                                            {transaction.customer_address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>

                    {/* CREDIT INFO CARD (CREDIT ONLY) */}
                    {transaction.transaction_type === "CREDIT" && (
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong className="d-flex align-items-center gap-2">
                                    <CIcon icon={cilCreditCard} size="sm" />
                                    Informasi Kredit
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                {isEditMode ? (
                                    <CRow className="g-3">
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
                                                DP (Uang Muka)
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
                                                Angsuran/Bulan
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

                                        {data.credit_status ===
                                            "jadwal_survey" && (
                                            <CCol md={12}>
                                                <div
                                                    className="alert alert-warning border-0"
                                                    role="alert"
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <h6 className="alert-heading mb-1">
                                                                Jadwalkan Survey
                                                            </h6>
                                                            <p className="mb-0 small">
                                                                Status berubah
                                                                ke "Jadwal
                                                                Survey". Klik
                                                                tombol di
                                                                samping untuk
                                                                jadwalkan
                                                                inspeksi.
                                                            </p>
                                                        </div>
                                                        <CButton
                                                            color="primary"
                                                            size="sm"
                                                            onClick={() =>
                                                                setShowSurveyModal(
                                                                    true,
                                                                )
                                                            }
                                                            className="flex-shrink-0 ms-3"
                                                        >
                                                            <CIcon
                                                                icon={cilMap}
                                                                className="me-2"
                                                                size="sm"
                                                            />
                                                            Jadwalkan
                                                        </CButton>
                                                    </div>
                                                </div>
                                            </CCol>
                                        )}
                                    </CRow>
                                ) : (
                                    <CRow className="g-2">
                                        <CCol md={6}>
                                            <div className="bg-body-tertiary rounded-2 p-3">
                                                <div className="text-body-tertiary small">
                                                    Status Kredit
                                                </div>
                                                <div className="fw-bold">
                                                    <CBadge
                                                        color={
                                                            creditStatusOptions.find(
                                                                (o) =>
                                                                    o.value ===
                                                                    credit_detail?.credit_status,
                                                            )?.color
                                                        }
                                                    >
                                                        {
                                                            creditStatusOptions.find(
                                                                (o) =>
                                                                    o.value ===
                                                                    credit_detail?.credit_status,
                                                            )?.label
                                                        }
                                                    </CBadge>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="bg-body-tertiary rounded-2 p-3">
                                                <div className="text-body-tertiary small">
                                                    Tenor
                                                </div>
                                                <div className="fw-bold">
                                                    {credit_detail?.tenor || 0}{" "}
                                                    Bulan
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={4}>
                                            <div className="bg-body-tertiary rounded-2 p-3">
                                                <div className="text-body-tertiary small">
                                                    DP
                                                </div>
                                                <div className="fw-bold small">
                                                    {formatRupiah(
                                                        credit_detail?.down_payment,
                                                    )}
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={4}>
                                            <div className="bg-body-tertiary rounded-2 p-3">
                                                <div className="text-body-tertiary small">
                                                    Angsuran/Bulan
                                                </div>
                                                <div className="fw-bold small">
                                                    {formatRupiah(
                                                        credit_detail?.monthly_installment,
                                                    )}
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={4}>
                                            <div className="bg-body-tertiary rounded-2 p-3">
                                                <div className="text-body-tertiary small">
                                                    Total Disetujui
                                                </div>
                                                <div className="fw-bold small">
                                                    {formatRupiah(
                                                        credit_detail?.approved_amount,
                                                    )}
                                                </div>
                                            </div>
                                        </CCol>

                                        {credit_detail?.credit_status ===
                                            "jadwal_survey" && (
                                            <CCol md={12}>
                                                <div
                                                    className="alert alert-warning border-0"
                                                    role="alert"
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <h6 className="alert-heading mb-1">
                                                                Jadwalkan Survey
                                                            </h6>
                                                            <p className="mb-0 small">
                                                                Status: Jadwal
                                                                Survey. Klik
                                                                tombol untuk
                                                                jadwalkan
                                                                inspeksi lokasi.
                                                            </p>
                                                        </div>
                                                        <CButton
                                                            color="primary"
                                                            size="sm"
                                                            onClick={() =>
                                                                setShowSurveyModal(
                                                                    true,
                                                                )
                                                            }
                                                            className="flex-shrink-0 ms-3"
                                                        >
                                                            <CIcon
                                                                icon={cilMap}
                                                                className="me-2"
                                                                size="sm"
                                                            />
                                                            Jadwalkan
                                                        </CButton>
                                                    </div>
                                                </div>
                                            </CCol>
                                        )}
                                    </CRow>
                                )}
                            </CCardBody>
                        </CCard>
                    )}

                    {/* SURVEY SCHEDULE CARD */}
                    {transaction.transaction_type === "CREDIT" && (
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong className="d-flex align-items-center gap-2">
                                    <CIcon icon={cilMap} size="sm" />
                                    Jadwal Survey
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                {credit_detail?.survey_schedule ? (
                                    <div className="mt-3">
                                        <SurveyScheduleCard
                                            surveySchedule={
                                                credit_detail.survey_schedule
                                            }
                                            onReschedule={() =>
                                                setShowSurveyModal(true)
                                            }
                                            isAdmin={true}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="alert alert-info border-0"
                                        role="alert"
                                    >
                                        <strong>
                                            Belum ada jadwal survey.
                                        </strong>{" "}
                                        Edit transaksi dan ubah status ke
                                        "Jadwal Survey" untuk membuat jadwal.
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    )}

                    {/* NOTES CARD */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong className="d-flex align-items-center gap-2">
                                <CIcon icon={cilFile} size="sm" />
                                Catatan
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            {isEditMode ? (
                                <CFormTextarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Catatan untuk surveyor, alasan penolakan, atau instruksi khusus..."
                                />
                            ) : (
                                <p className="text-body-secondary small mb-0">
                                    {data.notes || "Tidak ada catatan"}
                                </p>
                            )}
                        </CCardBody>
                    </CCard>

                    {/* INSTALLMENTS (CREDIT ONLY) */}
                    {transaction.transaction_type === "CREDIT" && (
                        <CCard>
                            <CCardHeader className="bg-transparent border-bottom">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                    <strong>Riwayat Angsuran</strong>
                                    <div className="d-flex gap-2">
                                        <CBadge
                                            color="success-subtle"
                                            textColor="success"
                                        >
                                            Lunas: {paidInstallments}
                                        </CBadge>
                                        <CBadge
                                            color="secondary-subtle"
                                            textColor="secondary"
                                        >
                                            Sisa:{" "}
                                            {totalInstallments -
                                                paidInstallments}
                                        </CBadge>
                                    </div>
                                </div>
                            </CCardHeader>
                            <CProgress
                                value={progressPercentage}
                                color="success"
                                style={{ height: 4, borderRadius: 0 }}
                            />
                            <CCardBody className="p-0">
                                <div
                                    style={{
                                        maxHeight: 400,
                                        overflowY: "auto",
                                    }}
                                >
                                    <CTable responsive hover className="mb-0">
                                        <CTableHead className="bg-body-tertiary">
                                            <CTableRow>
                                                <CTableHeaderCell>
                                                    Bulan
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Jatuh Tempo
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Nominal
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Status
                                                </CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {transaction.installments?.map(
                                                (inst) => (
                                                    <CTableRow
                                                        key={inst.id}
                                                        className="align-middle"
                                                    >
                                                        <CTableDataCell className="fw-medium small">
                                                            {inst.installment_number ===
                                                            0
                                                                ? "DP"
                                                                : `#${inst.installment_number}`}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-body-secondary small">
                                                            {new Date(
                                                                inst.due_date,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                            )}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="fw-bold small">
                                                            {formatRupiah(
                                                                inst.amount,
                                                            )}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CBadge
                                                                color={getStatusColor(
                                                                    inst.status,
                                                                )}
                                                                shape="rounded-pill"
                                                            >
                                                                {formatStatus(
                                                                    inst.status,
                                                                )}
                                                            </CBadge>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ),
                                            )}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </CCardBody>
                        </CCard>
                    )}
                </CCol>

                {/* SIDEBAR */}
                <CCol xl={4}>
                    {/* Quick Info */}
                    <CCard className="mb-4 bg-body-tertiary border-0">
                        <CCardBody>
                            <h6 className="fw-bold mb-3">Informasi Singkat</h6>
                            <div className="vstack gap-3">
                                <div>
                                    <div className="text-body-secondary small">
                                        Pelanggan
                                    </div>
                                    <div className="fw-bold">{user?.name}</div>
                                </div>
                                <div>
                                    <div className="text-body-secondary small">
                                        Email
                                    </div>
                                    <div className="fw-bold small">
                                        {user?.email}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-body-secondary small">
                                        ID Transaksi
                                    </div>
                                    <div className="fw-bold">
                                        #{transaction.id}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-body-secondary small">
                                        Tanggal Pesan
                                    </div>
                                    <div className="fw-bold small">
                                        {new Date(
                                            transaction.created_at,
                                        ).toLocaleDateString("id-ID")}
                                    </div>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>

                    {/* Status Card */}
                    <CCard className="mb-4 border-0 bg-light">
                        <CCardBody>
                            <h6 className="fw-bold mb-3">Status Transaksi</h6>
                            <div className="d-grid">
                                <CBadge
                                    color={getStatusColor(transaction.status)}
                                    className="mb-3 py-2"
                                    shape="rounded-pill"
                                >
                                    {formatStatus(transaction.status)}
                                </CBadge>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Survey Modal */}
            {transaction.transaction_type === "CREDIT" && credit_detail && (
                <SurveyScheduleModal
                    visible={showSurveyModal}
                    onClose={() => setShowSurveyModal(false)}
                    creditDetailId={credit_detail.id}
                    surveySchedule={credit_detail.survey_schedule}
                    isReschedule={!!credit_detail.survey_schedule}
                />
            )}
        </AdminLayout>
    );
}
