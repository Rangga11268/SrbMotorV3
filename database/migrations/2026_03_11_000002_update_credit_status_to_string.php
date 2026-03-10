<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            // Change enum to varchar to allow flexible values
            $table->string('credit_status')->change();
        });

        // Map old statuses to new workflow statuses
        DB::table('credit_details')
            ->where('credit_status', 'menunggu_persetujuan')
            ->update(['credit_status' => 'pengajuan_masuk']);

        DB::table('credit_details')
            ->where('credit_status', 'dikirim_ke_surveyor')
            ->update(['credit_status' => 'survey_dijadwalkan']);

        DB::table('credit_details')
            ->where('credit_status', 'data_tidak_valid')
            ->update(['credit_status' => 'pengajuan_masuk']);

        DB::table('credit_details')
            ->where('credit_status', 'jadwal_survey')
            ->update(['credit_status' => 'survey_dijadwalkan']);
    }

    public function down(): void
    {
        // Not reversible - just remove the migration if needed
    }
};
