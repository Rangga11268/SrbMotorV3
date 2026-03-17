<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\CreditDetail;
use App\Models\Installment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Mail\CreditStatusUpdated;
use App\Services\WhatsAppService;

class TransactionService
{
    /**
     * Create a new transaction.
     */
    public function createTransaction(array $data): Transaction
    {
        $transactionData = array_intersect_key($data, array_flip([
            'user_id',
            'motor_id',
            'reference_number',
            'transaction_type',
            'status',
            'motor_price',
            'phone',
            'address',
            'payment_method',
            'payment_date',
            'payment_proof',
            'notes',
        ]));

        $transaction = Transaction::create($transactionData);

        if ($data['transaction_type'] === 'CREDIT' && isset($data['credit_detail'])) {
            $this->handleCreditDetail($transaction, $data['credit_detail']);
        }

        return $transaction;
    }

    /**
     * Update an existing transaction.
     */
    public function updateTransaction(Transaction $transaction, array $data): Transaction
    {
        $transactionData = array_intersect_key($data, array_flip([
            'user_id',
            'motor_id',
            'reference_number',
            'transaction_type',
            'status',
            'motor_price',
            'phone',
            'address',
            'payment_method',
            'payment_date',
            'payment_proof',
            'notes',
        ]));

        $transaction->update($transactionData);

        if ($data['transaction_type'] === 'CREDIT' && isset($data['credit_detail'])) {
            $this->handleCreditDetail($transaction, $data['credit_detail']);
        } elseif ($data['transaction_type'] === 'CASH' && $transaction->creditDetail) {
            // Remove credit detail if transaction type changed from credit to cash
            $this->deleteCreditDetail($transaction->creditDetail);
        }

        // Send notifications if status changed or credit status changed
        $shouldNotify = isset($data['status']) ||
            (isset($data['credit_detail']) && isset($data['credit_detail']['credit_status']));

        if ($shouldNotify) {
            $this->sendStatusNotification($transaction, $data);
        }

        return $transaction;
    }

    /**
     * Handle Create/Update of Credit Detail.
     */
    protected function handleCreditDetail(Transaction $transaction, array $creditData): void
    {
        $creditData['transaction_id'] = $transaction->id;

        if ($transaction->creditDetail) {
            $transaction->creditDetail->update($creditData);
        } else {
            CreditDetail::create($creditData);
        }

        // Generate Installments if Approved
        if (isset($creditData['status']) && $creditData['status'] === 'disetujui') {
            $this->generateInstallments($transaction, $creditData);
        }
    }

    /**
     * Generate Installments for a transaction.
     */
    public function generateInstallments(Transaction $transaction, array $creditData): void
    {
        // Wrap in DB transaction with pessimistic locking to prevent concurrent duplicate generation
        \Illuminate\Support\Facades\DB::transaction(function () use ($transaction, $creditData) {
            // Lock the transaction row to prevent race conditions
            $lockedTransaction = Transaction::lockForUpdate()->find($transaction->id);

            // Only generate if no installments exist
            if ($lockedTransaction->installments()->count() === 0) {
                // 1. Create Down Payment Installment (Installment 0)
                Installment::create([
                    'transaction_id' => $lockedTransaction->id,
                    'installment_number' => 0, // 0 indicates Down Payment
                    'amount' => $creditData['dp_amount'] ?? $creditData['down_payment'],
                    'due_date' => now(), // Due immediately
                    'status' => 'pending',
                ]);

                // 2. Create Monthly Installments
                $amount = $creditData['monthly_installment'];
                $tenor = $creditData['tenor'];

                for ($i = 1; $i <= $tenor; $i++) {
                    Installment::create([
                        'transaction_id' => $lockedTransaction->id,
                        'installment_number' => $i,
                        'amount' => $amount,
                        'due_date' => now()->addMonths($i),
                        'status' => 'pending',
                    ]);
                }
            }
        });
    }

    /**
     * Delete Transaction and clean up resources.
     */
    public function deleteTransaction(Transaction $transaction): void
    {
        if ($transaction->creditDetail) {
            $this->deleteCreditDetail($transaction->creditDetail);
        }

        $transaction->delete();
    }

    /**
     * Delete Credit Detail and associated Documents.
     */
    protected function deleteCreditDetail(CreditDetail $creditDetail): void
    {
        if ($creditDetail->documents) {
            foreach ($creditDetail->documents as $document) {
                if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                    Storage::disk('public')->delete($document->file_path);
                }
                $document->delete();
            }
        }
        $creditDetail->delete();
    }

    /**
     * Send Status Notifications (Email & WhatsApp).
     */
    protected function sendStatusNotification(Transaction $transaction, array $data): void
    {
        $transaction->refresh(); // Reload to get latest relationships

        // Email Notification
        if ($transaction->user && $transaction->user->email) {
            Mail::to($transaction->user)->send(new CreditStatusUpdated($transaction));
        }

        // WhatsApp Notification
        try {
            if ($transaction->phone) {
                $status = $data['status'] ?? ($data['credit_detail']['status'] ?? 'Updated');
                $creditStatus = $data['credit_detail']['status'] ?? null;
                $customerName = $transaction->user->name ?? 'Pelanggan';

                $msg = "";
                if ($creditStatus === 'disetujui') {
                    $msg = "Selamat {$customerName}!\n\nPengajuan Kredit Anda untuk unit *{$transaction->motor->name}* telah *DISETUJUI*.\n\nHarap cek dashboard Anda untuk melihat jadwal pembayaran angsuran (Uang Muka).\n\n- SRB Motor";
                } else if ($creditStatus === 'ditolak') {
                    $msg = "Halo {$customerName},\n\nMohon maaf, pengajuan kredit Anda untuk unit *{$transaction->motor->name}* belum dapat kami setujui saat ini.\n\nHubungi admin untuk info lebih lanjut.\n\n- SRB Motor";
                } else {
                    $displayStatus = strtoupper(str_replace('_', ' ', $status));
                    $msg = "Halo {$customerName},\n\nStatus pesanan #{$transaction->id} diperbarui menjadi: *{$displayStatus}*.\n\n- SRB Motor";
                }

                WhatsAppService::sendMessage($transaction->phone, $msg);
            }
        } catch (\Exception $e) {
            Log::error('WA Notification Error: ' . $e->getMessage());
        }
    }

    /**
     * Update just the status of a transaction
     */
    public function updateStatus(Transaction $transaction, string $status): void
    {
        $transaction->update(['status' => $status]);
        $this->sendStatusNotification($transaction, ['status' => $status]);
    }
}
