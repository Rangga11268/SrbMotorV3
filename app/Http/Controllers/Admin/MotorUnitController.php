<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motor;
use App\Models\MotorUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MotorUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $motorId = $request->query('motor_id');

        $query = MotorUnit::with(['motor', 'transaction']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('frame_number', 'like', "%{$search}%")
                    ->orWhere('engine_number', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($motorId) {
            $query->where('motor_id', $motorId);
        }

        $units = $query->latest()->paginate(15)->withQueryString();
        $motors = Motor::all(['id', 'name']);

        return Inertia::render('Admin/MotorUnits/Index', [
            'units' => $units,
            'motors' => $motors,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'motor_id' => $motorId,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'frame_number' => 'required|string|unique:motor_units,frame_number',
            'engine_number' => 'required|string|unique:motor_units,engine_number',
            'color' => 'nullable|string|max:100',
            'status' => 'required|string|in:available,booked,sold,maintenance',
            'arrival_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        MotorUnit::create($validated);

        return back()->with('success', 'Unit motor berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MotorUnit $motorUnit)
    {
        $validated = $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'frame_number' => 'required|string|unique:motor_units,frame_number,' . $motorUnit->id,
            'engine_number' => 'required|string|unique:motor_units,engine_number,' . $motorUnit->id,
            'color' => 'nullable|string|max:100',
            'status' => 'required|string|in:available,booked,sold,maintenance',
            'arrival_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $motorUnit->update($validated);

        return back()->with('success', 'Unit motor berhasil diperbarui');
    }

    /**
     * Store multiple units at once.
     */
    public function batchStore(Request $request)
    {
        $validated = $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'quantity' => 'required|integer|min:1|max:100',
            'status' => 'required|string|in:available,booked,sold,maintenance',
            'color' => 'nullable|string|max:100',
            'arrival_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            for ($i = 0; $i < $validated['quantity']; $i++) {
                MotorUnit::create([
                    'motor_id' => $validated['motor_id'],
                    'frame_number' => 'AUTO-F-' . strtoupper(bin2hex(random_bytes(4))),
                    'engine_number' => 'AUTO-E-' . strtoupper(bin2hex(random_bytes(4))),
                    'color' => $validated['color'],
                    'status' => $validated['status'],
                    'arrival_date' => $validated['arrival_date'],
                    'notes' => $validated['notes'] ? $validated['notes'] . " (Batch entry #" . ($i + 1) . ")" : "Batch entry #" . ($i + 1),
                ]);
            }
        });

        return back()->with('success', $validated['quantity'] . ' Unit motor berhasil ditambahkan secara massal');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MotorUnit $motorUnit)
    {
        if ($motorUnit->status !== 'available') {
            return back()->with('error', 'Unit tidak dapat dihapus karena statusnya bukan available');
        }

        $motorUnit->delete();

        return back()->with('success', 'Unit motor berhasil dihapus');
    }
}
