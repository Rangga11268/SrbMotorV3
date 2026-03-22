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
        // 1. Remove from users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'no_hp_backup',
                'nama_ibu_kandung',
                'jenis_kelamin',
                'tanggal_lahir'
            ]);
        });

        // 2. Remove from transactions
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'payment_proof',
                'payment_date',
                'discount_amount'
            ]);
        });

        // 3. Remove from credit_details
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropColumn([
                'unit_prepared_at',
                'ready_for_delivery_at',
                'delivered_at',
                'total_interest'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_hp_backup')->nullable();
            $table->string('nama_ibu_kandung')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->date('tanggal_lahir')->nullable();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->text('payment_proof')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->decimal('discount_amount', 15, 0)->nullable()->default(0);
        });

        Schema::table('credit_details', function (Blueprint $table) {
            $table->timestamp('unit_prepared_at')->nullable();
            $table->timestamp('ready_for_delivery_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->decimal('total_interest', 15, 0)->nullable();
        });
    }
};
