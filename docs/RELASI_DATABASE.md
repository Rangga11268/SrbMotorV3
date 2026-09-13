# 📊 Penjelasan Relasi Database - SRB Motor

Dokumen ini menjelaskan hubungan (relasi) antar-tabel dalam database sistem **SRB Motor** berdasarkan notasi diagram **Chen ERD** terbaru. Penjelasan ini dirancang khusus agar tim analis dan pengembang dapat memahami alur data dengan mudah tanpa kebingungan.

---

## 🗺️ Tabel Ringkasan Relasi

Berikut adalah sebutan relasi, tipe kardinalitas, dan kegunaan hubungan antar-tabel dalam sistem:

| Tabel Asal | Sebutan Relasi (Verb) | Tabel Tujuan | Kardinalitas | Penjelasan Operasional |
| :--- | :---: | :--- | :---: | :--- |
| **User** | `adalah` | **Admin** | 1:1 | Spesialisasi peran. Seorang User bisa bertindak sebagai Admin. |
| **User** | `adalah` | **Montir** | 1:1 | Spesialisasi peran. Seorang User bisa bertindak sebagai Montir. |
| **User** | `adalah` | **Customer** | 1:1 | Spesialisasi peran. Seorang User bisa bertindak sebagai Customer. |
| **Customer** | `memesan` | **Jadwal servis** | 1:N | Pelanggan dapat memesan banyak jadwal servis dari waktu ke waktu. |
| **Customer** | `melakukan` | **Penjualan** | 1:N | Pelanggan dapat melakukan banyak transaksi pembelian motor. |
| **Montir** | `mengatur` | **Jadwal servis** | 1:N | Seorang montir ditugaskan menangani banyak jadwal servis masuk. |
| **Admin** | `mengatur` | **Jadwal servis** | 1:N | Admin bengkel memantau dan memperbarui status jadwal servis. |
| **servis** | `mengatur` | **Jadwal servis** | 1:N | Detail jenis layanan servis dikaitkan ke dalam pemesanan jadwal servis. |
| **servis** | `mengatur` | **pembayaran_servis** | 1:1 | Satu layanan servis memiliki tepat satu rincian transaksi pembayaran. |
| **Motor** | `memiliki` | **Kategori motor** | N:1 | Banyak unit motor dikelompokkan ke dalam satu Kategori Motor tertentu. |
| **Penjualan** | `memilih` | **Motor** | N:1 | Transaksi penjualan motor memilih satu unit motor tertentu dari katalog. |
| **Penjualan** | `memiliki` | **Pembayaran penjualan** | 1:N | Transaksi penjualan memiliki banyak rincian cicilan/angsuran berkala. |
| **Penjualan** | `memiliki` | **Kredit detail** | 1:1 | Transaksi penjualan bertipe KREDIT memiliki satu rincian skema kredit. |
| **Penjualan** | `memiliki` | **Dokumen transaksi** | 1:N | Transaksi penjualan melampirkan beberapa dokumen persyaratan (KTP, KK). |
| **Penjualan** | `memiliki` | **transaction logs** | 1:N | Transaksi penjualan mencatat seluruh perubahan status log transaksi. |
| **Kredit detail** | `memiliki` | **Dokumen transaksi** | 1:N | Detail pengajuan kredit menyimpan berkas/dokumen KYC pelanggan. |
| **Kredit detail** | `memiliki` | **Jadwal survey** | 1:N | Pengajuan kredit dapat memicu beberapa jadwal survei lokasi (jika rescheduled). |

---

## 🔍 Detail Penjelasan Relasi & Logika Bisnis

### 1. Pewarisan Akun (User Subtyping / Spesialisasi)
Relasi **`adalah` (1:1)** menghubungkan tabel dasar `User` dengan tabel detail entitasnya:
* **User ↔ Customer/Admin/Montir**: Sistem memisahkan kredensial login utama (email, password, dll.) di tabel `User`, kemudian menghubungkannya dengan data profil spesifik di tabel masing-masing. Relasi ini bersifat eksklusif satu-ke-satu.

### 2. Alur Pemesanan & Layanan Servis Bengkel
* **Customer ↔ Jadwal servis (`memesan` - 1:N)**: Menunjukkan riwayat pemesanan servis oleh pelanggan. Pelanggan memesan hari, jam, dan cabang bengkel.
* **Montir ↔ Jadwal servis (`mengatur` - 1:N)**: Menunjukkan alokasi teknisi. Satu montir dapat dijadwalkan menangani banyak antrean servis.
* **Admin ↔ Jadwal servis (`mengatur` - 1:N)**: Admin bertugas memverifikasi antrean dan mengubah status servis dari masuk hingga selesai.
* **servis ↔ Jadwal servis (`mengatur` - 1:N)**: Menghubungkan paket servis (misal: ganti oli, servis rutin) ke entitas jadwal antrean servis.
* **servis ↔ pembayaran_servis (`mengatur` - 1:1)**: Setiap penanganan servis yang selesai akan memicu pembuatan invoice tagihan di pembayaran servis.

### 3. Alur Transaksi Penjualan Motor (Cash & Kredit)
* **Customer ↔ Penjualan (`melakukan` - 1:N)**: Setiap kali pelanggan membeli motor, transaksi tersebut akan dicatat sebagai entitas `Penjualan` baru.
* **Penjualan ↔ Motor (`memilih` - N:1)**: Satu transaksi penjualan ditujukan untuk membeli tepat satu model motor.
* **Motor ↔ Kategori motor (`memiliki` - N:1)**: Setiap motor terikat pada klasifikasi kategori (misal: *Matic Sport*, *Scooter*, *Manual Premium*).
* **Penjualan ↔ Pembayaran penjualan (`memiliki` - 1:N)**: Satu transaksi penjualan dikaitkan dengan jadwal pembayaran (angsuran). Pada transaksi cash bertahap atau kredit, tabel ini menyimpan cicilan ke-0 hingga cicilan terakhir beserta dendanya.
* **Penjualan ↔ transaction logs (`memiliki` - 1:N)**: Setiap perubahan status transaksi (seperti `new_order` → ` waiting_payment` → `completed`) direkam secara otomatis sebagai log audit trail.

### 4. Workflow Persetujuan Kredit & Survei Lapangan
* **Penjualan ↔ Kredit detail (`memiliki` - 1:1)**: Hanya dibuat jika tipe transaksi adalah `CREDIT`. Berisi info jangka waktu (tenor), bunga, leasing provider, dan angsuran bulanan.
* **Kredit detail & Penjualan ↔ Dokumen transaksi (`memiliki` - 1:N)**: Berkas persyaratan kredit (KK, Slip Gaji, Foto Usaha) dilampirkan oleh Customer dan diverifikasi oleh tim survey.
* **Kredit detail ↔ Jadwal survey (`memiliki` - 1:N)**: Menyimpan tanggal, waktu, surveyor, dan hasil temuan verifikasi lapangan untuk pengajuan kredit tersebut.

### 5. Notifications (Notifikasi Mandiri)
* **Notifications** berdiri sendiri secara struktural karena didesain menggunakan skema **Polimorfik Laravel**. Kolom `notifiable_id` dan `notifiable_type` secara dinamis menghubungkan notifikasi ke berbagai tipe user (bisa ditujukan ke Customer, Admin, maupun Montir) tanpa kunci asing statis.
