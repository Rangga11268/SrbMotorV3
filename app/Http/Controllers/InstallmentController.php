<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Installment;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

use Midtrans\Transaction as MidtransTransaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class InstallmentController extends Controller
{

    public function downloadReceipt(Installment $installment)
    {
        if ($installment->transaction->user_id !== Auth::id()) {
            abort(403);
        }

        if ($installment->status !== 'paid') {
            return redirect()->back()->with('error', 'Kuitansi hanya tersedia untuk cicilan yang sudah lunas.');
        }

        $pdf = Pdf::loadView('installments.receipt', compact('installment'));
        return $pdf->download('kuitansi-pembayaran-cicilan-' . $installment->installment_number . '.pdf');
    }
    public function checkPaymentStatus(Installment $installment, \App\Services\PaymentService $paymentService)
    {
        if ($installment->transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        if (!$installment->midtrans_booking_code) {
            return response()->json(['message' => 'Belum ada riwayat pembayaran online'], 404);
        }

        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');

        try {
            $status = \Midtrans\Transaction::status($installment->midtrans_booking_code);
            $transactionStatus = $paymentService->updatePaymentStatus($installment, $status);

            return response()->json([
                'status' => $transactionStatus,
                'message' => 'Status pembayaran diperbarui: ' . $transactionStatus
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Check Status Midtrans Error: ' . $e->getMessage(), [
                'installment_id' => $installment->id,
                'booking_code' => $installment->midtrans_booking_code,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function payMultiple(Request $request)
    {
        $request->validate([
            'installment_ids' => 'required|array|min:1',
            'installment_ids.*' => 'exists:installments,id',
        ]);

        $installments = Installment::whereIn('id', $request->installment_ids)
            ->whereHas('transaction', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->where('status', '!=', 'paid')
            ->get();

        if ($installments->isEmpty()) {
            return response()->json(['error' => 'Tidak ada cicilan yang valid untuk dibayar'], 400);
        }

        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $totalAmount = $installments->sum(function ($inst) {
            return $inst->amount + $inst->penalty_amount;
        });

        // Use the first installment's transaction ID for grouping
        $transaction = $installments->first()->transaction;
        $orderId = 'MULTI-' . time() . '-' . $transaction->id;

        $itemDetails = [];
        foreach ($installments as $inst) {
            $itemDetails[] = [
                'id' => 'INST-' . $inst->id,
                'price' => (int) ($inst->amount + $inst->penalty_amount),
                'quantity' => 1,
                'name' => substr('Cicilan Ke-' . $inst->installment_number . ' ' . ($transaction->motor->name ?? 'Motor'), 0, 50),
            ];
        }

        $isMobile = $request->wantsJson() || $request->is('api/*');
        $callbackRoute = $isMobile ? 'payments.success' : 'installments.index';
        $callbackParams = $isMobile ? [
            'source' => 'mobile',
            'transaction_id' => $transaction->id,
            'installment_ids' => $installments->pluck('id')->implode(',')
        ] : [];

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $totalAmount,
            ],
            'customer_details' => [
                'first_name' => $transaction->name ?? Auth::user()->name ?? 'Customer',
                'email' => Auth::user()->email ?? 'customer@example.com',
            ],
            'item_details' => $itemDetails,
            'callbacks' => [
                'finish' => route($callbackRoute, $callbackParams),
                'error' => route($callbackRoute, array_merge($callbackParams, ['status' => 'error'])),
                'pending' => route($callbackRoute, array_merge($callbackParams, ['status' => 'pending'])),
            ]
        ];

        try {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds = config('midtrans.is_3ds');

            $snapResponse = \Midtrans\Snap::createTransaction($params);
            $snapToken = $snapResponse->token;
            $redirectUrl = $snapResponse->redirect_url;

            // Update all selected installments with the same booking code and token
            foreach ($installments as $inst) {
                $inst->update([
                    'snap_token' => $snapToken,
                    'midtrans_booking_code' => $orderId
                ]);
            }

            return response()->json([
                'snap_token' => $snapToken,
                'redirect_url' => $redirectUrl
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Midtrans Multiple Pay Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createPayment(Installment $installment)
    {
        if ($installment->transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $orderId = 'INST-' . $installment->id . '-' . time();

        $isMobile = request()->wantsJson() || request()->is('api/*');
        
        // For mobile: use custom deep link scheme so browser redirects back to the app
        // For web: use the installments index route
        if ($isMobile) {
            $transactionId = $installment->transaction->id;
            $finishUrl = 'srbmotor://payment-success?transaction_id=' . $transactionId . '&installment_id=' . $installment->id;
            $errorUrl  = 'srbmotor://payment-error?transaction_id=' . $transactionId . '&installment_id=' . $installment->id;
            $pendingUrl = 'srbmotor://payment-pending?transaction_id=' . $transactionId . '&installment_id=' . $installment->id;
        } else {
            $finishUrl  = route('installments.index');
            $errorUrl   = route('installments.index', ['status' => 'error']);
            $pendingUrl = route('installments.index', ['status' => 'pending']);
        }

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) ($installment->amount + $installment->penalty_amount),
            ],
            'customer_details' => [
                'first_name' => $installment->transaction->name ?? Auth::user()->name ?? 'Customer',
                'email' => Auth::user()->email ?? 'customer@example.com',
            ],
            'item_details' => [
                [
                    'id' => 'INST-' . $installment->id,
                    'price' => (int) ($installment->amount + $installment->penalty_amount),
                    'quantity' => 1,
                    'name' => substr(($installment->installment_number == 0 ? 'DP ' : 'Cicilan Ke-' . $installment->installment_number . ' ') . ($installment->transaction->motor->name ?? 'Motor') . ($installment->penalty_amount > 0 ? ' (+Denda)' : ''), 0, 50),
                ]
            ],
            'callbacks' => [
                'finish'  => $finishUrl,
                'error'   => $errorUrl,
                'pending' => $pendingUrl,
            ]
        ];

        try {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds = config('midtrans.is_3ds');

            $snapResponse = \Midtrans\Snap::createTransaction($params);
            $snapToken = $snapResponse->token;
            $redirectUrl = $snapResponse->redirect_url;

            $installment->update([
                'snap_token' => $snapToken,
                'midtrans_booking_code' => $orderId
            ]);

            return response()->json([
                'snap_token' => $snapToken,
                'redirect_url' => $redirectUrl,
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Midtrans Create Payment Error: ' . $e->getMessage(), [
                'installment_id' => $installment->id,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
        $transactions = Transaction::with(['installments' => function ($query) {
                $query->orderBy('installment_number', 'asc');
            }, 'motor'])
            ->where('user_id', Auth::id())
            ->whereHas('installments')
            ->latest()
            ->get();

        return Inertia::render('Installments/Index', [
            'transactions' => $transactions
        ]);
    }

    public function paymentSuccess(Request $request)
    {
        return View::make('payments.success', [
            'order_id' => $request->query('order_id'),
            'transaction_id' => $request->query('transaction_id'),
            'installment_id' => $request->query('installment_id'),
            'installment_ids' => $request->query('installment_ids'),
            'status' => $request->query('status')
        ]);
    }


    public function store(Request $request, Installment $installment)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'payment_method' => 'required|string',
        ]);


        if ($installment->transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            $installment->update([
                'payment_proof' => $path,
                'payment_method' => $request->payment_method,
                'status' => 'waiting_approval',
                'paid_at' => now(),
            ]);


            try {
                $adminPhone = config('services.fonnte.admin_phone');
                if ($adminPhone) {
                    $user = Auth::user();
                    $motor = $installment->transaction->motor->name;

                    if ($installment->installment_number == 0) {
                        $typeLabel = $installment->transaction->transaction_type === 'CASH' ? 'Booking Fee' : 'Uang Muka (DP)';
                    } else {
                        $typeLabel = "Cicilan Ke-{$installment->installment_number}";
                    }

                    $msg = "*[ADMIN] Bukti Pembayaran Baru*\n\nUser: {$user->name}\nUnit: {$motor}\nJenis: {$typeLabel}\n\nSegera verifikasi di dashboard.";
                    \App\Services\WhatsAppService::sendMessage($adminPhone, $msg);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('WA Error: ' . $e->getMessage());
            }

            return redirect()->back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
        }

        return redirect()->back()->with('error', 'Gagal mengunggah bukti pembayaran.');
    }


    public function approve(Installment $installment)
    {
        if ($installment->status !== 'waiting_approval') {
            return redirect()->back()->with('error', 'Cicilan ini tidak dalam status menunggu persetujuan.');
        }

        $installment->update([
            'status' => 'paid',
        ]);

        // Stock Locking: If DP/Booking Fee (0) paid, mark motor as unavailable
        if ($installment->installment_number == 0) {
            $transaction = $installment->transaction;
            if ($transaction && $transaction->motor) {
                $transaction->motor->update(['tersedia' => false]);
                \Illuminate\Support\Facades\Log::info("Stock Locked for Motor ID: {$transaction->motor_id} due to payment of installment 0 for Transaction ID: {$transaction->id}");
            }
        }


        try {
            $user = $installment->transaction->user;
            if ($user && $user->phone) {
                $phone = $installment->transaction->phone ?? $user->phone;

                if ($phone) {
                    if ($installment->installment_number == 0) {
                        $typeLabel = $installment->transaction->transaction_type === 'CASH' ? 'Booking Fee' : 'Uang Muka (DP)';
                    } else {
                        $typeLabel = "cicilan ke-{$installment->installment_number}";
                    }

                    $msg = "Halo {$user->name},\n\nPembayaran *{$typeLabel}* Anda telah *DIVERIFIKASI/DITERIMA*.\n\nTerima kasih atas pembayarannya.\n\n- SRB Motor";
                    \App\Services\WhatsAppService::sendMessage($phone, $msg);
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Error: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Pembayaran cicilan berhasil diverifikasi.');
    }


    public function reject(Installment $installment)
    {
        if ($installment->status !== 'waiting_approval') {
            return redirect()->back()->with('error', 'Cicilan ini tidak dalam status menunggu persetujuan.');
        }

        $installment->update([
            'status' => 'pending',
        ]);


        try {
            $user = $installment->transaction->user;
            $phone = $installment->transaction->phone ?? $user->phone;

            if ($phone) {
                if ($installment->installment_number == 0) {
                    $typeLabel = $installment->transaction->transaction_type === 'CASH' ? 'Booking Fee' : 'Uang Muka (DP)';
                } else {
                    $typeLabel = "cicilan ke-{$installment->installment_number}";
                }

                $msg = "Halo {$user->name},\n\nMohon maaf, bukti pembayaran *{$typeLabel}* Anda *DITOLAK* (tidak valid/buram).\n\nSilakan unggah ulang bukti yang valid.\n\n- SRB Motor";
                \App\Services\WhatsAppService::sendMessage($phone, $msg);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Error: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Pembayaran cicilan ditolak. User dapat mengupload ulang bukti.');
    }
}
