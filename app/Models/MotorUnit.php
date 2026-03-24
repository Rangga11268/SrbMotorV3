<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotorUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'motor_id',
        'color',
        'chassis_number',
        'engine_number',
        'status', // available, sold, booked
    ];

    public function motor()
    {
        return $this->belongsTo(Motor::class);
    }
}
