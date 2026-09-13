<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Motor;
use Illuminate\Http\Request;

class MotorController extends Controller
{
    public function index(Request $request)
    {
        $query = Motor::query();

        if ($request->has('category')) {
            $query->where('type', $request->category);
        }

        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $motors = $query->get();

        return response()->json($motors);
    }

    public function brands()
    {
        $brands = Motor::distinct()->pluck('brand')->filter()->values();
        return response()->json($brands);
    }

    public function show($id)
    {
        $motor = Motor::findOrFail($id);
        return response()->json($motor);
    }
}
