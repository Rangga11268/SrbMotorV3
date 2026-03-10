<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('category');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function edit($category)
    {
        $settings = Setting::where('category', $category)->get();

        return Inertia::render('Admin/Settings/Edit', [
            'category' => $category,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, $category)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            Setting::set(
                $setting['key'],
                $setting['value'],
                $setting['type'] ?? 'string',
                $category,
                $setting['description'] ?? null
            );
        }

        Setting::clearCache();

        return redirect()->route('admin.settings.index')
            ->with('success', "Pengaturan {$category} berhasil diperbarui.");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:settings,key',
            'value' => 'nullable|string',
            'type' => 'required|in:string,text,number,boolean,json',
            'category' => 'required|string',
            'description' => 'nullable|string',
        ]);

        Setting::create($validated);

        Setting::clearCache();

        return redirect()->route('admin.settings.edit', $validated['category'])
            ->with('success', 'Pengaturan baru berhasil ditambahkan.');
    }

    public function destroy(Setting $setting)
    {
        $category = $setting->category;
        $setting->delete();

        Setting::clearCache();

        return redirect()->route('admin.settings.edit', $category)
            ->with('success', 'Pengaturan berhasil dihapus.');
    }
}
