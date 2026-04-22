# 📋 SRB Motor — Use Case Per Flow (Dengan Aktor Sistem)

> Dokumen ini memetakan semua alur interaksi di sistem SRB Motor secara lengkap, termasuk respons dan aksi yang dilakukan oleh **Aktor Sistem** (backend, Midtrans, WhatsApp/Fonnte API, dan mekanisme otomatis lainnya).

---

## Daftar Aktor

| Simbol | Nama Aktor        | Tipe      | Deskripsi                                                                       |
| ------ | ----------------- | --------- | ------------------------------------------------------------------------------- |
| 👤     | **Guest**         | External  | Pengunjung belum login. Akses terbatas hanya informasi publik.                  |
| 🛒     | **Customer**      | External  | Pengguna terdaftar. Melakukan pembelian, servis, pembayaran.                    |
| 🔧     | **Admin**         | Internal  | Staf operasional. Mengelola inventori, transaksi, dan servis.                   |
| 👑     | **Owner**         | Internal  | Super Admin. Akses penuh: laporan keuangan, manajemen staf.                     |
| ⚙️     | **System**        | Internal  | Backend Laravel + cron jobs + auto-triggers.                                    |
| 💳     | **Midtrans**      | External  | Payment Gateway pihak ketiga. Mengirim konfirmasi via Webhook.                  |
| 📱     | **WhatsApp API**  | External  | Fonnte API. Mengirimkan notifikasi otomatis ke Customer dan Admin.              |
| 🗄️     | **Database**      | Internal  | MySQL — penyimpanan seluruh data transaksi, user, motor, cicilan.               |
| 📲     | **Mobile App**    | External  | Aplikasi Android/iOS SRB Motor. Menggunakan REST API (`/api/*` + Sanctum).     |
| 🏢     | **Leasing**       | External  | Lembaga pembiayaan eksternal (BAF, Adira, dll.) yang memutuskan kredit.         |

---

## FLOW 1: Registrasi Akun Baru (Email)

**Aktor:** 👤 Guest, ⚙️ System, 📱 WhatsApp API

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Guest    | Membuka modal "Daftar" di navbar, mengisi Nama, Email, Password
2       | System   | Memvalidasi: email unik, password match, format valid
3       | System   | Membuat record di tabel `users` (role=user, email_verified_at=null)
4       | System   | Melakukan **Auto-Login** dan membuat session auth aktif
5       | System   | Redirect ke halaman **Katalog Motor** (`motors.index`)
6       | System   | Menampilkan flash message: "Akun berhasil dibuat! Selamat datang..."
7       | System   | Mengirim email verifikasi (Laravel Signed URL) di latar belakang
```

**Alur Alternatif (Email sudah terdaftar):**
- Step 2 → System mengembalikan error validasi: "Email sudah terdaftar."

**Post-condition:** Akun terbuat, session aktif (**Aktor berubah menjadi Customer**), diarahkan ke Katalog. Email verifikasi dikirim namun tidak memblokir akses awal.

---

## FLOW 2: Login via Google SSO

**Aktor:** 👤 Guest, ⚙️ System, 🌐 Google OAuth

```
Langkah | Aktor       | Aksi
--------|-------------|-----
1       | Guest       | Klik "Masuk dengan Google"
2       | System      | Redirect ke /auth/google → Google OAuth consent screen
3       | Google      | User memilih akun Google, menyetujui izin akses
4       | Google      | Mengirim authorization code ke /auth/google/callback
5       | System      | Menukar kode dengan profil Google (nama, email, photo)
6       | System      | Cek: jika email belum ada di DB → buat akun baru otomatis
7       | System      | Cek: jika email sudah ada → link akun Google ke user yang ada
8       | System      | Buat session auth, redirect ke halaman sebelumnya atau beranda
```

**Post-condition:** Session aktif. Jika akun baru, `email_verified_at` langsung terisi.

---

## FLOW 3: Verifikasi Email

**Aktor:** 🛒 Customer, ⚙️ System

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Customer | Membuka email, mengklik link verifikasi
2       | System   | Memvalidasi Signed URL (kee sah dan belum expire)
3       | System   | Mengisi kolom `email_verified_at` di tabel `users`
4       | System   | Redirect ke beranda dengan flash message sukses
```

**Sub-flow: Kirim Ulang Verifikasi**
```
1   | Customer | Klik "Kirim Ulang" di halaman verifikasi
2   | System   | Throttle cek (max 6/menit). Jika lolos → kirim email baru
3   | System   | Flash message: "Email verifikasi telah dikirim!"
```

---

## FLOW 4: Logout

