# 📋 SRB Motor — Use Case Per Flow (Tanpa Aktor Sistem)

> Dokumen ini memetakan semua alur interaksi di sistem SRB Motor dari **perspektif pengguna saja** — tanpa memperlihatkan detail teknis backend. Cocok untuk kebutuhan dokumentasi bisnis, presentasi ke stakeholder non-teknis, atau sebagai dasar pembuatan diagram Use Case UML.

---

## Daftar Aktor

| Simbol | Nama Aktor    | Deskripsi                                                                 |
| ------ | ------------- | ------------------------------------------------------------------------- |
| 👤     | **Guest**     | Pengunjung yang belum login/daftar. Akses terbatas pada informasi publik.  |
| 🛒     | **Customer**  | **Aktor Utama (Terdaftar).** Pengguna yang sudah punya akun. Fokus pada transaksi, servis, dan riwayat pesanan. Biasanya tetap dalam kondisi *Logged-in*. |
| 🔧     | **Admin**     | Pengelola Operasional. Mengurusi stok, validasi kredit, dan pendaftaran servis. |
| 👑     | **Owner**     | Pemilik Bisnis. Akses laporan keuangan dan manajemen personil Admin.       |

---

## FLOW 1: Registrasi & Login

### UC-AUTH-01: Daftar Akun Baru (Email)
**Aktor:** 👤 Guest

| Pre-condition  | Belum memiliki akun di sistem                                    |
| Post-condition | Akun terbuat, email verifikasi terkirim, menunggu konfirmasi     |

**Langkah:**
1. Guest membuka aplikasi dan mengklik tombol "Daftar."
2. Mengisi formulir: Nama Lengkap, Alamat Email, Password, Konfirmasi Password.
3. Mengklik "Buat Akun."
4. Sistem membuat akun dan melakukan **Auto-Login**.
5. **Customer** (Status: Logged-in) langsung masuk ke halaman utama/katalog.
6. Customer dapat langsung melakukan transaksi (Flow 4/5) tanpa harus verifikasi email terlebih dahulu.
7. (Paralel) Sistem mengirim email verifikasi untuk keamanan akun jangka panjang.

**Alur Alternatif:**
- Jika email sudah terdaftar → muncul pesan: "Email sudah digunakan."
- Jika password tidak cocok → muncul pesan: "Konfirmasi password tidak sesuai."

---

### UC-AUTH-02: Login Email & Password
**Aktor:** 👤 Guest, 🔧 Admin, 👑 Owner

| Pre-condition  | Memiliki akun yang telah terdaftar                               |
| Post-condition | Session aktif, diarahkan sesuai role                             |

**Langkah:**
1. Pengguna membuka modal login dari navbar.
2. Mengisi Email dan Password.
3. Mengklik "Masuk."
4. Jika login berhasil:
   - **Customer** → diarahkan ke halaman **Katalog Motor** (atau halaman transaksi yang dituju sebelumnya).
   - **Admin / Owner** → diarahkan ke **Panel Dashboard Admin**.

**Alur Alternatif:**
- Jika kredensial salah → muncul pesan: "Email atau password tidak valid."
- Jika terlalu banyak percobaan gagal → akses sementara diblokir.

---

### UC-AUTH-03: Login via Google
**Aktor:** 👤 Guest

| Pre-condition  | Memiliki akun Google                                             |
| Post-condition | Akun terhubung dengan Google, session aktif                      |

**Langkah:**
1. Guest mengklik "Masuk dengan Google."
2. Browser diarahkan ke halaman persetujuan Google.
3. Guest memilih akun Google dan memberikan izin.
4. Berhasil masuk — akun dibuat otomatis jika email belum terdaftar.

---

### UC-AUTH-04: Verifikasi Email
**Aktor:** 🛒 Customer (baru daftar)

| Pre-condition  | Sudah mendaftar, belum verifikasi email                          |
| Post-condition | Akun ditandai sebagai terverifikasi, status keamanan meningkat     |

