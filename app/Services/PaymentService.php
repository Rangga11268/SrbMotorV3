<?php

namespace App\Services;

use App\Models\Installment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Unified processor for Midtrans payment status
     * Handles mapping, database updates, and notifications
     */
    public function updatePaymentStatus(Installment $installment, $midtransStatus)
    {
        $transactionStatus = $midtransStatus->transaction_status;
        $type = $midtransStatus->payment_type;
        $fraud = $midtransStatus->fraud_status;

        Log::info("Processing Midtrans Status update", [
            'installment_id' => $installment->id,
            'status' => $transactionStatus,
            'payment_type' => $type
        ]);

        // NEW: Fetch ALL installments with the same booking code to update them at once
        $bookingCode = $midtransStatus->order_id ?? $installment->midtrans_booking_code;
        $allRelated = Installment::where('midtrans_booking_code', $bookingCode)->get();

        foreach ($allRelated as $inst) {
            if ($transactionStatus == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $inst->update(['status' => 'waiting_approval']);
                    } else {
                        $this->markAsPaid($inst, 'midtrans_' . $type, $midtransStatus);
                    }
                }
            } else if ($transactionStatus == 'settlement') {
                $methodStr = 'midtrans_' . $type;
                
                // Refined method mapping
                if ($type == 'bank_transfer' && (isset($midtransStatus->va_numbers) || isset($midtransStatus->permata_va_number))) {
                    if (isset($midtransStatus->va_numbers) && count($midtransStatus->va_numbers) > 0) {
                        $bank = $midtransStatus->va_numbers[0]->bank ?? 'other';
                    } else {
                        $bank = 'permata';
                    }
                    $methodStr = 'midtrans_' . $bank . '_va';
                } else if ($type == 'gopay' || $type == 'shopeepay') {
                    $methodStr = 'midtrans_' . $type;
                } else if ($type == 'cstore') {
                    $store = $midtransStatus->store ?? 'store';
                    $methodStr = 'midtrans_' . $store;
                }
                
                $this->markAsPaid($inst, $methodStr, $midtransStatus);
            } else if ($transactionStatus == 'pending') {
                $inst->update(['status' => 'pending']);
            } else if ($transactionStatus == 'deny') {
                $inst->update(['status' => 'waiting_approval']);
            } else if ($transactionStatus == 'expire' || $transactionStatus == 'cancel') {
                $inst->update(['status' => 'overdue']);
            }
        }


        return $transactionStatus;
    }

    private function markAsPaid(Installment $installment, string $method, $midtransStatus)
    {
        // Avoid duplicate processing
        if ($installment->status === 'paid') {
            return;
        }

        DB::transaction(function () use ($installment, $method) {
            $installment->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $method
            ]);

            $transaction = $installment->transaction;
            if ($transaction) {
                // 1. Log the payment activity
                $transaction->logs()->create([
                    'status_from' => $transaction->status,
                    'status_to' => $transaction->status, // Use current status if not changing yet
                    'status' => $transaction->status,
                    'actor_id' => $transaction->user_id,
                    'actor_type' => \App\Models\User::class,
                    'notes' => "Pembayaran " . ($installment->installment_number == 0 ? "Booking Fee" : "Pelunasan") . " sukses via " . $method,
                    'description' => "Pembayaran terverifikasi Midtrans",
                ]);

                // Refresh to get latest installments count
                $unpaid = $transaction->installments()->where('status', '!=', 'paid')->count();
                $newStatus = null;

                if ($unpaid == 0) {
                    // ALL installments paid, or only one existed (meaning it was the full payment)
                    $newStatus = ($transaction->transaction_type == 'CASH') ? 'pembayaran_dikonfirmasi' : 'completed';
                    
                    // IF it was CASH and Booking Fee (0) was the ONLY installment, we may need to create the second one 
                    // unless it was a full payment.
                } elseif ($installment->installment_number === 0) {
                    // Stage: Booking Fee / DP paid
                    $newStatus = 'unit_preparation';
                }

                // CASE: CASH Transaction, Booking Fee (0) Paid, but no Installment 1 exists
                if ($transaction->transaction_type === 'CASH' && $installment->installment_number === 0) {
                    $hasInstallmentOne = $transaction->installments()->where('installment_number', 1)->exists();
                    $remainingBalance = (float) $transaction->final_price - (float) $transaction->booking_fee;
                    
                    if (!$hasInstallmentOne && $remainingBalance > 0) {
                        \App\Models\Installment::create([
                            'transaction_id' => $transaction->id,
                            'installment_number' => 1,
                            'amount' => $remainingBalance,
                            'due_date' => now()->addDays(7), // Default 7 days for full payment
                            'status' => 'unpaid',
                        ]);
                        Log::info("Auto-generated secondary installment for CASH Transaction #{$transaction->id}");
                        
                        // Log the generation
                        $transaction->logs()->create([
                            'status_from' => $transaction->status,
                            'status_to' => $transaction->status,
                            'status' => $transaction->status,
                            'actor_id' => $transaction->user_id,
                            'actor_type' => \App\Models\User::class,
                            'notes' => "Tagihan sisa pelunasan otomatis dibuat sebesar Rp " . number_format($remainingBalance, 0, ',', '.'),
                            'description' => "Sistem otomatis membuat tagihan sisa",
                        ]);
                    }
                }

                if ($newStatus) {
                    $oldStatus = $transaction->status;
                    $transaction->update(['status' => $newStatus]);
                    
                    // Log status change if it happened
                    if ($oldStatus !== $newStatus) {
                        $transaction->logs()->create([
                            'status_from' => $oldStatus,
                            'status_to' => $newStatus,
                            'status' => $newStatus,
                            'actor_id' => $transaction->user_id,
                            'actor_type' => \App\Models\User::class,
                            'notes' => "Status diperbarui otomatis setelah pembayaran: " . $transaction->status_text,
                            'description' => "Status Update Otomatis",
                        ]);
                    }

                    // Stock Management
                    $lockStatuses = ['payment_confirmed', 'pembayaran_dikonfirmasi', 'unit_preparation', 'ready_for_delivery', 'dalam_pengiriman', 'completed'];
                    if ($transaction->motor && in_array($newStatus, $lockStatuses)) {
                        $transaction->motor->update(['tersedia' => false]);
                        Log::info("Stock Locked via Service: Motor ID {$transaction->motor_id}");
                    }
                }
            }
        });

        // Send Notification after transaction is committed
        $this->notifyUser($installment);
    }

    private function notifyUser(Installment $installment)
    {
        try {
            $transaction = $installment->transaction;
            $user = $transaction->user;
            $motorName = $transaction->motor->name ?? 'Motor';
            $amountStr = "Rp " . number_format($installment->amount, 0, ',', '.');
            
            if ($installment->installment_number == 0) {
                $typeLabel = $transaction->transaction_type === 'CASH' ? 'Booking Fee' : 'Uang Muka (DP)';
            } else {
                $typeLabel = "Cicilan ke-{$installment->installment_number}";
            }

            $phone = $transaction->phone ?? $user->phone;
            if ($phone) {
                $msg = "Halo *{$transaction->name}*,\n\n"
                    . "Terima kasih! Pembayaran *{$typeLabel}* Anda untuk unit *{$motorName}* sebesar *{$amountStr}* via Midtrans telah berhasil diverifikasi.\n\n"
                    . "Status pembayaran: *LUNAS*\n\n"
                    . "Status pesanan Anda saat ini: *" . $transaction->status_text . "*\n\n"
                    . "- SRB Motor System";
                
                \App\Services\WhatsAppService::sendMessage($phone, $msg);
            }
        } catch (\Exception $e) {
            Log::error('Notification Error in PaymentService: ' . $e->getMessage());
        }
    }
}
