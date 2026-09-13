<?php

namespace App\Observers;

use App\Models\SurveySchedule;
use App\Notifications\SurveyScheduled;
use Illuminate\Support\Facades\Log;

class SurveyScheduleObserver
{
    /**
     * Handle the SurveySchedule "created" event.
     */
    public function created(SurveySchedule $surveySchedule): void
    {
        $this->notifyCustomer($surveySchedule);
    }

    /**
     * Handle the SurveySchedule "updated" event.
     */
    public function updated(SurveySchedule $surveySchedule): void
    {
        // Only notify if status changed to 'confirmed' or scheduled_date changed
        if ($surveySchedule->isDirty('status') && $surveySchedule->status === 'confirmed') {
            $this->notifyCustomer($surveySchedule);
        } elseif ($surveySchedule->isDirty('scheduled_date') || $surveySchedule->isDirty('scheduled_time')) {
             $this->notifyCustomer($surveySchedule);
        }
    }

    /**
     * Notify customer about survey schedule
     */
    private function notifyCustomer(SurveySchedule $surveySchedule): void
    {
        try {
            $customer = $surveySchedule->customer;
            if ($customer) {
                $customer->notify(new SurveyScheduled($surveySchedule));
                Log::info("Survey schedule notification sent to customer {$customer->id} for survey #{$surveySchedule->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error sending survey notification: {$e->getMessage()}");
        }
    }
}
