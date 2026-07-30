<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create branches table
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name', 255);
            $table->text('address');
            $table->string('city', 100);
            $table->string('phone', 50);
            $table->string('phone_alt', 50)->nullable();
            $table->string('whatsapp', 50);
            $table->text('maps_url')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->json('operational_hours');
            $table->json('facilities')->nullable();
            $table->boolean('can_service')->default(true);
            $table->integer('service_slot_quota')->default(5);
            $table->boolean('is_main_branch')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Migrate existing branch data from settings table to branches table
        if (Schema::hasTable('settings')) {
            $settingBranches = DB::table('settings')
                ->where('category', 'branches')
                ->get();

            foreach ($settingBranches as $setting) {
                $data = json_decode($setting->value, true);
                if (is_array($data)) {
                    DB::table('branches')->insert([
                        'code' => $data['code'] ?? $setting->key,
                        'name' => $data['name'] ?? 'Cabang ' . $setting->key,
                        'address' => $data['address'] ?? '',
                        'city' => $data['city'] ?? 'Bekasi',
                        'phone' => $data['phone'] ?? '',
                        'phone_alt' => $data['phone_alt'] ?? null,
                        'whatsapp' => $data['whatsapp'] ?? '',
                        'maps_url' => $data['maps_url'] ?? null,
                        'latitude' => $data['latitude'] ?? 0.0,
                        'longitude' => $data['longitude'] ?? 0.0,
                        'operational_hours' => json_encode($data['operational_hours'] ?? []),
                        'facilities' => json_encode($data['facilities'] ?? []),
                        'can_service' => $data['can_service'] ?? true,
                        'service_slot_quota' => $data['service_slot_quota'] ?? 5,
                        'is_main_branch' => $data['is_main_branch'] ?? false,
                        'is_active' => $data['is_active'] ?? true,
                        'created_at' => $setting->created_at ?? now(),
                        'updated_at' => $setting->updated_at ?? now(),
                    ]);
                }
            }

            // 3. Remove old branch data from settings table
            DB::table('settings')->where('category', 'branches')->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Move data back to settings table
        if (Schema::hasTable('settings')) {
            $branches = DB::table('branches')->get();

            foreach ($branches as $branch) {
                $key = strtoupper(Str::slug($branch->code, '_'));
                
                $valueArray = [
                    'code' => $branch->code,
                    'name' => $branch->name,
                    'address' => $branch->address,
                    'city' => $branch->city,
                    'phone' => $branch->phone,
                    'phone_alt' => $branch->phone_alt,
                    'whatsapp' => $branch->whatsapp,
                    'maps_url' => $branch->maps_url,
                    'latitude' => (float)$branch->latitude,
                    'longitude' => (float)$branch->longitude,
                    'operational_hours' => json_decode($branch->operational_hours, true),
                    'facilities' => json_decode($branch->facilities, true),
                    'can_service' => (bool)$branch->can_service,
                    'service_slot_quota' => (int)$branch->service_slot_quota,
                    'is_main_branch' => (bool)$branch->is_main_branch,
                    'is_active' => (bool)$branch->is_active,
                ];

                DB::table('settings')->insert([
                    'category' => 'branches',
                    'key' => $key,
                    'value' => json_encode($valueArray),
                    'type' => 'json',
                    'description' => 'Data cabang ' . $branch->name,
                    'created_at' => $branch->created_at,
                    'updated_at' => $branch->updated_at,
                ]);
            }
        }

        // 2. Drop branches table
        Schema::dropIfExists('branches');
    }
};
