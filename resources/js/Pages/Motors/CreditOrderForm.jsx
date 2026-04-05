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
    ChevronLeft,
    CreditCard,
    ShieldCheck,
    Coins,
    MapPin,
    Palette,
    Store,
    Truck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CreditOrderForm({ motor, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: auth.user?.name || "",
        nik: auth.user?.nik || "",
        phone: auth.user?.phone || "",
        occupation: auth.user?.occupation || "",
        monthly_income: auth.user?.monthly_income || "",
        employment_duration: auth.user?.employment_duration || "",
        address: auth.user?.alamat || "",
        dp_amount: "",
        tenor: "12",
        payment_method: "Transfer Bank",
        motor_color: motor.colors && motor.colors.length > 0 ? "" : "Beragam",
        delivery_method: "Kirim ke Rumah",
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

    const handleMonthlyIncomeChange = (value) => {
        const cleaned = parseFormattedNumber(value);
        setData("monthly_income", cleaned);
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
            <div className="flex-grow pt-[140px] pb-20">
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
                            <Card className="border border-gray-200 rounded-none overflow-hidden">
                                <div className="bg-black p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
                                            PENGAJUAN <span className="text-[#1c69d4]">KREDIT</span>
                                        </h1>
                                        <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                            Lengkapi data di bawah untuk mengajukan pembelian motor secara kredit.
                                        </p>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
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
                                                <Label htmlFor="customer_name" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Nama Lengkap
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_name"
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900"
                                                        placeholder="SESUAI KTP"
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
                                                <Label htmlFor="customer_phone" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Nomor WhatsApp
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_phone"
                                                        type="tel"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900"
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
                                                <Label htmlFor="customer_nik" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    NIK (16 Digit)
                                                </Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_nik"
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900 uppercase"
                                                        placeholder="16 DIGIT NIK"
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
                                                <Label htmlFor="customer_occupation" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Pekerjaan
                                                </Label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_occupation"
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900"
                                                        placeholder="KARYAWAN SWASTA/WNS"
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
                                                <Label htmlFor="customer_monthly_income" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Penghasilan Bulanan
                                                </Label>
                                                <div className="relative">
                                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_monthly_income"
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900"
                                                        placeholder="NOMINAL PENGHASILAN"
                                                        required
                                                        value={formatNumberDisplay(
                                                            data.monthly_income,
                                                        )}
                                                        onChange={(e) =>
                                                            handleMonthlyIncomeChange(
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
                                                <Label htmlFor="customer_employment_duration" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Lama Bekerja
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_employment_duration"
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900"
                                                        placeholder="DURASI KERJA"
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
                                            <Label htmlFor="customer_address" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Alamat Lengkap
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                                <textarea
                                                    id="customer_address"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900 uppercase min-h-[100px]"
                                                    placeholder="ALAMAT LENGKAP PENGIRIMAN..."
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
                                                <Label htmlFor="down_payment" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Uang Muka (DP) - Minimum Rp{" "}
                                                    {parseInt(
                                                        motor.min_dp_amount ||
                                                            motor.price * 0.2,
                                                    ).toLocaleString("id-ID")}
                                                </Label>
                                                <div className="space-y-3">
                                                    <div className="relative">
                                                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="down_payment"
                                                            type="text"
                                                            className={`w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black transition-all font-black text-lg text-gray-900 ${
                                                                parseFloat(
                                                                    data.dp_amount,
                                                                ) >=
                                                                    parseFloat(
                                                                        motor.min_dp_amount ||
                                                                            motor.price *
                                                                                0.2,
                                                                    ) &&
                                                                data.dp_amount
                                                                    ? "border-black bg-white"
                                                                    : "border-gray-200 focus:border-black"
                                                            }`}
                                                            placeholder="NOMINAL DP"
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
                                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-none">
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                                                                MIN. DP
                                                            </p>
                                                            <p className="text-sm font-black text-black">
                                                                {new Intl.NumberFormat(
                                                                    "id-ID",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "IDR",
                                                                        minimumFractionDigits: 0,
                                                                    },
                                                                ).format(
                                                                    motor.min_dp_amount ||
                                                                        motor.price *
                                                                            0.2,
                                                                )}
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    "dp_amount",
                                                                    Math.round(
                                                                        motor.min_dp_amount ||
                                                                            motor.price *
                                                                                0.2,
                                                                    ),
                                                                )
                                                            }
                                                            className="p-3 bg-black text-white hover:bg-gray-900 transition-colors font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 h-auto rounded-none border border-black"
                                                        >
                                                            <Wallet className="w-4 h-4" />
                                                            GUNAKAN MIN DP
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
                                                                className={`p-4 rounded-none border ${
                                                                    parseFloat(
                                                                        data.dp_amount,
                                                                    ) >=
                                                                    parseFloat(
                                                                        motor.min_dp_amount ||
                                                                            motor.price *
                                                                                0.2,
                                                                    )
                                                                        ? "bg-white border-black"
                                                                        : "bg-red-50 border-red-200"
                                                                }`}
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span
                                                                            className={`text-[10px] font-bold uppercase tracking-widest ${
                                                                                parseFloat(
                                                                                    data.dp_amount,
                                                                                ) >=
                                                                                parseFloat(
                                                                                    motor.min_dp_amount ||
                                                                                        motor.price *
                                                                                            0.2,
                                                                                )
                                                                                    ? "text-gray-500"
                                                                                    : "text-red-700"
                                                                            }`}
                                                                        >
                                                                            SISA ANGSURAN POKOK
                                                                        </span>
                                                                        <span className="text-sm font-black text-black">
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
                                                                        parseFloat(
                                                                            motor.min_dp_amount ||
                                                                                motor.price *
                                                                                    0.2,
                                                                        ) && (
                                                                        <p className="text-[10px] uppercase font-bold text-red-700 tracking-widest">
                                                                            DP KURANG{" "}
                                                                            {new Intl.NumberFormat(
                                                                                "id-ID",
                                                                                {
                                                                                    style: "currency",
                                                                                    currency:
                                                                                        "IDR",
                                                                                    minimumFractionDigits: 0,
                                                                                },
                                                                            ).format(
                                                                                (motor.min_dp_amount ||
                                                                                    motor.price *
                                                                                        0.2) -
                                                                                    parseFloat(
                                                                                        data.dp_amount,
                                                                                    ),
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                    {parseFloat(
                                                                        data.dp_amount,
                                                                    ) >=
                                                                        parseFloat(
                                                                            motor.min_dp_amount ||
                                                                                motor.price *
                                                                                    0.2,
                                                                        ) && (
                                                                        <p className="text-[10px] text-black font-bold uppercase tracking-widest flex items-center gap-1.5 pt-2 border-t border-gray-100">
                                                                            DP MEMENUHI SYARAT
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
                                                <Label htmlFor="tenor" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Tenor (Bulan)
                                                </Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <select
                                                        id="tenor"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900 appearance-none"
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
                                                            12 BULAN (1 TAHUN)
                                                        </option>
                                                        <option value="24">
                                                            24 BULAN (2 TAHUN)
                                                        </option>
                                                        <option value="36">
                                                            36 BULAN (3 TAHUN)
                                                        </option>
                                                        <option value="48">
                                                            48 BULAN (4 TAHUN)
                                                        </option>
                                                        <option value="60">
                                                            60 BULAN (5 TAHUN)
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
                                                className="p-6 bg-white border border-gray-200 rounded-none flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                                        ESTIMASI CICILAN
                                                    </p>
                                                    <h4 className="text-2xl font-black text-black">
                                                        {formatCurrency(
                                                            calculatedInstallment,
                                                        )}{" "}
                                                        <span className="text-sm font-bold text-gray-400">
                                                            / BLN
                                                        </span>
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                        TENOR
                                                    </p>
                                                    <p className="text-lg font-black text-black">
                                                        {data.tenor}X
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metode Penyerahan Unit</Label>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "delivery_method",
                                                            "Ambil di Dealer",
                                                        )
                                                    }
                                                    className={`flex-1 flex items-center justify-center gap-2 p-3.5 border rounded-none uppercase text-[10px] font-bold tracking-widest transition-all ${data.delivery_method === "Ambil di Dealer" ? "border-black bg-black text-white" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-black hover:text-black"}`}
                                                >
                                                    <Store className="w-5 h-5" />
                                                    AMBIL DI DEALER
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "delivery_method",
                                                            "Kirim ke Rumah",
                                                        )
                                                    }
                                                    className={`flex-1 flex items-center justify-center gap-2 p-3.5 border rounded-none uppercase text-[10px] font-bold tracking-widest transition-all ${data.delivery_method === "Kirim ke Rumah" ? "border-black bg-black text-white" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-black hover:text-black"}`}
                                                >
                                                    <Truck className="w-5 h-5" />
                                                    KIRIM KE RUMAH
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="motor_color" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Pilihan Warna
                                            </Label>
                                            <div className="relative">
                                                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    id="motor_color"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900 appearance-none"
                                                    required
                                                    value={data.motor_color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "motor_color",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        PILIH WARNA
                                                    </option>
                                                    {motor.colors && motor.colors.length > 0 ? (
                                                        motor.colors.map((color, idx) => (
                                                            <option key={idx} value={color} className="uppercase">
                                                                {color}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="Beragam" className="uppercase">
                                                            BERAGAM / SESUAI STOK
                                                        </option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="payment_method" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Metode Pembayaran DP
                                            </Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    id="payment_method"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900 appearance-none"
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
                                                        TRANSFER BANK (BCA, MANDIRI, BNI)
                                                    </option>
                                                    <option value="E-Wallet">
                                                        E-WALLET (OVO, GOPAY, DANA)
                                                    </option>
                                                    <option value="Virtual Account">
                                                        VIRTUAL ACCOUNT
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
                                            <Label htmlFor="notes" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Catatan Tambahan (Opsional)
                                            </Label>
                                            <textarea
                                                id="notes"
                                                rows="4"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900 resize-none"
                                                placeholder="TAMBAHKAN CATATAN BILA PERLU..."
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        "notes",
                                                        e.target.value,
                                                    )
                                                }
                                            ></textarea>
                                        </div>

                                        <div className="pt-6 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full py-4 bg-black text-white hover:bg-gray-900 border border-black font-black uppercase tracking-widest text-[11px] transition-colors rounded-none disabled:opacity-50"
                                            >
                                                {processing
                                                    ? "MEMPROSES..."
                                                    : "AJUKAN KREDIT SEKARANG"}
                                            </button>
                                            <p className="mt-4 text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                                                <ShieldCheck className="w-3 h-3 text-[#1c69d4]" />{" "}
                                                SISTEM AMAN & TERENKRIPSI
                                            </p>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>

                        {/* RIGHT: UNIT RECAP */}
                        <div className="space-y-6">
                            <Card className="border border-gray-200 rounded-none sticky top-28 overflow-hidden bg-gray-50">
                                <CardBody className="p-0">
                                    <div className="h-56 bg-white relative border-b border-gray-200">
                                        <img
                                            src={
                                                motor.image_path
                                                    ? `/storage/${motor.image_path}`
                                                    : "/assets/img/no-image.webp"
                                            }
                                            alt={motor.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            UNIT TERPILIH
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <p className="text-[#1c69d4] text-[11px] font-bold uppercase tracking-widest mb-1">
                                                {motor.brand}
                                            </p>
                                            <h3 className="text-black text-2xl font-black uppercase tracking-tighter leading-none mb-4">
                                                {motor.name}
                                            </h3>
                                        </div>

                                        <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Harga OTR
                                            </span>
                                            <span className="font-black text-lg text-black">
                                                {formatCurrency(motor.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-t border-b border-gray-200">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Tahun
                                            </span>
                                            <span className="font-bold text-black">
                                                {motor.year}
                                            </span>
                                        </div>

                                        <div className="pt-4 mt-2">
                                            <div className="bg-white border border-gray-200 flex items-start gap-4 p-4">
                                                <div className="w-8 h-8 rounded-none bg-black flex items-center justify-center text-white shrink-0">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <p className="text-[11px] leading-relaxed text-gray-600 font-bold uppercase tracking-widest">
                                                    Estimasi cicilan di atas bersifat indikatif. Hitungan final yang mengikat akan diberikan oleh Leasing Resmi pada proses survei.
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
