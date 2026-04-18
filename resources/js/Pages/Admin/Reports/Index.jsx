import React from "react";
import { useForm, Head } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import {
    LineChart,
    Wallet,
    Users,
    PieChart,
    Calendar,
    Search,
    Loader2
} from "lucide-react";

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
            icon: LineChart,
            baseColor: "text-blue-600",
            bgActive: "bg-blue-50 border-blue-500 shadow-sm",
            bgInactive: "bg-white border-gray-200 text-gray-500 hover:shadow-md hover:border-blue-300",
            iconBg: "bg-blue-100",
            isPrimary: true
        },
        {
            id: "income",
            label: "Laporan Pendapatan",
            desc: "Arus kas & detail revenue",
            icon: Wallet,
            baseColor: "text-emerald-600",
            bgActive: "bg-emerald-50 border-emerald-500 shadow-sm",
            bgInactive: "bg-white border-gray-200 text-gray-500 hover:shadow-md hover:border-emerald-300",
            iconBg: "bg-emerald-100",
            isPrimary: false
        },
        {
            id: "customer",
            label: "Wawasan Pelanggan",
            desc: "Demografi & top spender",
            icon: Users,
            baseColor: "text-purple-600",
            bgActive: "bg-purple-50 border-purple-500 shadow-sm",
            bgInactive: "bg-white border-gray-200 text-gray-500 hover:shadow-md hover:border-purple-300",
            iconBg: "bg-purple-100",
            isPrimary: false
        },
        {
            id: "status",
            label: "Distribusi Status",
            desc: "Monitoring logistik & proses",
            icon: PieChart,
            baseColor: "text-amber-600",
            bgActive: "bg-amber-50 border-amber-500 shadow-sm",
            bgInactive: "bg-white border-gray-200 text-gray-500 hover:shadow-md hover:border-amber-300",
            iconBg: "bg-amber-100",
            isPrimary: false
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
        <MetronicAdminLayout title="Pusat Data & Laporan">
            <Head title="Pusat Laporan" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Pembuat Laporan Sistem</h2>
                <p className="text-sm text-gray-500 mt-1">Kustomisasi parameter untuk menghasilkan analisis cetak maupun digital terpadu.</p>
            </div>

            <form onSubmit={handleGenerate} className="max-w-5xl">
                
                {/* Modul Pemilihan Tipe Laporan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">1. Tentukan Jenis Analisis</h3>
                        <p className="text-sm text-gray-500">Pilih salah satu dari metrik utama untuk diekstrak menjadi PDF.</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {reportTypes.map((type) => {
                                const isActive = data.type === type.id;
                                return (
                                    <div
                                        key={type.id}
                                        onClick={() => setData("type", type.id)}
                                        className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 flex flex-col items-center text-center ${isActive ? type.bgActive : type.bgInactive + ' hover:border-gray-300'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isActive ? type.baseColor + ' ' + type.iconBg : 'bg-gray-100 text-gray-400'}`}>
                                            <type.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        <h4 className={`font-bold text-sm mb-1 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{type.label}</h4>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{type.desc}</p>
                                        
                                        {/* Status indicator absolute */}
                                        <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-transparent bg-blue-500' : 'border-gray-300 bg-transparent'}`}>
                                            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Modul Rentang Waktu */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-gray-800">2. Tentukan Rentang Waktu</h3>
                            <p className="text-sm text-gray-500 mt-1">Batasi hasil data di antara dua periode tanggal</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applyPreset(preset)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-[6px] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai (Start Date)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        className="pl-10 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Akhir (End Date)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        className="pl-10 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Menyusun Laporan...</span>
                            </>
                        ) : (
                            <>
                                <Search size={18} />
                                <span>Filter & Ekstrak Laporan</span>
                            </>
                        )}
                    </button>
                </div>

            </form>
        </MetronicAdminLayout>
    );
}
