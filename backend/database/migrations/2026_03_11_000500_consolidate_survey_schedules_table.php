<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * CONSOLIDATED SURVEY SCHEDULES TABLE
     */
    public function up(): void
    {
        if (!Schema::hasTable('survey_schedules')) {
            Schema::create('survey_schedules', function (Blueprint $table) {
                $table->id();
                $table->foreignId('credit_detail_id')->constrained('credit_details')->onDelete('cascade');

                $table->dateTime('scheduled_date')->comment('When survey is scheduled');
                $table->string('status')->default('scheduled')->comment('scheduled, completed, rescheduled, cancelled');
                $table->string('location')->nullable();
                $table->text('notes')->nullable();

                // Customer Confirmation
                $table->boolean('customer_confirms')->default(false);
                $table->timestamp('customer_confirmed_at')->nullable();
                $table->text('customer_confirmation_notes')->nullable();

                // Survey Result
                $table->timestamp('completed_at')->nullable();
                $table->text('survey_result')->nullable();
                $table->text('findings')->nullable();

                $table->timestamps();
                $table->softDeletes();

                $table->index('credit_detail_id');
                $table->index('status');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_schedules');
    }
};
