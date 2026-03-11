<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * CONSOLIDATED INSTALLMENTS TABLE - Final version with all fields
     * Consolidates: base table + snap_token + penalty_amount + reminder
     */
    public function up(): void
    {
        if (!Schema::hasTable('installments')) {
            Schema::create('installments', function (Blueprint $table) {
                // Relationships
                $table->id();
                $table->foreignId('credit_detail_id')->constrained('credit_details')->onDelete('cascade');

                // Installment Details
                $table->integer('installment_number')->comment('1st, 2nd, 3rd... installment');
                $table->date('due_date')->comment('When payment is due');
                $table->decimal('amount', 15, 0)->comment('Monthly installment amount');
                $table->string('status')->default('belum_dibayar')->comment('belum_dibayar, dibayar, overdue, tertangguh');

                // Payment Information
                $table->timestamp('paid_date')->nullable();
                $table->string('payment_method')->nullable()->comment('Bank transfer, online, cash, etc');
                $table->text('payment_proof')->nullable()->comment('Path to payment proof file');
                $table->string('snap_token')->nullable()->comment('Midtrans Snap payment token');

                // Late Payment & Penalties
                $table->boolean('is_overdue')->default(false);
                $table->integer('days_overdue')->default(0);
                $table->decimal('penalty_amount', 15, 0)->default(0)->comment('Late payment penalty');
                $table->decimal('total_with_penalty', 15, 0)->nullable();

                // Reminders
                $table->boolean('reminder_sent')->default(false)->comment('Whether reminder notification sent');
                $table->timestamp('reminder_sent_at')->nullable();

                // Notes
                $table->text('notes')->nullable();

                $table->timestamps();
                $table->softDeletes();

                // Indexes
                $table->index('credit_detail_id');
                $table->index('status');
                $table->index('due_date');
            });
        } else {
            // Add missing columns if table exists
            Schema::table('installments', function (Blueprint $table) {
                if (!Schema::hasColumn('installments', 'snap_token')) {
                    $table->string('snap_token')->nullable();
                }
                if (!Schema::hasColumn('installments', 'penalty_amount')) {
                    $table->decimal('penalty_amount', 15, 0)->default(0);
                }
                if (!Schema::hasColumn('installments', 'reminder_sent')) {
                    $table->boolean('reminder_sent')->default(false);
                    $table->timestamp('reminder_sent_at')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('installments');
    }
};