**Aktor:** 🛒 Customer / 🔧 Admin / 👑 Owner, ⚙️ System

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | User     | Klik "Keluar" di navbar/sidebar
2       | System   | Menghapus session auth dari tabel `sessions`
3       | System   | Redirect ke halaman beranda
```

---

## FLOW 5: Eksplorasi Katalog Motor

**Aktor:** 👤 Guest / 🛒 Customer, ⚙️ System, 🗄️ Database

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | User     | Akses /motors — Halaman Katalog
2       | System   | Query: Motor::where(tersedia=true) dengan pagination 12/halaman
3       | System   | Render kartu motor: foto utama, nama, harga, badge stok/habis
4       | User     | Mengetik di search bar — live search via /api/search/motors
5       | System   | Query dengan filter: nama/merek/tipe/tahun/range harga
6       | System   | Mengembalikan hasil JSON tanpa reload halaman
7       | User     | Klik kartu motor → detail page /motors/{id}
8       | System   | Query eager-load: motor + galleries + financingSchemes + branches
9       | System   | Render BranchSelector komponen di sidebar
10      | System   | Render 4 motor terkait (merek sama, id berbeda)
```

---

## FLOW 6: Pemilihan Cabang via GPS

**Aktor:** 👤 Guest / 🛒 Customer, ⚙️ System, 🗄️ Database, 📡 Geolocation API

```
Langkah | Aktor          | Aksi
--------|----------------|-----
1       | User           | Di halaman detail motor, klik "Cari Cabang Terdekat"
2       | Browser        | Meminta izin akses GPS dari user
3       | User           | Memberikan izin lokasi
4       | Browser        | Menyediakan koordinat (latitude, longitude)
5       | System (JS)    | Mengirim GET /api/branches?motor_id={id}&latitude=...&longitude=...
6       | System (PHP)   | Mengambil semua cabang aktif dari `settings` (cached 1 jam)
7       | System (PHP)   | 1 query: hitung stok motor di semua cabang sekaligus (groupBy)
8       | System (PHP)   | Hitung jarak tiap cabang dengan Haversine Formula
9       | System (PHP)   | Merge data cabang + stok, sortBy('distance'), ->values()
10      | System (PHP)   | Kembalikan JSON: [{name, address, distance, stock: {available, count}}]
11      | User           | Memilih cabang dari daftar hasil
12      | System (JS)    | Simpan branch_code sebagai query parameter untuk form order
```

**Alur Alternatif (GPS Ditolak):**
- Step 3 → User menolak → System menampilkan error: "Browser Anda tidak mengizinkan akses GPS."
- User tetap bisa memilih cabang manual dari dropdown.

---

## FLOW 7: Pembelian Tunai (Cash Order)

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database, 📱 WhatsApp API

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Di detail motor, klik "Beli Tunai" → redirect /motors/{id}/cash-order?branch=CODE
2       | Customer  | Mengisi form: Nama, NIK, Telepon, Email, Alamat, Warna, Metode Pengambilan, Tgl Pengambilan, Pekerjaan, Penghasilan, Catatan
3       | Customer  | (Opsional) Ubah cabang pickup dari dropdown "UBAH LOKASI"
4       | Customer  | Klik "Submit Pesanan"
5       | System    | Throttle check (max 15/menit)
6       | System    | Validasi form: semua field required, format nomor telepon, format NIK
7       | System    | Validasi motor: cek `tersedia == true` (race condition protection)
8       | System    | Cek duplikasi: apakah user sudah punya order aktif untuk motor ini?
9       | System    | Buat record di `transactions` (type=CASH, status=new_order, branch_code)
10      | System    | Buat log di `transaction_logs`: "Pesanan tunai baru dibuat"
11      | System    | Jika booking_fee > 0 → buat installment #0 (status=pending)
12      | System    | Buat installment #1 untuk sisa pembayaran (due_date = +7 hari)
13      | System    | Update status ke `waiting_payment` jika booking fee ada
14      | WhatsApp  | Kirim notifikasi ke Customer: "Pesanan Anda diterima, segera bayar Booking Fee"
15      | WhatsApp  | Kirim notifikasi ke Admin: "[ADMIN] Order Tunai Baru dari {nama}"
16      | System    | Redirect ke halaman konfirmasi pesanan
```

**Alur Alternatif (Motor Habis):**
- Step 7 → System return error: "Motor ini sedang tidak tersedia."

**Alur Alternatif (Order Duplikat):**
- Step 8 → System return error: "Anda sudah memiliki pesanan aktif untuk motor ini."

**Post-condition:** Record di `transactions`, `installments`, `transaction_logs`. Notification terkirim.

---

## FLOW 8: Pembelian Kredit (Credit Order)

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database, 📱 WhatsApp API

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Klik "Ajukan Kredit" → redirect /motors/{id}/credit-order?branch=CODE
2       | Customer  | Mengisi form: Nama, NIK (16 digit), Telepon, Pekerjaan, Lama Bekerja, Penghasilan Bulanan, Alamat, Warna Motor, Metode Pengambilan, DP Amount, Tenor (bulan), Catatan
3       | Customer  | Klik "Submit Pengajuan"
4       | System    | Throttle check (max 15/menit)
5       | System    | Validasi: NIK harus 16 digit, DP >= min_dp_amount motor, DP < harga motor
6       | System    | Validasi motor: `tersedia == true`
7       | System    | Cek duplikasi order aktif
8       | System    | Hitung: loan_amount = harga - DP; interest = 1.5%/bulan; cicilan = (loan + total_interest) / tenor
9       | System    | Buat record di `transactions` (type=CREDIT, status=menunggu_persetujuan, branch_code)
10      | System    | Buat log di `transaction_logs`
11      | System    | Buat record di `credit_details` (status=pengajuan_masuk, reference_number=REF-xxx)
12      | System    | Buat installment #0 sebagai tagihan DP (status=pending, due_date=+1 hari)
13      | WhatsApp  | Kirim ke Customer: "Pengajuan Kredit diterima, segera upload dokumen"
14      | WhatsApp  | Kirim ke Admin: "[ADMIN] Pengajuan Kredit Baru"
15      | System    | Redirect ke halaman upload dokumen /motors/{transaction}/upload-credit-documents
```

