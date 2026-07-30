<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Drop the unique constraints on no_rangka and no_mesin.
     * Uniqueness is now enforced at the application layer to support
     * the multi-branch model (one motor = multiple rows, one per branch).
     */
    public function up(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            $table->dropUnique('motors_no_rangka_unique');
            $table->dropUnique('motors_no_mesin_unique');
        });
    }

    public function down(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            $table->unique('no_rangka');
            $table->unique('no_mesin');
        });
    }
};
