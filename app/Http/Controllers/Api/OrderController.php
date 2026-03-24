<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Motor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Transaction::where('user_id', $request->user()->id)
            ->with('motor')
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
            'customer_occupation' => 'required|string',
            'customer_address' => 'required|string',
        ]);

        $motor = Motor::findOrFail($request->motor_id);

        $order = Transaction::create([
            'user_id' => $request->user()->id,
            'motor_id' => $request->motor_id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_occupation' => $request->customer_occupation,
            'customer_address' => $request->customer_address,
            'notes' => $request->notes,
            'transaction_type' => 'CASH',
            'status' => 'new_order',
            'total_price' => $motor->price,
            'reference_number' => 'ORD-' . strtoupper(uniqid()),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pesanan berhasil dibuat',
            'order_id' => $order->id
        ], 201);
    }

    public function show($id, Request $request)
    {
        $order = Transaction::where('user_id', $request->user()->id)
            ->with('motor')
            ->findOrFail($id);

        return response()->json($order);
    }
}