**Langkah:**
1. Customer membuka email, menemukan email verifikasi.
2. Mengklik tautan "Verifikasi Email Saya."
3. Diarahkan ke aplikasi dengan pesan: "Email berhasil diverifikasi!"

**Sub-alur: Kirim Ulang Email Verifikasi**
1. Customer mengklik "Kirim Ulang" di halaman verifikasi.
2. Email verifikasi baru dikirim.

---

### UC-AUTH-05: Logout
**Aktor:** 🛒 Customer, 🔧 Admin, 👑 Owner

**Langkah:**
1. Pengguna mengklik "Keluar" di menu.
2. Session dihapus, diarahkan ke halaman beranda.

---

## FLOW 2: Eksplorasi Katalog Motor

### UC-CAT-01: Melihat Katalog Motor
**Aktor:** 👤 Guest, 🛒 Customer

| Pre-condition  | —                                                                |
| Post-condition | Daftar motor tersedia tampil                                     |

**Langkah:**
1. Pengguna mengakses halaman Katalog Motor.
2. Daftar motor tampil dengan foto, nama, harga, dan status ketersediaan.
3. Motor yang stok habis ditandai dengan badge "Stok Habis."

---

### UC-CAT-02: Mencari & Memfilter Motor
**Aktor:** 👤 Guest, 🛒 Customer

| Pre-condition  | —                                                                |
| Post-condition | Daftar motor tersaring sesuai kriteria                           |

**Langkah:**
1. Pengguna mengetikkan kata kunci di kotak pencarian (hasil muncul otomatis).
2. Pengguna memilih filter: Merek, Tipe (Matic/Sport/Bebek), Tahun, atau rentang harga.
3. Daftar motor diperbarui sesuai filter yang dipilih.
4. Pengguna bisa mereset filter dengan mengklik "Reset."

---

### UC-CAT-03: Melihat Detail Motor
**Aktor:** 👤 Guest, 🛒 Customer

| Pre-condition  | Motor tersedia dalam katalog                                     |
| Post-condition | Halaman detail motor tampil lengkap                              |

**Langkah:**
1. Pengguna mengklik kartu motor di katalog.
2. Halaman detail menampilkan: galeri foto (slide), harga, spesifikasi, warna tersedia.
3. Panel samping menampilkan informasi cabang dan tombol pemilihan lokasi.
4. Jika motor tersedia → tombol "Beli Tunai" dan "Ajukan Kredit" aktif.
5. Jika motor habis → tombol pembelian dinonaktifkan.

---

### UC-CAT-04: Membandingkan Dua Motor
**Aktor:** 👤 Guest, 🛒 Customer

| Pre-condition  | —                                                                |
| Post-condition | Tabel perbandingan spesifikasi tampil                            |

**Langkah:**
1. Pengguna mengakses halaman Perbandingan Motor.
2. Memilih dua motor dari dropdown.
3. Tabel perbandingan menampilkan: harga, mesin, bobot, fitur, konsumsi bahan bakar.

---

## FLOW 3: Pemilihan Cabang & Lokasi

### UC-BRANCH-01: Mencari Cabang Terdekat via GPS
**Aktor:** 👤 Guest, 🛒 Customer

| Pre-condition  | Browser mendukung GPS, pengguna mengizinkan akses lokasi         |
| Post-condition | Daftar cabang terurut dari terdekat beserta info stok unit        |

**Langkah:**
1. Di halaman detail motor, pengguna mengklik "Cari Cabang Terdekat."
2. Browser meminta izin akses lokasi GPS.
3. Pengguna memberikan izin.
4. Daftar cabang tampil, diurutkan dari yang paling dekat, lengkap dengan:
   - Jarak (km)
   - Nama & alamat cabang
   - Status stok motor (Tersedia / Tidak Tersedia)
5. Pengguna memilih cabang yang diinginkan.

