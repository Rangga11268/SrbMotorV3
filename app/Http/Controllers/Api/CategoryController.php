<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Motor;

class CategoryController extends Controller
{
    /**
     * Return unique motor types as categories for filtering.
     * Matches web version behavior (uses motor.type field, no separate table).
     */
    public function index()
    {
        $types = Motor::where('tersedia', true)
            ->pluck('type')
            ->unique()
            ->filter()
            ->values()
            ->map(function ($type, $index) {
                return [
                    'id' => $index + 1,
                    'name' => $type,
                    'slug' => strtolower(str_replace(' ', '-', $type)),
                ];
            });

        return response()->json($types);
    }
}
