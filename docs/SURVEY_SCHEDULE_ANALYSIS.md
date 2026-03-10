# ANALISIS JADWAL SURVEY - Kegunaan & Implementasi

**Last Updated**: March 10, 2026  
**Status**: Analysis Complete - Ready for Implementation Decision

---

## 📋 RINGKASAN EKSEKUTIF

**Jadwal Survey** adalah fitur untuk **mengelola jadwal kunjungan surveyor kredit ke lokasi customer** sebelum kredit disetujui akhir.

**Keputusan Database**: Tabel terpisah `survey_schedules` adalah pilihan **TERBAIK** karena:
- ✅ Flexible (bisa multiple survey per transaksi jika ditolak & dijadwalkan ulang)
- ✅ Clean separation of concerns (transaksi ≠ survey details)
- ✅ Scalable (mudah extend dengan fields lain: foto survey, hasil survey, dll)

---

## 🔄 ALUR BISNIS KREDIT & SURVEY

```
┌──────────────────────────────────────────────────────────────┐
│ CUSTOMER SUBMIT KREDIT ORDER                                 │
├──────────────────────────────────────────────────────────────┤
│ Status: menunggu_persetujuan                                  │
│ ↓                                                             │
│ ADMIN VERIFIKASI DOKUMEN (KTP, KK, Slip Gaji, dll)          │
│ ✓ Valid → Status: dikirim_ke_surveyor                        │
│ ✗ Invalid → Status: data_tidak_valid (customer perbaiki)     │
│ ↓                                                             │
│ ADMIN JADWALKAN SURVEY                                        │
│ ✓ Buat SurveySchedule dengan:                                │
│   - Tanggal & waktu survei                                   │
│   - Lokasi (alamat customer)                                 │
│   - Nama surveyor (dari leasing/bank partner)                │
│   - Nomor surveyor (untuk komunikasi)                        │
│ Status: jadwal_survey                                        │
│ ↓                                                             │
│ SURVEYOR KUNJUNGI CUSTOMER                                   │
│ ✓ Verifikasi aset (motor), domisili, kelayakan kredit        │
│ ✓ Surveyor submit hasil survey (konfirmasi di app)           │
│ Status: survey_selesai (optional, bisa skip ke approval)     │
│ ↓                                                             │
│ ADMIN APPROVE/REJECT KREDIT (FINAL DECISION)                 │
│ ✓ Approve → Status: disetujui + Generate cicilan             │
│ ✗ Reject → Status: ditolak (customer bisa appeal/ulangi)     │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEGUNAAN DI SISTEM

### UNTUK ADMIN
**Lokasi**: `/admin/transactions/{id}/edit` atau halaman survey terpisah

1. **Jadwalkan Survey** (saat status: dikirim_ke_surveyor)
   - Input tanggal, waktu, lokasi, nama surveyor
   - Sistem auto-kirim WhatsApp ke customer dengan detail survey
   - Customer bisa confirm kehadiran atau reschedule

2. **Monitoring Survey**
   - Lihat status: pending / confirmed / completed / cancelled
   - Reschedule jika customer atau surveyor minta perubahan
   - Cancel survey jika kredit ditolak di dokumen

3. **Approve Kredit Setelah Survey**
   - Setelah surveyor submit hasil survey (completed)
   - Admin approve → cicilan otomatis generated
   - Customer terima notifikasi kredit disetujui

### UNTUK CUSTOMER (FE)
**Lokasi**: `/motors/my-transactions` atau detail transaksi

1. **Lihat Jadwal Survey**
   - Tanggal, waktu, lokasi survei
   - Nama & nomor surveyor (bisa hubungi via WhatsApp)
   - Status: pending / confirmed / completed

2. **Confirm/Reschedule Survey**
   - Button "Confirm Kehadiran" → update status ke `confirmed`
   - Button "Minta Reschedule" → kirim pesan ke admin
   - WhatsApp langsung ke surveyor jika ada pertanyaan

3. **Upload Hasil Survey**
   - Setelah surveyor kunjung, customer bisa upload foto (optional)
   - Atau surveyor sudah submit hasil via admin panel

---

## 📊 DATABASE SCHEMA ANALYSIS

### Tabel: `survey_schedules`
```
id                    | PK
credit_detail_id      | FK → credit_details (cascade delete)
scheduled_date        | DATE
scheduled_time        | TIME
location              | VARCHAR(255) - alamat customer untuk survey
surveyor_name         | VARCHAR(255) - nama surveyor/bank partner
surveyor_phone        | VARCHAR(20) - nomor surveyor (WA)
status                | ENUM: pending, confirmed, completed, cancelled
notes                 | TEXT - catatan survey (hasil survey, dll)
created_at, updated_at| TIMESTAMPS
```

### Relationship
```
SurveySchedule → CreditDetail (1:1 atau 1:N)
                    ↓
              CreditDetail → Transaction
                    ↓
              Transaction → User (customer)
