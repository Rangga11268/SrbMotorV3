<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * CONSOLIDATED CREDIT DETAILS TABLE - Final version with all fields
     * Consolidates multiple migrations into single clean structure
     */
    public function up(): void
    {
        if (!Schema::hasTable('credit_details')) {
            Schema::create('credit_details', function (Blueprint $table) {
                // Relationships
                $table->id();
                $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
                $table->foreignId('leasing_provider_id')->nullable()->constrained('leasing_providers')->onDelete('set null');

                // Status & Key Info
                $table->string('status')->default('pengajuan_masuk');
                $table->string('reference_number')->unique()->comment('Leasing provider reference');
                $table->integer('tenor')->comment('Loan tenure in months');
                $table->decimal('interest_rate', 5, 2)->nullable()->comment('Annual interest rate %');
                $table->decimal('monthly_installment', 15, 0)->nullable();
                $table->decimal('total_interest', 15, 0)->nullable();

                // Document Verification
                $table->text('verification_notes')->nullable();
                $table->timestamp('verified_at')->nullable();

                // Survey & Inspection
                $table->date('survey_scheduled_date')->nullable()->comment('When survey is scheduled');
                $table->timestamp('survey_completed_at')->nullable();
                $table->text('survey_notes')->nullable();

                // DP (Down Payment) Status
                $table->decimal('dp_amount', 15, 0)->nullable()->comment('Down payment amount required');
                $table->timestamp('dp_paid_at')->nullable();
                $table->string('dp_payment_method')->nullable();

                // Unit/Delivery
                $table->timestamp('unit_prepared_at')->nullable();
                $table->timestamp('ready_for_delivery_at')->nullable();
                $table->timestamp('delivered_at')->nullable();

                // Completion
                $table->timestamp('completed_at')->nullable();
                $table->text('completion_notes')->nullable();
                $table->boolean('is_completed')->default(false);

                // Customer Confirmation
                $table->boolean('customer_confirms_survey')->nullable();
                $table->timestamp('customer_survey_confirmed_at')->nullable();

                $table->timestamps();
                $table->softDeletes();

                // Indexes
                $table->index('transaction_id');
                $table->index('status');
                $table->index('leasing_provider_id');
            });
        } else {
            // Add missing columns to existing table
            Schema::table('credit_details', function (Blueprint $table) {
                if (!Schema::hasColumn('credit_details', 'leasing_provider_id')) {
                    $table->foreignId('leasing_provider_id')->nullable()->constrained('leasing_providers')->onDelete('set null')->after('transaction_id');
                }
                if (!Schema::hasColumn('credit_details', 'interest_rate')) {
                    $table->decimal('interest_rate', 5, 2)->nullable()->after('tenor');
                }
                if (!Schema::hasColumn('credit_details', 'total_interest')) {
                    $table->decimal('total_interest', 15, 0)->nullable()->after('interest_rate');
                }
                if (!Schema::hasColumn('credit_details', 'survey_scheduled_date')) {
                    $table->date('survey_scheduled_date')->nullable()->after('verified_at');
                }
                if (!Schema::hasColumn('credit_details', 'survey_completed_at')) {
                    $table->timestamp('survey_completed_at')->nullable()->after('survey_scheduled_date');
                }
                if (!Schema::hasColumn('credit_details', 'survey_notes')) {
                    $table->text('survey_notes')->nullable()->after('survey_completed_at');
                }
                if (!Schema::hasColumn('credit_details', 'dp_amount')) {
                    $table->decimal('dp_amount', 15, 0)->nullable()->after('survey_notes');
                }
                if (!Schema::hasColumn('credit_details', 'dp_paid_at')) {
                    $table->timestamp('dp_paid_at')->nullable()->after('dp_amount');
                }
                if (!Schema::hasColumn('credit_details', 'dp_payment_method')) {
                    $table->string('dp_payment_method')->nullable()->after('dp_paid_at');
                }
                if (!Schema::hasColumn('credit_details', 'unit_prepared_at')) {
                    $table->timestamp('unit_prepared_at')->nullable()->after('dp_payment_method');
                }
                if (!Schema::hasColumn('credit_details', 'is_completed')) {
                    $table->boolean('is_completed')->default(false)->after('completion_notes');
                }
                if (!Schema::hasColumn('credit_details', 'customer_confirms_survey')) {
                    $table->boolean('customer_confirms_survey')->nullable();
                    $table->timestamp('customer_survey_confirmed_at')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_details');
    }
};
