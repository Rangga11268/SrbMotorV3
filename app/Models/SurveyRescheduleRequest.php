<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyRescheduleRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_schedule_id',
        'customer_id',
        'requested_date',
        'requested_time',
        'reason',
        'reason_notes',
        'status',
        'approved_at',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'requested_date' => 'date',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Get the survey schedule that owns this reschedule request.
     */
    public function surveySchedule(): BelongsTo
    {
        return $this->belongsTo(SurveySchedule::class);
    }

    /**
     * Get the customer who made this request.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Scope: Get pending reschedule requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Get approved reschedule requests.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Approve the reschedule request.
     */
    public function approve($newDate, $newTime)
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        // Update the survey schedule with new date/time
        $this->surveySchedule->update([
            'scheduled_date' => $newDate,
            'scheduled_time' => $newTime,
            'status' => 'pending', // Reset to pending for customer confirmation
        ]);

        return $this;
    }

    /**
     * Reject the reschedule request.
     */
    public function reject($reason = null)
    {
        $this->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $this;
    }
}
