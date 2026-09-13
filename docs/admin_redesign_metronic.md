# Perencanaan Redesign Admin Panel (CoreUI → Metronic)

Dokumen ini berisi hasil analisis menyeluruh terhadap Admin Panel SRB Motor saat ini dan rencana migrasi antarmuka dari **CoreUI** menuju **Metronic** (Keenthemes). Tujuan utamanya adalah memastikan tampilan admin lebih modern, premium, tanpa menghilangkan satu pun fitur atau fungsionalitas yang sudah ada.

## Analisis Inventaris Admin Panel (Current State)

Berikut adalah pemetaan seluruh halaman dan komponen di Admin Panel yang wajib di-redesign:

### 1. Struktur Layout Utama (`AdminLayout.jsx`)
Saat ini tata letak menggunakan library `@coreui/react`. Semua komponen ini harus direfaktor menggunakan struktur HTML/CSS khas Metronic.
- **Sidebar (`CSidebar`)**: Daftar menu navigasi vertikal.
- **Header (`CHeader`)**: Topbar yang berisi tombol toggle menu, bell notifikasi, dan menu dropdown user profil.
- **Breadcrumbs/Page Title**: Judul halaman dinamis.
- **Footer (`CFooter`)**: Copyright dan versi aplikasi.
- **Flash Messages (Toasts)**: Notifikasi sukses/gagal di pojok kanan atas.

### 2. Modul & Halaman (Pages)
Berdasarkan investigasi pada direktori `resources/js/Pages/Admin/`, terdapat 9 modul utama dengan rincian halamannya:

1.  **Dashboard** (`Dashboard.jsx`): Halaman ringkasan, metrik utama, dan grafik.
2.  **Kredit (Credits)**:
    - `Index.jsx` (Daftar antrian pengajuan kredit)
    - `Show.jsx` (Detail pengajuan, validasi dokumen, approve/reject)
3.  **Motor (Motors)**:
    - `Index.jsx` (Daftar stok motor)
    - `Create.jsx` (Form tambah motor baru)
    - `Edit.jsx` (Form edit motor)
    - `Show.jsx` (Detail spesifikasi motor)
4.  **Transaksi Tunai (Transactions)**:
    - `Index.jsx` (Daftar pembelian tunai)
    - `Create.jsx` (Bikin order tunai manual dari admin)
    - `Edit.jsx` (Update status transaksi)
    - `Show.jsx` (Detail transaksi tunai)
5.  **Pengguna (Users)**:
    - `Index.jsx` (Manajemen pelanggan/user terdaftar)
6.  **Manajemen Servis (Services)**:
    - `Index.jsx` (Daftar antrian booking servis)
7.  **Laporan (Reports)**:
    - `Index.jsx` (Filter laporan penjualan/kredit bulanan)
    - `Show.jsx` (Preview laporan sebelum diexpor)
8.  **Pengaturan (Settings)**:
    - `Index.jsx` (Daftar konfigurasi web, kontak, sosmed, dealer network)
    - `Edit.jsx` (Ubah value konfigurasi)
9.  **Profil Admin (Profile)**:
    - `Edit.jsx` (Ubah password, foto profil)

---

## Rencana Implementasi Bertahap (Phased Strategy - Zero Breakage)

Untuk memastikan **tingkat keamanan 100% pada logika CRUD dan Transaksi**, proses dibagi menjadi fase terisolasi.

### FASE 1: Fondasi Layout & Dashboard Base ✅ (SELESAI)
*Fokus pada pembuatan "Wadah" aplikasi baru tanpa merusak yang sudah ada.*
- [x] **New Layout Container**: Membuat file `resources/js/Layouts/MetronicAdminLayout.jsx`.
- [x] **Setup Komponen Kerangka**: Membangun UI Sidebar (Dark/Light mode), Header, dan Dropdown User bergaya Keenthemes murni.
- [x] **Migrasi Dashboard**: Menerapkan tata letak pelindung pada halaman `Dashboard.jsx`.

### FASE 2: Modul Non-Kritikal (Master Data & Settings) ✅ (SELESAI)
*Fase pemanasan: Menguji integrasi layout data dalam tabel bergaya Metronic.*
- [x] **Pengguna (`Users/Index.jsx`)**: Mendesain ulang struktur DataTables menjadi grid responsif Metronic.
- [x] **Laporan (`Reports/Index.jsx` & `Show.jsx`)**: Mendesain UI generator laporan dan halaman rincian cetak laporan yang bersih. Fix bug `final_price`.
- [x] **Pengaturan (`Settings/Index.jsx` & `Edit.jsx`)**: Transformasi form konfigurasi 2 kolom kombo dengan sidebar terpisah.
- [x] **Manajemen Servis (`Services/Index.jsx`)**: Memoles UI tiket servis dengan Modal Custom interaktif.

