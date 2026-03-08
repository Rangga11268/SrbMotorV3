import React from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

export default function CashOrderForm({ motor, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: "",
        customer_phone: "",
        customer_occupation: "",
        notes: "",
        booking_fee: 0,
        payment_method: "",
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const submit = (e) => {
        e.preventDefault();
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
                                                        value={
                                                            data.customer_name
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "customer_name",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.customer_name && (
                                                    <ErrorMessage
                                                        message={
                                                            errors.customer_name
                                                        }
                                                    />
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
                                                        value={
                                                            data.customer_phone
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "customer_phone",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.customer_phone && (
                                                    <ErrorMessage
                                                        message={
                                                            errors.customer_phone
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="customer_occupation">
                                                Pekerjaan
                                            </Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    id="customer_occupation"
                                                    type="text"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                    placeholder="Contoh: Karyawan Swasta"
                                                    value={
                                                        data.customer_occupation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "customer_occupation",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {errors.customer_occupation && (
                                                <ErrorMessage
                                                    message={
                                                        errors.customer_occupation
                                                    }
                                                />
                                            )}
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
                                                <ErrorMessage
                                                    message={
                                                        errors.payment_method
                                                    }
                                                />
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
