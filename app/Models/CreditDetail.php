<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CreditDetail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaction_id',
        'down_payment',
        'tenor',
        'monthly_installment',
        'interest_rate',
        'credit_status',
        'approved_amount',
        'leasing_provider_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'down_payment' => 'decimal:2',
        'monthly_installment' => 'decimal:2',
        'approved_amount' => 'decimal:2',
    ];

    /**
     * Get the transaction that owns the credit detail.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the documents associated with the credit detail.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get the leasing provider for this credit application.
     */
    public function leasingProvider(): BelongsTo
    {
        return $this->belongsTo(LeasingProvider::class);
    }

    /**
     * Check if all required documents are uploaded
     */
    public function hasRequiredDocuments(): bool
    {
        $requiredTypes = ['KTP', 'KK', 'SLIP_GAJI'];
        $uploadedTypes = $this->documents->pluck('document_type')->toArray();

        foreach ($requiredTypes as $type) {
            if (!in_array($type, $uploadedTypes)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Cascade delete to documents when credit detail is deleted
     */
    protected static function booted()
    {
        static::deleting(function ($creditDetail) {
            // Delete all associated documents, which will trigger file deletion
            $creditDetail->documents()->delete();
        });
    }
    /**
     * Accessor to get the human-readable credit status text
     */
    public function getCreditStatusTextAttribute()
    {
        $statusMap = [
            'menunggu_persetujuan' => 'Menunggu Persetujuan',
            'data_tidak_valid' => 'Data Tidak Valid',
            'dikirim_ke_surveyor' => 'Dikirim ke Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
        ];

        return $statusMap[$this->credit_status] ?? $this->credit_status;
    }
}
