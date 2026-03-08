import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Input, { Label, ErrorMessage } from "@/Components/UI/Input";
import {
    User,
    Phone,
    Briefcase,
    FileText,
    Calendar,
    ArrowLeft,
    Send,
    Percent,
    Clock,
    AlertTriangle,
    Info,
    Wallet,
    MessageSquare,
    Zap,
    ChevronLeft,
    CreditCard,
    ShieldCheck,
    Coins,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CreditOrderForm({ motor, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: "",
        customer_phone: "",
        customer_occupation: "",
        down_payment: "",
        tenor: "",
        payment_method: "Transfer Bank",
        notes: "",
    });

    const [calculatedInstallment, setCalculatedInstallment] = useState(0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        const dp = parseFloat(data.down_payment) || 0;
        const tenor = parseInt(data.tenor) || 0;

        if (tenor > 0) {
            const loanAmount = Math.max(0, motor.price - dp);
            // Simple calculation with 2% interest per month for simulation
            const interest = 0.02 * tenor;
            const totalLoan = loanAmount * (1 + interest);
            const monthly = totalLoan / tenor;
            setCalculatedInstallment(Math.round(monthly));
        } else {
            setCalculatedInstallment(0);
        }
    }, [data.down_payment, data.tenor, motor.price]);

    const submit = (e) => {
        e.preventDefault();
        post(route("motors.process-credit-order", motor.id));
    };

    return (
        <PublicLayout auth={auth} title={`Pengajuan Kredit - ${motor.name}`}>
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
                                            Simulasi & Pengajuan Kredit
                                        </h1>
                                        <p className="text-blue-100 font-medium">
                                            Lengkapi data untuk mendapatkan
                                            simulasi cicilan motor impian Anda.
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="down_payment">
                                                    Uang Muka (DP)
                                                </Label>
                                                <div className="relative">
                                                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="down_payment"
                                                        type="number"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="Contoh: 5000000"
                                                        value={
                                                            data.down_payment
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "down_payment",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.down_payment && (
                                                    <ErrorMessage
                                                        message={
                                                            errors.down_payment
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="tenor">
                                                    Tenor (Bulan)
                                                </Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <select
                                                        id="tenor"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-900 appearance-none"
                                                        value={data.tenor}
                                                        onChange={(e) =>
                                                            setData(
                                                                "tenor",
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Pilih Tenor
                                                        </option>
                                                        <option value="12">
                                                            12 Bulan (1 Tahun)
                                                        </option>
                                                        <option value="24">
                                                            24 Bulan (2 Tahun)
                                                        </option>
                                                        <option value="36">
                                                            36 Bulan (3 Tahun)
                                                        </option>
                                                        <option value="48">
                                                            48 Bulan (4 Tahun)
                                                        </option>
                                                    </select>
                                                </div>
                                                {errors.tenor && (
                                                    <ErrorMessage
                                                        message={errors.tenor}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {calculatedInstallment > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">
                                                        Estimasi Cicilan
                                                    </p>
                                                    <h4 className="text-2xl font-black text-blue-900">
                                                        {formatCurrency(
                                                            calculatedInstallment,
                                                        )}{" "}
                                                        <span className="text-sm font-bold text-blue-400">
                                                            / Bulan
                                                        </span>
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-blue-400">
                                                        Tenor
                                                    </p>
                                                    <p className="text-lg font-black text-blue-900">
                                                        {data.tenor}x
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">
                                                Catatan Tambahan (Opsional)
                                            </Label>
                                            <textarea
                                                id="notes"
                                                rows="4"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 resize-none"
                                                placeholder="Contoh: Pekerjaan, domisili, atau permintaan simulasi lainnya..."
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
                                                    : "Ajukan Simulasi Kredit"}
                                            </Button>
                                            <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />{" "}
                                                Pengajuan Cepat & Syarat Mudah
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
                                                Harga OTR
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(motor.price)}
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
                                            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 flex items-start gap-3">
                                                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-yellow-100">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <p className="text-xs leading-relaxed text-yellow-800 font-medium">
                                                    Simulasi ini bersifat
                                                    estimasi. Leasing resmi yang
                                                    bekerja sama dengan{" "}
                                                    <span className="font-bold text-yellow-900">
                                                        SRB Motors
                                                    </span>{" "}
                                                    akan memberikan hitungan
                                                    final sesuai profil Anda.
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
