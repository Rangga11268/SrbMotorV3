# 📊 Spesifikasi Use Case (Fish Level) - SRB Motor

Dokumen ini menjelaskan detail teknis untuk **4 Fitur Utama** yang telah diuji dalam [SQA_TEST_REPORT.md](file:///d:/laragon/www/SrbMotor/docs/SQA_TEST_REPORT.md). Panduan ini dibuat agar mudah dipahami, terutama penjelasan mengenai "Oval" dan "Garis".

---

## 🎨 Diagram Use Case (Lengkap 4 Fitur)

Diagram ini menggambarkan interaksi antara pengguna, sistem, dan layanan eksternal untuk semua fitur yang diuji.

```mermaid
useCaseDiagram
    actor "User (Pelanggan)" as User
    actor "Admin (Petugas)" as Admin
    actor "Sistem SRB Motor" as System
    actor "Database" as DB
    actor "Midtrans API" as Midtrans

    %% Kotak besar di bawah ini adalah System Boundary
    package "Batas Sistem (System Boundary) - SRB Motor" {
        %% Fitur 1: Filter
        usecase "UC-01: Filter Merk Motor" as UC1
        usecase "Sub-UC: Query Filter DB" as UC1a

        %% Fitur 2: Kredit
        usecase "UC-02: Validasi File KTP" as UC2
        usecase "Sub-UC: Tampilkan Error" as UC2a

        %% Fitur 3: Servis
        usecase "UC-03: Cek Slot Servis" as UC3
        usecase "Sub-UC: Hitung Kuota" as UC3a

        %% Fitur 4: Pembayaran
        usecase "UC-04: Sinkronisasi Bayar" as UC4
        usecase "Sub-UC: Update Status Lunas" as UC4a

        %% BARU - Fitur Admin
        usecase "UC-05: Verifikasi Pengajuan" as UC5
        usecase "UC-06: Kelola Stok Kendaraan" as UC6
    }

    %% Hubungan User ke Fitur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4

    %% Hubungan Admin ke Fitur
    Admin --> UC5
    Admin --> UC6

    %% Hubungan Wajib (Include)
    UC1 ..> UC1a : <<include>>
    UC2 ..> UC2a : <<extend>>
    UC3 ..> UC3a : <<include>>
    UC4 ..> UC4a : <<include>>

    %% Hubungan ke Belakang Layar
    UC1a ..> DB : "Read"
    UC3a ..> DB : "Read"
    UC4a ..> DB : "Write"
    UC4 ..> Midtrans : "Webhook"
    UC5 ..> DB : "Write Status"
    UC6 ..> DB : "Update Stock"
```

---

## 🧐 Penjelasan "Oval" (Apa Saja Fiturnya?)

Setiap oval (lingkaran) di atas mewakili satu tugas spesifik yang dilakukan sistem:

1.  **UC-01 (Filter Merk Motor)**: Sistem menyaring daftar motor sesuai merk yang dipilih user di Galeri.
2.  **UC-02 (Validasi File KTP)**: Sistem memastikan dokumen wajib (KTP) sudah diunggah sebelum data dikirim.
3.  **UC-03 (Cek Slot Servis)**: Sistem memeriksa apakah kuota harian mekanik masih tersedia untuk tanggal yang dipilih.
4.  **UC-04 (Sinkronisasi Bayar)**: Sistem menerima notifikasi otomatis dari Midtrans jika pembayaran user sukses.
5.  **UC-05 (Verifikasi Pengajuan)**: Admin memeriksa kelengkapan dokumen dan mengubah status pengajuan menjadi "Disetujui".
6.  **UC-06 (Kelola Stok Kendaraan)**: Admin memperbarui data ketersediaan unit (Tersedia/Terjual) di katalog.

---

## 🖇️ Panduan "Garis" (Bagaimana Cara Kerjanya?)

Agar laporan SQA Anda jelas, berikut arti dari setiap garis penghubung:

### 1. Garis Panah Lurus (`-->`)
*   **Artinya**: **"Aktor Memulai Tindakan"**.
*   **Contoh**: User mengklik filter "Yamaha", maka User memulai Use Case **UC-01**.

### 2. Garis Putus-putus `<<include>>` (Pasti Jalan)
*   **Artinya**: **"Bagian yang Wajib Ada"**.
*   **Contoh**: Di **UC-03**, sistem **pasti** melakukan **Hitung Kuota** ke database. Tidak mungkin bisa cek slot tanpa menghitung jumlah data di database.

### 3. Garis Putus-putus `<<extend>>` (Jalan Jika Error)
*   **Artinya**: **"Kondisi Tambahan"**.
*   **Contoh**: Di **UC-02**, fungsi **Tampilkan Error** cuma jalan **KALAU** usernya lupa upload file. Kalau user benar, garis ini tidak akan "dilewati" sistem.

---

## 📝 Detil Alur Jalannya Fitur (Sinkron dengan TC)

### UC-01: Filter Merk Motor (SQA-TC-01)
*   **Alur**: User pilih "Yamaha" -> Sistem memicu `UC1` -> Sistem menjalankan `UC1a` (Query DB) -> Hasil muncul di layar.

### UC-02: Validasi File KTP (SQA-TC-02)
*   **Alur**: User klik "Ajukan" -> Sistem memicu `UC2` -> Jika file kosong, sistem memicu `UC2a` (Tampilkan Error) -> Proses berhenti.

### UC-03: Cek Slot Servis (SQA-TC-03)
*   **Alur**: User pilih tanggal di kalender -> Sistem memicu `UC3` -> Sistem menjalankan `UC3a` (Hitung Kuota) -> Jika penuh, tanggal di-lock (Disabled).

### UC-04: Sinkronisasi Bayar (SQA-TC-04)
*   **Alur**: User bayar di Midtrans -> **Layanan Midtrans** mengirim notifikasi ke `UC4` -> Sistem memicu `UC4a` (Update DB jadi Lunas) -> Dashboard user berubah real-time.

### UC-05: Verifikasi Pengajuan Kredit (SQA-TC-05)
*   **Alur**: Admin login -> Admin pilih data pengajuan -> Admin klik "Approve" -> Sistem memicu `UC5` -> Data di DB berubah -> User melihat status "Disetujui".

### UC-06: Kelola Stok Kendaraan (SQA-TC-06)
*   **Alur**: Admin buka Manajemen Motor -> Admin ubah stok jadi 0 -> Sistem memicu `UC6` -> Galeri Publik otomatis menampilkan badge "TERJUAL".

---
> [!TIP]
> **Catatan SQA**: Dengan memetakan 4 Use Case ini, Anda telah mendokumentasikan seluruh fungsionalitas yang Anda uji di Test Report secara lengkap dan standar industri.
