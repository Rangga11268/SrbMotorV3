import React, { useState, useEffect } from "react";
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
    // Get branch from URL
    const urlParams = new URLSearchParams(window.location.search);
    const branchFromUrl = urlParams.get("branch");

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user?.name || "",
        email: auth.user?.email || "",
        phone: auth.user?.phone || "",
        nik: auth.user?.nik || "",
        address: auth.user?.alamat || "",
        motor_color: motor.colors && motor.colors.length > 0 ? "" : "Beragam",
        delivery_method: "Ambil di Dealer",
        notes: "",
        booking_fee: 0,
        payment_method: "Transfer Bank",
        branch_code: branchFromUrl || "",
    });

    const [branchInfo, setBranchInfo] = useState(null);
    const [loadingBranch, setLoadingBranch] = useState(!!branchFromUrl);
    const [branchOptions, setBranchOptions] = useState([]);
    const [detectedNearestBranch, setDetectedNearestBranch] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        // Fetch specific branch if from URL
        if (branchFromUrl) {
            fetch(`/api/branches/${branchFromUrl}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setBranchInfo(data.branch);
                    }
                })
                .catch((err) => console.error("Error fetching branch:", err))
                .finally(() => setLoadingBranch(false));
        }

        // Always fetch options for the dropdown
        fetch("/api/branches/options")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setBranchOptions(data.options);
                }
            })
            .catch((err) => console.error("Error fetching branch options:", err));

        // Detect nearest branch
        if (!branchFromUrl && "geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(`/api/branches/nearest?latitude=${latitude}&longitude=${longitude}`)
                        .then((res) => res.json())
                        .then((d) => {
                            if (d.success) {
                                setDetectedNearestBranch(d.branch);
                                // Auto-select if nothing selected yet
                                if (!data.branch_code) {
                                    handleBranchChange(d.branch.code);
                                }
                            }
                        })
                        .catch((err) => console.error("Error finding nearest branch:", err))
                        .finally(() => setIsLocating(false));
                },
                () => setIsLocating(false),
                { timeout: 10000 }
            );
        }
    }, [branchFromUrl]);

    const handleBranchChange = (code) => {
        setData("branch_code", code);
        if (code) {
            setLoadingBranch(true);
            fetch(`/api/branches/${code}`)
                .then((res) => res.json())
                .then((d) => {
                    if (d.success) setBranchInfo(d.branch);
                })
                .finally(() => setLoadingBranch(false));
        } else {
            setBranchInfo(null);
        }
    };

    const findNearestBranch = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(`/api/motors/${motor.id}/nearest-branches?latitude=${latitude}&longitude=${longitude}`)
                        .then((res) => res.json())
                        .then((d) => {
                            if (d.success && d.branches && d.branches.length > 0) {
                                const nearest = d.branches[0];
                                setDetectedNearestBranch(nearest);
                                if (!data.branch_code) {
                                    handleBranchChange(nearest.code);
                                }
                            } else {
                                alert("Cabang terdekat dengan stok tersedia tidak ditemukan. Silakan pilih cabang secara manual.");
                            }
                        })
                        .catch((err) => console.error("Error finding nearest branch:", err))
                        .finally(() => setIsLocating(false));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setIsLocating(false);
                    alert("Gagal mendapatkan lokasi. Pastikan izin lokasi sudah diberikan di browser Anda.");
                },
                { timeout: 10000 }
            );
        } else {
            alert("Browser Anda tidak mendukung fitur lokasi.");
        }
    };

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
                                            FORMULIR <span className="text-[#1c69d4]">PEMBELIAN TUNAI</span>
                                        </h1>
                                        <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                            Lengkapi data diri Anda untuk proses transaksi yang cepat dan aman.
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
                                                    <ErrorMessage>
                                                        {errors.name}
                                                    </ErrorMessage>
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
                                                    NIK (Sesuai KTP)
                                                </Label>
                                                <div className="relative">
                                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_nik"
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900 uppercase"
                                                        placeholder="16 DIGIT NIK"
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

                                            <div className="space-y-2">
                                                <Label htmlFor="customer_email" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Email (Opsional)
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="customer_email"
                                                        type="email"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900 lowercase"
                                                        placeholder="contoh@email.com"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                "email",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <ErrorMessage>
                                                        {errors.email}
                                                    </ErrorMessage>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                <Label htmlFor="delivery_method" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Metode Penyerahan
                                                </Label>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "delivery_method",
                                                                "Ambil di Dealer",
                                                            )
                                                        }
                                                        className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-none uppercase text-xs font-bold transition-all ${data.delivery_method === "Ambil di Dealer" ? "border-black bg-black text-white" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-black hover:text-black"}`}
                                                    >
                                                        <Store className="w-5 h-5" />
                                                        AMBIL DI TEMPAT
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "delivery_method",
                                                                "Kirim ke Rumah",
                                                            )
                                                        }
                                                        className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-none uppercase text-xs font-bold transition-all ${data.delivery_method === "Kirim ke Rumah" ? "border-black bg-black text-white" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-black hover:text-black"}`}
                                                    >
                                                        <Truck className="w-5 h-5" />
                                                        KIRIM KE RUMAH
                                                    </button>
                                                </div>
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
                                                    placeholder="ALAMAT PENGIRIMAN UNIT..."
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
                                            <Label htmlFor="booking_fee" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Booking Fee (Opsional)
                                            </Label>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        id="booking_fee"
                                                        type="text"
                                                        className={`w-full bg-gray-50 border border-gray-200 rounded-none px-10 py-3.5 focus:ring-1 focus:ring-black transition-all font-black text-lg text-gray-900 ${
                                                            parseFloat(
                                                                data.booking_fee,
                                                            ) > 0 &&
                                                            parseFloat(
                                                                data.booking_fee,
                                                            ) < motor.price
                                                                ? "border-black bg-white"
                                                                : "border-gray-200 focus:border-black"
                                                        }`}
                                                        placeholder="NOMINAL BOOKING FEE (OPSIONAL)"
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
                                            <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metode Pembayaran</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <label
                                                    className={`relative flex items-center p-4 border rounded-none cursor-pointer transition-all ${data.payment_method === "Transfer Bank" ? "border-black bg-black text-white" : "border-gray-200 bg-gray-50 hover:border-black"}`}
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
                                                    <div className={`w-8 h-8 rounded-none flex items-center justify-center mr-4 border ${data.payment_method === "Transfer Bank" ? "bg-white text-black border-white" : "bg-white text-gray-400 border-gray-200"}`}>
                                                        <CreditCard className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className={`font-black uppercase tracking-tight ${data.payment_method === "Transfer Bank" ? "text-white" : "text-gray-900"}`}>
                                                            TRANSFER BANK
                                                        </p>
                                                        <p className={`text-[10px] uppercase font-bold ${data.payment_method === "Transfer Bank" ? "text-gray-400" : "text-gray-500"}`}>
                                                            BCA / TF OTOMATIS
                                                        </p>
                                                    </div>
                                                </label>

                                                <label
                                                    className={`relative flex items-center p-4 border rounded-none cursor-pointer transition-all ${data.payment_method === "Tunai di Toko" ? "border-black bg-black text-white" : "border-gray-200 bg-gray-50 hover:border-black"}`}
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
                                                    <div className={`w-8 h-8 rounded-none flex items-center justify-center mr-4 border ${data.payment_method === "Tunai di Toko" ? "bg-white text-black border-white" : "bg-white text-gray-400 border-gray-200"}`}>
                                                        <Wallet className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className={`font-black uppercase tracking-tight ${data.payment_method === "Tunai di Toko" ? "text-white" : "text-gray-900"}`}>
                                                            BAYAR DI TEMPAT
                                                        </p>
                                                        <p className={`text-[10px] uppercase font-bold ${data.payment_method === "Tunai di Toko" ? "text-gray-400" : "text-gray-500"}`}>
                                                            CASH ON DELIVERY (COD)
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                            {errors.payment_method && (
                                                <ErrorMessage>
                                                    {errors.payment_method}
                                                </ErrorMessage>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Catatan Tambahan (Opsional)</Label>
                                            
                                            {/* Pickup Branch Selection/Display */}
                                            {branchInfo ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-5 border-2 border-black bg-white rounded-none relative group"
                                                >
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            setBranchInfo(null);
                                                            setData("branch_code", "");
                                                        }}
                                                        className="absolute top-2 right-2 text-[9px] font-bold text-blue-600 hover:text-red-600 transition-colors uppercase tracking-widest"
                                                    >
                                                        [ UBAH LOKASI ]
                                                    </button>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 bg-black flex items-center justify-center text-white shrink-0">
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-[0.2em] mb-1">
                                                                LOKASI PENGAMBILAN UNIT
                                                            </p>
                                                            <h4 className="text-sm font-black text-black uppercase tracking-tight mb-2">
                                                                {branchInfo.name}
                                                            </h4>
                                                            <div className="space-y-1">
                                                                <p className="text-[11px] font-bold text-gray-600 uppercase flex items-start gap-2">
                                                                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                                                    {branchInfo.address}
                                                                </p>
                                                                {branchInfo.phone && (
                                                                    <p className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-2">
                                                                        <Phone className="w-3 h-3 shrink-0" />
                                                                        {branchInfo.phone}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : branchFromUrl && loadingBranch ? (
                                                <div className="p-5 border border-gray-200 bg-gray-50 flex items-center justify-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin"></div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">MEMUAT DATA LOKASI...</p>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
                                                    <Label htmlFor="branch_code" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                                                        Pilih Cabang Pengambilan
                                                    </Label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <select
                                                            id="branch_code"
                                                            className="w-full bg-white border border-gray-200 rounded-none pl-10 pr-4 py-3 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold uppercase text-gray-900 appearance-none text-xs"
                                                            value={data.branch_code}
                                                            onChange={(e) => handleBranchChange(e.target.value)}
                                                            required
                                                        >
                                                            <option value="">-- PILIH CABANG TERDEKAT --</option>
                                                            {branchOptions.map((branch) => (
                                                                <option key={branch.code} value={branch.code}>{branch.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {detectedNearestBranch ? (
                                                        data.branch_code !== detectedNearestBranch.code && (
                                                            <motion.button
                                                                initial={{ opacity: 0, y: -5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                type="button"
                                                                onClick={() => handleBranchChange(detectedNearestBranch.code)}
                                                                className="flex items-center gap-2 text-[9px] font-black text-[#1c69d4] hover:text-black transition-colors uppercase tracking-widest pl-1 mt-2 group"
                                                            >
                                                                <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                                Gunakan Cabang Terdekat ({detectedNearestBranch.name})
                                                            </motion.button>
                                                        )
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={findNearestBranch}
                                                            disabled={isLocating}
                                                            className="flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-[#1c69d4] transition-colors uppercase tracking-widest pl-1 mt-2 disabled:opacity-50"
                                                        >
                                                            {isLocating ? (
                                                                <>
                                                                    <div className="w-2.5 h-2.5 border border-gray-400 border-t-transparent animate-spin rounded-full"></div>
                                                                    Mencari Lokasi...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    Cari Cabang Terdekat Saya
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        *Pilih cabang di mana Anda akan mengambil unit motor.
                                                    </p>
                                                </div>
                                            )}

                                            <textarea
                                                id="notes"
                                                rows="4"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 focus:ring-1 focus:ring-black focus:border-black transition-all font-bold text-gray-900 resize-none uppercase"
                                                placeholder="BILA ADA CATATAN.."
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
                                                    ? "MEMPROSES TRANSAKSI..."
                                                    : "AJUKAN ORDER SEKARANG"}
                                            </button>
                                            <p className="mt-4 text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                                                <ShieldCheck className="w-3 h-3 text-[#1c69d4]" />{" "}
                                                TRANSAKSI TERENKRIPSI & AMAN PADA SISTEM KAMI
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
                                                Harga Unit
                                            </span>
                                            <span className="font-black text-lg text-black">
                                                {formatCurrency(motor.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Tipe
                                            </span>
                                            <span className="font-bold uppercase text-black">
                                                {motor.type}
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
                                                    Order ini bersifat{" "}
                                                    <span className="text-black">
                                                        booking unit
                                                    </span>
                                                    . Representatif SRB Motor akan
                                                    menghubungi Anda.
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
