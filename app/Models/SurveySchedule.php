<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveySchedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'credit_detail_id',
        'scheduled_date',
        'scheduled_time',
        'location',
        'surveyor_name',
        'surveyor_phone',
        'status',
        'notes',
        'customer_confirmed_at',
        'customer_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'date',
        'scheduled_time' => 'datetime:H:i',
    ];

    /**
     * Get the credit detail that owns this survey schedule.
     */
    public function creditDetail(): BelongsTo
    {
        return $this->belongsTo(CreditDetail::class);
    }

    /**
     * Get the transaction through credit detail
     */
    public function getTransactionAttribute()
    {
        return $this->creditDetail?->transaction;
    }

    /**
     * Get the customer through transaction
     */
    public function getCustomerAttribute()
    {
        return $this->getTransactionAttribute()?->user;
    }

    /**
     * Check if survey is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if survey is confirmed
     */
    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    /**
     * Check if survey is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Mark survey as confirmed
     */
    public function confirm()
    {
        $this->status = 'confirmed';
        $this->save();
    }

    /**
     * Mark survey as completed
     */
    public function complete()
    {
        $this->status = 'completed';
        $this->creditDetail->credit_status = 'survey_selesai';
        $this->creditDetail->save();
        $this->status = 'completed';
        $this->save();
    }

    /**
     * Cancel survey
     */
    public function cancel()
    {
        $this->status = 'cancelled';
        $this->save();
    }
}
