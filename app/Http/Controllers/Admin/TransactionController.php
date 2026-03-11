<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Motor;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display list of cash (tunai) transactions
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Transaction::whereDoesntHave('creditDetail')
            ->with(['user', 'motor'])
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($subQ) use ($search) {
                        $subQ->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $transactions = $query->paginate(15);

        // Get count by status for filters
        $statusCounts = Transaction::whereDoesntHave('creditDetail')
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'statuses' => $statusCounts->keys()->toArray(),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show transaction detail
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'motor', 'payments']);

        $motors = Motor::all();
        $users = User::whereHas('roles', function ($query) {
            $query->where('name', 'customer');
        })->get();

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction,
            'motors' => $motors,
            'users' => $users,
        ]);
    }

    /**
     * Show create transaction form
     */
    public function create()
    {
        $motors = Motor::all();
        $users = User::whereHas('roles', function ($query) {
            $query->where('name', 'customer');
        })->get();

        return Inertia::render('Admin/Transactions/Create', [
            'motors' => $motors,
            'users' => $users,
        ]);
    }

    /**
     * Store new transaction
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'motor_id' => 'required|exists:motors,id',
            'booking_fee' => 'required|numeric|min:0',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|string|in:new_order,waiting_payment,payment_confirmed,unit_preparation,ready_for_delivery,completed,cancelled',
        ]);

        // Get motor and calculate total
        $motor = Motor::findOrFail($validated['motor_id']);
        $final_price = $motor->price + $validated['booking_fee'];

        // Create transaction
        $transaction = Transaction::create([
            'user_id' => $validated['user_id'],
            'motor_id' => $validated['motor_id'],
            'reference_number' => 'TRX-' . strtoupper(uniqid()),
            'final_price' => $final_price,
            'motor_price' => $motor->price,
            'address' => $validated['address'],
            'total_price' => $final_price,
            'notes' => $validated['notes'],
            'status' => $validated['status'],
            'transaction_type' => 'cash',
        ]);

        return redirect()->route('admin.transactions.show', $transaction)
            ->with('success', 'Transaksi berhasil dibuat');
    }

    /**
     * Show edit transaction form (redirects to show)
     */
    public function edit(Transaction $transaction)
    {
        // Redirect to show page with edit mode
        return redirect()->route('admin.transactions.show', $transaction);
    }

    /**
     * Update transaction
     */
    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'motor_id' => 'required|exists:motors,id',
            'booking_fee' => 'required|numeric|min:0',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|string|in:new_order,waiting_payment,payment_confirmed,unit_preparation,ready_for_delivery,completed,cancelled',
        ]);

        // Get motor and calculate total
        $motor = Motor::findOrFail($validated['motor_id']);
        $final_price = $motor->price + $validated['booking_fee'];

        $transaction->update([
            'user_id' => $validated['user_id'],
            'motor_id' => $validated['motor_id'],
            'final_price' => $final_price,
            'motor_price' => $motor->price,
            'address' => $validated['address'],
            'total_price' => $final_price,
            'notes' => $validated['notes'],
            'status' => $validated['status'],
            'transaction_type' => 'cash',
        ]);

        return redirect()->route('admin.transactions.show', $transaction)
            ->with('success', 'Transaksi berhasil diperbarui');
    }

    /**
     * Delete transaction
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaksi berhasil dihapus');
    }

    /**
     * Update transaction status (for quick updates)
     */
    public function updateStatus(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new_order,waiting_payment,payment_confirmed,unit_preparation,ready_for_delivery,completed,cancelled',
        ]);

        $oldStatus = $transaction->status;
        $newStatus = $validated['status'];

        // Only update and notify if status actually changed
        if ($oldStatus !== $newStatus) {
            $transaction->update([
                'status' => $newStatus,
            ]);

            // Send notification to user
            $transaction->user->notify(new \App\Notifications\TransactionStatusChanged($transaction));
        }

        return back()->with('success', 'Status transaksi berhasil diperbarui' . ($oldStatus === $newStatus ? ' (tidak ada perubahan)' : ' dan notifikasi dikirim ke customer'));
    }
}
