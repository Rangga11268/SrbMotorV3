<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Motor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'model',
        'price',
        'year',
        'type',
        'image_path',
        'details',
        'tersedia',
        'min_dp_amount',
        'colors',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'tersedia' => 'boolean',
        'min_dp_amount' => 'decimal:2',
        'colors' => 'array',
    ];

    public function getImageAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        return asset($this->image_path);
    }

    protected static function booted()
    {
        static::deleting(function ($motor) {
            if ($motor->image_path) {
                if (str_starts_with($motor->image_path, 'storage/')) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $motor->image_path));
                } else {
                    if (file_exists(public_path($motor->image_path))) {
                        unlink(public_path($motor->image_path));
                    }
                }
            }
        });
    }
}
