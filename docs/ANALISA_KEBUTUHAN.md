# Analisa Kebutuhan Sistem SRB Motor v2

Berdasarkan identifikasi masalah pada sistem berjalan, sistem informasi SRB Motor yang akan dibangun harus mampu menjawab seluruh permasalahan operasional yang ada. Kebutuhan sistem dibagi menjadi kebutuhan fungsional dan kebutuhan non-fungsional.

---

## A. Kebutuhan Fungsional
Kebutuhan fungsional berdasarkan masing-masing aktor adalah sebagai berikut:

### 1. Guest
*   Dapat melihat katalog motor beserta harga, spesifikasi, warna, dan stok.
*   Dapat melakukan simulasi perhitungan kredit secara mandiri.
*   Dapat melihat informasi lokasi dan kontak seluruh cabang.
*   Dapat mendaftarkan akun pelanggan baru.

### 2. Customer
*   Dapat melakukan pemesanan motor tunai secara online.
*   Dapat mengajukan pembelian motor kredit dan mengunggah dokumen persyaratan secara digital.
*   Dapat memantau status pengajuan kredit secara real-time.
*   Dapat melakukan pembayaran online (booking fee, DP, cicilan) via payment gateway.
*   Dapat melihat riwayat transaksi dan jadwal angsuran.
*   Dapat mendaftarkan booking service secara online.
*   Dapat menerima notifikasi otomatis terkait status transaksi.

### 3. Admin
*   Dapat mengelola dan memperbarui status seluruh transaksi.
*   Dapat memverifikasi dokumen persyaratan kredit pelanggan.
*   Dapat mengelola penjadwalan survei oleh surveyor.
*   Dapat mengelola stok unit motor per cabang.
*   Dapat mengelola jadwal booking service dan antrian mekanik.
*   Dapat mengirimkan notifikasi kepada pelanggan.

### 4. Owner
*   Dapat memantau dashboard rekap penjualan seluruh cabang.
*   Dapat melihat laporan performa penjualan per periode.
*   Dapat mengelola data pengguna sistem.
*   Dapat mengelola konfigurasi global sistem.

---

## B. Kebutuhan Non-Fungsional

**Tabel 2.4 Kebutuhan Non-Fungsional Sistem**

| No | Kategori | Kebutuhan |
| :--- | :--- | :--- |
| 1 | **Keamanan** | Sistem menggunakan autentikasi terenkripsi. Data sensitif pelanggan hanya dapat diakses oleh pihak berwenang. |
| 2 | **Ketersediaan** | Sistem dapat diakses 24 jam sehari, 7 hari seminggu dengan downtime minimal. |
| 3 | **Performa** | Halaman katalog dan status transaksi tampil dalam waktu < 3 detik pada koneksi normal. |
| 4 | **Kemudahan Pakai** | Antarmuka responsif dan intuitif untuk pengguna desktop maupun mobile. |
| 5 | **Skalabilitas** | Sistem dapat menangani penambahan cabang dan peningkatan jumlah pengguna tanpa penurunan performa. |
| 6 | **Kompatibilitas** | Berjalan pada browser modern (Chrome, Firefox, Safari, Edge) tanpa instalasi tambahan. |
| 7 | **Pemeliharaan** | Dibangun dengan arsitektur modular untuk memudahkan pembaruan dan perbaikan. |

---

## 2.2.2 Use Case Diagram
Use case diagram menggambarkan interaksi antara aktor dengan sistem. Berikut adalah deskripsi use case utama pada sistem informasi SRB Motor:

**Tabel 2.5 Daftar Use Case Sistem SRB Motor**

| No | Use Case | Aktor | Deskripsi |
| :--- | :--- | :--- | :--- |
| 1 | Lihat Katalog Motor | Guest, Customer | Menampilkan daftar motor dengan harga, spesifikasi, warna, dan stok. |
| 2 | Simulasi Kredit | Guest, Customer | Menghitung estimasi cicilan berdasarkan harga, DP, dan tenor. |
| 3 | Registrasi Akun | Guest | Mendaftarkan diri sebagai pelanggan sistem. |
| 4 | Login | Customer, Admin, Owner | Masuk ke sistem menggunakan email/password atau Google OAuth. |
| 5 | Pesan Motor Tunai | Customer | Mengajukan pemesanan motor tunai dan melakukan pembayaran online. |
| 6 | Ajukan Kredit Motor | Customer | Mengajukan pembelian kredit dan mengunggah dokumen persyaratan. |
| 7 | Pantau Status Kredit | Customer | Memantau perkembangan status pengajuan kredit secara real-time. |
| 8 | Bayar Angsuran | Customer | Melakukan pembayaran DP dan cicilan via payment gateway Midtrans. |
| 9 | Booking Service | Customer | Mendaftarkan jadwal service kendaraan secara online. |
| 10| Kelola Transaksi | Admin | Memverifikasi dan memperbarui status seluruh transaksi. |
| 11| Verifikasi Dokumen Kredit | Admin | Memeriksa kelengkapan dan keabsahan dokumen kredit pelanggan. |
| 12| Kelola Jadwal Survey | Admin | Menjadwalkan kunjungan surveyor ke lokasi pelanggan. |
| 13| Kelola Stok Motor | Admin | Mengelola data unit motor yang tersedia per cabang. |
| 14| Kelola Jadwal Service | Admin | Mengatur antrian dan jadwal service mekanik di bengkel. |
| 15| Lihat Dashboard & Laporan | Owner | Memantau rekap transaksi dan performa penjualan seluruh cabang. |
| 16| Kelola Pengguna | Owner | Mengelola akun admin dan pelanggan yang terdaftar. |

