<?php

namespace App\Http\Controllers;

use App\Services\BranchService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    protected BranchService $branchService;

    public function __construct(BranchService $branchService)
    {
        $this->branchService = $branchService;
    }

    /**
     * Get all active branches
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $branches = $this->branchService->getAllBranches();
        $motorId = $request->query('motor_id');
        $stock = [];

        if ($motorId) {
            $stock = $this->branchService->getMotorStockByBranches((int) $motorId);
            
            // Merge stock info into branches for easier frontend usage
            $branches = $branches->map(function ($branch) use ($stock) {
                $branch['stock'] = $stock[$branch['code']] ?? null;
                return $branch;
            });
        }

        return response()->json([
            'success' => true,
            'branches' => $branches->values(),
            'stock' => $stock, // Keep separate for backward compatibility if needed
        ]);
    }

    /**
     * Get branches for motor selection
     * Used in order forms
     *
     * @param int $motorId
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableBranches(int $motorId, Request $request)
    {
        $userLat = $request->query('latitude');
        $userLon = $request->query('longitude');

        $branches = $this->branchService->findNearestBranchesWithMotor(
            $motorId,
            $userLat ? floatval($userLat) : null,
            $userLon ? floatval($userLon) : null,
            10 // Get up to 10 branches
        );

        return response()->json([
            'success' => true,
            'branches' => $branches,
            'motor_id' => $motorId,
        ]);
    }

    /**
     * Find nearest branch based on user location
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function findNearest(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $nearest = $this->branchService->findNearestBranch(
            $request->latitude,
            $request->longitude
        );

        if (!$nearest) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada cabang ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'branch' => $nearest,
            'message' => "Cabang terdekat: {$nearest['name']} ({$nearest['distance']} km)",
        ]);
    }

    /**
     * Update user's preferred branch
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setPreferredBranch(Request $request)
    {
        $request->validate([
            'branch_code' => 'required|string',
        ]);

        $user = Auth::user();

        if (!$user) {
            return redirect()->back()->with('error', 'Anda harus login terlebih dahulu');
        }

        // Validate branch exists
        if (!$this->branchService->isValidBranchCode($request->branch_code)) {
            return redirect()->back()->with('error', 'Kode cabang tidak valid');
        }

        $user->update([
            'preferred_branch' => $request->branch_code,
        ]);

        $branchName = $this->branchService->getBranchName($request->branch_code);

        return redirect()->back()->with('success', "Cabang favorit berhasil diatur ke {$branchName}");
    }

    /**
     * Update user location for distance calculation
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUserLocation(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $user->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        // Find nearest branch
        $nearest = $this->branchService->findNearestBranch(
            $request->latitude,
            $request->longitude
        );

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil disimpan',
            'nearest_branch' => $nearest,
        ]);
    }

    /**
     * Get branch options for form select
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOptions(Request $request)
    {
        $options = $this->branchService->getBranchOptions();

        // Filter by type if requested
        $type = $request->query('type');
        if ($type === 'service') {
            $branches = $this->branchService->getAllBranches();
            $serviceOptions = [];

            foreach ($branches as $branch) {
                if ($branch['can_service'] ?? false) {
                    $serviceOptions[$branch['code']] = $branch['name'];
                }
            }

            $options = $serviceOptions;
        }

        return response()->json([
            'success' => true,
            'options' => $options,
        ]);
    }

    /**
     * Check stock availability across branches
     * Used in motor detail page
     *
     * @param int $motorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkStock(int $motorId)
    {
        $stock = $this->branchService->getMotorStockByBranches($motorId);

        return response()->json([
            'success' => true,
            'motor_id' => $motorId,
            'stock' => $stock,
            'total_available' => collect($stock)->where('available', true)->count(),
        ]);
    }

    /**
     * Get all branches with distance from a point
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function allWithDistance(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $branches = $this->branchService->getBranchesWithDistance(
            floatval($request->latitude),
            floatval($request->longitude)
        );

        return response()->json([
            'success' => true,
            'data' => $branches,
        ]);
    }

    /**
     * Get single branch detail by code
     *
     * @param string $code
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $code)
    {
        $branch = $this->branchService->getBranchByCode($code);

        if (!$branch) {
            return response()->json([
                'success' => false,
                'message' => 'Cabang tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'branch' => $branch,
        ]);
    }
}
