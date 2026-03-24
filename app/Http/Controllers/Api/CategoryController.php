<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Motor;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('order')
            ->get();

        // If no categories in DB, fallback to unique motor types
        if ($categories->isEmpty()) {
            $types = Motor::where('tersedia', true)
                ->pluck('type')
                ->unique()
                ->filter()
                ->values();

            $categories = $types->map(function ($type, $index) {
                return [
                    'id' => $index + 1,
                    'name' => $type,
                    'slug' => strtolower($type),
                    'icon' => $this->getIconForType($type),
                ];
            });
        }

        return response()->json($categories);
    }

    private function getIconForType($type)
    {
        $map = [
            'Scooter' => 'motorcycle',
            'Sport' => 'speed',
            'CUB' => 'pedal_bike',
            'EV' => 'electric_bolt',
            'Automatic' => 'settings_input_component',
        ];

        return $map[$type] ?? 'motorcycle';
    }
}