---

## FLOW 9: Upload & Manajemen Dokumen Kredit

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Akses /motors/{transaction}/upload-credit-documents
2       | Customer  | Upload KTP (foto depan) dan Kartu Keluarga (JPG/PNG/PDF, max 5MB)
3       | System    | Validasi file: format & ukuran
4       | System    | Simpan file ke storage/documents/, buat record di `documents`
5       | System    | Update credit_detail status ke dokumen diterima

# Sub-flow: Revisi Dokumen (Jika Ditolak Admin)
6       | Customer  | Menerima notifikasi "Dokumen Ditolak"
7       | Customer  | Akses /motors/{transaction}/manage-documents
8       | Customer  | Mengganti file dokumen yang ditolak
9       | System    | Simpan versi dokumen baru, reset status ke `menunggu_persetujuan`
```

---

## FLOW 10: Proses Approval Kredit oleh Admin

**Aktor:** 🔧 Admin, ⚙️ System, 🗄️ Database, 📱 WhatsApp API

```
Tahap  | Aktor    | Aksi                                                               | Status credit_details
-------|----------|---------------------------------------------------------------------|----------------------
1      | Admin    | Buka /admin/credits — Lihat daftar pengajuan                        | pengajuan_masuk
2      | Admin    | Review dokumen Customer satu per satu (KTP, KK)                     |
3a     | Admin    | Approve dokumen → POST /admin/documents/{id}/approve                | (per dokumen)
3b     | Admin    | Reject dokumen → POST /admin/documents/{id}/reject + alasan         | (per dokumen)
4      | System   | Jika semua dokumen approve → toggle ke verifyDocuments tersedia     |
5      | Admin    | POST /admin/credits/{id}/verify-documents                           | dikirim_ke_surveyor
6      | Admin    | Pilih leasing provider, POST /admin/credits/{id}/send-to-leasing    | dikirim_ke_leasing
7      | Admin    | Isi jadwal: tanggal, jam, nama surveyor, telp — POST schedule-survey | jadwal_survey
8      | System   | Buat record di `survey_schedules`, notifikasi ke Customer           |
9      | WhatsApp | Kirim jadwal survey ke Customer                                     |
10     | Customer | Konfirmasi kehadiran survey                                         |
11     | Admin    | POST /admin/credits/{id}/start-survey                               | survey_berjalan
12     | Admin    | POST /admin/credits/{id}/complete-survey + catatan                  | survey_selesai
13a    | Admin    | POST /admin/credits/{id}/approve + approved_amount + interest_rate  | disetujui
13b    | Admin    | POST /admin/credits/{id}/reject + rejection_reason                  | ditolak
14     | WhatsApp | Kirim notifikasi approval/rejection ke Customer                     |
15     | Admin    | POST /admin/credits/{id}/record-dp-payment + metode bayar           |
16     | System   | Update motor `tersedia = false` (Stock Locked)                      |
17     | Admin    | POST /admin/credits/{id}/complete                                   | selesai
```

**Alur Alternatif — Penarikan Unit (Repossess):**
```
*      | Admin    | POST /admin/credits/{id}/repossess + alasan                        | ditarik_leasing
*      | System   | Batalkan semua cicilan outstanding, log event
*      | System   | Update motor tersedia = true (unit kembali ke stok)
```

---

## FLOW 11: Pembayaran via Gateway Midtrans

**Aktor:** 🛒 Customer, ⚙️ System, 💳 Midtrans, 🗄️ Database, 📱 WhatsApp API

```
Langkah | Aktor      | Aksi
--------|------------|-----
1       | Customer   | Pilih installment → klik "Bayar Online"
2       | System     | Validasi: jika DP kredit → credit harus status `disetujui` dulu
3       | System     | Buat Midtrans order params (order_id = INST-{id}-{timestamp})
4       | System     | POST ke Midtrans Snap API → terima `snap_token` + `redirect_url`
5       | System     | Simpan snap_token & midtrans_booking_code ke tabel `installments`
6       | System     | Kembalikan snap_token ke frontend
7       | Customer   | Frontend membuka Midtrans Snap popup (pilih: Transfer/QRIS/CC/dll)
8       | Customer   | Menyelesaikan proses pembayaran di Midtrans
9       | Midtrans   | Mengirim Webhook notification ke /midtrans/notification (async)
10      | System     | `PaymentService::updatePaymentStatus` memproses status webhook
11      | System     | Jika settlement/capture → `markAsPaid()` untuk SEMUA installment dengan booking_code sama
12      | System     | Update installment status = 'paid', `paid_at` = now()
13      | System     | Buat log di `transaction_logs`
14      | System     | Hitung ulang: apakah semua installment sudah paid?
15      | System     | Jika Ya (CASH) → update transaction status = `pembayaran_dikonfirmasi`
16      | System     | Jika installment #0 dibayar → status = `unit_preparation`
17      | System     | Jika total semua paid → lock motor: `tersedia = false`
18      | System     | Jika CASH + booking fee paid tapi installment #1 belum ada → buat otomatis
19      | WhatsApp   | Notifikasi ke Customer: "Pembayaran {typeLabel} berhasil terverifikasi"
20      | Customer   | Diarahkan ke /payments/success
```

**Alur Alternatif (Cek Status Manual):**
```
1  | Customer | Klik "Cek Status Pembayaran"
2  | System   | Query Midtrans API dengan midtrans_booking_code
3  | System   | Panggil PaymentService::updatePaymentStatus dengan respons terbaru
4  | System   | Update DB dan return status terkini ke frontend
```

**Alur Alternatif (Pembayaran Expire/Cancel):**
```
*  | Midtrans | Kirim webhook status = 'expire' atau 'cancel'
*  | System   | Update installment status = 'overdue'
```

---

## FLOW 12: Upload Bukti Bayar Manual (Offline)

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database, 📱 WhatsApp API

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Di halaman installment, klik "Upload Bukti Transfer"
2       | Customer  | Upload foto bukti transfer (JPG/PNG/GIF, max 2MB), pilih metode bayar
3       | System    | Validasi: file image, ukuran, format
4       | System    | Simpan ke storage/payment_proofs/
5       | System    | Update installment: status = 'waiting_approval', payment_proof, paid_at
6       | WhatsApp  | Notifikasi ke Admin: "[ADMIN] Bukti Pembayaran Baru dari {nama}"
7       | Admin     | Review bukti transfer di dashboard
8a      | Admin     | POST /admin/installments/{id}/approve
9a      | System    | Update installment status = 'paid'
9b      | System    | Jika installment #0 → lock motor: `tersedia = false`
10a     | WhatsApp  | Notifikasi ke Customer: "Pembayaran {typeLabel} DIVERIFIKASI"
8b      | Admin     | POST /admin/installments/{id}/reject
9b      | System    | Update installment status = 'pending' (Customer upload ulang)
10b     | WhatsApp  | Notifikasi ke Customer: "Bukti pembayaran DITOLAK, upload ulang"
```

