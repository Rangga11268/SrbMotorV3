# ��� Analisis Use Case & Fungsionalitas Sistem SRB Motor (Detailed / Fish Level)

Dokumen ini adalah analisis fungsional menyeluruh dari aplikasi **Sistem Penjualan (Cash/Kredit) dan Servis SRB Motor**. Untuk keperluan _Development_ dan _Testing_, setiap fungsi CRUD (Create, Read, Update, Delete) telah **dipecah secara detail (Atomic Sub-Function Level)**.

---

## ��� 1. Daftar Aktor

| Nama Aktor   | Tipe      | Deskripsi                                                                                                                                 |
| ------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Guest**    | Primary   | Pengguna yang belum login. Bisa melihat katalog, detail motor, fitur perbandingan.                                                        |
| **Customer** | Primary   | Pengguna terdaftar. Mewarisi Guest. Melakukan pembelian (cash/kredit), upload dokumen, bayar DP/angsuran via gateway, dan booking servis. |
| **Admin**    | Primary   | Pengelola data sistem operasional, persetujuan kredit, penjadwalan survey, validasi manual, dan manajemen bengkel.                        |
| **Owner**    | Primary   | Pemilik bisnis (Super Admin). Mengakses dashboard eksekutif, export laporan keuangan, dan mengelola (CRUD) akun Admin.                    |
| **Midtrans** | Secondary | API Gateway untuk transaksi. Mengirim webhook/callback pembayaran secara _asynchronous_ ke sistem.                                        |

---

## ��� 2. Pembagian Diagram Use Case per Modul

### ��� Modul 1: Autentikasi, Akun & Profil (Detail)

```mermaid
usecaseDiagram
    actor Guest
    actor Customer
    actor Admin
    actor Owner

    package "Modul 1: Akun & Notifikasi" {
        usecase "UC-1.1: Daftar Akun Baru" as Reg
        usecase "UC-1.2: Login Email/Password" as Log
        usecase "UC-1.3: Login via Google (SSO)" as SSO
        usecase "UC-1.4: Update Data Profil" as UpdProf
        usecase "UC-1.5: Ubah Password" as Pass
        usecase "UC-1.6: Baca Notifikasi Sistem" as Notif
    }

    Guest --> Reg
    Guest --> Log
    Reg ..> SSO : <<include>>
    Log ..> SSO : <<include>>

    Guest <|-- Customer
    Guest <|-- Admin
    Admin <|-- Owner

    Customer --> UpdProf
    Customer --> Pass
    Customer --> Notif
    Admin --> UpdProf
    Admin --> Notif
```

### ��� Modul 2 & 3: Transaksi & Etalase (Detail)

Proses Customer menelusuri web hingga checkout Midtrans.

```mermaid
usecaseDiagram
    actor Customer
    actor Midtrans

    package "Modul 2 & 3: Katalog & Transaksi (User)" {
        usecase "UC-2.1: Cari & Filter Motor" as Filter
        usecase "UC-2.2: Bandingkan 2 Motor" as Comp
        usecase "UC-3.3: Submit Pesanan Cash" as Cash
        usecase "UC-3.4: Mulai Ajukan Kredit" as Kred
        usecase "UC-3.5: Tambah File KTP & KK" as Dok
        usecase "UC-3.6: Checkout Payment Gateway" as Pay
        usecase "UC-3.7: Update Status Pembayaran (Webhook)" as Hook
        usecase "UC-3.8: Download Bukti Invoice PDF" as Inv
    }

    Customer --> Filter
    Customer --> Comp
    Customer --> Cash
    Customer --> Kred

    Kred ..> Dok : <<include>>
    Cash ..> Pay : <<include>>
    Kred ..> Pay : <<include>>

    Customer --> Inv
    Hook <.. Pay : <<extend update API>>
    Midtrans --> Hook
```

### ��� Modul 4: Booking Servis Bengkel (Detail)

