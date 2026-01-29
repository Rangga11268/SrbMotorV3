<?php

namespace App\Observers;

use App\Models\CreditDetail;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class CreditDetailObserver
{
    /**
     * Handle the CreditDetail "updated" event.
     * Syncs Transaction status based on credit_status.
     */
    public function updated(CreditDetail $creditDetail): void
    {
        // Check if credit_status was updated
        if ($creditDetail->isDirty('credit_status')) {
            $this->syncTransactionStatus($creditDetail);
        }
    }

    /**
     * Synchronize the parent Transaction status based on credit_status.
     */
    private function syncTransactionStatus(CreditDetail $creditDetail): void
    {
        $transaction = $creditDetail->transaction;

        if (!$transaction) {
            return;
        }

        $creditStatus = $creditDetail->credit_status;

        // Define the mapping from credit_status to transaction status
        $statusMap = [
            'disetujui' => 'unit_preparation', // Credit approved -> Prepare unit for delivery
            'ditolak' => 'cancelled',          // Credit rejected -> Cancel the transaction
        ];

        // Only update if the credit status has a mapped transaction status
        if (isset($statusMap[$creditStatus])) {
            $newStatus = $statusMap[$creditStatus];
            
            // Avoid updating if status is already set (prevents loops)
            if ($transaction->status !== $newStatus) {
                $transaction->update(['status' => $newStatus]);
                
                Log::info("Transaction #{$transaction->id} status synced to '{$newStatus}' from credit_status '{$creditStatus}'");
            }
        }
    }
}
