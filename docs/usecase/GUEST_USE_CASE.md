# Use Case: Guest (Pengunjung Umum)

Aktor **Guest** adalah pengguna yang belum terautentikasi. Memiliki akses penuh ke informasi produk dan lokasi namun tidak bisa melakukan transaksi.

---

## 1. Rincian Use Case (Relationship & Implementation)

### **UC-G01: Melihat Katalog Motor**
*   **Relasi**:
    *   `<<include>>` Memuat Data Banner Promo
    *   `<<extend>>` Melakukan Pencarian (Search)
    *   `<<extend>>` Filter Berdasarkan Merk/Harga
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/MotorGalleryController.php` (index)
    *   **Frontend**: `resources/js/Pages/Motors/Index.jsx`
    *   **Repository**: `app/Repositories/Eloquent/MotorRepository.php`

### **UC-G02: Melihat Detail Motor**
*   **Relasi**:
    *   `<<include>>` Simulasi Kredit Sederhana
    *   `<<extend>>` Tambahkan ke Daftar Banding
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/MotorGalleryController.php` (show)
    *   **Frontend**: `resources/js/Pages/Motors/Show.jsx`

### **UC-G03: Membandingkan Unit**
*   **Relasi**:
    *   `<<include>>` Kalkulasi Selisih Harga
*   **File Berhubungan**:
    *   **Frontend**: `resources/js/Pages/Motors/Compare.jsx`

### **UC-G04: Mencari Cabang Terdekat**
*   **Relasi**:
    *   `<<include>>` Akses Lokasi GPS (Browser Geolocation)
    *   `<<extend>>` Hitung Jarak Terdekat (Haversine Logic)
*   **File Berhubungan**:
    *   **Service**: `app/Services/BranchService.php`
    *   **Frontend**: `resources/js/Pages/About.jsx`

### **UC-G05: Kirim Pesan Kontak**
*   **Relasi**:
    *   `<<include>>` Validasi Form Input
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/ContactMessageController.php`

### **UC-G06: Registrasi Akun**
*   **Relasi**:
    *   `<<extend>>` Login via Google (OAuth)
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/AuthController.php`
    *   **Frontend**: `resources/js/Pages/Auth/Register.jsx`
