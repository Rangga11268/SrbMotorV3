Dokumen ini menjelaskan strategi integrasi data antar cabang (Pusat & Cabang Network) untuk SRB Motor dan jaringan Sinar Surya Matahari (SSM) dengan memanfaatkan struktur database yang sudah ada. **Fokus utama aplikasi ini tetap pada SRB Motor sebagai titik penjualan network.**

## Hirarki & Klasifikasi Jaringan

Untuk efisiensi operasional, jaringan diklasifikasikan menjadi dua level utama:

1.  **Pusat & Service Center (High Capacity)**:
    - **SSM Mekarsari (Pusat)**: Pusat operasional dan layanan perbaikan utama.
    - **SSM Jatimekar (Premium R-Shop)**: Cabang besar dengan fasilitas servis lengkap.
2.  **Sales Network (Showroom/Titik Penjualan)**:
    - **SRB Motor (Kaliabang)**: Fokus utama website ini.
    - **SSM Pondok Ungu, SSM Alinda, SSM Jatibening**: Titik distribusi unit tanpa fasilitas servis.

Berdasarkan investigasi kode, aplikasi SRB Motor saat ini memiliki:
1.  **Tabel `motors`**: Memiliki kolom `branch` (String) untuk menyimpan lokasi unit.
2.  **Tabel `service_appointments`**: Memiliki kolom `branch` (String) untuk menyimpan lokasi servis.
3.  **Tabel `settings`**: Menyimpan konfigurasi JSON `service_branches` yang berisi detail alamat, koordinat, dan kapabilitas cabang.

### Masalah Potensial (Seluk Beluk)
-   **Data Fragility**: Karena menggunakan `string` (Nama Cabang) di tabel Motor/Layanan dan bukan ID (Foreign Key), jika nama cabang di pengaturan diubah, data lama akan menjadi yatim (*orphaned*) atau tidak sinkron.
-   **Manual Stock Tracking**: Pengecekan stok antar cabang saat ini masih bergantung pada kesamaan penamaan string di kolom `branch` tabel `motors`.
-   **Geospatial Limitation**: Pencarian "Cabang Terdekat" belum diimplementasikan meskipun koordinat tersedia di beberapa metadata.

---

## Strategi Solusi: "Single Source of Truth" (Settings-Driven)

Kita akan menggunakan tabel **`settings`** sebagai satu-satunya rujukan untuk identitas cabang, sementara tabel lain (`motors`, `appointments`) hanya akan menyimpan *alias* atau *key* dari cabang tersebut.

### 1. Struktur Data (Enhancement `service_branches`)
Kita akan menstandarisasi key `service_branches` menjadi `dealer_network` dengan struktur objek yang konsisten:
```json
[
  {
    "id": "ssm-mekarsari", // Identifier unik tetap
    "name": "SSM MEKAR SARI (PUSAT)",
    "alias": "MEKARSARI",
    "can_service": true,
    "can_sales": true,
    "coordinates": {"lat": -6.234, "lng": 106.987},
    "whatsapp": "0812..."
  }
]
```

### 2. Fitur Integrasi (Mapping Logic)

#### A. Cek Stok Lintas Cabang (SRB Motor Focus)
Mengingat web ini adalah profil SRB Motor, logika pengecekan stok akan diatur sebagai berikut:
1.  **Prioritas Utama**: Tampilkan detail unit yang ada di SRB Motor.
2.  **Fallback/Opsi**: Jika stok di SRB habis (`tersedia = 0`), sistem tidak langsung menampilkan "Stok Habis" secara absolut, melainkan:
    *   Mencari unit yang sama di **SSM Mekarsari** atau **SSM Jatimekar**.
    *   Jika ditemukan, tampilkan CTA: *"Unit ini tersedia di Pusat (Mekarsari). Pesan lewat SRB untuk pengiriman gratis!"*
3.  **UI Feedback**: Memberikan label "Ready Stock di SRB" vs "Tersedia di Jaringan SSM" untuk memberikan transparansi lokasi unit kepada user.

#### B. Integrasi Booking Servis (Smart Routing)
Karena SRB Motor adalah Sales Network tanpa bengkel, fitur Booking Servis akan secara otomatis difilter hanya untuk cabang yang memiliki `can_service: true`.
- **Rekomendasi Utama**: Sistem akan otomatis menyarankan **SSM Mekarsari** sebagai pusat layanan terdekat dari area jangkauan SRB (Bekasi Utara).
- **Metode**: Filter di Controller di mana `can_service: true`.
- **Dampak**: User tetap merasa dalam satu ekosistem yang sama meskipun servis dilakukan di lokasi berbeda.

