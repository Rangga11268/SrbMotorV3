import React from "react";
import { Link, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CBadge,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CAvatar,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilPrint,
    cilCloudDownload,
    cilChart,
    cilDollar,
    cilPeople,
    cilSpeedometer,
} from "@coreui/icons";
import {
    RevenueChart,
    StatusPieChart,
} from "@/Components/Admin/DashboardCharts";

export default function Show({
    type,
    title,
    description,
    startDate,
    endDate,
    rawStartDate,
    rawEndDate,
    data,
}) {
    const formatRupiah = (n) =>
        `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    const getSummaryStats = () => {
        if (!data) return [];
        switch (type) {
            case "sales":
                return [
                    {
                        label: "Total Transaksi",
                        value: data.total_transactions,
                        color: "success",
                    },
                    {
                        label: "Total Revenue",
                        value: formatRupiah(data.total_revenue),
                        color: "primary",
                    },
                ];
            case "income":
                return [
                    {
                        label: "Pendapatan Kotor",
                        value: formatRupiah(data.total_income),
                        color: "success",
                    },
                    {
                        label: "Kas Tunai",
                        value: formatRupiah(data.cash_income),
                        color: "primary",
                    },
                    {
                        label: "Pemasukan Kredit",
                        value: formatRupiah(data.credit_income),
                        color: "warning",
                    },
                ];
            case "customer":
                return [
                    {
                        label: "Total Klien",
                        value: data.total_customers,
                        color: "info",
                    },
                    {
                        label: "Klien Baru",
                        value: data.new_customers,
                        color: "success",
                    },
                ];
            case "status":
                return [
                    {
                        label: "Total Order",
                        value: data.total_transactions,
                        color: "secondary",
                    },
                ];
            default:
                return [];
        }
    };

    const getChartData = () => {
        if (!data) return [];
        switch (type) {
            case "sales":
            case "income":
                if (!data.items) return [];
                const grouped = data.items.reduce((acc, item) => {
                    const dateKey = item.created_at?.substring(0, 10) || "N/A";
                    if (!acc[dateKey]) acc[dateKey] = 0;
                    acc[dateKey] += parseFloat(item.total_price || 0);
                    return acc;
                }, {});
                return Object.keys(grouped).map((date) => ({
                    name: date,
                    revenue: grouped[date],
                }));
            case "status":
                if (!data.by_status) return [];
                return Object.entries(data.by_status).map(
                    ([status, stats]) => ({
                        name: status.replace(/_/g, " "),
                        value: stats.count,
                    }),
                );
            default:
                return [];
        }
    };

    const calculateTotal = (key) => {
        if (!data?.items?.length) return 0;
        return data.items.reduce(
            (sum, item) => sum + (Number(item[key]) || 0),
            0,
        );
    };

    const handlePrint = () => window.print();

    const handleExportPdf = () => {
        const url = route("admin.reports.export", {
            type,
            start_date: rawStartDate,
            end_date: rawEndDate,
        });
        window.open(url, "_blank");
    };

    const chartData = getChartData();

    return (
        <AdminLayout title="Hasil Laporan">
            <Head title="Hasil Laporan" />

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <Link
                    href={route("admin.reports.index")}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                    <CIcon icon={cilArrowLeft} size="sm" />
                    Kembali
                </Link>
                <div className="d-flex flex-wrap gap-2">
                    <CBadge
                        color="light"
                        textColor="dark"
                        className="px-3 py-2"
                    >
                        {startDate} — {endDate}
                    </CBadge>
                    <CButton
                        color="light"
                        size="sm"
                        onClick={handlePrint}
                        className="d-print-none"
                    >
                        <CIcon icon={cilPrint} size="sm" className="me-1" />
                        Cetak
                    </CButton>
                    <CButton
                        color="primary"
                        size="sm"
                        onClick={handleExportPdf}
                        className="d-print-none"
                    >
                        <CIcon
                            icon={cilCloudDownload}
                            size="sm"
                            className="me-1"
                        />
                        Export PDF
                    </CButton>
                </div>
            </div>

            {/* Title */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">{title}</h2>
                <p className="text-body-secondary">{description}</p>
            </div>

            {/* Summary Stats */}
            <CRow className="g-3 mb-4">
                {getSummaryStats().map((stat, idx) => (
                    <CCol
                        key={idx}
                        sm={6}
                        lg={Math.floor(
                            12 / Math.max(getSummaryStats().length, 1),
                        )}
                    >
                        <CCard
                            className={`border-top-${stat.color} border-top-3`}
                        >
                            <CCardBody>
                                <div className="text-body-secondary small text-uppercase">
                                    {stat.label}
                                </div>
                                <div className="h4 fw-bold mb-0">
                                    {stat.value}
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            {/* Charts */}
            {chartData.length > 0 && (
                <CCard className="mb-4 d-print-none">
                    <CCardHeader className="bg-transparent border-bottom">
                        <strong>
                            {type === "sales" || type === "income"
                                ? "Grafik Pendapatan"
                                : "Distribusi Status"}
                        </strong>
                    </CCardHeader>
                    <CCardBody>
                        <div style={{ height: 350 }}>
                            {type === "sales" || type === "income" ? (
                                <RevenueChart data={chartData} />
                            ) : type === "status" ? (
                                <StatusPieChart data={chartData} />
                            ) : null}
                        </div>
                    </CCardBody>
                </CCard>
            )}

            {/* Data Table */}
            {(() => {
                if (type === "sales" || type === "income") {
                    const items = data?.items || [];
                    if (items.length === 0) {
                        return (
                            <CCard>
                                <CCardBody className="text-center py-5 text-body-tertiary">
                                    Data tidak tersedia untuk periode ini.
                                </CCardBody>
                            </CCard>
                        );
                    }
                    return (
                        <CCard>
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Tabel Data Rinci</strong>
                            </CCardHeader>
                            <CCardBody className="p-0">
                                <CTable responsive hover className="mb-0">
                                    <CTableHead className="bg-body-tertiary">
                                        <CTableRow>
                                            <CTableHeaderCell>
                                                ID
                                            </CTableHeaderCell>
                                            <CTableHeaderCell>
                                                Tanggal
                                            </CTableHeaderCell>
                                            <CTableHeaderCell>
                                                Klien
                                            </CTableHeaderCell>
                                            <CTableHeaderCell>
                                                Unit
                                            </CTableHeaderCell>
                                            <CTableHeaderCell>
                                                Metode
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end">
                                                Total
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {items.map((item, index) => (
                                            <CTableRow
                                                key={item.id || index}
                                                className="align-middle"
                                            >
                                                <CTableDataCell className="text-primary fw-bold">
                                                    #{item.id}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-body-secondary small">
                                                    {item.created_at}
                                                </CTableDataCell>
                                                <CTableDataCell className="fw-semibold">
                                                    {item.customer_name}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-body-secondary small">
                                                    {item.motor_name}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge
                                                        color={
                                                            item.type === "CASH"
                                                                ? "success"
                                                                : "info"
                                                        }
                                                    >
                                                        {item.type}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">
                                                    {formatRupiah(
                                                        item.total_price,
                                                    )}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                    <tfoot className="bg-body-tertiary fw-bold">
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-3 text-end text-body-secondary small"
                                            >
                                                Grand Total
                                            </td>
                                            <td className="p-3 text-end text-success h5 mb-0">
                                                {formatRupiah(
                                                    calculateTotal(
                                                        "total_price",
                                                    ),
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    );
                }

                if (type === "customer") {
                    const customers = data?.top_customers || [];
                    if (customers.length === 0) {
                        return (
                            <CCard>
                                <CCardBody className="text-center py-5 text-body-tertiary">
                                    Data tidak tersedia.
                                </CCardBody>
                            </CCard>
                        );
                    }
                    return (
                        <CCard>
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Top Pelanggan</strong>
                            </CCardHeader>
                            <CCardBody className="p-0">
                                <CTable responsive hover className="mb-0">
                                    <CTableHead className="bg-body-tertiary">
                                        <CTableRow>
                                            <CTableHeaderCell>
                                                Klien
                                            </CTableHeaderCell>
                                            <CTableHeaderCell>
                                                Email
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">
                                                Transaksi
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end">
                                                Valuasi
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {customers.map((item, index) => (
                                            <CTableRow
                                                key={index}
                                                className="align-middle"
                                            >
                                                <CTableDataCell>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CAvatar
                                                            color="info"
                                                            textColor="white"
                                                            size="sm"
                                                        >
                                                            {item.name?.charAt(
                                                                0,
                                                            )}
                                                        </CAvatar>
                                                        <span className="fw-semibold">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-body-secondary small">
                                                    {item.email}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center fw-bold">
                                                    {item.transaction_count}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">
                                                    {formatRupiah(
                                                        item.total_spent,
                                                    )}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    );
                }

                if (type === "status") {
                    const statusEntries = data?.by_status
                        ? Object.entries(data.by_status)
                        : [];
                    if (statusEntries.length === 0) {
                        return (
                            <CCard>
                                <CCardBody className="text-center py-5 text-body-tertiary">
                                    Data tidak tersedia.
                                </CCardBody>
                            </CCard>
                        );
                    }
                    return (
                        <CCard>
                            <CCardHeader className="bg-transparent border-bottom">
                                <strong>Status Breakdown</strong>
                            </CCardHeader>
                            <CCardBody className="p-0">
                                <CTable responsive hover className="mb-0">
                                    <CTableHead className="bg-body-tertiary">
                                        <CTableRow>
                                            <CTableHeaderCell>
                                                Status
                                            </CTableHeaderCell>
                                            <CTableHeaderCell>
                                                Jumlah
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end">
                                                Valuasi
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {statusEntries.map(
                                            ([status, stats], index) => (
                                                <CTableRow
                                                    key={index}
                                                    className="align-middle"
                                                >
                                                    <CTableDataCell>
                                                        <CBadge
                                                            color="secondary"
                                                            className="text-capitalize"
                                                        >
                                                            {status.replace(
                                                                /_/g,
                                                                " ",
                                                            )}
                                                        </CBadge>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="h5 mb-0 fw-bold">
                                                        {stats.count}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-end fw-bold">
                                                        {formatRupiah(
                                                            stats.revenue,
                                                        )}
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ),
                                        )}
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    );
                }

                return null;
            })()}

            <div className="mt-4 text-center d-none d-print-block">
                <p className="text-body-secondary small">
                    Dicetak otomatis oleh Sistem Admin SRB Motor —{" "}
                    {new Date().toLocaleString()}
                </p>
            </div>
        </AdminLayout>
    );
}
