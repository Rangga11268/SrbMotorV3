<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Services\BranchService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::all();

        return Inertia::render('Admin/Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Branches/Form', [
            'branch' => null
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[A-Z0-9_]+$/|unique:branches,code',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'phone' => 'required|string',
            'whatsapp' => 'nullable|string',
            'maps_url' => 'nullable|url',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'operational_hours' => 'required|array',
            'facilities' => 'nullable|array',
            'can_service' => 'boolean',
            'service_slot_quota' => 'nullable|integer|min:1',
            'is_main_branch' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        
        Branch::create($validated);

        // Clear cache
        (new BranchService())->clearCache();

        return redirect()->route('admin.branches.index')
            ->with('success', 'Cabang baru berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $branch = Branch::findOrFail($id);

        return Inertia::render('Admin/Branches/Form', [
            'branch' => $branch
        ]);
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[A-Z0-9_]+$/|unique:branches,code,' . $id,
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'phone' => 'required|string',
            'whatsapp' => 'nullable|string',
            'maps_url' => 'nullable|url',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'operational_hours' => 'required|array',
            'facilities' => 'nullable|array',
            'can_service' => 'boolean',
            'service_slot_quota' => 'nullable|integer|min:1',
            'is_main_branch' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        
        $branch->update($validated);

        // Clear cache
        (new BranchService())->clearCache();

        return redirect()->route('admin.branches.index')
            ->with('success', 'Data cabang berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();

        // Clear cache
        (new BranchService())->clearCache();

        return redirect()->route('admin.branches.index')
            ->with('success', 'Cabang berhasil dihapus.');
    }
}