### FASE 3: Modul Motor CRUD (Kritikal Level Menengah) ✅ (SELESAI)
*Sangat hati-hati pada manipulasi data JSON warna dan unggah gambar.*
- [x] **Katalog Stok (`Motors/Index.jsx`)**: Memperbarui tabel produk dengan *thumbnail image* dan filter bar.
- [x] **Spesifikasi (`Motors/Show.jsx`)**: Tata letak dua kolom rapi bergaya *e-Commerce Profile*.
- [x] **Form Tambah (`Motors/Create.jsx`)**: Layout 2-col dengan live preview sidebar, color tag chips, toggle switch & drag-and-drop upload area.
- [x] **Form Edit (`Motors/Edit.jsx`)**: Identik dengan Create, dilengkapi Danger Zone (hapus motor) di sidebar.

### FASE 3.5: Infrastruktur Autentikasi "Owner" ✅ (SELESAI)
*Diinstruksikan berdasarkan `WEBSITE_USE_CASE_ANALYSIS.md` untuk memisahkan visibilitas Laporan & Akun.*
- [x] **Middleware**: Membuat `app/Http/Middleware/OwnerMiddleware.php`.
- [x] **Routing Security**: Melindungi `/admin/users` & `/admin/reports` dengan `->middleware('owner')`.
- [x] **Model Update**: Menambahkan `isOwner()` dan mengekspansi `isAdmin()` di `User.php`.
- [x] **Layout Restriction**: Menyembunyikan menu berdasarkan `role` di `MetronicAdminLayout.jsx`. Badge sidebar berubah warna (amber = owner, biru = admin).
- [x] **DB Provisioning**: Akun Owner dibuat via Tinker: `owner@srbmotor.test` / `password123`.

### FASE 4: Proses Transaksional (Kritikal Level Tertinggi) 🔄 (ON PROGRESS)
*Zona "Do Not Touch Logic". Redesign **HANYA** memanipulasi Div dan struktur Grid Tailwind.*
- [x] **`Transactions/Index.jsx`**: Tabel modern, filter bar kompak, status badge kontekstual, pagination kotak.
- [x] **`Transactions/Show.jsx`**: 2-col layout, log timeline bersih, mode edit inline, tombol WhatsApp pelanggan.
- [x] **`Transactions/Edit.jsx`**: Form 2-col + sidebar kalkulasi total sticky.
- [x] **`Transactions/Create.jsx`**: 3-card form + live preview motor + kalkulasi harga otomatis.
- [x] **`Credits/Index.jsx`**: Status badge per tahapan kredit, filter bar & tombol Proses solid biru.
- [x] **`Credits/Show.jsx`**: Engine verifikasi kredit — UI *Approval Stepper* dengan document viewer integrasi.
- [x] **`Admin/Profile/Edit.jsx`**: Redesign halaman profil dengan layout Metronic dan skema kartu informasi/keamanan.

### FASE 5: Pembersihan Akhir ✅ (SELESAI)
- [x] **Uninstall CoreUI**: Hapus `@coreui/react` & `@coreui/icons-react` dari `package.json`.
- [x] **Audit Sisa Import**: Cek seluruh file yang masih meng-import dari `@coreui`.
- [x] **Optimasi Bundle**: Rebuild final untuk memangkas ukuran bundle.

---

## Ringkasan Progress Keseluruhan

| Fase | Keterangan | Status |
|---|---|---|
| **Fase 1** | Layout & Dashboard | ✅ Selesai |
| **Fase 2** | Master Data & Settings | ✅ Selesai |
| **Fase 3** | Modul Motor CRUD | ✅ Selesai |
| **Fase 3.5** | Infrastruktur Role Owner | ✅ Selesai |
| **Fase 4** | Modul Transaksi & Kredit | ✅ Selesai (6/6) |
| **Fase 5** | Pembersihan & Uninstall CoreUI | ✅ Selesai (100%) |

**Total Halaman**: 18 halaman teridentifikasi + layout utama.
**Sudah Dimigrasi**: 18 halaman ✅
**Tersisa**: 0 Halaman (Proyek Selesai)

---

## Saran Peningkatan UI/UX Tambahan (Opsional & Aman)

### 1. Dashboard Enhancements
- **Quick Actions Bar**: Tombol akses cepat (Proses Kredit Tertunda, Tambah Motor Baru, Cetak Laporan Hari Ini).
- **Activity Timeline**: Log aktivitas berbentuk *vertical timeline* khas Metronic.

### 2. Evaluasi Halaman Pengajuan Kredit (Hati-Hati & Aman)
- **Stepping Wizard**: Pada `Credits/Show.jsx`, UI approval diperbarui menjadi sistem *Stepper* (Langkah 1: Cek Dokumen → Langkah 2: Survey → Langkah 3: Keputusan Leasing).
- **Side-by-Side Document Viewer**: Gambar/PDF terbuka di sidebar panel sebelah kanan alih-alih membuka tab baru.

### 3. Halaman Inventaris Motor
- **Quick Status Toggle**: Badge status (Tersedia/Habis) diubah menjadi *Toggle Switch* visual.
- **Filter Bar Interaktif**: Filter pencarian diletakkan di dalam *Header Toolbar*.