---

## Deskripsi Detail Use Case (Skenario Utama)

### 1. Tabel Use Case: Pesan Motor Tunai
| Komponen | Deskripsi |
| :--- | :--- |
| **Use Case Name** | Pesan Motor Tunai |
| **Aktor** | Customer |
| **Pre-Condition** | Customer sudah login ke sistem dan memilih unit motor yang diinginkan. |
| **Main Flow** | 1. Customer memilih unit motor dan warna pada halaman katalog.<br>2. Customer menekan tombol 'Beli Tunai'.<br>3. Sistem menampilkan form pemesanan (nama, NIK, alamat, metode pengiriman).<br>4. Customer mengisi form dan mengunggah KTP serta KK.<br>5. Customer melakukan pembayaran booking fee melalui payment gateway.<br>6. Sistem menyimpan transaksi dan mengirimkan notifikasi konfirmasi.<br>7. Admin memverifikasi dan memproses pengiriman unit. |
| **Alternative Flow**| • Jika stok motor habis, sistem menampilkan pesan 'Stok tidak tersedia'.<br>• Jika pembayaran gagal, sistem menampilkan pesan error dan transaksi dibatalkan. |
| **Post-Condition** | Transaksi tersimpan dengan status 'Menunggu Konfirmasi' dan pelanggan menerima notifikasi. |

### 2. Tabel Use Case: Ajukan Kredit Motor
| Komponen | Deskripsi |
| :--- | :--- |
| **Use Case Name** | Ajukan Kredit Motor |
| **Aktor** | Customer |
| **Pre-Condition** | Customer sudah login dan memilih unit motor serta skema kredit yang diinginkan. |
| **Main Flow** | 1. Customer memilih unit motor, DP, dan tenor pada halaman katalog.<br>2. Customer menekan tombol 'Ajukan Kredit'.<br>3. Sistem menampilkan form pengajuan kredit.<br>4. Customer mengisi data pribadi dan data pekerjaan.<br>5. Customer mengunggah dokumen persyaratan (KTP, KK, slip gaji, bukti rumah).<br>6. Customer mengirimkan pengajuan.<br>7. Sistem menyimpan pengajuan dan mengirimkan notifikasi ke admin.<br>8. Admin memverifikasi dokumen dan meneruskan ke leasing.<br>9. Leasing memberikan keputusan approve/reject.<br>10. Sistem memperbarui status dan mengirimkan notifikasi kepada customer. |
| **Alternative Flow**| • Jika dokumen tidak lengkap, admin menolak dan sistem meminta customer melengkapi dokumen.<br>• Jika leasing menolak (reject), sistem menampilkan status 'Kredit Ditolak' beserta alasan penolakan. |
| **Post-Condition** | Pengajuan kredit tersimpan dan status dapat dipantau real-time oleh customer. |

### 3. Tabel Use Case: Booking Service
| Komponen | Deskripsi |
| :--- | :--- |
| **Use Case Name** | Booking Service |
| **Aktor** | Customer |
| **Pre-Condition** | Customer sudah login ke sistem. |
| **Main Flow** | 1. Customer membuka menu 'Booking Service'.<br>2. Sistem menampilkan form booking (pilih cabang, tanggal, jam, jenis servis).<br>3. Customer mengisi form beserta keluhan kendaraan.<br>4. Customer mengirimkan booking.<br>5. Sistem menyimpan booking dan mengirimkan notifikasi ke admin.<br>6. Admin mengkonfirmasi jadwal dan nomor antrean.<br>7. Customer menerima tiket antrean service digital. |
| **Alternative Flow**| • Jika slot jadwal penuh, sistem menampilkan informasi dan menyarankan waktu alternatif.<br>• Jika customer tidak hadir, admin dapat mengubah status booking menjadi 'Tidak Hadir'. |
| **Post-Condition** | Booking service tersimpan dan customer menerima tiket antrean digital. |

### 4. Tabel Use Case: Kelola Transaksi
| Komponen | Deskripsi |
| :--- | :--- |
| **Use Case Name** | Kelola Transaksi |
| **Aktor** | Admin |
| **Pre-Condition** | Admin sudah login ke sistem. |
| **Main Flow** | 1. Admin membuka menu 'Manajemen Transaksi'.<br>2. Sistem menampilkan daftar seluruh transaksi yang masuk.<br>3. Admin memilih transaksi yang akan diproses.<br>4. Admin memverifikasi data dan dokumen pelanggan.<br>5. Admin memperbarui status transaksi (konfirmasi/proses/selesai/batal).<br>6. Sistem mencatat perubahan status di log transaksi.<br>7. Sistem mengirimkan notifikasi otomatis kepada customer. |
| **Alternative Flow**| • Jika transaksi dibatalkan, admin mengisi alasan pembatalan dan sistem memperbarui status. |
| **Post-Condition** | Status transaksi diperbarui dan customer menerima notifikasi perubahan status. |
