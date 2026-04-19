# Analisis Use Case & Fungsionalitas Sistem SRB Motor (Berdasarkan Aktor)

Dokumen ini adalah analisis fungsional menyeluruh dari aplikasi **Sistem Penjualan (Cash/Kredit) dan Servis SRB Motor**. Untuk keperluan _Development_ dan _Testing_, setiap fungsi telah dipetakan **berdasarkan Aktor (Hak Akses Pengguna)**.

---

## 1. Daftar Aktor

| Nama Aktor   | Tipe    | Deskripsi                                                                                                                     |
| ------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Guest**    | Primary | Pengguna yang belum login. Bisa melihat katalog, detail motor, fitur perbandingan.                                            |
| **Customer** | Primary | Pengguna terdaftar. Mewarisi Guest. Melakukan pembelian (cash/kredit), upload dokumen, bayar via gateway, dan booking servis. |
| **Admin**    | Primary | Pengelola data operasional, validasi transaksi kredit, penjadwalan survey, operasi katalog, dan manajemen bengkel.            |
| **Owner**    | Primary | Pemilik bisnis (Super Admin). Mengakses dashboard eksekutif, export laporan keuangan, dan mengelola akun staf/Admin.          |

---

## 2. Diagram Use Case Berdasarkan Aktor

Bagian ini memetakan seluruh _Use Case_ secara terpisah untuk menunjukkan ruang lingkup wewenang tiap-tiap aktor.

### 2.1 Aktor: Guest (Pengunjung Publik)

Hak akses paling dasar. Dapat melihat katalog publik dan mendaftar/login untuk menjadi Customer.

```mermaid
usecaseDiagram
    actor Guest

    package "Akses Publik & Autentikasi" {
        usecase "UC-1.1: Daftar Akun Baru" as Reg
        usecase "UC-1.2: Login Email/Password" as Log
        usecase "UC-1.3: Login via Google (SSO)" as SSO
        usecase "UC-2.1: Cari & Filter Motor" as Filter
        usecase "UC-2.2: Bandingkan Detail Motor" as Comp
    }

    Guest --> Reg
    Guest --> Log
    Guest --> Filter
    Guest --> Comp

    Reg ..> SSO : <<include>>
    Log ..> SSO : <<include>>
```

### 2.2 Aktor: Customer (Pelanggan)

Pengguna yang sudah menyelesaikan _login_. Mewarisi seluruh hak akses Guest, ditambah kemampuan transaksional.

```mermaid
usecaseDiagram
    actor Customer

    package "Manajemen Akun" {
        usecase "UC-1.4: Update Data Profil" as UpdProf
        usecase "UC-1.5: Ubah Password" as Pass
        usecase "UC-1.6: Baca Notifikasi Sistem" as Notif
    }

    package "Transaksi Pembelian" {
        usecase "UC-3.3: Submit Pesanan Cash" as Cash
        usecase "UC-3.4: Mulai Ajukan Kredit" as Kred
        usecase "UC-3.5: Upload Dokumen(KTP/KK)" as Dok
        usecase "UC-3.6: Pembayaran via Gateway" as Pay
        usecase "UC-3.7: Update Status Pembayaran (Webhook API)" as Hook
        usecase "UC-3.8: Download Bukti Invoice PDF" as Inv
    }

    package "Layanan Bengkel" {
        usecase "UC-4.1: Hitung Sisa Slot Hari Ini" as Slot
        usecase "UC-4.2: Pilih Jadwal Booking Servis" as Book
        usecase "UC-4.3: Batalkan Booking" as BtlSrv
    }

    Customer --> UpdProf
    Customer --> Notif
    Pass ..> UpdProf : <<extend>>

    Customer --> Cash
    Customer --> Kred
    Kred ..> Dok : <<include>>
    Cash ..> Pay : <<include>>
    Kred ..> Pay : <<include>>
    Customer --> Inv

    Hook <.. Pay : <<extend update API>>

    Customer --> Book
    Customer --> BtlSrv
    Book ..> Slot : <<include>>
```

### 2.3 Aktor: Admin (Operasional)

Staf yang mengelola konten master (Motor) dan memproses semua orderan serta antrean servis dari Customer.

```mermaid
usecaseDiagram
    actor Admin

    package "Manajemen Inventori Motor" {
        usecase "UC-5.1a: Lihat Daftar Motor" as R_Motor
        usecase "UC-5.1b: Tambah Motor Baru" as C_Motor
        usecase "UC-5.1c: Edit Detail Motor" as U_Motor
        usecase "UC-5.1d: Hapus/Draft Motor" as D_Motor
        usecase "UC-5.1e: Kelola Galeri Foto" as C_Galeri
    }

    package "Operasional Transaksi & Approval" {
        usecase "UC-5.2a: Review KTP Customer" as R_Doc
        usecase "UC-5.2b: Approve Dokumen Kredit" as Acc_Doc
        usecase "UC-5.2c: Reject Dokumen Kredit" as Rej_Doc
        usecase "UC-5.2d: Tentukan Jadwal Survei" as C_Survey
        usecase "UC-5.2e: Update Status Transaksi Final" as Set_Trx
    }

    package "Operasional Bengkel" {
        usecase "UC-5.3a: Terima / Tolak Antrean Servis" as Acc_Srv
        usecase "UC-5.3b: Tandai Servis Selesai" as Done_Srv
    }

    Admin --> R_Motor
    Admin --> C_Motor
    Admin --> U_Motor
    Admin --> D_Motor
    Admin --> C_Galeri

    Admin --> R_Doc
    Admin --> Acc_Doc
    Admin --> Rej_Doc
    Admin --> Set_Trx
    Acc_Doc ..> C_Survey : <<include>>

    Admin --> Acc_Srv
    Admin --> Done_Srv
```