```

### Mengapa TABEL TERPISAH lebih baik dari KOLOM di `credit_details`?

**Opsi A: Kolom di `credit_details`** ❌
```
credit_details table:
├── scheduled_date (1 record per transaksi)
├── scheduled_time
├── location
├── surveyor_name
├── surveyor_phone
└── survey_status

Problem:
- Jika survey ditolak & dijadwalkan ulang → overwrite data lama (lose history)
- Tidak bisa track multiple survei (ada yang ditolak 3x sebelum approve)
- Sulit extend dengan fields baru (foto survey, hasil survey detail, rating surveyor)
- Update survey berarti UPDATE tabel besar `credit_details` → performa impact
```

**Opsi B: Tabel Terpisah `survey_schedules`** ✅ **(PILIHAN SEKARANG)**
```
survey_schedules table:
├── id (multiple records per transaksi)
├── credit_detail_id
├── scheduled_date
├── scheduled_time
├── location
├── surveyor_name
├── surveyor_phone
├── status (pending → confirmed → completed → cancelled)
└── notes

Keuntungan:
✓ Audit trail lengkap (lihat riwayat semua survey)
✓ Handle reschedule dengan mudah (INSERT baru, cancel yang lama)
✓ Performa lebih baik (table lebih kecil, INDEX lebih efektif)
✓ Scalable (tambah fields baru tanpa impact credit_details)
✓ Support multiple survey per kredit (jika ditolak & ulang)
✓ Mudah generate laporan survey
```

---

## 💾 IMPLEMENTASI SAAT INI

### Status di Database
```php
// credit_details.credit_status progression:
'menunggu_persetujuan'   → Dokumen belum diterima
'data_tidak_valid'       → Dokumen ada yang kurang/salah
'dikirim_ke_surveyor'    → Dokumen lengkap, siap survey
'jadwal_survey'          → Survey sudah dijadwalkan (SurveySchedule dibuat)
'survey_selesai'         → Surveyor sudah kunjung & submit hasil
'disetujui'              → FINAL APPROVAL - kredit disetujui
'ditolak'                → FINAL REJECTION
```

### Status di SurveySchedule
```php
'pending'    → Survey baru dijadwalkan, belum dikonfirmasi customer
'confirmed'  → Customer confirm kehadiran
'completed'  → Surveyor sudah selesai kunjungan & submit hasil
'cancelled'  → Survey dibatalkan (customer reject atau admin cancel)
```

---

## 📍 IMPLEMENTASI DI FE - KOLOM ATAU TABLE?

### Opsi 1: KOLOM di Card (Recommended untuk UX Sederhana) ✅
```
┌─────────────────────────────────────────────────┐
│ ORDER DETAIL                                    │
├─────────────────────────────────────────────────┤
│ Status: Jadwal Survey                           │
│                                                 │
│ 📅 Jadwal Survey:                              │
│    • Tanggal: 15 Maret 2026                    │
│    • Waktu: 10:00 - 11:00                      │
│    • Lokasi: Jl. Ahmad Yani No.123, Jakarta    │
│    • Surveyor: Budi Santoso (0812-XXXX-XXXX)   │
│    • Status: ✅ Confirm Kehadiran              │
│                                                 │
│ [Confirm] [Reschedule] [Chat Surveyor]        │
└─────────────────────────────────────────────────┘

