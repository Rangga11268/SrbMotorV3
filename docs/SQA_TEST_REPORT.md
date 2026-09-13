# 📊 Laporan Pengujian Software Quality Assurance (SQA) - SRB Motor

Dokumen ini berisi hasil pengujian fungsional yang mendalam terhadap sistem SRB Motor, disusun mengikuti standar dokumentasi QA profesional.

---

## 📋 Informasi Pengujian
*   **Objek Pengujian**: Website SRB Motor V2 (Enterprise-Ready Audit)
*   **Nama Penguji**: [Nama Anda]
*   **Lingkungan**: Local Windows (Laragon) + PHP 8.2 + MySQL

---

## 🧪 Tabel Kasus Pengujian (Comprehensive Test Case Report)

| Test Case ID | Preconditions | Test Steps | Input Data | Expected Results | Actual Results | Test Environment | Execution Status | Bug Severity | Bug Priority | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SQA-TC-01** | User di halaman galeri motor | 1. Klik dropdown filter merk<br>2. Pilih "Yamaha"<br>3. Amati hasil filter | Brand: *Yamaha* | Menampilkan icon/daftar motor Yamaha | Sesuai | Localhost (Chrome) | **PASS** | - | - | Filter Akurat |
| **SQA-TC-02** | Admin login & berada di halaman Daftar Pengajuan Kredit | 1. Klik dropdown filter Status<br>2. Pilih opsi "Ditarik Leasing"<br>3. Amati hasil filter | Filter: *ditarik_leasing* | Dropdown menampilkan opsi "Ditarik Leasing" dan sistem berhasil memfilter daftar kredit terkait. | Opsi `ditarik_leasing` tidak muncul di dropdown karena sistem hanya mengambil status dari data yang sudah ada (dinamis). | Localhost (Chrome) | **FAIL** | Medium | Medium | Logika filter bergantung pada ketersediaan data awal (BUG-001). |
| **SQA-TC-03** | Kuota mekanik penuh | 1. Masuk ke menu Reservasi<br>2. Pilih tanggal yang penuh<br>3. Amati respon sistem | Date: *Full* | Tanggal otomatis terkunci (Disabled) & tidak bisa dipilih. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Auto-lock aktif |
| **SQA-TC-04** | Status transaksi pending | 1. Buka dashboard pembayaran<br>2. Pilih transaksi pending<br>3. Bayar via Midtrans<br>4. Amati status | Amount: *500k* | Status transaksi otomatis berubah jadi lunas secara real-time. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Real-time update |
| **SQA-TC-05** | Admin cek kredit | 1. Buka halaman pengajuan kredit<br>2. Klik tombol "Approve"<br>3. Amati pengiriman notifikasi | Action: *Approve* | Sistem menyetujui dan mengirimkan notifikasi WhatsApp ke pelanggan. | Sesuai | Localhost (Chrome) | **PASS** | - | - | WA berhasil |
| **SQA-TC-06** | Admin edit stok | 1. Buka form edit stok motor<br>2. Ubah nilai stok menjadi 0<br>3. Simpan & amati galeri | Stok: *0* | Produk otomatis memiliki badge "TERJUAL" & tombol order terkunci. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Extend & UI update berhasil |
| **SQA-TC-07** | Guest ingin login instan | 1. Klik "Lanjut dengan Google"<br>2. Selesaikan login di Google Popup | Google SSO | User berhasil masuk ke dashboard tanpa registrasi manual. | Sesuai | Localhost (Chrome) | **PASS** | - | - | OAuth lancar |
| **SQA-TC-08** | Guest di halaman detail motor | 1. Ubah DP dan Tenor pada widget simulasi<br>2. Periksa angka angsuran | DP/Tenor | Angka angsuran bulanan berubah secara dinamis dan akurat. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Simulasi akurat |
| **SQA-TC-09** | Customer mengunggah dokumen | 1. Pilih file .exe untuk KTP<br>2. Klik upload | File: *.exe* | Sistem menolak file dan menampilkan pesan error validasi. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Validasi file aktif |
| **SQA-TC-10** | Customer punya tunggakan cicilan | 1. Pilih 3 cicilan sekaligus<br>2. Klik bayar | Multi-pay | Total tagihan di Midtrans sama dengan jumlah 3 cicilan tersebut. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Bulk payment OK |
| **SQA-TC-11** | Guest lupa password | 1. Klik "Lupa Password"<br>2. Masukkan email & klik reset | Email Reset | Email instruksi terkirim dan password berhasil diubah via link. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Recovery sukses |
| **SQA-TC-12** | Customer setelah bayar cicilan | 1. Buka detail cicilan PAID<br>2. Klik "Unduh Kwitansi" | Receipt Download | Sistem mengunduh file kwitansi (PDF/Image) dengan data yang benar. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Kwitansi digital OK |
| **SQA-TC-13** | Customer memiliki notifikasi baru | 1. Klik ikon lonceng<br>2. Klik "Tandai Sudah Dibaca" | Notification ID | Jumlah notifikasi (badge) berkurang dan status berubah jadi read. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Manajemen notif OK |
| **SQA-TC-14** | Customer mencoba akses `/admin` | 1. Masukkan URL admin manual saat login sebagai Customer | URL: */admin* | Sistem menolak akses dan melakukan redirect ke `/dashboard` atau `/`. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Middleware security |
| **SQA-TC-15** | Customer cek riwayat servis | 1. Buka menu Servis<br>2. Lihat daftar riwayat | Service History | Menampilkan data servis lengkap (Tgl, Mekanik, Deskripsi). | Sesuai | Localhost (Chrome) | **PASS** | - | - | Riwayat servis OK |
| **SQA-TC-16** | Owner ingin melihat performa | 1. Buka Laporan Strategis<br>2. Klik "Ekspor Excel" | Export Action | Sistem mengunduh file Excel berisi data penjualan motor. | File terunduh, namun format kolom tanggal berantakan (Bug-02). | Localhost (Chrome) | **FAIL** | Minor | Low | Export terganggu format |
| **SQA-TC-17** | Owner mengelola staff | 1. Buka menu Manajemen User<br>2. Tambah staff baru | Role: *Staff/Admin* | Staff baru berhasil dibuat dan bisa login ke panel admin. | Sesuai | Localhost (Chrome) | **PASS** | - | - | User management OK |
| **SQA-TC-18** | Customer melakukan checkout | 1. Buka 2 tab untuk motor yang sama (stok tinggal 1)<br>2. Klik bayar hampir bersamaan | Race Condition | Sistem hanya membolehkan satu orang sukses, yang lain mendapat error "Stok Habis". | Sesuai | Localhost (Chrome) | **PASS** | - | - | Race condition handled |
| **SQA-TC-19** | Admin memantau log aktivitas | 1. Buka log audit sistem<br>2. Periksa entri terakhir | Action Log | Menampilkan aktivitas terakhir (siapa melakukan apa, kapan). | Sesuai | Localhost (Chrome) | **PASS** | - | - | Auditing aktif |
| **SQA-TC-20** | User melakukan logout | 1. Klik tombol Logout<br>2. Klik tombol "Back" di browser | Session Clear | User kembali ke landing page dan tidak bisa mengakses dashboard via tombol back. | Sesuai | Localhost (Chrome) | **PASS** | - | - | Session destroyed |

---

## 📊 Ringkasan Temuan (Bug Reports)

| Bug ID | Terkait TC | Deskripsi Singkat | Severity | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | SQA-TC-02 | Dropdown filter status di halaman daftar kredit tidak menampilkan opsi `ditarik_leasing` jika data belum ada. | Medium | Medium | **Open** |
| **BUG-02** | SQA-TC-16 | Format tanggal pada file Excel Laporan Penjualan tidak terbaca sebagai format Date (berubah jadi string mentah). | Minor | Low | **Open** |

> **Catatan:** 18 dari 20 test case berhasil (**90% Pass Rate**). Ditemukan **2 bug** (1 Medium, 1 Minor).

---

## 🛠️ Rekomendasi Selanjutnya
Fokus perbaikan pada integrasi library Excel (`maatwebsite/excel`) untuk standarisasi format tanggal di laporan Owner.

---
> [!IMPORTANT]
> Laporan ini telah diperluas menjadi **20 Test Case** untuk mencakup seluruh aspek fungsional, keamanan, dan manajemen strategis SRB Motor v2.
