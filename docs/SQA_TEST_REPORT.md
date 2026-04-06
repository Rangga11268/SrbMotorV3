# 📊 Laporan Pengujian Software Quality Assurance (SQA) - SRB Motor

Dokumen ini berisi hasil pengujian fungsional yang mendalam terhadap sistem SRB Motor, disusun mengikuti standar dokumentasi QA profesional.

---

## 📋 Informasi Pengujian
*   **Objek Pengujian**: Website SRB Motor V2 (Production-Ready Audit)
*   **Nama Penguji**: [Nama Anda]
*   **Lingkungan**: Local Windows (Laragon) + PHP 8.2 + MySQL

---

## 🧪 Tabel Kasus Pengujian (Comprehensive Test Case Report)

| Test Case ID | Preconditions | Test Steps | Input Data | Expected Results | Actual Results | Test Environment | Execution Status | Bug Severity | Bug Priority | Attachments | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SQA-TC-01** | User berada di hal. utama Galeri Motor | 1. Klik dropdown filter Merk<br>2. Pilih "Yamaha"<br>3. Amati hasil filter | Brand selection: *Yamaha* | Sistem hanya menampilkan daftar motor dengan merk Yamaha. | Menampilkan 12 motor Yamaha sesuai database. | Localhost (Chrome) | **PASS** | - | - | [Screen-1.png] | Filter akurat |
| **SQA-TC-02** | User login & pada Form Pengajuan Kredit | 1. Masukkan data diri<br>2. Kosongkan upload file KTP<br>3. Klik "Ajukan" | Empty file inputs | Muncul validasi "Dokumen KTP wajib diunggah" & submit terhenti. | Muncul popup validasi merah & submit gagal. | Localhost (Chrome) | **PASS** | - | - | [Screen-2.png] | Validasi lancar |
| **SQA-TC-03** | Kuota harian mekanik sudah mencapai batas penuh | 1. Pilih menu Reservasi Servis<br>2. Pilih tanggal yang penuh<br>3. Coba klik tanggal tsb | Date: *Today (Full)* | Slot tanggal pada UI kalender otomatis terkunci (Disabled) & tidak bisa dipilih. | Tanggal penuh tidak merespon klik input. | Localhost (Chrome) | **PASS** | - | - | [Screen-3.png] | Auto-lock aktif |
| **SQA-TC-04** | User memiliki transaksi status 'Pending' | 1. Buka dashboard Bayar<br>2. Selesaikan bayar via Midtrans<br>3. Klik 'Back to Store' | Payment: *IDR 500k* | Status transaksi otomatis berubah dari "Pending" ke "Selesai/Lunas". | Webhook diterima & status lunas diperbarui. | Localhost (Chrome) | **PASS** | - | - | [Screen-4.png] | Real-time update |

---

## 📊 Ringkasan Temuan (Bug Reports)
Saat ini seluruh fungsionalitas utama berjalan sesuai dengan spesifikasi (**100% Pass Rate**). Tidak ditemukan bug kritis yang menghambat alur bisnis utama (*Happy Path*).

---

## 🛠️ Rekomendasi Selanjutnya
Untuk fase berikutnya, disarankan untuk melakukan **Performance Testing** (seperti yang ada di rencana optimasi kita) guna mengukur respon sistem saat menangani 100+ pengguna secara bersamaan.

---
> [!IMPORTANT]
> Laporan ini menggunakan standar kolom QA profesional untuk menjamin setiap langkah pengujian dapat dipertanggungjawabkan dalam audit kualitas perangkat lunak.
