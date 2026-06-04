<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Motor;
use App\Models\Transaction;

use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{

    public function index(): Response|\Illuminate\Http\RedirectResponse
    {
        $motorsCount = Motor::count();
        $usersCount = \App\Models\User::count();
        $transactionsCount = Transaction::count();

        // Additional stats for Montir/Staff
        $totalServicesToday = \App\Models\ServiceAppointment::whereDate('service_date', Carbon::today())->count();
        $pendingServices = \App\Models\ServiceAppointment::where('status', 'pending')->count();
        $completedServicesToday = \App\Models\ServiceAppointment::whereDate('service_date', Carbon::today())
            ->where('status', 'completed')
            ->count();


        $cashTransactionsCount = Transaction::where('transaction_type', 'CASH')->count();
        $creditTransactionsCount = Transaction::where('transaction_type', 'CREDIT')->count();
        

        $recentTransactions = Transaction::with(['user', 'motor', 'creditDetail', 'installments'])->latest()->limit(5)->get();
        
        $recentMotors = Motor::latest()->limit(5)->get();
        $totalRevenue = Transaction::sum('final_price');



        $monthlyStatsMap = Transaction::select(
            DB::raw('count(id) as count'),
            DB::raw('SUM(final_price) as revenue'),
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as date")
        )
        ->where('created_at', '>=', Carbon::now()->subMonths(5)->startOfMonth())
        ->groupBy('date')
        ->get()
        ->keyBy('date');

        $monthlyStats = collect();
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $key = $monthDate->format('Y-m');
            $name = $monthDate->format('M Y');
            
            if ($monthlyStatsMap->has($key)) {
                $item = $monthlyStatsMap->get($key);
                $monthlyStats->push([
                    'name' => $name,
                    'sales' => $item->count,
                    'revenue' => (float) $item->revenue
                ]);
            } else {
                $monthlyStats->push([
                    'name' => $name,
                    'sales' => 0,
                    'revenue' => 0.0
                ]);
            }
        }


        $statusStats = Transaction::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => strtoupper(str_replace('_', ' ', $item->status)),
                    'value' => $item->count
                ];
            });

        $brandStats = Motor::select('brand', DB::raw('count(*) as count'))
            ->groupBy('brand')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->brand,
                    'value' => $item->count
                ];
            });
        
        // Service Chart Data for Montir
        $serviceStatusStats = \App\Models\ServiceAppointment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => strtoupper(str_replace('_', ' ', $item->status)),
                    'value' => $item->count
                ];
            });

        $serviceTypeStats = \App\Models\ServiceAppointment::select('service_type', DB::raw('count(*) as count'))
            ->groupBy('service_type')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->service_type,
                    'value' => $item->count
                ];
            });

        $serviceHistoryStats = collect(range(6, 0))->map(function($days) {
            $date = Carbon::today()->subDays($days);
            $count = \App\Models\ServiceAppointment::whereDate('service_date', $date)->count();
            return [
                'name' => $date->format('d M'),
                'count' => $count,
            ];
        });

        return Inertia::render('Admin/Dashboard', [

            'motorsCount' => $motorsCount, 
            'usersCount' => $usersCount,
            'transactionsCount' => $transactionsCount,
            'cashTransactionsCount' => $cashTransactionsCount,
            'creditTransactionsCount' => $creditTransactionsCount,
            'recentTransactions' => $recentTransactions,
            'recentMotors' => $recentMotors,
            'monthlyStats' => $monthlyStats,
            'statusStats' => $statusStats,
            'brandStats' => $brandStats,
            'totalRevenue' => $totalRevenue,
            'totalServicesToday' => $totalServicesToday,
            'pendingServices' => $pendingServices,
            'completedServicesToday' => $completedServicesToday,
            'serviceStatusStats' => $serviceStatusStats,
            'serviceTypeStats' => $serviceTypeStats,
            'serviceHistoryStats' => $serviceHistoryStats,
        ]);
    }
}
