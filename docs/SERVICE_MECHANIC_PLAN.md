# Perancangan Fitur Servis (Sistem Reservasi Sederhana)

Dokumen ini adalah **rancangan** untuk fitur servis dengan konsep **Booking-Only** (Hanya Reservasi):
1. Fokus pada ketersediaan slot (kuota) per cabang.
2. Data motor disederhanakan (hanya Model Motor). Detail teknis dilakukan di tempat.
3. Mendukung pembatalan dan reschedule.
4. Admin dapat memberikan catatan layanan/benefit khusus per booking.

## 1) Tujuan Bisnis
- Memberikan kemudahan booking secepat mungkin bagi pelanggan.
- Mengelola antrean mekanik agar tidak terjadi overbooking.
- Memberi fleksibilitas manajemen jadwal bagi admin.

## 2) Struktur Data (Tabel: service_appointments)
- `user_id`: Link ke akun (opsional).
- `customer_name` / `customer_phone`: Kontak pelanggan.
- `branch`: Lokasi servis.
- `motor_model`: Nama/Model motor (Misal: PCX 160).
- `service_date` / `service_time`: Waktu yang dipesan.
- `complaint_notes`: Pesan/keluhan pelanggan.
- `service_notes`: Catatan khusus dari admin (Misal: "Ganti oli gratis").
- `status`: [pending, confirmed, in_progress, completed, cancelled].

## 3) Alur Kerja Utama

### Cek Slot & Booking
- Sistem menampilkan jam yang tersedia per tanggal dan cabang.
- Jika sudah mencapai kuota (misal 5 unit/slot), slot ditandai **PENUH**.

### Manajemen Pembatalan & Reschedule
- Pelanggan/Admin dapat membatalkan booking (status `cancelled`).
- Jika jadwal berubah (reschedule), sistem melakukan pengecekan kuota ulang pada jadwal baru.

## 4) Acceptance Criteria (Checklist UAT)
- [x] Pembersihan kolom detail motor yang tidak diperlukan (DB Cleaned).
- [ ] UI Form Booking hanya meminta Model Motor & Keluhan.
- [ ] Logika pengecekan kuota slot berfungsi.
- [ ] Admin dapat mengisi `service_notes` untuk benefit pelanggan.
- [ ] Dashboard admin menampilkan antrean booking per cabang secara rapi.
an logika produksi.
