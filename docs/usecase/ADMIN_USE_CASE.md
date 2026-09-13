# Use Case: Admin (Staff Operasional)

Aktor **Admin** memiliki kewenangan untuk mengelola operasional harian, memproses pesanan, dan melakukan verifikasi lapangan.

---

## 1. Rincian Use Case (Relationship & Implementation)

### **UC-A01: Manajemen Data Motor**
*   **Relasi**:
    *   `<<include>>` Update Stok & Ketersediaan
    *   `<<extend>>` Tambah Promo/Diskon Unit
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/MotorController.php`
    *   **Frontend**: `resources/js/Pages/Admin/Motors/Index.jsx`

### **UC-A02: Verifikasi & Proses Transaksi**
*   **Relasi**:
    *   `<<include>>` Konfirmasi Pembayaran
    *   `<<include>>` Update Status (Timeline Pesanan)
    *   `<<extend>>` Batalkan Transaksi (Jika Data Tidak Valid)
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/Admin/TransactionController.php`
    *   **Service**: `app/Services/TransactionService.php`
    *   **Frontend**: `resources/js/Pages/Admin/Transactions/Show.jsx`

### **UC-A03: Verifikasi Dokumen Kredit**
*   **Relasi**:
    *   `<<include>>` Review Dokumen (KTP, KK, dsb)
    *   `<<include>>` Penentuan Jadwal Survey
    *   `<<extend>>` Kirim Data ke Surveyor/Leasing
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/Admin/TransactionController.php`
    *   **Frontend**: `resources/js/Pages/Admin/Transactions/Show.jsx` (Section Dokumen)

### **UC-A04: Manajemen Cabang**
*   **Relasi**:
    *   `<<include>>` Input Koordinat GPS (Latitude/Longitude)
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/Admin/BranchController.php`
    *   **Frontend**: `resources/js/Pages/Admin/Branches/Form.jsx`

### **UC-A05: Kelola Antrian Servis**
*   **Relasi**:
    *   `<<include>>` Proses Pengerjaan (Confirmed -> In Progress)
    *   `<<include>>` Selesaikan Servis (In Progress -> Completed)
    *   `<<include>>` Kirim Notifikasi WA (Motor Siap Diambil)
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/ServiceAppointmentController.php`
    *   **Frontend**: `resources/js/Pages/Admin/Services/Index.jsx`
