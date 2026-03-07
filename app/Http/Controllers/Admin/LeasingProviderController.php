<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeasingProvider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeasingProviderController extends Controller
{
    public function index()
    {
        $providers = LeasingProvider::latest()->paginate(10);
        return Inertia::render('Admin/LeasingProviders/Index', [
            'providers' => $providers
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LeasingProviders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_path' => 'nullable|string', // Placeholder for now
        ]);

        LeasingProvider::create($validated);

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_path' => 'nullable|string',
        ]);

        $leasingProvider->update($validated);

        return redirect()->route('admin.leasing-providers.index')
            ->with('success', 'Leasing Provider berhasil diperbarui.');
    }

    public function destroy(LeasingProvider $leasingProvider)
    {
        $leasingProvider->delete();
        return redirect()->route('admin.leasing-providers.index')
            ->with('success', 'Leasing Provider berhasil dihapus.');
    }
}
