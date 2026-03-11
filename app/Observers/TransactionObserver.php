<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TransactionStatusChanged;
use App\Notifications\TransactionCreated;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        // Send notification to admin about new transaction
        $adminUsers = User::where('role', 'admin')->get();
        
        Notification::send($adminUsers, new TransactionCreated($transaction));
        
        // Send notification to customer about their transaction
        $transaction->user->notify(new TransactionCreated($transaction));
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        // Check if status was updated
        if ($transaction->isDirty('status')) {
            // Send notification to customer about status change
            $transaction->user->notify(new TransactionStatusChanged($transaction));
            
            // Send notification to admin about status change
            $adminUsers = User::where('role', 'admin')->get();
            Notification::send($adminUsers, new TransactionStatusChanged($transaction));
        }
        
        // Check if credit status was updated (for credit transactions)
        if ($transaction->transaction_type === 'CREDIT' && $transaction->creditDetail && $transaction->creditDetail->isDirty('status')) {
            // Send notification to customer about credit status change
            $transaction->user->notify(new TransactionStatusChanged($transaction));
            
            // Send notification to admin about credit status change
            $adminUsers = User::where('role', 'admin')->get();
            Notification::send($adminUsers, new TransactionStatusChanged($transaction));
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "force deleted" event.
     */
    public function forceDeleted(Transaction $transaction): void
    {
        //
    }
}