**Alur Alternatif (GPS Ditolak):**
- Muncul pesan: "Akses lokasi tidak diizinkan."
- Pengguna tetap bisa memilih cabang secara manual dari dropdown.

---

### UC-BRANCH-02: Memilih Cabang Manual
**Aktor:** 👤 Guest, 🛒 Customer

**Langkah:**
1. Di halaman detail motor atau form pemesanan, pengguna memilih cabang dari dropdown.
2. Informasi cabang (alamat, telepon, jam buka) langsung tampil.

---

### UC-BRANCH-03: Menyimpan Cabang Favorit
**Aktor:** 🛒 Customer

| Pre-condition  | Login                                                            |
| Post-condition | Cabang favorit tersimpan, menjadi default saat pemesanan         |

**Langkah:**
1. Setelah memilih cabang, Customer mengklik "Simpan sebagai Cabang Favorit."
2. Konfirmasi muncul: "Cabang {nama} berhasil disimpan sebagai favorit."
3. Saat membuka form pesanan berikutnya, cabang ini otomatis terpilih.

---

## FLOW 4: Pembelian Tunai (Cash Order)

### UC-CASH-01: Mengisi & Submit Form Pembelian Tunai
**Aktor:** 🛒 Customer

| Pre-condition  | Login (Email terverifikasi direkomendasikan), motor tersedia, cabang dipilih |
| Post-condition | Pesanan tunai terdaftar, notifikasi WhatsApp terkirim             |

**Langkah:**
1. Customer mengklik "Beli Tunai" dari halaman detail motor.
2. Mengisi formulir pemesanan:
   - Data diri: Nama, NIK KTP, Telepon, Email
   - Alamat pengiriman/pengambilan
   - Pilihan warna motor
   - Metode pengambilan (Ambil Sendiri di Cabang / Dikirim)
   - Tanggal pengambilan atau pengiriman
   - Pekerjaan dan penghasilan bulanan
   - Catatan tambahan (opsional)
   - Lokasi cabang pickup
   - Jumlah Booking Fee (opsional, min 0)
3. Mengklik "Pesan Sekarang."
4. Jika berhasil → diarahkan ke halaman konfirmasi pesanan.

**Alur Alternatif:**
- Jika motor sudah habis saat submit → pesan error "Motor tidak tersedia."
- Jika sudah punya pesanan aktif untuk motor yang sama → pesan error "Anda sudah punya pesanan untuk motor ini."

---

### UC-CASH-02: Melihat Konfirmasi Pesanan
**Aktor:** 🛒 Customer

**Langkah:**
1. Customer melihat halaman konfirmasi yang berisi: nomor pesanan, nama motor, cabang pickup, total harga, instruksi pembayaran.
2. Customer dapat mencetak halaman konfirmasi ini sebagai referensi.

---

## FLOW 5: Pembelian Kredit (Credit Order)

### UC-CREDIT-01: Mengisi & Submit Form Pengajuan Kredit
**Aktor:** 🛒 Customer

| Pre-condition  | Login (Email terverifikasi direkomendasikan), motor tersedia, cabang dipilih |
| Post-condition | Pengajuan kredit terdaftar, Customer diarahkan ke upload dokumen |

**Langkah:**
1. Customer mengklik "Ajukan Kredit" dari halaman detail motor.
2. Mengisi formulir kredit:
   - Data diri (sama dengan Cash Order)
   - Pekerjaan, Lama Bekerja, Penghasilan Bulanan
   - Uang Muka (DP) — minimal sesuai aturan motor
   - Tenor cicilan (pilihan bulan)
   - Catatan tambahan
3. Mengklik "Ajukan Kredit."
4. Jika berhasil → diarahkan ke halaman upload dokumen.

**Simulasi Cicilan:**
- Sistem menampilkan estimasi cicilan bulanan secara real-time saat Customer mengubah DP atau tenor.

---

### UC-CREDIT-02: Upload Dokumen Kredit (Wajib)
**Aktor:** 🛒 Customer

