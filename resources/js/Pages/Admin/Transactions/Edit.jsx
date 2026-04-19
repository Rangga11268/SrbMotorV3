import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import Swal from "sweetalert2";
import { ArrowLeft, Save, User, Bike, MapPin, FileText, CreditCard, Banknote } from "lucide-react";

export default function Edit({ transaction, motors, users }) {
    const [selectedMotor, setSelectedMotor] = useState(
        motors.find((m) => m.id === transaction.motor_id)
    );

    const { data, setData, put, processing, errors } = useForm({
        user_id:          transaction.user_id || "",
        motor_id:         transaction.motor_id || "",
        customer_address: transaction.customer_address || "",
        booking_fee:      transaction.booking_fee || 0,
        notes:            transaction.notes || "",
        status:           transaction.status || "new_order",
    });

    const handleMotorChange = (motorId) => {
        const motor = motors.find((m) => m.id == motorId);
        setSelectedMotor(motor);
        setData("motor_id", motorId);
    };

    const formatCurrency = (n) => `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;

    const totalAmount = (selectedMotor?.price || 0) + (parseFloat(data.booking_fee) || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.transactions.update", transaction.id), {
            onSuccess: () => Swal.fire({ title: "Berhasil!", text: "Transaksi telah diperbarui.", icon: "success", timer: 2000, showConfirmButton: false }),
            onError: () => Swal.fire({ title: "Gagal!", text: Object.values(errors).join(", "), icon: "error" }),
        });
    };

    return (
        <MetronicAdminLayout title={`Edit Transaksi #${String(transaction.id).padStart(6, "0")}`}>
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <Link href={route("admin.transactions.show", transaction.id)} className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 rounded-lg transition-colors shadow-sm">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h2 className="text-xl font-black text-gray-800">Edit Transaksi <span className="text-amber-600 font-mono">#{String(transaction.id).padStart(6, "0")}</span></h2>
                    <p className="text-sm text-gray-500 mt-0.5">Perbarui data dan status transaksi pembayaran tunai ini.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-8 space-y-6">
                        {/* Card: Data Utama */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><User size={15} className="text-blue-500" /> Data Pelanggan & Unit</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Pelanggan */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pelanggan <span className="text-red-500">*</span></label>
                                    <select value={data.user_id} onChange={(e) => setData("user_id", e.target.value)} className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 ${errors.user_id ? "border-red-400" : "border-gray-300"}`}>
                                        <option value="">Pilih Pelanggan</option>
                                        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                                    </select>
                                    {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                                </div>

                                {/* Motor */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Unit Motor <span className="text-red-500">*</span></label>
                                    <select value={data.motor_id} onChange={(e) => handleMotorChange(e.target.value)} className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 ${errors.motor_id ? "border-red-400" : "border-gray-300"}`}>
                                        <option value="">Pilih Motor</option>
                                        {motors.map((motor) => <option key={motor.id} value={motor.id}>{motor.name}</option>)}
                                    </select>
                                    {errors.motor_id && <p className="text-red-500 text-xs mt-1">{errors.motor_id}</p>}
                                </div>

                                {/* Harga Motor (readonly) */}
                                {selectedMotor && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><Banknote size={10} className="inline mr-1" /> Harga Motor</label>
                                        <input type="text" disabled value={formatCurrency(selectedMotor.price)} className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg p-2.5 cursor-not-allowed" />
                                    </div>
                                )}

                                {/* Booking Fee */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><CreditCard size={10} className="inline mr-1" /> Booking Fee <span className="text-red-500">*</span></label>
                                    <input type="number" value={data.booking_fee} onChange={(e) => setData("booking_fee", e.target.value)} className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 ${errors.booking_fee ? "border-red-400" : "border-gray-300"}`} />
                                    {errors.booking_fee && <p className="text-red-500 text-xs mt-1">{errors.booking_fee}</p>}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Status <span className="text-red-500">*</span></label>
                                    <select value={data.status} onChange={(e) => setData("status", e.target.value)} className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 ${errors.status ? "border-red-400" : "border-gray-300"}`}>
                                        <option value="new_order">Pesanan Baru</option>
                                        <option value="waiting_payment">Menunggu Pembayaran</option>
                                        <option value="payment_confirmed">Pembayaran Dikonfirmasi</option>
                                        <option value="unit_preparation">Persiapan Unit</option>
                                        <option value="ready_for_delivery">Siap Dikirim</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Dibatalkan</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                                </div>

                                {/* Alamat */}
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><MapPin size={10} className="inline mr-1" /> Alamat Pengiriman</label>
                                    <textarea value={data.customer_address} onChange={(e) => setData("customer_address", e.target.value)} rows={3} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 resize-none" />
                                    {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>}
                                </div>

                                {/* Catatan */}
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><FileText size={10} className="inline mr-1" /> Catatan</label>
                                    <textarea value={data.notes} onChange={(e) => setData("notes", e.target.value)} rows={2} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 resize-none" />
                                    {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={processing} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60 transition-colors">
                                {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                            <Link href={route("admin.transactions.show", transaction.id)} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-bold transition-colors">
                                Batal
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Total */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 text-sm">Kalkulasi Total</h3>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-xs text-gray-500 font-bold">No. Transaksi</span>
                                        <span className="text-sm font-black text-blue-600 font-mono">#{String(transaction.id).padStart(6, "0")}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-xs text-gray-500 font-bold">Harga Motor</span>
                                        <span className="text-sm font-bold text-gray-800">{formatCurrency(selectedMotor?.price || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-xs text-gray-500 font-bold">Booking Fee</span>
                                        <span className="text-sm font-bold text-gray-800">{formatCurrency(data.booking_fee)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 mt-1">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Estimasi Total</span>
                                        <span className="text-xl font-black text-gray-900">{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MetronicAdminLayout>
    );
}
