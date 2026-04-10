# Dokumentasi Fitur Kredit Macet (Denda & Penarikan Unit)

Berkas ini mendokumentasikan spesifikasi teknis dan Standar Operasional Prosedur (SOP) dari fitur penjaminan kredit pada sistem **SRB Motor**. Fitur ini terbagi menjadi dua tahapan: **Pemberian Denda Harian Otomatis** untuk keterlambatan dan **Tindakan Penarikan Kendaraan (Repossession)** untuk kredit macet ekstrim.

---

## 1. Sistem Denda Harian Otomatis (Auto-Penalty)

Sistem dirancang untuk memperketat kedisiplinan nasabah dalam membayar cicilan/angsuran per bulan yang berjalan. Sistem ini bekerja sepenuhnya melalui *logic autopilot* di *background*.

### Spesifikasi Logika:
*   **Waktu Eksekusi (Cron Job):** Script akan dieksekusi secara otomatis setiap dini hari pada pukul `00:01 WIB`.
*   **Target Deteksi:** Tagihan cicilan bulanan yang statusnya masih aktif (`belum_dibayar` atau `pending`) khusus pada tanggal hari ini yang mana `due_date` (tanggal jatuh temponya) sudah lewat (minimal telat 1 hari).
*   **Rumus Perhitungan Denda:**
    *   **Tarif Denda:** *0.5% (Setengah Persen) per hari.*
    *   **Kalkulasi Total:** Nominal Angsuran Pokok × 0.5% × Total Hari Keterlambatan (`days_overdue`).
    *   Nominal ini akan ditambahkan ke total angsuran dan direkam dalam `penalty_amount`. Saat nasabah mencoba mengeklik bayar via *Payment Gateway* Midtrans (dari aplikasi), penagihannya akan membengkak sesuai akumulasi denda hari tersebut.
*   **Status Alert:** Kolom `is_overdue` milik cicilan akan diselipkan status `true`, dan status pembayaran akan berganti menjadi `overdue`.
*   **Interaksi Broadcast:** Script ini *sengaja diredam/dimatikan* auto-blasting WhatsApp-nya secara kode. Penagihan tetap mengandalkan pendekatan personal oleh staff Admin.

---

## 2. Fitur Penarikan Motor Leasing (Repossession)

Dalam keadaan kredit macet di mana pelanggan menghilang atau terbukti melanggar kontrak berturut-turut, Admin memiliki hak penuh untuk men-terminasi jalannya kredit melalui tombol di Dashboard Administrator.

### Prosedur / SOP Penggunaan:
1.  Admin masuk ke Web Panel -> Menu **Credits (Kredit)**.
2.  Pilih / Klik nasabah yang menunggak (Status transaksinya pasti harus dalam kondisi *Selesai / Sedang Jalan*).
3.  Di sebelah kanan atas navigasi form Detail, akan muncul tombol merah: **"Tarik Motor (Repossess)"**.
4.  Saat tombol ditekan, layar peringatan pop-up akan muncul meminta Admin mengkonfirmasi dan mengisi **"Alasan Penarikan"** (contoh: *Nasabah menunggak 7 bulan*).

### Dampak Logika ke Database Saat Ditarik:
Penataan *Repossession* menggunakan struktur data yang sudah mapan (tanpa rombak skema tabel).
*   **Tagihan Hangus (`installments`):** Semua rentetan sisa tagihan angsuran bulan-bulan penarikkan dan seterusnya yang belum dibayar akan ditutup secara sepihak *(Status berganti dari 'belum_dibayar' menjadi 'dibatalkan_sistem')*. **Hal ini otomatis menghentikan Cron Job Denda dari menagih angka yang salah**.
*   **Status Kepemilikan (`credit_details` & `transactions`):** Seluruh status pusat kredit akan diubah menjadi `ditarik_leasing`. Pelanggan di Aplikasi Mobile sudah tidak akan bisa melanjutkan simulasi ini.
*   **Pelacakan Sejarah (Audit Log):** Tidak perlu khawatir data hilang. Sistem telah menembak log transksaksi beruntun di tabel `transaction_logs` lengkap dengan `actor_id` (Admin siapa yang menekan perintah tarik), jam penarikan, beserta alasan ketikannya.

---

### Catatan Tambahan (Pengelolaan Fisik Motor Ter-Repossess)
Data ini tidak akan me-*restock* ketersediaan stok model asal (*MOTORS*) menjadi +1 kembali seperti halnya order gagal biasa. Kenapa? Karena unit yang ditarik secara operasional nyata adalah komponen *Second-hand/Used* (Bekas). Anda wajib melakukan mutasi barang bekas secara manual dalam sistem/gudang untuk dijual kembali, agar hitungan stok laporan dealer baru SRB Motor tidak retak dan bertubrukan.