Lokasi: Di dalam modal/page detail transaksi
Pros:
- Clean & simple
- Tidak tambah clutter screen
- Relevant info semua di satu tempat
Cons:
- Tidak bisa riwayat survey lama (jika reschedule)
```

### Opsi 2: TABLE TERPISAH (Untuk tracking lengkap) 🏗️
```
┌──────────────────────────────────────────────────┐
│ RIWAYAT SURVEY                                   │
├──────────────────────────────────────────────────┤
│ No. | Tanggal | Waktu | Lokasi | Surveyor | Status |
├─────┼─────────┼───────┼────────┼──────────┼────────┤
│ 1   │ 10 Mar  │ 14:00 │ Jl A   │ Budi     │ ❌ Cancelled
│ 2   │ 15 Mar  │ 10:00 │ Jl A   │ Budi     │ ✅ Confirmed
│ 3   │ 15 Mar  │ 10:00 │ Jl A   │ Budi     │ ✅ Completed
├─────┴─────────┴───────┴────────┴──────────┴────────┤
│ [View Detail] [Download Laporan]                  │
└──────────────────────────────────────────────────┘

Lokasi: Tab terpisah di halaman transaksi detail
Pros:
- Audit trail lengkap
- Riwayat reschedule terlihat jelas
- Professional
Cons:
- Extra UI complexity
- Perlu collapse/expand jika banyak survei
```

### **REKOMENDASI**: Hybrid Approach ⭐
```
┌──────────────────────────────────────────────────────┐
│ TRANSAKSI DETAIL - Kredit Pesanan                    │
├──────────────────────────────────────────────────────┤
│ Status: 📅 Jadwal Survey                            │
│                                                      │
│ ┌────────────────────────────────────────────────┐ │
│ │ JADWAL SURVEY TERBARU (Active)                 │ │
│ ├────────────────────────────────────────────────┤ │
│ │ 📅 15 Maret 2026, 10:00-11:00                 │ │
│ │ 📍 Jl. Ahmad Yani No.123, Jakarta Pusat      │ │
│ │ 👤 Surveyor: Budi Santoso                    │ │
│ │ 📞 0812-XXXX-XXXX (Chat via WA)              │ │
│ │                                                │ │
│ │ Status: ✅ Sudah dikonfirmasi                │ │
│ │ [Edit] [Chat] [Reschedule]                   │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ 📋 [Riwayat Survey] (Expand untuk lihat survei lama) │
│    • Survey #1: 10 Mar, 14:00 → ❌ Dibatalkan    │
│    • Survey #2: 12 Mar, 15:00 → ❌ Ditolak       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ IMPLEMENTASI RECOMMENDATION

### PHASE 1: Core Features (Sekarang)
- ✅ Admin bisa schedule survey
- ✅ Customer lihat jadwal (embedded di detail transaksi)
- ✅ Customer confirm/reschedule via UI
- ✅ WhatsApp notifikasi ke customer & surveyor

### PHASE 2: Enhanced (Next)
- ⬜ Survey riwayat tab (untuk lihat reschedule history)
- ⬜ Surveyor dapat upload foto/hasil survei langsung dari mobile
- ⬜ Rating surveyor setelah survey selesai
- ⬜ Generate laporan survey PDF

### PHASE 3: Advanced (Future)
- ⬜ Integrasi Google Maps untuk lokasi survei
- ⬜ SMS reminder 1 hari sebelum survey
- ⬜ Attendance tracking (GPS check-in surveyor)
- ⬜ Customer sign digital saat surveyor kunjung

---

## 📱 CONTOH USER JOURNEY

