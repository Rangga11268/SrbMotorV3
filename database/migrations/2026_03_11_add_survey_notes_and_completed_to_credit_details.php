<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            // Add survey completion columns if not exist
            if (!Schema::hasColumn('credit_details', 'survey_notes')) {
                $table->text('survey_notes')->nullable()->after('surveyor_phone');
            }
            if (!Schema::hasColumn('credit_details', 'survey_completed_at')) {
                $table->timestamp('survey_completed_at')->nullable()->after('survey_notes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropColumnIfExists('survey_notes');
            $table->dropColumnIfExists('survey_completed_at');
        });
    }
};
