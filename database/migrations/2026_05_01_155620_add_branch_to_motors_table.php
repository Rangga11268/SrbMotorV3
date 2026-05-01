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
        Schema::table('motors', function (Blueprint $table) {
            if (!Schema::hasColumn('motors', 'branch')) {
                $table->string('branch')->nullable()->after('tersedia')->comment('Branch code where the motor is located');
                $table->index('branch');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            if (Schema::hasColumn('motors', 'branch')) {
                $table->dropIndex(['branch']);
                $table->dropColumn('branch');
            }
        });
    }
};
