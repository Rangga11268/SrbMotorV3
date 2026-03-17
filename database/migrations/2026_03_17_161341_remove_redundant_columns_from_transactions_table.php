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
            $table->dropColumn([
                'color',
                'city',
                'payment_status',
                'is_cancelled',
                'internal_notes',
                'frame_number',
                'engine_number'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('color')->nullable();
            $table->string('city')->nullable();
            $table->string('payment_status')->nullable();
            $table->boolean('is_cancelled')->default(false);
            $table->text('internal_notes')->nullable();
            $table->string('frame_number')->nullable();
            $table->string('engine_number')->nullable();
        });
    }
};
