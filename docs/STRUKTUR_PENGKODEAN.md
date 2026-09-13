# Dokumentasi Struktur Pengkodean Sistem SRB Motor

Dokumen ini menjelaskan standar pengkodean (coding structure) yang digunakan dalam sistem SRB Motor untuk identitas transaksi, pengajuan, cabang, dan pelanggan.

---

## 1. Kode Transaksi (Transaction Reference)
Digunakan sebagai identitas utama setiap pesanan motor (Cash/Credit) yang masuk ke sistem.

**Struktur:**
`[PREFIX]` - `[UNIQUE_ID]`

| Segmen | Panjang | Deskripsi | Contoh |
| :--- | :--- | :--- | :--- |
| **PREFIX** | 3 Karakter | Inisial Transaksi | `TRX` |
| **SEPARATOR** | 1 Karakter | Pemisah | `-` |
| **UNIQUE_ID** | 13 Karakter | ID Unik (Alfanumerik) | `64438E8E9F6E2` |

**Contoh Hasil:** `TRX-64438E8E9F6E2`

---

## 2. Kode Pengajuan Kredit (Credit Reference)
Digunakan khusus untuk membedakan berkas pengajuan kredit yang akan dikirim ke pihak leasing/surveyor.

**Struktur:**
`[PREFIX]` - `[UNIQUE_ID]`

| Segmen | Panjang | Deskripsi | Contoh |
| :--- | :--- | :--- | :--- |
| **PREFIX** | 3 Karakter | Inisial Reference | `REF` |
| **SEPARATOR** | 1 Karakter | Pemisah | `-` |
| **UNIQUE_ID** | 13 Karakter | ID Unik (Alfanumerik) | `64438E8E9F7A1` |

**Contoh Hasil:** `REF-64438E8E9F7A1`

---

## 3. Nomor Antrean Servis (Service Queue Number)
Digunakan untuk mengidentifikasi urutan booking servis pelanggan di bengkel harian per cabang.

**Struktur:**
`[PREFIX]` - `[NOMOR_URUT]`

| Segmen | Panjang | Deskripsi | Contoh |
| :--- | :--- | :--- | :--- |
| **PREFIX** | 1 Karakter | Inisial Antrean | `A` |
| **SEPARATOR** | 1 Karakter | Pemisah | `-` |
| **NOMOR_URUT** | 2 Karakter | Nomor Urut Harian (Reset tiap hari) | `01` |

**Contoh Hasil:** `A-01`

---

## 4. Nomor Angsuran (Installment Sequence)
Digunakan untuk mengurutkan jadwal pembayaran pelanggan.

**Struktur:**
`[DIGIT_URUTAN]`

| Angka | Deskripsi | Fungsi |
| :--- | :--- | :--- |
| **0** | Down Payment (DP) | Pembayaran awal / Uang muka |
| **1 - n** | Angsuran Bulanan | Cicilan bulan ke-1 sampai tenor berakhir |

---

## 5. Struktur Kode Pelanggan (Rencana/Analisis)
Berdasarkan standar operasional yang direncanakan (seperti pada Gambar II.9):

**Struktur:**
`[PREFIX]` `[BULAN]` `[TAHUN]` `[NOMOR_URUT]`

| Segmen | Tipe | Panjang | Deskripsi | Contoh |
| :--- | :--- | :--- | :--- | :--- |
| **PREFIX** | Teks | 3 | Kode Pelanggan | `PLG` |
| **BULAN** | Angka | 2 | Bulan Transaksi (MM) | `01` |
| **TAHUN** | Angka | 2 | Tahun Transaksi (YY) | `23` |
| **NO URUT** | Angka | 3 | Sequence Number | `001` |

**Contoh Hasil:** `PLG0123001`

---

## 6. Struktur Kode Barang (Analisis Unit)
Berdasarkan standar pengkodean inventaris (seperti pada Gambar Baru):

**Struktur:**
`[KODE]` `[JENIS]` `[NOMOR]`

| Segmen | Tipe | Panjang | Deskripsi | Contoh |
| :--- | :--- | :--- | :--- | :--- |
| **KODE BARANG** | Teks | 2 | Inisial Kategori Barang | `kr` |
| **JENIS BARANG** | Angka | 1 | Kategori Jenis (misal: 1=Metic, 2=Sport) | `1` |
| **NOMOR BARANG** | Angka | 2 | Nomor Urut/Seri Barang | `01` |

**Contoh Hasil:** `kr101`

---

> [!NOTE]
> Seluruh kode di atas dihasilkan secara otomatis oleh sistem (Server-Side) pada saat proses penyimpanan data berlangsung untuk menjamin integritas dan keunikan data.
