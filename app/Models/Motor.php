<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Motor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
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
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'tersedia' => 'boolean',
    ];

    /**
     * Get the active promotions for the motor.
     */
    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'motor_promotion')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('valid_until')
                    ->orWhere('valid_until', '>=', now());
            });
    }

    /**
     * Get the financing schemes for the motor.
     */
    public function financingSchemes()
    {
        return $this->hasMany(FinancingScheme::class);
    }

    /**
     * Get the full image URL
     */
    public function getImageAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        // If it's already a full URL (http/https), return as is
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        // If it starts with 'storage/', it's a public disk file
        if (str_starts_with($this->image_path, 'storage/')) {
            return asset($this->image_path);
        }

        // Otherwise, assume it's in the public directory
        return asset($this->image_path);
    }

    /**
     * Delete the image file when the motor is deleted
     */
    protected static function booted()
    {
        static::deleting(function ($motor) {
            // Delete the motor's image if it exists using the storage system
            if ($motor->image_path) {
                if (str_starts_with($motor->image_path, 'storage/')) {
                    // If the path starts with 'storage/', it's a public disk file
                    Storage::disk('public')->delete(str_replace('storage/', '', $motor->image_path));
                } else {
                    // Otherwise check if it's a public path
                    if (file_exists(public_path($motor->image_path))) {
                        unlink(public_path($motor->image_path));
                    }
                }
            }

            // Delete associated promotions
            $motor->promotions()->detach();
        });
    }
}
