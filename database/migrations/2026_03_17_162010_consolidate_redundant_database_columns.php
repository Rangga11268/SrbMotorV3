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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['no_ktp']);
        });

        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropColumn([
                'survey_scheduled_date',
                'survey_completed_at',
                'survey_notes',
                'dp_amount',
                'dp_paid_at',
                'dp_payment_method',
                'unit_prepared_at',
                'is_completed',
                'customer_confirms_survey',
                'customer_survey_confirmed_at',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_ktp')->nullable()->after('nik');
        });

        Schema::table('credit_details', function (Blueprint $table) {
            $table->date('survey_scheduled_date')->nullable();
            $table->timestamp('survey_completed_at')->nullable();
            $table->text('survey_notes')->nullable();
            $table->decimal('dp_amount', 15, 2)->nullable();
            $table->timestamp('dp_paid_at')->nullable();
            $table->string('dp_payment_method')->nullable();
            $table->timestamp('unit_prepared_at')->nullable();
            $table->boolean('customer_confirms_survey')->default(false);
            $table->timestamp('customer_survey_confirmed_at')->nullable();
            $table->boolean('is_completed')->default(false);
        });
    }
};
