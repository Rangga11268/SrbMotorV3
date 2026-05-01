import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import {
    Settings,
    Phone,
    Globe,
    Mail,
    Wrench,
    Pencil,
    Info,
    ChevronRight
} from "lucide-react";
import {
    getFieldLabel,
    getFieldHelper,
    settingsConfig,
} from "@/Config/SettingsConfig";

export default function SettingsIndex({ settings }) {
    const [activeTab, setActiveTab] = useState("general");

    const getSettingsByCategory = (category) => {
        const dbSettings = settings[category] || [];
        const configFields = settingsConfig[category]?.fields || {};
        
        // Merge config keys with database settings
        const merged = Object.keys(configFields).map(key => {
            const dbSetting = dbSettings.find(s => s.key === key);
            return dbSetting || {
                key: key,
                value: null,
                type: configFields[key].type,
                description: configFields[key].helper
            };
        });

        // Add any DB settings not in config
        dbSettings.forEach(s => {
            if (!configFields[s.key]) merged.push(s);
        });

        return merged;
    };

    const categories = {
        general: {
            label: "Pengaturan Umum",
            icon: Settings,
            description: "Informasi dasar website dan branding",
            color: "text-blue-500 bg-blue-50",
            activeColor: "bg-blue-600 text-white"
        },
        contact: {
            label: "Info Kontak",
            icon: Phone,
            description: "Nomor telepon & alamat bisnis",
            color: "text-emerald-500 bg-emerald-50",
            activeColor: "bg-emerald-600 text-white"
        },
        social: {
            label: "Media Sosial",
            icon: Globe,
            description: "Link integrasi sosial",
            color: "text-purple-500 bg-purple-50",
            activeColor: "bg-purple-600 text-white"
        },
        email: {
            label: "Sistem Email",
            icon: Mail,
            description: "Konfigurasi notifikasi",
            color: "text-amber-500 bg-amber-50",
            activeColor: "bg-amber-600 text-white"
        },
    };

    return (
        <MetronicAdminLayout title="Pengaturan Sistem">
            <Head title="Pengaturan Sistem" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manajemen Pengaturan Mulus</h2>
                <p className="text-sm text-gray-500 mt-1">Konfigurasikan seluruh aspek platform SRB secara terpusat.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Sidebar Menu (Metronic Nav View) */}
                <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4 gap-2">
                        {Object.entries(categories).map(([key, cat]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-start gap-4 px-4 py-4 rounded-xl text-left transition-colors ${
                                    activeTab === key ? "bg-gray-50 border border-gray-100 shadow-sm" : "hover:bg-gray-50 border border-transparent"
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeTab === key ? cat.activeColor : cat.color}`}>
                                    <cat.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-bold text-sm ${activeTab === key ? 'text-gray-900' : 'text-gray-700'}`}>{cat.label}</div>
                                    <div className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{cat.description}</div>
                                </div>
                            </button>
                        ))}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-start gap-3 p-3 bg-[#e8f3ff] rounded-xl text-[#006ee6]">
                                <Info size={18} className="shrink-0 mt-0.5" />
                                <div className="text-xs font-semibold">
                                    Setiap nilai yang diubah di sini akan otomatis sinkron ke seluruh platform <i>real-time</i>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        
                        {/* Dynamic Header */}
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const CurrentIcon = categories[activeTab].icon;
                                    return <CurrentIcon size={24} className="text-gray-400" />
                                })()}
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{categories[activeTab].label}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{categories[activeTab].description}</p>
                                </div>
                            </div>
                            
                            <Link href={route("admin.settings.edit", activeTab)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white hover:text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20">
                                <Pencil size={16} /> Ubah Konfigurasi
                            </Link>
                        </div>

                        {/* List Settings */}
                        <div className="p-6">
                            {getSettingsByCategory(activeTab).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getSettingsByCategory(activeTab).map((setting) => (
                                        <div key={setting.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col">
                                            <h6 className="font-bold text-gray-800 text-sm mb-1">{getFieldLabel(activeTab, setting.key) || setting.key}</h6>
                                            <p className="text-xs text-gray-500 font-medium mb-3">{getFieldHelper(activeTab, setting.key) || setting.description}</p>
                                            
                                            <div className="mt-auto bg-white border border-gray-100 rounded-lg p-3 overflow-hidden shadow-sm">
                                                {(() => {
                                                    if (setting.key === "site_logo") {
                                                        return (
                                                            <div className="flex items-center justify-center bg-gray-100 rounded-md p-2 border border-gray-200 border-dashed">
                                                                <img src={setting.value} alt="Logo" className="max-h-[40px] object-contain" />
                                                            </div>
                                                        );
                                                    }
                                                    
                                                    if (setting.key === "business_hours") {
                                                        try {
                                                            if (!setting.value) return <span className="text-xs text-gray-400 italic">Belum diatur</span>;
                                                            const hours = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
                                                            if (!hours) return <span className="text-xs text-gray-400 italic">Belum diatur</span>;
                                                            return (
                                                                <div className="text-xs text-gray-600 flex flex-col gap-1">
                                                                    <div className="flex justify-between"><span className="font-semibold">Senin - Sabtu:</span> <span>{hours.monday || '-'}</span></div>
                                                                    <div className="flex justify-between"><span className="font-semibold text-rose-500">Minggu:</span> <span>{hours.sunday || '-'}</span></div>
                                                                </div>
                                                            );
                                                        } catch(e) { return <span className="text-xs text-red-500 font-medium">Format Error</span>; }
                                                    }


                                                    // Default simple text
                                                    return (
                                                        <div className="text-sm font-semibold text-gray-800 break-words">{setting.value || <span className="text-gray-400 italic">Belum diatur</span>}</div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200 border-dashed">
                                        <Settings size={28} className="text-gray-400 animate-[spin_4s_linear_infinite]" />
                                    </div>
                                    <h4 className="font-bold text-gray-800">Tidak ada pengaturan</h4>
                                    <p className="text-sm text-gray-500 mt-1 max-w-sm">Kategori pengaturan ini belum dikonfigurasi sama sekali dalam database.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </MetronicAdminLayout>
    );
}
