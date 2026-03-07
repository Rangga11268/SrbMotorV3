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
        // Add description to motors and remove details
        Schema::table('motors', function (Blueprint $table) {
            $table->longText('description')->nullable()->after('image_path');
            if (Schema::hasColumn('motors', 'details')) {
                $table->dropColumn('details');
            }
        });

        // Drop the old specifications table
        Schema::dropIfExists('motor_specifications');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('motor_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motor_id')->constrained('motors')->onDelete('cascade');
            $table->string('spec_key');
            $table->text('spec_value')->nullable();
            $table->timestamps();
            $table->index(['motor_id', 'spec_key']);
        });

        Schema::table('motors', function (Blueprint $table) {
            $table->text('details')->nullable();
            $table->dropColumn('description');
        });
    }
};
