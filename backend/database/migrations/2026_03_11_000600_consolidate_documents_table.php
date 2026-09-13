<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * CONSOLIDATED DOCUMENTS TABLE
     */
    public function up(): void
    {
        if (!Schema::hasTable('documents')) {
            Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->foreignId('credit_detail_id')->constrained('credit_details')->onDelete('cascade');

                // Document Type
                $table->string('document_type')->comment('KTP, BPKB, STNK, Slip Gaji, Bukti Domisili, etc');
                $table->string('description')->nullable();

                // File Information
                $table->string('file_path')->comment('Path to stored file');
                $table->string('original_name')->nullable();
                $table->string('file_size')->nullable();

                // Status & Approval
                $table->string('status')->default('pending')->comment('pending, approved, rejected');
                $table->string('approval_status')->default('pending')->comment('pending, approved, rejected');
                $table->text('rejection_reason')->nullable();
                $table->timestamp('reviewed_at')->nullable();

                // Submission
                $table->timestamp('submitted_at')->nullable();

                $table->timestamps();
                $table->softDeletes();

                $table->index('credit_detail_id');
                $table->index('status');
                $table->index('approval_status');
            });
        } else {
            // Add missing columns if table exists
            Schema::table('documents', function (Blueprint $table) {
                if (!Schema::hasColumn('documents', 'original_name')) {
                    $table->string('original_name')->nullable()->after('file_path');
                }
                if (!Schema::hasColumn('documents', 'approval_status')) {
                    $table->string('approval_status')->default('pending');
                }
                if (!Schema::hasColumn('documents', 'rejection_reason')) {
                    $table->text('rejection_reason')->nullable();
                }
                if (!Schema::hasColumn('documents', 'reviewed_at')) {
                    $table->timestamp('reviewed_at')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
