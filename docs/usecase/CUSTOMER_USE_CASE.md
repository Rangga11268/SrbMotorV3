# Use Case: Customer (Pelanggan Terdaftar)

Aktor **Customer** adalah pengguna yang memiliki otorisasi untuk melakukan transaksi dan mengakses layanan purna jual (servis).

---

## 1. Rincian Use Case (Relationship & Implementation)

### **UC-C01: Pemesanan Unit (Cash/Credit)**
*   **Relasi**:
    *   `<<include>>` Pilih Lokasi Cabang Pengambilan
    *   `<<include>>` Kirim Notifikasi WhatsApp Admin/User
    *   `<<extend>>` Gunakan GPS untuk Lokasi Terdekat
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/MotorGalleryController.php` (processCashOrder, processCreditOrder)
    *   **Service**: `app/Services/TransactionService.php`
    *   **Frontend**: `resources/js/Pages/Motors/CashOrderForm.jsx`, `CreditOrderForm.jsx`

### **UC-C02: Pengajuan Kredit**
*   **Relasi**:
    *   `<<include>>` Kalkulasi Tenor & DP
    *   `<<include>>` Upload Berkas (KTP, KK, Slip Gaji)
    *   `<<extend>>` Tambahkan Dokumen Pendukung Lainnya
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/MotorGalleryController.php` (uploadCreditDocuments)
    *   **Model**: `app/Models/CreditDetail.php`, `app/Models/Document.php`

### **UC-C03: Booking Servis Berkala**
*   **Relasi**:
    *   `<<include>>` Pilih Jadwal (Slot Time)
    *   `<<include>>` Generate Digital Ticket (Nomor Antrian)
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/ServiceAppointmentController.php`
    *   **Frontend**: `resources/js/Pages/Services/Booking.jsx`

### **UC-C04: Tracking Transaksi**
*   **Relasi**:
    *   `<<include>>` Lihat Log Status (Timeline)
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/MotorGalleryController.php` (showOrderConfirmation)
    *   **Frontend**: `resources/js/Pages/Motors/OrderConfirmation.jsx`

### **UC-C05: Melakukan Pembayaran**
*   **Relasi**:
    *   `<<include>>` Integrasi Gateway (Midtrans)
    *   `<<extend>>` Upload Bukti Transfer Manual
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/InvoiceController.php`
    *   **Logic**: Update status `installments`.

### **UC-C06: Manajemen Profil**
*   **Relasi**:
    *   `<<extend>>` Update NIK & Alamat Lengkap
*   **File Berhubungan**:
    *   **Backend**: `app/Http/Controllers/ProfileController.php`
