<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Setting::where('category', 'branches')->get()->map(function($setting) {
            $data = json_decode($setting->value, true);
            $data['id'] = $setting->id; // Using setting ID for React keys
            return $data;
        });

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
            'code' => 'required|string|regex:/^[A-Z0-9_]+$/',
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

        $key = strtoupper(Str::slug($validated['code'], '_'));
        
        Setting::updateOrCreate(
            ['category' => 'branches', 'key' => $key],
            [
                'value' => json_encode($validated),
                'type' => 'json'
            ]
        );

        Setting::clearCache();

        return redirect()->route('admin.branches.index')
            ->with('success', 'Cabang baru berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $setting = Setting::findOrFail($id);
        $branch = json_decode($setting->value, true);
        $branch['id'] = $setting->id;

        return Inertia::render('Admin/Branches/Form', [
            'branch' => $branch
        ]);
    }

    public function update(Request $request, $id)
    {
        $setting = Setting::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[A-Z0-9_]+$/',
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

        $setting->update([
            'key' => strtoupper(Str::slug($validated['code'], '_')),
            'value' => json_encode($validated)
        ]);

        Setting::clearCache();

        return redirect()->route('admin.branches.index')
            ->with('success', 'Data cabang berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $setting = Setting::findOrFail($id);
        $setting->delete();

        Setting::clearCache();

        return redirect()->route('admin.branches.index')
            ->with('success', 'Cabang berhasil dihapus.');
    }
}