---

## FLOW 13: Booking Servis Kendaraan

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database, 📱 WhatsApp API

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Akses /services/booking
2       | System    | Load daftar cabang dari `settings` (key: service_branches)
3       | System    | Load jam operasional dari `settings` (key: service_business_hours)
4       | Customer  | Pilih cabang & tanggal
5       | System    | GET /api/services/unavailable-dates → tampilkan tanggal penuh di kalender
6       | Customer  | Pilih tanggal tersedia
7       | System    | GET /api/services/available-slots?date=...&branch=... — hitung slot per jam
8       | System    | Baca `service_slot_quota` dari settings (default 5/slot)
9       | System    | Hitung: slot tersedia = quota - booking count per jam
10      | Customer  | Pilih slot jam (pagi/siang/sore), isi plat nomor, model motor, jenis servis, keluhan
11      | Customer  | Klik "Booking Sekarang"
12      | System    | Validasi: tanggal >= hari ini, slot valid
13      | System    | Double-booking check: plat+tanggal+cabang sudah ada? → error
14      | System    | Generate nomor antrian: A-01, A-02... (per cabang per hari)
15      | System    | Buat record di `service_appointments` (status=pending)
16      | WhatsApp  | Notifikasi ke Admin: "[ANTRIAN TERJADWAL] No.{queue} - {nama} - {plat}"
17      | WhatsApp  | Notifikasi ke Customer: tiket antrian berformat lengkap (nomor, tanggal, jam, plat)
18      | System    | Redirect ke /services dengan flash success
```

---

## FLOW 14: Update Status Servis oleh Admin

**Aktor:** 🔧 Admin, ⚙️ System, 📱 WhatsApp API

```
Langkah | Aktor    | Aksi                                        | Status Baru
--------|----------|---------------------------------------------|-------------
1       | Admin    | Buka /admin/services — daftar antrian        |
2       | Admin    | Klik Update Status                           |
2a      | Admin    | Ubah ke "confirmed"                          | confirmed
2b      | Admin    | Ubah ke "in_progress" (sedang dikerjakan)    | in_progress
2c      | Admin    | Ubah ke "completed" + catatan layanan        | completed
2d      | Admin    | Ubah ke "cancelled" + alasan                 | cancelled
3       | System   | Simpan admin_notes / service_notes           |
4       | System   | Jika cancelled oleh admin → set cancelled_by='admin', cancel_reason
5       | WhatsApp | Notifikasi ke Customer setiap perubahan status
```

---

## FLOW 15: Pembatalan Pesanan oleh Customer

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Buka halaman detail transaksi
2       | Customer  | Klik "Batalkan Pesanan"
3       | Customer  | Mengisi alasan pembatalan
4       | System    | Validasi: transaksi milik user ini?
5       | Customer  | Konfirmasi
6       | System    | POST /motors/{transaction}/cancel
7       | System    | Update: status = 'cancelled', cancelled_at = now(), cancellation_reason
8       | System    | Buat log di transaction_logs
9       | System    | (opsional) Jika motor belum dikirim → update motor `tersedia = true`
```

