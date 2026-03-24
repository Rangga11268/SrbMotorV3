<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Motor;
use Illuminate\Http\Request;

class MotorController extends Controller
{
    public function index(Request $request)
    {
        $query = Motor::query()->where('tersedia', true);

        if ($request->has('category')) {
            $query->where('type', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $motors = $query->with('promotions')->get();

        return response()->json($motors);
    }

    public function show($id)
    {
        $motor = Motor::with('promotions')->findOrFail($id);
        return response()->json($motor);
    }
}
