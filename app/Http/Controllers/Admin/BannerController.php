<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('position')->paginate(10);
        return Inertia::render('Admin/Banners/Index', [
            'banners' => $banners
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Banners/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
            'position' => 'required|integer|min:0',
            'published_at' => 'nullable|date',
            'expired_at' => 'nullable|date|after_or_equal:published_at',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('banners', 'public');
        }

        Banner::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath ? "storage/{$imagePath}" : null,
            'button_text' => $validated['button_text'],
            'button_url' => $validated['button_url'],
            'status' => $validated['status'],
            'position' => $validated['position'],
            'published_at' => $validated['published_at'],
            'expired_at' => $validated['expired_at'],
        ]);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner berhasil ditambahkan.');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/Banners/Edit', [
            'banner' => $banner
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
            'position' => 'required|integer|min:0',
            'published_at' => 'nullable|date',
            'expired_at' => 'nullable|date|after_or_equal:published_at',
        ]);

        $imagePath = $banner->image_path;
        if ($request->hasFile('image')) {
            // Delete old image
            if ($banner->image_path) {
                $oldPath = str_replace('storage/', '', $banner->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = "storage/" . $request->file('image')->store('banners', 'public');
        }

        $banner->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'button_text' => $validated['button_text'],
            'button_url' => $validated['button_url'],
            'status' => $validated['status'],
            'position' => $validated['position'],
            'published_at' => $validated['published_at'],
            'expired_at' => $validated['expired_at'],
        ]);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner berhasil dihapus.');
    }
}
