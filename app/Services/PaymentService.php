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

        if ($transactionStatus == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $installment->update(['status' => 'waiting_approval']);
                } else {
                    $this->markAsPaid($installment, 'midtrans_' . $type, $midtransStatus);
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
            
            $this->markAsPaid($installment, $methodStr, $midtransStatus);
        } else if ($transactionStatus == 'pending') {
            $installment->update(['status' => 'pending']);
        } else if ($transactionStatus == 'deny') {
            $installment->update(['status' => 'waiting_approval']);
        } else if ($transactionStatus == 'expire' || $transactionStatus == 'cancel') {
            $installment->update(['status' => 'overdue']);
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
                // Refresh to get latest installments count
                $unpaid = $transaction->installments()->where('status', '!=', 'paid')->count();
                $newStatus = null;

                if ($unpaid == 0) {
                    $newStatus = ($transaction->transaction_type == 'CASH') ? 'pembayaran_dikonfirmasi' : 'completed';
                } elseif ($installment->installment_number === 0) {
                    // Stage: Booking Fee / DP paid
                    $newStatus = 'unit_preparation';
                }

                if ($newStatus) {
                    $transaction->update(['status' => $newStatus]);
                    
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
