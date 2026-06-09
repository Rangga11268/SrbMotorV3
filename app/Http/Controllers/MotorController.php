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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'description' => 'nullable|string',
            'branches' => 'required|array|min:1',
            'branches.*' => 'string|max:255',
            'branch_stocks' => 'nullable|array',

            'colors' => 'nullable|array',
            'colors.*' => 'string|max:100',
        ]);

        $imagePath = ImageService::uploadAndConvert($request->file('image'), 'motors');
        $colors = is_string($request->colors) ? json_decode($request->colors, true) : ($request->colors ?? []);
        $branchStocks = $request->input('branch_stocks', []);

        foreach ($request->branches as $branchCode) {
            $stock = (int) ($branchStocks[$branchCode] ?? ($request->boolean('tersedia') ? 1 : 0));
            Motor::create([
                'name' => $request->name,
                'brand' => $request->brand,
                'model' => $request->model,
                'price' => $request->price,
                'year' => $request->year,
                'type' => $request->type,
                'stock' => $stock,
                'tersedia' => $stock > 0,
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
        $currentBranches = Motor::where('name', $motor->name)
                                ->where('brand', $motor->brand)
                                ->pluck('branch')
                                ->toArray();

        $currentBranchStocks = Motor::where('name', $motor->name)
                                    ->where('brand', $motor->brand)
                                    ->pluck('stock', 'branch')
                                    ->toArray();

        return \Inertia\Inertia::render('Admin/Motors/Edit', [
            'motor' => $motor,
            'currentBranches' => $currentBranches,
            'currentBranchStocks' => $currentBranchStocks,
            'brands' => $this->motorRepository->getDistinctBrands(),
            'branches' => $this->branchService->getAllBranches(),
        ]);
    }


    public function update(Request $request, Motor $motor): RedirectResponse
    {
        // LOG SEMUA REQUEST UNTUK DEBUGGING
        \Log::info('Update Motor Request Reached Controller:', [
            'id' => $motor->id,
            'method' => $request->method(),
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('image')
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            \Log::info('Uploaded File Info:', [
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'is_valid' => $file->isValid(),
            ]);
        }

        $validator = \Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'year' => 'nullable|integer|min:1900|max:2100',
            'type' => 'nullable|string|max:255',
            'tersedia' => 'required',
            'min_dp_amount' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'description' => 'nullable|string',
            'branches' => 'required|array|min:1',
            'branches.*' => 'string|max:255',
            'branch_stocks' => 'nullable|array',

            'colors' => 'nullable',
            'colors.*' => 'string|max:100',
        ], [
            'image.mimes' => 'DEBUG: File must be jpeg, png, jpg, gif, svg, or webp. You uploaded: ' . ($request->hasFile('image') ? $request->file('image')->getClientMimeType() : 'no file'),
        ]);
        
        // Log explicitly for confirmation
        \Log::info('Validator initialized with WebP support');

        if ($validator->fails()) {
            \Log::error('Update Motor Validation Failed:', $validator->errors()->toArray());
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $colors = is_string($request->colors) ? json_decode($request->colors, true) : ($request->colors ?? []);

        try {
            $data = [
                'name' => $request->name,
                'brand' => $request->brand,
                'model' => $request->model,
                'price' => $request->price,
                'year' => $request->year,
                'type' => $request->type,
                'min_dp_amount' => $request->min_dp_amount,
                'description' => $request->description,
                'colors' => $colors,
            ];

            if ($request->hasFile('image')) {
                $data['image_path'] = ImageService::uploadAndConvert($request->file('image'), 'motors');
            }

            $newBranches = $request->branches;
            $branchStocks = $request->input('branch_stocks', []);
            $currentBranches = Motor::where('name', $motor->name)
                                    ->where('brand', $motor->brand)
                                    ->pluck('branch')
                                    ->toArray();
            
            // Delete branches that are no longer selected
            $branchesToDelete = array_diff($currentBranches, $newBranches);
            if (!empty($branchesToDelete)) {
                Motor::where('name', $motor->name)
                     ->where('brand', $motor->brand)
                     ->whereIn('branch', $branchesToDelete)
                     ->delete();
            }

            // Update or create branches
            foreach ($newBranches as $bCode) {
                $existing = Motor::where('name', $motor->name)
                                 ->where('brand', $motor->brand)
                                 ->where('branch', $bCode)
                                 ->first();
                
                $stock = (int) ($branchStocks[$bCode] ?? ($request->boolean('tersedia') ? 1 : 0));
                $newData = $data;
                $newData['stock'] = $stock;
                $newData['tersedia'] = $stock > 0;

                if ($existing) {
                    $existing->update($newData);
                } else {
                    $newData['branch'] = $bCode;
                    // Copy existing image path if no new image was uploaded and we have one
                    if (!isset($newData['image_path']) && $motor->image_path) {
                        $newData['image_path'] = $motor->image_path;
                    }
                    Motor::create($newData);
                }
            }

            $this->motorRepository->clearCache();
            
            \Log::info('Motor updated successfully for multiple branches:', ['id' => $motor->id, 'branches' => $newBranches]);
            return redirect()->route('admin.motors.index')->with('success', 'Data motor berhasil diperbarui di cabang terpilih.');

        } catch (\Exception $e) {
            \Log::error('Motor Update Exception:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage())->withInput();
        }
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
