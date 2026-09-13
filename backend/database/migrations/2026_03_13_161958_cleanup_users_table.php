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
            $table->dropColumn([
                'alamat',
                'nik',
                'no_ktp',
                'no_hp_backup',
                'jenis_kelamin',
                'tanggal_lahir',
                'pekerjaan',
                'pendapatan_bulanan',
                'nama_ibu_kandung',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('alamat')->nullable();
            $table->string('nik')->nullable()->unique();
            $table->string('no_ktp')->nullable();
            $table->string('no_hp_backup')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->decimal('pendapatan_bulanan', 15, 0)->nullable();
            $table->string('nama_ibu_kandung')->nullable();
        });
    }
};
