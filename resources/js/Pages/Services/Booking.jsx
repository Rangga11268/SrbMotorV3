import React, { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronRight, Calendar as CalendarIcon, Clock, PenTool, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export default function Booking({ user }) {
    const { auth } = usePage().props;
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [isLoadingDates, setIsLoadingDates] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        branch: "",
        customer_name: user?.name || "",
        customer_phone: user?.phone_number || "",
        motor_brand: "",
        motor_type: "",
        license_plate: "",
        current_km: "",
        service_date: "",
        service_time: "",
        service_type: "Servis Berkala",
        complaint_notes: "",
    });

    const ssmBranches = [
        "SSM JATIASIH (BEKASI)",
        "SSM MEKAR SARI (BEKASI)",
        "SSM DEPOK (DEPOK)",
        "SSM BOGOR (BOGOR)",
        "SSM TANGERANG (TANGERANG)",
    ];

    useEffect(() => {
        axios.get(route('api.services.unavailable-dates'))
            .then(res => {
                setUnavailableDates(res.data.unavailable_dates || []);
                setIsLoadingDates(false);
            })
            .catch(err => {
                console.error("Failed to fetch dates", err);
                setIsLoadingDates(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('services.store'));
    };

    // Calculate next 14 days
    const next14Days = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1); // start tomorrow
        return d.toISOString().split('T')[0];
    });

    return (
        <PublicLayout auth={auth} title="Booking Servis - SRB Motor">
            <div className="flex-grow pt-28 bg-white">
                {/* Hero */}
                <section className="bg-black text-white pt-6 pb-24 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <button onClick={() => window.history.back()} className="text-gray-400 hover:text-[#1c69d4] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors mb-4">
                                <ArrowLeft className="w-3 h-3" /> KEMBALI
                            </button>
                            <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1c69d4]">
                                <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                                <ChevronRight className="w-3 h-3 text-gray-600" />
                                <span className="text-gray-400">RESERVASI SERVIS</span>
                            </nav>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                            PERAWATAN <br />
                            <span className="text-[#1c69d4]">BERKALA</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg font-light">
                            Pertahankan performa optimal kendaraan Anda melalui mekanik bersertifikat SSM dengan peralatan diagnostik terkalibrasi.
                        </p>
                    </div>
                </section>

                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* FORM */}
                        <div className="w-full lg:w-2/3">
                            <form onSubmit={handleSubmit} className="space-y-12">
                                
                                {/* Info Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-1 bg-black"></div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">IDENTITAS KENDARAAN</h2>
                                    </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-300 border border-gray-300">
                                        <div className="bg-white p-6 md:col-span-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Pilih Cabang Servis</label>
                                            <select value={data.branch} onChange={e => setData('branch', e.target.value)} required
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs">
                                                <option value="">PILIH LOKASI BENGKEL</option>
                                                {ssmBranches.map(branch => (
                                                    <option key={branch} value={branch}>{branch}</option>
                                                ))}
                                            </select>
                                            {errors.branch && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.branch}</span>}
                                        </div>
                                        <div className="bg-white p-6">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Nama Pelanggan</label>
                                            <input type="text" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} required
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs" placeholder="NAMA LENGKAP" />
                                            {errors.customer_name && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.customer_name}</span>}
                                        </div>
                                        <div className="bg-white p-6">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Kontak / WhatsApp</label>
                                            <input type="text" value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)} required
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs" placeholder="08XX-XXXX-XXXX" />
                                            {errors.customer_phone && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.customer_phone}</span>}
                                        </div>
                                        <div className="bg-white p-6">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Merek</label>
                                            <input type="text" value={data.motor_brand} onChange={e => setData('motor_brand', e.target.value)} required
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs" placeholder="HONDA / YAMAHA" />
                                            {errors.motor_brand && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.motor_brand}</span>}
                                        </div>
                                        <div className="bg-white p-6">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Model Kendaraan</label>
                                            <input type="text" value={data.motor_type} onChange={e => setData('motor_type', e.target.value)} required
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs" placeholder="NMAX 155 ABS" />
                                            {errors.motor_type && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.motor_type}</span>}
                                        </div>
                                        <div className="bg-white p-6">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">No. Polisi / Plat</label>
                                            <input type="text" value={data.license_plate} onChange={e => setData('license_plate', e.target.value)} required
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs" placeholder="B 1234 ABC" />
                                            {errors.license_plate && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.license_plate}</span>}
                                        </div>
                                        <div className="bg-white p-6">
                                            <label className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-widest block mb-2">Status Kilometer</label>
                                            <input type="number" value={data.current_km} onChange={e => setData('current_km', e.target.value)} required
                                                className="w-full bg-white border border-[#1c69d4] rounded-none px-4 py-3 outline-none text-black focus:ring-1 focus:ring-[#1c69d4] font-bold uppercase text-xs" placeholder="MISAL: 5400" />
                                            {errors.current_km && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.current_km}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Calendar Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-1 bg-black"></div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">JADWAL KEDATANGAN</h2>
                                    </div>
                                    
                                    <div className="bg-gray-50 border border-gray-200 p-8 space-y-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">PILIH TANGGAL SERVIS</label>
                                            
                                            {isLoadingDates ? (
                                                <div className="p-8 text-center text-sm uppercase tracking-widest text-[#1c69d4] font-bold animate-pulse">SINKRONISASI KUOTA...</div>
                                            ) : (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                                    {next14Days.map(date => {
                                                        const isUnavailable = unavailableDates.includes(date);
                                                        const isSelected = data.service_date === date;
                                                        const d = new Date(date);
                                                        const dayName = d.toLocaleDateString("id-ID", { weekday: 'short' });
                                                        const dateNum = d.getDate();

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={date}
                                                                disabled={isUnavailable}
                                                                onClick={() => setData('service_date', date)}
                                                                className={`
                                                                    flex flex-col items-center justify-center py-4 border transition-colors rounded-none outline-none
                                                                    ${isUnavailable 
                                                                        ? 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                                                                        : isSelected 
                                                                            ? 'bg-black border-black text-white shadow-xl' 
                                                                            : 'bg-white border-gray-300 text-black hover:border-black'}
                                                                `}
                                                            >
                                                                <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isSelected ? 'text-gray-400' : isUnavailable ? 'text-gray-400' : 'text-[#1c69d4]'}`}>{dayName}</span>
                                                                <span className="text-xl font-black">{dateNum}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {errors.service_date && <span className="text-red-500 text-[10px] uppercase font-bold mt-2 block">{errors.service_date}</span>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">ESTIMASI KEDATANGAN</label>
                                                <select value={data.service_time} onChange={e => setData('service_time', e.target.value)} required
                                                    className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs">
                                                    <option value="">PILIH JAM</option>
                                                    <option value="08:00:00">08:00 PAGI</option>
                                                    <option value="10:00:00">10:00 PAGI</option>
                                                    <option value="13:00:00">13:00 SIANG</option>
                                                    <option value="15:00:00">15:00 SORE</option>
                                                </select>
                                                {errors.service_time && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.service_time}</span>}
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">KATEGORI PERAWATAN</label>
                                                <select value={data.service_type} onChange={e => setData('service_type', e.target.value)} required
                                                    className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-bold uppercase text-xs">
                                                    <option value="Servis Berkala">SERVIS BERKALA (TUNE UP)</option>
                                                    <option value="Ganti Oli">GANTI OLI SAJA</option>
                                                    <option value="Perbaikan Berat">PERBAIKAN BERAT (TURUN MESIN)</option>
                                                    <option value="Lainnya">LAINNYA / DIAGNOSTIK</option>
                                                </select>
                                                {errors.service_type && <span className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.service_type}</span>}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">KELUHAN / CATATAN TAMBAHAN</label>
                                            <textarea value={data.complaint_notes} onChange={e => setData('complaint_notes', e.target.value)} rows="3"
                                                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 outline-none text-black focus:border-[#1c69d4] font-medium text-sm resize-none" placeholder="Deskripsikan jika ada bunyi aneh, tarikan berat, dll..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#1c69d4] hover:bg-black text-white font-black uppercase tracking-[0.2em] py-5 rounded-none transition-colors border-none disabled:opacity-50"
                                >
                                    {processing ? "MEMPROSES..." : "KONFIRMASI RESERVASI KALENDER"}
                                </button>
                            </form>
                        </div>

                        {/* SIDEBAR INFO */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-black text-white p-10 sticky top-32 border border-gray-800">
                                <PenTool className="w-8 h-8 text-[#1c69d4] mb-6" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 border-b border-gray-800 pb-4">
                                    PEDOMAN SERVIS SSM
                                </h3>
                                <div className="mb-6 bg-gray-900 border border-gray-800 p-4">
                                    <p className="text-[10px] font-bold text-[#1c69d4] tracking-widest uppercase mb-1">Status Bengkel Harian</p>
                                    <p className="text-2xl font-black text-white">4 <span className="text-sm font-normal text-gray-400">MEKANIK AKTIF</span></p>
                                    <p className="text-xs text-gray-400 mt-2">Setiap mekanik melayani standar operasional prosedur SSM dengan alat kalibrasi terkini.</p>
                                </div>
                                <ul className="space-y-6">
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block font-bold text-[10px] uppercase tracking-widest text-[#1c69d4] mb-1">Garansi Terjaga</span>
                                            <p className="text-sm font-light text-gray-400">Servis resmi memastikan garansi unit sekunder Anda tidak hangus.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <Clock className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block font-bold text-[10px] uppercase tracking-widest text-[#1c69d4] mb-1">Ketepatan Waktu</span>
                                            <p className="text-sm font-light text-gray-400">Hadir max 15 menit sebelum waktu reservasi. Keterlambatan dapat membatalkan slot.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start border-t border-gray-800 pt-6">
                                        <AlertTriangle className="w-10 h-10 text-yellow-500 flex-shrink-0" />
                                        <div>
                                            <span className="block font-bold text-[10px] uppercase tracking-widest text-white mb-1">PENGINGAT KILOMETER</span>
                                            <p className="text-sm font-light text-gray-400">Catat angka Odometer (KM) kendaraan secara presisi untuk membantu pelacakan riwayat servis oleh mekanik.</p>
                                        </div>
                                    </li>
                                </ul>
                                
                                <div className="mt-10 pt-6 border-t border-gray-800">
                                    <Link href={route('services.index')} className="text-[10px] font-bold text-white hover:text-[#1c69d4] uppercase tracking-widest transition-colors flex items-center gap-2">
                                        <ChevronRight size={14} /> LIHAT RIWAYAT SERVIS SAYA
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
