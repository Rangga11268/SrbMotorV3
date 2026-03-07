<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancingScheme extends Model
{
    use HasFactory;

    protected $fillable = [
        'motor_id',
        'provider_id',
        'tenor',
        'dp_amount',
        'monthly_installment',
    ];

    protected $casts = [
        'dp_amount' => 'decimal:2',
        'monthly_installment' => 'decimal:2',
    ];

    public function motor(): BelongsTo
    {
        return $this->belongsTo(Motor::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(LeasingProvider::class, 'provider_id');
    }
}
