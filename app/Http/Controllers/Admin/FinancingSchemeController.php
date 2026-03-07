<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinancingScheme;
use App\Models\LeasingProvider;
use App\Models\Motor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancingSchemeController extends Controller
{
    public function index()
    {
        $schemes = FinancingScheme::with(['motor', 'provider'])->latest()->paginate(10);
        return Inertia::render('Admin/FinancingSchemes/Index', [
            'schemes' => $schemes
        ]);
    }

    public function create()
    {
        $motors = Motor::all(['id', 'name']);
        $providers = LeasingProvider::all(['id', 'name']);
        return Inertia::render('Admin/FinancingSchemes/Create', [
            'motors' => $motors,
            'providers' => $providers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'provider_id' => 'required|exists:leasing_providers,id',
            'tenor' => 'required|integer|min:1',
            'dp_amount' => 'required|numeric|min:0',
            'monthly_installment' => 'required|numeric|min:0',
        ]);

        FinancingScheme::create($validated);

        return redirect()->route('admin.financing-schemes.index')
            ->with('success', 'Skema cicilan berhasil ditambahkan.');
    }

    public function edit(FinancingScheme $financingScheme)
    {
        $motors = Motor::all(['id', 'name']);
        $providers = LeasingProvider::all(['id', 'name']);
        return Inertia::render('Admin/FinancingSchemes/Edit', [
            'scheme' => $financingScheme,
            'motors' => $motors,
            'providers' => $providers
        ]);
    }

    public function update(Request $request, FinancingScheme $financingScheme)
    {
        $validated = $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'provider_id' => 'required|exists:leasing_providers,id',
            'tenor' => 'required|integer|min:1',
            'dp_amount' => 'required|numeric|min:0',
            'monthly_installment' => 'required|numeric|min:0',
        ]);

        $financingScheme->update($validated);

        return redirect()->route('admin.financing-schemes.index')
            ->with('success', 'Skema cicilan berhasil diperbarui.');
    }

    public function destroy(FinancingScheme $financingScheme)
    {
        $financingScheme->delete();
        return redirect()->route('admin.financing-schemes.index')
            ->with('success', 'Skema cicilan berhasil dihapus.');
    }
}
