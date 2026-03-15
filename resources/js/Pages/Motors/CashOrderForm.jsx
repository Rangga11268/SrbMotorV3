import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Input, { Label, ErrorMessage } from "@/Components/UI/Input";
import {
    User,
    Phone,
    Briefcase,
    FileText,
    DollarSign,
    Calendar,
    ArrowLeft,
    CheckCircle,
    Zap,
    MessageSquare,
    Wallet,
    CreditCard,
    ShieldCheck,
    ChevronLeft,
    Info,
    AlertTriangle,
    MapPin,
    Fingerprint,
    Mail,
    Palette,
    Truck,
    Store,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CashOrderForm({ motor, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: auth.user?.name || "",
        phone: auth.user?.phone || "",
        nik: auth.user?.profile?.nik || "",
        address: auth.user?.profile?.alamat || "",
        motor_color: "",
        delivery_method: "Ambil di Dealer",
        notes: "",
        booking_fee: 0,
        payment_method: "Transfer Bank",
    });

    const [hasValidationErrors, setHasValidationErrors] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Format number untuk display: 4700000 -> 4.700.000
    const formatNumberDisplay = (numStr) => {
        if (!numStr && numStr !== 0) return "";
        const strValue = String(numStr);
        const cleanNum = strValue.replace(/[^\d]/g, "");
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Parse formatted number untuk backend: 4.700.000 -> 4700000
    const parseFormattedNumber = (str) => {
        return String(str).replace(/[^\d]/g, "");
    };

    const handleBookingFeeChange = (value) => {
        const cleaned = parseFormattedNumber(value);
        setData("booking_fee", cleaned);
    };

    const submit = (e) => {
        e.preventDefault();

        // Validation check
        const validationErrors = [];
        const bookingFee = parseFloat(data.booking_fee) || 0;

        if (!data.name.trim()) {
            validationErrors.push("Nama lengkap harus diisi");
        }
        if (!data.phone.trim()) {
            validationErrors.push("Nomor WhatsApp harus diisi");
        }
        if (!data.nik.trim()) {
            validationErrors.push("NIK harus diisi untuk STNK/BPKB");
        }
        if (!data.motor_color) {
            validationErrors.push("Warna motor harus dipilih");
        }
        if (!data.address.trim()) {
            validationErrors.push("Alamat lengkap harus diisi");
        }
        if (bookingFee < 0 || bookingFee >= motor.price) {
            validationErrors.push(
                `Biaya bookingnya harus antara 0 dan kurang dari Rp ${formatCurrency(motor.price)}`,
            );
        }
        if (!data.payment_method) {
            validationErrors.push("Metode pembayaran harus dipilih");
        }

        if (validationErrors.length > 0) {
            setHasValidationErrors(validationErrors);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setHasValidationErrors(false);
        post(route("motors.process-cash-order", motor.id));
    };

    return (
        <PublicLayout auth={auth} title={`Beli Cash - ${motor.name}`}>
            <div className="flex-grow pt-[104px] pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <Link
                            href={route("motors.show", motor.id)}
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Detail
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* LEFT: FORM */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-sm overflow-hidden">
                                <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h1 className="text-3xl font-black mb-2">
                                            Formulir Pembelian Tunai
                                        </h1>
                                        <p className="text-blue-100 font-medium">
                                            Lengkapi data diri Anda untuk proses
                                            transaksi yang cepat dan aman.
                                        </p>
                                    </div>
                                    <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                </div>

                                {(hasValidationErrors ||
                                    Object.keys(errors).length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border-l-4 border-red-500 m-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-red-900 mb-2">
                                                    Data tidak lengkap atau ada
                                                    masalah:
                                                </p>
                                                <ul className="space-y-1">
                                                    {hasValidationErrors &&
                                                        Array.isArray(
                                                            hasValidationErrors,
                                                        ) &&
                                                        hasValidationErrors.map(
                                                            (err, idx) => (
                                                                <li
                                                                    key={`fe-${idx}`}
                                                                    className="text-sm text-red-700 flex items-center gap-2"
                                                                >
                                                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                                                    {err}
                                                                </li>
                                                            ),
                                                        )}
                                                    {Object.keys(errors)
                                                        .length > 0 &&
                                                        Object.entries(
                                                            errors,
                                                        ).map(
                                                            (
                                                                [field, errMsg],
                                                                idx,
                                                            ) => (
                                                                <li
                                                                    key={`be-${idx}`}
                                                                    className="text-sm text-red-700 flex items-center gap-2"
                                                                >
                                                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                                                    {errMsg}
                                                                </li>
                                                            ),
                                                        )}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <CardBody className="p-8">
                                    <form
                                        onSubmit={submit}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_name">
                                                    Nama Lengkap
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_name"
                                                        type="text"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="Sesuai KTP"
                                                        required
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.name && (
                                                    <ErrorMessage>
                                                        {errors.name}
                                                    </ErrorMessage>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="customer_phone">
                                                    Nomor WhatsApp
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_phone"
                                                        type="tel"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="0812..."
                                                        required
                                                        value={data.phone}
                                                        onChange={(e) =>
                                                            setData(
                                                                "phone",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.phone && (
                                                    <ErrorMessage>
                                                        {errors.phone}
                                                    </ErrorMessage>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_nik">
                                                    NIK (Sesuai KTP)
                                                </Label>
                                                <div className="relative">
                                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_nik"
                                                        type="text"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="16 Digit NIK"
                                                        required
                                                        value={data.nik}
                                                        onChange={(e) =>
                                                            setData(
                                                                "nik",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.nik && (
                                                    <ErrorMessage>
                                                        {errors.nik}
                                                    </ErrorMessage>
                                                )}
                                            </div>
                                        </div>
                                        

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="motor_color">
                                                    Pilihan Warna
                                                </Label>
                                                <div className="relative">
                                                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <select
                                                        id="motor_color"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 appearance-none"
                                                        required
                                                        value={data.motor_color}
                                                        onChange={(e) =>
                                                            setData(
                                                                "motor_color",
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        <option value="">Pilih Warna</option>
                                                        <option value="Merah">Merah</option>
                                                        <option value="Hitam">Hitam</option>
                                                        <option value="Putih">Putih</option>
                                                        <option value="Biru">Biru</option>
                                                        <option value="Silver/Abu-abu">Silver/Abu-abu</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="delivery_method">
                                                    Metode Penyerahan
                                                </Label>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData("delivery_method", "Ambil di Dealer")}
                                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${data.delivery_method === "Ambil di Dealer" ? "border-blue-600 bg-blue-50 text-blue-700 font-bold" : "border-gray-100 text-gray-500 hover:border-blue-200"}`}
                                                    >
                                                        <Store className="w-5 h-5" />
                                                        Ambil
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData("delivery_method", "Kirim ke Rumah")}
                                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${data.delivery_method === "Kirim ke Rumah" ? "border-blue-600 bg-blue-50 text-blue-700 font-bold" : "border-gray-100 text-gray-500 hover:border-blue-200"}`}
                                                    >
                                                        <Truck className="w-5 h-5" />
                                                        Kirim
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="customer_address">
                                                Alamat Lengkap
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                                <textarea
                                                    id="customer_address"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 min-h-[100px]"
                                                    placeholder="Alamat pengiriman unit..."
                                                    required
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        setData(
                                                            "address",
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            {errors.address && (
                                                <ErrorMessage>
                                                    {errors.address}
                                                </ErrorMessage>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="booking_fee">
                                                Booking Fee (Opsional)
                                            </Label>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="booking_fee"
                                                        type="text"
                                                        className={`w-full bg-white border-2 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900 ${
                                                            parseFloat(
                                                                data.booking_fee,
                                                            ) > 0 &&
                                                            parseFloat(
                                                                data.booking_fee,
                                                            ) < motor.price
                                                                ? "border-green-500"
                                                                : "border-gray-200 focus:border-blue-500"
                                                        }`}
                                                        placeholder="Masukkan booking fee (cicilan pertama atau jaminan)"
                                                        value={formatNumberDisplay(
                                                            data.booking_fee,
                                                        )}
                                                        onChange={(e) =>
                                                            handleBookingFeeChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Booking Fee Info */}
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-2">
                                                        Maximum:{" "}
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                            {
                                                                style: "currency",
                                                                currency: "IDR",
                                                                minimumFractionDigits: 0,
                                                            },
                                                        ).format(
                                                            motor.price - 1,
                                                        )}{" "}
                                                        (kurang dari harga unit)
                                                    </p>

                                                    {data.booking_fee &&
                                                        parseFloat(
                                                            data.booking_fee,
                                                        ) > 0 && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -5,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className={`p-3 rounded-lg border ${
                                                                    parseFloat(
                                                                        data.booking_fee,
                                                                    ) <
                                                                    motor.price
                                                                        ? "bg-green-50 border-green-200"
                                                                        : "bg-red-50 border-red-200"
                                                                }`}
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span
                                                                            className={`text-xs font-bold uppercase tracking-wider ${
                                                                                parseFloat(
                                                                                    data.booking_fee,
                                                                                ) <
                                                                                motor.price
                                                                                    ? "text-green-700"
                                                                                    : "text-red-700"
                                                                            }`}
                                                                        >
                                                                            Sisa
                                                                            Pembayaran
                                                                        </span>
                                                                        <span className="text-sm font-black text-gray-900">
                                                                            {new Intl.NumberFormat(
                                                                                "id-ID",
                                                                                {
                                                                                    style: "currency",
                                                                                    currency:
                                                                                        "IDR",
                                                                                    minimumFractionDigits: 0,
                                                                                },
                                                                            ).format(
                                                                                Math.max(
                                                                                    0,
                                                                                    motor.price -
                                                                                        parseFloat(
                                                                                            data.booking_fee,
                                                                                        ),
                                                                                ),
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {parseFloat(
                                                                        data.booking_fee,
                                                                    ) >=
                                                                        motor.price && (
                                                                        <p className="text-xs text-red-700 font-medium">
                                                                            ❌
                                                                            Booking
                                                                            fee
                                                                            tidak
                                                                            boleh
                                                                            ≥
                                                                            harga
                                                                            unit
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                </div>

                                                {errors.booking_fee && (
                                                    <ErrorMessage>
                                                        {errors.booking_fee}
                                                    </ErrorMessage>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label>Metode Pembayaran</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <label
                                                    className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${data.payment_method === "Transfer Bank" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-blue-200"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        className="sr-only"
                                                        value="Transfer Bank"
                                                        onChange={(e) =>
                                                            setData(
                                                                "payment_method",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-blue-600 border border-gray-100">
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-gray-900">
                                                            Transfer Bank
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Virtual Account / TF
                                                            Otomatis
                                                        </p>
                                                    </div>
                                                    {data.payment_method ===
                                                        "Transfer Bank" && (
                                                        <CheckCircle className="w-5 h-5 text-blue-600 ml-2" />
                                                    )}
                                                </label>

                                                <label
                                                    className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${data.payment_method === "Tunai di Toko" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-blue-200"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        className="sr-only"
                                                        value="Tunai di Toko"
                                                        onChange={(e) =>
                                                            setData(
                                                                "payment_method",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-blue-600 border border-gray-100">
                                                        <Wallet className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-gray-900">
                                                            Bayar di Tempat
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Cek unit lalu bayar
                                                            langsung
                                                        </p>
                                                    </div>
                                                    {data.payment_method ===
                                                        "Tunai di Toko" && (
                                                        <CheckCircle className="w-5 h-5 text-blue-600 ml-2" />
                                                    )}
                                                </label>
                                            </div>
                                            {errors.payment_method && (
                                                <ErrorMessage>
                                                    {errors.payment_method}
                                                </ErrorMessage>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">
                                                Catatan Tambahan (Opsional)
                                            </Label>
                                            <textarea
                                                id="notes"
                                                rows="4"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 resize-none"
                                                placeholder="Berikan info tambahan jika diperlukan..."
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        "notes",
                                                        e.target.value,
                                                    )
                                                }
                                            ></textarea>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100">
                                            <Button
                                                type="submit"
                                                fullWidth
                                                size="lg"
                                                disabled={processing}
                                                className="h-14 text-lg shadow-lg shadow-blue-200"
                                            >
                                                {processing
                                                    ? "Memproses..."
                                                    : "Ajukan Order Sekarang"}
                                            </Button>
                                            <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />{" "}
                                                Transaksi Terenkripsi & Aman
                                            </p>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>

                        {/* RIGHT: UNIT RECAP */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm sticky top-28 overflow-hidden">
                                <CardBody className="p-0">
                                    <div className="h-48 bg-gray-200 relative">
                                        <img
                                            src={
                                                motor.image_path
                                                    ? `/storage/${motor.image_path}`
                                                    : "/images/placeholder-motor.jpg"
                                            }
                                            alt={motor.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                                                {motor.brand}
                                            </p>
                                            <h3 className="text-white text-xl font-black">
                                                {motor.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium">
                                                Harga Unit
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(motor.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium">
                                                Tipe
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {motor.type}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium">
                                                Tahun
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {motor.year}
                                            </span>
                                        </div>
                                        <div className="pt-4 mt-2">
                                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-100">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <p className="text-xs leading-relaxed text-blue-800 font-medium">
                                                    Order ini bersifat{" "}
                                                    <span className="font-bold">
                                                        booking unit
                                                    </span>
                                                    . Admin kami akan
                                                    menghubungi Anda via
                                                    WhatsApp setelah formulir
                                                    dikirim.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
