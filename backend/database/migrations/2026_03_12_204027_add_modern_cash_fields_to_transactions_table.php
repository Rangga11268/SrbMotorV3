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
            if (!Schema::hasColumn('transactions', 'motor_color')) {
                $table->string('motor_color')->nullable()->after('motor_id');
            }
            if (!Schema::hasColumn('transactions', 'delivery_method')) {
                $table->string('delivery_method')->nullable()->after('city');
            }
            if (!Schema::hasColumn('transactions', 'frame_number')) {
                $table->string('frame_number')->nullable()->after('delivery_method');
            }
            if (!Schema::hasColumn('transactions', 'engine_number')) {
                $table->string('engine_number')->nullable()->after('frame_number');
            }
            if (!Schema::hasColumn('transactions', 'delivery_date')) {
                $table->date('delivery_date')->nullable()->after('engine_number');
            }
            if (!Schema::hasColumn('transactions', 'booking_fee')) {
                $table->decimal('booking_fee', 15, 0)->nullable()->default(0)->after('motor_price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $columns = [
                'motor_color',
                'delivery_method',
                'frame_number',
                'engine_number',
                'delivery_date',
                'booking_fee'
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('transactions', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
