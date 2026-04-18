# Perencanaan Redesign Admin Panel (CoreUI -> Metronic)

Dokumen ini berisi hasil analisis menyeluruh terhadap Admin Panel SRB Motor saat ini dan rencana migrasi antarmuka dari **CoreUI** menuju **Metronic** (Keenthemes). Tujuan utamanya adalah memastikan tampilan admin lebih modern, premium, tanpa menghilangkan satu pun fitur atau fungsionalitas yang sudah ada.

## Analisis Inventaris Admin Panel (Current State)

Berikut adalah pemetaan seluruh halaman dan komponen di Admin Panel yang wajib di-redesign:

### 1. Struktur Layout Utama (`AdminLayout.jsx`)
Saat ini tata letak menggunakan library `@coreui/react`. Semua komponen ini harus direfaktor menggunakan struktur HTML/CSS khas Metronic.
- **Sidebar (`CSidebar`)**: Daftar menu navigasi vertikal.
- **Header (`CHeader`)**: Topbar yang berisi tombol toggle menu, bell notifikasi, dan menu dropdown user profil.
- **Breadcrumbs/Page Title**: Judul halaman dinamis.
- **Footer (`CFooter`)**: Copyright dan versi aplikasi.
- **Flash Messages (Toasts)**: Notifikasi sukses/gagal di pojok kanan atas (menggunakan framer-motion saat ini, bisa dipertahankan atau diganti dengan toast Metronic/SweetAlert2).

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

Untuk memastikan **tingkat keamanan 100% pada logika CRUD dan Transaksi**, proses akan dibagi menjadi 4 fase terisolasi. Kita tidak akan langsung menghancurkan layout yang lama, melainkan melakukan transisi secara hati-hati halaman demi halaman.

### FASE 1: Fondasi Layout & Dashboard Base
*Fokus pada pembuatan "Wadah" aplikasi baru tanpa merusak yang sudah ada.*
1. **New Layout Container**: Membuat file `resources/js/Layouts/MetronicAdminLayout.jsx`. File lawas `AdminLayout.jsx` akan dibiarkan dulu sebagai *fallback*.
2. **Setup Komponen Kerangka**: Membangun UI Sidebar (Dark/Light mode), Header (Glassmorphism), dan Dropdown User bergaya Keenthemes murni.
3. **Migrasi Dashboard**: Menerapkan tata letak pelindung ini pada halaman `Dashboard.jsx`. Kita juga akan memperbarui kotak statistik (Quick Stats) dan grafik dengan UI Metronic Cards.

### FASE 2: Modul Non-Kritikal (Master Data & Settings)
*Fase pemanasan: Menguji integrasi layout data dalam tabel bergaya Metronic.*
1. **Pengguna & Laporan (`Users`, `Reports`)**: Mendesain ulang struktur List/DataTables dengan komponen Header Toolbar, Status Badges, dan Styling Grid ala Metronic.
2. **Pengaturan (`Settings`)**: Transformasi form UI pengaturan menjadi struktur profesional dua-kolom.
3. **Manajemen Servis**: Memoles UI tiket servis tanpa mengubah logika reservasi.

### FASE 3: Modul Motor CRUD (Kritikal Level Menengah)
*Sangat hati-hati pada manipulasi data JSON warna dan unggah gambar.*
1. **Katalog Stok (`Motors/Index.jsx`)**: Memperbarui tabel produk dengan *Quick Status Switch* untuk menampilkan mana unit yang ready.
2. **Form Motor (`Create/Edit.jsx`)**: Input form, JSON array warna, dan file upload *preview* diubah styling CSS-nya secara statis tanpa sedikitpun menyentuh event handler Inertia (`setData`, `post`).
3. **Spesifikasi (`Show.jsx`)**: Tata letak rapi untuk spesifikasi teknis unit.

