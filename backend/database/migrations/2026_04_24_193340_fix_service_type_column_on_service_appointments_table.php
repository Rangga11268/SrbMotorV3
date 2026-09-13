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
        Schema::table('service_appointments', function (Blueprint $table) {
            // Change enum to string to allow flexible service types
            $table->string('service_type', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_appointments', function (Blueprint $table) {
            $table->enum('service_type', ['Servis Berkala', 'Ganti Oli', 'Perbaikan Berat', 'Lainnya'])->default('Servis Berkala')->change();
        });
    }
};
