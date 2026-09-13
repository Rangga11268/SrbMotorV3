<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Add multi-branch support without creating new tables.
     * Uses existing 'settings' table to store branch data.
     */
    public function up(): void
    {
        // 1. Add branch_code to transactions table
        if (Schema::hasTable("transactions")) {
            Schema::table("transactions", function (Blueprint $table) {
                if (!Schema::hasColumn("transactions", "branch_code")) {
                    $table
                        ->string("branch_code")
                        ->nullable()
                        ->after("motor_id")
                        ->comment("Selected branch for pickup/delivery");
                    $table->index("branch_code");
                }
            });
        }

        // 2. Add location fields to users table for distance calculation
        if (Schema::hasTable("users")) {
            Schema::table("users", function (Blueprint $table) {
                if (!Schema::hasColumn("users", "latitude")) {
                    $table
                        ->decimal("latitude", 10, 8)
                        ->nullable()
                        ->after("alamat")
                        ->comment(
                            "Customer location latitude for branch distance calc",
                        );
                }
                if (!Schema::hasColumn("users", "longitude")) {
                    $table
                        ->decimal("longitude", 11, 8)
                        ->nullable()
                        ->after("latitude")
                        ->comment(
                            "Customer location longitude for branch distance calc",
                        );
                }
                if (!Schema::hasColumn("users", "preferred_branch")) {
                    $table
                        ->string("preferred_branch")
                        ->nullable()
                        ->after("longitude")
                        ->comment("Customer preferred branch code");
                }
            });
        }

        // 3. Insert branch master data into settings table
        $this->seedBranchSettings();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable("transactions")) {
            Schema::table("transactions", function (Blueprint $table) {
                $table->dropIndex(["branch_code"]);
                $table->dropColumn(["branch_code"]);
            });
        }

        if (Schema::hasTable("users")) {
            Schema::table("users", function (Blueprint $table) {
                $table->dropColumn([
                    "latitude",
                    "longitude",
                    "preferred_branch",
                ]);
            });
        }

        // Remove branch settings
        DB::table("settings")->where("category", "branches")->delete();
    }

    /**
     * Seed branch master data into settings table
     */
    private function seedBranchSettings(): void
    {
        $branches = [
            // Cabang Utama (Main Branch) - Can Service
            [
                "category" => "branches",
                "key" => "SSM_MEKAR_SARI",
                "value" => json_encode([
                    "code" => "SSM_MEKAR_SARI",
                    "name" => "SSM MEKAR SARI (BEKASI)",
                    "address" =>
                        "Jl. Mekar Sari No.39, Bekasi Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112",
                    "city" => "Bekasi",
                    "phone" => "02189094308",
                    "whatsapp" => "02189094308",
                    "maps_url" => "https://maps.app.goo.gl/49JT2gMetP4nPsiw5",
                    "latitude" => -6.2446,
                    "longitude" => 106.9992,
                    "operational_hours" => [
                        "monday" => "08:00-17:00",
                        "tuesday" => "08:00-17:00",
                        "wednesday" => "08:00-17:00",
                        "thursday" => "08:00-17:00",
                        "friday" => "08:00-17:00",
                        "saturday" => "08:00-17:00",
                        "sunday" => "08:00-17:00",
                    ],
                    "facilities" => [
                        "Service Center",
                        "Showroom",
                        "Spare Parts",
                        "Test Ride",
                    ],
                    "can_service" => true,
                    "is_main_branch" => true,
                    "is_active" => true,
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],

            // Cabang Besar - Premium R-Shop (Can Service)
            [
                "category" => "branches",
                "key" => "SSM_JATIMEKAR",
                "value" => json_encode([
                    "code" => "SSM_JATIMEKAR",
                    "name" =>
                        "Yamaha Sinar Surya Matahari Motor – Premium R-Shop",
                    "address" =>
                        "Jl. Raya Jatimekar No.72A, RT.004/RW.012, Jatimekar, Kec. Jatiasih, Kota Bks, Jawa Barat 17422",
                    "city" => "Bekasi",
                    "phone" => "021-8485060",
                    "phone_alt" => "021-84972828",
                    "whatsapp" => "081286856166",
                    "maps_url" => "https://maps.app.goo.gl/EG1vYtfchbEMKUG88",
                    "latitude" => -6.3145,
                    "longitude" => 106.9696,
                    "operational_hours" => [
                        "monday" => "08:00-17:00",
                        "tuesday" => "08:00-17:00",
                        "wednesday" => "08:00-17:00",
                        "thursday" => "08:00-17:00",
                        "friday" => "08:00-17:00",
                        "saturday" => "08:00-17:00",
                        "sunday" => "08:00-17:00",
                    ],
                    "facilities" => [
                        "Service Center",
                        "Showroom",
                        "Spare Parts",
                        "Premium R-Shop",
                    ],
                    "can_service" => true,
                    "is_main_branch" => false,
                    "is_active" => true,
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],

            // SRB Motors - Network Branch (Sales Only)
            [
                "category" => "branches",
                "key" => "SRB_KALIABANG",
                "value" => json_encode([
                    "code" => "SRB_KALIABANG",
                    "name" => "SRB Motors Kaliabang",
                    "address" =>
                        "Jl. Lori Sakti No.22, RT.001/RW.001, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks, Jawa Barat 17125",
                    "city" => "Bekasi",
                    "phone" => "08978638849",
                    "whatsapp" => "08978638849",
                    "maps_url" => "https://maps.app.goo.gl/XY85E7th3cARM2719",
                    "latitude" => -6.1892,
                    "longitude" => 106.9889,
                    "operational_hours" => [
                        "monday" => "08:00-17:00",
                        "tuesday" => "08:00-17:00",
                        "wednesday" => "08:00-17:00",
                        "thursday" => "08:00-17:00",
                        "friday" => "08:00-17:00",
                        "saturday" => "08:00-17:00",
                        "sunday" => "08:00-17:00",
                    ],
                    "facilities" => ["Showroom", "Sales"],
                    "can_service" => false,
                    "is_main_branch" => false,
                    "is_active" => true,
                    "branch_type" => "network",
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],

            // SSM Pondok Ungu
            [
                "category" => "branches",
                "key" => "SSM_PONDOK_UNGU",
                "value" => json_encode([
                    "code" => "SSM_PONDOK_UNGU",
                    "name" => "SSM Pondok Ungu",
                    "address" =>
                        "Jl. Raya Pd. Ungu Permai Blok II 10 No.86, RT.003/RW.016, Kaliabang Tengah, Kec. Bekasi Utara, Kabupaten Bekasi, Jawa Barat 17125",
                    "city" => "Bekasi",
                    "phone" => "021-88888888",
                    "whatsapp" => "081234567890",
                    "maps_url" => "https://maps.app.goo.gl/rQjY7M3pqxPovESBA",
                    "latitude" => -6.1856,
                    "longitude" => 106.9834,
                    "operational_hours" => [
                        "monday" => "08:00-17:00",
                        "tuesday" => "08:00-17:00",
                        "wednesday" => "08:00-17:00",
                        "thursday" => "08:00-17:00",
                        "friday" => "08:00-17:00",
                        "saturday" => "08:00-17:00",
                        "sunday" => "08:00-17:00",
                    ],
                    "facilities" => ["Showroom", "Sales"],
                    "can_service" => false,
                    "is_main_branch" => false,
                    "is_active" => true,
                    "branch_type" => "network",
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],

            // SSM Yamaha Alinda
            [
                "category" => "branches",
                "key" => "SSM_ALINDA",
                "value" => json_encode([
                    "code" => "SSM_ALINDA",
                    "name" => "SSM Yamaha Alinda",
                    "address" =>
                        "R254+GCV, Jl. Alinda, RT.03/RW.13, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks, Jawa Barat",
                    "city" => "Bekasi",
                    "phone" => "08971756468",
                    "whatsapp" => "08971756468",
                    "maps_url" => "https://maps.app.goo.gl/3o9sWM73i8RzLbaR6",
                    "latitude" => -6.1912,
                    "longitude" => 106.9566,
                    "operational_hours" => [
                        "monday" => "08:00-17:00",
                        "tuesday" => "08:00-17:00",
                        "wednesday" => "08:00-17:00",
                        "thursday" => "08:00-17:00",
                        "friday" => "08:00-17:00",
                        "saturday" => "08:00-17:00",
                        "sunday" => "08:00-17:00",
                    ],
                    "facilities" => ["Showroom", "Sales"],
                    "can_service" => false,
                    "is_main_branch" => false,
                    "is_active" => true,
                    "branch_type" => "network",
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],

            // SSM Motor Jatibening
            [
                "category" => "branches",
                "key" => "SSM_JATIBENING",
                "value" => json_encode([
                    "code" => "SSM_JATIBENING",
                    "name" => "Dealer Resmi Yamaha SSM Motor Jatibening",
                    "address" =>
                        "Dealer Resmi Yamaha SSM Motor, Jatibening, Kec. Pd. Gede, Kota Bks, Jawa Barat",
                    "city" => "Bekasi",
                    "phone" => "0895383002103",
                    "whatsapp" => "0895383002103",
                    "maps_url" => "https://maps.app.goo.gl/5yjNcZwW7US5nV816",
                    "latitude" => -6.2634,
                    "longitude" => 106.9571,
                    "operational_hours" => [
                        "monday" => "08:00-17:00",
                        "tuesday" => "08:00-17:00",
                        "wednesday" => "08:00-17:00",
                        "thursday" => "08:00-17:00",
                        "friday" => "08:00-17:00",
                        "saturday" => "08:00-17:00",
                        "sunday" => "08:00-17:00",
                    ],
                    "facilities" => ["Showroom", "Sales"],
                    "can_service" => false,
                    "is_main_branch" => false,
                    "is_active" => true,
                    "branch_type" => "network",
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ];

        foreach ($branches as $branch) {
            DB::table("settings")->updateOrInsert(
                ["category" => $branch["category"], "key" => $branch["key"]],
                $branch,
            );
        }

        // Add branch list config
        DB::table("settings")->updateOrInsert(
            ["category" => "system", "key" => "enabled_branches"],
            [
                "category" => "system",
                "key" => "enabled_branches",
                "value" => json_encode([
                    "SSM_MEKAR_SARI", // Main Branch (can service)
                    "SSM_JATIMEKAR", // Premium R-Shop (can service)
                    "SRB_KALIABANG", // Network Branch (sales only)
                    "SSM_PONDOK_UNGU", // Network Branch (sales only)
                    "SSM_ALINDA", // Network Branch (sales only)
                    "SSM_JATIBENING", // Network Branch (sales only)
                ]),
                "created_at" => now(),
                "updated_at" => now(),
            ],
        );
    }
};
