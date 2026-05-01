<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user (or update if exists)
        User::firstOrCreate(
            ['email' => 'admin@srbmotors.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => Carbon::now(),
            ]
        );

        // Create a regular user (or update if exists)
        User::firstOrCreate(
            ['email' => 'user@srbmotors.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => Carbon::now(),
            ]
        );

        // Create test customer
        User::firstOrCreate(
            ['email' => 'customer@test.com'],
            [
                'name' => 'Test Customer',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => Carbon::now(),
            ]
        );

        // Create owner user
        User::firstOrCreate(
            ['email' => 'owner@srbmotors.com'],
            [
                'name' => 'Owner SRB Motor',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'email_verified_at' => Carbon::now(),
            ]
        );

        // Create montir user
        User::firstOrCreate(
            ['email' => 'montir@srbmotors.com'],
            [
                'name' => 'Montir Bengkel',
                'password' => Hash::make('password'),
                'role' => 'montir',
                'email_verified_at' => Carbon::now(),
            ]
        );
    }
}
