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
        Schema::table('motors', function (Blueprint $table) {
            $table->string('no_rangka', 50)->nullable()->unique()->after('type')
                  ->comment('Nomor rangka / chassis number kendaraan');
            $table->string('no_mesin', 50)->nullable()->unique()->after('no_rangka')
                  ->comment('Nomor mesin kendaraan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            $table->dropUnique(['no_rangka']);
            $table->dropUnique(['no_mesin']);
            $table->dropColumn(['no_rangka', 'no_mesin']);
        });
    }
};
