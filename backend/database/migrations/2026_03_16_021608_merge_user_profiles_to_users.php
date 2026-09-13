<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add columns to users table
        Schema::table('users', function (Blueprint $table) {
            $table->text('alamat')->nullable();
            $table->string('nik')->nullable();
            $table->string('no_ktp')->nullable();
            $table->string('no_hp_backup')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('occupation')->nullable(); // standardized from pekerjaan
            $table->decimal('monthly_income', 15, 2)->nullable(); // standardized from pendapatan_bulanan
            $table->string('nama_ibu_kandung')->nullable();
        });

        // 2. Migrate data
        if (Schema::hasTable('user_profiles')) {
            $profiles = \Illuminate\Support\Facades\DB::table('user_profiles')->get();
            foreach ($profiles as $profile) {
                \Illuminate\Support\Facades\DB::table('users')->where('id', $profile->user_id)->update([
                    'alamat' => $profile->alamat,
                    'nik' => $profile->nik,
                    'no_ktp' => $profile->no_ktp,
                    'no_hp_backup' => $profile->no_hp_backup,
                    'jenis_kelamin' => $profile->jenis_kelamin,
                    'tanggal_lahir' => $profile->tanggal_lahir,
                    'occupation' => $profile->pekerjaan,
                    'monthly_income' => $profile->pendapatan_bulanan,
                    'nama_ibu_kandung' => $profile->nama_ibu_kandung,
                ]);
            }

            // 3. Drop user_profiles table
            Schema::dropIfExists('user_profiles');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('alamat')->nullable();
            $table->string('nik')->nullable();
            $table->string('no_ktp')->nullable();
            $table->string('no_hp_backup')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->decimal('pendapatan_bulanan', 15, 2)->nullable();
            $table->string('nama_ibu_kandung')->nullable();
            $table->timestamps();
        });

        // Restore data
        $users = \Illuminate\Support\Facades\DB::table('users')->get();
        foreach ($users as $user) {
            if ($user->alamat || $user->nik || $user->no_ktp) {
                \Illuminate\Support\Facades\DB::table('user_profiles')->insert([
                    'user_id' => $user->id,
                    'alamat' => $user->alamat,
                    'nik' => $user->nik,
                    'no_ktp' => $user->no_ktp,
                    'no_hp_backup' => $user->no_hp_backup,
                    'jenis_kelamin' => $user->jenis_kelamin,
                    'tanggal_lahir' => $user->tanggal_lahir,
                    'pekerjaan' => $user->occupation,
                    'pendapatan_bulanan' => $user->monthly_income,
                    'nama_ibu_kandung' => $user->nama_ibu_kandung,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'alamat', 'nik', 'no_ktp', 'no_hp_backup', 'jenis_kelamin',
                'tanggal_lahir', 'occupation', 'monthly_income', 'nama_ibu_kandung'
            ]);
        });
    }
};
