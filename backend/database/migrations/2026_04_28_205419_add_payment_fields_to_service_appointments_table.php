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
            $table->decimal('total_cost', 15, 2)->nullable()->after('status')
                  ->comment('Total biaya jasa dan sparepart');
                  
            $table->enum('payment_status', ['unpaid', 'pending', 'paid', 'waived'])->default('unpaid')->after('total_cost')
                  ->comment('Status pelunasan tagihan');
                  
            $table->string('payment_method')->nullable()->after('payment_status')
                  ->comment('Metode pembayaran: midtrans, cash, KPB, dll');
                  
            $table->string('snap_token')->nullable()->after('payment_method')
                  ->comment('Token Midtrans jika bayar online');
                  
            $table->timestamp('paid_at')->nullable()->after('snap_token')
                  ->comment('Waktu pelunasan tagihan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_appointments', function (Blueprint $table) {
            $table->dropColumn([
                'total_cost', 
                'payment_status', 
                'payment_method',
                'snap_token',
                'paid_at'
            ]);
        });
    }
};
