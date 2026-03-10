<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories first
        $categories = [
            ['name' => 'Tips & Trik', 'slug' => 'tips-trik', 'is_active' => true],
            ['name' => 'Promo', 'slug' => 'promo', 'is_active' => true],
            ['name' => 'Berita', 'slug' => 'berita', 'is_active' => true],
            ['name' => 'Review Motor', 'slug' => 'review-motor', 'is_active' => true],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        // Get categories
        $tipsCategory = Category::where('slug', 'tips-trik')->first();
        $promoCategory = Category::where('slug', 'promo')->first();
        $beritaCategory = Category::where('slug', 'berita')->first();
        $reviewCategory = Category::where('slug', 'review-motor')->first();

        // Create sample posts
        $posts = [
            [
                'category_id' => $tipsCategory->id,
                'title' => '5 Tips Merawat Motor Agar Tetap Awet dan Nyaman Dikendarai',
                'slug' => '5-tips-merawat-motor-agar-tetap-awet',
                'excerpt' => 'Perawatan motor yang tepat adalah kunci untuk memastikan kendaraan Anda tetap dalam kondisi prima dan aman digunakan dalam jangka panjang.',
                'content' => '<h2>Pentingnya Perawatan Motor Rutin</h2><p>Motor adalah investasi berharga yang memerlukan perawatan khusus. Dengan merawat motor secara rutin, Anda dapat memperpanjang umur kendaraan dan menghindari biaya perbaikan yang mahal.</p><h3>1. Ganti Oli Secara Teratur</h3><p>Oli mesin berfungsi sebagai pelumas untuk semua komponen mesin. Ganti oli setiap 5000-10000 km atau sesuai rekomendasi pabrikan untuk menjaga performa mesin.</p><h3>2. Periksa Tekanan Ban Secara Berkala</h3><p>Ban yang kurang tekan dapat meningkatkan konsumsi bahan bakar dan mempercepat keausan ban. Periksa tekanan ban setiap minggu dan sesuaikan dengan standar yang direkomendasikan.</p><h3>3. Bersihkan Filter Udara</h3><p>Filter udara yang kotor dapat mengurangi efisiensi mesin. Bersihkan filter udara secara berkala untuk memastikan performa optimal.</p><h3>4. Perawatan Rantai Motor</h3><p>Rantai motor harus selalu bersih dan terlumasi. Bersihkan rantai dengan kuas dan lumasi dengan cairan khusus setiap 1000 km.</p><h3>5. Periksa Rem Secara Berkala</h3><p>Rem adalah komponen keselamatan yang sangat penting. Periksa rem setiap bulan dan ganti kampas rem jika sudah tipis.</p>',
                'featured_image' => null,
                'status' => 'published',
                'views' => 245,
                'published_at' => now()->subDays(10),
            ],
            [
                'category_id' => $promoCategory->id,
                'title' => 'Promo Spesial Bulan Ini: Diskon Hingga 30% untuk Pembelian Motor',
                'slug' => 'promo-spesial-diskon-hingga-30-persen',
                'excerpt' => 'SRB Motor menawarkan promo spektakuler dengan diskon hingga 30% untuk pembelian motor pilihan. Jangan lewatkan kesempatan emas ini!',
                'content' => '<h2>Promo Besar-besaran Hadir untuk Anda!</h2><p>SRB Motor dengan bangga mempersembahkan promo spesial bulan ini dengan penawaran yang tidak bisa Anda lewatkan. Kami memberikan diskon hingga 30% untuk berbagai pilihan motor unggulan kami.</p><h3>Penawaran Spesial:</h3><ul><li>Diskon 30% untuk pembelian tunai</li><li>Cicilan 0% untuk tenor tertentu</li><li>Bonus asuransi komprehensif 1 tahun</li><li>Gratis perawatan berkala 2 tahun</li><li>Free ongkir pengiriman ke seluruh Indonesia</li></ul><h3>Persyaratan Promo:</h3><p>Promo berlaku untuk pembelian di tanggal 1-31 Maret 2026. Persediaan motor terbatas, jadi segera amankan unit favorit Anda sekarang juga!</p><h3>Cara Mengikuti Promo:</h3><ol><li>Kunjungi showroom terdekat</li><li>Pilih motor favorit Anda</li><li>Hubungi sales kami untuk penawaran terbaik</li><li>Selesaikan proses pembelian</li></ol><p><strong>Hubungi kami sekarang melalui WhatsApp atau kunjungi showroom terdekat untuk informasi lebih lengkap!</strong></p>',
                'featured_image' => null,
                'status' => 'published',
                'views' => 512,
                'published_at' => now()->subDays(5),
            ],
            [
                'category_id' => $reviewCategory->id,
                'title' => 'Review Lengkap: Honda Supra X 125 FI, Motor Andal untuk Perjalanan Jauh',
                'slug' => 'review-honda-supra-x-125-fi',
                'excerpt' => 'Honda Supra X 125 FI adalah pilihan tepat untuk Anda yang mencari motor irit dan handal. Berikut review lengkapnya dari tim kami.',
                'content' => '<h2>Honda Supra X 125 FI - Pilihan Cerdas Untuk Setiap Perjalanan</h2><p>Honda Supra X 125 FI telah menjadi salah satu pilihan populer di kalangan pengendara motor di Indonesia. Dengan teknologi fuel injection dan desain yang sporty, motor ini menawarkan kombinasi sempurna antara performa dan efisiensi bahan bakar.</p><h3>Keunggulan Honda Supra X 125 FI</h3><ul><li><strong>Efisiensi Bahan Bakar:</strong> Konsumsi bahan bakar mencapai 50 km/liter dalam kondisi normal</li><li><strong>Performa Mesin:</strong> Mesin 4-tak SOHC dengan teknologi fuel injection memberikan tarikan yang responsif</li><li><strong>Desain Sporty:</strong> Desain yang modern dan futuristik membuat motor terlihat premium</li><li><strong>Kenyamanan:</strong> Seat yang ergonomis dan suspensi yang empuk memberikan kenyamanan maksimal</li><li><strong>Keamanan:</strong> Fitur safety terlengkap dengan ABS dan lampu LED</li></ul><h3>Spesifikasi Teknis</h3><ul><li>Mesin: 125cc, 4-Tak SOHC</li><li>Daya Maksimal: 9.9 PS @ 8000 rpm</li><li>Torsi: 10.6 Nm @ 6000 rpm</li><li>Transmisi: Manual</li><li>Kapasitas Tangki: 11 Liter</li></ul><h3>Kekurangan</h3><ul><li>Ruang bagasi terbatas untuk perjalanan jauh</li><li>Harga aksesori original cukup mahal</li></ul><h3>Kesimpulan</h3><p>Honda Supra X 125 FI adalah pilihan yang tepat untuk Anda yang menginginkan motor dengan efisiensi bahan bakar tinggi, performa mesin yang responsif, dan desain yang menarik. Motor ini cocok untuk penggunaan harian maupun perjalanan jauh.</p>',
                'featured_image' => null,
                'status' => 'published',
                'views' => 378,
                'published_at' => now()->subDays(3),
            ],
            [
                'category_id' => $beritaCategory->id,
                'title' => 'SRB Motor Buka Cabang Baru di Jakarta Selatan - Melayani dengan Sepenuh Hati',
                'slug' => 'srb-motor-buka-cabang-baru-jakarta-selatan',
                'excerpt' => 'Kabar gembira untuk pelanggan setia SRB Motor! Kami membuka cabang baru di Jakarta Selatan untuk melayani Anda dengan lebih baik lagi.',
                'content' => '<h2>SRB Motor Hadir di Jakarta Selatan</h2><p>Kami dengan senang hati mengumumkan pembukaan cabang baru SRB Motor di Jakarta Selatan. Cabang terbaru kami berlokasi strategis dan dilengkapi dengan fasilitas lengkap untuk memberikan pengalaman berbelanja yang terbaik.</p><h3>Lokasi dan Fasilitas</h3><p>Showroom baru kami terletak di Jalan Merdeka No. 123, Jakarta Selatan. Fasilitas yang kami tawarkan meliputi:</p><ul><li>Showroom modern dengan berbagai pilihan motor</li><li>Ruang tunggu yang nyaman dan ber-AC</li><li>Service center dengan teknisi berpengalaman</li><li>Area test ride dengan track khusus</li><li>Parkir luas untuk kenyamanan pelanggan</li><li>WiFi gratis dan area istirahat</li></ul><h3>Grand Opening Promo</h3><p>Untuk merayakan pembukaan, kami menawarkan promo spesial grand opening:</p><ul><li>Diskon 25% untuk pembelian motor pilihan</li><li>Gratis upgrade helm branded</li><li>Cashback untuk pembayaran tunai</li><li>Undian berhadiah mobil mewah</li></ul><h3>Jam Operasional</h3><ul><li>Senin - Jumat: 09:00 - 18:00</li><li>Sabtu - Minggu: 10:00 - 17:00</li></ul><p>Kami tunggu kedatangan Anda di showroom baru kami. Tim kami siap melayani dengan sepenuh hati untuk memberikan pengalaman terbaik.</p>',
                'featured_image' => null,
                'status' => 'published',
                'views' => 189,
                'published_at' => now()->subDays(1),
            ],
            [
                'category_id' => $tipsCategory->id,
                'title' => 'Panduan Lengkap: Cara Memilih Motor yang Sesuai dengan Kebutuhan Anda',
                'slug' => 'panduan-memilih-motor-sesuai-kebutuhan',
                'excerpt' => 'Memilih motor yang tepat bisa menjadi keputusan yang sulit. Ikuti panduan kami untuk menemukan motor yang paling sesuai dengan kebutuhan Anda.',
                'content' => '<h2>Memilih Motor: Panduan Lengkap untuk Pemula</h2><p>Memilih motor yang tepat adalah keputusan penting yang tidak boleh tergesa-gesa. Ada banyak faktor yang perlu dipertimbangkan agar Anda mendapatkan motor yang sesuai dengan kebutuhan dan budget Anda.</p><h3>1. Tentukan Kebutuhan Utama</h3><p>Sebelum membeli motor, tentukan terlebih dahulu apa kebutuhan utama Anda. Apakah untuk:</p><ul><li>Commuting harian ke kantor?</li><li>Perjalanan jarak jauh?</li><li>Aktivitas off-road?</li><li>Kebutuhan bisnis?</li></ul><h3>2. Pertimbangkan Budget</h3><p>Tentukan berapa budget yang Anda miliki. Ingat bahwa biaya motor tidak hanya meliputi harga beli, tetapi juga biaya perawatan, asuransi, dan bahan bakar.</p><h3>3. Pilih Tipe Motor</h3><p>Ada berbagai tipe motor yang tersedia:</p><ul><li><strong>Matic:</strong> Mudah dikendarai, cocok untuk pemula</li><li><strong>Sport:</strong> Performa tinggi, cocok untuk penggemar kecepatan</li><li><strong>Cruiser:</strong> Kenyamanan maksimal, cocok untuk perjalanan jauh</li><li><strong>Adventure:</strong> Fleksibel, cocok untuk berbagai medan</li></ul><h3>4. Perhatikan Konsumsi Bahan Bakar</h3><p>Pilih motor yang memiliki efisiensi bahan bakar yang baik untuk menghemat pengeluaran operasional.</p><h3>5. Cek Fitur Keselamatan</h3><p>Pastikan motor dilengkapi dengan fitur keselamatan modern seperti ABS, lampu LED, dan teknologi terbaru lainnya.</p><h3>6. Test Ride</h3><p>Sebelum membeli, lakukan test ride untuk memastikan Anda merasa nyaman dengan motor tersebut.</p>',
                'featured_image' => null,
                'status' => 'published',
                'views' => 421,
                'published_at' => now()->subDays(7),
            ],
            [
                'category_id' => $beritaCategory->id,
                'title' => 'Update Terbaru: Layanan Cicilan Tanpa Bunga Kini Tersedia',
                'slug' => 'update-layanan-cicilan-tanpa-bunga',
                'excerpt' => 'Kami dengan bangga mengumumkan peluncuran layanan cicilan tanpa bunga untuk memudahkan Anda memiliki motor impian.',
                'content' => '<h2>Cicilan Tanpa Bunga - Cara Mudah Memiliki Motor Impian</h2><p>SRB Motor kini menawarkan layanan cicilan tanpa bunga sebagai bagian dari komitmen kami untuk memberikan kemudahan kepada pelanggan. Dengan skema cicilan ini, Anda dapat memiliki motor impian tanpa beban bunga yang berat.</p><h3>Keunggulan Cicilan Tanpa Bunga</h3><ul><li>Bunga 0% untuk tenor tertentu</li><li>Proses persetujuan cepat (1-3 hari)</li><li>Persyaratan dokumen mudah</li><li>Fleksibel memilih tenor pembayaran</li><li>Tidak ada biaya tersembunyi</li></ul><h3>Cara Mengajukan</h3><ol><li>Kunjungi showroom atau hubungi kami via WhatsApp</li><li>Pilih motor dan tenor pembayaran</li><li>Siapkan dokumen KTP, NPWP, dan slip gaji</li><li>Isi formulir permohonan cicilan</li><li>Tunggu persetujuan dari tim finance kami</li><li>Selesai! Motor Anda siap dibawa pulang</li></ol><h3>Syarat dan Ketentuan</h3><ul><li>Pemohon harus berusia minimal 21 tahun</li><li>Memiliki KTP dan NPWP</li><li>Penghasilan tetap atau usaha yang stabil</li><li>DP minimal 20% dari harga motor</li><li>Tenor maksimal 60 bulan</li></ul><p>Untuk informasi lebih detail, silakan hubungi tim sales kami di showroom terdekat atau melalui WhatsApp.</p>',
                'featured_image' => null,
                'status' => 'published',
                'views' => 267,
                'published_at' => now()->subDays(2),
            ],
        ];

        foreach ($posts as $post) {
            Post::firstOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }

        $this->command->info('Posts seeded successfully!');
    }
}
