<?php

namespace Database\Seeders;

use App\Models\Motor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MotorColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colorMappings = [
            'Yamaha NMAX Turbo 2024' => ['Hitam', 'Putih', 'Merah', 'Biru Matte'],
            'Yamaha Aerox 155 Cyber City' => ['Cyber City', 'Merah', 'Hitam'],
            'Yamaha Fazzio Lux Edition' => ['Prestige Silver', 'Matte Black', 'White Pearl'],
            'Honda PCX 160 ABS' => ['Imperial Matte Blue', 'Wonderful White', 'Majestic Matte Red', 'Glorious Matte Black'],
            'Honda Vario 160' => ['Active Black', 'Grande Matte White', 'Grande Matte Red'],
            'Honda Scoopy Prestige' => ['Prestige White', 'Prestige Black'],
        ];

        foreach ($colorMappings as $motorName => $colors) {
            $motor = Motor::where('name', $motorName)->first();
            if ($motor) {
                // Because we cast colors to array, we pass array here
                $motor->update(['colors' => $colors]);
            }
        }

        // Buat jaga-jaga kalau ada motor lain yang belum ada warnanya
        $otherMotors = Motor::whereNull('colors')->get();
        foreach ($otherMotors as $motor) {
            $motor->update(['colors' => ['Hitam', 'Putih']]);
        }
    }
}
