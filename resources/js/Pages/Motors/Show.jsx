import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Public/Navbar";
import Footer from "@/Components/Public/Footer";
import Button from "@/Components/UI/Button";
import Card, { CardBody } from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";
import { motion } from "framer-motion";
import {
    Calendar,
    Info,
    CheckCircle2,
    XCircle,
    ShoppingCart,
    FileText,
    MessageCircle,
    ArrowLeft,
    Share2,
    ShieldCheck,
    Gauge,
    Cpu,
    Zap,
    MapPin,
    PenTool,
    Activity,
    ChevronRight,
    ArrowRight,
    Phone,
    Clock,
    Tag,
    Star,
    CheckCircle,
} from "lucide-react";

export default function Show({ motor, relatedMotors }) {
    const { auth } = usePage().props;
    const [selectedProviderId, setSelectedProviderId] = React.useState(
        motor.financing_schemes?.[0]?.provider_id || null,
    );
    const [selectedTenor, setSelectedTenor] = React.useState(
        motor.financing_schemes?.[0]?.tenor || null,
    );

    // Group financing schemes by provider
    const schemesByProvider = React.useMemo(() => {
        if (!motor.financing_schemes) return {};
        return motor.financing_schemes.reduce((acc, scheme) => {
            const providerId = scheme.provider_id;
            if (!acc[providerId]) {
                acc[providerId] = {
                    provider: scheme.provider,
                    schemes: [],
                };
            }
            acc[providerId].schemes.push(scheme);
            return acc;
        }, {});
    }, [motor.financing_schemes]);

    const activeProvider = schemesByProvider[selectedProviderId];
    const activeScheme =
        activeProvider?.schemes.find((s) => s.tenor === selectedTenor) ||
        activeProvider?.schemes[0];

    React.useEffect(() => {
        if (activeProvider && !activeScheme) {
            setSelectedTenor(activeProvider.schemes[0]?.tenor);
        }
    }, [selectedProviderId, activeProvider, activeScheme]);

    const openWhatsApp = (e) => {
        e.preventDefault();
        const phoneNumber = "6281234567890";
        const message = encodeURIComponent(
            `Halo SRB Motors, saya tertarik dengan unit ${
                motor.name
            } (Rp ${parseFloat(motor.price).toLocaleString("id-ID")}). Bisa minta info lebih lanjut?`,
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Head title={`${motor.name} - SRB Motors`} />
            <Navbar auth={auth} />

            <main className="flex-grow pt-24 pb-20">
                {/* BREADCRUMBS */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link
                            href={route("motors.index")}
                            className="hover:text-blue-600"
                        >
                            Katalog
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 line-clamp-1">
                            {motor.name}
                        </span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* LEFT COLUMN - GALLERY & IMAGE */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                <img
                                    src={
                                        motor.image_path
                                            ? `/storage/${motor.image_path}`
                                            : "/images/placeholder-motor.jpg"
                                    }
                                    alt={motor.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Status Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-3">
                                    <Badge
                                        variant="blue"
                                        size="md"
                                        className="shadow-lg backdrop-blur-md bg-white/90"
                                    >
                                        {motor.brand}
                                    </Badge>
                                    <Badge
                                        variant={
                                            motor.tersedia ? "green" : "red"
                                        }
                                        size="md"
                                        className="shadow-lg backdrop-blur-md bg-white/90"
                                    >
                                        {motor.tersedia
                                            ? "Unit Tersedia"
                                            : "Unit Terjual"}
                                    </Badge>
                                </div>

                                {/* Promo Ribbons (Momotor Style) */}
                                {motor.promotions &&
                                    motor.promotions.length > 0 && (
                                        <div className="absolute bottom-6 left-0 flex flex-col gap-2 z-10 pointer-events-none w-full pr-10">
                                            {motor.promotions.map(
                                                (promo, pIndex) => (
                                                    <div
                                                        key={pIndex}
                                                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider px-5 py-2.5 rounded-r-full shadow-2xl border border-orange-400/50 self-start truncate"
                                                    >
                                                        <Star className="w-4 h-4 inline-block mr-2 -mt-0.5 fill-current" />
                                                        {promo.badge_text ||
                                                            promo.title}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </motion.div>

                            {/* Trust Badges under image */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    <span className="text-xs font-bold text-blue-900">
                                        Lulus Inspeksi
                                    </span>
                                </div>
                                <div className="p-4 bg-green-50 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    <span className="text-xs font-bold text-green-900">
                                        Surat Lengkap
                                    </span>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-600" />
                                    <span className="text-xs font-bold text-yellow-900">
                                        Siap Pakai
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - DETAILS */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm font-semibold text-blue-600 uppercase tracking-widest">
                                    <span>{motor.brand}</span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    <span>{motor.type}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                    {motor.name}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <div className="text-3xl font-black text-blue-600">
                                        Rp{" "}
                                        {parseFloat(motor.price).toLocaleString(
                                            "id-ID",
                                        )}
                                    </div>
                                    <Badge variant="gray" size="md">
                                        Tahun {motor.year}
                                    </Badge>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {motor.tersedia ? (
                                    <>
                                        <div className="flex-grow">
                                            <Link
                                                href={route(
                                                    "motors.cash-order",
                                                    motor.id,
                                                )}
                                            >
                                                <Button
                                                    fullWidth
                                                    size="lg"
                                                    className="h-14 text-lg"
                                                >
                                                    <ShoppingCart className="w-5 h-5 mr-2" />{" "}
                                                    Beli Cash
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex-grow">
                                            <Link
                                                href={route(
                                                    "motors.credit-order",
                                                    motor.id,
                                                )}
                                            >
                                                <Button
                                                    fullWidth
                                                    size="lg"
                                                    variant="secondary"
                                                    className="h-14 text-lg border-2"
                                                >
                                                    <FileText className="w-5 h-5 mr-2" />{" "}
                                                    Ajukan Kredit
                                                </Button>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        fullWidth
                                        size="lg"
                                        disabled
                                        className="h-14 opacity-50 grayscale cursor-not-allowed"
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />{" "}
                                        Unit Tidak Tersedia
                                    </Button>
                                )}
                            </div>

                            <button
                                onClick={openWhatsApp}
                                className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-100"
                            >
                                <Phone className="w-5 h-5 fill-current" /> Tanya
                                Admin via WhatsApp
                            </button>

                            {/* LEASING CALCULATOR */}
                            {motor.financing_schemes &&
                                motor.financing_schemes.length > 0 && (
                                    <div className="space-y-6 pt-8 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Simulasi Cicilan
                                            </h3>
                                            <Badge variant="blue" size="sm">
                                                Hubungi via Leasing
                                            </Badge>
                                        </div>

                                        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 space-y-6">
                                            {/* Provider Selection */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    Pilih Leasing
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.values(
                                                        schemesByProvider,
                                                    ).map((pData) => (
                                                        <button
                                                            key={
                                                                pData.provider
                                                                    .id
                                                            }
                                                            onClick={() =>
                                                                setSelectedProviderId(
                                                                    pData
                                                                        .provider
                                                                        .id,
                                                                )
                                                            }
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                                                selectedProviderId ===
                                                                pData.provider
                                                                    .id
                                                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                                                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                                                            }`}
                                                        >
                                                            {
                                                                pData.provider
                                                                    .name
                                                            }
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Tenor Selection */}
                                            {activeProvider && (
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                        Pilih Tenor (Bulan)
                                                    </label>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {activeProvider.schemes
                                                            .sort(
                                                                (a, b) =>
                                                                    a.tenor -
                                                                    b.tenor,
                                                            )
                                                            .map((scheme) => (
                                                                <button
                                                                    key={
                                                                        scheme.id
                                                                    }
                                                                    onClick={() =>
                                                                        setSelectedTenor(
                                                                            scheme.tenor,
                                                                        )
                                                                    }
                                                                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                                                                        selectedTenor ===
                                                                        scheme.tenor
                                                                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                                                                    }`}
                                                                >
                                                                    {
                                                                        scheme.tenor
                                                                    }
                                                                    x
                                                                </button>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Result Display */}
                                            {activeScheme && (
                                                <div className="pt-4 border-t border-blue-100">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                                                                Uang Muka (DP)
                                                            </p>
                                                            <p className="text-xl font-bold text-gray-900">
                                                                Rp{" "}
                                                                {parseFloat(
                                                                    activeScheme.dp_amount,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                                                                Angsuran / Bln
                                                            </p>
                                                            <p className="text-2xl font-black text-blue-600">
                                                                Rp{" "}
                                                                {parseFloat(
                                                                    activeScheme.monthly_installment,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="mt-4 text-[10px] text-gray-400 italic">
                                                        *Simulasi ini hanya
                                                        perkiraan. Biaya
                                                        administrasi & asuransi
                                                        mungkin belum termasuk.
                                                        Silakan hubungi admin
                                                        untuk janji temu atau
                                                        survey.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* DESCRIPTION (RICH TEXT) */}
                            {motor.description && (
                                <div className="space-y-4 pt-8 border-t border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Spesifikasi & Promo
                                    </h3>
                                    <div
                                        className="prose prose-blue max-w-none text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100"
                                        dangerouslySetInnerHTML={{
                                            __html: motor.description,
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RELATED MOTORS */}
                {relatedMotors && relatedMotors.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                    Unit Terkait
                                </h2>
                                <p className="text-gray-500">
                                    Mungkin Anda juga tertarik dengan unit ini
                                </p>
                            </div>
                            <Link href={route("motors.index")}>
                                <Button variant="ghost" className="group">
                                    Lihat Semua{" "}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedMotors.map((m) => (
                                <Link
                                    key={m.id}
                                    href={route("motors.show", m.id)}
                                >
                                    <Card
                                        hoverable
                                        className="overflow-hidden border border-gray-100"
                                    >
                                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                                            <img
                                                src={
                                                    m.image_path
                                                        ? `/storage/${m.image_path}`
                                                        : "/images/placeholder-motor.jpg"
                                                }
                                                alt={m.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Promo Ribbon on Related */}
                                            {m.promotions &&
                                                m.promotions.length > 0 && (
                                                    <div className="absolute bottom-2 left-0 z-10 pointer-events-none">
                                                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-r-md shadow-lg">
                                                            {m.promotions[0]
                                                                .badge_text ||
                                                                m.promotions[0]
                                                                    .title}
                                                        </div>
                                                    </div>
                                                )}
                                            <div className="absolute top-3 right-3">
                                                <Badge
                                                    variant="blue"
                                                    size="sm"
                                                    className="bg-white/90 backdrop-blur-sm"
                                                >
                                                    {m.brand}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardBody className="p-4 space-y-3">
                                            <h4 className="font-bold text-gray-900 line-clamp-1">
                                                {m.name}
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <p className="text-blue-600 font-extrabold text-lg">
                                                    Rp{" "}
                                                    {parseFloat(
                                                        m.price,
                                                    ).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
