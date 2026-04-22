import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Bike,
    Banknote,
    Coins,
    Tag,
    Calendar,
    Palette,
    ImagePlus,
    Plus,
    X,
    ToggleRight,
    Info,
    MapPin,
    Check
} from "lucide-react";

export default function Create({ promotions, brands, branches }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        brand: "Yamaha",
        model: "",
        price: "",
        year: new Date().getFullYear(),
        type: "",
        image: null,
        description: "",
        min_dp_amount: 0,
        promotion_ids: [],
        tersedia: true,
        colors: [],
        branches: [],
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [colorInput, setColorInput] = useState("");

    const formatNumberDisplay = (numStr) => {
        if (numStr === null || numStr === undefined || numStr === "") return "";
        const strValue = String(numStr).split('.')[0];
        const cleanNum = strValue.replace(/[^\d]/g, "");
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseFormattedNumber = (str) => String(str).replace(/[^\d]/g, "");

    const handlePriceChange = (value) => setData("price", parseFormattedNumber(value));
    const handleMinDpChange = (value) => setData("min_dp_amount", parseFormattedNumber(value));

    const handleAddColor = (e) => {
        if (e.key === 'Enter' && colorInput.trim() !== '') {
            e.preventDefault();
            if (!data.colors.includes(colorInput.trim())) {
                setData("colors", [...data.colors, colorInput.trim()]);
            }
            setColorInput("");
        }
    };

    const addColorFromButton = () => {
        if (colorInput.trim() !== '' && !data.colors.includes(colorInput.trim())) {
            setData("colors", [...data.colors, colorInput.trim()]);
        }
        setColorInput("");
    };

    const handleRemoveColor = (colorToRemove) => {
        setData("colors", data.colors.filter(c => c !== colorToRemove));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalColors = [...data.colors];
        if (colorInput.trim() !== '' && !finalColors.includes(colorInput.trim())) {
            finalColors.push(colorInput.trim());
        }
        router.post(route("admin.motors.store"), {
            ...data,
            colors: finalColors,
        }, {
            forceFormData: true,
            onSuccess: () => toast.success("Motor berhasil ditambahkan"),
        });
    };

    return (
        <MetronicAdminLayout title="Tambah Unit Motor Baru">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={route("admin.motors.index")}
                        className="p-2 border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors shadow-sm shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">Registrasi Unit Baru</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Tambahkan kendaraan baru ke dalam katalog inventaris dealer.</p>
                    </div>
                </div>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black uppercase tracking-widest w-fit">
                    ✦ Entri Baru
                </span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ===== LEFT / MAIN FORM (8 cols) ===== */}
                    <div className="xl:col-span-8 space-y-6">

                        {/* Card: Data Identitas Unit */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <Bike size={16} className="text-blue-500" /> Identitas & Spesifikasi Utama
                                </h3>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Nama Motor */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Nama Motor <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 ${errors.name ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300'}`}
                                        placeholder="Contoh: Yamaha NMAX Turbo ABS 2025"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                </div>

                                {/* Merk, Tipe, Tahun (3-col grid) */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Tag size={11}/> Merk</label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                            value={data.brand}
                                            onChange={(e) => setData("brand", e.target.value)}
                                        >
                                            <option value="">Pilih Merk</option>
                                            {brands && brands.map((b) => (<option key={b} value={b}>{b}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Tipe / Kelas</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                                            placeholder="Sport, Matic, dll"
                                            value={data.type}
                                            onChange={(e) => setData("type", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={11}/> Tahun</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                                            placeholder="2025"
                                            value={data.year}
                                            onChange={(e) => setData("year", e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Harga & DP (2-col grid) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Banknote size={11}/> Harga OTR <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs font-bold">Rp</span>
                                            </div>
                                            <input
                                                type="text"
                                                className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-9 pr-3 py-3 ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
                                                value={formatNumberDisplay(data.price)}
                                                onChange={(e) => handlePriceChange(e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        {errors.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Coins size={11}/> DP Minimum</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs font-bold">Rp</span>
                                            </div>
                                            <input
                                                type="text"
                                                className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-9 pr-3 py-3 ${errors.min_dp_amount ? 'border-red-400' : 'border-gray-300'}`}
                                                value={formatNumberDisplay(data.min_dp_amount)}
                                                onChange={(e) => handleMinDpChange(e.target.value)}
                                                placeholder="600.000"
                                            />
                                        </div>
                                        {errors.min_dp_amount && <p className="text-red-500 text-xs mt-1 font-medium">{errors.min_dp_amount}</p>}
                                    </div>
                                </div>

                                {/* Varian Warna */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Palette size={11}/> Varian Warna</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                                            placeholder="Ketik warna lalu Enter atau klik Tambah..."
                                            value={colorInput}
                                            onChange={(e) => setColorInput(e.target.value)}
                                            onKeyDown={handleAddColor}
                                        />
                                        <button
                                            type="button"
                                            onClick={addColorFromButton}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
                                        >
                                            <Plus size={15} /> Tambah
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {data.colors.length === 0 ? (
                                            <span className="text-gray-400 text-xs italic font-medium">Belum ada varian warna yang ditambahkan.</span>
                                        ) : (
                                            data.colors.map((color, index) => (
                                                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold">
                                                    {color}
                                                    <button type="button" onClick={() => handleRemoveColor(color)} className="text-blue-400 hover:text-red-500 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Penempatan Cabang (Multi-Select) */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1">
                                            <MapPin size={11}/> Penempatan Cabang <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (data.branches.length === branches.length) {
                                                    setData("branches", []);
                                                } else {
                                                    setData("branches", branches.map(b => b.code));
                                                }
                                            }}
                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tight"
                                        >
                                            {data.branches.length === branches.length ? 'Hapus Semua' : 'Pilih Semua'}
                                        </button>
                                    </div>
 
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        {branches && branches.map((b) => {
                                            const isSelected = data.branches.includes(b.code);
                                            return (
                                                <label 
                                                    key={b.code}
                                                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                        isSelected 
                                                        ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' 
                                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            const newBranches = isSelected
                                                                ? data.branches.filter(code => code !== b.code)
                                                                : [...data.branches, b.code];
                                                            setData("branches", newBranches);
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <div className={`text-xs font-bold tracking-tight ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                                            {b.name}
                                                        </div>
                                                        <div className="text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-1">
                                                            {b.code}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="bg-blue-600 rounded-full p-0.5 ml-2">
                                                            <Check size={10} className="text-white" />
                                                        </div>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
 
                                    {errors.branches && <p className="text-red-500 text-xs mt-1 font-medium">{errors.branches}</p>}
                                    <p className="text-[10px] text-gray-500 mt-2.5 flex items-center gap-1">
                                        <Info size={10} /> Data unit ini akan diduplikasi secara otomatis ke setiap cabang yang Anda pilih di atas.
                                    </p>
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data.tersedia ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                                            <ToggleRight size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-700">Status Ketersediaan</div>
                                            <div className="text-xs text-gray-500">Tentukan apakah unit ini tersedia di showroom.</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={data.tersedia}
                                            onChange={(e) => setData("tersedia", e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Card: Upload Gambar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <ImagePlus size={16} className="text-blue-500" /> Gambar Thumbnail Katalog
                                </h3>
                            </div>
                            <div className="p-6">
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <ImagePlus size={32} />
                                        <span className="text-sm font-bold">Klik untuk pilih gambar</span>
                                        <span className="text-xs">JPG, PNG, WEBP — Maks 5MB</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                {errors.image && <p className="text-red-500 text-xs mt-2 font-medium">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Card: Deskripsi */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm">Deskripsi & Spesifikasi Teknis</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Gunakan editor di bawah untuk menulis spesifikasi lengkap dan keunggulan produk.</p>
                            </div>
                            <div className="p-6">
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(html) => setData("description", html)}
                                    placeholder="Tuliskan spesifikasi lengkap dan keunggulan motor ini dengan formatting..."
                                    minHeight="350px"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                            ) : (
                                <><Save size={18} /> Simpan Data Motor ke Katalog</>
                            )}
                        </button>
                    </div>

                    {/* ===== RIGHT SIDEBAR PREVIEW (4 cols) ===== */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-24 space-y-4">
                            {/* Live Preview Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 text-sm">Pratinjau Katalog</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Tampilan seperti di halaman publik.</p>
                                </div>
                                <div className="p-4">
                                    {/* Image Preview */}
                                    <div className="aspect-[4/3] w-full bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center mb-4">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                                <Bike size={36} />
                                                <span className="text-xs font-bold">Belum ada gambar</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Meta */}
                                    <h4 className="font-black text-gray-900 text-base leading-tight">{data.name || <span className="text-gray-300 font-medium">Nama Motor...</span>}</h4>
                                    <div className="flex gap-2 mt-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold border">{data.brand || 'Merk'}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold border">{data.type || 'Tipe'}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold border">{data.year}</span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Harga OTR</div>
                                                <div className="text-base font-black text-blue-600">Rp {data.price ? new Intl.NumberFormat("id-ID").format(data.price) : "0"}</div>
                                            </div>
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${data.tersedia ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                                                {data.tersedia ? 'Tersedia' : 'Kosong'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Callout */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                                <div className="text-blue-500 shrink-0 mt-0.5"><Info size={16} /></div>
                                <div>
                                    <p className="text-blue-700 text-xs font-bold mb-1">Catatan Registrasi</p>
                                    <p className="text-blue-600 text-xs leading-relaxed">Motor akan langsung muncul di galeri publik setelah disimpan. Pastikan gambar beresolusi tinggi untuk hasil terbaik.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MetronicAdminLayout>
    );
}
