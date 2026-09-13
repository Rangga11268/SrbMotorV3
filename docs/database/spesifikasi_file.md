# Spesifikasi File Database SRB Motor v2 (Lengkap)

Dokumen ini berisi spesifikasi teknis mendalam untuk 11 tabel utama dalam database sistem SRB Motor v2 berdasarkan skema terbaru.

---

## 1. Spesifikasi File Tabel Users
**Fungsi:** Menyimpan data pengguna sistem dan profil lengkap pelanggan.  
**Akronim:** users.ibd | **Tipe:** Master | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID User | id | BigInt | 20 | Primary Key |
| 2 | Nama Lengkap | name | Varchar | 255 | |
| 3 | Email | email | Varchar | 255 | Unique |
| 4 | Password | password | Varchar | 255 | |
| 5 | Role | role | Varchar | 20 | admin/user |
| 6 | Google ID | google_id | Varchar | 255 | Untuk OAuth |
| 7 | Path Foto | profile_photo_path | Varchar | 2048 | |
| 8 | No. Telepon | phone | Varchar | 20 | |
| 9 | Alamat | alamat | Text | - | |
| 10 | Latitude | latitude | Double | - | |
| 11 | Longitude | longitude | Double | - | |
| 12 | Cabang Favorit | preferred_branch | Varchar | 50 | |
| 13 | NIK | nik | Varchar | 16 | |
| 14 | Pekerjaan | occupation | Varchar | 255 | |
| 15 | Pendapatan | monthly_income | Decimal | 15,2 | |
| 16 | Remember Token | remember_token | Varchar | 100 | |

---

## 2. Spesifikasi File Tabel Motors
**Fungsi:** Menyimpan data unit sepeda motor yang tersedia di katalog.  
**Akronim:** motors.ibd | **Tipe:** Master | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Motor | id | BigInt | 20 | Primary Key |
| 2 | Nama Motor | name | Varchar | 255 | |
| 3 | Brand | brand | Varchar | 50 | |
| 4 | Model | model | Varchar | 100 | |
| 5 | Harga | price | Decimal | 15,2 | |
| 6 | DP Min | min_dp_amount | Decimal | 15,2 | |
| 7 | Varian Warna | colors | Text | - | |
| 8 | Kode Cabang | branch | Varchar | 50 | |
| 9 | Tahun | year | Int | 4 | |
| 10 | Tipe | type | Varchar | 50 | |
| 11 | Path Gambar | image_path | Varchar | 255 | |
| 12 | Detail/Spek | details | Text | - | |
| 13 | Status Tersedia | tersedia | Boolean | 1 | |

---

## 3. Spesifikasi File Tabel Transactions
**Fungsi:** Menyimpan data pesanan kendaraan baik tunai maupun kredit.  
**Akronim:** transactions.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Transaksi | id | BigInt | 20 | Primary Key |
| 2 | ID User | user_id | BigInt | 20 | Foreign Key |
| 3 | Nama | name | Varchar | 255 | Snapshot |
| 4 | NIK | nik | Varchar | 16 | |
| 5 | No. Referensi | reference_number | Varchar | 50 | |
| 6 | Tipe Order | transaction_type | Varchar | 20 | CASH/CREDIT |
| 7 | Status | status | Varchar | 50 | |
| 8 | ID Motor | motor_id | BigInt | 20 | Foreign Key |
| 9 | Kode Cabang | branch_code | Varchar | 50 | |
| 10 | Warna Motor | motor_color | Varchar | 50 | |
| 11 | Harga Motor | motor_price | Decimal | 15,2 | |
| 12 | Booking Fee | booking_fee | Decimal | 15,2 | |
| 13 | No. HP | phone | Varchar | 20 | |
| 14 | Email | email | Varchar | 255 | |
| 15 | Alamat | address | Text | - | |
| 16 | Metode Kirim | delivery_method | Varchar | 50 | |
| 17 | Tanggal Kirim | delivery_date | DateTime | - | |
| 18 | Pekerjaan | occupation | Varchar | 255 | |
| 19 | Pendapatan | monthly_income | Decimal | 15,2 | |
| 20 | Lama Kerja | employment_duration | Varchar | 100 | |
| 21 | Total Harga | total_price | Decimal | 15,2 | |
| 22 | Harga Final | final_price | Decimal | 15,2 | |
| 23 | Metode Bayar | payment_method | Varchar | 50 | |
| 24 | Alasan Batal | cancellation_reason | Text | - | |
| 25 | Catatan | notes | Text | - | |

