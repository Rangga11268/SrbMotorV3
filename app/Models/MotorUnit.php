<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MotorUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'motor_id',
        'frame_number',
        'engine_number',
        'color',
        'status',
        'transaction_id',
        'arrival_date',
        'notes',
    ];

    /**
     * Relationships that should be touched on save.
     */
    protected $touches = ['motor'];

    /**
     * Get the motor definition that this unit belongs to.
     */
    public function motor(): BelongsTo
    {
        return $this->belongsTo(Motor::class);
    }

    /**
     * Get the transaction currently associated with this unit.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
