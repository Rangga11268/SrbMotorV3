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
        Schema::create('leasing_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_path')->nullable();
            $table->timestamps();
        });

        Schema::create('financing_schemes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('leasing_providers')->cascadeOnDelete();
            $table->integer('tenor');
            $table->decimal('dp_amount', 15, 2);
            $table->decimal('monthly_installment', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financing_schemes');
        Schema::dropIfExists('leasing_providers');
    }
};
