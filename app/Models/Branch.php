<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'address',
        'city',
        'phone',
        'phone_alt',
        'whatsapp',
        'maps_url',
        'latitude',
        'longitude',
        'operational_hours',
        'facilities',
        'can_service',
        'service_slot_quota',
        'is_main_branch',
        'is_active',
    ];

    protected $casts = [
        'operational_hours' => 'array',
        'facilities' => 'array',
        'can_service' => 'boolean',
        'is_main_branch' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'service_slot_quota' => 'integer',
    ];
}