```mermaid
usecaseDiagram
    actor Customer

    package "Modul 4: Servis (User)" {
        usecase "UC-4.1: Hitung Sisa Slot Hari Ini" as Slot
        usecase "UC-4.2: Pilih Tanggal & Jenis Servis" as Book
        usecase "UC-4.3: Batalkan Booking (Cancel)" as BtlSrv
    }

    Customer --> Book
    Customer --> BtlSrv
    Book ..> Slot : <<include>>
```

### ��� Modul 5: Backoffice Admin (Decomposed CRUD Level)

Di sinilah fungsi "Kelola" dipecah satu-per-satu agar urutan fungsinya jelas secara _software engineering_.

```mermaid
usecaseDiagram
    actor Admin
    actor Owner

    package "Manajemen Motor (CRUD Detail)" {
        usecase "UC-5.1a: Lihat Daftar Motor" as R_Motor
        usecase "UC-5.1b: Tambah Master Motor Baru" as C_Motor
        usecase "UC-5.1c: Edit Detail Motor" as U_Motor
        usecase "UC-5.1d: Hapus Data Motor" as D_Motor
        usecase "UC-5.1e: Tambah/Hapus Foto Galeri" as C_Galeri
    }

    package "Penanganan Transaksi & Kredit" {
        usecase "UC-5.2a: Review Kesesuaian KTP(View)" as R_Doc
        usecase "UC-5.2b: Approve Dokumen Kredit" as Acc_Doc
        usecase "UC-5.2c: Reject Dokumen Kredit" as Rej_Doc
        usecase "UC-5.2d: Input Tanggal Survei Rumah" as C_Survey
        usecase "UC-5.2e: Setel Status Transaksi (Terkirim, dll)" as Set_Trx
    }

    package "Manajemen Servis & Laporan" {
        usecase "UC-5.3a: Terima / Tolak Booking Servis" as Acc_Srv
        usecase "UC-5.3b: Tandai Servis Selesai" as Done_Srv
        usecase "UC-5.4a: Generate Export Excel" as Exp_XLS
        usecase "UC-5.4b: Generate Export PDF" as Exp_PDF
        usecase "UC-5.5: Manajemen Akun Admin" as Manage_Admin
    }

    Admin --> R_Motor
    Admin --> C_Motor
    Admin --> U_Motor
    Admin --> D_Motor
    Admin --> C_Galeri

    Admin --> R_Doc
    Admin --> Acc_Doc
    Admin --> Rej_Doc
    Acc_Doc ..> C_Survey : <<include>>
    Admin --> Set_Trx

    Admin --> Acc_Srv
    Admin --> Done_Srv

    Admin <|-- Owner
    Owner --> Exp_XLS
    Owner --> Exp_PDF
    Owner --> Manage_Admin
```

---

## ��� 3. Analisis Flow Mendalam (Spesifik CRUD & Pengecekan Sistem)

### ��� Flow 1: CRUD Manajemen Motor (UC-5.1)

- **Normal Flow (Create/Tambah Motor):**
    1. Admin mengisi Form (Nama, Brand, Harga, DP, dll).
    2. Sistem menyimpan _record_ ke tabel `motors`.
    3. Sistem melempar Admin ke halaman Upload Galeri (`<<include>>` UC-5.1e).
- **Normal Flow (Delete/Hapus Motor):**
    1. Admin menekan tombol Hapus. Sistem mendelete data motor. _Cascade delete_: ikut menghapus semua `motor_galleries` yang bersangkutan.
- **Alternate Flow (Gagal Hapus):**
    1. Jika motor tersebut **sudah pernah dibeli / terikat pada transaksi pelanggan**, sistem menolak proses Delete karena terikat _Foreign Key constraint_ di DB. Admin harus mengganti status menjadi "Tidak Aktif / Draft" (Soft Delete/Hide).

### ��� Flow 2: Siklus Pengajuan Kredit & Upload Dokumen Mutlak

- **Normal Flow**:
    1. Customer memilih Tenor dan Uang Muka (DP). Sistem merekam tabel `transactions` berstatus `pending_documents`.
    2. Sistem mewajibkan Customer ke halaman **Upload Dokumen (UC-3.5)**.
    3. Dokumen masuk, status order jadi `waiting_validation`.
