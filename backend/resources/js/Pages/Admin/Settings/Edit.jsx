import React, { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import MetronicAdminLayout from "@/Layouts/MetronicAdminLayout";
import {
    Clock,
    Palette,
    Globe,
    Upload,
    Plus,
    Trash2,
    PenTool,
    Save,
    ArrowLeft,
    Loader2,
    ImageIcon
} from "lucide-react";

import {
    getSettingFieldConfig,
    getCategoryConfig,
    settingsConfig,
} from "@/Config/SettingsConfig";

export default function SettingsEdit({ category, settings }) {
    // Get all expected fields for this category from config
    const categoryConfig = getCategoryConfig(category);
    const configFields = categoryConfig?.fields || {};
    
    // Create initial data set by merging config with database settings
    const initialSettings = Object.keys(configFields).map(key => {
        const dbSetting = settings.find(s => s.key === key);
        return {
            key: key,
            value: dbSetting ? dbSetting.value : "",
            type: dbSetting ? dbSetting.type : configFields[key].type,
            description: dbSetting ? dbSetting.description : configFields[key].helper,
        };
    });

    // Add any database settings that might NOT be in config (legacy or custom)
    settings.forEach(s => {
        if (!configFields[s.key]) {
            initialSettings.push({
                key: s.key,
                value: s.value,
                type: s.type,
                description: s.description
            });
        }
    });

    const { data, setData, put, processing } = useForm({
        settings: initialSettings,
    });

    const [filePreview, setFilePreview] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const handleSettingChange = (index, field, value) => {
        const updatedSettings = [...data.settings];
        updatedSettings[index][field] = value;
        setData("settings", updatedSettings);
    };

    const handleBusinessHourChange = (index, day, value) => {
        const updatedSettings = [...data.settings];
        try {
            const hours = JSON.parse(updatedSettings[index].value || "{}");
            hours[day] = value;
            updatedSettings[index].value = JSON.stringify(hours);
            setData("settings", updatedSettings);
        } catch (e) {
            console.error("Error parsing business hours:", e);
        }
    };

    const handleFileUpload = async (index, file) => {
        if (!file) return;

        const validTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(file.type)) {
            alert("Format file harus PNG atau JPG");
            return;
        }

        if (file.size > maxSize) {
            alert("Ukuran file max 2MB");
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setFilePreview((prev) => ({
                ...prev,
                [data.settings[index].key]: e.target.result,
            }));
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploadProgress((prev) => ({
            ...prev,
            [data.settings[index].key]: 0,
        }));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("field", data.settings[index].key);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    const current = prev[data.settings[index].key] || 0;
                    if (current < 90) return { ...prev, [data.settings[index].key]: current + 20 };
                    clearInterval(progressInterval);
                    return prev;
                });
            }, 200);

            const response = await fetch(route("admin.settings.upload"), {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
            });

            clearInterval(progressInterval);

            if (!response.ok) throw new Error("Upload gagal");

            const result = await response.json();

            const updatedSettings = [...data.settings];
            updatedSettings[index].value = result.path;
            setData("settings", updatedSettings);

            setUploadProgress((prev) => ({ ...prev, [data.settings[index].key]: 100 }));

            setTimeout(() => {
                setUploadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[data.settings[index].key];
                    return newProgress;
                });
            }, 1000);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file: " + error.message);
            setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress[data.settings[index].key];
                return newProgress;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.settings.update", category));
    };

    const handleJsonArrayChange = (index, arrayIndex, value, action = 'edit') => {
        const updatedSettings = [...data.settings];
        try {
            let list = [];
            try { list = JSON.parse(updatedSettings[index].value || "[]"); } catch (e) { list = []; }
            if (!Array.isArray(list)) list = [];

            if (action === 'edit') list[arrayIndex] = value;
            else if (action === 'delete') list.splice(arrayIndex, 1);
            else if (action === 'add') list.push("");
            
            updatedSettings[index].value = JSON.stringify(list);
            setData("settings", updatedSettings);
        } catch (e) {
            console.error("Error updating JSON array:", e);
        }
    };

    const daysOfWeek = [
        { key: "monday", label: "Senin" },
        { key: "tuesday", label: "Selasa" },
        { key: "wednesday", label: "Rabu" },
        { key: "thursday", label: "Kamis" },
        { key: "friday", label: "Jumat" },
        { key: "saturday", label: "Sabtu" },
        { key: "sunday", label: "Minggu" },
    ];

    const renderInputField = (setting, index) => {
        const fieldConfig = getSettingFieldConfig(category, setting.key);
        const titleLabel = fieldConfig?.label || setting.key;
        const helperText = fieldConfig?.helper || setting.description;

        // Custom Layout Wrapper
        const CardWrapper = ({ icon: Icon, children }) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-start gap-3">
                        {Icon && <Icon className="text-blue-500 shrink-0 mt-0.5" size={20} />}
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{titleLabel}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        );

        // 1. Business Hours
        if (setting.key === "business_hours") {
            let hours = {};
            try {
                hours = typeof setting.value === "string" ? JSON.parse(setting.value || "{}") : setting.value || {};
            } catch (e) { hours = {}; }

            return (
                <CardWrapper key={index} icon={Clock}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {daysOfWeek.map(({ key: dayKey, label: dayLabel }) => (
                            <div key={dayKey}>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">{dayLabel}</label>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="08:00 - 17:00"
                                    value={hours[dayKey] || ""}
                                    onChange={(e) => handleBusinessHourChange(index, dayKey, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </CardWrapper>
            );
        }

        // 2. Service Branches (Array)

        // 3. Color Picker
        if (setting.key.includes("color") && setting.type === "string") {
            return (
                <CardWrapper key={index} icon={Palette}>
                    <div className="flex gap-4 items-center">
                        <div className="relative w-14 h-14 rounded-xl border-2 border-gray-200 overflow-hidden shrink-0 shadow-sm">
                            <input
                                type="color"
                                className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                                value={data.settings[index].value || "#2563EB"}
                                onChange={(e) => handleSettingChange(index, "value", e.target.value)}
                            />
                        </div>
                        <input
                            type="text"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full uppercase font-mono tracking-widest max-w-[200px] p-2.5"
                            value={data.settings[index].value || ""}
                            onChange={(e) => handleSettingChange(index, "value", e.target.value)}
                            placeholder="#2563EB"
                        />
                    </div>
                </CardWrapper>
            );
        }

        // 4. URL/Social
        if (setting.key.includes("social") || setting.key.includes("url")) {
            return (
                <CardWrapper key={index} icon={Globe}>
                    <input
                        type="url"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder={fieldConfig?.placeholder || "https://..."}
                        value={data.settings[index].value || ""}
                        onChange={(e) => handleSettingChange(index, "value", e.target.value)}
                    />
                </CardWrapper>
            );
        }

        // 5. File / Image
        if (fieldConfig?.type === "file" || setting.key === "site_logo") {
            return (
                <CardWrapper key={index} icon={Upload}>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        
                        {/* Preview */}
                        <div className="w-32 h-32 rounded-xl border-2 border-gray-200 border-dashed bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {(filePreview[setting.key] || setting.value) ? (
                                <img
                                    src={filePreview[setting.key] || setting.value}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            ) : (
                                <ImageIcon size={32} className="text-gray-300" />
                            )}
                        </div>

                        {/* Upload Tools */}
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Upload size={16} className="text-gray-500" />
                                        <p className="text-sm font-semibold text-gray-700">Pilih file gambar</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) handleFileUpload(index, e.target.files[0]);
                                        }}
                                        disabled={uploadProgress[setting.key]}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Format: PNG, JPG (Maksimal 2MB). Auto-upload.</p>

                            {uploadProgress[setting.key] && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 overflow-hidden">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress[setting.key]}%` }}></div>
                                </div>
                            )}
                            
                            {setting.value && (
                                <div className="mt-2 text-[10px] text-gray-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                                    {setting.value}
                                </div>
                            )}
                        </div>
                    </div>
                </CardWrapper>
            );
        }

        // 6. Text Area
        if (setting.type === "text") {
            return (
                <CardWrapper key={index} icon={PenTool}>
                    <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 min-h-[100px] resize-y"
                        placeholder={fieldConfig?.placeholder}
                        value={data.settings[index].value || ""}
                        onChange={(e) => handleSettingChange(index, "value", e.target.value)}
                    />
                </CardWrapper>
            );
        }

        // 7. Default Simple Input
        return (
            <CardWrapper key={index} icon={PenTool}>
                <input
                    type={fieldConfig?.type === "number" ? "number" : setting.key.includes("email") ? "email" : setting.key.includes("phone") ? "tel" : "text"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-lg"
                    placeholder={fieldConfig?.placeholder}
                    value={data.settings[index].value || ""}
                    onChange={(e) => handleSettingChange(index, "value", e.target.value)}
                />
            </CardWrapper>
        );
    };

    return (
        <MetronicAdminLayout title={`Edit ${categoryConfig?.label || category}`}>
            <Head title={`Edit Konfigurasi - ${categoryConfig?.label || category}`} />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {categoryConfig?.label || category}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {categoryConfig?.description || "Kelola variabel spesifik untuk sistem."}
                    </p>
                </div>
                <Link
                    href={route("admin.settings.index")}
                    className="px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors w-fit"
                >
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="flex flex-col gap-6">
                    {data.settings.map((setting, index) => renderInputField(setting, index))}
                </div>

                {/* Fixed Footer Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
                    >
                        {processing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <Link
                        href={route("admin.settings.index")}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg text-sm font-bold text-center transition-colors shadow-sm"
                    >
                        Batalkan
                    </Link>
                </div>
            </form>

        </MetronicAdminLayout>
    );
}
