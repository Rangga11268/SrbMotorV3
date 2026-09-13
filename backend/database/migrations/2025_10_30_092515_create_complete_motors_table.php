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
        Schema::create('motors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand'); // Honda, Yamaha
            $table->string('model')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('year')->nullable();
            $table->string('type')->nullable(); // Metic, Automatic, Sport, etc.
            $table->string('image_path');
            $table->text('details')->nullable(); // brief details about the motor
            $table->boolean('tersedia')->default(true); // Default to true (available)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motors');
    }
};