### FASE 4: Proses Transaksional (Kritikal Level Tertinggi)
*Zona "Do Not Touch Logic". Redesign **HANYA** memanipulasi Div dan struktur Grid Tailwind.*
1. **Daftar Kredit & Cash (`Index.jsx`)**: Daftar transaksi akan dilengkapi dengan indikator status dinamis ala enterprise UI (Menunggu, Disetujui, Ditolak).
2. **Engine Verifikasi (`Credits/Show.jsx`)**: Mengimplementasikan UI *Approval Stepper* (Langkah 1: Cek Dokumen -> Langkah 2: Survey) untuk visibilitas progres. Logika tombol "Approve Validation" akan persis sama (Endpoint tidak berubah).
3. **Pembersihan Akhir**: Setelah 100% halaman dipastikan jalan di MetronicLayout dan sudah dites user, baru modul `@coreui` lama kita `npm uninstall` untuk meringkas aplikasi.

---

## Saran Peningkatan UI/UX Tambahan (Opsional & Aman)

Selain sekadar mengganti skin, momen redesign ini sangat bagus untuk memberikan nilai tambah pada interaksi dan kejelasan (tanpa merusak database atau controller yang sudah jalan). Berikut saran tambahan yang akan saya buat sesuai standar desain enterprise Metronic:

### 1. Dashboard Enhancements
- **Quick Actions Bar**: Menambahkan tombol akses cepat di atas (misal: "Proses Kredit Tertunda", "Tambah Motor Baru", "Cetak Laporan Hari Ini") agar admin tidak banyak membuang waktu navigasi.
- **Activity Timeline**: Mengubah log aktivitas yang flat menjadi tampilan *vertical timeline* khas Metronic yang lebih informatif (kapan order dibuat, kapan dikonfirmasi, kapan dokumen diunggah).

### 2. Evaluasi Halaman Pengajuan Kredit & Cash (Hati-Hati & Aman)
- **Stepping Wizard / Proses Approval**: Pada halaman `Show.jsx` (detail kredit), kita tidak akan mengubah field, tetapi UI approval bisa kita perbarui menjadi sistem *Stepper* (Langkah 1: Cek Dokumen -> Langkah 2: Survey -> Langkah 3: Keputusan Leasing). Ini membuat admin tahu persis transaksi sedang tertahan di tahap mana.
- **Side-by-Side Document Viewer**: Saat admin mereview file KTP/KK/Slip Gaji, kita buat agar gambar/PDF terbuka di sidebar panel sebelah kanan (*Drawer* atau *Modal* premium ala Metronic) alih-alih membuka tab baru, sementara tombol Approve/Reject tetap terlihat di sebelah kirinya. (Logika controller tidak disentuh, murni perbaikan *view*).

### 3. Halaman Inventaris Motor
- **Quick Status Toggle**: Di dalam tabel daftar motor, badge status (Tersedia/Habis) bisa diubah tampilannya menggunakan *Status Dot* atau *Toggle Switch* agar secara visual lebih mencolok mana unit yang ready stock.
- **Filter Bar Interaktif**: Filter pencarian (berdasarkan Brand, Tipe, Status) diletakkan di dalam *Header Toolbar* atau *Filter Menu Dropdown* memanjang khas Metronic agar tabel utama lebih ringkas dan tidak memakan terlalu banyak ruang ke bawah.

---

## Pertanyaan Krusial Sebelum Mengeksekusi

Sebelum kita mulai, saya perlu mengonfirmasi 2 hal terkait Metronic agar implementasi kita berjalan lancar:

1. **Dependensi & Versi Metronic**: Metronic adalah template premium yang rilisannya terbagi (V8 menggunakan Bootstrap, V9 full Tailwind CSS). Aplikasi Anda saat ini sangat kental menggunakan Tailwind murni. Apakah Anda punya source file/aset Metronic yang ingin kita inject, **ATAU** Anda ingin saya merancang ulang UI Admin panel Anda benar-benar *dari nol* menggunakan **Tailwind CSS** dengan panduan desain ("look and feel") yang sama persis menyerupai Metronic?
2. **Pendekatan Refactor**: Apakah Anda ingin saya menimpa (`overwrite`) file lama yang menggunakan CoreUI satu-per-satu, atau kita buatkan layout admin baru dan dimigrasikan secara perlahan agar jika terjadi error, versi CoreUI masih bisa digunakan?
