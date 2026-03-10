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
        Schema::table('survey_schedules', function (Blueprint $table) {
            $table->timestamp('customer_confirmed_at')->nullable()->after('status');
            $table->text('customer_notes')->nullable()->after('customer_confirmed_at');
            $table->timestamp('reschedule_requested_at')->nullable()->after('customer_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('survey_schedules', function (Blueprint $table) {
            $table->dropColumn(['customer_confirmed_at', 'customer_notes', 'reschedule_requested_at']);
        });
    }
};