| Pre-condition  | Pengajuan kredit sudah dibuat                                    |
| Post-condition | Dokumen tersimpan, pengajuan menunggu review admin               |

**Langkah:**
1. Customer mengakses halaman upload dokumen.
2. Mengunggah foto KTP (depan, foto jelas).
3. Mengunggah foto Kartu Keluarga (KK).
4. Mengklik "Upload Dokumen."
5. Muncul konfirmasi: "Dokumen berhasil diupload. Menunggu verifikasi."

---

### UC-CREDIT-03: Revisi Dokumen yang Ditolak
**Aktor:** 🛒 Customer

| Pre-condition  | Admin menolak satu atau lebih dokumen                            |
| Post-condition | Dokumen baru terupload, pengajuan kembali ke antrian review      |

**Langkah:**
1. Customer menerima notifikasi: "Dokumen Anda ditolak."
2. Mengakses halaman "Kelola Dokumen."
3. Melihat dokumen mana yang ditolak beserta alasannya.
4. Mengganti file dengan yang baru dan lebih jelas.
5. Mengklik "Update Dokumen."

---

### UC-CREDIT-04: Memantau Status Kredit
**Aktor:** 🛒 Customer

**Langkah:**
1. Customer membuka halaman "Status Kredit" dari menu transaksi.
2. Melihat timeline proses kredit:
   - Pengajuan Masuk → Verifikasi Dokumen → Dikirim ke Leasing → Jadwal Survey → Disetujui/Ditolak
3. Melihat detail jadwal survey jika sudah terjadwal.

---

### UC-CREDIT-05: Konfirmasi atau Reschedule Survey
**Aktor:** 🛒 Customer

| Pre-condition  | Admin sudah menjadwalkan survey                                  |
| Post-condition | Customer mengkonfirmasi kehadiran atau meminta jadwal baru       |

**Langkah:**
1. Customer meihat jadwal survey di halaman Status Kredit.
2. Pilihan:
   - "Konfirmasi Kehadiran" → mengkonfirmasi akan hadir sesuai jadwal.
   - "Minta Jadwal Ulang" → meminta penjadwalan ulang, Admin akan menghubungi.

---

## FLOW 6: Pembayaran (Online & Manual)

### UC-PAY-01: Bayar Cicilan / Booking Fee Online (Midtrans)
**Aktor:** 🛒 Customer

| Pre-condition  | Ada tagihan cicilan yang belum lunas                             |
| Post-condition | Pembayaran terkonfirmasi, status cicilan berubah menjadi "Lunas" |

**Langkah:**
1. Customer membuka halaman "Cicilan Saya."
2. Memilih cicilan yang ingin dibayar.
3. Mengklik "Bayar Online."
4. Jendela pembayaran Midtrans terbuka.
5. Customer memilih metode: Transfer Bank, QRIS, GoPay, ShopeePay, Alfamart, kartu kredit, dll.
6. Customer menyelesaikan pembayaran sesuai instruksi metode yang dipilih.
7. Setelah selesai → layar pembayaran menutup, status cicilan diperbarui.
8. Customer menerima notifikasi WhatsApp konfirmasi pembayaran.

**Catatan Khusus:**
- DP kredit hanya bisa dibayar setelah pengajuan kredit berstatus "Disetujui."

---

### UC-PAY-02: Bayar Banyak Cicilan Sekaligus
**Aktor:** 🛒 Customer

**Langkah:**
1. Customer membuka halaman "Cicilan Saya."
2. Memilih beberapa cicilan yang ingin dibayar sekaligus (checkbox).
3. Mengklik "Bayar Terpilih."
4. Jendela Midtrans terbuka dengan total gabungan.
5. Customer menyelesaikan satu transaksi untuk semua cicilan terpilih.

---

### UC-PAY-03: Upload Bukti Transfer (Bayar Manual)
**Aktor:** 🛒 Customer

| Pre-condition  | Ada tagihan cicilan yang belum lunas                             |
| Post-condition | Bukti tersimpan, menunggu konfirmasi Admin                       |

