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
        Schema::table('service_appointments', function (Blueprint $table) {
            $table->dropColumn(['motor_brand', 'motor_type', 'license_plate', 'current_km', 'estimated_cost']);
            $table->string('motor_model')->nullable()->after('customer_phone');
            $table->text('service_notes')->nullable()->after('admin_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_appointments', function (Blueprint $table) {
            $table->string('motor_brand')->after('customer_phone');
            $table->string('motor_type')->after('motor_brand');
            $table->string('license_plate')->after('motor_type');
            $table->integer('current_km')->after('license_plate');
            $table->decimal('estimated_cost', 15, 2)->nullable()->after('complaint_notes');
            $table->dropColumn(['motor_model', 'service_notes']);
        });
    }
};
