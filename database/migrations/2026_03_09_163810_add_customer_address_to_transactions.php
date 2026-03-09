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
        Schema::table('transactions', function (Blueprint $table) {
            $table->text('customer_address')->after('customer_occupation')->nullable();
            $table->string('status', 50)->change(); // Change from enum to string for unified status flow
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('customer_address');
            // Reverting string to enum is complex and usually requires specific values, 
            // skipping for now as it's a destructive operation in some cases.
        });
    }
};
