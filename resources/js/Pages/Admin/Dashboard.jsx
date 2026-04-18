import React from "react";
import { Head, Link } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import {
    Bike,
    Users,
    ShoppingCart,
    TrendingUp,
    Plus,
    CreditCard,
    Settings,
    ArrowRight,
    TrendingDown,
    Activity,
    Award,
    ChevronLeft
} from "lucide-react";
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
    brandStats,
    totalRevenue,
}) {
    const formatCurrency = (val) => new Intl.NumberFormat("id-ID").format(val || 0);

    const stats = [
        {
            title: "Total Inventory",
            value: motorsCount,
            icon: Bike,
            trend: "+3.5%",
            trendUp: true,
            bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
            shadow: "shadow-blue-500/30",
        },
        {
            title: "Pengguna Aktif",
            value: usersCount,
            icon: Users,
            trend: "+12.1%",
            trendUp: true,
            bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
            shadow: "shadow-indigo-500/30",
        },
        {
            title: "Total Transaksi",
            value: transactionsCount,
            icon: ShoppingCart,
            trend: "+2.4%",
            trendUp: true,
            bgColor: "bg-gradient-to-br from-emerald-400 to-teal-600",
            shadow: "shadow-emerald-500/30",
            subtext: `${cashTransactionsCount} Tunai • ${creditTransactionsCount} Kredit`,
        },
        {
            title: "Total Pendapatan",
            value: `Rp ${formatCurrency(totalRevenue)}`,
            icon: TrendingUp,
            trend: "+8.2%",
            trendUp: true,
            bgColor: "bg-gradient-to-br from-amber-400 to-orange-500",
            shadow: "shadow-orange-500/30",
        },
    ];

    const getStatusBadge = (status) => {
        const map = {
            completed: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Selesai", dot: "bg-emerald-500" },
            approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Disetujui", dot: "bg-emerald-500" },
            disetujui: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Disetujui", dot: "bg-emerald-500" },
            lunas: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Lunas", dot: "bg-emerald-500" },
            pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending", dot: "bg-amber-500" },
            menunggu_persetujuan: { bg: "bg-amber-100", text: "text-amber-700", label: "Menunggu", dot: "bg-amber-500" },
            new_order: { bg: "bg-blue-100", text: "text-blue-700", label: "Order Baru", dot: "bg-blue-500" },
            payment_confirmed: { bg: "bg-blue-100", text: "text-blue-700", label: "Pembayaran Dikonfirmasi", dot: "bg-blue-500" },
            rejected: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak", dot: "bg-red-500" },
            ditolak: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak", dot: "bg-red-500" },
            cancelled: { bg: "bg-gray-100", text: "text-gray-700", label: "Dibatalkan", dot: "bg-gray-500" },
        };
        const badge = map[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A", dot: "bg-gray-500" };
        
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${badge.bg} ${badge.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                {badge.label}
            </div>
        );
    };

    return (
        <MetronicAdminLayout title="Dashboard Overview">
            
            {/* Welcome Banner Premium */}
            <div className="mb-8 rounded-2xl bg-[#1E1E2D] overflow-hidden shadow-xl shadow-gray-200/50 relative text-white border border-gray-800">
                <div className="absolute top-0 right-[-5%] p-8 opacity-5">
                    <Activity size={240} className="text-white" />
                </div>
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/5">
                            <Award size={14} /> SRB Admin Gateway
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Performa Sistem Aktual</h2>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            Pantau secara real-time performa penjualan unit motor, ketersediaan inventaris, dan anomali transaksi. Semua metrik disajikan secara langsung untuk pengambilan keputusan yang cepat.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 shrink-0">
                        <Link href={route("admin.motors.create")} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30">
                            <Plus size={18} /> Daftarkan Unit Baru
                        </Link>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Link href={route("admin.credits.index")} className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all">
                                <CreditCard size={16} className="text-gray-400" /> Kredit
                            </Link>
                            <Link href={route("admin.transactions.index")} className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all">
                                <ShoppingCart size={16} className="text-gray-400" /> Tunai
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className={`rounded-2xl p-6 text-white overflow-hidden relative shadow-lg ${stat.bgColor} ${stat.shadow} hover:-translate-y-1 transition-transform duration-300`}>
                        {/* Decorative Background Icon */}
                        <stat.icon size={100} className="absolute -right-4 -bottom-4 text-white opacity-10 rotate-12" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
                                    <stat.icon size={24} className="text-white" />
                                </div>
                                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${stat.trendUp ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'}`}>
                                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stat.trend}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
                                <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                                {stat.subtext && (
                                    <div className="mt-2 text-xs font-medium text-white/70 bg-black/10 inline-block px-2 py-1 rounded-md">{stat.subtext}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ringkasan & Grafik Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Revenue Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Tren Pendapatan Bulanan</h3>
                            <p className="text-xs text-gray-500 mt-1">Grafik akumulasi penjualan bersih (Tunai + DP Kredit)</p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="p-6 flex-1 min-h-[340px] bg-gray-50/30">
                        <RevenueChart data={monthlyStats} />
                    </div>
                </div>

                {/* Secondary Chart / Summary block */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-white">
                            <h3 className="font-bold text-gray-800">Distribusi Merek (Brand)</h3>
                            <p className="text-xs text-gray-500 mt-1">Proporsi inventaris berdasarkan pabrikan</p>
                        </div>
                        <div className="p-6 flex-1 flex items-center justify-center min-h-[250px] bg-gray-50/30">
                            <StatusPieChart data={brandStats?.map(b => ({ label: b.name, total: b.value }))} />
                        </div>
                    </div>
                </div>
            </div>

            {/* List / Data Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Transaksi Terbaru (Takes up more space) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Log Transaksi Terbaru</h3>
                            <p className="text-xs text-gray-500 mt-1">Status 5 transaksi masuk terakhir</p>
                        </div>
                        <Link href={route("admin.transactions.index")} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                            Selengkapnya <ArrowRight size={16} className="text-gray-400" />
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">Informasi Customer</th>
                                    <th className="px-6 py-4">Unit Dipesan</th>
                                    <th className="px-6 py-4 text-center">Tipe</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {recentTransactions && recentTransactions.length > 0 ? (
                                    recentTransactions.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{trx.customer_name}</div>
                                                <div className="text-xs text-gray-500 font-medium mt-0.5">{trx.customer_phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 font-medium">
                                                {trx.motor?.name || <span className="text-gray-400 italic">Data Dihapus</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${trx.transaction_type === 'CASH' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                                                    {trx.transaction_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(trx.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-500 font-medium text-xs">
                                                {new Date(trx.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <ShoppingCart size={32} className="text-gray-300" />
                                                <span>Belum ada transaksi terekam di sistem.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Motor Tambahan Terbaru */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Unit Terbaru</h3>
                            <p className="text-xs text-gray-500 mt-1">Ditambahkan ke inventaris</p>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 flex-1 flex flex-col">
                        {recentMotors && recentMotors.length > 0 ? (
                            recentMotors.map((motor) => (
                                <Link key={motor.id} href={route("admin.motors.show", motor.id)} className="flex items-center gap-4 p-5 hover:bg-gray-50/80 transition-colors group">
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 shadow-inner">
                                        {motor.image_path ? (
                                            <img src={`/storage/${motor.image_path}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={motor.name} />
                                        ) : (
                                            <Bike size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">{motor.name}</div>
                                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mt-1 mb-1.5 bg-gray-100 inline-block px-2 py-0.5 rounded-md border border-gray-200">{motor.brand?.name || "NON-BRAND"} • {motor.year}</div>
                                        <div className="font-black text-blue-600 text-xs">Rp {formatCurrency(motor.price)}</div>
                                    </div>
                                    <div className="shrink-0 p-2 text-gray-300 group-hover:text-blue-500 transition-colors">
                                        <ChevronLeft size={16} className="rotate-180" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 flex-1 flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Bike size={32} className="text-gray-300" />
                                    <span className="text-sm">Inventaris masih kosong.</span>
                                </div>
                            </div>
                        )}
                        <div className="p-4 bg-gray-50 mt-auto">
                           <Link href={route("admin.motors.index")} className="w-full py-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                               Kelola Semua Unit
                           </Link>
                        </div>
                    </div>
                </div>
            </div>

        </MetronicAdminLayout>
    );
}
