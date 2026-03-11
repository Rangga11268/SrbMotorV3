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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('name')->nullable()->after('user_id');
            $table->string('nik')->nullable()->after('name');
            $table->string('occupation')->nullable()->after('city');
            $table->decimal('monthly_income', 15, 0)->nullable()->after('occupation');
            $table->string('employment_duration')->nullable()->after('monthly_income');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['name', 'nik', 'occupation', 'monthly_income', 'employment_duration']);
        });
    }
};
