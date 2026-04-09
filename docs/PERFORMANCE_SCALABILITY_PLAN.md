# 🚀 Master Plan 2.0: Optimasi Performa, Skalabilitas & Stabilitas (SRB Motor)

Dokumen ini adalah peta jalan (Roadmap) teknis termutakhir untuk menjadikan ekosistem SRB Motor (Web & Android) memiliki performa kelas industri tanpa mengorbankan stabilitas sistem.

---

## 📖 Prinsip Utama (Master Principles)
1.  **Mobile-First Performance**: Mengurangi beban data seminimal mungkin untuk aplikasi Android.
2.  **API Stability Guarantee**: Memastikan setiap pembaruan sistem tidak merusak koneksi dengan `SrbMotorApp`.
3.  **Data Integrity**: Keamanan data adalah prioritas di atas kecepatan.

---

## ⚡ FASE 0: MONITORING & VISUAL QUICK-WINS (Fokus: Kecepatan Muat)
*Tujuan: Memberikan dampak instan yang terlihat oleh pengguna.*

### 0.1 Optimasi Gambar (WebP Conversion)
*   **Masalah**: File gambar `.jpg` atau `.png` berukuran besar (1MB+) memperlambat loading galeri.
*   **Tindakan**: Implementasi otomatisasi konversi gambar ke format `.webp` saat admin mengunggah aset.
*   **Manfaat**: Ukuran file turun hingga 70% tanpa mengurangi kualitas visual.

### 0.2 Instalasi Monitoring (Laravel Pulse)
*   **Tindakan**: Memasang dashboard pemantau performa *real-time*.
*   **Manfaat**: Mengidentifikasi query lambat dan beban CPU secara akurat, bukan tebakan.

---

## 🚀 FASE 1: EFISIENSI DATA & ANTREAN (Fokus: Responsivitas)
*Tujuan: Menghilangkan jeda waktu pada transaksi.*

### 1.1 Laporan Kilat (SQL Aggregation)
*   **Tindakan**: Menghindari pengambilan data massal ke RAM. Gunakan `SUM()` dan `COUNT()` langsung di level database.
*   **Manfaat**: Dashboard admin tetap ringan meski data transaksi mencapai jutaan baris.

### 1.2 Background Jobs (Laravel Queues)
*   **Tindakan**: Memisahkan pengiriman notifikasi WhatsApp dari alur utama pemesanan.
*   **Manfaat**: Tombol "Pesan Sekarang" akan merespon < 1 detik.

---

## 🏗️ FASE 2: INTEGRITAS ARSITEKTUR & API (Fokus: Keamanan Mobile)
*Tujuan: Memisahkan "Dapur" (Logika) dari "Meja Saji" (Tampilan).*

### 2.1 Service Layer & JSON Resources
*   **Tindakan**: Memisahkan logika bisnis ke `OrderService` dan menggunakan `JsonResource` untuk memformat output API.
*   **Manfaat**: **Proteksi API Android**. Meskipun kode di belakang layar berubah total, format data yang dikirim ke aplikasi mobile tetap identik (tidak rusak).

### 2.2 Reusable Validation (Form Requests)
*   **Tindakan**: Menstandarisasi validasi data agar konsisten antara Web dan Mobile.

---

## ⚡ FASE 3: KEAMANAN & SKALABILITAS (Fokus: High Availability)
*Tujuan: Kesiapan untuk menangani traffik yang lebih besar.*

### 3.1 Brankas Transaksi (DB Transactions)
*   **Tindakan**: Menggunakan `DB::transaction()` untuk memastikan proses simpan data order, log, dan cicilan bersifat "All or Nothing".

### 3.2 Redis Cache & Sessions
*   **Tindakan**: Migrasi penyimpanan Cache dan Session dari file ke **Redis**.
*   **Manfaat**: Kecepatan akses data berulang meningkat 5x lipat dan aplikasi siap dijalankan di banyak server sekaligus (Load Balancing).

---

## 📱 Protokol Keamanan Android (SrbMotorApp)
Untuk menjamin aplikasi Android tetap berjalan lancar selama optimasi:
1.  **Versioning**: Menambahkan header versi pada API.
2.  **Compatibility Test**: Setiap perubahan pada Controller wajib diuji menggunakan Postman untuk memastikan response JSON tidak berubah kunci/key-nya.
3.  **Asset Delivery**: Path gambar di API akan selalu diarahkan ke URL statis yang optimal.

---

## 📊 Tabel Target Performa 2.0

| Fitur | Status Sekarang | Target Master Plan 2.0 |
| :--- | :--- | :--- |
| **Ukuran Gambar Galeri** | 1.2 MB (Avg) | 300 KB (WebP) |
| **Response Time API** | 800ms - 2s | < 200ms |
| **Stabilitas Data** | Risiko Interupsi | 100% Atomik (Transaction) |
| **Monitoring** | Manual | Real-time Dashboard (Pulse) |

---
## 💡 Maintenance Command
Pastikan 'Worker' selalu menyala untuk memproses antrean:
```bash
php artisan queue:work --tries=3
```
