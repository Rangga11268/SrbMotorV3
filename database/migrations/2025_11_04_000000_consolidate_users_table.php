<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * CONSOLIDATED USERS TABLE - Final version with all fields
     * Consolidates: original users + google auth + customer profile fields
     */
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                // Base fields
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->rememberToken();
                $table->string('role')->default('user'); // user, admin

                // Google OAuth fields
                $table->string('google_id')->nullable()->unique();
                $table->string('profile_photo_path')->nullable();
                $table->string('phone')->nullable();

                // Customer profile fields
                $table->text('alamat')->nullable()->comment('Customer address');
                $table->string('nik')->nullable()->unique()->comment('National ID number');
                $table->string('no_ktp')->nullable()->comment('ID card number');
                $table->string('no_hp_backup')->nullable()->comment('Backup phone number');
                $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->comment('Gender');
                $table->date('tanggal_lahir')->nullable()->comment('Date of birth');
                $table->string('pekerjaan')->nullable()->comment('Occupation');
                $table->decimal('pendapatan_bulanan', 15, 0)->nullable()->comment('Monthly income');
                $table->string('nama_ibu_kandung')->nullable()->comment('Mother maiden name');

                $table->timestamps();
            });
        } else {
            // If table exists, add missing columns
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'google_id')) {
                    $table->string('google_id')->nullable()->unique();
                    $table->string('profile_photo_path')->nullable();
                }
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone')->nullable();
                }
                if (!Schema::hasColumn('users', 'alamat')) {
                    $table->text('alamat')->nullable();
                    $table->string('nik')->nullable()->unique();
                    $table->string('no_ktp')->nullable();
                    $table->string('no_hp_backup')->nullable();
                    $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
                    $table->date('tanggal_lahir')->nullable();
                    $table->string('pekerjaan')->nullable();
                    $table->decimal('pendapatan_bulanan', 15, 0)->nullable();
                    $table->string('nama_ibu_kandung')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
