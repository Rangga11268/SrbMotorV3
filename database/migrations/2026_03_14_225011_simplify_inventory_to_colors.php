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
        // 1. Drop motor_unit_id from transactions if it exists
        if (Schema::hasColumn('transactions', 'motor_unit_id')) {
            Schema::table('transactions', function (Blueprint $table) {
                // Determine if foreign key constraint exists and drop it before dropping column (best effort)
                // DB::statement('ALTER TABLE transactions DROP FOREIGN KEY ...');
                // The safest way on SQLite/MySQL is just to drop the column, Laravel handles it mostly.
                // However, if strict foreign keys, need to drop constraint.
                $table->dropForeign(['motor_unit_id']);
                $table->dropColumn('motor_unit_id');
            });
        }

        // 2. Add color to transactions
        if (!Schema::hasColumn('transactions', 'color')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->string('color')->nullable()->after('payment_method');
            });
        }

        // 3. Drop motor_units table
        Schema::dropIfExists('motor_units');

        // 4. Add colors JSON to motors table
        if (!Schema::hasColumn('motors', 'colors')) {
            Schema::table('motors', function (Blueprint $table) {
                $table->json('colors')->nullable()->after('min_dp_amount');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove colors from motors
        if (Schema::hasColumn('motors', 'colors')) {
            Schema::table('motors', function (Blueprint $table) {
                $table->dropColumn('colors');
            });
        }

        // Recreate motor_units table
        Schema::create('motor_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motor_id')->constrained()->cascadeOnDelete();
            $table->string('frame_number')->unique();
            $table->string('engine_number')->unique();
            $table->string('color')->nullable();
            $table->string('status')->default('available'); // available, booked, sold, maintenance
            $table->date('arrival_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Remove color from transactions
        if (Schema::hasColumn('transactions', 'color')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropColumn('color');
            });
        }

        // Add motor_unit_id back to transactions
        if (!Schema::hasColumn('transactions', 'motor_unit_id')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->foreignId('motor_unit_id')->nullable()->after('motor_id')->constrained('motor_units')->nullOnDelete();
            });
        }
    }
};
