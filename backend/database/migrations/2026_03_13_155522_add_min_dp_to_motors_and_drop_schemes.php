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
        // 1. Add min_dp_amount to motors table
        Schema::table('motors', function (Blueprint $table) {
            $table->decimal('min_dp_amount', 15, 0)->default(0)->after('price')->comment('Minimum Down Payment for this motor');
        });

        // 2. Drop financing_schemes table
        Schema::dropIfExists('financing_schemes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            $table->dropColumn('min_dp_amount');
        });

        // Re-create financing_schemes if necessary (optional, but good for rollback)
        if (!Schema::hasTable('financing_schemes')) {
            Schema::create('financing_schemes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('motor_id')->constrained('motors')->onDelete('cascade');
                $table->foreignId('provider_id')->constrained('leasing_providers')->onDelete('cascade');
                $table->integer('tenor');
                $table->decimal('dp_amount', 15, 0);
                $table->decimal('monthly_installment', 15, 0);
                $table->timestamps();
            });
        }
    }
};
