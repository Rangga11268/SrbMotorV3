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
        description: "Informasi kontak bisnis untuk pelanggan",
        fields: {
            phone: {
                label: "Nomor Telepon Utama",
                type: "text",
                placeholder: "+62812345678",
                helper: "Nomor telepon bisnis utama dengan kode negara",
                category: "Telepon",
            },
            phone_secondary: {
                label: "Nomor Telepon Alternatif",
                type: "text",
                placeholder: "+62812345679",
                helper: "Nomor telepon cadangan atau WhatsApp",
                category: "Telepon",
            },
            email: {
                label: "Email Bisnis",
                type: "text",
                placeholder: "info@srbmotor.com",
                helper: "Email utama untuk pertanyaan dari pelanggan",
                category: "Email",
            },
            address: {
                label: "Alamat Bisnis",
                type: "textarea",
                placeholder: "Jl. Raya No. 123, Kota, Provinsi 12345",
                helper: "Alamat lengkap showroom atau kantor pusat",
                category: "Lokasi",
            },
            operating_hours: {
                label: "Jam Operasional",
                type: "textarea",
                placeholder:
                    "Senin - Jumat: 08:00 - 17:00\nSabtu: 08:00 - 15:00\nMinggu: Tutup",
                helper: "Jam buka tutup bisnis setiap hari",
                category: "Operasional",
            },
        },
    },
    social: {
        label: "Media Sosial",
        icon: "cilGlobeAlt",
        description:
            "Link profil media sosial untuk terhubung dengan pelanggan",
        fields: {
            facebook_url: {
                label: "Facebook",
                type: "text",
                placeholder: "https://facebook.com/srbmotor",
                helper: "Link profil Facebook bisnis Anda",
                category: "Media Sosial",
            },
            instagram_url: {
                label: "Instagram",
                type: "text",
                placeholder: "https://instagram.com/srbmotor",
                helper: "Link profil Instagram untuk portfolio dan update produk",
                category: "Media Sosial",
            },
            whatsapp_url: {
                label: "WhatsApp Business",
                type: "text",
                placeholder: "https://wa.me/62812345678",
                helper: "Link WhatsApp untuk customer service (format: https://wa.me/62xxxxxx)",
                category: "Chat",
            },
            youtube_url: {
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
            primary_color: {
                label: "Warna Utama (Primary)",
                type: "text",
                placeholder: "#4361ee",
                helper: "Warna utama brand dalam format hex (misal: #4361ee untuk biru)",
                category: "Warna",
            },
            secondary_color: {
                label: "Warna Sekunder",
                type: "text",
                placeholder: "#6c83f4",
                helper: "Warna pendamping utama untuk keperluan design",
                category: "Warna",
            },
            accent_color: {
                label: "Warna Accent",
                type: "text",
                placeholder: "#ffc107",
                helper: "Warna highlight/menarik perhatian",
                category: "Warna",
            },
            brand_font: {
                label: "Font Brand",
                type: "text",
                placeholder: "Poppins, Inter, Roboto",
                helper: "Font yang digunakan untuk branding (coma-separated)",
                category: "Tipografi",
            },
        },
    },
    financing: {
        label: "Pembiayaan",
        icon: "cilMoney",
        description:
            "Pengaturan skema cicilan dan bekerja sama dengan provider leasing",
        fields: {
            min_dp_percentage: {
                label: "Minimum DP (%)",
                type: "number",
                placeholder: "20",
                helper: "Persentase minimum down payment untuk kredit (0-100%)",
                category: "Pembayaran",
            },
            max_installment_months: {
                label: "Maksimum Tenor Cicilan (Bulan)",
                type: "number",
                placeholder: "60",
                helper: "Berapa bulan maksimal untuk cicilan (misal: 60 bulan = 5 tahun)",
                category: "Tenor",
            },
            enable_installment: {
                label: "Aktifkan Cicilan?",
                type: "boolean",
                helper: "Apakah sistem cicilan diaktifkan di toko?",
                category: "Fitur",
            },
            leasing_partners: {
                label: "Partner Leasing",
                type: "textarea",
                placeholder: "OTO Multiwarna, Adira Finance, BCA Finance",
                helper: "Daftar nama-nama leasing yang menjadi partner (baris baru untuk setiap leasing)",
                category: "Partner",
            },
        },
    },
    email: {
        label: "Email",
        icon: "cilEnvelopeClosed",
        description: "Konfigurasi sistem email untuk notifikasi dan komunikasi",
        fields: {
            mail_from_name: {
                label: "Nama Pengirim Email",
                type: "text",
                placeholder: "SRB Motor",
                helper: "Nama yang muncul sebagai pengirim di email pelanggan",
                category: "Identitas",
            },
            mail_from_address: {
                label: "Email Pengirim",
                type: "text",
                placeholder: "noreply@srbmotor.com",
                helper: "Email yang digunakan untuk mengirim notifikasi ke pelanggan",
                category: "Email",
            },
            smtp_host: {
                label: "SMTP Host",
                type: "text",
                placeholder: "smtp.gmail.com atau smtp.office365.com",
                helper: "Server SMTP untuk mengirim email (hubungi email provider Anda)",
                category: "Teknis SMTP",
            },
            smtp_port: {
                label: "SMTP Port",
                type: "number",
                placeholder: "587",
                helper: "Port SMTP (biasanya 587 untuk TLS atau 465 untuk SSL)",
                category: "Teknis SMTP",
            },
            smtp_username: {
                label: "SMTP Username",
                type: "text",
                placeholder: "email@gmail.com",
                helper: "Username untuk autentikasi SMTP",
                category: "Teknis SMTP",
            },
            smtp_password: {
                label: "SMTP Password",
                type: "password",
                placeholder: "••••••••",
                helper: "Password untuk autentikasi SMTP (hati-hati dengan keamanan!)",
                category: "Teknis SMTP",
            },
            enable_email_verification: {
                label: "Wajibkan Verifikasi Email?",
                type: "boolean",
                helper: "Apakah pelanggan harus verifikasi email sebelum bisa melakukan transaksi?",
                category: "Keamanan",
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
