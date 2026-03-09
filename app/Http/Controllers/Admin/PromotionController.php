<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $query = Promotion::query();

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('badge_text', 'like', '%' . $request->search . '%');
        }

        $promotions = $query->latest()->paginate(10);

        if (!$request->hasHeader('X-Inertia-Version') && $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'promotions' => $promotions,
                'filters' => $request->only(['search'])
            ]);
        }

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Promotions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'badge_text' => 'required|string|max:50',
            'badge_color' => 'required|string|max:20',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        Promotion::create($validated);

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promosi berhasil ditambahkan.');
    }

    public function edit(Promotion $promotion)
    {
        return Inertia::render('Admin/Promotions/Edit', [
            'promotion' => $promotion
        ]);
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'badge_text' => 'required|string|max:50',
            'badge_color' => 'required|string|max:20',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $promotion->update($validated);

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promosi berhasil diperbarui.');
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promosi berhasil dihapus.');
    }
}
