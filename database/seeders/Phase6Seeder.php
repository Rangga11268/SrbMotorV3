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
        // 1. Create Promotions
        $promo1 = \App\Models\Promotion::updateOrCreate(
            ['title' => 'PROMO MEI DAHSYAT'],
            ['badge_text' => 'Cashback 2 Juta', 'badge_color' => 'orange', 'is_active' => true]
        );

        $promo2 = \App\Models\Promotion::updateOrCreate(
            ['title' => 'BUNGA NOL PERSEN'],
            ['badge_text' => 'Bunga 0%', 'badge_color' => 'blue', 'is_active' => true]
        );

        // 2. Create Leasing Providers
        $baf = \App\Models\LeasingProvider::updateOrCreate(['name' => 'BAF (Bussan Auto Finance)']);
        $adira = \App\Models\LeasingProvider::updateOrCreate(['name' => 'Adira Finance']);

        // 3. Create Motors
        $motors = [
            [
                'name' => 'Yamaha NMAX Turbo 2024',
                'brand' => 'Yamaha',
                'model' => 'NMAX',
                'price' => 35500000,
                'year' => 2024,
                'type' => 'Matic',
                'description' => '<h3>Fitur Unggulan NMAX Turbo</h3><ul><li>Mesin Blue Core 155cc</li><li>Y-Connect Navigation</li><li>Electric Power Socket</li></ul><p>Nikmati berkendara dengan kenyamanan maksimal dan teknologi turbo terbaru dari Yamaha.</p>',
                'image_path' => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
                'tersedia' => true,
                'promos' => [$promo1->id, $promo2->id]
            ],
            [
                'name' => 'Yamaha Aerox 155 Cyber City',
                'brand' => 'Yamaha',
                'model' => 'Aerox',
                'price' => 31200000,
                'year' => 2024,
                'type' => 'Sport Matic',
                'description' => '<h3>Aerox 155 Cyber City</h3><p>Desain sporty yang agresif dengan performa mesin yang tangguh. Cocok untuk Anda yang berjiwa muda.</p>',
                'image_path' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
                'tersedia' => true,
                'promos' => [$promo1->id]
            ],
            [
                'name' => 'Yamaha Fazzio Lux Edition',
                'brand' => 'Yamaha',
                'model' => 'Fazzio',
                'price' => 23500000,
                'year' => 2024,
                'type' => 'Classy',
                'description' => '<h3>Gaya Hidup Classy dengan Fazzio</h3><p>Motor hybrid pertama di kelasnya. Hemat bahan bakar dan tampil elegan di jalanan Bekasi.</p>',
                'image_path' => 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800',
                'tersedia' => true,
                'promos' => [$promo2->id]
            ]
        ];

        foreach ($motors as $mData) {
            $promos = $mData['promos'];
            unset($mData['promos']);

            $motor = \App\Models\Motor::updateOrCreate(
                ['name' => $mData['name']],
                $mData
            );

            $motor->promotions()->sync($promos);

            // 4. Create Financing Schemes
            // BAF Schemes
            \App\Models\FinancingScheme::updateOrCreate(
                ['motor_id' => $motor->id, 'provider_id' => $baf->id, 'tenor' => 11],
                ['dp_amount' => $motor->price * 0.15, 'monthly_installment' => ($motor->price * 0.85) / 10]
            );
            \App\Models\FinancingScheme::updateOrCreate(
                ['motor_id' => $motor->id, 'provider_id' => $baf->id, 'tenor' => 23],
                ['dp_amount' => $motor->price * 0.15, 'monthly_installment' => ($motor->price * 0.85) / 20]
            );
            \App\Models\FinancingScheme::updateOrCreate(
                ['motor_id' => $motor->id, 'provider_id' => $baf->id, 'tenor' => 35],
                ['dp_amount' => $motor->price * 0.15, 'monthly_installment' => ($motor->price * 0.85) / 30]
            );

            // Adira Schemes
            \App\Models\FinancingScheme::updateOrCreate(
                ['motor_id' => $motor->id, 'provider_id' => $adira->id, 'tenor' => 12],
                ['dp_amount' => $motor->price * 0.20, 'monthly_installment' => ($motor->price * 0.80) / 11]
            );
            \App\Models\FinancingScheme::updateOrCreate(
                ['motor_id' => $motor->id, 'provider_id' => $adira->id, 'tenor' => 24],
                ['dp_amount' => $motor->price * 0.20, 'monthly_installment' => ($motor->price * 0.80) / 22]
            );
            \App\Models\FinancingScheme::updateOrCreate(
                ['motor_id' => $motor->id, 'provider_id' => $adira->id, 'tenor' => 36],
                ['dp_amount' => $motor->price * 0.20, 'monthly_installment' => ($motor->price * 0.80) / 33]
            );
        }
    }
}
