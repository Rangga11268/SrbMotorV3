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
            if (!Schema::hasColumn('survey_schedules', 'scheduled_time')) {
                $table->time('scheduled_time')->nullable()->after('scheduled_date');
            }
            if (!Schema::hasColumn('survey_schedules', 'surveyor_name')) {
                $table->string('surveyor_name')->nullable()->after('scheduled_time');
            }
            if (!Schema::hasColumn('survey_schedules', 'surveyor_phone')) {
                $table->string('surveyor_phone')->nullable()->after('surveyor_name');
            }
            if (!Schema::hasColumn('survey_schedules', 'customer_notes')) {
                $table->text('customer_notes')->nullable()->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('survey_schedules', function (Blueprint $table) {
            $table->dropColumn(['scheduled_time', 'surveyor_name', 'surveyor_phone', 'customer_notes']);
        });
    }
};
