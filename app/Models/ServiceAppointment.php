<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceAppointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'branch',
        'customer_name',
        'customer_phone',
        'plate_number',
        'queue_number',
        'motor_model',
        'service_date',
        'service_time',
        'service_type',
        'complaint_notes',
        'status',
        'admin_notes',
        'service_notes',
        'cancelled_by',
        'cancel_reason',
    ];

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