**Langkah:**
1. Customer memilih cicilan dan mengklik "Upload Bukti Transfer."
2. Memilih foto/scan bukti transfer (JPG/PNG, max 2MB).
3. Memilih metode pembayaran (transfer BCA, BRI, BNI, dll.).
4. Mengklik "Submit."
5. Muncul pesan: "Bukti transfer berhasil dikirim. Menunggu verifikasi admin."

---

### UC-PAY-04: Cek Status Pembayaran Manual
**Aktor:** 🛒 Customer

**Langkah:**
1. Customer mengklik "Cek Status" pada cicilan dengan pembayaran online yang tertunda.
2. Status pembayaran diperbarui dari Midtrans.

---

### UC-PAY-05: Download Kwitansi Cicilan
**Aktor:** 🛒 Customer

| Pre-condition  | Cicilan berstatus "Lunas"                                        |
| Post-condition | File PDF kwitansi terunduh                                       |

**Langkah:**
1. Customer membuka halaman cicilan.
2. Mengklik "Download Kwitansi" pada cicilan yang sudah lunas.
3. File PDF terunduh ke perangkat Customer.

---

## FLOW 7: Booking Servis Kendaraan

### UC-SERVICE-01: Membuat Jadwal Servis
**Aktor:** 🛒 Customer

| Pre-condition  | Login, memiliki kendaraan yang perlu diservis                    |
| Post-condition | Tiket antrian terbit, nomor antrian diberikan, notifikasi terkirim |

**Langkah:**
1. Customer mengakses menu "Booking Servis."
2. Memilih cabang/bengkel tujuan dari daftar cabang aktif.
3. Memilih tanggal servis (tanggal yang penuh ditandai di kalender).
4. Memilih slot waktu yang tersedia (pagi/siang/sore beserta sisa kuota).
5. Mengisi informasi kendaraan:
   - Nomor Plat
   - Model Motor / Tahun
   - Jenis Servis (Rutin / Perbaikan)
   - Keluhan atau catatan tambahan
6. Mengklik "Booking Sekarang."
7. Tiket antrian digital diterbitkan: nomor antrian, tanggal, jam, dan cabang.
8. Customer menerima tiket antrian via WhatsApp.

**Alur Alternatif (Double Booking):**
- Jika plat nomor yang sama sudah ada jadwal di cabang & tanggal yang sama → muncul pesan error dengan nomor antrian yang sudah ada.

---

### UC-SERVICE-02: Lihat Riwayat Booking Servis
**Aktor:** 🛒 Customer

**Langkah:**
1. Customer mengakses menu "Servis Saya."
2. Melihat daftar semua jadwal servis: aktif dan riwayat.
3. Mengklik salah satu untuk melihat detail tiket.

---

### UC-SERVICE-03: Batalkan Booking Servis
**Aktor:** 🛒 Customer

| Pre-condition  | Booking masih dalam status Pending atau Dikonfirmasi, waktu servis belum lewat |
| Post-condition | Booking dibatalkan, slot waktu kembali tersedia                  |

**Langkah:**
1. Customer membuka detail tiket servis.
2. Mengklik "Batalkan Booking."
3. (Opsional) Mengisi alasan pembatalan.
4. Mengkonfirmasi pembatalan.
5. Muncul pesan: "Booking berhasil dibatalkan."

**Alur Alternatif:**
- Jika waktu servis sudah lewat → tombol batal dinonaktifkan.
- Jika status sudah `in_progress` atau `completed` → tidak bisa dibatalkan.

---

## FLOW 8: Manajemen Profil

### UC-PROFILE-01: Edit Data Profil
**Aktor:** 🛒 Customer, 🔧 Admin

| Pre-condition  | Login                                                            |
| Post-condition | Data profil diperbarui                                           |

