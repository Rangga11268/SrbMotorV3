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
        Schema::table('users', function (Blueprint $table) {
            // Add customer profile fields if they don't exist
            if (!Schema::hasColumn('users', 'alamat')) {
                $table->text('alamat')->nullable()->comment('Customer address');
            }
            if (!Schema::hasColumn('users', 'nik')) {
                $table->string('nik')->nullable()->unique()->comment('National ID number');
            }
            if (!Schema::hasColumn('users', 'no_ktp')) {
                $table->string('no_ktp')->nullable()->comment('ID card number');
            }
            if (!Schema::hasColumn('users', 'no_hp_backup')) {
                $table->string('no_hp_backup')->nullable()->comment('Backup phone number');
            }
            if (!Schema::hasColumn('users', 'jenis_kelamin')) {
                $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->comment('Gender: L=Laki-laki, P=Perempuan');
            }
            if (!Schema::hasColumn('users', 'tanggal_lahir')) {
                $table->date('tanggal_lahir')->nullable()->comment('Date of birth');
            }
            if (!Schema::hasColumn('users', 'pekerjaan')) {
                $table->string('pekerjaan')->nullable()->comment('Occupation');
            }
            if (!Schema::hasColumn('users', 'pendapatan_bulanan')) {
                $table->decimal('pendapatan_bulanan', 15, 0)->nullable()->comment('Monthly income');
            }
            if (!Schema::hasColumn('users', 'nama_ibu_kandung')) {
                $table->string('nama_ibu_kandung')->nullable()->comment('Mother maiden name (security question)');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop columns if they exist by checking first
            $columns = ['alamat', 'nik', 'no_ktp', 'no_hp_backup', 'jenis_kelamin', 'tanggal_lahir', 'pekerjaan', 'pendapatan_bulanan', 'nama_ibu_kandung'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
