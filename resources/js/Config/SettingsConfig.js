/**
 * Settings Configuration
 * Mapping antara setting key dengan readable label dan helper text
 */

export const settingsConfig = {
    general: {
        label: "Pengaturan Umum",
        icon: "cilSettings",
        description: "Pengaturan dasar website dan brand",
        fields: {
            site_name: {
                label: "Nama Website",
                type: "text",
                placeholder: "SRB Motor",
                helper: "Nama bisnis yang ditampilkan di berbagai tempat di website",
                category: "Identitas Bisnis",
            },
            site_description: {
                label: "Deskripsi Website",
                type: "textarea",
                placeholder: "Deskripsi singkat tentang bisnis Anda...",
                helper: "Deskripsi yang akan muncul di search engine dan meta tags",
                category: "SEO",
            },
            site_url: {
                label: "URL Website",
                type: "text",
                placeholder: "https://srbmotor.com",
                helper: "Alamat lengkap website Anda (dengan https://)",
                category: "Teknis",
            },
            site_logo: {
                label: "Logo Website",
                type: "text",
                placeholder: "/assets/icon/logo.png",
                helper: "Path ke file logo website",
                category: "Branding",
            },
        },
    },
    contact: {
        label: "Informasi Kontak",
        icon: "cilPhone",
        description: "Informasi kontak bisnis untuk pelanggan yang ditampilkan di Footer dan Detail Motor",
        fields: {
            contact_phone: {
                label: "Nomor Telepon & WhatsApp",
                type: "text",
                placeholder: "0812345678",
                helper: "Nomor telepon & WhatsApp bisnis (untuk tampilan teks dan link chat)",
                category: "Kontak Utama",
            },
            contact_email: {
                label: "Email Bisnis",
                type: "text",
                placeholder: "info@srbmotor.com",
                helper: "Email utama untuk bantuan dan pertanyaan pelanggan",
                category: "Email",
            },
            contact_address: {
                label: "Alamat Lengkap",
                type: "textarea",
                placeholder: "Jl. Raya No. 123, Kota, Provinsi 12345",
                helper: "Alamat lengkap showroom atau kantor pusat SRB Motors",
                category: "Lokasi",
            },
            contact_city: {
                label: "Kota Domisili",
                type: "text",
                placeholder: "Jakarta",
                helper: "Kota utama lokasi dealer SRB Motor",
                category: "Lokasi",
            },
            business_hours: {
                label: "Jam Operasional Dealer",
                type: "json",
                placeholder: '{"monday":"08:00 - 17:00",...}',
                helper: "Jadwal operasional showroom utama (mempengaruhi info di footer)",
                category: "Waktu",
            },
        },
    },
    social: {
        label: "Media Sosial",
        icon: "cilGlobeAlt",
        description:
            "Link profil media sosial untuk terhubung dengan pelanggan",
        fields: {
            social_facebook: {
                label: "Facebook",
                type: "text",
                placeholder: "https://facebook.com/srbmotor",
                helper: "Link profil Facebook bisnis Anda",
                category: "Media Sosial",
            },
            social_instagram: {
                label: "Instagram",
                type: "text",
                placeholder: "https://instagram.com/srbmotor",
                helper: "Link profil Instagram untuk portfolio dan update produk",
                category: "Media Sosial",
            },
            social_tiktok: {
                label: "TikTok",
                type: "text",
                placeholder: "https://tiktok.com/@srbmotor",
                helper: "Link akun TikTok SRB Motors",
                category: "Media Sosial",
            },
            social_youtube: {
                label: "YouTube",
                type: "text",
                placeholder: "https://youtube.com/@srbmotor",
                helper: "Link channel YouTube untuk video demonstrasi motor",
                category: "Media Sosial",
            },
        },
    },
    branding: {
        label: "Branding",
        icon: "cilColorPalette",
        description: "Identitas visual dan warna brand",
        fields: {
            brand_primary_color: {
                label: "Warna Utama (Primary)",
                type: "text",
                placeholder: "#4361ee",
                helper: "Warna utama brand dalam format hex (misal: #4361ee untuk biru)",
                category: "Warna",
            },
            brand_secondary_color: {
                label: "Warna Sekunder",
                type: "text",
                placeholder: "#6c83f4",
                helper: "Warna pendamping utama untuk keperluan design",
                category: "Warna",
            },
        },
    },
    financing: {
        label: "Simulasi Kredit",
        icon: "cilMoney",
        description: "Konfigurasi perhitungan kredit motor (DP, Tenor, Bunga)",
        fields: {
            min_down_payment_percent: {
                label: "Minimum DP (%)",
                type: "number",
                placeholder: "20",
                helper: "Persentase minimum uang muka dari harga motor (0-100%)",
                category: "Angka Utama",
            },
            max_tenor_months: {
                label: "Maksimum Tenor (Bulan)",
                type: "number",
                placeholder: "60",
                helper: "Durasi pinjaman maksimal (misal: 60 bulan = 5 tahun)",
                category: "Tenor",
            },
            interest_rate_percent: {
                label: "Bunga Flat per Bulan (%)",
                type: "text",
                placeholder: "1.5",
                helper: "Bunga flat bulanan yang digunakan untuk estimasi cicilan (contoh: 1.5)",
                category: "Bunga",
            },
        },
    },
    email: {
        label: "Email",
        icon: "cilEnvelopeClosed",
        description: "Konfigurasi sistem email untuk notifikasi dan komunikasi",
        fields: {
            email_from_name: {
                label: "Nama Pengirim Email",
                type: "text",
                placeholder: "SRB Motor",
                helper: "Nama yang muncul sebagai pengirim di email pelanggan",
                category: "Identitas",
            },
            email_from_address: {
                label: "Alamat Email Pengirim",
                type: "text",
                placeholder: "noreply@srbmotor.id",
                helper: "Alamat email sistem untuk pengiriman notifikasi",
                category: "Identitas",
            },
        },
    },
    service: {
        label: "Layanan Servis (SSM)",
        icon: "cilBurn",
        description: "Konfigurasi operasional bengkel (Sinarsurya Motor)",
        fields: {
            service_business_hours: {
                label: "Jam Operasional Bengkel",
                type: "json",
                placeholder: '{"monday": "08:00 - 16:00"}',
                helper: "Jadwal buka/tutup bengkel SSM per hari (mempengaruhi slot booking)",
                category: "Operasional",
            },
            service_slot_quota: {
                label: "Kapasitas per Slot",
                type: "number",
                placeholder: "5",
                helper: "Jumlah maksimum motor yang bisa dibooking dalam satu jam servis (slot)",
                category: "Kapasitas",
            },
            service_branches: {
                label: "Daftar Cabang Bengkel",
                type: "json",
                placeholder: '["SSM JATIASIH", "SSM DEPOK"]',
                helper: "Daftar cabang bengkel yang tersedia di form booking (format JSON array)",
                category: "Lokasi",
            },
        },
    },
};

/**
 * Helper function untuk get setting config
 */
export function getSettingFieldConfig(category, fieldKey) {
    return settingsConfig[category]?.fields[fieldKey] || null;
}

/**
 * Helper function untuk get category config
 */
export function getCategoryConfig(category) {
    return settingsConfig[category] || null;
}

/**
 * Get readable label untuk field
 */
export function getFieldLabel(category, fieldKey) {
    const config = getSettingFieldConfig(category, fieldKey);
    return config?.label || fieldKey;
}

/**
 * Get helper text untuk field
 */
export function getFieldHelper(category, fieldKey) {
    const config = getSettingFieldConfig(category, fieldKey);
    return config?.helper || "";
}
