<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * CONSOLIDATED TRANSACTIONS TABLE - Final version with all fields
     * Consolidates multiple migrations: base + customer info + cancellation + details
     */
    public function up(): void
    {
        if (!Schema::hasTable('transactions')) {
            Schema::create('transactions', function (Blueprint $table) {
                // Base identification
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('reference_number')->unique()->comment('Transaction reference code');
                $table->string('transaction_type')->comment('CASH, CREDIT, TRADE-IN, etc');
                $table->string('status')->default('pending');

                // Motor Information
                $table->foreignId('motor_id')->constrained('motors')->onDelete('restrict');
                $table->decimal('motor_price', 15, 0)->comment('Motor selling price');

                // Customer Contact Information
                $table->string('phone')->nullable()->comment('Customer phone number');
                $table->text('address')->nullable()->comment('Customer delivery address');
                $table->string('city')->nullable();

                // Transaction Amounts
                $table->decimal('total_price', 15, 0);
                $table->decimal('discount_amount', 15, 0)->default(0);
                $table->decimal('final_price', 15, 0);

                // Payment Information
                $table->string('payment_method')->nullable()->comment('Bank transfer, cash, installment, etc');
                $table->string('payment_status')->default('pending')->comment('pending, completed, failed, refunded');
                $table->timestamp('payment_date')->nullable();
                $table->string('payment_proof')->nullable()->comment('Path to payment proof file');

                // Cancellation
                $table->boolean('is_cancelled')->default(false);
                $table->timestamp('cancelled_at')->nullable();
                $table->text('cancellation_reason')->nullable();

                // Additional Notes
                $table->text('notes')->nullable();
                $table->text('internal_notes')->nullable()->comment('For staff only');

                $table->timestamps();
                $table->softDeletes();

                // Indexes
                $table->index('user_id');
                $table->index('status');
                $table->index('transaction_type');
                $table->index('payment_status');
            });
        } else {
            // Add missing columns if table exists
            Schema::table('transactions', function (Blueprint $table) {
                if (!Schema::hasColumn('transactions', 'phone')) {
                    $table->string('phone')->nullable();
                }
                if (!Schema::hasColumn('transactions', 'address')) {
                    $table->text('address')->nullable();
                    $table->string('city')->nullable();
                }
                if (!Schema::hasColumn('transactions', 'is_cancelled')) {
                    $table->boolean('is_cancelled')->default(false);
                    $table->timestamp('cancelled_at')->nullable();
                    $table->text('cancellation_reason')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