- **Alternate Flow**: Jika browser tertutup sebelum upload, admin tetap bisa melacak `pending_documents` dan mengirim notifikasi _reminder_ ke pengguna.

### ��� Flow 3: Siklus Validasi Kredit & Jadwal Survei (Atomic)

- **Normal Flow (Approve)**:
    1. Admin mengklik **Approve Dokumen (UC-5.2b)**.
    2. Pelanggan dapat notif dokumen lulus pengecekan.
    3. Mengaktifkan keharusan Admin masuk ke antarmuka **Jadwal Survei (UC-5.2d)**.
    4. Surveyor ke lapangan. Setelah itu Admin mengubah status menjadi `Terverifikasi`.
- **Normal Flow (Reject)**:
    1. Jika KTP buram, Admin menekan **Reject Dokumen (UC-5.2c)** dengan alasan penolakan. Data direject, customer harus _Upload Ulang_.

### ��� Flow 4: Algoritma Pengecekan Slot Booking Servis

- **Normal Flow**:
    1. Customer mengklik **Pilih Tanggal (UC-4.2)**.
    2. Backend di `ServiceAppointmentController` mengeksekusi hitung _Slot Hari Ini_ (`UC-4.1`).
    3. Bila belum masuk maksimum, form ditersedia. Bila data berhasil input, status = `pending`.
- **Flow Admin (UC-5.3a & UC-5.3b)**:
    1. Admin meninjau antrean. Admin meng-klik tombol **Setujui** (Mekanik dialokasikan).
    2. Saat motor pelanggan sudah selesai diservis sorenya, Admin wajib meng-klik **Tandai Selesai (UC-5.3b)** untuk membebaskan antrean _history_ pelanggan.

### 🔐 Flow 5: Generate Export Laporan (ReportController)

- **Normal Flow (UC-5.4a & UC-5.4b)**:
    1. Owner (Pemilik) mengatur "Dari Tanggal" s/d "Hingga Tanggal".
    2. Memilih apakah Laporan Excel (Library Maatwebsite) atau PDF (DomPDF).
    3. Sistem melooping relasi _Transaction -> Motor -> User_ lalu mengkompilasi file fisik `.xlsx` atau `.pdf` yang terunduh instan ke laptop Owner.

> ⚠️ **Akses Eksklusif**: Halaman Laporan dan Manajemen Pengguna **hanya bisa diakses oleh Role `owner`**. Admin biasa akan mendapat HTTP 403 jika mencoba mengakses URL ini secara langsung.

---

## ✅ Status Implementasi Role per Fitur (Real System)

Berikut adalah status implementasi aktual sistem berdasarkan `routes/web.php`, `AdminMiddleware`, dan `OwnerMiddleware`:

| Fitur / Route | Role yang Diizinkan | Status |
|---|---|---|
| Dashboard `/admin` | Admin, Owner | ✅ Aktif |
| Motor CRUD `/admin/motors` | Admin, Owner | ✅ Aktif |
| Kredit `/admin/credits` | Admin, Owner | ✅ Aktif |
| Transaksi Tunai `/admin/transactions` | Admin, Owner | ✅ Aktif |
| Manajemen Servis `/admin/services` | Admin, Owner | ✅ Aktif |
| Pengaturan `/admin/settings` | Admin, Owner | ✅ Aktif |
| **Pengguna** `/admin/users` | **Owner Only** | ✅ Aktif |
| **Laporan** `/admin/reports` | **Owner Only** | ✅ Aktif |

### Mekanisme Teknis Role
- **`isAdmin()`** → `true` jika `role` adalah `'admin'` **atau** `'owner'` (Owner mewarisi semua hak Admin)
- **`isOwner()`** → `true` hanya jika `role === 'owner'`
- **Sidebar UI** → Menu "Pengguna" dan "Laporan" disembunyikan secara kondisional di `MetronicAdminLayout.jsx` jika `auth.user.role !== 'owner'`
- **Middleware Stack**: Semua rute `/admin/*` wajib lolos `AdminMiddleware`, lalu rute eksklusif Owner wajib lolos tambahan `OwnerMiddleware`.