#### C. Deteksi Cabang Terdekat (Pickup Dealer)
Saat pengguna memilih metode penyerahan **"Ambil di Dealer"** pada form pemesanan:
1.  **Geolocation Request**: Sistem meminta izin akses lokasi browser untuk mendapatkan koordinat pengguna.
2.  **Proximity Calculation**: Menggunakan rumus *Haversine* untuk menghitung jarak antara lokasi pengguna dan semua cabang aktif di `dealer_network`.
3.  **Sorted Selection**: Dropdown pilihan cabang akan otomatis diurutkan berdasarkan jarak terdekat, lengkap dengan informasi jarak (misal: "TERDEKAT - 1.2 KM").
4.  **Selection Capture**: Lokasi pengambilan yang dipilih akan disimpan dalam data transaksi untuk koordinasi persiapan unit oleh tim admin.

#### D. Standarisasi Nama Cabang (Data Matching)
Untuk menjaga agar filter berfungsi, kolom `branch` di tabel `motors` dan `service_appointments` harus menggunakan **Alias** tetap dari `settings` (bukan nama display yang bisa berubah):
- `SRB` -> SRB Motor Kaliabang
- `MEKARSARI` -> SSM Mekar Sari (Pusat)
- `JATIMEKAR` -> SSM Jatimekar (R-Shop)
- `PONDOKUNGU` -> SSM Pondok Ungu
- dan seterusnya.

---

## Analisis Masalah & Mitigasi (High Level)

| Potensi Masalah | Solusi Simple |
| :--- | :--- |
| **Integritas Data** | Gunakan `alias` yang singkat dan tidak berubah (misal: "MEKARSARI", "SRB") sebagai nilai di kolom `branch` tabel lain, bukan nama panjang yang rawan perubahan typo. |
| **Performa Query** | Gunakan cache pada `Setting::get()` agar parsing JSON tidak dilakukan berulang kali pada setiap request. |
| **Admin Complexity** | Buat UI khusus di Admin Panel untuk mengelola JSON settings ini agar admin tidak perlu mengedit teks manual di database. |
| **User Privacy** | Jika user menolak izin lokasi, fitur "Terdekat" akan fallback ke daftar cabang standar secara alfabetis. |
| **Ketidakakuratan Stok** | Menambahkan meta-data `last_stock_update` pada tiap motor untuk memberi info ke user kapan data stok terakhir diverifikasi (opsional). |

---

## Alur Kerja Admin (Data Governance)

Agar fitur mapping ini berjalan lancar tanpa tabel baru, admin harus mengikuti panduan pengisian data berikut:

1.  **Pengisian Unit Motor**: Saat menambah motor baru, kolom `branch` harus diisi dengan **Alias** (huruf besar, tanpa spasi) sesuai daftar di `dealer_network` (contoh: `SRB`, `MEKARSARI`).
2.  **Manajemen Cabang**: Jika ada cabang baru, admin harus menambahkannya ke dalam JSON `settings` terlebih dahulu sebelum menggunakannya di tabel motor.
3.  **Konsistensi Nama**: Hindari penggunaan nama tidak standar (misal: "Unit Kaliabang") karena sistem tidak akan bisa memetakan lokasi tersebut ke maps atau fitur cek stok otomatis.

---

## Analisis Utang Teknis (Technical Debt)

Meskipun jalan ini paling simpel (tanpa migrasi), ada beberapa trade-off yang perlu disadari:
-   **Skalabilitas**: Jika jaringan SSM bertumbuh hingga puluhan cabang, mengelola JSON dalam satu field `settings` akan menjadi sulit dan rawan kesalahan penulisan (*parsing error*).
-   **Filter Kompleks**: Melakukan filter "Motor yang ada di Bekasi Utara" akan memakan resource lebih besar jika harus mem-parsing JSON koordinat setiap saat (dibandingkan menggunakan query `WHERE branch_id = ...`).
-   **Rekomendasi Jangka Panjang**: Jika bisnis berkembang pesat, disarankan untuk melakukan migrasi ke tabel `branches` formal untuk keamanan relasional.

---

## Langkah Implementasi Selanjutnya
1.  **Refactor Seeder**: Menstandarisasi semua cabang sales masuk ke satu key setting pusat (`dealer_network`).
2.  **Integrasi Controller**: Menghubungkan logika `Setting::get('dealer_network')` ke dalam flow `MotorController` dan `ServiceAppointmentController`.
3.  **UI Update**: Menambahkan seksi "Tersedia juga di Cabang Lain" pada `Motors/Show.jsx` dan fitur "Cabang Terdekat" di dropdown Booking.

---
*Dibuat oleh Antigravity Assistant untuk SRB Motor.*
