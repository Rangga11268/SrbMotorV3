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
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($subQ) use ($search) {
                        $subQ->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('motor', function ($motorQ) use ($search) {
                        $motorQ->where('name', 'like', "%{$search}%")
                            ->orWhere('brand', 'like', "%{$search}%")
                            ->orWhere('type', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $transactions = $query->paginate(15)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($transactions);
        }

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
        $transaction->load(['user', 'motor', 'installments', 'creditDetail', 'logs.actor']);

        $motors = Motor::all();
        $users = User::where('role', 'user')->get();

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
        $users = User::where('role', 'user')->get();

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
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'motor_color' => 'nullable|string',
            'delivery_method' => 'nullable|string',
            'booking_fee' => 'required|numeric|min:0',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|string|in:new_order,waiting_payment,pembayaran_dikonfirmasi,unit_preparation,ready_for_delivery,dalam_pengiriman,completed,cancelled',
        ]);

        // Get motor and calculate total
        $motor = Motor::findOrFail($validated['motor_id']);
        $transaction = Transaction::create([
            'user_id' => $validated['user_id'],
            'motor_id' => $validated['motor_id'],
            'reference_number' => 'TRX-' . strtoupper(uniqid()),
            'final_price' => $motor->price,
            'motor_price' => $motor->price,
            'booking_fee' => $validated['booking_fee'],
            'address' => $request->address,
            'total_price' => $motor->price,
            'notes' => $request->notes,
            'status' => $validated['status'],
            'transaction_type' => 'CASH',
            'name' => $validated['name'],
            'nik' => $request->nik,
            'phone' => $request->phone,
            'email' => $request->email,
            'motor_color' => $request->motor_color,
            'delivery_method' => $request->delivery_method,
        ]);

        // Stock Locking: If created with a "lock" status
        $lockStatuses = ['pembayaran_dikonfirmasi', 'unit_preparation', 'ready_for_delivery', 'dalam_pengiriman', 'completed'];
        if (in_array($validated['status'], $lockStatuses)) {
            $motor->update(['tersedia' => false]);
            \Illuminate\Support\Facades\Log::info("Stock Locked for Motor ID: {$motor->id} (Manual Cash Order Creation)");
        }

        $transaction->logs()->create([
            'status_from' => null,
            'status_to' => $validated['status'],
            'status' => $validated['status'],
            'actor_id' => auth()->id(),
            'actor_type' => \App\Models\User::class,
            'notes' => 'Transaksi tunai dibuat manual oleh admin',
            'description' => 'Transaksi tunai dibuat manual oleh admin',
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
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'motor_color' => 'nullable|string',
            'delivery_method' => 'nullable|string',
            'booking_fee' => 'required|numeric|min:0',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|string|in:new_order,waiting_payment,pembayaran_dikonfirmasi,unit_preparation,ready_for_delivery,dalam_pengiriman,completed,cancelled',
            'delivery_date' => 'nullable|date',
        ]);

        $oldStatus = $transaction->status;

        // Get motor and calculate total
        $motor = Motor::findOrFail($validated['motor_id']);
        $transaction->update([
            'user_id' => $validated['user_id'],
            'motor_id' => $validated['motor_id'],
            'final_price' => $motor->price,
            'motor_price' => $motor->price,
            'booking_fee' => $validated['booking_fee'],
            'address' => $request->address,
            'total_price' => $motor->price,
            'notes' => $request->notes,
            'status' => $validated['status'],
            'name' => $validated['name'],
            'nik' => $request->nik,
            'phone' => $request->phone,
            'email' => $request->email,
            'motor_color' => $request->motor_color,
            'delivery_method' => $request->delivery_method,
            'delivery_date' => $request->delivery_date,
        ]);

        // Stock Balancing: Update motor availability based on status change
        $lockStatuses = ['pembayaran_dikonfirmasi', 'unit_preparation', 'ready_for_delivery', 'dalam_pengiriman', 'completed'];
        $unlockStatuses = ['new_order', 'waiting_payment', 'cancelled'];

        if (in_array($validated['status'], $lockStatuses)) {
            $motor->update(['tersedia' => false]);
            \Illuminate\Support\Facades\Log::info("Stock Locked: Motor ID {$motor->id} (Manual Cash Order Update)");
        } elseif (in_array($validated['status'], $unlockStatuses)) {
            $motor->update(['tersedia' => true]);
            \Illuminate\Support\Facades\Log::info("Stock Unlocked: Motor ID {$motor->id} (Manual Cash Order Update)");
        }

        if ($oldStatus !== $validated['status']) {
            $transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => $validated['status'],
                'status' => $validated['status'],
                'actor_id' => auth()->id(),
                'actor_type' => \App\Models\User::class,
                'notes' => 'Status diperbarui oleh admin melalui form edit',
                'description' => 'Status diperbarui oleh admin melalui form edit',
            ]);
        }

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
            'status' => 'required|string|in:new_order,waiting_payment,pembayaran_dikonfirmasi,unit_preparation,ready_for_delivery,dalam_pengiriman,completed,cancelled',
        ]);

        $oldStatus = $transaction->status;
        $newStatus = $validated['status'];

        // Only update and notify if status actually changed
        if ($oldStatus !== $newStatus) {
            $transaction->update([
                'status' => $newStatus,
            ]);

            $transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => $newStatus,
                'status' => $newStatus,
                'actor_id' => auth()->id(),
                'actor_type' => \App\Models\User::class,
                'notes' => 'Status diperbarui cepat oleh admin',
                'description' => 'Status diperbarui cepat oleh admin',
            ]);

            // Stock Balancing: Update motor availability based on status change
            $lockStatuses = ['pembayaran_dikonfirmasi', 'unit_preparation', 'ready_for_delivery', 'dalam_pengiriman', 'completed'];
            $unlockStatuses = ['new_order', 'waiting_payment', 'cancelled'];

            if (in_array($newStatus, $lockStatuses)) {
                $transaction->motor->update(['tersedia' => false]);
                \Illuminate\Support\Facades\Log::info("Stock Locked: Motor ID {$transaction->motor_id} (Manual Cash Status Quick Update)");
            } elseif (in_array($newStatus, $unlockStatuses)) {
                $transaction->motor->update(['tersedia' => true]);
                \Illuminate\Support\Facades\Log::info("Stock Unlocked: Motor ID {$transaction->motor_id} (Manual Cash Status Quick Update)");
            }

            // Send notification to user
            $transaction->user->notify(new \App\Notifications\TransactionStatusChanged($transaction));

            // WhatsApp Notification
            try {
                $statusLabels = [
                    'pembayaran_dikonfirmasi' => 'Pembayaran Anda telah dikonfirmasi/lunas',
                    'unit_preparation' => 'Unit motor Anda sedang disiapkan oleh tim teknis kami',
                    'ready_for_delivery' => 'Unit motor Anda telah siap untuk dikirim atau diambil di dealer',
                    'dalam_pengiriman' => 'Unit motor Anda sedang dalam perjalanan menuju alamat Anda',
                    'completed' => 'Transaksi Anda telah selesai. Terima kasih!',
                    'cancelled' => 'Mohon maaf, transaksi Anda telah dibatalkan',
                ];

                $phone = $transaction->phone ?? $transaction->user->phone;
                if ($phone && isset($statusLabels[$newStatus])) {
                    $msg = "Halo *{$transaction->name}*,\n\nStatus pesanan motor *{$transaction->motor->name}* Anda telah diperbarui menjadi:\n\n👉 *{$statusLabels[$newStatus]}*\n\nSilakan cek detail pesanan Anda di website SRB Motor.\n\nTerima kasih atas kepercayaan Anda.\n- SRB Motor";
                    \App\Services\WhatsAppService::sendMessage($phone, $msg);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('WA Direct Status Update Error: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Status transaksi berhasil diperbarui' . ($oldStatus === $newStatus ? ' (tidak ada perubahan)' : ' dan notifikasi dikirim ke customer'));
    }
}
