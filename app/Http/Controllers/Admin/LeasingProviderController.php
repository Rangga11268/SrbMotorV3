<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeasingProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeasingProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = LeasingProvider::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $providers = $query->latest()->paginate(10);

        // Transform logo_path to full storage URL
        $providers->getCollection()->transform(function ($provider) {
            if ($provider->logo_path) {
                $provider->logo_path = asset('storage/' . $provider->logo_path);
            }
            return $provider;
        });

        if (!$request->hasHeader('X-Inertia-Version') && $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'providers' => $providers,
                'filters' => $request->only(['search'])
            ]);
        }

        return Inertia::render('Admin/LeasingProviders/Index', [
            'providers' => $providers,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LeasingProviders/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'logo'  => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('leasing-providers', 'public');
        }

        LeasingProvider::create([
            'name'      => $request->name,
            'logo_path' => $logoPath,
        ]);

        return redirect()->route('admin.leasing-providers.index')
            ->with('success', 'Leasing Provider berhasil ditambahkan.');
    }

    public function edit(LeasingProvider $leasingProvider)
    {
        return Inertia::render('Admin/LeasingProviders/Edit', [
            'provider' => $leasingProvider
        ]);
    }

    public function update(Request $request, LeasingProvider $leasingProvider)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'logo'  => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        $logoPath = $leasingProvider->logo_path;

        if ($request->hasFile('logo')) {
            if ($logoPath && Storage::disk('public')->exists($logoPath)) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('leasing-providers', 'public');
        }

        $leasingProvider->update([
            'name'      => $request->name,
            'logo_path' => $logoPath,
        ]);

        return redirect()->route('admin.leasing-providers.index')
            ->with('success', 'Leasing Provider berhasil diperbarui.');
    }

    public function destroy(LeasingProvider $leasingProvider)
    {
        if ($leasingProvider->logo_path && Storage::disk('public')->exists($leasingProvider->logo_path)) {
            Storage::disk('public')->delete($leasingProvider->logo_path);
        }
        $leasingProvider->delete();
        return redirect()->route('admin.leasing-providers.index')
            ->with('success', 'Leasing Provider berhasil dihapus.');
    }
}
