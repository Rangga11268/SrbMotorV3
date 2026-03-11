<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Motor;
use App\Models\User;
use App\Exports\ReportExport;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{

    public function index(): \Inertia\Response
    {
        return \Inertia\Inertia::render('Admin/Reports/Index');
    }


    public function create(): View
    {

        return view('pages.admin.reports.create');
    }


    public function generate(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sales,income,customer,status',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        switch ($request->type) {
            case 'sales':
                $reportData = $this->generateSalesReport($startDate, $endDate);
                $reportTitle = 'Laporan Penjualan';
                break;
            case 'income':
                $reportData = $this->generateIncomeReport($startDate, $endDate);
                $reportTitle = 'Laporan Pendapatan';
                break;
            case 'customer':
                $reportData = $this->generateCustomerReport($startDate, $endDate);
                $reportTitle = 'Laporan Pelanggan';
                break;
            case 'status':
                $reportData = $this->generateStatusReport($startDate, $endDate);
                $reportTitle = 'Laporan Status Transaksi';
                break;
            default:
                abort(404);
        }

        return \Inertia\Inertia::render('Admin/Reports/Show', [
            'type' => $request->type,
            'title' => $reportTitle,
            'description' => 'Laporan dibuat pada ' . now()->format('d M Y H:i'),
            'startDate' => $startDate->format('d M Y'),
            'endDate' => $endDate->format('d M Y'),
            'data' => $reportData
        ]);
    }


    private function generateSalesReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::with(['motor', 'user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_transactions' => $transactions->count(),
            'total_revenue' => $transactions->sum('final_price'),
            'cash_transactions' => $transactions->where('transaction_type', 'CASH')->count(),
            'credit_transactions' => $transactions->where('transaction_type', 'CREDIT')->count(),
            'cash_revenue' => $transactions->where('transaction_type', 'CASH')->sum('final_price'),
            'credit_revenue' => $transactions->where('transaction_type', 'CREDIT')->sum('final_price'),
        ];


        $data['by_brand'] = $transactions->groupBy('motor.brand')->map(function ($group) {
            return [
                'count' => $group->count(),
                'revenue' => $group->sum('final_price')
            ];
        });


        $data['by_type'] = $transactions->groupBy('motor.type')->map(function ($group) {
            return [
                'count' => $group->count(),
                'revenue' => $group->sum('final_price')
            ];
        });


        $data['items'] = $transactions->map(function($t) {
            return [
                'id' => $t->id,
                'created_at' => $t->created_at->format('d M Y H:i'),
                'customer_name' => $t->user->name ?? 'Guest',
                'motor_name' => $t->motor->name ?? 'Unknown',
                'type' => $t->transaction_type,
                'final_price' => $t->final_price,
            ];
        })->values();

        return $data;
    }


    private function generateIncomeReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_income' => $transactions->sum('final_price'),
            'cash_income' => $transactions->where('transaction_type', 'CASH')->sum('final_price'),
            'credit_income' => $transactions->where('transaction_type', 'CREDIT')->sum('final_price'),
        ];


        $data['by_month'] = $transactions
            ->groupBy(function ($transaction) {
                return $transaction->created_at->format('Y-m');
            })
            ->map(function ($group) {
                return [
                    'total' => $group->sum('final_price'),
                    'cash' => $group->where('transaction_type', 'CASH')->sum('final_price'),
                    'credit' => $group->where('transaction_type', 'CREDIT')->sum('final_price'),
                ];
            });


        $data['items'] = $transactions->map(function($t) {
            return [
               'id' => $t->id,
               'created_at' => $t->created_at->format('d M Y H:i'),
               'customer_name' => $t->user->name ?? 'Guest',
               'motor_name' => $t->motor->name ?? 'Unknown',
               'type' => $t->transaction_type,
               'final_price' => $t->final_price,
            ];
        })->values();

        return $data;
    }


    private function generateCustomerReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::with(['user', 'motor'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_customers' => $transactions->unique('user_id')->count(),
            'new_customers' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
        ];


        $data['top_customers'] = $transactions
            ->groupBy('user_id')
            ->map(function ($group) {
                $user = $group->first()->user;
                return [
                    'name' => $user->name,
                    'email' => $user->email,
                    'transaction_count' => $group->count(),
                    'total_spent' => $group->sum('final_price'),
                ];
            })
            ->sortByDesc('transaction_count')
            ->take(10)
            ->values();

        return $data;
    }


    private function generateStatusReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::with(['motor', 'user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_transactions' => $transactions->count(),
        ];


        $totalTransactionsCount = $transactions->count();
        $data['by_status'] = $transactions
            ->groupBy('status')
            ->map(function ($group) use ($totalTransactionsCount) {
                return [
                    'count' => $group->count(),
                    'percentage' => $totalTransactionsCount > 0 ? round(($group->count() / $totalTransactionsCount) * 100, 2) : 0,
                    'revenue' => $group->sum('final_price'),
                ];
            });


        $data['by_type'] = $transactions
            ->groupBy('transaction_type')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'revenue' => $group->sum('final_price'),
                ];
            });

        return $data;
    }


    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sales,income,customer,status',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        switch ($request->type) {
            case 'sales':
                $reportData = $this->generateSalesReport($startDate, $endDate);
                $reportTitle = 'Laporan Penjualan';
                break;
            case 'income':
                $reportData = $this->generateIncomeReport($startDate, $endDate);
                $reportTitle = 'Laporan Pendapatan';
                break;
            case 'customer':
                $reportData = $this->generateCustomerReport($startDate, $endDate);
                $reportTitle = 'Laporan Pelanggan';
                break;
            case 'status':
                $reportData = $this->generateStatusReport($startDate, $endDate);
                $reportTitle = 'Laporan Status Transaksi';
                break;
            default:
                abort(404);
        }

        $report = [
            'type' => $request->type,
            'title' => $reportTitle,
            'description' => 'Laporan dibuat pada ' . now()->format('d M Y H:i'),
            'start_date' => $startDate->format('d M Y'),
            'end_date' => $endDate->format('d M Y'),
            'data' => $reportData
        ];


        $pdf = Pdf::loadView('pages.admin.reports.report_pdf', compact('report'));


        $filename = 'report-' . $request->type . '-' . $startDate->format('Y-m-d') . '.pdf';


        return $pdf->download($filename);
    }


    public function exportExcel(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sales,income,customer,status',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date)->endOfDay();


        $export = new ReportExport($request->type, $startDate, $endDate);


        $filename = 'report-' . $request->type . '-' . $startDate->format('Y-m-d') . '.xlsx';


        return Excel::download($export, $filename);
    }
}
