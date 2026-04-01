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
        // 1. Drop foreign key and change column type in credit_details
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropForeign(['leasing_provider_id']);
            $table->string('leasing_provider')->nullable()->after('leasing_provider_id');
        });

        // Copy over any existing ids to name if needed (optional)
        \DB::statement("UPDATE credit_details c JOIN leasing_providers l ON c.leasing_provider_id = l.id SET c.leasing_provider = l.name");

        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropColumn('leasing_provider_id');
        });

        // 2. Drop the tables
        Schema::dropIfExists('financing_schemes');
        Schema::dropIfExists('leasing_providers');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
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

        Schema::table('credit_details', function (Blueprint $table) {
            $table->unsignedBigInteger('leasing_provider_id')->nullable();
            $table->dropColumn('leasing_provider');
            
            $table->foreign('leasing_provider_id')->references('id')->on('leasing_providers')->onDelete('cascade');
        });
    }
};
