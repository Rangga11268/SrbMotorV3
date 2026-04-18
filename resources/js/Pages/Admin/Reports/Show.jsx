import React from "react";
import { Link, Head } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import {
    ArrowLeft,
    Printer,
    DownloadCloud,
    TrendingUp,
    Wallet,
    Users,
    Activity,
    CreditCard,
    DollarSign,
    Box
} from "lucide-react";
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
    const formatRupiah = (n) => `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    const getSummaryStats = () => {
        if (!data) return [];
        switch (type) {
            case "sales":
                return [
                    { label: "Total Transaksi", value: data.total_transactions, icon: Box, color: "text-blue-600", bg: "bg-blue-100" },
                    { label: "Total Penjualan", value: formatRupiah(data.total_revenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
                ];
            case "income":
                return [
                    { label: "Pendapatan Kotor", value: formatRupiah(data.total_income), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
                    { label: "Pemasukan Tunai", value: formatRupiah(data.cash_income), icon: Wallet, color: "text-blue-600", bg: "bg-blue-100" },
                    { label: "Pemasukan Kredit", value: formatRupiah(data.credit_income), icon: CreditCard, color: "text-amber-600", bg: "bg-amber-100" },
                ];
            case "customer":
                return [
                    { label: "Total Klien Unik", value: data.total_customers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { label: "Klien Baru", value: data.new_customers, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
                ];
            case "status":
                return [
                    { label: "Total Order Diproses", value: data.total_transactions, icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
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
                    acc[dateKey] += parseFloat(item.final_price || 0);
                    return acc;
                }, {});
                return Object.keys(grouped).map((date) => ({
                    name: date,
                    revenue: grouped[date],
                }));
            case "status":
                if (!data.by_status) return [];
                return Object.entries(data.by_status).map(([status, stats]) => ({
                    name: status.replace(/_/g, " ").toUpperCase(),
                    value: stats.count,
                }));
            default:
                return [];
        }
    };

    const calculateTotal = (key) => {
        if (!data?.items?.length) return 0;
        return data.items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
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
    const stats = getSummaryStats();

    return (
        <MetronicAdminLayout title="Hasil Laporan Analisis">
            <Head title="Hasil Laporan - SRB Motor" />

            {/* Print Header Logic Container */}
            <div className="print-container">
            
                {/* Header Action Bar */}
                <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4 d-print-none">
                    <div className="flex gap-4 items-start">
                        <Link
                            href={route("admin.reports.index")}
                            className="p-2 border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors shadow-sm shrink-0 mt-1"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">{description}</p>
                            <div className="inline-flex mt-2 items-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-bold font-mono shadow-sm">
                                {startDate} — {endDate}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Printer size={16} /> Cetak (Print)
                        </button>
                        <button
                            onClick={handleExportPdf}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white border border-gray-900 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <DownloadCloud size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Print Title (Visible only when printing) */}
                <div className="hidden d-print-block mb-6 text-center border-b border-gray-300 pb-4">
                    <h1 className="text-2xl font-black">{title}</h1>
                    <p className="text-sm text-gray-600">Periode: {startDate} - {endDate}</p>
                </div>

                {/* Main Content Layout */}
                <div className="space-y-6">
                    
                    {/* Summary Statistical Cards */}
                    {stats.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4 relative overflow-hidden group">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full opacity-50 transition-scale duration-500 group-hover:scale-110 pointer-events-none"></div>
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-inner ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="z-10">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight mt-0.5">{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Chart Section */}
                    {chartData.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden d-print-none">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-500" />
                                    {type === "sales" || type === "income" ? "Visualisasi Grafik Pendapatan" : "Distribusi Status"}
                                </h3>
                            </div>
                            <div className="p-6 h-[350px]">
                                {type === "sales" || type === "income" ? (
                                    <RevenueChart data={chartData} />
                                ) : type === "status" ? (
                                    <StatusPieChart data={chartData} />
                                ) : null}
                            </div>
                        </div>
                    )}

                    {/* Data Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <Box size={16} className="text-gray-500" />
                                Tabel Data Rinci
                            </h3>
                        </div>

                        {/* Rendering Table by Type */}
                        {(() => {
                            // SALES OR INCOME
                            if (type === "sales" || type === "income") {
                                const items = data?.items || [];
                                if (items.length === 0) return <div className="p-12 text-center text-gray-400 italic">Data tidak tersedia untuk periode ini.</div>;
                                
                                return (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead>
                                                <tr className="bg-white border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <th className="px-6 py-4">ID Transaksi</th>
                                                    <th className="px-6 py-4">Waktu</th>
                                                    <th className="px-6 py-4">Pelanggan</th>
                                                    <th className="px-6 py-4">Unit Motor</th>
                                                    <th className="px-6 py-4">Tipe Bayar</th>
                                                    <th className="px-6 py-4 text-right">Nominal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {items.map((item, index) => (
                                                    <tr key={item.id || index} className="hover:bg-gray-50/50">
                                                        <td className="px-6 py-4 font-bold text-blue-600 font-mono">#{item.id}</td>
                                                        <td className="px-6 py-4 text-xs text-gray-500 font-medium">{item.created_at}</td>
                                                        <td className="px-6 py-4 font-bold text-gray-800">{item.customer_name}</td>
                                                        <td className="px-6 py-4 text-gray-600 text-xs">{item.motor_name}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${item.type === 'CASH' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                                {item.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-black text-gray-900">{formatRupiah(item.final_price)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50/50 border-t border-gray-200">
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                        Grand Total Periode
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="font-black text-emerald-600 text-lg">
                                                            {formatRupiah(calculateTotal("final_price"))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                );
                            }

                            // CUSTOMERS
                            if (type === "customer") {
                                const customers = data?.top_customers || [];
                                if (customers.length === 0) return <div className="p-12 text-center text-gray-400 italic">Data pelanggan tidak tersedia.</div>;

                                return (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead>
                                                <tr className="bg-white border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <th className="px-6 py-4">Informasi Pelanggan</th>
                                                    <th className="px-6 py-4 text-center">Frek. Transaksi</th>
                                                    <th className="px-6 py-4 text-right">Total Valuasi (Spent)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {customers.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50/50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 border border-blue-200">
                                                                    {item.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-800">{item.name}</div>
                                                                    <div className="text-xs text-gray-500">{item.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 font-bold text-gray-600 border border-gray-200">
                                                                {item.transaction_count}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-black text-gray-900">
                                                            {formatRupiah(item.total_spent)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            }

                            // STATUS
                            if (type === "status") {
                                const statusEntries = data?.by_status ? Object.entries(data.by_status) : [];
                                if (statusEntries.length === 0) return <div className="p-12 text-center text-gray-400 italic">Data status tidak tersedia.</div>;

                                return (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead>
                                                <tr className="bg-white border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <th className="px-6 py-4">Status Tag</th>
                                                    <th className="px-6 py-4 text-center">Jumlah Entitas</th>
                                                    <th className="px-6 py-4 text-right">Total Nilai Valuasi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {statusEntries.map(([statusName, stats], index) => (
                                                    <tr key={index} className="hover:bg-gray-50/50">
                                                        <td className="px-6 py-4">
                                                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-widest border border-gray-200">
                                                                {statusName.replace(/_/g, " ")}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-bold text-lg text-gray-700">
                                                            {stats.count}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-black text-gray-900">
                                                            {formatRupiah(stats.revenue)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            }

                            return null;
                        })()}
                    </div>
                </div>

                <div className="mt-8 text-center hidden d-print-block">
                    <p className="text-gray-500 text-xs font-medium">
                        Dicetak secara otomatis oleh Sistem Admin SRB Motor — {new Date().toLocaleString()}
                    </p>
                </div>
            </div>

            <style>{`
                @media print {
                    .d-print-none { display: none !important; }
                    .d-print-block { display: block !important; }
                    body { background: white !important; }
                    .print-container { padding: 0; margin: 0; }
                    .shadow-sm { box-shadow: none !important; }
                    .border { border-color: #e5e7eb !important; }
                }
            `}</style>
        </MetronicAdminLayout>
    );
}
