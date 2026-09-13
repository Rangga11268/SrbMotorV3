<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * NOTE: This migration adds indexes ONLY to tables that exist at 2025-11-07.
     * Tables created after this date (credit_details, documents, etc.) already have indexes
     * defined in their consolidated migration files.
     */
    public function up(): void
    {
        // Add indexes to motors table (exists from 2025-10-30)
        if (Schema::hasTable('motors')) {
            Schema::table('motors', function (Blueprint $table) {
                $table->index(['brand', 'type']);
                $table->index('year');
                $table->index('price');
                $table->index('tersedia');
                $table->index(['brand', 'tersedia']);
            });
        }

        // Add indexes to transactions table (exists from 2025-11-05)
        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->index(['user_id', 'status']);
                $table->index(['motor_id', 'transaction_type']);
                $table->index('transaction_type');
                $table->index('status');
                $table->index('created_at');
            });
        }

        // Add indexes to users table (exists from 2025-11-04 - consolidated migration)
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('role');
                $table->index('email');
                $table->index('created_at');
            });
        }

        // Add indexes to contact_messages table (exists from 2025-10-30)
        if (Schema::hasTable('contact_messages')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // NOTE: credit_details, documents, and survey_schedules indexes are already defined
        // in their respective consolidated migration files (2026_03_11_*).
        // motor_specifications table no longer exists, so we skip it.
    }

    /**
     * Reverse the migrations.
     * NOTE: Index drops are intentionally skipped because:
     * 1. Dropping indexes doesn't affect data integrity
     * 2. Prevents issues if indexes don't exist (partial rollback scenarios)
     * 3. Keeps rollback operations fast
     */
    public function down(): void
    {
        // Index drops are skipped - safer for partial rollbacks
    }
};
