<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Phase6Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Leasing providers have been removed in V2 architecture
        // 3. Create Motors
        $motors = [
            [
                'name' => 'Yamaha NMAX Turbo 2024',
                'brand' => 'Yamaha',
                'model' => 'NMAX',
                'price' => 35500000,
                'year' => 2024,
                'type' => 'Matic',
                'details' => '<h3>Fitur Unggulan NMAX Turbo</h3><ul><li>Mesin Blue Core 155cc</li><li>Y-Connect Navigation</li><li>Electric Power Socket</li></ul><p>Nikmati berkendara dengan kenyamanan maksimal dan teknologi turbo terbaru dari Yamaha.</p>',
                'image_path' => 'assets/img/yamaha/NMax Turbo.png',
                'tersedia' => true
            ],
            [
                'name' => 'Yamaha Aerox 155 Cyber City',
                'brand' => 'Yamaha',
                'model' => 'Aerox',
                'price' => 31200000,
                'year' => 2024,
                'type' => 'Sport Matic',
                'details' => '<h3>Aerox 155 Cyber City</h3><p>Desain sporty yang agresif dengan performa mesin yang tangguh. Cocok untuk Anda yang berjiwa muda.</p>',
                'image_path' => 'assets/img/yamaha/aerox 155.png',
                'tersedia' => true
            ],
            [
                'name' => 'Yamaha Fazzio Lux Edition',
                'brand' => 'Yamaha',
                'model' => 'Fazzio',
                'price' => 23500000,
                'year' => 2024,
                'type' => 'Classy',
                'details' => '<h3>Gaya Hidup Classy dengan Fazzio</h3><p>Motor hybrid pertama di kelasnya. Hemat bahan bakar dan tampil elegan di jalanan Bekasi.</p>',
                'image_path' => 'assets/img/yamaha/Fazzio.png',
                'tersedia' => true
            ],
            [
                'name' => 'Honda PCX 160 ABS',
                'brand' => 'Honda',
                'model' => 'PCX 160',
                'price' => 36000000,
                'year' => 2024,
                'type' => 'Matic Premium',
                'details' => '<h3>Elegansi dan Performa PCX 160</h3><p>Desain mewah dengan performa mesin eSP+ 160cc 4-katup yang bertenaga.</p>',
                'image_path' => 'assets/img/honda/pcx 160.png',
                'tersedia' => true
            ],
            [
                'name' => 'Honda Vario 160',
                'brand' => 'Honda',
                'model' => 'Vario 160',
                'price' => 27350000,
                'year' => 2024,
                'type' => 'Sport Matic',
                'details' => '<h3>Vario 160 Bigger, Greater</h3><p>Tampil lebih besar dan tangguh dengan mesin 160cc untuk aktivitas sehari-hari gaya maksimal.</p>',
                'image_path' => 'assets/img/honda/vario 160.png',
                'tersedia' => true
            ],
            [
                'name' => 'Honda Scoopy Prestige',
                'brand' => 'Honda',
                'model' => 'Scoopy',
                'price' => 22000000,
                'year' => 2024,
                'type' => 'Classic',
                'details' => '<h3>Scoopy Klasik yang Ikonik</h3><p>Fitur Smart Key System lengkap gaya retro yang abadi sepanjang masa.</p>',
                'image_path' => 'assets/img/honda/scoopy.png',
                'tersedia' => true
            ]
        ];

        foreach ($motors as $mData) {
            \App\Models\Motor::updateOrCreate(
                ['name' => $mData['name']],
                $mData
            );
        }
    }
}
