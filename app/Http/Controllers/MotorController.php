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
use App\Services\BranchService;

class MotorController extends Controller
{
    private MotorRepositoryInterface $motorRepository;
    private BranchService $branchService;

    public function __construct(MotorRepositoryInterface $motorRepository, BranchService $branchService)
    {
        $this->motorRepository = $motorRepository;
        $this->branchService = $branchService;
    }


    public function index(): \Inertia\Response|JsonResponse
    {
        $filters = [];
        $status = request('status', request('tersedia'));
        if ($status !== null && $status !== '') {
            $filters['tersedia'] = $status;
        }

        $filters = array_merge($filters, request()->all(['search', 'brand', 'type', 'year', 'min_price', 'max_price']));

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
            'brands' => $this->motorRepository->getDistinctBrands(),
            'branches' => $this->branchService->getBranchOptions(),
            'filters' => request()->all(['search', 'brand', 'status', 'branch']),
        ]);
    }


    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('Admin/Motors/Create', [
            'brands' => $this->motorRepository->getDistinctBrands(),
            'branches' => $this->branchService->getAllBranches(),
        ]);
    }


    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'year' => 'nullable|integer|min:1900|max:2100',
            'type' => 'nullable|string|max:255',
            'tersedia' => 'required|boolean',
            'min_dp_amount' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'branches' => 'required|array|min:1',
            'branches.*' => 'string|max:255',

            'colors' => 'nullable|array',
            'colors.*' => 'string|max:100',
        ]);

        $imagePath = ImageService::uploadAndConvert($request->file('image'), 'motors');
        $colors = is_string($request->colors) ? json_decode($request->colors, true) : ($request->colors ?? []);

        foreach ($request->branches as $branchCode) {
            Motor::create([
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
                'branch' => $branchCode,
                'colors' => $colors,
            ]);
        }

        $this->motorRepository->clearCache();

        return redirect()->route('admin.motors.index')
            ->with('success', count($request->branches) . ' unit motor berhasil didaftarkan ke cabang terkait.');
    }


    public function show(Motor $motor): \Inertia\Response
    {

        return \Inertia\Inertia::render('Admin/Motors/Show', compact('motor'));
    }


    public function edit(Motor $motor): \Inertia\Response
    {
        return \Inertia\Inertia::render('Admin/Motors/Edit', [
            'motor' => $motor,
            'brands' => $this->motorRepository->getDistinctBrands(),
            'branches' => $this->branchService->getAllBranches(),
        ]);
    }


    public function update(Request $request, Motor $motor): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'year' => 'nullable|integer|min:1900|max:2100',
            'type' => 'nullable|string|max:255',
            'tersedia' => 'required|boolean',
            'min_dp_amount' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'branch' => 'nullable|string|max:255',
            'sync_all_branches' => 'nullable|boolean',

            'colors' => 'nullable|array',
            'colors.*' => 'string|max:100',
        ]);

        $colors = is_string($request->colors) ? json_decode($request->colors, true) : ($request->colors ?? []);

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
            'branch' => $request->branch,
            'colors' => $colors,
        ];

        if ($request->hasFile('image')) {
            $data['image_path'] = ImageService::uploadAndConvert($request->file('image'), 'motors');
        }

        $motor->update($data);

        // Bulk synchronization logic
        if ($request->boolean('sync_all_branches')) {
            $syncData = [
                'price' => $data['price'],
                'min_dp_amount' => $data['min_dp_amount'],
                'description' => $data['description'],
                'colors' => $data['colors'],
                'brand' => $data['brand'],
                'model' => $data['model'],
                'year' => $data['year'],
                'type' => $data['type'],
            ];

            if (isset($data['image_path'])) {
                $syncData['image_path'] = $data['image_path'];
            }

            Motor::where('name', $motor->name)
                ->where('brand', $motor->brand)
                ->where('id', '!=', $motor->id)
                ->update($syncData);
        }

        $this->motorRepository->clearCache();

        return redirect()->route('admin.motors.index')->with('success', 'Data motor berhasil diperbarui.');
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
