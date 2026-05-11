<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceAppointment extends Model
{
    use HasFactory;
    
    protected $appends = ['items'];

    protected $casts = [

        'service_date' => 'date',
        'total_cost' => 'decimal:2',
        'paid_at' => 'datetime',
        'service_notes' => 'string',
    ];


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
        'total_cost',
        'payment_status',
        'payment_method',
        'snap_token',
        'paid_at',
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

    /**
     * Get items from service_notes if it's JSON
     */
    public function getItemsAttribute()
    {
        $data = json_decode($this->service_notes, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            return $data;
        }
        
        // Fallback for plain text or empty
        if (!$this->service_notes) return [];
        
        return [
            ['description' => $this->service_notes, 'price' => (float)$this->total_cost, 'qty' => 1]
        ];
    }

}