---

## 4. Spesifikasi File Tabel Transaction Logs
**Fungsi:** Mencatat histori perubahan status pada setiap transaksi.  
**Akronim:** transaction_logs.ibd | **Tipe:** History | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Log | id | BigInt | 20 | Primary Key |
| 2 | ID Transaksi | transaction_id | BigInt | 20 | Foreign Key |
| 3 | Status Asal | status_from | Varchar | 50 | |
| 4 | Status Tujuan | status_to | Varchar | 50 | |
| 5 | ID Aktor | actor_id | BigInt | 20 | |
| 6 | Tipe Aktor | actor_type | Varchar | 255 | |
| 7 | Deskripsi | description | Text | - | |
| 8 | Catatan | notes | Text | - | |
| 9 | Payload Data | payload | Text | - | JSON Data |
| 10 | Status Log | status | Varchar | 50 | |

---

## 5. Spesifikasi File Tabel Credit Details
**Fungsi:** Menyimpan rincian finansial untuk transaksi skema kredit.  
**Akronim:** credit_details.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Credit | id | BigInt | 20 | Primary Key |
| 2 | ID Transaksi | transaction_id | BigInt | 20 | Foreign Key |
| 3 | Provider Leasing | leasing_provider | Varchar | 100 | |
| 4 | Status Kredit | status | Varchar | 50 | |
| 5 | No. Referensi | reference_number | Varchar | 50 | |
| 6 | Tenor | tenor | Int | 3 | Bulan |
| 7 | Suku Bunga | interest_rate | Decimal | 5,2 | |
| 8 | Cicilan Bulanan | monthly_installment | Decimal | 15,2 | |
| 9 | Catatan Verif | verification_notes | Text | - | |
| 10 | Nominal DP | dp_amount | Decimal | 15,2 | |
| 11 | Metode Bayar DP | dp_payment_method | Varchar | 50 | |
| 12 | Catatan Selesai | completion_notes | Text | - | |
| 13 | Selesai | is_completed | Boolean | 1 | |

---

## 6. Spesifikasi File Tabel Installments
**Fungsi:** Mengelola data tagihan pembayaran (DP, Pelunasan, Cicilan).  
**Akronim:** installments.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Tagihan | id | BigInt | 20 | Primary Key |
| 2 | ID Transaksi | transaction_id | BigInt | 20 | Foreign Key |
| 3 | No. Angsuran | installment_number | Int | 3 | |
| 4 | Jatuh Tempo | due_date | Date | - | |
| 5 | Nominal | amount | Decimal | 15,2 | |
| 6 | Status | status | Varchar | 20 | |
| 7 | Metode Bayar | payment_method | Varchar | 50 | |
| 8 | Bukti Bayar | payment_proof | Varchar | 255 | |
| 9 | Snap Token | snap_token | Varchar | 255 | Midtrans |
| 10 | Booking Code | midtrans_booking_code | Varchar | 255 | |
| 11 | Lewat Waktu | is_overdue | Boolean | 1 | |
| 12 | Hari Terlambat | days_overdue | Int | 5 | |
| 13 | Denda | penalty_amount | Decimal | 15,2 | |
| 14 | Total + Denda | total_with_penalty | Decimal | 15,2 | |
| 15 | Reminder Sent | reminder_sent | Boolean | 1 | |
| 16 | Waktu Reminder | reminder_sent_at | Timestamp | - | |
| 17 | Catatan | notes | Text | - | |

---

## 7. Spesifikasi File Tabel Documents
**Fungsi:** Menyimpan metadata dokumen persyaratan kredit pelanggan.  
**Akronim:** documents.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Dokumen | id | BigInt | 20 | Primary Key |
| 2 | ID Credit | credit_detail_id | BigInt | 20 | Foreign Key |
| 3 | Tipe Dokumen | document_type | Varchar | 50 | KTP/KK/SLIP |
| 4 | Deskripsi | description | Text | - | |
| 5 | Path File | file_path | Varchar | 255 | |
| 6 | Nama Asli | original_name | Varchar | 255 | |
| 7 | Ukuran File | file_size | Int | 11 | KB/Bytes |
| 8 | Status | status | Varchar | 20 | |
| 9 | Status Approval | approval_status | Varchar | 20 | |
| 10 | Alasan Tolak | rejection_reason | Text | - | |
| 11 | Review At | reviewed_at | Timestamp | - | |
| 12 | Submitted At | submitted_at | Timestamp | - | |