---

## FLOW 16: Manajemen Motor CRUD (Admin)

**Aktor:** 🔧 Admin / 👑 Owner, ⚙️ System, 🗄️ Database

```
# Tambah Motor Baru
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Admin    | Akses /admin/motors/create
2       | Admin    | Isi form: nama, merek, model, kategori, harga, min DP, warna, cabang, deskripsi, spesifikasi, status
3       | System   | Validasi form
4       | System   | Simpan ke tabel `motors`
5       | Admin    | (Extend) Upload foto galeri via /admin/motors/{id}/gallery
6       | System   | Simpan ke `motor_galleries`, tentukan foto utama

# Edit Motor
1       | Admin    | Akses /admin/motors/{id}/edit
2       | Admin    | Ubah field yang diinginkan
3       | System   | Update record motors

# Soft Delete (Draft)
1       | Admin    | Klik "Draft/Nonaktifkan"
2       | System   | Update status motor → Draft (tersedia = false)

# Hard Delete
1       | Admin    | Klik "Hapus Permanen"
2       | System   | Cek apakah motor ada di tabel `transactions`
2a      | System   | Jika YA → DB constraint/business rule mencegah → tampilkan error
2b      | System   | Jika TIDAK → hapus record dari `motors`
```

---

## FLOW 17: Update Status Transaksi Tunai (Admin)

**Aktor:** 🔧 Admin, ⚙️ System, 🗄️ Database

```
Status Flow:
new_order → waiting_payment → pembayaran_dikonfirmasi → unit_preparation → ready_for_delivery → dalam_pengiriman → completed
new_order → cancelled (kapan saja)
```

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Admin    | Buka /admin/transactions/{id}
2       | Admin    | POST /admin/transactions/{id}/status + new_status
3       | System   | Validasi transisi status yang valid
4       | System   | Update tabel `transactions`
5       | System   | Buat log di `transaction_logs`
```

---

## FLOW 18: Laporan & Export (Owner)

**Aktor:** 👑 Owner, ⚙️ System, 🗄️ Database

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Owner    | Akses /admin/reports
2       | Owner    | Pilih filter: tanggal awal, tanggal akhir, jenis transaksi, cabang, status
3       | System   | Query JOIN: transactions + motors + users (dengan filter terapan)
4       | Owner    | Klik "Preview" → /admin/reports/generate (tampil di browser)
5       | Owner    | Klik "Export PDF" → /admin/reports/export → System generate PDF via DomPDF
6       | Owner    | Klik "Export Excel" → /admin/reports/export-excel → System generate XLSX
7       | System   | Stream file ke browser (download langsung)
```

---

## FLOW 19: Manajemen Staf (Owner)

**Aktor:** 👑 Owner, ⚙️ System, 🗄️ Database

```
Operasi         | URL                              | Aksi
----------------|----------------------------------|-----
Lihat staf      | GET /admin/users                 | Daftar semua user dengan role admin
Edit staf       | GET /admin/users/{id}/edit       | Form edit data staf
Update staf     | PUT /admin/users/{id}            | Simpan perubahan data
Hapus staf      | DELETE /admin/users/{id}         | Hapus akun admin
Toggle Verify   | POST /admin/users/{id}/toggle-  | Aktifkan / suspend akun staf
```

---

## FLOW 20: Manajemen Settings & Cabang (Admin)

**Aktor:** 🔧 Admin, ⚙️ System, 🗄️ Database (tabel `settings`)

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Admin    | Akses /admin/settings
2       | System   | Tampilkan daftar settings per kategori (system, branches, service)
3       | Admin    | Pilih kategori "branches" → /admin/settings/branches/edit
4       | Admin    | Edit: nama, alamat, koordinat (latitude/longitude), jam operasional, nomor WhatsApp, fasilitas
5       | System   | PUT /admin/settings/branches → simpan ke tabel `settings`
6       | System   | Hapus cache branch (Cache::forget('branches:all'))
7       | System   | Data cabang baru langsung aktif di frontend tanpa restart
```

---

## FLOW 21: Notifikasi System

**Aktor:** ⚙️ System, 🛒 Customer / 🔧 Admin, 📱 WhatsApp API

```
Event Pemicu                                     | Penerima          | Channel
-------------------------------------------------|-------------------|--------
Order Tunai Baru dibuat                          | Admin             | WhatsApp
Order Kredit Baru dibuat                         | Admin             | WhatsApp
Dokumen berhasil diupload                        | (log internal)    | DB
Dokumen Kredit Disetujui/Ditolak Admin           | Customer          | WhatsApp + In-App
Jadwal Survey terjadwal                          | Customer          | WhatsApp + In-App
Status Servis berubah (confirmed/done/cancelled) | Customer          | WhatsApp
Bukti bayar cicilan diupload Customer            | Admin             | WhatsApp
Cicilan Diverifikasi Admin                       | Customer          | WhatsApp
Cicilan Ditolak Admin                            | Customer          | WhatsApp
Pembayaran Midtrans berhasil (webhook)           | Customer          | WhatsApp
Kredit Disetujui                                 | Customer          | WhatsApp
Booking Servis dibuat                            | Admin + Customer  | WhatsApp
```

---

## FLOW 22: Manajemen Cicilan Download Kwitansi

**Aktor:** 🛒 Customer, ⚙️ System

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Akses /installments — lihat semua cicilan
2       | System    | Query: transactions with installments + motor (user_id = auth)
3       | Customer  | Klik download kwitansi pada cicilan status 'paid'
4       | System    | Validasi: cicilan milik user ini? status == paid?
5       | System    | Load view: installments.receipt
6       | System    | Generate PDF via DomPDF
7       | System    | Stream: kuitansi-pembayaran-cicilan-{number}.pdf
```

