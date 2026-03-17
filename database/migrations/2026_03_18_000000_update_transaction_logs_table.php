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
        Schema::table('transaction_logs', function (Blueprint $table) {
            $table->string('status_from')->nullable()->after('transaction_id');
            $table->string('status_to')->nullable()->after('status_from');
            $table->unsignedBigInteger('actor_id')->nullable()->after('status_to');
            $table->string('actor_type')->nullable()->after('actor_id');
            $table->text('notes')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_logs', function (Blueprint $table) {
            $table->dropColumn(['status_from', 'status_to', 'actor_id', 'actor_type', 'notes']);
        });
    }
};
