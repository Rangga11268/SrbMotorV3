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
        Schema::create('motor_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motor_id')->constrained()->onDelete('cascade');
            $table->string('frame_number')->unique();
            $table->string('engine_number')->unique();
            $table->string('color')->nullable();
            $table->string('status')->default('available'); // available, booked, sold, maintenance
            $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('set null');
            $table->date('arrival_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes for faster lookups
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motor_units');
    }
};
