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
    MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CreditOrderForm({ motor, auth, leasingProviders }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        nik: "",
        phone: "",
        occupation: "",
        monthly_income: "",
        employment_duration: "",
        address: "",
        dp_amount: "",
        tenor: "12",
        payment_method: "Transfer Bank",
        leasing_provider_id: "",
        notes: "",
    });

    const [calculatedInstallment, setCalculatedInstallment] = useState(0);
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

    const handleDownPaymentChange = (value) => {
        const cleaned = parseFormattedNumber(value);
        setData("dp_amount", cleaned);
    };

    useEffect(() => {
        const dp = parseFloat(data.dp_amount) || 0;
        const tenor = parseInt(data.tenor) || 0;

        if (tenor > 0) {
            const loanAmount = Math.max(0, motor.price - dp);
            const interestRate = 0.015; // 1.5% flat/bulan
            const totalInterest = loanAmount * interestRate * tenor;
            const monthly = (loanAmount + totalInterest) / tenor;
            setCalculatedInstallment(Math.round(monthly));
        } else {
            setCalculatedInstallment(0);
        }
    }, [data.dp_amount, data.tenor, motor.price]);

    const submit = (e) => {
        e.preventDefault();

        // Validation check
        const minDP = parseFloat(motor.min_dp_amount || motor.price * 0.2);
        const validationErrors = [];

        if (!data.name.trim()) {
            validationErrors.push("Nama lengkap harus diisi");
        }
        if (!data.nik.trim()) {
            validationErrors.push("NIK harus diisi");
        }
        if (data.nik && data.nik.replace(/\D/g, "").length !== 16) {
            validationErrors.push("NIK harus 16 digit");
        }
        if (!data.phone.trim()) {
            validationErrors.push("Nomor WhatsApp harus diisi");
        }
        if (!data.occupation.trim()) {
            validationErrors.push("Pekerjaan harus diisi");
        }
        if (!data.monthly_income) {
            validationErrors.push("Penghasilan bulanan harus diisi");
        }
        if (!data.employment_duration.trim()) {
            validationErrors.push("Lama bekerja harus diisi");
        }
        if (!data.address.trim()) {
            validationErrors.push("Alamat lengkap harus diisi");
        }
        if (!data.dp_amount || parseFloat(data.dp_amount) < minDP) {
            validationErrors.push(
                `DP minimum ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(minDP)}`,
            );
        }
        if (!data.tenor) {
            validationErrors.push("Tenor harus dipilih");
        }

        if (validationErrors.length > 0) {
            setHasValidationErrors(validationErrors);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setHasValidationErrors(false);
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
                                            Pengajuan Kredit
                                        </h1>
                                        <p className="text-blue-100 font-medium">
                                            Lengkapi data di bawah untuk
                                            mengajukan pembelian motor secara
                                            kredit.
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
                                                    <ErrorMessage
                                                        message={errors.name}
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
                                                    NIK (16 Digit)
                                                </Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_nik"
                                                        type="text"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="Contoh: 1234567890123456"
                                                        maxLength="16"
                                                        required
                                                        value={data.nik}
                                                        onChange={(e) =>
                                                            setData(
                                                                "nik",
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    "",
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.nik && (
                                                    <ErrorMessage
                                                        message={errors.nik}
                                                    />
                                                )}
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
                                                        placeholder="Contoh: Karyawan Swasta, Wiraswasta"
                                                        required
                                                        value={data.occupation}
                                                        onChange={(e) =>
                                                            setData(
                                                                "occupation",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.occupation && (
                                                    <ErrorMessage
                                                        message={
                                                            errors.occupation
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_monthly_income">
                                                    Penghasilan Bulanan
                                                </Label>
                                                <div className="relative">
                                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_monthly_income"
                                                        type="number"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="Contoh: 5000000"
                                                        required
                                                        min="0"
                                                        value={
                                                            data.monthly_income
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "monthly_income",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.monthly_income && (
                                                    <ErrorMessage
                                                        message={
                                                            errors.monthly_income
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="customer_employment_duration">
                                                    Lama Bekerja
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_employment_duration"
                                                        type="text"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="Contoh: 3 tahun 6 bulan"
                                                        required
                                                        value={
                                                            data.employment_duration
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "employment_duration",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.employment_duration && (
                                                    <ErrorMessage
                                                        message={
                                                            errors.employment_duration
                                                        }
                                                    />
                                                )}
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="down_payment">
                                                    Uang Muka (DP) - Minimum Rp {parseInt(motor.min_dp_amount || motor.price * 0.2).toLocaleString('id-ID')}
                                                </Label>
                                                <div className="space-y-3">
                                                    <div className="relative">
                                                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="down_payment"
                                                            type="text"
                                                            className={`w-full bg-white border-2 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900 ${
                                                                parseFloat(
                                                                    data.dp_amount,
                                                                ) >=
                                                                    parseFloat(motor.min_dp_amount || motor.price * 0.2) &&
                                                                data.dp_amount
                                                                    ? "border-green-500"
                                                                    : "border-gray-200 focus:border-blue-500"
                                                            }`}
                                                            placeholder="Masukkan jumlah uang muka"
                                                            required
                                                            value={formatNumberDisplay(
                                                                data.dp_amount,
                                                            )}
                                                            onChange={(e) =>
                                                                handleDownPaymentChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {/* DP Minimum Info */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                                                                Min. DP
                                                            </p>
                                                            <p className="text-sm font-black text-blue-900">
                                                                {new Intl.NumberFormat(
                                                                    "id-ID",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "IDR",
                                                                        minimumFractionDigits: 0,
                                                                    },
                                                                ).format(
                                                                    motor.min_dp_amount || motor.price * 0.2,
                                                                )}
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    "dp_amount",
                                                                    Math.round(
                                                                        motor.min_dp_amount || motor.price * 0.2,
                                                                    ),
                                                                )
                                                            }
                                                            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 hover:text-white transition-colors font-bold text-sm flex items-center justify-center gap-2 h-auto"
                                                        >
                                                            <Zap className="w-4 h-4" />
                                                            Gunakan Min
                                                        </button>
                                                    </div>

                                                    {/* Dynamic Loan Info */}
                                                    {data.dp_amount &&
                                                        parseFloat(
                                                            data.dp_amount,
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
                                                                        data.dp_amount,
                                                                    ) >=
                                                                    parseFloat(motor.min_dp_amount || motor.price * 0.2)
                                                                        ? "bg-green-50 border-green-200"
                                                                        : "bg-yellow-50 border-yellow-200"
                                                                }`}
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span
                                                                            className={`text-xs font-bold uppercase tracking-wider ${
                                                                                parseFloat(
                                                                                    data.dp_amount,
                                                                                ) >=
                                                                                parseFloat(motor.min_dp_amount || motor.price * 0.2)
                                                                                    ? "text-green-700"
                                                                                    : "text-yellow-700"
                                                                            }`}
                                                                        >
                                                                            Sisa
                                                                            Angsuran
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
                                                                                            data.dp_amount,
                                                                                        ),
                                                                                ),
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {parseFloat(
                                                                        data.dp_amount,
                                                                    ) <
                                                                        parseFloat(motor.min_dp_amount || motor.price * 0.2) && (
                                                                        <p className="text-xs text-yellow-700 font-medium">
                                                                            ⚠️
                                                                            Masih
                                                                            perlu{" "}
                                                                            {new Intl.NumberFormat(
                                                                                "id-ID",
                                                                                {
                                                                                    style: "currency",
                                                                                    currency:
                                                                                        "IDR",
                                                                                    minimumFractionDigits: 0,
                                                                                },
                                                                            ).format(
                                                                                (motor.min_dp_amount || motor.price * 0.2) -
                                                                                    parseFloat(
                                                                                        data.dp_amount,
                                                                                    ),
                                                                            )}{" "}
                                                                            lagi
                                                                        </p>
                                                                    )}
                                                                    {parseFloat(
                                                                        data.dp_amount,
                                                                    ) >=
                                                                        parseFloat(motor.min_dp_amount || motor.price * 0.2) && (
                                                                        <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                                                                            DP
                                                                            sudah
                                                                            mencukupi
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                    {errors.dp_amount && (
                                                        <ErrorMessage
                                                            message={
                                                                errors.dp_amount
                                                            }
                                                        />
                                                    )}
                                                </div>
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
                                                        required
                                                        value={data.tenor}
                                                        onChange={(e) =>
                                                            setData(
                                                                "tenor",
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
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
                                                        <option value="60">
                                                            60 Bulan (5 Tahun)
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
                                            <Label htmlFor="payment_method">
                                                Metode Pembayaran
                                            </Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    id="payment_method"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-900 appearance-none"
                                                    required
                                                    value={data.payment_method}
                                                    onChange={(e) =>
                                                        setData(
                                                            "payment_method",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="Transfer Bank">
                                                        Transfer Bank (BCA,
                                                        Mandiri, BNI)
                                                    </option>
                                                    <option value="E-Wallet">
                                                        E-Wallet (OVO, GoPay,
                                                        Dana)
                                                    </option>
                                                    <option value="Virtual Account">
                                                        Virtual Account
                                                    </option>
                                                </select>
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
                                            <Label htmlFor="leasing_provider_id">
                                                Pilihan Perusahaan Pembiayaan
                                                (Opsional)
                                            </Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    id="leasing_provider_id"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-900 appearance-none"
                                                    value={
                                                        data.leasing_provider_id
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "leasing_provider_id",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Tidak pilih (Admin akan
                                                        rekomendasikan)
                                                    </option>
                                                    {leasingProviders &&
                                                        leasingProviders.map(
                                                            (provider) => (
                                                                <option
                                                                    key={
                                                                        provider.id
                                                                    }
                                                                    value={
                                                                        provider.id
                                                                    }
                                                                >
                                                                    {
                                                                        provider.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                </select>
                                            </div>
                                            {errors.leasing_provider_id && (
                                                <ErrorMessage
                                                    message={
                                                        errors.leasing_provider_id
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
                                                placeholder="Contoh: keterangan tambahan atau pertanyaan untuk admin..."
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
                                                    : "Ajukan Kredit"}
                                            </Button>
                                            <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                                                <ShieldCheck className="w-4 h-4 text-blue-500" />{" "}
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
                                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <p className="text-xs leading-relaxed text-blue-800 font-medium">
                                                    Estimasi cicilan bersifat
                                                    indikatif (bunga 1.5%/bulan
                                                    flat). Leasing resmi yang
                                                    bekerja sama dengan{" "}
                                                    <span className="font-bold text-blue-900">
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