### Customer Perspective
```
1. Customer submit kredit order
   ↓
2. Admin verifikasi dokumen (3-5 hari)
   ↓
3. Customer terima notifikasi WA:
   "Dokumen Anda diterima. Kami jadwalkan survey pada:
    📅 15 Maret 2026, 10:00-11:00
    📍 Jl. Ahmad Yani No.123
    👤 Surveyor: Budi Santoso (0812-XXXX-XXXX)
    
    Tolong konfirmasi kehadiran di aplikasi ↓"
   
   Customer buka app → lihat jadwal survey → [Confirm] ✅
   ↓
4. Customer terima reminder esok hari
   "Ingat: Survey besok jam 10:00 di lokasi Anda"
   ↓
5. Surveyor datang, survey selesai, upload hasil
   ↓
6. Customer notif:
   "Survey selesai! Tunggu approval kredit... (1-2 hari)"
   ↓
7. Customer terima notif final:
   "Kredit Anda DISETUJUI! 🎉 Cicilan sudah tersedia di menu Cicilan."
   atau
   "Kredit ditolak karena [alasan]. Bisa ajukan ulang atau hubungi kami."
```

### Admin Perspective
```
Dashboard → Lihat "Survey Pending" widget
            ↓
            Click "Schedule Survey" untuk kredit yang sudah verify dokumen
            ↓
            Input form:
            - Pilih tanggal/waktu
            - Lokasi (auto-fill dari customer address, bisa edit)
            - Surveyor (dropdown dari leasing providers yang registered)
            ↓
            [Save] → System auto-kirim WA ke customer dengan detail
            ↓
            Customer confirm → Status berubah jadi "confirmed"
            ↓
            Pada hari survey, admin bisa reschedule jika ada kendala
            ↓
            Surveyor submit hasil → Status = "completed"
            ↓
            Admin approve kredit → Cicilan auto-generate
```

---

## 🔌 INTEGRASI DENGAN SISTEM EXISTING

### Workflow Chart
```
Transaction
├── Credit Order → Status: menunggu_persetujuan
├── Document Verification (Admin)
│   ├── Valid → Status: dikirim_ke_surveyor
│   │            Create CreditDetail
│   │            ↓
│   │   Admin Schedule Survey (NEW)
│   │            ↓
│   │   Create SurveySchedule
│   │   Send WA notification to customer
│   │   Status: jadwal_survey
│   │            ↓
│   │   Customer confirm survey (FE)
│   │   SurveySchedule.status = "confirmed"
│   │   Send WA to surveyor
│   │            ↓
│   │   Surveyor complete survey
│   │   Upload hasil survey
│   │   SurveySchedule.status = "completed"
│   │   CreditDetail.credit_status = "survey_selesai"
│   │            ↓
│   └── Admin approve credit
│       CreditDetail.credit_status = "disetujui"
│       Generate installments
│       Send WA: "Kredit disetujui!"
│
│   ├── Invalid → Status: data_tidak_valid
│       Customer fix documents → Resubmit
│       (Back to document verification)
│
│   └── After approval, user can pay installments
        Installment.pay → Payment via Midtrans
        Track in /installments page
```

---

## ✅ FINAL RECOMMENDATION

| Aspek | Keputusan |
|-------|-----------|
| **Database** | ✅ Tabel terpisah `survey_schedules` (sudah ada, maintain) |
| **FE Display** | ✅ Kolom di detail transaksi + expand untuk riwayat |
| **Admin Panel** | ⬜ Perlu UI untuk schedule/reschedule survey |
| **Notifikasi** | ✅ WhatsApp (sudah integrated) |
| **Rich Text** | 🔜 TipTap untuk `notes` field di survey & motor description |
| **Priority** | 🟡 MEDIUM - Core untuk kredit, tapi bukan blocking feature |

---

## 📝 NEXT STEPS

1. **Buat Admin Panel Survey Management** (1-2 hari)
   - Schedule survey form
   - Reschedule interface
   - Confirm/Cancel buttons

2. **Integrate dengan FE Detail Transaksi** (1 hari)
   - Show current survey schedule
   - Confirm/Reschedule buttons
   - Riwayat survey tab

3. **Add Rich Text Editor** ke motor description & survey notes (1-2 hari)

4. **Testing** - Lengkap sampai WhatsApp notif & approve kredit (1 hari)

---

**Jangan pakai Dark Mode untuk sekarang ✅**  
**TipTap bisa universal untuk: Motor Description, Survey Notes, Berita Content ⭐**