---

## FLOW 23: Survey Confirmation (Customer Side)

**Aktor:** 🛒 Customer, ⚙️ System, 🗄️ Database

```
Langkah | Aktor     | Aksi
--------|-----------|-----
1       | Customer  | Menerima notifikasi jadwal survey via WhatsApp/In-App
2       | Customer  | Buka halaman status kredit /credit-status/{transaction}
3       | System    | Load data survey schedule yang aktif
3a      | Customer  | POST /survey-schedules/{id}/confirm-attendance → hadir
3b      | Customer  | POST /survey-schedules/{id}/request-reschedule → minta jadwal ulang
4a      | System    | Update survey_schedule.status = 'confirmed'
4b      | System    | Update survey_schedule.status = 'reschedule_requested' + kirim notif ke Admin
5       | System    | GET /api/survey-history/{creditDetail} → riwayat survey
```

---

---

## FLOW 24: Beranda & Halaman Statis

**Aktor:** 👤 Guest / 🛒 Customer, ⚙️ System

```
Halaman              | URL                    | Data yang Dimuat oleh System
---------------------|------------------------|------------------------------------------------------------
Beranda              | /                      | 5 motor populer (getPopular), ketersediaan merek Honda/Yamaha, settings
Tentang Kami         | /about                 | Semua cabang aktif dari BranchService::getAllBranches()
Bantuan/FAQ          | /bantuan               | Halaman statis (initialTab: faq)
Panduan Pemesanan    | /panduan-pemesanan     | Halaman statis (initialTab: guide)
Syarat & Ketentuan   | /syarat-ketentuan      | Halaman statis (initialTab: terms)
Kebijakan Privasi    | /kebijakan-privasi     | Halaman statis (initialTab: privacy)
```

---

## FLOW 25: Mobile App — Autentikasi (Sanctum Token)

**Aktor:** 📲 Mobile App, ⚙️ System, 🗄️ Database

```
Langkah | Aktor      | Aksi
--------|------------|-----
1       | Mobile     | POST /api/register {name, email, password, phone}
2       | System     | Validasi, buat user (role=user), buat Sanctum token
3       | System     | Kembalikan: {access_token, token_type: Bearer, data: user}
4       | Mobile     | POST /api/login {email, password}
5       | System     | Validasi credentials, buat Sanctum token baru
6       | System     | Kembalikan access_token untuk dipakai di semua /api/* request
7       | Mobile     | POST /api/login/google {id_token} (Google SSO via mobile)
8       | System     | Verifikasi Google token, buat/link akun, kembalikan access_token
9       | Mobile     | POST /api/logout (Header: Authorization: Bearer {token})
10      | System     | Hapus currentAccessToken dari DB, session mobile hangus
```

---

## FLOW 26: Mobile App — Katalog & Cabang

**Aktor:** 📲 Mobile App, ⚙️ System

```
Endpoint                                  | Aksi System
------------------------------------------|------------------------------------------
GET /api/motors                           | Daftar motor aktif (paginated)
GET /api/motors/brands                    | Daftar merek yang tersedia
GET /api/motors/{id}                      | Detail motor + galeri + skema pembiayaan
GET /api/categories                       | Daftar kategori motor
GET /api/branches                         | Semua cabang aktif
GET /api/branches/nearest?lat=&lng=       | Cabang terdekat dari koordinat GPS
GET /api/branches/with-distance?lat=&lng= | Semua cabang beserta kalkulasi jarak
POST /api/calculate-distance              | Kalkulasi jarak custom dari titik ke cabang
GET /api/branches/{code}/motors           | Daftar motor tersedia di cabang tertentu
GET /api/branches/{code}/check-motor/{id} | Cek stok motor spesifik di cabang
GET /api/motors/{id}/stock                | Ringkasan stok motor di semua cabang
GET /api/motors/{id}/nearest-branches     | Cabang terdekat yang punya stok motor ini
GET /api/settings/contact                 | Info kontak situasi (nama, telp, email, alamat)
```

---

## FLOW 27: Mobile App — Order Tunai

