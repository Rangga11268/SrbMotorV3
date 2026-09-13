<?php

namespace App\Observers;

use App\Models\Installment;
use App\Notifications\InstallmentReminder;
use Illuminate\Support\Facades\Log;

class InstallmentObserver
{
    /**
     * Handle the Installment "updated" event.
     */
    public function updated(Installment $installment): void
    {
        // Only notify if reminder_sent changed to true
        if ($installment->isDirty('reminder_sent') && $installment->reminder_sent) {
            $this->notifyCustomer($installment);
        }
        
        // Handle payment confirmation
        if ($installment->isDirty('paid_at') && $installment->paid_at) {
             // Logic for payment confirmation notification if needed
        }
    }

    /**
     * Notify customer about installment reminder
     */
    private function notifyCustomer(Installment $installment): void
    {
        try {
            $customer = $installment->transaction?->user;
            if ($customer) {
                $customer->notify(new InstallmentReminder($installment));
                Log::info("Installment reminder notification sent to customer {$customer->id} for installment #{$installment->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error sending installment notification: {$e->getMessage()}");
        }
    }
}
