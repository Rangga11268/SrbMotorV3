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
        'min_dp_amount',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'tersedia' => 'boolean',
        'min_dp_amount' => 'decimal:2',
    ];

    /**
     * Determine if the motor is available based on physical units.
     * This overrides the static database column if unit counts are loaded.
     */
    public function getTersediaAttribute($value)
    {
        // If the relation count is loaded, it is the source of truth
        if (array_key_exists('available_units_count', $this->getAttributes())) {
            return $this->available_units_count > 0;
        }
        
        // Fallback to static column if count not loaded
        return (bool) $value;
    }

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
     * Get the individual units available for this motor.
     */
    public function units()
    {
        return $this->hasMany(MotorUnit::class);
    }

    /**
     * Get units that are actually in stock and ready for sale.
     */
    public function availableUnits()
    {
        return $this->hasMany(MotorUnit::class)->where('status', 'available');
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
