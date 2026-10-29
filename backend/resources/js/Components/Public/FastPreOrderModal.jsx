import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { X, Phone, MapPin, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function FastPreOrderModal({
    isOpen,
    onClose,
    motor,
    dpAmount = 0,
    selectedTenor = 36,
    monthlyInstallment = 0,
    contactPhone = "08978638849",
    user = null,
}) {
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [color, setColor] = useState(
        Array.isArray(motor?.colors) && motor.colors.length > 0 ? motor.colors[0] : ""
    );
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});

    // Reset / sync state when modal opens
    useEffect(() => {
        if (isOpen) {
            if (user?.name && !name) setName(user.name);
            if (user?.phone && !phone) setPhone(user.phone);
            if (Array.isArray(motor?.colors) && motor.colors.length > 0 && !color) {
                setColor(motor.colors[0]);
            }
            setErrors({});
        }
    }, [isOpen, user, motor]);

    if (!isOpen || !motor) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Nama lengkap wajib diisi";
        }
        if (!phone.trim()) {
            newErrors.phone = "Nomor WhatsApp wajib diisi";
        } else if (!/^[0-9+ -]{9,16}$/.test(phone.trim())) {
            newErrors.phone = "Nomor WhatsApp tidak valid (contoh: 081234567890)";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let rawPhone = contactPhone.replace(/\D/g, "");
        if (rawPhone.startsWith("0")) {
            rawPhone = "62" + rawPhone.slice(1);
        } else if (!rawPhone.startsWith("62")) {
            rawPhone = "62" + rawPhone;
        }

        const lines = [
            `*PENGAJUAN PENAWARAN KREDIT MOTOR (FAST LEAD)*`,
            `Halo Tim Sales SRB Motors Kaliabang, saya tertarik mengajukan penawaran kredit untuk:`,
            ``,
            `🏍️ *Model*: ${motor.name}`,
            color ? `🎨 *Warna*: ${color}` : null,
            `💰 *Harga OTR*: Rp ${parseFloat(motor.price).toLocaleString("id-ID")}`,
            `💵 *Rencana DP*: Rp ${dpAmount.toLocaleString("id-ID")}`,
            `⏱️ *Tenor*: ${selectedTenor} Bulan`,
            `📊 *Estimasi Angsuran*: Rp ${monthlyInstallment.toLocaleString("id-ID")} / bulan`,
            ``,
            `👤 *Data Calon Pembeli*:`,
            `- Nama: ${name.trim()}`,
            `- No. WhatsApp: ${phone.trim()}`,
            `- Diler & Showroom: SRB Motors Kaliabang (Bekasi Utara)`,
            notes.trim() ? `- Catatan: ${notes.trim()}` : null,
            ``,
            `Mohon dibantu informasi ketersediaan unit, promo diskon DP, dan simulasi leasingnya. Terima kasih!`,
        ].filter(Boolean);

        const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
        window.open(waUrl, "_blank");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 transition-opacity">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1c69d4] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                            <Sparkles className="w-3 h-3" />
                            Penawaran Kredit Cepat
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                            Ajukan Penawaran Kredit Kilat
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Sales resmi SRB Motor akan segera menghubungi Anda via WhatsApp.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors shrink-0 ml-3"
                        aria-label="Tutup"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content Body */}
                <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
                    {/* Unit & Financing Summary Card */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 border border-slate-200/90 rounded-xl p-3.5 sm:p-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-16 h-14 bg-white rounded-lg border border-slate-200/80 p-1 flex items-center justify-center shrink-0">
                                <img
                                    src={
                                        motor.image ||
                                        (motor.image_path
                                            ? motor.image_path.startsWith("http") || motor.image_path.startsWith("/")
                                                ? motor.image_path
                                                : motor.image_path.startsWith("assets/")
                                                ? `/${motor.image_path}`
                                                : `/storage/${motor.image_path}`
                                            : "/assets/img/no-image.webp")
                                    }
                                    alt={motor.name}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/assets/img/no-image.webp";
                                    }}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                    {motor.brand}
                                </span>
                                <h4 className="text-sm font-extrabold text-slate-900 truncate">
                                    {motor.name}
                                </h4>
                                <span className="text-xs font-bold text-[#1c69d4]">
                                    OTR: Rp {parseInt(motor.price).toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                        {/* Simulation Badges */}
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/70 text-center">
                            <div className="bg-white rounded-lg p-2 border border-slate-200/70">
                                <span className="block text-[9px] font-semibold uppercase text-slate-400 tracking-wider">
                                    Rencana DP
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                    Rp {dpAmount.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="bg-white rounded-lg p-2 border border-slate-200/70">
                                <span className="block text-[9px] font-semibold uppercase text-slate-400 tracking-wider">
                                    Tenor
                                </span>
                                <span className="text-xs font-bold text-[#1c69d4]">
                                    {selectedTenor} Bulan
                                </span>
                            </div>
                            <div className="bg-white rounded-lg p-2 border border-slate-200/70">
                                <span className="block text-[9px] font-semibold uppercase text-slate-400 tracking-wider">
                                    Est. Angsuran
                                </span>
                                <span className="text-xs font-extrabold text-emerald-600">
                                    Rp {monthlyInstallment.toLocaleString("id-ID")}/bln
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form id="fast-lead-form" onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                                }}
                                placeholder="Contoh: Budi Santoso"
                                className={`w-full rounded-xl border bg-slate-50/60 focus:bg-white text-slate-900 text-sm py-2.5 px-3.5 outline-none transition-all ${
                                    errors.name
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                        : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>
                            )}
                        </div>

                        {/* Nomor WhatsApp */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Nomor Handphone / WhatsApp <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                                }}
                                placeholder="Contoh: 081234567890"
                                className={`w-full rounded-xl border bg-slate-50/60 focus:bg-white text-slate-900 text-sm py-2.5 px-3.5 outline-none transition-all ${
                                    errors.phone
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                        : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                }`}
                            />
                            {errors.phone && (
                                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.phone}</p>
                            )}
                        </div>

                        {/* Pilihan Warna & Diler Showroom */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.isArray(motor.colors) && motor.colors.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Pilihan Warna
                                    </label>
                                    <select
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 text-sm py-2.5 px-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    >
                                        {motor.colors.map((c, idx) => (
                                            <option key={idx} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className={Array.isArray(motor.colors) && motor.colors.length > 0 ? "" : "sm:col-span-2"}>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Diler & Showroom
                                </label>
                                <div className="rounded-xl border border-slate-200 bg-slate-100/70 py-2.5 px-3 text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin size={14} className="text-[#1c69d4] shrink-0" />
                                    <span className="truncate">SRB Motors Kaliabang</span>
                                </div>
                            </div>
                        </div>

                        {/* Catatan Tambahan */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Catatan Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Rencana tukar tambah motor lama, atau jadwal survei yang diinginkan..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 text-sm py-2 px-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer Action Bar */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl shrink-0 space-y-2.5">
                    <button
                        type="submit"
                        form="fast-lead-form"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                        <Phone size={16} className="fill-current" />
                        <span>Kirim ke WhatsApp Sales Dealer</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1 px-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-700 font-semibold transition-colors"
                        >
                            Batal
                        </button>
                        <Link
                            href={route("motors.credit-order", motor.id)}
                            className="text-[#1c69d4] hover:text-blue-700 font-bold flex items-center gap-1 transition-colors"
                        >
                            <span>Upload Berkas KTP Online</span>
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