**Aktor:** 📲 Mobile App, ⚙️ System, 💳 Midtrans, 🗄️ Database

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Mobile   | POST /api/orders/cash {motor_id, customer_name, customer_phone, customer_nik, customer_address, motor_color, delivery_method, payment_method, booking_fee}
2       | System   | Validasi: booking_fee < harga motor
3       | System   | Buat Transaction (type=CASH, status=new_order, reference_number=ORD-xxx)
4       | System   | Langsung lock motor: tersedia = false (BEDA dengan alur web)
5       | System   | Buat installment #0 (amount = booking_fee > 0 ? booking_fee : full_price)
6       | System   | Jika payment_method = 'Transfer Bank' → buat Midtrans Snap token
7       | System   | Simpan snap_token + midtrans_booking_code ke installments
8       | System   | Return JSON: {order_id, snap_token, redirect_url}
9       | Mobile   | Buka Midtrans URL/Snap untuk pembayaran
10      | Midtrans | Callback via deep-link: srbmotor://payment-success?transaction_id=...&installment_id=...
```

---

## FLOW 28: Mobile App — Invoice & Riwayat Order

**Aktor:** 📲 Mobile App, ⚙️ System

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Mobile   | GET /api/orders → daftar semua transaksi user
2       | Mobile   | GET /api/orders/{id} → detail transaksi + motor + installments
3       | Mobile   | POST /api/orders/{id}/cancel {reason} → batalkan pesanan
4       | System   | Validasi: CASH hanya bisa cancel saat status new_order atau waiting_payment
5       | System   | Validasi: KREDIT hanya bisa cancel saat menunggu_persetujuan
6       | System   | Unlock stok motor (tersedia = true), update credit_detail status = dibatalkan
7       | Mobile   | GET /api/orders/{id}/get-invoice-url → dapatkan URL invoice dengan token
8       | System   | Generate token: md5(order_id + 'srb-secret-2024')
9       | Mobile   | GET /api/orders/{id}/invoice?token=xxx → render HTML invoice
```

---

## FLOW 29: Midtrans Webhook — Verifikasi & Proses

