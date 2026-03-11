<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreditDetail extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaction_id',
        'leasing_provider_id',
        'status',
        'reference_number',
        'tenor',
        'interest_rate',
        'monthly_installment',
        'total_interest',
        'verification_notes',
        'verified_at',
        'survey_scheduled_date',
        'survey_completed_at',
        'survey_notes',
        'dp_amount',
        'dp_paid_at',
        'dp_payment_method',
        'unit_prepared_at',
        'ready_for_delivery_at',
        'delivered_at',
        'completed_at',
        'completion_notes',
        'is_completed',
        'customer_confirms_survey',
        'customer_survey_confirmed_at',
    ];

    /**
     * The attributes that should be appends to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'down_payment'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'interest_rate' => 'decimal:2',
        'monthly_installment' => 'decimal:2',
        'total_interest' => 'decimal:2',
        'verified_at' => 'datetime',
        'survey_scheduled_date' => 'date',
        'survey_completed_at' => 'datetime',
        'dp_amount' => 'decimal:2',
        'dp_paid_at' => 'datetime',
        'unit_prepared_at' => 'datetime',
        'ready_for_delivery_at' => 'datetime',
        'delivered_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_completed' => 'boolean',
        'customer_confirms_survey' => 'boolean',
        'customer_survey_confirmed_at' => 'datetime',
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
     * Get the admin user who confirmed DP payment.
     */
    public function dPConfirmedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dp_confirmed_by');
    }

    /**
     * Get the survey schedules associated with this credit detail.
     */
    public function surveySchedules(): HasMany
    {
        return $this->hasMany(SurveySchedule::class);
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
            'pengajuan_masuk' => 'Pengajuan Masuk',
            'menunggu_persetujuan' => 'Menunggu Persetujuan',
            'data_tidak_valid' => 'Data Tidak Valid',
            'dikirim_ke_surveyor' => 'Dikirim ke Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Backward compatibility accessor for old frontend field name
     */
    public function getDownPaymentAttribute()
    {
        return $this->dp_amount;
    }
}
