import React from "react";
import { useForm, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CFormInput,
    CFormLabel,
    CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilChartPie,
    cilDollar,
    cilPeople,
    cilSpeedometer,
    cilCalendar,
    cilSearch,
} from "@coreui/icons";

export default function Index() {
    const { data, setData, get, processing } = useForm({
        type: "sales",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
    });

    const reportTypes = [
        {
            id: "sales",
            label: "Analisis Penjualan",
            desc: "Metrik transaksi & performa produk",
            icon: cilSpeedometer,
            color: "success",
        },
        {
            id: "income",
            label: "Laporan Pendapatan",
            desc: "Arus kas & detail revenue",
            icon: cilDollar,
            color: "primary",
        },
        {
            id: "customer",
            label: "Wawasan Pelanggan",
            desc: "Demografi & top spender",
            icon: cilPeople,
            color: "info",
        },
        {
            id: "status",
            label: "Distribusi Status",
            desc: "Monitoring logistik & proses",
            icon: cilChartPie,
            color: "warning",
        },
    ];

    const presets = [
        { label: "Hari Ini", days: 0 },
        { label: "7 Hari", days: 7 },
        { label: "30 Hari", days: 30 },
        { label: "Bulan Ini", type: "month" },
    ];

    const applyPreset = (preset) => {
        const end = new Date();
        const start = new Date();

        if (preset.type === "month") {
            start.setDate(1);
        } else {
            start.setDate(end.getDate() - preset.days);
        }

        setData({
            ...data,
            start_date: start.toISOString().split("T")[0],
            end_date: end.toISOString().split("T")[0],
        });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        get(route("admin.reports.generate"));
    };

    return (
        <AdminLayout title="Pusat Laporan">
            <Head title="Pusat Laporan" />

            <form onSubmit={handleGenerate}>
                <CCard className="mb-4">
                    <CCardHeader className="bg-transparent border-bottom">
                        <strong>Jenis Laporan</strong>
                        <p className="text-body-secondary small mb-0 mt-1">
                            Pilih parameter data yang akan dianalisis
                        </p>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="g-3">
                            {reportTypes.map((type) => (
                                <CCol key={type.id} xs={6} lg={3}>
                                    <div
                                        role="button"
                                        onClick={() => setData("type", type.id)}
                                        className={`border rounded-3 p-4 h-100 text-center ${
                                            data.type === type.id
                                                ? `border-${type.color} bg-${type.color}-subtle`
                                                : "bg-body-tertiary"
                                        }`}
                                        style={{
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <div
                                            className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${
                                                data.type === type.id
                                                    ? `bg-${type.color} ${type.color === "warning" ? "text-dark" : "text-white"}`
                                                    : "bg-body-secondary text-body-tertiary"
                                            }`}
                                            style={{ width: 48, height: 48 }}
                                        >
                                            <CIcon icon={type.icon} size="lg" />
                                        </div>
                                        <h6 className="fw-bold mb-1">
                                            {type.label}
                                        </h6>
                                        <p
                                            className="text-body-secondary mb-0"
                                            style={{ fontSize: 11 }}
                                        >
                                            {type.desc}
                                        </p>
                                    </div>
                                </CCol>
                            ))}
                        </CRow>
                    </CCardBody>
                </CCard>

                <CCard className="mb-4">
                    <CCardHeader className="bg-transparent border-bottom">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                            <div>
                                <strong>Rentang Waktu</strong>
                                <p className="text-body-secondary small mb-0 mt-1">
                                    Definisikan periode observasi data
                                </p>
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                                {presets.map((preset, idx) => (
                                    <CButton
                                        key={idx}
                                        type="button"
                                        color="light"
                                        size="sm"
                                        onClick={() => applyPreset(preset)}
                                    >
                                        {preset.label}
                                    </CButton>
                                ))}
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="g-3">
                            <CCol md={6}>
                                <CFormLabel>Tanggal Mulai</CFormLabel>
                                <CFormInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Tanggal Akhir</CFormLabel>
                                <CFormInput
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                />
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                <CButton
                    type="submit"
                    color="primary"
                    className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    disabled={processing}
                >
                    {processing ? (
                        <span className="spinner-border spinner-border-sm" />
                    ) : (
                        <CIcon icon={cilSearch} />
                    )}
                    {processing ? "Memproses Data..." : "Generate Laporan"}
                </CButton>
            </form>
        </AdminLayout>
    );
}
