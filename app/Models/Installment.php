<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    use HasFactory;
    protected $fillable = [
        'transaction_id',
        'installment_number',
        'amount',
        'penalty_amount',
        'due_date',
        'status',
        'paid_at',
        'payment_method',
        'payment_proof',
        'notes',
        'snap_token',
        'midtrans_booking_code',
        'reminder_sent',
        'reminder_sent_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
        'reminder_sent' => 'boolean',
        'amount' => 'decimal:2',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