**Aktor:** 💳 Midtrans, ⚙️ System, 🗄️ Database, 📱 WhatsApp API

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Midtrans | POST /api/midtrans/notification {order_id, transaction_status, gross_amount, status_code, signature_key, ...}
2       | System   | Log webhook payload untuk audit trail
3       | System   | VALIDASI SIGNATURE: hash('sha512', order_id + status_code + gross_amount + server_key)
4       | System   | Jika signature tidak cocok → return HTTP 403, log warning, BERHENTI
5       | System   | Cari installments berdasarkan midtrans_booking_code = order_id
6       | System   | Jika tidak ada installment → return HTTP 404, log error
7       | System   | Loop semua installment dengan booking_code sama → PaymentService::updatePaymentStatus()
8a      | System   | status='settlement'/'capture' → markAsPaid() di dalam DB transaction
8b      | System   | status='pending' → installment status='pending'
8c      | System   | status='deny' → installment status='waiting_approval'
8d      | System   | status='expire'/'cancel' → installment status='overdue'
9       | System   | markAsPaid(): update installment + buat transaction_log + hitung status transaksi baru
10      | System   | Jika semua installment paid (CASH) → transaction status='pembayaran_dikonfirmasi'
11      | System   | Jika installment #0 paid → transaction status='unit_preparation'
12      | System   | Lock stok motor jika status masuk dalam ['pembayaran_dikonfirmasi','unit_preparation','completed',...]
13      | System   | CASH: jika BF dibayar tapi installment #1 belum ada → auto-generate installment #1
14      | WhatsApp | Notifikasi ke Customer: pembayaran berhasil dikonfirmasi
15      | System   | Return HTTP 200 {message: 'Payment status updated'}
```

---

## FLOW 30: Status Machine Kredit — Lengkap

**Aktor:** 🔧 Admin, ⚙️ System, 🏢 Leasing, 📱 WhatsApp API

```
Status credit_details         | Transisi yang Tersedia                        | Stock Motor
------------------------------|-----------------------------------------------|-------------
pengajuan_masuk               | → verifikasi_dokumen, → ditolak               | tersedia=true
verifikasi_dokumen            | → dikirim_ke_leasing, → ditolak               | tersedia=true
dikirim_ke_leasing            | → survey_dijadwalkan                          | tersedia=true
survey_dijadwalkan            | → menunggu_keputusan_leasing                  | tersedia=true
menunggu_keputusan_leasing    | → disetujui, → ditolak                       | tersedia=true
disetujui                     | → dp_dibayar                                  | tersedia=true (belum dikunci)
dp_dibayar                   | → selesai                                    | tersedia=FALSE (DIKUNCI)
selesai                       | → ditarik_leasing                             | tersedia=FALSE
ditolak (terminal)            | —                                             | tersedia=TRUE (DIBUKA KEMBALI)
dibatalkan (terminal)         | —                                             | tersedia=TRUE (DIBUKA KEMBALI)
ditarik_leasing (terminal)    | —                                             | Sisa cicilan → dibatalkan_sistem
```

**Catatan Kritis — Stock Unlock:**
- Jika kredit **ditolak** (dokumen/leasing) → `tersedia = true` (motor kembali ke katalog)
- Jika kredit **dibatalkan** admin → `tersedia = true`
- Jika kredit **dibatalkan customer** → `tersedia = true` (hanya diizinkan saat `menunggu_persetujuan`)
- Jika unit **ditarik leasing** → semua cicilan outstanding berubah jadi `dibatalkan_sistem`

---

## FLOW 31: Admin — Buat Transaksi Manual

**Aktor:** 🔧 Admin, ⚙️ System, 🗄️ Database

```
Langkah | Aktor    | Aksi
--------|----------|-----
1       | Admin    | Akses /admin/transactions/create
2       | System   | Load daftar semua users dan motors
3       | Admin    | Pilih user, motor, isi detail transaksi
4       | Admin    | Submit form
5       | System   | TransactionService::createTransaction() membuat record
6       | Admin    | Akses /admin/transactions/{id}/edit → redirect ke show page
7       | Admin    | PUT /admin/transactions/{id} → update data transaksi + credit_detail jika KREDIT
8       | Admin    | DELETE /admin/transactions/{id} → TransactionService::deleteTransaction()
```

**Fitur Tambahan — Upload Dokumen dari Admin:**
```
1   | Admin    | POST /admin/transactions/{id}/upload-document {document_type, document_file}
2   | System   | Types yang valid: KTP, KK, SLIP_GAJI, BPKB, STNK, FAKTUR, LAINNYA
3   | System   | Jika credit_detail belum ada → buat otomatis dengan status menunggu_persetujuan
4   | System   | Simpan file → storage/documents/ → buat record documents
5   | Admin    | DELETE /admin/documents/{id} → hapus file dari storage + hapus record
```

---

## Matriks Use Case vs Tabel Database

| Use Case Flow                 | Tabel yang Terdampak                                           |
| ----------------------------- | -------------------------------------------------------------- |
| Registrasi & Login            | `users`, `sessions`                                            |
| Eksplorasi Katalog            | `motors`, `motor_galleries`                                    |
| Cash Order                    | `transactions`, `installments`, `transaction_logs`             |
| Credit Order                  | `transactions`, `credit_details`, `installments`, `transaction_logs` |
| Upload Dokumen Kredit         | `documents`                                                    |
| Approval Kredit               | `credit_details`, `documents`, `survey_schedules`, `transaction_logs` |
| Pembayaran Midtrans (Webhook) | `installments`, `transactions`, `motors`, `transaction_logs`   |
| Upload Bukti Manual           | `installments`, `transactions`, `motors`                       |
| Booking Servis                | `service_appointments`                                         |
| Manajemen Cabang              | `settings`                                                     |
| Notifikasi                    | `notifications` (In-App)                                       |
| Laporan                       | JOIN semua tabel utama                                         |
| Manajemen Staf                | `users`                                                        |

---

---

## Matriks: Aktor Sistem (Otomatis) per Use Case

| Aksi Otomatis                                | Trigger                          | Aktor Sistem       |
| -------------------------------------------- | -------------------------------- | ------------------ |
| Buat installment #0 (Booking Fee/DP)               | Submit order                     | System (Laravel)           |
| Buat installment #1 (Sisa Tunai)                   | Submit cash order / setelah BF paid | System (Laravel)        |
| Lock stok motor (`tersedia = false`)               | BF/DP paid, manual DP by admin   | System (Laravel)           |
| **Unlock stok motor** (`tersedia = true`)          | Kredit ditolak/dibatalkan        | System (Laravel)           |
| Bersihkan branch cache                             | Settings update                  | System (Cache)             |
| Buat transaction log                               | Setiap perubahan status          | System (Laravel)           |
| Hitung bunga cicilan kredit (1.5%/bulan flat)      | Submit credit order              | System (Laravel)           |
| Recalculate cicilan saat kredit disetujui leasing  | approveCredit()                  | System (Laravel)           |
| Generate cicilan bulanan (1..tenor)                | completeCredit()                 | System (Laravel)           |
| Batalkan cicilan outstanding                       | repossessCredit()                | System (Laravel)           |
| Generate nomor antrian servis (A-01...)            | Store booking servis             | System (Laravel)           |
| Verifikasi Signed URL email                        | Klik link verifikasi email       | System (Laravel)           |
| **Verifikasi signature webhook Midtrans (SHA-512)**| Midtrans POST ke /api/midtrans/notification | System (Laravel) + Midtrans |
| Buat Midtrans Snap token                           | Bayar online / mobile order      | System (Laravel) + Midtrans |
| Deep-link callback ke Mobile App                   | Midtrans selesai di mobile       | Midtrans → srbmotor://     |
| Kirim notif WhatsApp via Fonnte API                | Berbagai event trigger           | WhatsApp API (Fonnte)      |
| Generate Sanctum Bearer Token                      | Login / Register di Mobile API   | System (Sanctum)           |
| Auto-buat credit_detail jika belum ada             | Admin upload dokumen manual      | System (Laravel)           |
