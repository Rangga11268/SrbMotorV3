# Analisis Use Case & Fungsionalitas Sistem SRB Motor (Berdasarkan Aktor)

Dokumen ini adalah analisis fungsional menyeluruh dari aplikasi **Sistem Penjualan (Cash/Kredit) dan Servis SRB Motor**. Untuk keperluan _Development_ dan _Testing_, setiap fungsi telah dipetakan **berdasarkan Aktor (Hak Akses Pengguna)**.

---

## 1. Daftar Aktor

| Nama Aktor   | Tipe    | Deskripsi                                                                                                                     |
| ------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Guest**    | Primary | Pengunjung anonim. Belum login. Hanya bisa melihat informasi publik.                                                         |
| **Customer** | Primary | **Aktor Utama (Terdaftar).** Mewarisi hak Guest. Melakukan pembelian, booking servis, dan manajemen cicilan. Biasanya tetap Login. |
| **Mobile App**| Primary | Interface API untuk Customer. Mendukung autentikasi Sanctum dan pelacakan order *real-time*.                                |
| **Admin**    | Primary | Staf Operasional. Mengelola unit motor, validasi kredit/DP, dan jadwal servis bengkel.                                        |
| **Owner**    | Primary | Pemilik Bisnis. Supervisi seluruh data, export laporan keuangan, dan manajemen akun staf Admin.                               |

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
        usecase "UC-2.3: Cari Cabang Terdekat via GPS" as GPS
        usecase "UC-2.4: Pilih Lokasi Pengambilan" as Branch
    }

    Guest --> Reg
    Guest --> Log
    Guest --> Filter
    Guest --> Comp
    Guest --> GPS
    Guest --> Branch

    Reg ..> SSO : <<include>>
    Log ..> SSO : <<include>>
    Branch ..> GPS : <<extend>>
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
        usecase "UC-3.9: Ubah Lokasi Pengambilan di Form" as ChgBranch
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
        usecase "UC-5.7: Kelola Data Master Cabang (Settings)" as M_Branch
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
    Admin --> M_Branch
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
- **Lokasi & Cabang Terdekat:** Menggunakan Browser Geolocation API untuk mendeteksi koordinat user dan mencocokkan dengan cabang SRB Motor terdekat yang memiliki stok unit tersebut.
- **Post-condition:** Akun terbuat, session aktif (**Aktor berubah menjadi Customer**), diarahkan ke Katalog. Email verifikasi dikirim di latar belakang tanpa memblokir akses ke fitur utama.

### 3.2 Fungsi Customer

- **Status & Eksplorasi:** Setelah masuk ke sistem (melalui pendaftaran pertama kali atau login kembali), user berstatus sebagai **Customer**. Mereka diarahkan langsung ke Katalog Motor dan memiliki akses ke seluruh fitur transaksional.
- **CRUD Profil & Keamanan:** Customer dapat mengupdate detail biodata diri dan merubah kata sandi secara mandiri melalui menu Profil.
- **Proses Check-out & Lokasi Pickup:**
    - Pelanggan yang telah masuk (Logged In) dapat langsung melakukan transaksi.
    - Sistem memastikan `branch_code` tersimpan untuk menentukan lokasi pengambilan unit.
    - Pelanggan dapat mengubah lokasi pengambilan langsung di formulir pesanan jika diinginkan.
    - Jika metode **Kredit**, sistem _memaksa_ (include) pelanggan mengunggah KK dan KTP.
    - Jika metode **Tunai/Kredit via Gateway**, sistem menyambungkan layar ke Payment Gateway API.
- **Manajemen Servis:** Bebas menunjuk jadwal kedatangan ke bengkel bila sisa kuota montir/jam hari itu belum terpenuhi. Pilihan bengkel juga tersedia berdasarkan data cabang yang aktif.

### 3.3 Fungsi Admin

- **Restriksi Delete Master Motor:** Admin dapat mengatur data Motor di aplikasi. Apabila motor _A_ pernah dibeli pengguna lain, sistem (Tingkat Basis Data) akan menggagalkan/menolak proses penghapusan keras (Hard Delete). Admin diharuskan mengubah visibilitas jadi Draft (Soft Delete).
- **Review KTP:** Menilai secara subjektif kejelasan KTP dan KK.
    - Approve memicu formulasi **Jadwal Survei**.
    - Reject menolak transaksi menjadi "Waiting Upload" kembali dengan notifikasi revisi ke Customer.
- **Penyelesaian Sesi Servis:** Tombol penyelesaian antrean (Done) yang krusial untuk membuka historis kendaraan pengguna.
- **Manajemen Cabang:** Mengelola data master cabang (alamat, koordinat Lat/Long, nomor WA pimpinan cabang, dan fasilitas) melalui modul Settings terpusat.

### 3.4 Fungsi Owner

- **Hak Akses Istimewa (Super Admin):** Hanya aktor Owner yang diizinkan mengakses segment URL `/admin/users` dan `/admin/reports`. Semua peran/staf di bawah Owner yang mencoba melanggar akses akan ditahan _HTTP 403 Forbidden Access_.
- **Eksportir Tiga Relasi:** Fitur rekap ini akan menggabungkan _Transactions_, _Motors_, dan _Users_ ke satu format final (XLSX / PDF) sesuai filter tanggal _Owner_. Data laporan kini mencakup kolom Cabang untuk analisis performa per lokasi.

---

## 4. Middleware & Map Keamanan Rute

Akses fitur backend dalam kode difilter ketat berdasarkan aktor, berikut penerapannya di Laravel (`routes/web.php`):

| Controller / Akses                | Aktor yang Diizinkan | Rute / URL Utama              | Filter (Middleware)   |
| --------------------------------- | -------------------- | ----------------------------- | --------------------- |
| Halaman Katalog / Bandingkan      | Guest, Customer      | `/`, `/motors`, `/compare`    | `guest`, `auth` Bebas |
| API Cabang & Lokasi               | Guest, Customer      | `/api/branches/*`             | Bebas                 |
| Update Profil & Upload KTP        | Customer             | `/profile`, `/transactions/*` | `auth`                |
| Booking Antrean Bengkel           | Customer             | `/services/book`              | `auth`                |
| Kelola Data Master Motor & Galeri | Admin, Owner         | `/admin/motors`               | `auth`, `admin`       |
| Validasi Transaksi & Dokumen      | Admin, Owner         | `/admin/credits`              | `auth`, `admin`       |
| Penyetujuan & Penyelesaian Servis | Admin, Owner         | `/admin/services`             | `auth`, `admin`       |
| **Export Laporan (PDF/Excel)**    | **Owner Only**       | `/admin/reports`              | `auth`, `owner`       |
| **Manajemen Tambah/Hapus Admin**  | **Owner Only**       | `/admin/users`                | `auth`, `owner`       |
