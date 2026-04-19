import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import Swal from "sweetalert2";
import {
    ArrowLeft, Save, User, Bike, Phone, Mail, MapPin,
    FileText, CreditCard, Banknote, Palette, Package, ShoppingCart
} from "lucide-react";

export default function Create({ motors, users }) {
    const [selectedMotor, setSelectedMotor] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        user_id:         "",
        motor_id:        "",
        name:            "",
        nik:             "",
        phone:           "",
        email:           "",
        motor_color:     "",
        delivery_method: "Ambil di Dealer",
        address:         "",
        booking_fee:     0,
        notes:           "",
        status:          "new_order",
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
        post(route("admin.transactions.store"), {
            onSuccess: () => Swal.fire({ title: "Berhasil!", text: "Transaksi baru telah dibuat.", icon: "success", timer: 2000, showConfirmButton: false }),
            onError: () => Swal.fire({ title: "Gagal!", text: "Terjadi kesalahan saat membuat transaksi.", icon: "error" }),
        });
    };

    const Field = ({ label, error, required, icon: Icon, children }) => (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                {Icon && <Icon size={10} className="inline mr-1" />}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
        </div>
    );

    const inputCls = (err) => `w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 ${err ? "border-red-400" : "border-gray-300"}`;

    return (
        <MetronicAdminLayout title="Buat Transaksi Tunai Baru">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <Link href={route("admin.transactions.index")} className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 rounded-lg transition-colors shadow-sm">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h2 className="text-xl font-black text-gray-800">Buat Transaksi Baru</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Buat catatan transaksi pembelian tunai secara manual.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-8 space-y-6">

                        {/* Card: Data Pelanggan & Unit */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><ShoppingCart size={15} className="text-blue-500" /> Pelanggan & Unit Motor</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Pelanggan" error={errors.user_id} required icon={User}>
                                    <select value={data.user_id} onChange={(e) => setData("user_id", e.target.value)} className={inputCls(errors.user_id)}>
                                        <option value="">Pilih Pelanggan</option>
                                        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                                    </select>
                                </Field>

                                <Field label="Unit Motor" error={errors.motor_id} required icon={Bike}>
                                    <select value={data.motor_id} onChange={(e) => handleMotorChange(e.target.value)} className={inputCls(errors.motor_id)}>
                                        <option value="">Pilih Motor</option>
                                        {motors.map((motor) => <option key={motor.id} value={motor.id}>{motor.name} — {formatCurrency(motor.price)}</option>)}
                                    </select>
                                </Field>

                                <Field label="Warna Pilihan" icon={Palette}>
                                    <input type="text" value={data.motor_color} onChange={(e) => setData("motor_color", e.target.value)} placeholder="Pilihan Warna" className={inputCls()} />
                                </Field>

                                <Field label="Metode Penyerahan" icon={Package}>
                                    <select value={data.delivery_method} onChange={(e) => setData("delivery_method", e.target.value)} className={inputCls()}>
                                        <option value="Ambil di Dealer">Ambil di Dealer</option>
                                        <option value="Kirim ke Rumah">Kirim ke Rumah</option>
                                    </select>
                                </Field>
                            </div>
                        </div>

                        {/* Card: Info Pembeli */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><User size={15} className="text-blue-500" /> Informasi Pembeli (Sesuai KTP)</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Nama Lengkap" error={errors.name} required>
                                    <input type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} placeholder="Nama Lengkap KTP" className={inputCls(errors.name)} />
                                </Field>

                                <Field label="NIK" error={errors.nik}>
                                    <input type="text" value={data.nik} onChange={(e) => setData("nik", e.target.value)} placeholder="16 Digit NIK" className={inputCls(errors.nik)} />
                                </Field>

                                <Field label="Nomor WhatsApp" error={errors.phone} required icon={Phone}>
                                    <input type="text" value={data.phone} onChange={(e) => setData("phone", e.target.value)} placeholder="628123456789" className={inputCls(errors.phone)} />
                                </Field>

                                <Field label="Email" error={errors.email} icon={Mail}>
                                    <input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="email@example.com" className={inputCls(errors.email)} />
                                </Field>

                                <div className="sm:col-span-2">
                                    <Field label="Alamat Pengiriman" error={errors.address} icon={MapPin}>
                                        <textarea value={data.address} onChange={(e) => setData("address", e.target.value)} rows={3} placeholder="Masukkan alamat lengkap..." className={`${inputCls(errors.address)} resize-none`} />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* Card: Pembayaran & Status */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><CreditCard size={15} className="text-blue-500" /> Pembayaran & Status</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {selectedMotor && (
                                    <Field label="Harga Motor" icon={Banknote}>
                                        <input type="text" disabled value={formatCurrency(selectedMotor.price)} className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg p-2.5 cursor-not-allowed" />
                                    </Field>
                                )}

                                <Field label="Booking Fee" error={errors.booking_fee} required icon={CreditCard}>
                                    <input type="number" value={data.booking_fee} onChange={(e) => setData("booking_fee", e.target.value)} placeholder="0" className={inputCls(errors.booking_fee)} />
                                </Field>

                                <Field label="Status Awal" error={errors.status} required>
                                    <select value={data.status} onChange={(e) => setData("status", e.target.value)} className={inputCls(errors.status)}>
                                        <option value="new_order">Pesanan Masuk</option>
                                        <option value="waiting_payment">Menunggu Pembayaran</option>
                                        <option value="pembayaran_dikonfirmasi">Pembayaran Dikonfirmasi</option>
                                        <option value="unit_preparation">Motor Disiapkan</option>
                                        <option value="ready_for_delivery">Siap Dikirim/Ambil</option>
                                        <option value="dalam_pengiriman">Dalam Pengiriman</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Dibatalkan</option>
                                    </select>
                                </Field>

                                <div className="sm:col-span-2">
                                    <Field label="Catatan Internal" error={errors.notes} icon={FileText}>
                                        <textarea value={data.notes} onChange={(e) => setData("notes", e.target.value)} rows={2} placeholder="Tambahkan catatan atau informasi penting..." className={`${inputCls(errors.notes)} resize-none`} />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={processing || !data.user_id || !data.motor_id} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                {processing ? "Membuat..." : "Buat Transaksi"}
                            </button>
                            <Link href={route("admin.transactions.index")} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-bold transition-colors">
                                Batal
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-24 space-y-4">
                            {/* Live Preview Motor */}
                            {selectedMotor ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800 text-sm">Unit Dipilih</h3>
                                    </div>
                                    <div className="p-4">
                                        {selectedMotor.image_path && (
                                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3">
                                                <img src={`/storage/${selectedMotor.image_path}`} alt={selectedMotor.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <p className="font-black text-gray-800">{selectedMotor.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{selectedMotor.brand} · {selectedMotor.type} · {selectedMotor.year}</p>
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <span className="text-lg font-black text-blue-600">{formatCurrency(selectedMotor.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-8 text-center">
                                    <Bike size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-xs text-gray-400 font-bold">Pilih motor untuk melihat preview</p>
                                </div>
                            )}

                            {/* Kalkulasi */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 text-sm">Kalkulasi Total</h3>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-bold">Harga Motor</span>
                                        <span className="text-sm font-bold text-gray-800">{formatCurrency(selectedMotor?.price || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-bold">Booking Fee</span>
                                        <span className="text-sm font-bold text-gray-800">{formatCurrency(data.booking_fee)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between">
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
