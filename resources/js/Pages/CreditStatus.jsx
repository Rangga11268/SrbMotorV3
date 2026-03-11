import React from "react";
import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CBadge,
    CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilCheckAlt,
    cilCalendar,
    cilNotes,
    cilBike,
} from "@coreui/icons";

export default function CreditStatus({ credit, transaction }) {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    const statuses = {
        pengajuan_masuk: {
            label: "Pengajuan Diterima",
            color: "info",
            description: "Pengajuan kredit Anda telah diterima oleh tim kami",
        },
        verifikasi_dokumen: {
            label: "Verifikasi Dokumen",
            color: "warning",
            description: "Tim kami sedang memverifikasi dokumen Anda",
        },
        dikirim_ke_leasing: {
            label: "Dikirim ke Leasing",
            color: "info",
            description: "Pengajuan telah dikirimkan ke pihak leasing",
        },
        survey_dijadwalkan: {
            label: "Survey Dijadwalkan",
            color: "warning",
            description: "Survey kendaraan telah dijadwalkan",
        },
        survey_berjalan: {
            label: "Survey Berjalan",
            color: "warning",
            description: "Surveyor sedang melakukan survey kendaraan",
        },
        menunggu_keputusan_leasing: {
            label: "Menunggu Keputusan",
            color: "info",
            description: "Menunggu keputusan akhir dari pihak leasing",
        },
        disetujui: {
            label: "Disetujui",
            color: "success",
            description: "Pengajuan kredit Anda telah disetujui!",
        },
        ditolak: {
            label: "Ditolak",
            color: "danger",
            description: "Pengajuan kredit Anda telah ditolak",
        },
        dp_dibayar: {
            label: "DP Dibayar",
            color: "success",
            description: "Uang muka telah dibayarkan",
        },
        selesai: {
            label: "Selesai",
            color: "success",
            description: "Proses kredit telah selesai",
        },
    };

    const currentStatus = statuses[credit.credit_status] || {};

    const timelineSteps = [
        {
            name: "Pengajuan Masuk",
            status: "pengajuan_masuk",
            completed:
                credit.credit_status !== "pengajuan_masuk" || credit.created_at,
        },
        {
            name: "Verifikasi Dokumen",
            status: "verifikasi_dokumen",
            completed: [
                "dikirim_ke_leasing",
                "survey_dijadwalkan",
                "survey_berjalan",
                "menunggu_keputusan_leasing",
                "disetujui",
                "ditolak",
                "dp_dibayar",
                "selesai",
            ].includes(credit.credit_status),
        },
        {
            name: "Dikirim ke Leasing",
            status: "dikirim_ke_leasing",
            completed: [
                "survey_dijadwalkan",
                "survey_berjalan",
                "menunggu_keputusan_leasing",
                "disetujui",
                "ditolak",
                "dp_dibayar",
                "selesai",
            ].includes(credit.credit_status),
        },
        {
            name: "Survey Dijadwalkan",
            status: "survey_dijadwalkan",
            completed: [
                "survey_berjalan",
                "menunggu_keputusan_leasing",
                "disetujui",
                "ditolak",
                "dp_dibayar",
                "selesai",
            ].includes(credit.credit_status),
        },
        {
            name: "Keputusan Leasing",
            status: "menunggu_keputusan_leasing",
            completed: [
                "disetujui",
                "ditolak",
                "dp_dibayar",
                "selesai",
            ].includes(credit.credit_status),
        },
        {
            name: "Persetujuan Final",
            status: "disetujui",
            completed: ["dp_dibayar", "selesai"].includes(credit.credit_status),
        },
    ];

    return (
        <PublicLayout title={`Status Kredit - ${transaction.customer_name}`}>
            {/* Header */}
            <div className="mb-4">
                <Link
                    href={route("motors.user-transactions")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2 mb-3"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali ke Daftar Transaksi
                </Link>
                <h2 className="mb-2">Status Pengajuan Kredit</h2>
                <p className="text-body-secondary">
                    Transaksi #{transaction.id} - {transaction.customer_name}
                </p>
            </div>

            {/* Status Card */}
            <CCard
                className="mb-4 border-3"
                style={{ borderTopColor: `var(--cui-${currentStatus.color})` }}
            >
                <CCardHeader className="bg-transparent border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                        <strong>Status Saat Ini</strong>
                        <CBadge color={currentStatus.color} className="fs-6">
                            {currentStatus.label}
                        </CBadge>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <p className="mb-0 text-body-secondary">
                        {currentStatus.description}
                    </p>
                </CCardBody>
            </CCard>

            {/* Motor & Credit Info */}
            <CRow className="mb-4">
                <CCol lg={6}>
                    <CCard>
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong className="d-flex align-items-center gap-2">
                                <CIcon icon={cilBike} size="sm" />
                                Data Motor
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <p className="mb-2">
                                <small className="text-body-secondary d-block">
                                    Unit Motor
                                </small>
                                <strong>{transaction.motor?.name}</strong>
                            </p>
                            <p className="mb-2">
                                <small className="text-body-secondary d-block">
                                    Harga
                                </small>
                                <strong>
                                    {formatCurrency(transaction.motor?.price)}
                                </strong>
                            </p>
                            <p className="mb-0">
                                <small className="text-body-secondary d-block">
                                    Jumlah Kredit
                                </small>
                                <strong>
                                    {formatCurrency(transaction.credit_amount)}
                                </strong>
                            </p>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol lg={6}>
                    <CCard>
                        <CCardHeader className="bg-transparent border-bottom">
                            <strong>Detail Kredit</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p className="mb-2">
                                <small className="text-body-secondary d-block">
                                    Uang Muka
                                </small>
                                <strong>
                                    {formatCurrency(credit.down_payment)}
                                </strong>
                            </p>
                            <p className="mb-2">
                                <small className="text-body-secondary d-block">
                                    Tenor Kredit
                                </small>
                                <strong>{credit.tenor} Bulan</strong>
                            </p>
                            <p className="mb-0">
                                <small className="text-body-secondary d-block">
                                    Cicilan Bulanan
                                </small>
                                <strong>
                                    {formatCurrency(credit.monthly_installment)}
                                </strong>
                            </p>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Timeline */}
            <CCard className="mb-4">
                <CCardHeader className="bg-transparent border-bottom">
                    <strong>Progres Pengajuan</strong>
                </CCardHeader>
                <CCardBody>
                    <div className="progress-steps">
                        {timelineSteps.map((step, index) => (
                            <div key={index} className="mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                                            step.completed
                                                ? "bg-success text-white"
                                                : step.status ===
                                                    credit.credit_status
                                                  ? "bg-primary text-white"
                                                  : "bg-light border"
                                        }`}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    >
                                        {step.completed ? (
                                            <CIcon
                                                icon={cilCheckAlt}
                                                size="lg"
                                            />
                                        ) : step.status ===
                                          credit.credit_status ? (
                                            <span className="spinner-border spinner-border-sm" />
                                        ) : (
                                            <span className="fw-bold">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{step.name}</h6>
                                        <p className="small text-body-secondary mb-0">
                                            {step.completed
                                                ? "Selesai"
                                                : step.status ===
                                                    credit.credit_status
                                                  ? "Sedang diproses..."
                                                  : "Belum dimulai"}
                                        </p>
                                    </div>
                                </div>
                                {index < timelineSteps.length - 1 && (
                                    <div className="ms-4 mt-2 mb-2">
                                        <div
                                            className={`${
                                                step.completed
                                                    ? "bg-success"
                                                    : "bg-light"
                                            }`}
                                            style={{
                                                height: "30px",
                                                width: "2px",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CCardBody>
            </CCard>

            {/* Survey Schedule (if scheduled) */}
            {credit.survey_scheduled_date && (
                <CCard className="mb-4 border-warning">
                    <CCardHeader className="bg-transparent border-bottom">
                        <strong className="d-flex align-items-center gap-2">
                            <CIcon icon={cilCalendar} size="sm" />
                            Jadwal Survey
                        </strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol md={6}>
                                <p className="mb-0">
                                    <small className="text-body-secondary d-block mb-1">
                                        Tanggal & Jam
                                    </small>
                                    <strong className="fs-5 text-warning">
                                        {new Date(
                                            credit.survey_scheduled_date,
                                        ).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                        <br />
                                        Pukul {credit.survey_scheduled_time}
                                    </strong>
                                </p>
                            </CCol>
                            <CCol md={6}>
                                <p className="mb-0">
                                    <small className="text-body-secondary d-block mb-1">
                                        Surveyor
                                    </small>
                                    <strong>
                                        {credit.surveyor_name}
                                        <br />
                                        <span className="text-body-secondary">
                                            {credit.surveyor_phone}
                                        </span>
                                    </strong>
                                </p>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            )}

            {/* Survey Results (if available) */}
            {credit.survey_notes && (
                <CCard className="mb-4">
                    <CCardHeader className="bg-transparent border-bottom">
                        <strong className="d-flex align-items-center gap-2">
                            <CIcon icon={cilNotes} size="sm" />
                            Hasil Survey
                        </strong>
                    </CCardHeader>
                    <CCardBody>
                        <div className="bg-light p-3 rounded">
                            {credit.survey_notes}
                        </div>
                    </CCardBody>
                </CCard>
            )}

            {/* Rejection Reason (if rejected) */}
            {credit.rejection_reason && (
                <CAlert color="danger">
                    <strong>Alasan Penolakan:</strong>
                    <br />
                    {credit.rejection_reason}
                </CAlert>
            )}

            {/* Next Steps */}
            <CCard>
                <CCardHeader className="bg-transparent border-bottom">
                    <strong>Langkah Selanjutnya</strong>
                </CCardHeader>
                <CCardBody>
                    {credit.credit_status === "pengajuan_masuk" && (
                        <p className="mb-0">
                            Mohon tunggu tim kami memverifikasi dokumen yang
                            telah Anda upload. Kami akan menghubungi Anda
                            melalui WhatsApp jika ada kekurangan dokumen.
                        </p>
                    )}
                    {credit.credit_status === "verifikasi_dokumen" && (
                        <p className="mb-0">
                            Dokumen Anda sedang diverifikasi. Proses ini
                            menunggu persetujuan lengkap dari tim kami sebelum
                            dikirim ke pihak leasing.
                        </p>
                    )}
                    {credit.credit_status === "dikirim_ke_leasing" && (
                        <p className="mb-0">
                            Pengajuan telah dikirimkan ke leasing. Selanjutnya
                            akan ada proses survey kendaraan. Kami akan
                            menghubungi untuk menjadwalkan waktu survey.
                        </p>
                    )}
                    {credit.credit_status === "survey_dijadwalkan" && (
                        <div>
                            <CAlert color="warning" className="mb-3">
                                Ada jadwal survey dalam waktu dekat! Pastikan
                                Anda atau pihak berwenang siap pada tanggal dan
                                jam yang telah dijadwalkan.
                            </CAlert>
                            <p className="mb-0">
                                Surveyor akan memeriksakan kondisi kendaraan.
                                Harap siapkan dokumen kendaraan dan KTP.
                            </p>
                        </div>
                    )}
                    {credit.credit_status === "survey_berjalan" && (
                        <p className="mb-0">
                            Survey sedang dilakukan. Setelah selesai, hasil akan
                            dilaporkan ke pihak leasing untuk membuat keputusan.
                        </p>
                    )}
                    {credit.credit_status === "menunggu_keputusan_leasing" && (
                        <p className="mb-0">
                            Menunggu keputusan final dari pihak leasing atas
                            kelayakan pengajuan kredit Anda. Ini biasanya
                            memakan waktu 3-5 hari kerja.
                        </p>
                    )}
                    {credit.credit_status === "disetujui" && (
                        <CAlert color="success" className="mb-3">
                            🎉 Selamat! Pengajuan kredit Anda telah disetujui!
                        </CAlert>
                    )}
                    {credit.credit_status === "ditolak" && (
                        <p className="mb-0 text-danger">
                            Mohon maaf, pengajuan kredit Anda tidak dapat
                            disetujui. Silakan hubungi tim kami untuk diskusi
                            tentang alternatif.
                        </p>
                    )}
                    {credit.credit_status === "dp_dibayar" && (
                        <p className="mb-0">
                            Terima kasih! Uang muka telah dikonfirmasi. Proses
                            penyelesaian unit akan segera dimulai.
                        </p>
                    )}
                    {credit.credit_status === "selesai" && (
                        <CAlert color="success" className="mb-0">
                            ✓ Proses kredit telah selesai! Unit motor Anda
                            sedang dalam proses persiapan untuk dikirim.
                        </CAlert>
                    )}
                </CCardBody>
            </CCard>
        </PublicLayout>
    );
}
