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

    // Appended computed attributes — 'image' returns the full URL for the motor image
    protected $appends = ['image'];

    public function getImageAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        // Already a full URL
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        // Storage-disk path (e.g. motors/xxx.png) — use Storage::url()
        if (str_starts_with($this->image_path, 'motors/') || str_starts_with($this->image_path, 'images/')) {
            return Storage::disk('public')->url($this->image_path);
        }

        // Legacy assets path (e.g. assets/img/yamaha/aerox_155.png)
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
