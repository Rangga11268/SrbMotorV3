<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Installment;
use App\Models\Transaction;
use App\Models\ServiceAppointment;
use Midtrans\Config;
use Midtrans\Notification;

class PaymentCallbackController extends Controller
{
    public function handle(Request $request, \App\Services\PaymentService $paymentService)
    {
        \Log::info('Midtrans Webhook Received', ['payload' => $request->all()]);
        
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('midtrans.is_3ds');

        try {
            $notification = new \Midtrans\Notification();

            $status = $notification->transaction_status;
            $orderId = $notification->order_id;
            
            // Signature validation
            $grossAmount = $notification->gross_amount;
            $statusCode = $notification->status_code;
            $serverKey = config('midtrans.server_key');
            
            $inputSignature = $notification->signature_key ?? '';
            $calculatedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
            
            if ($inputSignature !== $calculatedSignature) {
                \Log::warning('Midtrans Webhook: Invalid signature key detected.');
                return response()->json(['message' => 'Invalid signature key'], 403);
            }

            // ---- SERVICE APPOINTMENT LOGIC ----
            $parts = explode('-', $orderId);
            if (count($parts) >= 3 && $parts[0] === 'TRX' && $parts[1] === 'SRB') {
                $appointmentId = $parts[2];
                $appointment = ServiceAppointment::find($appointmentId);

                if ($appointment) {
                    $transactionStatus = $notification->transaction_status;
                    $paymentType = $notification->payment_type;
                    $fraudStatus = $notification->fraud_status;

                    if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                        if ($fraudStatus == 'challenge') {
                            $appointment->update(['payment_status' => 'pending']);
                        } else {
                            $appointment->update([
                                'payment_status' => 'paid',
                                'paid_at' => \Carbon\Carbon::now(),
                                'payment_method' => 'Midtrans: ' . $paymentType,
                            ]);
                        }
                    } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                        $appointment->update([
                            'snap_token' => null, 
                            'payment_status' => 'unpaid'
                        ]);
                    }
                    return response()->json(['message' => 'Service payment status updated']);
                }
                return response()->json(['message' => 'Service appointment not found'], 404);
            }

            // ---- EXISTING INSTALLMENT LOGIC ----
            // Lookup installments by booking code (reliable for both single and multi-payments)
            $installments = Installment::where('midtrans_booking_code', $orderId)->get();

            if ($installments->isEmpty()) {
                \Log::error('Midtrans Webhook Error: No installments found for booking code', ['order_id' => $orderId]);
                return response()->json(['message' => 'Installment not found'], 404);
            }

            // Unified processing via Service for each involved installment
            foreach ($installments as $installment) {
                $paymentService->updatePaymentStatus($installment, $notification);
            }

            return response()->json(['message' => 'Payment status updated']);

        } catch (\Exception $e) {
            \Log::error('Midtrans Webhook Processing Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification', 'error' => $e->getMessage()], 500);
        }
    }
}
