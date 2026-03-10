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
            // Add only the new columns needed for the refactor
            // (Most survey and leasing columns already exist from previous migrations)

            // 1. Additional Leasing Info (leasing_provider_id already exists)
            if (!Schema::hasColumn('credit_details', 'leasing_application_ref')) {
                $table->string('leasing_application_ref')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'leasing_decision_date')) {
                $table->dateTime('leasing_decision_date')->nullable();
            }

            // 2. Decision Information
            if (!Schema::hasColumn('credit_details', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'internal_notes')) {
                $table->text('internal_notes')->nullable();
            }

            // 3. DP Payment Tracking
            if (!Schema::hasColumn('credit_details', 'dp_paid_date')) {
                $table->dateTime('dp_paid_date')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'dp_payment_method')) {
                $table->string('dp_payment_method')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'dp_confirmed_by')) {
                $table->unsignedBigInteger('dp_confirmed_by')->nullable();
                $table->foreign('dp_confirmed_by')
                    ->references('id')
                    ->on('users')
                    ->onDelete('set null');
            }

            // 4. Add indices for performance (only if columns exist now)
            $existingColumns = Schema::getColumnListing('credit_details');

            try {
                if (in_array('credit_status', $existingColumns) && !$table->getIndexes()) {
                    $table->index('credit_status');
                }
            } catch (\Exception $e) {
                // Index might already exist
            }

            try {
                if (in_array('survey_scheduled_date', $existingColumns)) {
                    $table->index('survey_scheduled_date');
                }
            } catch (\Exception $e) {
                // Index might already exist
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            // Drop foreign key
            try {
                $table->dropForeignKeyIfExists(['dp_confirmed_by']);
            } catch (\Exception $e) {
                // Key might not exist
            }

            // Drop indices (will be rolled back with columns)
            try {
                $table->dropIndex(['credit_status']);
            } catch (\Exception $e) {
            }

            try {
                $table->dropIndex(['survey_scheduled_date']);
            } catch (\Exception $e) {
            }

            // Drop the new columns we added
            $table->dropColumn([
                'leasing_application_ref',
                'leasing_decision_date',
                'rejection_reason',
                'internal_notes',
                'dp_paid_date',
                'dp_payment_method',
                'dp_confirmed_by'
            ]);
        });
    }
};
