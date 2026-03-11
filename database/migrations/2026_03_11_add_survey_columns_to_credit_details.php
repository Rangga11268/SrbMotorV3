<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            // Add survey scheduling columns if not exist
            if (!Schema::hasColumn('credit_details', 'survey_scheduled_date')) {
                $table->date('survey_scheduled_date')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'survey_scheduled_time')) {
                $table->time('survey_scheduled_time')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'surveyor_name')) {
                $table->string('surveyor_name')->nullable();
            }
            if (!Schema::hasColumn('credit_details', 'surveyor_phone')) {
                $table->string('surveyor_phone')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropColumnIfExists('survey_scheduled_date');
            $table->dropColumnIfExists('survey_scheduled_time');
            $table->dropColumnIfExists('surveyor_name');
            $table->dropColumnIfExists('surveyor_phone');
        });
    }
};
