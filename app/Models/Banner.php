<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'button_text',
        'button_url',
        'status',
        'position',
        'published_at',
        'expired_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expired_at' => 'datetime',
        'status' => 'string',
    ];

    /**
     * Get active banners
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expired_at')
                    ->orWhere('expired_at', '>=', now());
            });
    }

    /**
     * Get banners ordered by position
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('position', 'asc');
    }

    /**
     * Get image URL
     */
    public function getImageAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        if (str_starts_with($this->image_path, 'storage/')) {
            return asset($this->image_path);
        }

        return asset($this->image_path);
    }

    /**
     * Delete image file when banner is deleted
     */
    protected static function booted()
    {
        static::deleting(function ($banner) {
            if ($banner->image_path) {
                if (str_starts_with($banner->image_path, 'storage/')) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete(
                        str_replace('storage/', '', $banner->image_path)
                    );
                } else {
                    if (file_exists(public_path($banner->image_path))) {
                        unlink(public_path($banner->image_path));
                    }
                }
            }
        });
    }
}
