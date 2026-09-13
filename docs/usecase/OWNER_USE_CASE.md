# Use Case: Owner (Pemilik Dealer)

Aktor **Owner** adalah pemegang kekuasaan tertinggi dalam sistem (Super Admin). Fokus utama Owner adalah pada pengawasan performa bisnis dan pengelolaan infrastruktur admin.

---

## 1. Daftar Use Case
| ID | Nama Use Case | Deskripsi |
| :--- | :--- | :--- |
| **UC-O01** | Analisis Laporan Penjualan | Memantau grafik pendapatan dan tren unit yang paling laku. |
| **UC-O02** | Manajemen Akun Admin | Mengelola siapa saja yang berhak masuk ke Dashboard Admin. |
| **UC-O03** | Pengaturan Konfigurasi Global | Mengatur parameter sistem seperti kuota servis, biaya admin, dan lainnya. |

---

## 2. Rincian Use Case (Relationship & Implementation)

### **UC-O01: Analisis Laporan Penjualan**
*   **Relasi**:
    *   `<<include>>` Filter Periode (Bulanan/Tahunan)
    *   `<<extend>>` Download Laporan PDF/Excel
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/ReportController.php`
    *   **Logic**: Query `Transaction::where('status', 'completed')` dengan agregasi `SUM(final_price)`.
    *   **Frontend**: `resources/js/Pages/Admin/Reports/Index.jsx`

### **UC-O02: Manajemen Akun Admin**
*   **Relasi**:
    *   `<<include>>` Autentikasi Super Admin (Hanya Role Owner)
    *   `<<extend>>` Nonaktifkan Akun Admin
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/UserController.php`
    *   **Frontend**: `resources/js/Pages/Admin/Users/Index.jsx`
    *   **Model**: `app/Models/User.php` (Method `isAdmin()`, `isOwner()`)

### **UC-O03: Pengaturan Konfigurasi Global**
*   **Relasi**:
    *   `<<include>>` Sinkronisasi Cache Pengaturan
*   **File Berhubungan**:
    *   **Backend**: `app/Models/Setting.php` & `app/Http/Controllers/Admin/BranchController.php`
    *   **Frontend**: `resources/js/Layouts/MetronicAdminLayout.jsx` (Sidebar menu khusus owner)
    *   **Data**: Memodifikasi tabel `settings`.

---

## 3. Alur Kerja (Workflows)
1.  Owner login -> Masuk ke Dashboard Utama.
2.  Owner membuka menu Laporan -> Menjalankan **UC-O01**.
3.  Owner menambah staff admin baru -> Menjalankan **UC-O02**.
