import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilBike,
    cilPeople,
    cilCart,
    cilEnvelopeClosed,
    cilArrowRight,
    cilChartLine,
    cilArrowTop,
} from "@coreui/icons";
import {
    RevenueChart,
    StatusPieChart,
} from "@/Components/Admin/DashboardCharts";

export default function Dashboard({
    motorsCount,
    usersCount,
    transactionsCount,
    cashTransactionsCount,
    creditTransactionsCount,
    recentTransactions,
    recentMotors,
    monthlyStats,
    statusStats,
}) {
    const stats = [
        {
            title: "Total Motor",
            value: motorsCount,
            icon: cilBike,
            colorClass: "stat-card-primary",
            iconBg: "rgba(67,97,238,.1)",
            iconColor: "#4361ee",
        },
        {
            title: "Total Pengguna",
            value: usersCount,
            icon: cilPeople,
            colorClass: "stat-card-info",
            iconBg: "rgba(6,182,212,.1)",
            iconColor: "#06b6d4",
        },
        {
            title: "Transaksi",
            value: transactionsCount,
            icon: cilCart,
            colorClass: "stat-card-success",
            iconBg: "rgba(16,185,129,.1)",
            iconColor: "#10b981",
            subtext: `${cashTransactionsCount} Tunai • ${creditTransactionsCount} Kredit`,
        },

    ];

    const getStatusBadge = (status) => {
        const map = {
            completed: { color: "success", label: "Selesai" },
            approved: { color: "success", label: "Disetujui" },
            disetujui: { color: "success", label: "Disetujui" },
            lunas: { color: "success", label: "Lunas" },
            pending: { color: "warning", label: "Pending" },
            menunggu_persetujuan: { color: "warning", label: "Menunggu" },
            new_order: { color: "info", label: "Order Baru" },
            payment_confirmed: {
                color: "info",
                label: "Pembayaran Dikonfirmasi",
            },
            rejected: { color: "danger", label: "Ditolak" },
            ditolak: { color: "danger", label: "Ditolak" },
            cancelled: { color: "danger", label: "Dibatalkan" },
        };
        const badge = map[status] || {
            color: "secondary",
            label:
                status
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A",
        };
        return (
            <CBadge color={badge.color} shape="rounded-pill">
                {badge.label}
            </CBadge>
        );
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat("id-ID").format(val || 0);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Welcome Banner */}
            <CCard className="mb-4 admin-welcome-banner text-white">
                <CCardBody
                    className="py-4 position-relative"
                    style={{ zIndex: 1 }}
                >
                    <CRow className="align-items-center">
                        <CCol md={8}>
                            <h4
                                className="mb-2 fw-bold welcome-title"
                                style={{ fontSize: 22 }}
                            >
                                👋 Selamat Datang Kembali!
                            </h4>
                            <p
                                className="mb-0"
                                style={{ opacity: 0.85, fontSize: 14 }}
                            >
                                Pantau dan kelola seluruh operasional SRB Motors
                                dari sini.
                            </p>
                        </CCol>
                        <CCol md={4} className="text-md-end d-none d-md-block">
                            <div
                                style={{
                                    opacity: 0.7,
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                            >
                                {new Date().toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* KPI Stat Cards */}
            <CRow className="mb-4 g-3">
                {stats.map((stat, index) => (
                    <CCol sm={6} xl={3} key={index}>
                        <CCard className={`stat-card ${stat.colorClass} h-100`}>
                            <CCardBody className="d-flex align-items-center gap-3 p-3">
                                <div
                                    className="stat-icon flex-shrink-0"
                                    style={{ backgroundColor: stat.iconBg }}
                                >
                                    <CIcon
                                        icon={stat.icon}
                                        size="xl"
                                        style={{ color: stat.iconColor }}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="stat-label">
                                        {stat.title}
                                    </div>
                                    <div className="stat-value">
                                        {stat.value}
                                    </div>
                                    {stat.subtext && (
                                        <div
                                            className="text-body-tertiary mt-1"
                                            style={{ fontSize: 12 }}
                                        >
                                            {stat.subtext}
                                        </div>
                                    )}
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            {/* Charts Section */}
            <CRow className="mb-4 g-3">
                <CCol lg={8}>
                    <CCard className="h-100">
                        <CCardHeader className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-2"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        backgroundColor: "rgba(67,97,238,.1)",
                                    }}
                                >
                                    <CIcon
                                        icon={cilChartLine}
                                        style={{ color: "#4361ee" }}
                                    />
                                </div>
                                <strong style={{ color: "#0f172a" }}>
                                    Analisis Pendapatan
                                </strong>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <RevenueChart data={monthlyStats} />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol lg={4}>
                    <CCard className="h-100">
                        <CCardHeader>
                            <strong style={{ color: "#0f172a" }}>
                                Distribusi Status
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <StatusPieChart data={statusStats} />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Recent Data Grid */}
            <CRow className="g-3">
                {/* Recent Transactions */}
                <CCol lg={8}>
                    <CCard>
                        <CCardHeader className="d-flex justify-content-between align-items-center">
                            <strong style={{ color: "#0f172a" }}>
                                Transaksi Terbaru
                            </strong>
                            <Link
                                href={route("admin.transactions.index")}
                                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            >
                                Lihat Semua
                                <CIcon icon={cilArrowRight} size="sm" />
                            </Link>
                        </CCardHeader>
                        <CCardBody className="p-0">
                            <CTable hover responsive className="mb-0">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>
                                            Customer
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Unit
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Metode
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Status
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Tanggal
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {recentTransactions &&
                                    recentTransactions.length > 0 ? (
                                        recentTransactions.map((trx) => (
                                            <CTableRow key={trx.id}>
                                                <CTableDataCell>
                                                    <div className="fw-semibold">
                                                        {trx.customer_name}
                                                    </div>
                                                    <div
                                                        className="text-body-tertiary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {trx.customer_phone}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-body-secondary">
                                                    {trx.motor?.name ||
                                                        "Deleted"}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge
                                                        color={
                                                            trx.transaction_type ===
                                                            "CASH"
                                                                ? "primary"
                                                                : "info"
                                                        }
                                                        shape="rounded-pill"
                                                    >
                                                        {trx.transaction_type}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {getStatusBadge(trx.status)}
                                                </CTableDataCell>
                                                <CTableDataCell
                                                    className="text-body-tertiary"
                                                    style={{ fontSize: 13 }}
                                                >
                                                    {new Date(
                                                        trx.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell
                                                colSpan={5}
                                                className="text-center py-5 text-body-tertiary"
                                            >
                                                <div style={{ fontSize: 14 }}>
                                                    Belum ada transaksi.
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Recent Motors */}
                <CCol lg={4}>
                    <CCard>
                        <CCardHeader className="d-flex justify-content-between align-items-center">
                            <strong style={{ color: "#0f172a" }}>
                                Motor Terbaru
                            </strong>
                            <Link
                                href={route("admin.motors.index")}
                                className="btn btn-sm btn-outline-primary"
                            >
                                Lihat Semua
                            </Link>
                        </CCardHeader>
                        <CCardBody className="p-0">
                            {recentMotors && recentMotors.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {recentMotors.map((motor) => (
                                        <Link
                                            key={motor.id}
                                            href={route(
                                                "admin.motors.show",
                                                motor.id,
                                            )}
                                            className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-3"
                                            style={{
                                                borderBottom:
                                                    "1px solid #f1f5f9",
                                                transition: "background .15s",
                                            }}
                                        >
                                            <div
                                                className="rounded-3 overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    backgroundColor: "#f1f5f9",
                                                }}
                                            >
                                                {motor.image_path ? (
                                                    <img
                                                        src={`/storage/${motor.image_path}`}
                                                        className="w-100 h-100 object-fit-cover"
                                                        alt={motor.name}
                                                    />
                                                ) : (
                                                    <CIcon
                                                        icon={cilBike}
                                                        className="text-body-tertiary"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <div
                                                    className="fw-semibold text-truncate"
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#0f172a",
                                                    }}
                                                >
                                                    {motor.name}
                                                </div>
                                                <div
                                                    className="text-body-tertiary"
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {motor.brand?.name ||
                                                        "No Brand"}{" "}
                                                    • {motor.year}
                                                </div>
                                            </div>
                                            <div
                                                className="fw-bold text-nowrap"
                                                style={{
                                                    fontSize: 13,
                                                    color: "#4361ee",
                                                }}
                                            >
                                                Rp {formatCurrency(motor.price)}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 text-body-tertiary">
                                    Belum ada unit.
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </AdminLayout>
    );
}
