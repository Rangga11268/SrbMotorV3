<?php

namespace App\Http\Controllers;

use App\Models\Motor;
use App\Repositories\MotorRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Services\ImageService;

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
        if (request('brand')) {
            $filters['brand'] = request('brand');
        }
        if (request('type')) {
            $filters['type'] = request('type');
        }
        if (request('year')) {
            $filters['year'] = request('year');
        }
        if (request('min_price')) {
            $filters['min_price'] = request('min_price');
        }
        if (request('max_price')) {
            $filters['max_price'] = request('max_price');
        }
        if (request('tersedia') !== null) {
            $filters['tersedia'] = request('tersedia');
        }

        $motors = $this->motorRepository->getWithFilters($filters, true, 10);

        if (!request()->hasHeader('X-Inertia-Version') && request()->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'motors' => $motors,
                'brands' => $this->motorRepository->getDistinctBrands(),
                'types' => $this->motorRepository->getDistinctTypes(),
                'years' => $this->motorRepository->getDistinctYears(),
                'filters' => request()->all(),
            ]);
        }

        return \Inertia\Inertia::render('Admin/Motors/Index', [
            'motors' => $motors,
            'filters' => request()->all(['search', 'brand', 'status']),
        ]);
    }


    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('Admin/Motors/Create');
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
            'min_dp_amount' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',

            'colors' => 'nullable|array',
            'colors.*' => 'string|max:100',
        ]);

        $imagePath = ImageService::uploadAndConvert($request->file('image'), 'motors');

        $motor = Motor::create([
            'name' => $request->name,
            'brand' => $request->brand,
            'model' => $request->model,
            'price' => $request->price,
            'year' => $request->year,
            'type' => $request->type,
            'tersedia' => $request->boolean('tersedia'),
            'min_dp_amount' => $request->min_dp_amount,
            'image_path' => $imagePath,
            'description' => $request->description,
            'colors' => is_string($request->colors) ? json_decode($request->colors, true) : ($request->colors ?? []),
        ]);


        $this->motorRepository->clearCache();

        return redirect()->route('admin.motors.index')->with('success', 'Motor berhasil ditambahkan.');
    }


    public function show(Motor $motor): \Inertia\Response
    {

        return \Inertia\Inertia::render('Admin/Motors/Show', compact('motor'));
    }


    public function edit(Motor $motor): \Inertia\Response
    {
        return \Inertia\Inertia::render('Admin/Motors/Edit', [
            'motor' => $motor,
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
            'min_dp_amount' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',

            'colors' => 'nullable|array',
            'colors.*' => 'string|max:100',
        ]);

        $data = [
            'name' => $request->name,
            'brand' => $request->brand,
            'model' => $request->model,
            'price' => $request->price,
            'year' => $request->year,
            'type' => $request->type,
            'tersedia' => $request->boolean('tersedia'),
            'min_dp_amount' => $request->min_dp_amount,
            'description' => $request->description,
            'colors' => is_string($request->colors) ? json_decode($request->colors, true) : ($request->colors ?? []),
        ];

        if ($request->hasFile('image')) {
            if ($motor->image_path) {
                Storage::disk('public')->delete($motor->image_path);
            }
            $data['image_path'] = ImageService::uploadAndConvert($request->file('image'), 'motors');
        }

        $motor->update($data);


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
