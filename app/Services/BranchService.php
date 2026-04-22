<?php

namespace App\Services;

use App\Models\Motor;
use App\Models\Setting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class BranchService
{
    /**
     * Get all active branches from settings
     *
     * @return Collection
     */
    public function getAllBranches(): Collection
    {
        return Cache::remember('branches:all', 3600, function () {
            $branches = Setting::where('category', 'branches')
                ->get()
                ->map(function ($setting) {
                    $data = json_decode($setting->value, true);
                    return $data['is_active'] ?? false ? $data : null;
                })
                ->filter()
                ->values();

            return $branches;
        });
    }

    /**
     * Get branch by code
     *
     * @param string $branchCode
     * @return array|null
     */
    public function getBranchByCode(string $branchCode): ?array
    {
        $branches = $this->getAllBranches();
        return $branches->firstWhere('code', $branchCode);
    }

    /**
     * Get branch name by code
     *
     * @param string $branchCode
     * @return string
     */
    public function getBranchName(string $branchCode): string
    {
        $branch = $this->getBranchByCode($branchCode);
        return $branch['name'] ?? $branchCode;
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     *
     * @param float $lat1 Latitude of point 1
     * @param float $lon1 Longitude of point 1
     * @param float $lat2 Latitude of point 2
     * @param float $lon2 Longitude of point 2
     * @return float Distance in kilometers
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // Earth radius in kilometers

        $latDiff = deg2rad($lat2 - $lat1);
        $lonDiff = deg2rad($lon2 - $lon1);

        $a = sin($latDiff / 2) * sin($latDiff / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDiff / 2) * sin($lonDiff / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 2);
    }

    /**
     * Find nearest branch to user's location
     *
     * @param float|null $userLat User's latitude
     * @param float|null $userLon User's longitude
     * @return array|null Nearest branch with distance
     */
    public function findNearestBranch(?float $userLat, ?float $userLon): ?array
    {
        if (!$userLat || !$userLon) {
            return null;
        }

        $branches = $this->getAllBranches();
        $nearestBranch = null;
        $shortestDistance = PHP_FLOAT_MAX;

        foreach ($branches as $branch) {
            if (!isset($branch['latitude']) || !isset($branch['longitude'])) {
                continue;
            }

            $branch['distance'] = $this->calculateDistance(
                $userLat,
                $userLon,
                (float) $branch['latitude'],
                (float) $branch['longitude']
            );

            if ($branch['distance'] < $shortestDistance) {
                $shortestDistance = $branch['distance'];
                $nearestBranch = $branch;
                $nearestBranch['distance'] = $branch['distance'];
            }
        }

        return $nearestBranch;
    }

    /**
     * Get all branches with their distance from user
     *
     * @param float|null $userLat
     * @param float|null $userLon
     * @return Collection
     */
    public function getBranchesWithDistance(?float $userLat, ?float $userLon): Collection
    {
        $branches = $this->getAllBranches();

        if (!$userLat || !$userLon) {
            return $branches;
        }

        return $branches->map(function ($branch) use ($userLat, $userLon) {
            if (isset($branch['latitude']) && isset($branch['longitude'])) {
                $branch['distance'] = $this->calculateDistance(
                    $userLat,
                    $userLon,
                    (float) $branch['latitude'],
                    (float) $branch['longitude']
                );
            } else {
                $branch['distance'] = null;
            }
            return $branch;
        })->sortBy('distance')->values();
    }

    public function getMotorsByBranch(string $branchCode, bool $availableOnly = true): Collection
    {
        $branchName = $this->getBranchName($branchCode);

        $query = Motor::where(function ($q) use ($branchCode, $branchName) {
            $q->where('branch', $branchCode)
              ->orWhere('branch', $branchName);
        });

        if ($availableOnly) {
            $query->where('tersedia', true);
        }

        return $query->get();
    }

    public function isMotorAvailableAtBranch(int $motorId, string $branchCode): bool
    {
        $branchName = $this->getBranchName($branchCode);

        return Motor::where('id', $motorId)
            ->where(function ($q) use ($branchCode, $branchName) {
                $q->where('branch', $branchCode)
                  ->orWhere('branch', $branchName);
            })
            ->where('tersedia', true)
            ->exists();
    }

    /**
     * Get motor stock count by branch
     *
     * @param int $motorId
     * @return array Branch code => stock count
     */
    public function getMotorStockByBranches(int $motorId): array
    {
        $motor = Motor::find($motorId);
        if (!$motor) {
            return [];
        }

        $branches = $this->getAllBranches();
        
        // Optimize: Get all counts in one query using groupBy
        $counts = Motor::where('name', $motor->name)
            ->where('model', $motor->model)
            ->where('tersedia', true)
            ->selectRaw('branch, count(*) as count')
            ->groupBy('branch')
            ->pluck('count', 'branch');

        $stock = [];
        foreach ($branches as $branch) {
            // Check both code and name since the 'branch' column might store either
            // We sum them up in case of mixed data entry
            $count = ($counts[$branch['code']] ?? 0) + ($counts[$branch['name']] ?? 0);
            
            $stock[$branch['code']] = [
                'branch_name' => $branch['name'],
                'available' => $count > 0,
                'stock_count' => $count,
            ];
        }

        return $stock;
    }

    /**
     * Get branch statistics
     *
     * @param string $branchCode
     * @return array
     */
    public function getBranchStats(string $branchCode): array
    {
        $branchName = $this->getBranchName($branchCode);

        return [
            'total_motors' => Motor::where('branch', $branchName)->count(),
            'available_motors' => Motor::where('branch', $branchName)
                ->where('tersedia', true)
                ->count(),
            'brands' => Motor::where('branch', $branchName)
                ->where('tersedia', true)
                ->distinct('brand')
                ->pluck('brand'),
        ];
    }

    /**
     * Search nearest branches with specific motor model
     *
     * @param int $motorId
     * @param float|null $userLat
     * @param float|null $userLon
     * @param int $limit
     * @return Collection
     */
    public function findNearestBranchesWithMotor(
        int $motorId,
        ?float $userLat,
        ?float $userLon,
        int $limit = 3
    ): Collection {
        $motor = Motor::find($motorId);
        if (!$motor) {
            return collect();
        }

        // Get all branches that have this motor or similar variants
        $branchesWithMotor = Motor::where('name', $motor->name)
            ->where('tersedia', true)
            ->distinct('branch')
            ->pluck('branch');

        $branches = $this->getAllBranches()
            ->filter(function ($branch) use ($branchesWithMotor) {
                // Check both name and code for compatibility
                return $branchesWithMotor->contains($branch['name']) || 
                       $branchesWithMotor->contains($branch['code']);
            });

        if (!$userLat || !$userLon) {
            return $branches->take($limit);
        }

        return $branches->map(function ($branch) use ($userLat, $userLon) {
            $branch['distance'] = $this->calculateDistance(
                $userLat,
                $userLon,
                $branch['latitude'] ?? 0,
                $branch['longitude'] ?? 0
            );
            return $branch;
        })
        ->sortBy('distance')
        ->take($limit)
        ->values();
    }

    /**
     * Clear branch cache
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget('branches:all');
    }

    /**
     * Get branch options for form select
     *
     * @return array
     */
    public function getBranchOptions(): array
    {
        return $this->getAllBranches()
            ->map(fn($branch) => [
                'code' => $branch['code'],
                'name' => $branch['name'],
            ])
            ->values()
            ->toArray();
    }

    /**
     * Validate branch code
     *
     * @param string $branchCode
     * @return bool
     */
    public function isValidBranchCode(string $branchCode): bool
    {
        return $this->getBranchByCode($branchCode) !== null;
    }

    /**
     * Get branch contact info
     *
     * @param string $branchCode
     * @return array
     */
    public function getBranchContact(string $branchCode): array
    {
        $branch = $this->getBranchByCode($branchCode);

        if (!$branch) {
            return [];
        }

        return [
            'phone' => $branch['phone'] ?? null,
            'whatsapp' => $branch['whatsapp'] ?? null,
            'address' => $branch['address'] ?? null,
            'operational_hours' => $branch['operational_hours'] ?? [],
        ];
    }
}