**Langkah:**
1. Pengguna mengakses menu "Profil Saya."
2. Mengklik "Edit Profil."
3. Mengubah: Nama, Nomor Telepon, Alamat, Pekerjaan, Foto Profil.
4. Mengklik "Simpan Perubahan."

---

### UC-PROFILE-02: Ubah Password
**Aktor:** 🛒 Customer, 🔧 Admin

| Pre-condition  | Login, mengetahui password lama                                  |
| Post-condition | Password berhasil diperbarui                                     |

**Langkah:**
1. Pengguna mengakses menu Edit Profil.
2. Mengisi: Password Lama, Password Baru, Konfirmasi Password Baru.
3. Mengklik "Update Password."
4. Muncul konfirmasi: "Password berhasil diperbarui."

---

### UC-PROFILE-03: Lihat Riwayat Transaksi
**Aktor:** 🛒 Customer

**Langkah:**
1. Customer mengakses menu "Transaksi Saya."
2. Melihat daftar semua pesanan (tunai & kredit) dengan status terkini.
3. Mengklik transaksi untuk melihat detail & timeline proses.

---

## FLOW 9: Notifikasi

### UC-NOTIF-01: Membaca Notifikasi
**Aktor:** 🛒 Customer, 🔧 Admin

**Langkah:**
1. Pengguna melihat badge notifikasi di navbar (jumlah belum dibaca).
2. Mengklik ikon notifikasi → daftar notifikasi tampil.
3. Mengklik notifikasi tertentu → ditandai sebagai dibaca, diarahkan ke konten relevan.

---

### UC-NOTIF-02: Mengelola Notifikasi
**Aktor:** 🛒 Customer, 🔧 Admin

**Langkah:**
- "Tandai Semua Dibaca" → semua notifikasi ditandai sebagai telah dibaca.
- "Hapus Notifikasi" → notifikasi tertentu dihapus dari daftar.

---

## FLOW 10: Admin — Approval Kredit

### UC-ADMIN-CREDIT-01: Review & Verifikasi Dokumen
**Aktor:** 🔧 Admin

| Pre-condition  | Ada pengajuan kredit baru                                        |
| Post-condition | Dokumen diterima atau ditolak                                    |

**Langkah:**
1. Admin membuka panel `/admin/credits`.
2. Memilih pengajuan kredit baru.
3. Membuka dan meninjau each dokumen (KTP, KK).
4. Untuk setiap dokumen:
   - "Setujui Dokumen" → dokumen diterima.
   - "Tolak Dokumen" + alasan → Customer diminta upload ulang.
5. Setelah semua dokumen ditangani → klik "Verifikasi Dokumen" untuk melanjutkan proses.

---

### UC-ADMIN-CREDIT-02: Kirim ke Leasing & Jadwalkan Survey
**Aktor:** 🔧 Admin

**Langkah:**
1. Pilih lembaga Leasing (BAF, Adira Finance, OTO Kredit, dll.).
2. Isi nomor referensi pengajuan ke leasing (opsional).
3. Klik "Kirim ke Leasing."
4. Jadwalkan survey: isi tanggal, jam, nama surveyor, nomor telepon.
5. Klik "Jadwalkan Survey" → notifikasi jadwal dikirim ke Customer.

---

### UC-ADMIN-CREDIT-03: Proses Hasil Survey & Keputusan Final
**Aktor:** 🔧 Admin

**Langkah:**
1. Klik "Mulai Survey" saat surveyor berangkat.
2. Setelah selesai → klik "Selesaikan Survey" + catatan hasil.
3. Keputusan Final:
   - **Setujui Kredit:** Isi jumlah yang disetujui dan suku bunga final. Notifikasi persetujuan dikirim ke Customer.
   - **Tolak Kredit:** Isi alasan penolakan. Notifikasi penolakan dikirim ke Customer.
4. Jika disetujui → Admin mencatat pembayaran DP Customer.
5. Admin mengklik "Selesaikan Kredit" setelah semua proses rampung.

