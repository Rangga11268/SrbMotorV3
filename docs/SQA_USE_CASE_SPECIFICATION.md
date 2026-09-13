# 📊 Spesifikasi Use Case & Katalog Test Case (End-to-End SQA)

Dokumen ini adalah daftar lengkap fungsionalitas yang harus diuji untuk memastikan kualitas sistem SRB Motor v2.

---

## 🛡️ 1. Fungsionalitas Pelanggan (Guest/Customer)

### [A] Katalog & Filter (UC-G01)
*   **Kebutuhan**: Filter ketersediaan motor berdasarkan merk tertentu.
*   **TC-01**: Memilih merk "Yamaha" di galeri, memastikan hanya unit Yamaha yang tampil.

### [B] Reservasi Servis & Quota Lock (UC-C40)
*   **Kebutuhan**: Deteksi beban kerja mekanik & auto-lock tanggal penuh.
*   **TC-02**: Mencoba memilih tanggal yang kuotanya sudah habis (10/10), memastikan tanggal tersebut *disabled*.

### [C] Payment Gateway - Midtrans Sync (UC-C30)
*   **Kebutuhan**: Integrasi Midtrans & Update status real-time.
*   **TC-03**: Melakukan pembayaran via VA/Gopay, memastikan status di dashboard berubah jadi "Lunas" tanpa refresh.

### [D] Simulasi Kredit (UC-G02-Ext)
*   **Kebutuhan**: Akurasi perhitungan angsuran berdasarkan DP dan Tenor.
*   **TC-04**: Mengubah nilai DP dan Tenor pada halaman detail, memastikan angka angsuran bulanan berubah sesuai rumus (OTR - DP + Bunga).

---

## 🛠️ 2. Fungsionalitas Administrator (Admin/Owner)

### [E] Pemantauan & Filter Kredit (UC-A10)
*   **Kebutuhan**: Pemfilteran akurat status pengajuan kredit.
*   **TC-05**: Admin memfilter status "ditarik_leasing", memastikan sistem menampilkan data yang tepat.

### [F] Verifikasi Kredit & Notifikasi WA (UC-A11)
*   **Kebutuhan**: Opsi Approve/Reject dengan notifikasi WhatsApp manual.
*   **TC-06**: Admin klik "Approve", memastikan popup WhatsApp terbuka dengan template pesan yang benar.

### [G] Manajemen Inventaris & Logika Kondisional (UC-A20)
*   **Kebutuhan**: UI otomatis berubah jika stok 0.
*   **TC-07**: Mengubah stok motor di admin jadi 0, memastikan di galeri publik muncul badge "TERJUAL" dan tombol order terkunci.

---

## 🚀 3. Fungsionalitas Tambahan (Lifecycle & Security)

### [H] Autentikasi Google OAuth (TC-08)
*   **Kebutuhan**: Registrasi/Login instan pihak ketiga.
*   **TC-08**: Klik "Lanjut dengan Google", memastikan user masuk ke dashboard tanpa mengisi form registrasi.

### [I] Lupa Kata Sandi (TC-09)
*   **Kebutuhan**: Pemulihan akun via email.
*   **TC-09**: Klik "Lupa Password", memasukkan email, memastikan link reset terkirim dan password baru bisa digunakan.

### [J] Manajemen Dokumen Kredit (TC-10)
*   **Kebutuhan**: Validasi format dan ukuran file (KTP/KK).
*   **TC-10**: Mencoba mengunggah file non-gambar (misal: .exe), memastikan sistem menolak dan memunculkan error.

### [K] Bulk Payment Cicilan (TC-11)
*   **Kebutuhan**: Pembayaran beberapa bulan sekaligus dalam satu invoice.
*   **TC-11**: Memilih 3 bulan cicilan sekaligus, memastikan total tagihan di Midtrans sesuai dengan jumlah ketiganya.

### [L] Edit Profil & Keamanan (TC-12)
*   **Kebutuhan**: Perubahan data diri dan password oleh user.
*   **TC-12**: Mengubah password di halaman profil, memastikan user lama ter-logout dan harus login dengan password baru.

### [M] Reschedule Survei (TC-13)
*   **Kebutuhan**: Permintaan perubahan jadwal survei oleh customer.
*   **TC-13**: Customer klik "Request Reschedule", memasukkan alasan, memastikan admin menerima notifikasi perubahan tersebut.

### [N] Download Kwitansi Digital (TC-14)
*   **Kebutuhan**: Bukti bayar sah dalam format PDF/Image.
*   **TC-14**: Klik "Unduh Kwitansi" setelah status lunas, memastikan file berhasil diunduh dan datanya akurat (Nama, Tanggal, Nominal).

---
> [!IMPORTANT]
> Ke-14 Test Case ini mencakup **seluruh fungsionalitas kritis** sistem. Kegagalan pada salah satu TC ini dianggap sebagai *Critical Bug*.
