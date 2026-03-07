import PublicLayout from "@/Layouts/PublicLayout";
import {
    CheckCircle,
    Calendar,
    User,
    Phone,
    Briefcase,
    CreditCard,
    Info,
    FileText,
    Upload,
    Home,
    ArrowRight,
    Wallet,
    Lock,
    Copy,
    Download,
    Share2,
    ShieldCheck,
    Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

export default function OrderConfirmation({ transaction }) {
    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const { auth, config } = usePage().props;

    // Load Snap.js
    useEffect(() => {
        const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = config.midtrans_client_key;
        const script = document.createElement("script");
        script.src = snapUrl;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleOnlinePayment = async (installment) => {
        setIsLoadingPay(true);
        try {
            const response = await axios.post(
                route("installments.create-payment", installment.id),
            );
            const token = response.data.snap_token;

            window.snap.pay(token, {
                onSuccess: async function (result) {
                    try {
                        await axios.post(
                            route("installments.check-status", installment.id),
                        );
                    } catch (e) {
                        console.error("Manual status check failed", e);
                    }
                    Swal.fire({
                        title: "PAYMENT SUCCESSFUL",
                        text: "Pembayaran Booking Fee berhasil diterima.",
                        icon: "success",
                        background: "#09090b",
                        color: "#ffffff",
                        confirmButtonColor: "#84cc16",
                    });
                    router.reload();
                },
                onPending: async function (result) {
                    try {
                        await axios.post(
                            route("installments.check-status", installment.id),
                        );
                    } catch (e) {}
                    Swal.fire({
                        title: "PAYMENT PENDING",
                        text: "Menunggu pembayaran Anda.",
                        icon: "info",
                        background: "#09090b",
                        color: "#ffffff",
                        confirmButtonColor: "#3b82f6",
                    });
                    router.reload();
                },
                onError: function (result) {
                    Swal.fire({
                        title: "PAYMENT FAILED",
                        text: "Pembayaran gagal diproses.",
                        icon: "error",
                        background: "#09090b",
                        color: "#ffffff",
                        confirmButtonColor: "#ef4444",
                    });
                },
                onClose: function () {
                    // Customer closed the popup
                },
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "SYSTEM ERROR",
                text: "Gagal memproses pembayaran online.",
                icon: "error",
                background: "#09090b",
                color: "#ffffff",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setIsLoadingPay(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const isCredit = transaction.transaction_type === "CREDIT";

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    const ticketVariants = {
        hidden: { scale: 0.9, opacity: 0, rotateX: 10 },
        visible: {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
    };

    return (
        <PublicLayout auth={auth} title="Konfirmasi Pesanan">
            <div className="flex-grow pt-[104px] pb-24">
                <div className="min-h-screen bg-surface-dark text-white relative overflow-hidden pt-10">
                    {/* Background FX */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="max-w-4xl mx-auto"
                        >
                            {/* Status Header */}
                            <motion.div
                                variants={itemVariants}
                                className="text-center mb-12"
                            >
                                <div className="relative inline-block mb-6">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            delay: 0.3,
                                        }}
                                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] relative z-10"
                                    >
                                        <CheckCircle
                                            size={48}
                                            className="text-black"
                                            strokeWidth={3}
                                        />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                                </div>

                                <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter mb-4">
                                    PESANAN{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                        DIKONFIRMASI
                                    </span>
                                </h1>
                                <p className="text-lg text-white/60 font-sans max-w-xl mx-auto">
                                    Terima kasih! Pesanan Anda telah berhasil
                                    dibuat. Simpan bukti transaksi ini untuk
                                    keperluan administrasi.
                                </p>
                            </motion.div>

                            {/* Digital Ticket */}
                            <motion.div
                                variants={ticketVariants}
                                className="relative group perspective-1000"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                                <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                                    {/* Ticket Header: ID & Date */}
                                    <div className="bg-white/5 border-b border-white/5 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <ShieldCheck
                                                    className="text-green-400"
                                                    size={24}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs text-white/40 font-bold tracking-widest uppercase">
                                                    ID Transaksi
                                                </div>
                                                <div className="font-mono text-xl text-white font-bold tracking-wider">
                                                    {transaction.id}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs text-white/40 font-bold tracking-widest uppercase">
                                                    Tanggal
                                                </div>
                                                <div className="text-white font-bold">
                                                    {new Date(
                                                        transaction.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => window.print()}
                                                className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                                                title="Print/Save Receipt"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12">
                                        {/* Left: Motor Visual */}
                                        <div className="lg:col-span-5 relative bg-gradient-to-b from-white/5 to-transparent p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white/60 uppercase tracking-wider bg-black/20 backdrop-blur-md">
                                                    Unit Terpilih
                                                </span>
                                            </div>

                                            <motion.img
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                src={`/storage/${transaction.motor.image_path}`}
                                                alt={transaction.motor.name}
                                                className="w-full max-w-[280px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-6 hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="text-center w-full">
                                                <h3 className="text-2xl font-display font-bold text-white mb-1">
                                                    {transaction.motor.name}
                                                </h3>
                                                <div className="text-white/40 text-sm mb-4">
                                                    {transaction.motor.type} •{" "}
                                                    {transaction.motor.year}
                                                </div>

                                                <div className="inline-block px-6 py-2 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
                                                        Total Harga
                                                    </div>
                                                    <div className="text-xl font-bold text-accent">
                                                        {formatCurrency(
                                                            transaction.motor
                                                                .price,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Details & Actions */}
                                        <div className="lg:col-span-7 p-8">
                                            <div className="space-y-8">
                                                {/* Customer Info */}
                                                <div>
                                                    <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <User size={14} />{" "}
                                                        Detail Pelanggan
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InfoBox
                                                            label="Nama Lengkap"
                                                            value={
                                                                transaction.customer_name
                                                            }
                                                        />
                                                        <InfoBox
                                                            label="No. Telepon"
                                                            value={
                                                                transaction.customer_phone
                                                            }
                                                        />
                                                        <InfoBox
                                                            label="Pekerjaan"
                                                            value={
                                                                transaction.customer_occupation
                                                            }
                                                        />
                                                        <InfoBox
                                                            label="Metode Pembayaran"
                                                            value={
                                                                isCredit
                                                                    ? "Kredit (Leasing)"
                                                                    : "Cash (Tunai)"
                                                            }
                                                            highlight={true}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Credit Spec (If Credit) */}
                                                {isCredit &&
                                                    transaction.credit_detail && (
                                                        <div className="pt-6 border-t border-white/5 animate-pulse-once">
                                                            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                <CreditCard
                                                                    size={14}
                                                                />{" "}
                                                                Simulasi Kredit
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <InfoBox
                                                                    label="Uang Muka"
                                                                    value={formatCurrency(
                                                                        transaction
                                                                            .credit_detail
                                                                            .down_payment,
                                                                    )}
                                                                />
                                                                <InfoBox
                                                                    label="Tenor"
                                                                    value={`${transaction.credit_detail.tenor} Bulan`}
                                                                />
                                                                <InfoBox
                                                                    label="Angsuran/Bulan"
                                                                    value={formatCurrency(
                                                                        transaction
                                                                            .credit_detail
                                                                            .monthly_installment,
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Action Zone: Booking Fee / Status */}
                                                <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                                                    {!isCredit &&
                                                        transaction.installments?.find(
                                                            (i) =>
                                                                i.installment_number ===
                                                                0,
                                                        ) && (
                                                            <CashPaymentModule
                                                                installment={transaction.installments.find(
                                                                    (i) =>
                                                                        i.installment_number ===
                                                                        0,
                                                                )}
                                                                type="BOOKING FEE"
                                                                isLoading={
                                                                    isLoadingPay
                                                                }
                                                                onPay={
                                                                    handleOnlinePayment
                                                                }
                                                                formatCurrency={
                                                                    formatCurrency
                                                                }
                                                            />
                                                        )}

                                                    {/* If Cash & Booking Fee Paid, Show Pelunasan */}
                                                    {!isCredit &&
                                                        transaction.installments?.find(
                                                            (i) =>
                                                                i.installment_number ===
                                                                0,
                                                        )?.status === "paid" &&
                                                        transaction.installments?.find(
                                                            (i) =>
                                                                i.installment_number ===
                                                                1,
                                                        ) && (
                                                            <div className="mt-6 pt-6 border-t border-white/10">
                                                                <CashPaymentModule
                                                                    installment={transaction.installments.find(
                                                                        (i) =>
                                                                            i.installment_number ===
                                                                            1,
                                                                    )}
                                                                    type="PELUNASAN UNIT"
                                                                    isLoading={
                                                                        isLoadingPay
                                                                    }
                                                                    onPay={
                                                                        handleOnlinePayment
                                                                    }
                                                                    formatCurrency={
                                                                        formatCurrency
                                                                    }
                                                                />
                                                            </div>
                                                        )}

                                                    {/* Credit Document CTA */}
                                                    {isCredit && (
                                                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                                            <div>
                                                                <div className="text-white font-bold mb-1">
                                                                    Lengkapi
                                                                    Dokumen
                                                                </div>
                                                                <div className="text-sm text-white/50">
                                                                    Upload KTP,
                                                                    KK, dan Slip
                                                                    Gaji untuk
                                                                    proses
                                                                    survey.
                                                                </div>
                                                            </div>
                                                            <Link
                                                                href={route(
                                                                    "motors.manage-documents",
                                                                    transaction.id,
                                                                )}
                                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
                                                            >
                                                                <Upload
                                                                    size={18}
                                                                />{" "}
                                                                Upload Dokumen
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Navigation Buttons */}
                                                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                                    <Link
                                                        href={route("home")}
                                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2"
                                                    >
                                                        <Home size={18} />{" "}
                                                        Beranda
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "motors.index",
                                                        )}
                                                        className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                                                    >
                                                        <ArrowRight size={18} />{" "}
                                                        Cari Motor Lain
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decor: Barcode Line */}
                                    <div className="h-2 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#ffffff_4px,#ffffff_8px)] opacity-10"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Subcomponents
function InfoBox({ label, value, highlight = false }) {
    return (
        <div
            className={`p-3 rounded-lg border ${
                highlight
                    ? "bg-white/5 border-white/20"
                    : "bg-transparent border-transparent"
            }`}
        >
            <div className="text-xs text-white/40 uppercase tracking-wide mb-1">
                {label}
            </div>
            <div
                className={`font-medium ${
                    highlight ? "text-accent" : "text-white"
                }`}
            >
                {value}
            </div>
        </div>
    );
}

function CashPaymentModule({
    installment,
    type,
    isLoading,
    onPay,
    formatCurrency,
}) {
    const isPaid = installment.status === "paid";

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {isPaid ? (
                        <CheckCircle className="text-green-500" size={18} />
                    ) : (
                        <Wallet className="text-yellow-500" size={18} />
                    )}
                    <h5 className="font-bold text-white">{type}</h5>
                </div>
                <div className="text-2xl font-mono font-bold text-white tracking-tight">
                    {formatCurrency(installment.amount)}
                </div>
                <p className="text-xs text-white/40 mt-1">
                    {isPaid
                        ? "Pembayaran telah diverifikasi."
                        : "Segera selesaikan pembayaran untuk diproses."}
                </p>
            </div>

            <div>
                {isPaid ? (
                    <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-lg flex items-center gap-2">
                        LUNAS{" "}
                        <CheckCircle
                            size={16}
                            fill="currentColor"
                            className="text-green-900"
                        />
                    </span>
                ) : (
                    <button
                        onClick={() => onPay(installment)}
                        disabled={isLoading}
                        className="px-6 py-3 bg-accent hover:bg-lime-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                Memproses...
                            </span>
                        ) : (
                            <>
                                Bayar Sekarang <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
