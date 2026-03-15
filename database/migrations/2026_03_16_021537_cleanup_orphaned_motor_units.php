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
            if (Schema::hasColumn('transactions', 'motor_unit_id')) {
                $table->dropConstrainedForeignId('motor_unit_id');
            }
        });

        Schema::dropIfExists('motor_units');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to reverse this as data in motor_units would be lost,
        // and its importance has been superseded by the color-based system.
        Schema::create('motor_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motor_id')->constrained()->onDelete('cascade');
            $table->string('frame_number')->unique();
            $table->string('engine_number')->unique();
            $table->string('color')->nullable();
            $table->string('status')->default('available');
            $table->timestamps();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('motor_unit_id')->nullable()->constrained('motor_units')->onDelete('set null');
        });
    }
};
