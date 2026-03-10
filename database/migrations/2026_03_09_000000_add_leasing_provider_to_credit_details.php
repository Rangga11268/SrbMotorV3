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
        Schema::table('credit_details', function (Blueprint $table) {
            $table->foreignId('leasing_provider_id')->nullable()->constrained('leasing_providers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropForeign(['leasing_provider_id']);
            $table->dropColumn('leasing_provider_id');
        });
    }
};
