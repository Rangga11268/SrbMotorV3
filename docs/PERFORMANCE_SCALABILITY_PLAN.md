# 🛠️ Master Plan: Optimasi Performa & Skalabilitas (SRB Motor)

Dokumen ini adalah peta jalan (Roadmap) teknis untuk meningkatkan kecepatan, stabilitas, dan kemudahan pemeliharaan aplikasi SRB Motor.

---

## 📖 Daftar Istilah (Glosarium)
Agar kita memiliki pemahaman yang sama, berikut adalah istilah kunci yang digunakan dalam rencana ini:
*   **Aggregation**: Proses menghitung data (Total, Rata-rata, Jumlah).
*   **Queue (Antrean)**: Menjalankan tugas berat (seperti kirim WA) di "belakang layar" agar user tidak perlu menunggu.
*   **Fat Controller**: Istilah untuk Controller yang terlalu banyak menampung logika, sehingga sulit dibaca.
*   **Service Layer**: "Dapur" khusus tempat memasak logika bisnis, membuat Controller tetap bersih.
*   **Index**: "Daftar isi" pada database agar pencarian data tidak harus memindai seluruh tabel.

---

## 🚀 FASE 1: PERFORMA & PENGALAMAN PENGGUNA (Prioritas: SANGAT TINGGI)
*Fokus: Membuat aplikasi terasa kilat dan menghemat penggunaan RAM server.*

### 1.1 Laporan Kilat (SQL Aggregation)
*   **Analogi**: Ibarat menghitung total belanjaan. Cara lama: Mengambil semua barang dari rak ke meja kasir baru dihitung pelan-pelan. Cara baru: Kasir langsung melihat label total di rak.
*   **Masalah**: Menarik ribuan data transaksi ke RAM server hanya untuk menghitung total pendapatan.
*   **Tindakan**: Mengubah `ReportController` agar database langsung menghitung `SUM()` dan `COUNT()`.
*   **Manfaat**: Laporan muncul instan, penggunaan RAM server turun drastis (hingga 90%).

### 1.2 Transaksi Tanpa Jeda (Laravel Queues)
*   **Analogi**: Seperti memesan kopi. Cara lama: Anda harus berdiri diam di depan kasir sampai kopinya jadi. Cara baru (Queue): Anda dapat struk pemesanan, kasir langsung melayani orang berikutnya, dan kopi dibuatkan oleh barista di belakang.
*   **Masalah**: User harus menunggu WA terkirim sebelum halaman "Sukses" muncul. Jika API WA lemot, user merasa aplikasi hang.
*   **Tindakan**: Implementasi **Background Jobs** untuk kirim WA.
*   **Manfaat**: Pemesanan motor terasa instan bagi pembeli.

### 1.3 Jalan Pintas Data (Database Indexing)
*   **Masalah**: Pencarian data status atau tanggal transaksi lambat karena database harus membaca jutaan baris satu per satu.
*   **Tindakan**: Menambah `Index` pada kolom `status` dan `created_at`.
*   **Manfaat**: Pencarian data dan filter laporan jadi 10x lebih cepat.

---

## 🏗️ FASE 2: INTEGRITAS ARSITEKTUR (Prioritas: SEDANG)
*Fokus: Membersihkan kode agar aplikasi mudah dikembangkan di masa depan.*

### 2.1 "Dapur Khusus" (Service Layer Pattern)
*   **Masalah**: File `MotorGalleryController` terlalu gemuk (1100+ baris). Mencampur urusan tampilan dengan urusan hitung-hitungan rumus kredit.
*   **Tindakan**: Memindahkan logika pembuatan order ke `OrderService`.
*   **Manfaat**: Kode lebih rapi, mudah diperbaiki jika ada bug, dan mudah dites.

### 2.2 Reusable Validation (Form Requests)
*   **Tindakan**: Memindahkan aturan validasi input ke file tersendiri.
*   **Manfaat**: Menghilangkan 200+ baris kode "sampah" dari Controller utama.

---

## ⚡ FASE 3: KECEPATAN & KEAMANAN DATA (Final Polish)
*Fokus: Melindungi data dan mempercepat akses data berulang.*

### 3.1 Brankas Transaksi (Database Transactions)
*   **Masalah**: Saat order dibuat, sistem menulis ke tabel transaksi, log, dan cicilan. Jika listrik mati di tengah proses, data bisa "setengah jadi" (corrupt).
*   **Tindakan**: Menggunakan `DB::transaction()`: Semua berhasil ditulis, atau semua dibatalkan jika ada satu error.
*   **Manfaat**: Data transaksi dijamin 100% akurat dan konsisten.

### 3.2 Ingatan Cepat (Laravel Caching)
*   **Masalah**: Database terus ditanya hal yang sama berkali-kali (contoh: "Apa saja merk motor yang ada?").
*   **Tindakan**: Menyimpan daftar Merk dan Tipe di Cache selama 24 jam.
*   **Manfaat**: Mengurangi beban kerja database secara signifikan.

---

## 📊 Tabel Target Perbaikan

| Fitur | Status Sekarang | Target Setelah Optimasi |
| :--- | :--- | :--- |
| **Buka Laporan** | Lambat jika data > 1000 | Instan berapa pun jumlah datanya |
| **Pesan Motor** | Menunggu WA (~3-5 detik) | Instan (< 1 detik) |
| **RAM Server** | Tinggi (Memory Leak) | Stabil & Rendah |
| **Kesehatan Kode** | Sulit dipelihara (Fat) | Rapi & Terstandarisasi (Clean) |

---
## 💡 Instruksi Pemeliharaan (Maintenance)
Setelah rencana ini dijalankan, satu hal yang harus dipastikan menyala adalah:
```bash
php artisan queue:work
```
*Ini adalah "barista" yang bertugas membuatkan kopi (mengirim WA) di belakang layar.*
