<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'category', 'description'];

    /**
     * Get a setting value by key
     */
    public static function get($key, $default = null)
    {
        $cacheKey = "setting_{$key}";

        return Cache::remember($cacheKey, 3600, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();

            if (!$setting) {
                return $default;
            }

            return self::castValue($setting->value, $setting->type);
        });
    }

    /**
     * Set a setting value by key
     */
    public static function set($key, $value, $type = 'string', $category = 'general', $description = null)
    {
        $setting = self::firstOrCreate(
            ['key' => $key],
            ['type' => $type, 'category' => $category, 'description' => $description]
        );

        $setting->update([
            'value' => is_array($value) || is_object($value) ? json_encode($value) : $value,
            'type' => $type,
        ]);

        // Clear cache
        Cache::forget("setting_{$key}");

        return $setting;
    }

    /**
     * Get all settings by category
     */
    public static function getByCategory($category)
    {
        return self::where('category', $category)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => self::castValue($setting->value, $setting->type)];
            })
            ->toArray();
    }

    /**
     * Cast value based on type
     */
    private static function castValue($value, $type)
    {
        switch ($type) {
            case 'boolean':
                return filter_var($value, FILTER_VALIDATE_BOOLEAN);
            case 'number':
                return is_numeric($value) ? (int) $value : $value;
            case 'json':
                return json_decode($value, true);
            case 'text':
            case 'string':
            default:
                return $value;
        }
    }

    /**
     * Clear all setting cache
     */
    public static function clearCache()
    {
        Cache::flush();
    }
}
