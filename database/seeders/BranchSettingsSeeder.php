<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class BranchSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate existing branches
        DB::table('branches')->truncate();

        $branches = [
            // CABANG UTAMA - MEKARSARI (BISA SERVIS)
            [
                'code' => 'SSM_MEKAR_SARI',
                'name' => 'SSM MEKAR SARI (BEKASI)',
                'address' => 'Jl. Mekar Sari No.39, Bekasi Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112',
                'city' => 'Bekasi',
                'phone' => '02189094308',
                'phone_alt' => null,
                'whatsapp' => '02189094308',
                'latitude' => -6.229823007136256,
                'longitude' => 107.01586283553496,
                'maps_url' => 'https://maps.app.goo.gl/49JT2gMetP4nPsiw5',
                'operational_hours' => [
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '08:00 - 17:00',
                ],
                'facilities' => ['Sales', 'Service', 'Spare Parts'],
                'is_active' => true,
                'is_main_branch' => true,
                'can_service' => true,
                'service_slot_quota' => 5,
            ],

            // CABANG PREMIUM R-SHOP YAMAHA SSM (BISA SERVIS)
            [
                'code' => 'SSM_JATIASIH_RSHOP',
                'name' => 'Yamaha Sinar Surya Matahari - Premium R-Shop',
                'address' => 'Jl. Raya Jatimekar No.72A, RT.004/RW.012, Jatimekar, Kec. Jatiasih, Kota Bks, Jawa Barat 17422',
                'city' => 'Bekasi',
                'phone' => '02184972828',
                'phone_alt' => null,
                'whatsapp' => '081286856166',
                'latitude' => -6.2872928177202985,
                'longitude' => 106.9538488643708,
                'maps_url' => 'https://maps.app.goo.gl/EG1vYtfchbEMKUG88',
                'operational_hours' => [
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '08:00 - 17:00',
                ],
                'facilities' => ['Sales', 'Service', 'Spare Parts', 'Premium Service'],
                'is_active' => true,
                'is_main_branch' => false,
                'can_service' => true,
                'service_slot_quota' => 5,
            ],

            // NETWORK BRANCH - SRB MOTORS KALIABANG (SALES ONLY)
            [
                'code' => 'SRB_KALIABANG',
                'name' => 'SRB Motors Kaliabang',
                'address' => 'Jl. Lori Sakti No.22, RT.001/RW.001, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks, Jawa Barat 17125',
                'city' => 'Bekasi',
                'phone' => '08978638849',
                'phone_alt' => null,
                'whatsapp' => '08978638849',
                'latitude' => -6.201298487662631,
                'longitude' => 107.00251371937173,
                'maps_url' => 'https://maps.app.goo.gl/XY85E7th3cARM2719',
                'operational_hours' => [
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '08:00 - 17:00',
                ],
                'facilities' => ['Sales'],
                'is_active' => true,
                'is_main_branch' => false,
                'can_service' => false,
                'service_slot_quota' => 5,
            ],

            // NETWORK BRANCH - SSM PONDOK UNGU (SALES ONLY)
            [
                'code' => 'SSM_PONDOK_UNGU',
                'name' => 'SSM Pondok Ungu',
                'address' => 'Jl. Raya Pd. Ungu Permai Blok II 10 No.86, RT.003/RW.016, Kaliabang Tengah, Kec. Bekasi Utara, Kabupaten Bekasi, Jawa Barat 17125',
                'city' => 'Bekasi',
                'phone' => '-',
                'phone_alt' => null,
                'whatsapp' => '-',
                'latitude' => -6.178600632074503,
                'longitude' => 107.00491697860156,
                'maps_url' => 'https://maps.app.goo.gl/rQjY7M3pqxPovESBA',
                'operational_hours' => [
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '08:00 - 17:00',
                ],
                'facilities' => ['Sales'],
                'is_active' => true,
                'is_main_branch' => false,
                'can_service' => false,
                'service_slot_quota' => 5,
            ],

            // NETWORK BRANCH - SSM YAMAHA ALINDA (SALES ONLY)
            [
                'code' => 'SSM_ALINDA',
                'name' => 'SSM Yamaha Alinda',
                'address' => 'Jl. Alinda, RT.03/RW.13, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks, Jawa Barat',
                'city' => 'Bekasi',
                'phone' => '08971756468',
                'phone_alt' => null,
                'whatsapp' => '08971756468',
                'latitude' => -6.191012237976687,
                'longitude' => 107.00606013629579,
                'maps_url' => 'https://maps.app.goo.gl/3o9sWM73i8RzLbaR6',
                'operational_hours' => [
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '08:00 - 17:00',
                ],
                'facilities' => ['Sales'],
                'is_active' => true,
                'is_main_branch' => false,
                'can_service' => false,
                'service_slot_quota' => 5,
            ],

            // NETWORK BRANCH - DEALER YAMAHA SSM JATIBENING (SALES ONLY)
            [
                'code' => 'SSM_JATIBENING',
                'name' => 'Dealer Resmi Yamaha SSM Motor Jatibening',
                'address' => 'Jatibening, Kec. Pd. Gede, Kota Bks, Jawa Barat',
                'city' => 'Bekasi',
                'phone' => '0895383002103',
                'phone_alt' => null,
                'whatsapp' => '0895383002103',
                'latitude' => -6.257804848289224,
                'longitude' => 106.95166736251987,
                'maps_url' => 'https://maps.app.goo.gl/5yjNcZwW7US5nV816',
                'operational_hours' => [
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '08:00 - 17:00',
                ],
                'facilities' => ['Sales'],
                'is_active' => true,
                'is_main_branch' => false,
                'can_service' => false,
                'service_slot_quota' => 5,
            ],
        ];

        // Insert all branches
        foreach ($branches as $branch) {
            Branch::create($branch);
        }

        $this->command->info('✓ Branch settings seeded successfully into branches table!');
        $this->command->info('  - 2 Service branches (Mekar Sari & Jatiasih R-Shop)');
        $this->command->info('  - 4 Network branches (Sales only)');
    }
}
