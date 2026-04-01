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
        Schema::create('service_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Customer Info (if guest, or override default user info)
            $table->string('customer_name');
            $table->string('customer_phone');

            // Vehicle Info
            $table->string('motor_brand');
            $table->string('motor_type');
            $table->string('license_plate');

            // Service details
            $table->date('service_date');
            $table->time('service_time');
            $table->enum('service_type', ['Servis Berkala', 'Ganti Oli', 'Perbaikan Berat', 'Lainnya'])->default('Servis Berkala');
            $table->text('complaint_notes')->nullable();

            // Status Tracking
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->text('admin_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_appointments');
    }
};
