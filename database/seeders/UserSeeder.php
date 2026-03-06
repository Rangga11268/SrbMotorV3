<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@srbmotors.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        // Create a regular user
        User::create([
            'name' => 'Regular User',
            'email' => 'user@srbmotors.com',
            'password' => Hash::make('password'),
            'role' => 'user'
        ]);
    }
}
