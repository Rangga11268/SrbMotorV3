<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'credit_detail_id',
        'document_type',
        'file_path',
        'original_name',
        'approval_status',
        'rejection_reason',
        'reviewed_at',
    ];

    /**
     * Get the credit detail that owns the document.
     */
    public function creditDetail(): BelongsTo
    {
        return $this->belongsTo(CreditDetail::class);
    }

    /**
     * Delete the file when the document is deleted
     */
    protected static function booted()
    {
        static::deleting(function ($document) {
            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }
        });
    }

    /**
     * Mark document as approved
     */
    public function approve()
    {
        $this->update([
            'approval_status' => 'approved',
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);
    }

    /**
     * Mark document as rejected with reason
     */
    public function reject($reason)
    {
        $this->update([
            'approval_status' => 'rejected',
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Check if document is pending approval
     */
    public function isPending(): bool
    {
        return $this->approval_status === 'pending';
    }

    /**
     * Check if document is approved
     */
    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }

    /**
     * Check if document is rejected
     */
    public function isRejected(): bool
    {
        return $this->approval_status === 'rejected';
    }
}
