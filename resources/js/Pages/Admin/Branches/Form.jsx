import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import { 
    Save, 
    ArrowLeft, 
    MapPin, 
    Navigation, 
    Clock, 
    Phone, 
    Wrench,
    CheckCircle2,
    Info,
    Layout,
    Store
} from "lucide-react";

export default function BranchForm({ branch = null }) {
    const isEdit = !!branch;
    
    const { data, setData, post, put, processing, errors } = useForm({
        code: branch?.code || "",
        name: branch?.name || "",
        address: branch?.address || "",
        city: branch?.city || "",
        phone: branch?.phone || "",
        whatsapp: branch?.whatsapp || "",
        maps_url: branch?.maps_url || "",
        latitude: branch?.latitude || "",
        longitude: branch?.longitude || "",
        operational_hours: branch?.operational_hours || {
            monday: "08:00-17:00",
            tuesday: "08:00-17:00",
            wednesday: "08:00-17:00",
            thursday: "08:00-17:00",
            friday: "08:00-17:00",
            saturday: "08:00-17:00",
            sunday: "Libur",
        },
        facilities: branch?.facilities || [],
        can_service: branch?.can_service ?? false,
        is_main_branch: branch?.is_main_branch ?? false,
        is_active: branch?.is_active ?? true,
    });

    const days = [
        { key: "monday", label: "Senin" },
        { key: "tuesday", label: "Selasa" },
        { key: "wednesday", label: "Rabu" },
        { key: "thursday", label: "Kamis" },
        { key: "friday", label: "Jumat" },
        { key: "saturday", label: "Sabtu" },
        { key: "sunday", label: "Minggu" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("admin.branches.update", branch.id));
        } else {
            post(route("admin.branches.store"));
        }
    };

    const handleHourChange = (day, value) => {
        setData("operational_hours", {
            ...data.operational_hours,
            [day]: value
        });
    };

    const SectionHeader = ({ icon: Icon, title, desc }) => (
        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{title}</h4>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-widest">{desc}</p>
            </div>
        </div>
    );

    return (
        <MetronicAdminLayout title={isEdit ? "Edit Cabang" : "Tambah Cabang Baru"}>
            <Head title={isEdit ? `Edit ${branch.name}` : "Tambah Cabang Baru"} />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {isEdit ? "Perbarui Informasi Cabang" : "Konfigurasi Cabang Baru"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Lengkapi data operasional dan lokasi dealer secara presisi.</p>
                </div>
                <Link
                    href={route("admin.branches.index")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                    <ArrowLeft size={18} /> Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
                
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Identity Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <SectionHeader icon={Store} title="Identitas Cabang" desc="Informasi dasar dealer" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Kode Cabang (Internal)</label>
                                <input
                                    type="text"
                                    className={`w-full bg-gray-50 border ${errors.code ? 'border-red-400' : 'border-gray-200'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all`}
                                    placeholder="CONTOH: SSM_MEKAR_SARI"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value.toUpperCase())}
                                />
                                {errors.code && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{errors.code}</p>}
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Nama Publik Cabang</label>
                                <input
                                    type="text"
                                    className={`w-full bg-gray-50 border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all`}
                                    placeholder="Nama yang tampil di website"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{errors.name}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Alamat Lengkap</label>
                                <textarea
                                    className={`w-full bg-gray-50 border ${errors.address ? 'border-red-400' : 'border-gray-200'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all min-h-[100px]`}
                                    placeholder="Alamat fisik lengkap cabang..."
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                />
                                {errors.address && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{errors.address}</p>}
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Kota</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                                    value={data.city}
                                    onChange={(e) => setData("city", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location & GPS Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <SectionHeader icon={Navigation} title="Lokasi & Kontak" desc="Koordinat GPS dan Informasi Hubungan" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center justify-between">
                                    Latitude
                                    <span className="text-[10px] font-normal text-blue-500 lowercase">(Contoh: -6.2446)</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className={`w-full bg-gray-50 border ${errors.latitude ? 'border-red-400' : 'border-gray-200'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all font-mono`}
                                    value={data.latitude}
                                    onChange={(e) => setData("latitude", e.target.value)}
                                />
                                {errors.latitude && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{errors.latitude}</p>}
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center justify-between">
                                    Longitude
                                    <span className="text-[10px] font-normal text-blue-500 lowercase">(Contoh: 106.9992)</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className={`w-full bg-gray-50 border ${errors.longitude ? 'border-red-400' : 'border-gray-200'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all font-mono`}
                                    value={data.longitude}
                                    onChange={(e) => setData("longitude", e.target.value)}
                                />
                                {errors.longitude && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{errors.longitude}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Google Maps URL (Share Link)</label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                                    placeholder="https://maps.app.goo.gl/..."
                                    value={data.maps_url}
                                    onChange={(e) => setData("maps_url", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Telepon Kantor</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">WhatsApp</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                                    value={data.whatsapp}
                                    onChange={(e) => setData("whatsapp", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operational Hours */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        <SectionHeader icon={Clock} title="Jam Operasional" desc="Atur jadwal buka-tutup cabang" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {days.map((day) => (
                                <div key={day.key} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest w-24 shrink-0">{day.label}</label>
                                    <input
                                        type="text"
                                        className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-right text-sm font-bold text-blue-600 placeholder:text-gray-300 placeholder:font-normal"
                                        placeholder="08:00-17:00"
                                        value={data.operational_hours[day.key]}
                                        onChange={(e) => handleHourChange(day.key, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Capabilities */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    
                    {/* Status Toggle Box */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
                        <SectionHeader icon={Layout} title="Atribut Cabang" desc="Konfigurasi teknis" />
                        
                        <div className="space-y-6">
                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">Status Cabang</div>
                                        <div className="text-[10px] text-gray-500 font-medium">Tampil di publik?</div>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={data.is_active}
                                    onChange={(e) => setData("is_active", e.target.checked)}
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-pink-50/30 rounded-xl cursor-pointer hover:bg-pink-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.is_main_branch ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        <Layout size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">Cabang PUSAT</div>
                                        <div className="text-[10px] text-pink-600 font-medium italic">Badge 'PUSAT'</div>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                    checked={data.is_main_branch}
                                    onChange={(e) => setData("is_main_branch", e.target.checked)}
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-cyan-50/30 rounded-xl cursor-pointer hover:bg-cyan-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.can_service ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        <Wrench size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">Tersedia Servis</div>
                                        <div className="text-[10px] text-cyan-600 font-medium italic">Bisa Booking Servis?</div>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                                    checked={data.can_service}
                                    onChange={(e) => setData("can_service", e.target.checked)}
                                />
                            </label>
                        </div>

                        <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-xl">
                            <div className="flex gap-3 text-blue-600 mb-2">
                                <Info size={16} className="shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest">PENTING</span>
                            </div>
                            <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                                Jika "Tersedia Servis" diaktifkan, cabang ini akan muncul sebagai opsi pada halaman <b>Booking Servis</b> pelanggan.
                            </p>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
                        >
                            <Save size={20} />
                            {processing ? "MENYIMPAN..." : (isEdit ? "SIMPAN PERUBAHAN" : "TAMBAH CABANG")}
                        </button>
                        <Link
                            href={route("admin.branches.index")}
                            className="w-full flex items-center justify-center py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                        >
                            BATALKAN
                        </Link>
                    </div>

                </div>

            </form>
        </MetronicAdminLayout>
    );
}
