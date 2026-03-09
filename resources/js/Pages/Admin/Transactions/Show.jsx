import React, { useState, useEffect } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import Modal from "@/Components/Modal";
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
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CProgress,
    CAvatar,
    CCallout,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilTrash,
    cilPencil,
    cilCloudUpload,
    cilFile,
    cilCheckCircle,
    cilXCircle,
    cilUser,
    cilBike,
    cilCreditCard,
} from "@coreui/icons";
import { toast } from "react-hot-toast";

export default function Show({ transaction: initialTransaction }) {
    const [transaction, setTransaction] = useState(initialTransaction);

    useEffect(() => {
        setTransaction(initialTransaction);
    }, [initialTransaction]);

    const { credit_detail, motor, user } = transaction;
    const documents = credit_detail?.documents || [];

    const paidInstallments =
        transaction.installments?.filter((i) => i.status === "paid").length ||
        0;
    const totalInstallments = credit_detail?.tenor || 0;
    const progressPercentage =
        totalInstallments > 0
            ? Math.round((paidInstallments / totalInstallments) * 100)
            : 0;

    const remainingAmount =
        transaction.installments
            ?.filter((i) => i.status !== "paid")
            .reduce((sum, i) => sum + Number(i.amount), 0) || 0;

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "info",
        title: "",
        message: "",
        onConfirm: () => {},
        confirmText: "Konfirmasi",
    });
    const [processingAction, setProcessingAction] = useState(false);

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

    const formatRupiah = (n) =>
        `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    const handleStatusUpdate = (e) => {
        const newStatus = e.target.value;
        setModalConfig({
            isOpen: true,
            title: "Ubah Status",
            message: `Ubah status transaksi menjadi "${formatStatus(newStatus)}"?`,
            type: "info",
            confirmText: "Ubah",
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
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
            toast.success("Status berhasil diperbarui secara instan");
        } catch (error) {
            toast.error("Gagal memperbarui status");
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
                setModalConfig((prev) => ({ ...prev, isOpen: false }));
                toast.success("Transaksi berhasil dihapus");
            },
            onError: () => {
                setProcessingAction(false);
                toast.error("Gagal menghapus transaksi");
            },
        });
    };

    const approvePayment = (installmentId) => {
        Swal.fire({
            title: "Verifikasi Pembayaran?",
            text: "Tandai pembayaran ini sebagai terverifikasi?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Verifikasi",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    route("admin.installments.approve", installmentId),
                    {},
                    {
                        onSuccess: () => {
                            toast.success("Pembayaran terverifikasi");
                        },
                        onError: () => toast.error("Gagal memproses"),
                    },
                );
            }
        });
    };

    const rejectPayment = (installmentId) => {
        Swal.fire({
            title: "Tolak Pembayaran?",
            text: "Pembayaran tidak akan diterima. Tindakan ini tidak bisa dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Tolak",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    route("admin.installments.reject", installmentId),
                    {},
                    {
                        onSuccess: () => toast.success("Pembayaran ditolak"),
                        onError: () => toast.error("Gagal memproses"),
                    },
                );
            }
        });
    };

    const {
        data: docData,
        setData: setDocData,
        post: postDoc,
        processing: docProcessing,
        reset: resetDoc,
    } = useForm({ document_type: "", document_file: null });

    const handleUpload = (e) => {
        e.preventDefault();
        postDoc(route("admin.transactions.upload-document", transaction.id), {
            onSuccess: () => {
                resetDoc();
                toast.success("Dokumen berhasil diupload");
            },
            onError: () => toast.error("Upload gagal"),
        });
    };

    const confirmDeleteDocument = (docId) => {
        Swal.fire({
            title: "Hapus Dokumen?",
            text: "Dokumen akan dihapus dari sistem. Tindakan ini tidak bisa dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    route("admin.transactions.delete_document", docId),
                    {
                        onSuccess: () => {
                            toast.success("Dokumen berhasil dihapus");
                        },
                        onError: () => toast.error("Gagal menghapus dokumen"),
                    },
                );
            }
        });
    };

    const unifiedStatusOptions = [
        { value: "new_order", label: "Pesanan Baru (Draft)" },
        { value: "menunggu_persetujuan", label: "Verifikasi Berkas" },
        { value: "dikirim_ke_surveyor", label: "Kirim ke Surveyor" },
        { value: "jadwal_survey", label: "Jadwal Survey" },
        { value: "disetujui", label: "Kredit Disetujui / DP" },
        { value: "payment_confirmed", label: "Pembayaran Dikonfirmasi" },
        { value: "unit_preparation", label: "Persiapan Unit" },
        { value: "ready_for_delivery", label: "Siap Dikirim" },
        { value: "completed", label: "Selesai" },
        { value: "cancelled", label: "Batalkan Pesanan" },
        { value: "data_tidak_valid", label: "Dokumen Tidak Valid" },
        { value: "ditolak", label: "Kredit Ditolak" },
    ];

    return (
        <AdminLayout title={`Detail Transaksi #${transaction.id}`}>
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
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.transactions.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <Link
                        href={route("admin.transactions.edit", transaction.id)}
                        className="btn btn-sm btn-outline-warning d-flex align-items-center gap-2"
                    >
                        <CIcon icon={cilPencil} size="sm" />
                        Edit Transaksi
                    </Link>
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
                </div>
            </div>

            <CRow>
                {/* Main Content */}
                <CCol xl={8}>
                    {/* Motor Info */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>Data Unit</strong>
                                <CBadge
                                    color="primary-subtle"
                                    textColor="primary"
                                >
                                    {motor?.brand}
                                </CBadge>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <div className="d-flex flex-column flex-md-row gap-4">
                                <div
                                    className="bg-body-tertiary rounded-3 overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: 200, aspectRatio: "16/10" }}
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
                                    <h4 className="fw-bold mb-1">
                                        {motor?.name}
                                    </h4>
                                    <p className="text-body-secondary small mb-3">
                                        {motor?.type} • {motor?.year}
                                    </p>
                                    <CRow className="g-3">
                                        <CCol xs={6}>
                                            <div className="bg-body-tertiary rounded-3 p-3">
                                                <div className="text-body-tertiary small">
                                                    Harga OTR
                                                </div>
                                                <div className="fw-bold">
                                                    {formatRupiah(motor?.price)}
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol xs={6}>
                                            <div className="bg-body-tertiary rounded-3 p-3">
                                                <div className="text-body-tertiary small">
                                                    Tipe Transaksi
                                                </div>
                                                <div className="fw-bold">
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
                                        </CCol>
                                    </CRow>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>

                    {/* Installment History (Credit only) */}
                    {transaction.transaction_type === "CREDIT" && (
                        <CCard className="mb-4">
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
                                        maxHeight: 500,
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
                                                    Metode
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Bukti
                                                </CTableHeaderCell>
                                                <CTableHeaderCell>
                                                    Status
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-end">
                                                    Aksi
                                                </CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {transaction.installments.map(
                                                (inst) => (
                                                    <CTableRow
                                                        key={inst.id}
                                                        className="align-middle"
                                                    >
                                                        <CTableDataCell className="fw-medium">
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
                                                        <CTableDataCell className="fw-bold">
                                                            {formatRupiah(
                                                                inst.amount,
                                                            )}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-body-secondary small">
                                                            {inst.payment_method
                                                                ? formatPaymentMethod(
                                                                      inst.payment_method,
                                                                  )
                                                                : "-"}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {inst.payment_proof ? (
                                                                <a
                                                                    href={`/storage/${inst.payment_proof}`}
                                                                    target="_blank"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                >
                                                                    Lihat
                                                                </a>
                                                            ) : (
                                                                <span className="text-body-tertiary">
                                                                    -
                                                                </span>
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
                                                        <CTableDataCell className="text-end">
                                                            {inst.status ===
                                                                "waiting_approval" && (
                                                                <div className="d-flex gap-1 justify-content-end">
                                                                    <CButton
                                                                        color="success"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            approvePayment(
                                                                                inst.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <CIcon
                                                                            icon={
                                                                                cilCheckCircle
                                                                            }
                                                                            size="sm"
                                                                        />
                                                                    </CButton>
                                                                    <CButton
                                                                        color="danger"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            rejectPayment(
                                                                                inst.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <CIcon
                                                                            icon={
                                                                                cilXCircle
                                                                            }
                                                                            size="sm"
                                                                        />
                                                                    </CButton>
                                                                </div>
                                                            )}
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

                    {/* Document Vault */}
                    <CCard className="mb-4">
                        <CCardHeader className="bg-transparent border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>Dokumen</strong>
                                <span className="text-body-secondary small">
                                    {documents.length} arsip
                                </span>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <form
                                onSubmit={handleUpload}
                                className="bg-body-tertiary rounded-3 p-3 mb-4"
                            >
                                <CRow className="g-3 align-items-end">
                                    <CCol md={4}>
                                        <CFormLabel className="small">
                                            Tipe Dokumen
                                        </CFormLabel>
                                        <CFormSelect
                                            value={docData.document_type}
                                            onChange={(e) =>
                                                setDocData(
                                                    "document_type",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            size="sm"
                                        >
                                            <option value="">Pilih...</option>
                                            <option value="KTP">KTP</option>
                                            <option value="KK">
                                                Kartu Keluarga
                                            </option>
                                            <option value="SLIP_GAJI">
                                                Slip Gaji
                                            </option>
                                            <option value="BPKB">BPKB</option>
                                            <option value="STNK">STNK</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={5}>
                                        <CFormLabel className="small">
                                            File
                                        </CFormLabel>
                                        <CFormInput
                                            type="file"
                                            onChange={(e) =>
                                                setDocData(
                                                    "document_file",
                                                    e.target.files[0],
                                                )
                                            }
                                            required
                                            size="sm"
                                        />
                                    </CCol>
                                    <CCol md={3}>
                                        <CButton
                                            type="submit"
                                            color="primary"
                                            size="sm"
                                            className="w-100"
                                            disabled={docProcessing}
                                        >
                                            <CIcon
                                                icon={cilCloudUpload}
                                                size="sm"
                                                className="me-1"
                                            />
                                            {docProcessing
                                                ? "Uploading..."
                                                : "Upload"}
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </form>

                            {documents.length > 0 ? (
                                <CRow className="g-3">
                                    {documents.map((doc) => (
                                        <CCol sm={6} xl={4} key={doc.id}>
                                            <div className="border rounded-3 p-3 h-100">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <CIcon
                                                        icon={cilFile}
                                                        className="text-primary"
                                                    />
                                                    <div className="text-truncate">
                                                        <div className="fw-semibold small">
                                                            {doc.document_type}
                                                        </div>
                                                        <div
                                                            className="text-body-tertiary"
                                                            style={{
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            {new Date(
                                                                doc.created_at,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <a
                                                        href={`/storage/${doc.file_path}`}
                                                        target="_blank"
                                                        className="btn btn-sm btn-outline-primary flex-fill"
                                                    >
                                                        Lihat
                                                    </a>
                                                    <CButton
                                                        color="danger"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            confirmDeleteDocument(
                                                                doc.id,
                                                            )
                                                        }
                                                    >
                                                        <CIcon
                                                            icon={cilTrash}
                                                            size="sm"
                                                        />
                                                    </CButton>
                                                </div>
                                            </div>
                                        </CCol>
                                    ))}
                                </CRow>
                            ) : (
                                <div className="text-center py-4 text-body-tertiary">
                                    Belum ada dokumen.
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Sidebar */}
                <CCol xl={4}>
                    <div className="sticky-top" style={{ top: "5rem" }}>
                        {/* Customer Info */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Data Pelanggan</strong>
                            </CCardHeader>
                            <CCardBody className="text-center">
                                <CAvatar
                                    color="primary"
                                    textColor="white"
                                    size="lg"
                                    className="mb-3"
                                >
                                    {(user?.name || "U")[0]}
                                </CAvatar>
                                <h5 className="fw-bold mb-0">
                                    {user?.name || "Unknown"}
                                </h5>
                                <p className="text-body-secondary small mb-3">
                                    {user?.email}
                                </p>
                                <div className="border-top pt-3 text-start">
                                    <div className="mb-3">
                                        <div className="text-body-tertiary small">
                                            Kontak
                                        </div>
                                        <div className="fw-medium">
                                            {transaction.customer_phone ||
                                                user?.phone_number ||
                                                "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-body-tertiary small">
                                            Alamat
                                        </div>
                                        <div className="fw-medium">
                                            {transaction.customer_address ||
                                                user?.address ||
                                                "-"}
                                        </div>
                                    </div>
                                    <div className="bg-body-tertiary rounded-3 p-3 mt-3">
                                        <div className="text-body-tertiary small mb-1">
                                            Catatan Pembeli
                                        </div>
                                        <div className="fw-medium italic text-body-secondary">
                                            "
                                            {transaction.notes ||
                                                "Tidak ada catatan"}
                                            "
                                        </div>
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        {/* Status Control */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Kontrol Status</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CFormLabel className="small">
                                    Ubah Status
                                </CFormLabel>
                                <CFormSelect
                                    value={transaction.status}
                                    onChange={handleStatusUpdate}
                                    className="mb-3"
                                >
                                    {unifiedStatusOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </CFormSelect>

                                <div className="small text-body-tertiary">
                                    <CIcon
                                        icon={cilCheckCircle}
                                        size="sm"
                                        className="me-1 text-success"
                                    />
                                    Status saat ini:{" "}
                                    <strong>
                                        {formatStatus(transaction.status)}
                                    </strong>
                                </div>

                                {transaction.transaction_type === "CREDIT" && (
                                    <div className="mt-3 bg-primary-subtle rounded-3 p-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-body-secondary small">
                                                Tenor
                                            </span>
                                            <span className="fw-bold">
                                                {credit_detail?.tenor || 0}{" "}
                                                bulan
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-body-secondary small">
                                                Sisa
                                            </span>
                                            <span className="fw-bold text-danger">
                                                {formatRupiah(remainingAmount)}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-body-secondary small">
                                                Progres
                                            </span>
                                            <span className="fw-bold text-success">
                                                {progressPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>

                        <CCallout color="info" className="small">
                            Jika terjadi masalah data, hubungi departemen IT
                            untuk verifikasi manual.
                        </CCallout>
                    </div>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
