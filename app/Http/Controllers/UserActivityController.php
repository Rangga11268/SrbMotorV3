<?php

namespace App\Http\Controllers;

use App\Models\ServiceAppointment;
use App\Models\Transaction;
use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserActivityController extends Controller
{
    /**
     * Display the user's unified activity dashboard.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // 1. Fetch Service Appointments (Agenda Servis)
        $appointments = ServiceAppointment::where('user_id', $userId)
            ->latest()
            ->paginate(5, ['*'], 'services_page')
            ->withQueryString();

        // 2. Fetch Motor Orders (Pesanan Saya)
        // Including all transactions (CASH/CREDIT)
        $orders = Transaction::with(['motor', 'creditDetail.documents', 'creditDetail.surveySchedules', 'installments'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate(5, ['*'], 'orders_page')
            ->withQueryString();

        // 3. Fetch Active Installments (Cicilan Aktif)
        // Grouped by transaction for better UI display
        $installments = Transaction::with(['installments' => function ($query) {
                $query->orderBy('installment_number', 'asc');
            }, 'motor'])
            ->where('user_id', $userId)
            ->whereHas('installments')
            ->latest()
            ->get();

        return Inertia::render('User/Activity', [
            'appointments' => $appointments,
            'orders' => $orders,
            'installments' => $installments,
            'auth' => [
                'user' => Auth::user(),
            ],
            'filters' => $request->only(['tab']),
        ]);
    }
}
