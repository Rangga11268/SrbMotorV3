<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // General Settings
        Setting::updateOrCreate(
            ['key' => 'site_name'],
            [
                'value' => 'SRB Motors',
                'type' => 'string',
                'category' => 'general',
                'description' => 'Nama website'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'site_description'],
            [
                'value' => 'Platform dealer motor terpercaya dengan layanan terbaik',
                'type' => 'text',
                'category' => 'general',
                'description' => 'Deskripsi singkat website'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'site_logo'],
            [
                'value' => '/assets/icon/logo trans.png',
                'type' => 'string',
                'category' => 'general',
                'description' => 'Logo website'
            ]
        );

        // Contact Settings
        Setting::updateOrCreate(
            ['key' => 'contact_email'],
            [
                'value' => 'info@srbmotors.com',
                'type' => 'string',
                'category' => 'contact',
                'description' => 'Email kontak utama'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'contact_phone'],
            [
                'value' => '+6281234567890',
                'type' => 'string',
                'category' => 'contact',
                'description' => 'Nomor telepon kontak'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'contact_whatsapp'],
            [
                'value' => '6281234567890',
                'type' => 'string',
                'category' => 'contact',
                'description' => 'Nomor WhatsApp (tanpa +)'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'contact_address'],
            [
                'value' => 'Jl. Raya Utama No. 123, Jakarta Selatan, DKI Jakarta 12345',
                'type' => 'text',
                'category' => 'contact',
                'description' => 'Alamat kantor'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'contact_city'],
            [
                'value' => 'Jakarta',
                'type' => 'string',
                'category' => 'contact',
                'description' => 'Kota'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'business_hours'],
            [
                'value' => json_encode([
                    'monday' => '08:00 - 17:00',
                    'tuesday' => '08:00 - 17:00',
                    'wednesday' => '08:00 - 17:00',
                    'thursday' => '08:00 - 17:00',
                    'friday' => '08:00 - 17:00',
                    'saturday' => '09:00 - 16:00',
                    'sunday' => 'Tutup',
                ]),
                'type' => 'json',
                'category' => 'contact',
                'description' => 'Jam operasional'
            ]
        );

        // Social Media Settings
        Setting::updateOrCreate(
            ['key' => 'social_facebook'],
            [
                'value' => 'https://facebook.com/srbmotors',
                'type' => 'string',
                'category' => 'social',
                'description' => 'URL Facebook'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'social_instagram'],
            [
                'value' => 'https://instagram.com/srbmotors',
                'type' => 'string',
                'category' => 'social',
                'description' => 'URL Instagram'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'social_youtube'],
            [
                'value' => 'https://youtube.com/@srbmotors',
                'type' => 'string',
                'category' => 'social',
                'description' => 'URL YouTube'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'social_tiktok'],
            [
                'value' => 'https://tiktok.com/@srbmotors',
                'type' => 'string',
                'category' => 'social',
                'description' => 'URL TikTok'
            ]
        );

        // Email Settings
        Setting::updateOrCreate(
            ['key' => 'email_from_name'],
            [
                'value' => 'SRB Motors',
                'type' => 'string',
                'category' => 'email',
                'description' => 'Nama pengirim email'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'email_from_address'],
            [
                'value' => 'noreply@srbmotors.com',
                'type' => 'string',
                'category' => 'email',
                'description' => 'Email pengirim'
            ]
        );
    }
}
