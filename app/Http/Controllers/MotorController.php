<?php

namespace App\Http\Controllers;

use App\Models\Motor;
use App\Models\MotorSpecification;
use App\Repositories\MotorRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class MotorController extends Controller
{
    private MotorRepositoryInterface $motorRepository;

    public function __construct(MotorRepositoryInterface $motorRepository)
    {
        $this->motorRepository = $motorRepository;
    }


    public function index(): \Inertia\Response|JsonResponse
    {
        $filters = [];
        if (request('search')) {
            $filters['search'] = request('search');
        }
        if (request('tersedia') !== null) {
            $filters['tersedia'] = request('tersedia');
        }

        $motors = $this->motorRepository->getWithFilters($filters, true, 10);

        if (!request()->hasHeader('X-Inertia-Version') && request()->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'motors' => $motors,
                'filters' => request()->all(['search', 'brand', 'status']),
            ]);
        }

        return \Inertia\Inertia::render('Admin/Motors/Index', [
            'motors' => $motors,
            'filters' => request()->all(['search', 'brand', 'status']),
        ]);
    }


    public function create(): \Inertia\Response
    {
        $promotions = \App\Models\Promotion::where('is_active', true)->get(['id', 'title', 'badge_text']);
        return \Inertia\Inertia::render('Admin/Motors/Create', [
            'promotions' => $promotions
        ]);
    }


    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|in:Yamaha,Honda',
            'model' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'year' => 'nullable|integer|min:1900|max:2100',
            'type' => 'nullable|string|max:255',
            'tersedia' => 'required|boolean',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'promotion_ids' => 'nullable|array',
            'promotion_ids.*' => 'exists:promotions,id',
        ]);

        $imagePath = $request->file('image')->store('motors', 'public');

        $motor = Motor::create([
            'name' => $request->name,
            'brand' => $request->brand,
            'model' => $request->model,
            'price' => $request->price,
            'year' => $request->year,
            'type' => $request->type,
            'tersedia' => $request->tersedia,
            'image_path' => $imagePath,
            'description' => $request->description,
        ]);

        if ($request->has('promotion_ids')) {
            $motor->promotions()->sync($request->promotion_ids);
        }

        $this->motorRepository->clearCache();

        return redirect()->route('admin.motors.index')->with('success', 'Motor berhasil ditambahkan.');
    }


    public function show(Motor $motor): \Inertia\Response
    {
        $motor->load('promotions');
        return \Inertia\Inertia::render('Admin/Motors/Show', compact('motor'));
    }


    public function edit(Motor $motor): \Inertia\Response
    {
        $motor->load('promotions');
        $promotions = \App\Models\Promotion::where('is_active', true)->get(['id', 'title', 'badge_text']);
        return \Inertia\Inertia::render('Admin/Motors/Edit', [
            'motor' => $motor,
            'promotions' => $promotions
        ]);
    }


    public function update(Request $request, Motor $motor): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|in:Yamaha,Honda',
            'model' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'year' => 'nullable|integer|min:1900|max:2100',
            'type' => 'nullable|string|max:255',
            'tersedia' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'promotion_ids' => 'nullable|array',
            'promotion_ids.*' => 'exists:promotions,id',
        ]);

        $data = [
            'name' => $request->name,
            'brand' => $request->brand,
            'model' => $request->model,
            'price' => $request->price,
            'year' => $request->year,
            'type' => $request->type,
            'tersedia' => $request->tersedia,
            'description' => $request->description,
        ];

        if ($request->hasFile('image')) {
            if ($motor->image_path) {
                Storage::disk('public')->delete($motor->image_path);
            }
            $data['image_path'] = $request->file('image')->store('motors', 'public');
        }

        $motor->update($data);

        if ($request->has('promotion_ids')) {
            $motor->promotions()->sync($request->promotion_ids);
        }

        $this->motorRepository->clearCache();

        return redirect()->route('admin.motors.index')->with('success', 'Motor berhasil diperbarui.');
    }


    public function destroy(Motor $motor): RedirectResponse
    {

        if ($motor->image_path) {
            Storage::disk('public')->delete($motor->image_path);
        }

        $motor->delete();


        $this->motorRepository->clearCache();

        return redirect()->route('admin.motors.index')->with('success', 'Motor berhasil dihapus.');
    }
}
