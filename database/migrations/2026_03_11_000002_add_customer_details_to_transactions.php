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
            // Add personal identity details
            if (!Schema::hasColumn('transactions', 'customer_nik')) {
                $table->string('customer_nik')->nullable()->after('customer_occupation');
            }

            // Add employment details
            if (!Schema::hasColumn('transactions', 'customer_monthly_income')) {
                $table->decimal('customer_monthly_income', 15, 2)->nullable()->after('customer_nik');
            }
            if (!Schema::hasColumn('transactions', 'customer_employment_duration')) {
                $table->string('customer_employment_duration')->nullable()->after('customer_monthly_income');
            }

            // Add credit amount for easier reference
            if (!Schema::hasColumn('transactions', 'credit_amount')) {
                $table->decimal('credit_amount', 15, 2)->nullable()->after('customer_employment_duration');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $columnsToDrop = [
                'customer_nik',
                'customer_monthly_income',
                'customer_employment_duration',
                'credit_amount',
            ];

            $existingColumns = Schema::getColumnListing('transactions');
            $columnsToDrop = array_filter($columnsToDrop, fn($col) => in_array($col, $existingColumns));

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
