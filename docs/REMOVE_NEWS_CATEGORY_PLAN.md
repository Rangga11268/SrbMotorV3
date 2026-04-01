# Rencana Penghapusan Fitur Berita (News/Posts) & Kategori

**Sistem Informasi Dealer SRB Motor (Powered by SSM)**

Dokumen ini berisi analisis mendalam dan langkah-langkah teknis (roadmap) untuk menghapus modul **Berita (Post)** dan **Kategori (Category)** dari sistem. Penghapusan fitur ini direkomendasikan untuk menyederhanakan _business logic_ sistem menjadi lebih terpusat pada _Core Business_ Dealer Motor (Transaksi Tunai/Kredit & Servis).

---

## 1. Analisis Kebutuhan & Alasan Penghapusan

Dalam sistem operasional _dealership_ independen (SRB Motor) di bawah naungan SSM, fokus utama aplikasi adalah pada **katalog produk, pengajuan kredit, pembelian tunai, dan purna jual (servis)**.
Menyediakan fitur Berita/Blog _(Content Management System)_ membutuhkan sumber daya admin tambahan untuk melakukan publikasi rutin. Jika tidak dikelola, halaman akan tampak mati/kosong. Secara akademik, menghapus fitur yang bukan _core functionality_ akan menguatkan argumen bahwa aplikasi ini fokus pada "Sistem Penjualan & Servis", bukan sekadar portal informasi.

---

## 2. Dampak Penghapusan (Dependency Check)

Berdasarkan pengecekan basis kode (Laravel & React Inertia), fitur Berita & Kategori berdiri cukup mandiri (terisolasi) dan **tidak memiliki foreign key / ketergantungan krusial** terhadap entitas utama seperti `Motor`, `Transaction`, atau `User`.

Oleh karena itu, penghapusan ini **sangat aman** dilakukan tanpa merusak integritas _flow_ pemesanan motor.

---

## 3. Langkah-Langkah Eksekusi (Penghapusan File & Kode)

### Langkah 1: Layer Database (Migration, Model, Seeder)

1. **Penghapusan Tabel Fisik di Database (Migration):**
    - _Rencana:_ Membuat sebuah file migration baru (misal: `php artisan make:migration drop_posts_and_categories_tables`) untuk mem-bypass _foreign key_ `category_id` (di tabel `posts`) dan menghapus (`drop`) datanya secara permanen di server/basis data asli.
    - Menjalankan `php artisan migrate` agar tabel `posts` dan `categories` sungguhan musnah dari MySQL (bukan hanya menghapus file bawaan).
    - Hapus file migration lama `..._create_categories_table.php` dan `..._create_posts_table.php` untuk merapikan dokumentasi.
2. **Hapus File Model (Eloquent):**
    - Hapus `app/Models/Category.php`
    - Hapus `app/Models/Post.php`
3. **Hapus File Seeder & Factory:**
    - Hapus `database/seeders/PostSeeder.php`
    - Buka `database/seeders/DatabaseSeeder.php` dan hapus baris `$this->call(PostSeeder::class);`

### Langkah 2: Layer Backend (Controller & Routes)

1. **Hapus Controllers:**
    - Hapus `app/Http/Controllers/NewsController.php` (Frontend Public Controller)
    - Hapus `app/Http/Controllers/Admin/NewsController.php` (Admin CMS Controller)
    - Hapus `app/Http/Controllers/Admin/CategoryController.php` (Admin Category Controller)
2. **Update `routes/web.php`:**
    - Cari dan **hapus** _routes public_ berita:
        ```php
        Route::get('/berita', [NewsController::class, 'index'])->name('berita.index');
        Route::get('/berita/{post:slug}', [NewsController::class, 'show'])->name('berita.show');
        Route::get('/api/berita/search', [NewsController::class, 'search'])->name('api.berita.search');
        ```
    - Cari dan **hapus** _routes admin resources_ di dalam grup middleware admin:
        ```php
        Route::resource('news', \App\Http\Controllers\Admin\NewsController::class);
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
        ```

### Langkah 3: Layer Frontend (React / Inertia Vues)

1. **Hapus Folder Halaman Admin:**
    - Hapus _folder_ `resources/js/Pages/Admin/News/` (Berisi Index, Create, Edit.jsx)
    - Hapus _folder_ `resources/js/Pages/Admin/Categories/` (Berisi Index, Create, Edit.jsx)
2. **Hapus Folder Halaman Publik:**
    - Hapus _folder_ `resources/js/Pages/Berita/` atau `resources/js/Pages/Public/News/` (Tergantung struktur).
3. **Update Admin Sidebar (`resources/js/Layouts/AdminLayout.jsx`):**
    - Cari menu navigasi ke `/admin/news` dan `/admin/categories`.
    - Hapus elemen HTML _Link_ untuk menu "Berita" dan "Kategori".
4. **Update Navbar Publik & Footer (`resources/js/Components/Public/`):**
    - Buka `Navbar.jsx` dan hapus _Link_ menu navigasi "Berita" / "Artikel".
    - Buka `Footer.jsx` dan hapus _Link_ ke "Berita".
5. **Update Halaman Beranda (`resources/js/Pages/Home.jsx` atau `Welcome.jsx`):**
    - Apabila di halaman depan terdapat komponen yang me-_render_ "Berita Terbaru" (Latest News), hapus _section_ UI tersebut dan hapus _props_ data berita dari return view controllernya.

---

## 4. Eksekusi Pasca Penghapusan

Setelah semua file dan baris kode dihapus, jalankan langkah kompilasi akhir:

1. **Re-build Frontend:**
   `npm run build`
2. **Bersihkan Cache Route Laravel:**
   `php artisan route:clear`
3. **Refresh Database (Jika di Env Development):**
   `php artisan migrate:fresh --seed` (Pastikan seeder berita sudah dihapuskan agar tidak error).

_Dokumen ini bersifat panduan instruksional. Penghapusan fitur secara fisik akan dilakukan mengikuti ceklis dokumen ini._
