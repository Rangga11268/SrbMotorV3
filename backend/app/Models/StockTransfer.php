<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'motor_id',
        'from_branch',
        'to_branch',
        'quantity',
        'transferred_by',
        'notes',
    ];

    public function motor(): BelongsTo
    {
        return $this->belongsTo(Motor::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'transferred_by');
    }
}