**Alur Khusus — Penarikan Unit (Repossess):**
- Jika Customer gagal bayar → Admin mengklik "Tarik Unit" + alasan.
- Motor dikembalikan ke stok, cicilan outstanding dibatalkan.

---

## FLOW 11: Admin — Manajemen Motor

### UC-MOTOR-01: Tambah Motor Baru
**Aktor:** 🔧 Admin, 👑 Owner

**Langkah:**
1. Admin mengklik "Tambah Motor" di panel `/admin/motors`.
2. Mengisi semua detail: nama, merek, model, kategori, harga, minimum DP, warna tersedia, cabang, deskripsi, spesifikasi, status (Aktif/Draft).
3. Menyimpan data motor.
4. (Opsional) Mengunggah foto-foto motor ke galeri, menentukan foto utama.

---

### UC-MOTOR-02: Edit & Nonaktifkan Motor
**Aktor:** 🔧 Admin, 👑 Owner

**Langkah:**
1. Admin memilih motor dari daftar.
2. Mengubah informasi yang diperlukan.
3. Untuk menyembunyikan dari katalog → mengubah status ke "Draft."

**Aturan Bisnis:**
- Motor yang pernah ada dalam transaksi tidak bisa dihapus permanen.
- Hanya bisa diubah ke status "Draft" (disembunyikan).

---

## FLOW 12: Admin — Manajemen Servis

### UC-ADMIN-SERVICE-01: Update Status Antrian Servis
**Aktor:** 🔧 Admin

| Pre-condition  | Ada booking servis dari Customer                                 |
| Post-condition | Status antrian diperbarui, Customer mendapat notifikasi          |

**Langkah:**
1. Admin membuka `/admin/services` — daftar antrian diurutkan dari yang paling mendesak.
2. Memilih booking dan mengubah status:
   - "Konfirmasi" → slot dikonfirmasi ke Customer.
   - "Sedang Dikerjakan" → unit sedang dalam pengerjaan mekanik.
   - "Selesai" + catatan layanan → unit siap diambil, notifikasi ke Customer.
   - "Batalkan" + alasan → dibatalkan oleh pihak bengkel.

---

## FLOW 13: Admin — Verifikasi Pembayaran Manual

### UC-ADMIN-PAY-01: Konfirmasi Pembayaran Cicilan Manual
**Aktor:** 🔧 Admin

| Pre-condition  | Customer mengajukan konfirmasi bayar manual                      |
| Post-condition | Cicilan dinyatakan lunas atau dikembalikan ke Customer            |

**Langkah:**
1. Admin membuka panel cicilan — melihat yang berstatus "Menunggu Verifikasi."
2. Melihat foto bukti transfer yang diupload Customer.
3. Pilihan:
   - "Setujui" → cicilan berubah menjadi Lunas, Customer dinotifikasi.
   - "Tolak" → cicilan dikembalikan ke outstanding, Customer diminta upload ulang.

---

## FLOW 14: Admin — Update Status Transaksi Tunai

### UC-ADMIN-TRX-01: Kelola Alur Status Pesanan Tunai
**Aktor:** 🔧 Admin

**Langkah:**
1. Admin membuka detail transaksi di `/admin/transactions/{id}`.
2. Memilih status baru dari dropdown.
3. Mengklik "Update Status."

**Alur Status Transaksi Tunai:**
```
Pesanan Masuk → Menunggu Pembayaran → Pembayaran Dikonfirmasi → Motor Disiapkan → Siap Dikirim/Ambil → Dalam Pengiriman → Selesai
```
*Pembatalan bisa dilakukan di tahap mana saja sebelum "Selesai."*

---

### UC-ADMIN-TRX-02: Download Invoice Transaksi
**Aktor:** 🔧 Admin

**Langkah:**
1. Admin membuka detail transaksi.
2. Mengklik "Preview Invoice" untuk pratinjau.
3. Mengklik "Download Invoice" untuk mendapatkan file PDF.

---

## FLOW 15: Owner — Laporan & Export