---

## 8. Spesifikasi File Tabel Survey Schedules
**Fungsi:** Mengatur penjadwalan survey fisik oleh pihak leasing/dealer.  
**Akronim:** survey_schedules.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Jadwal | id | BigInt | 20 | Primary Key |
| 2 | ID Credit | credit_detail_id | BigInt | 20 | Foreign Key |
| 3 | Tanggal Survey | scheduled_date | Date | - | |
| 4 | Jam Survey | scheduled_time | Time | - | |
| 5 | Nama Surveyor | surveyor_name | Varchar | 255 | |
| 6 | No. HP Surveyor | surveyor_phone | Varchar | 20 | |
| 7 | Status | status | Varchar | 50 | |
| 8 | Lokasi | location | Text | - | |
| 9 | Catatan Admin | notes | Text | - | |
| 10 | Catatan User | customer_notes | Text | - | |
| 11 | User Konfirmasi | customer_confirms | Boolean | 1 | |
| 12 | Waktu Konfirm | customer_confirmed_at | Timestamp | - | |
| 13 | Note Konfirm | customer_confirmation_notes | Text | - | |
| 14 | Hasil Survey | survey_result | Text | - | |
| 15 | Temuan | findings | Text | - | |

---

## 9. Spesifikasi File Tabel Service Appointments
**Fungsi:** Mengelola pendaftaran booking service berkala pelanggan.  
**Akronim:** service_appointments.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Appointment | id | BigInt | 20 | Primary Key |
| 2 | ID User | user_id | BigInt | 20 | Foreign Key |
| 3 | Cabang | branch | Varchar | 255 | |
| 4 | Nama Pelanggan | customer_name | Varchar | 255 | |
| 5 | No. HP | customer_phone | Varchar | 20 | |
| 6 | No. Polisi | plate_number | Varchar | 20 | |
| 7 | No. Antrean | queue_number | Varchar | 10 | |
| 8 | Model Motor | motor_model | Varchar | 255 | |
| 9 | Tanggal | service_date | Date | - | |
| 10 | Jam | service_time | Time | - | |
| 11 | Tipe Service | service_type | Varchar | 100 | |
| 12 | Keluhan | complaint_notes | Text | - | |
| 13 | Status | status | Varchar | 20 | |
| 14 | Pembatal Oleh | cancelled_by | Varchar | 50 | |
| 15 | Alasan Batal | cancel_reason | Text | - | |
| 16 | Note Admin | admin_notes | Text | - | |
| 17 | Note Mekanik | service_notes | Text | - | |

---

## 10. Spesifikasi File Tabel Notifications
**Fungsi:** Menyimpan pemberitahuan sistem untuk pengguna.  
**Akronim:** notifications.ibd | **Tipe:** Transaksi | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Notif | id | Varchar | 36 | Primary Key (UUID) |
| 2 | Tipe | type | Varchar | 255 | |
| 3 | Notifiable Type | notifiable_type | Varchar | 255 | |
| 4 | Notifiable ID | notifiable_id | BigInt | 20 | |
| 5 | Konten Data | data | Text | - | JSON |
| 6 | Waktu Baca | read_at | Timestamp | - | |

---

## 11. Spesifikasi File Tabel Settings
**Fungsi:** Menyimpan konfigurasi global dan data statis sistem.  
**Akronim:** settings.ibd | **Tipe:** Master | **Kunci Field:** id | **Software:** MySQL  

| No | Elemen Data | Nama Field | Type | Size | Keterangan |
|----|-------------|------------|------|------|------------|
| 1 | ID Setting | id | BigInt | 20 | Primary Key |
| 2 | Key | key | Varchar | 255 | |
| 3 | Value | value | Text | - | |
| 4 | Tipe | type | Varchar | 50 | |
| 5 | Kategori | category | Varchar | 50 | |
| 6 | Deskripsi | description | Text | - | |
