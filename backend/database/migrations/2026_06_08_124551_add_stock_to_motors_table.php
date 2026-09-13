<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            if (!Schema::hasColumn('motors', 'stock')) {
                $table->integer('stock')->default(0)->after('tersedia')->comment('Kuantitas stok unit motor');
            }
        });

        // Data migration: Set initial stock based on tersedia column
        DB::table('motors')->where('tersedia', true)->update(['stock' => 1]);
        DB::table('motors')->where('tersedia', false)->update(['stock' => 0]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motors', function (Blueprint $table) {
            if (Schema::hasColumn('motors', 'stock')) {
                $table->dropColumn('stock');
            }
        });
    }
};