### UC-OWNER-REPORT-01: Generate & Download Laporan
**Aktor:** 👑 Owner

| Pre-condition  | Login sebagai Owner                                              |
| Post-condition | Laporan tergenerate dan terunduh ke perangkat Owner              |

**Langkah:**
1. Owner mengakses menu "Laporan" di panel admin.
2. Menentukan filter: rentang tanggal, tipe transaki, cabang.
3. Mengklik "Generate Laporan" untuk pratinjau data.
4. Mengklik "Export PDF" atau "Export Excel" sesuai kebutuhan.
5. File laporan terunduh ke perangkat.

**Data dalam Laporan:**
- Daftar transaksi lengkap (Cash & Kredit)
- Informasi motor yang terjual
- Data Customer
- Kolom Cabang untuk analisis performa per lokasi
- Ringkasan total pendapatan per periode

---

## FLOW 16: Owner — Manajemen Akun Staf

### UC-OWNER-USER-01: Kelola Akun Admin/Staf
**Aktor:** 👑 Owner

| Pre-condition  | Login sebagai Owner                                              |
| Post-condition | Akun staf dikelola sesuai kebutuhan operasional                  |

**Langkah:**
1. Owner mengakses menu "Manajemen Pengguna."
2. Melihat daftar semua staf admin.
3. Operasi yang tersedia:
   - **Edit data staf:** ubah nama, email, atau role staf.
   - **Suspend/Aktifkan:** nonaktifkan akun staf yang cuti atau berhenti.
   - **Hapus akun:** hapus akun staf yang tidak lagi diperlukan.

---

## FLOW 17: Admin — Manajemen Pengaturan Sistem

### UC-SETTING-01: Kelola Pengaturan Cabang
**Aktor:** 🔧 Admin, 👑 Owner

| Pre-condition  | Login sebagai Admin/Owner                                        |
| Post-condition | Pengaturan tersimpan, langsung aktif di frontend                 |

**Langkah:**
1. Admin mengakses menu "Pengaturan Sistem."
2. Memilih kategori "Cabang" untuk mengelola data master cabang.
3. Mengedit informasi cabang:
   - Nama, Alamat, Koordinat (Latitude/Longitude)
   - Jam Operasional per hari
   - Nomor WhatsApp penanggung jawab cabang
   - Fasilitas yang tersedia (Showroom, Service, dll.)
4. Mengklik "Simpan."
5. Data cabang baru langsung aktif tanpa perlu restart server.

### UC-SETTING-02: Kelola Pengaturan Layanan Bengkel
**Aktor:** 🔧 Admin, 👑 Owner

**Langkah:**
1. Admin mengakses kategori "Layanan Servis" dalam pengaturan.
2. Mengatur:
   - Daftar cabang yang melayani servis
   - Kuota harian per bengkel
   - Kuota per slot waktu
   - Jam operasional bengkel per hari
3. Mengklik "Simpan."

---

## Ringkasan Hubungan Aktor & Wewenang

| Fitur Utama                     | Guest | Customer | Admin | Owner | Keterangan                                     |
| ------------------------------- | :---: | :------: | :---: | :---: | ---------------------------------------------- |
| **Katalog & Navigasi Publik**   | ✅    | ✅       | ✅    | ✅    | Informasi umum unit motor                      |
| **Transaksi Pembelian**         |       | ✅       |       |       | **Fokus Utama Customer**                       |
| **Booking & Riwayat Servis**    |       | ✅       |       |       | **Fokus Utama Customer**                       |
| **Cetak Kwitansi & Invoice**    |       | ✅       | ✅    | ✅    | Dokumen bukti transaksi                        |
| **Review & Kelola Transaksi**   |       |          | ✅    | ✅    | Validasi & Operasional                         |
| **Laporan & Manajemen User**    |       |          |       | ✅    | Wewenang Owner                                 |
| Logout                          |       | ✅       | ✅    | ✅    | Menutup sesi aktif                             |
