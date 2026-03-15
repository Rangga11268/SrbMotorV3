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
        Schema::dropIfExists('motor_promotion');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('banners');
        Schema::dropIfExists('contact_messages');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // One-way drop
    }
};
