# Safe Performance Upgrade Guide (SRB Motor)

Dokumen ini memberikan panduan strategis untuk mengoptimalkan performa aplikasi SRB Motor tanpa merusak fitur atau alur transaksi yang sudah ada.

## Prinsip Utama
> [!IMPORTANT]
> **Stabilitas > Performa.** Selalu prioritaskan fungsionalitas aplikasi di atas optimasi mikro. Jangan lakukan perubahan besar dalam satu waktu.

## 1. Optimasi Database (Safe Indexing)
Menambahkan index pada kolom yang sering dicari dapat meningkatkan kecepatan query secara signifikan.

### Strategi:
- Identifikasi query lambat menggunakan `Laravel Telescope` atau `Query Log`.
- Tambahkan index hanya pada kolom pencarian utama (misal: `brand`, `type`, `status`).
- **Peringatan**: Jangan menambahkan terlalu banyak index pada tabel yang sering di-*update* (seperti `transactions` atau `installments`) karena dapat memperlambat proses *write*.

### Contoh Migrasi yang Aman:
```php
Schema::table('motors', function (Blueprint $table) {
    if (!Schema::hasColumn('motors', 'brand_index')) { // Selalu cek sebelum modif
        $table->index('brand');
        $table->index('type');
    }
});
```

## 2. Implementasi API Resource yang Aman
Menggunakan API Resource sangat baik untuk standarisasi data, namun perlu penanganan khusus di frontend (Inertia).

### Aturan Emas Unwrapping:
Saat beralih ke API Resource, data akan terbungkus dalam properti `data`. Agar tidak merusak frontend:
1. **Gunakan Fallback Pattern** di React:
   ```javascript
   const items = initialItems.data || initialItems; // Mendukung format lama & baru
   ```
2. **Normalisasi State**:
   Selalu pastikan state diinisialisasi dengan struktur yang stabil:
   ```javascript
   const [motors, setMotors] = useState(
       initialMotors?.data ? initialMotors : { data: initialMotors || [] }
   );
   ```

## 3. Optimasi Gambar
Gunakan logika pemuatan gambar yang toleran terhadap berbagai format path (lokal vs absolut).

### Pola yang Direkomendasikan:
```javascript
const getImageUrl = (path) => {
    if (!path) return "/assets/img/no-image.webp";
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/storage/${path}`;
};
```

## 4. Pentingnya Pengujian (Testing)
> [!CAUTION]
> Jangan pernah melakukan deploy perubahan performa tanpa menjalankan unit test.

- Jalankan pengujian alur transaksi setelah optimasi:
  `php artisan test --filter OrderFlowTest`
- Lakukan verifikasi manual pada halaman Katalog dan Cicilan menggunakan **Hard Refresh (CTRL+F5)** untuk menghindari cache browser yang rusak.

## 5. Rencana Bertahap (Incremental Updates)
1. **Fase 1**: Tambahkan index database (Server-side saja, tidak merusak UI).
2. **Fase 2**: Implementasi Caching (Redis/File) untuk query berat.
3. **Fase 3**: Konversi ke API Resource (Satu halaman per satu waktu, mulai dari yang paling jarang digunakan).

---
*Dokumentasi ini dibuat untuk memastikan pengembangan tetap aman dan fungsional.*
