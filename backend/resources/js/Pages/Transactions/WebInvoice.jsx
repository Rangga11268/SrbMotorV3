import React from "react";
import { Head, Link } from "@inertiajs/react";
import { 
    CheckCircle2, 
    FileText, 
    CreditCard, 
    ArrowLeft, 
    Download, 
    Clock, 
    Info,
    Smartphone,
    Building2,
    CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";

export default function WebInvoice({ transaction, bankSettings }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "success":
            case "lunas":
            case "completed":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "pending":
            case "waiting_payment":
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "failed":
            case "cancelled":
                return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    const totalPaid = transaction.installments
        ? transaction.installments
              .filter((i) => i.status === "paid")
              .reduce((sum, i) => sum + parseFloat(i.amount), 0)
        : 0;

    const remainingBalance = parseFloat(transaction.total_price || 0) - totalPaid;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
            <Head title={`Invoice #${transaction.id}`} />

            {/* Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href={route("motors.transaction-detail", transaction.id)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Detail
                    </Link>
                    <div className="flex items-center gap-3">
                        <a
                            href={route("admin.transactions.invoice.download", transaction.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >
                            <Download size={14} />
                            PDF Invoice
                        </a>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Invoice Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(transaction.status)}`}>
                                    {transaction.status.replace("_", " ")}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900">INVOICE</h1>
                                    <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
                                        <FileText size={14} /> #{transaction.id} / SRB-MOT-{new Date(transaction.created_at).getFullYear()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Diterbitkan Untuk</span>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900">{transaction.customer_name || transaction.user?.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{transaction.customer_phone || transaction.user?.phone}</p>
                                            <p className="text-xs text-slate-400">{transaction.customer_email || transaction.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Terbit</span>
                                        <p className="font-bold text-slate-900">{new Date(transaction.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-end gap-1">
                                            <Clock size={12} /> {new Date(transaction.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                                        </p>
                                    </div>
                                </div>

                                {/* Order Breakdown */}
                                <div className="space-y-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rincian Pesanan</span>
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                                                    <Smartphone className="text-slate-400" size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{transaction.motor?.name || "Unit Kendaraan"}</p>
                                                    <p className="text-xs text-slate-500 font-medium">Tipe: {transaction.payment_type?.toUpperCase() || 'CASH'}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-slate-900">{formatCurrency(transaction.total_price)}</p>
                                        </div>
                                        
                                        <div className="space-y-2 pt-4 border-t border-slate-200/60">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Booking Fee</span>
                                                <span className="font-bold text-slate-900">{formatCurrency(transaction.booking_fee || 0)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Biaya Administrasi</span>
                                                <span className="font-bold text-slate-900">{formatCurrency(0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment History / Installments */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-500" /> Jadwal Pembayaran
                            </h3>
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keterangan</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jatuh Tempo</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Jumlah</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-sm font-medium">
                                        {transaction.installments?.map((inst, idx) => (
                                            <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-900">{inst.installment_number === 0 ? "Uang Muka (DP)" : `Angsuran #${inst.installment_number}`}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-500 text-xs">{new Date(inst.due_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                                    {formatCurrency(inst.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(inst.status)}`}>
                                                        {inst.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Payment Info */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-900/20 sticky top-24">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Tagihan</span>
                                    <p className="text-3xl font-black tracking-tight">{formatCurrency(transaction.total_price)}</p>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-medium">Telah Dibayar</span>
                                        <span className="font-bold text-emerald-400">{formatCurrency(totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-medium">Sisa Tagihan</span>
                                        <span className="font-bold text-amber-400">{formatCurrency(remainingBalance)}</span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                                                <Building2 size={16} className="text-blue-400" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Instruksi Transfer</span>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bank Penerima</p>
                                            <p className="font-bold text-sm">{bankSettings.name}</p>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nomor Rekening</p>
                                            <p className="font-black text-lg tracking-wider text-blue-400">{bankSettings.account_number}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atas Nama</p>
                                            <p className="font-bold text-xs uppercase">{bankSettings.account_name}</p>
                                        </div>

                                        <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                                            <p className="text-[9px] text-blue-300 font-medium leading-relaxed italic">
                                                *Mohon lampirkan bukti transfer pada menu "Cicilan Saya" untuk mempercepat proses verifikasi.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <Link
                                    href={route('installments.index')}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-slate-900 rounded-2xl text-sm font-black hover:bg-slate-100 transition-all active:scale-95 group shadow-lg shadow-white/5"
                                >
                                    BAYAR SEKARANG
                                    <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Extra Info Card */}
                        <div className="bg-blue-50 rounded-[2rem] p-6 border border-blue-100">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-blue-200 shrink-0">
                                    <Info className="text-blue-500" size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-blue-900 text-sm">Butuh Bantuan?</h4>
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                        Jika terdapat ketidaksesuaian data pada invoice ini, silakan hubungi tim Support kami melalui WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
