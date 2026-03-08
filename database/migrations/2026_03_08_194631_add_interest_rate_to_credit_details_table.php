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
            $table->decimal('interest_rate', 5, 4)->default(0.0150)->after('monthly_installment'); // e.g. 0.0150 = 1.5% flat/month
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropColumn('interest_rate');
        });
    }
};
