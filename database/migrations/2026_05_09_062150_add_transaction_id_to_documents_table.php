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
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('transaction_id')->nullable()->after('id')->constrained('transactions')->onDelete('cascade');
            $table->unsignedBigInteger('credit_detail_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']);
            $table->dropColumn('transaction_id');
            $table->unsignedBigInteger('credit_detail_id')->nullable(false)->change();
        });
    }
};
