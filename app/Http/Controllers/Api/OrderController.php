<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Motor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Installment;
use Midtrans\Config;
use Midtrans\Snap;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Transaction::where('user_id', $request->user()->id)
            ->with(['motor', 'installments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function storeCashOrder(Request $request)
    {
        $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_email' => 'nullable|email',
            'customer_nik' => 'required|string',
            'customer_address' => 'required|string',
            'motor_color' => 'required|string',
            'delivery_method' => 'required|string',
            'payment_method' => 'required|string',
            'booking_fee' => 'nullable|numeric|min:0',
        ]);

        $motor = Motor::findOrFail($request->motor_id);

        if ($request->booking_fee && $request->booking_fee >= $motor->price) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking fee tidak boleh melebihi atau sama dengan harga motor'
            ], 422);
        }

        $order = Transaction::create([
            'user_id' => $request->user()->id,
            'motor_id' => $request->motor_id,
            'name' => $request->customer_name,
            'phone' => $request->customer_phone,
            'email' => $request->customer_email,
            'nik' => $request->customer_nik,
            'address' => $request->customer_address,
            'motor_color' => $request->motor_color,
            'delivery_method' => $request->delivery_method,
            'payment_method' => $request->payment_method,
            'booking_fee' => $request->booking_fee ?? 0,
            'notes' => $request->notes,
            'transaction_type' => 'CASH',
            'status' => 'new_order',
            'motor_price' => $motor->price,
            'total_price' => $motor->price,
            'final_price' => $motor->price,
            'reference_number' => 'ORD-' . strtoupper(uniqid()),
        ]);

        // Create initial installment (number 0) for the amount to be paid
        $paymentAmount = ($request->booking_fee > 0) ? $request->booking_fee : $motor->price;
        
        $installment = Installment::create([
            'transaction_id' => $order->id,
            'installment_number' => 0,
            'amount' => $paymentAmount,
            'due_date' => now(),
            'status' => 'pending',
            'payment_method' => $request->payment_method,
        ]);

        $snapToken = null;
        $redirectUrl = null;

        // Generate Midtrans Snap Token if payment method is Transfer Bank
        if ($request->payment_method === 'Transfer Bank') {
            try {
                Config::$serverKey = config('midtrans.server_key');
                Config::$isProduction = config('midtrans.is_production');
                Config::$isSanitized = config('midtrans.is_sanitized');
                Config::$is3ds = config('midtrans.is_3ds');

                $orderId = 'INST-' . $installment->id . '-' . time();
                
                $params = [
                    'transaction_details' => [
                        'order_id' => $orderId,
                        'gross_amount' => (int) $paymentAmount,
                    ],
                    'customer_details' => [
                        'first_name' => $request->customer_name,
                        'email' => $request->customer_email ?? $request->user()->email,
                        'phone' => $request->customer_phone,
                    ],
                    'item_details' => [
                        [
                            'id' => 'MOTOR-' . $motor->id,
                            'price' => (int) $paymentAmount,
                            'quantity' => 1,
                            'name' => ($request->booking_fee > 0 ? 'Booking Fee ' : 'Full Payment ') . $motor->name,
                        ]
                    ],
                ];

                $response = Snap::createTransaction($params);
                $snapToken = $response->token;
                $redirectUrl = $response->redirect_url;

                $installment->update([
                    'snap_token' => $snapToken,
                    'midtrans_booking_code' => $orderId,
                ]);
            } catch (\Exception $e) {
                \Log::error('Midtrans Snap Error (Mobile): ' . $e->getMessage());
                // Fallback: order created but snap failed
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pesanan berhasil dibuat',
            'order_id' => $order->id,
            'snap_token' => $snapToken,
            'redirect_url' => $redirectUrl,
        ], 201);
    }

    public function show($id, Request $request)
    {
        $order = Transaction::where('user_id', $request->user()->id)
            ->with(['motor', 'installments'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function cancel(Transaction $order, Request $request)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $creditService = app(\App\Services\CreditService::class);
        $result = $creditService->cancelByCustomer($order, $request->reason);

        if ($result['success']) {
            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan berhasil dibatalkan',
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => $result['message'],
            ], 422);
        }
    }
}
