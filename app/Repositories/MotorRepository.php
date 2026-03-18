<?php

namespace App\Repositories;

use App\Models\Motor;
use Illuminate\Support\Facades\Cache;
use Illuminate\Pagination\LengthAwarePaginator;

class MotorRepository implements MotorRepositoryInterface
{
    protected string $cacheKey = 'motors';
    protected int $cacheTime = 3600; // 1 hour

    /**
     * Get all motors with caching
     */
    public function getAll($withSpecs = true, $perPage = 10): \Illuminate\Pagination\LengthAwarePaginator
    {
        $cacheKey = $this->cacheKey . ':all:' . ($withSpecs ? 'withSpecs' : 'withoutSpecs') . ':' . $perPage;

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($withSpecs, $perPage) {
            $query = Motor::query();



            return $query->orderBy('created_at', 'desc')->paginate($perPage);
        });
    }

    /**
     * Get motors with filters and caching
     */
    public function getWithFilters($filters = [], $withSpecs = true, $perPage = 10): \Illuminate\Pagination\LengthAwarePaginator
    {
        // Don't cache searches for better real-time results
        $hasSearch = isset($filters['search']) && !empty($filters['search']);

        if (!$hasSearch) {
            $cacheKey = $this->generateCacheKey('filtered', $filters, $withSpecs, $perPage);
            return Cache::remember($cacheKey, $this->cacheTime, function () use ($filters, $withSpecs, $perPage) {
                return $this->buildFilteredQuery($filters, $perPage);
            });
        }

        // Direct query without cache for search
        return $this->buildFilteredQuery($filters, $perPage);
    }

    private function buildFilteredQuery($filters = [], $perPage = 10): \Illuminate\Pagination\LengthAwarePaginator
    {
        $query = Motor::query();

        // Apply filters
        if (isset($filters['search']) && !empty(trim($filters['search']))) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('model', 'like', '%' . $search . '%')
                    ->orWhere('brand', 'like', '%' . $search . '%')
                    ->orWhere('type', 'like', '%' . $search . '%')
                    ->orWhere('details', 'like', '%' . $search . '%');
            });
        }

        if (isset($filters['brand']) && !empty($filters['brand'])) {
            $query->where('brand', $filters['brand']);
        }

        if (isset($filters['type']) && !empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['year']) && !empty($filters['year'])) {
            $query->where('year', $filters['year']);
        }

        if (isset($filters['min_price']) && !empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price']) && !empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['tersedia']) && $filters['tersedia'] !== null) {
            $query->where('tersedia', $filters['tersedia'] == 1);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get a single motor by ID with caching
     */
    public function findById($id, $withSpecs = true)
    {
        $cacheKey = $this->cacheKey . ':id:' . $id . ':' . ($withSpecs ? 'withSpecs' : 'withoutSpecs');

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($id, $withSpecs) {
            $query = Motor::query();

            $query = $query->with([]);

            return $query->find($id);
        });
    }

    /**
     * Get popular motors with caching
     */
    public function getPopular($limit = 5, $withSpecs = true)
    {
        $cacheKey = $this->cacheKey . ':popular:' . $limit . ':' . ($withSpecs ? 'withSpecs' : 'withoutSpecs');

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($limit, $withSpecs) {
            $query = Motor::query();



            return $query->orderBy('created_at', 'desc')->limit($limit)->get();
        });
    }

    /**
     * Get distinct values for filters with caching
     */
    public function getFilterOptions($search = null)
    {
        $cacheKey = $this->cacheKey . ':filter-options:' . ($search ? md5($search) : 'all');

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($search) {
            $query = Motor::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('model', 'like', '%' . $search . '%')
                        ->orWhere('brand', 'like', '%' . $search . '%')
                        ->orWhere('type', 'like', '%' . $search . '%')
                        ->orWhere('details', 'like', '%' . $search . '%');
                });
            }

            $results = $query->select('brand', 'type', 'year')->get();

            $brands = $results->pluck('brand')->unique()->filter();
            $types = $results->pluck('type')->unique()->filter();
            $years = $results->pluck('year')->unique()->filter()->sort()->reverse();

            return [
                'brands' => $brands,
                'types' => $types,
                'years' => $years
            ];
        });
    }

    /**
     * Get distinct brands from motors
     */
    public function getDistinctBrands()
    {
        return Motor::distinct()
            ->pluck('brand')
            ->filter()
            ->sort()
            ->values();
    }

    /**
     * Get distinct types from motors
     */
    public function getDistinctTypes()
    {
        return Motor::distinct()
            ->pluck('type')
            ->filter()
            ->sort()
            ->values();
    }

    /**
     * Get distinct years from motors
     */
    public function getDistinctYears()
    {
        return Motor::distinct()
            ->pluck('year')
            ->filter()
            ->sort()
            ->reverse()
            ->values();
    }

    /**
     * Clear cache for motors
     */
    public function clearCache()
    {
        // Check if the cache store supports tags
        $store = Cache::getStore();
        if (!method_exists($store, 'tags')) {
            // If tags are not supported, we have to flush all cache
            // This is a limitation of some cache drivers like file and database
            Cache::flush();
        } else {
            // Use tags if supported (Redis, Memcached, etc.)
            Cache::tags([$this->cacheKey])->flush();
        }
    }

    /**
     * Generate cache key based on filters
     */
    private function generateCacheKey($type, $filters, $withSpecs, $perPage): string
    {
        $filterString = http_build_query($filters);
        $specsString = $withSpecs ? 'withSpecs' : 'withoutSpecs';

        return $this->cacheKey . ':' . $type . ':' . md5($filterString) . ':' . $specsString . ':' . $perPage;
    }
}