### 2.4 Aktor: Owner (Manajemen Eksekutif & Super Admin)

Pemilik bisnis yang memiliki hak akses eksklusif ke laporan laba rugi bulanan dan memiliki wenang untuk membuat atau menghapus staf operasional.

```mermaid
usecaseDiagram
    actor Owner

    package "Pelaporan Eksekutif" {
        usecase "UC-5.4a: Cetak Laporan Motor & Transaksi (Excel)" as Exp_XLS
        usecase "UC-5.4b: Cetak Laporan Motor & Transaksi (PDF)" as Exp_PDF
    }

    package "Hak Akses & Keamanan" {
        usecase "UC-5.5: Registrasi Akun Staf Admin" as Create_Admin
        usecase "UC-5.6: Suspend/Hapus Akun Staf" as Del_Admin
    }

    Owner --> Exp_XLS
    Owner --> Exp_PDF
    Owner --> Create_Admin
    Owner --> Del_Admin
```

---

## 3. Analisis Fungsional Per Aktor

### 3.1 Fungsi Guest

- **Eksplorasi Katalog:** Dapat melihat semua motor yang berstatus _Active_ di katalog publik. Melakukan pemfilteran rentang harga dan kategori.

### 3.2 Fungsi Customer

- **CRUD Profil & Keamanan:** Setelah menjadi Customer, user dapat mengupdate detail biodata diri. Jika diperlukan, pelanggan dapat merubah kata sandi lama ke yang baru (skenario ekstensi profil).
- **Proses Check-out Transaksi:** Pelanggan men-trigger row tabel `transactions`.
    - Jika metode **Kredit**, sistem _memaksa_ (include) pelanggan mengunggah KK dan KTP.
    - Jika metode **Tunai/Kredit via Gateway**, sistem menyambungkan layar ke Payment Gateway API.
- **Manajemen Servis:** Bebas menunjuk jadwal kedatangan ke bengkel bila sisa kuota montir/jam hari itu belum terpenuhi.

### 3.3 Fungsi Admin

- **Restriksi Delete Master Motor:** Admin dapat mengatur data Motor di aplikasi. Apabila motor _A_ pernah dibeli pengguna lain, sistem (Tingkat Basis Data) akan menggagalkan/menolak proses penghapusan keras (Hard Delete). Admin diharuskan mengubah visibilitas jadi Draft (Soft Delete).
- **Review KTP:** Menilai secara subjektif kejelasan KTP dan KK.
    - Approve memicu formulasi **Jadwal Survei**.
    - Reject menolak transaksi menjadi "Waiting Upload" kembali dengan notifikasi revisi ke Customer.
- **Penyelesaian Sesi Servis:** Tombol penyelesaian antrean (Done) yang krusial untuk membuka historis kendaraan pengguna.

### 3.4 Fungsi Owner

- **Hak Akses Istimewa (Super Admin):** Hanya aktor Owner yang diizinkan mengakses segment URL `/admin/users` dan `/admin/reports`. Semua peran/staf di bawah Owner yang mencoba melanggar akses akan ditahan _HTTP 403 Forbidden Access_.
- **Eksportir Tiga Relasi:** Fitur rekap ini akan menggabungkan _Transactions_, _Motors_, dan _Users_ ke satu format final (XLSX / PDF) sesuai filter tanggal _Owner_.

---

## 4. Middleware & Map Keamanan Rute

Akses fitur backend dalam kode difilter ketat berdasarkan aktor, berikut penerapannya di Laravel (`routes/web.php`):

| Controller / Akses                | Aktor yang Diizinkan | Rute / URL Utama              | Filter (Middleware)   |
| --------------------------------- | -------------------- | ----------------------------- | --------------------- |
| Halaman Katalog / Bandingkan      | Guest, Customer      | `/`, `/motors`, `/compare`    | `guest`, `auth` Bebas |
| Update Profil & Upload KTP        | Customer             | `/profile`, `/transactions/*` | `auth`                |
| Booking Antrean Bengkel           | Customer             | `/services/book`              | `auth`                |
| Kelola Data Master Motor & Galeri | Admin, Owner         | `/admin/motors`               | `auth`, `admin`       |
| Validasi Transaksi & Dokumen      | Admin, Owner         | `/admin/credits`              | `auth`, `admin`       |
| Penyetujuan & Penyelesaian Servis | Admin, Owner         | `/admin/services`             | `auth`, `admin`       |
| **Export Laporan (PDF/Excel)**    | **Owner Only**       | `/admin/reports`              | `auth`, `owner`       |
| **Manajemen Tambah/Hapus Admin**  | **Owner Only**       | `/admin/users`                | `auth`, `owner`       |
