<?php

namespace App\Services;

use App\Models\CreditDetail;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CreditService
{
    /**
     * Stage 1: Mark application as received
     */
    public function markApplicationReceived(CreditDetail $credit): bool
    {
        return $credit->update(['status' => 'pengajuan_masuk']);
    }

    /**
     * Stage 2: Verify documents
     * @param string $notes Notes from admin about verification
     */
    public function verifyDocuments(CreditDetail $credit, string $notes = ''): bool
    {
        $oldStatus = $credit->status;
        $res = $credit->update([
            'status' => 'verifikasi_dokumen',
            'verification_notes' => $notes,
            'verified_at' => now(),
        ]);

        if ($res) {
            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'verifikasi_dokumen',
                'status' => 'verifikasi_dokumen',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => $notes,
                'description' => 'Dokumen diverifikasi: ' . $notes,
            ]);
        }
        return $res;
    }

    /**
     * Stage 2 - Reject: Mark documents as invalid
     * @param string $reason Reason for rejection
     */
    public function rejectDocument(CreditDetail $credit, string $reason): bool
    {
        $oldStatus = $credit->status;
        $res = $credit->update([
            'status' => 'ditolak',
            'verification_notes' => $reason,
        ]);

        if ($res) {
            // Restore motor stock if documents are rejected (Terminal state usually)
            if ($credit->transaction && $credit->transaction->motor) {
                $credit->transaction->motor->update(['tersedia' => true]);
                \Illuminate\Support\Facades\Log::info("Stock Unlocked: Motor ID {$credit->transaction->motor_id} (Credit Document Rejected)");
            }

            // Mark transaction as cancelled
            $credit->transaction->update(['status' => 'cancelled']);

            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'ditolak',
                'status' => 'ditolak',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => $reason,
                'description' => 'Aplikasi ditolak (dokumen tidak valid): ' . $reason,
            ]);
        }
        return $res;
    }

    /**
     * Stage 3: Send to leasing company
     * @param string $leasingProvider The leasing provider name
     * @param string $applicationRef Reference number from leasing company
     */
    public function sendToLeasing(CreditDetail $credit, string $leasingProvider, string $applicationRef = ''): bool
    {
        $oldStatus = $credit->status;
        $res = $credit->update([
            'status' => 'dikirim_ke_leasing',
            'leasing_provider' => $leasingProvider,
            'reference_number' => $applicationRef ?: $credit->reference_number,
        ]);

        if ($res) {
            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'dikirim_ke_leasing',
                'status' => 'dikirim_ke_leasing',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => 'Ref: ' . ($applicationRef ?: $credit->reference_number),
                'description' => "Pengajuan dikirim ke Leasing: {$leasingProvider}",
            ]);
        }
        return $res;
    }

    /**
     * Stage 4: Schedule survey
     * @param string $scheduledDate Date of survey
     */
    public function scheduleSurvey(
        CreditDetail $credit,
        array $surveyData
    ): bool {
        // Create survey schedule
        $credit->surveySchedules()->create([
            'scheduled_date' => $surveyData['survey_scheduled_date'],
            'scheduled_time' => $surveyData['survey_scheduled_time'],
            'surveyor_name' => $surveyData['surveyor_name'],
            'surveyor_phone' => $surveyData['surveyor_phone'],
            'status' => 'pending',
        ]);

        $res = $credit->update([
            'status' => 'survey_dijadwalkan',
        ]);

        $credit->transaction->logs()->create([
            'status_from' => 'dikirim_ke_leasing',
            'status_to' => 'survey_dijadwalkan',
            'status' => 'survey_dijadwalkan',
            'actor_id' => auth()->id(),
            'actor_type' => 'App\Models\User',
            'notes' => 'Dijadwalkan: ' . $surveyData['survey_scheduled_date'],
            'description' => 'Survey dijadwalkan pada ' . $surveyData['survey_scheduled_date'],
        ]);

        return $res;
    }

    /**
     * Stage 5 - Complete: Mark survey as completed
     * @param string $surveyNotes Notes from survey
     */
    public function completeSurvey(CreditDetail $credit, string $surveyNotes = ''): bool
    {
        // Validation: Verify if survey schedule exists and if today is the scheduled day or after
        $latestSchedule = $credit->surveySchedules()->latest()->first();
        if ($latestSchedule && $latestSchedule->status === 'pending') {
            // Concatenating Carbon objects as strings results in "date date time", causing a parsing error.
            // Safely combine them using Carbon methods.
            $scheduledDateTime = $latestSchedule->scheduled_date->copy()
                ->setTimeFrom($latestSchedule->scheduled_time);

            if (now()->lt($scheduledDateTime)) {

                throw new \Exception("Survey tidak dapat diselesaikan sebelum waktu yang dijadwalkan (" . $scheduledDateTime->format('d M Y H:i') . ").");
            }
            
            // Mark schedule as completed if it was pending
            $latestSchedule->update(['status' => 'completed', 'notes' => $surveyNotes, 'completed_at' => now()]);
        }

        $oldStatus = $credit->status;
        $res = $credit->update([
            'status' => 'menunggu_keputusan_leasing',
        ]);

        if ($res) {
            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'menunggu_keputusan_leasing',
                'status' => 'menunggu_keputusan_leasing',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => $surveyNotes,
                'description' => 'Survey selesai: ' . $surveyNotes,
            ]);
        }
        return $res;
    }

    /**
     * Stage 6 - Approve: Mark credit as approved by leasing
     */
    public function approveCredit(
        CreditDetail $credit
    ): bool {
        $oldStatus = $credit->status;
        // Create DP Installment
        if ($credit->transaction->installments()->where('installment_number', 0)->count() === 0) {
            \App\Models\Installment::create([
                'transaction_id' => $credit->transaction_id,
                'installment_number' => 0, // DP
                'amount' => $credit->dp_amount,
                'due_date' => now(), 
                'status' => 'pending'
            ]);
        }

        $res = $credit->update([
            'status' => 'disetujui',
            'verified_at' => now(),
        ]);

        if ($res) {
            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'disetujui',
                'status' => 'disetujui',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'description' => 'Kredit disetujui oleh leasing',
            ]);
        }
        return $res;
    }

    /**
     * Stage 6 - Reject: Mark credit as rejected by leasing
     * @param string $reason Reason for rejection from leasing
     */
    public function rejectCredit(CreditDetail $credit, string $reason): bool
    {
        $oldStatus = $credit->status;
        $res = $credit->update([
            'status' => 'ditolak',
            'verification_notes' => $reason,
        ]);

        if ($res) {
            // Restore motor stock if credit decision is rejected
            if ($credit->transaction && $credit->transaction->motor) {
                $credit->transaction->motor->update(['tersedia' => true]);
                \Illuminate\Support\Facades\Log::info("Stock Unlocked: Motor ID {$credit->transaction->motor_id} (Credit Leasing Rejected)");
            }

            $credit->transaction->update(['status' => 'cancelled']);
            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'ditolak',
                'status' => 'ditolak',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => $reason,
                'description' => 'Kredit ditolak oleh leasing: ' . $reason,
            ]);
        }
        return $res;
    }

    /**
     * Stage 7: Mark DP as paid
     * @param string $paymentMethod Payment method used
     */
    public function recordDPPayment(
        CreditDetail $credit,
        string $paymentMethod
    ): bool {
        $oldStatus = $credit->status;
        $res = $credit->update([
            'status' => 'dp_dibayar',
            'dp_paid_at' => now(),
            'dp_payment_method' => $paymentMethod,
        ]);

        if ($res) {
            $credit->transaction->update(['status' => 'pembayaran_dikonfirmasi']);
            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'dp_dibayar',
                'status' => 'dp_dibayar',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => 'Metode: ' . $paymentMethod,
                'description' => 'Pembayaran DP dikonfirmasi: ' . $paymentMethod,
            ]);
        }
        return $res;
    }

    /**
     * Stage 8: Mark credit as completed
     * @param string $notes Final notes
     */
    public function completeCredit(CreditDetail $credit, string $notes = ''): bool
    {
        $oldStatus = $credit->status;
        // Generate monthly installments
        if ($credit->transaction->installments()->where('installment_number', '>', 0)->count() === 0) {
            $amount = $credit->monthly_installment;
            $tenor = $credit->tenor;
            for ($i = 1; $i <= $tenor; $i++) {
                \App\Models\Installment::create([
                    'transaction_id' => $credit->transaction_id,
                    'installment_number' => $i,
                    'amount' => $amount,
                    'due_date' => now()->addMonths($i),
                    'status' => 'pending'
                ]);
            }
        }

        $res = $credit->update([
            'status' => 'selesai',
            'completion_notes' => $notes,
            'completed_at' => now(),
            'is_completed' => true,
        ]);

        if ($res) {
            $credit->transaction->update(['status' => 'completed']);

            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'selesai',
                'status' => 'selesai',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'notes' => $notes,
                'description' => 'Proses kredit selesai. Unit siap dikirim.',
            ]);
        }
        return $res;
    }

    /**
     * Forced cancel (Admin)
     */
    public function cancelCredit(CreditDetail $credit): bool
    {
        DB::transaction(function () use ($credit) {
            $oldStatus = $credit->status;
            $credit->update(['status' => 'dibatalkan']);
            $credit->transaction->update(['status' => 'cancelled']);

            // Restore motor stock if credit is cancelled
            if ($credit->transaction && $credit->transaction->motor) {
                $credit->transaction->motor->update(['tersedia' => true]);
                \Illuminate\Support\Facades\Log::info("Stock Unlocked: Motor ID {$credit->transaction->motor_id} (Credit Application Cancelled)");
            }

            $credit->transaction->logs()->create([
                'status_from' => $oldStatus,
                'status_to' => 'dibatalkan',
                'status' => 'dibatalkan',
                'actor_id' => auth()->id(),
                'actor_type' => 'App\Models\User',
                'description' => 'Aplikasi kredit dibatalkan oleh admin',
            ]);
        });

        return true;
    }

    /**
     * Cancel by customer with validation
     */
    public function cancelByCustomer(\App\Models\Transaction $transaction, ?string $reason = null): array
    {
        // 1. Define allowed statuses for user cancellation
        $allowedCashStatuses = ['new_order', 'waiting_payment'];
        $allowedCreditStatuses = ['menunggu_persetujuan', 'waiting_credit_approval'];

        $isCash = $transaction->transaction_type === 'CASH';
        $currentStatus = $transaction->status;

        // 2. Validate
        $isAllowed = $isCash 
            ? in_array($currentStatus, $allowedCashStatuses)
            : in_array($currentStatus, $allowedCreditStatuses);

        if (!$isAllowed) {
            return [
                'success' => false,
                'message' => 'Pesanan tidak dapat dibatalkan pada tahap ini. Silakan hubungi admin.'
            ];
        }

        // 3. Perform cancellation
        DB::transaction(function () use ($transaction, $reason) {
            $transaction->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => $reason ?? 'Dibatalkan oleh pelanggan',
            ]);

            // Stock Unlocking
            if ($transaction->motor) {
                $transaction->motor->update(['tersedia' => true]);
                \Illuminate\Support\Facades\Log::info("Stock Unlocked for Motor ID: {$transaction->motor_id} due to cancellation of Transaction ID: {$transaction->id}");
            }

            if ($transaction->transaction_type === 'CREDIT' && $transaction->creditDetail) {
                $transaction->creditDetail->update([
                    'status' => 'dibatalkan',
                ]);
            }
        });

        return [
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan.'
        ];
    }

    /**
     * Get a timeline representation for a credit application
     */
    public function getTimeline(CreditDetail $credit): array
    {
        $timeline = [];

        // Application received
        $timeline[] = [
            'status' => 'pengajuan_masuk',
            'date' => $credit->created_at,
            'is_completed' => true,
        ];

        // Documents verification
        if (in_array($credit->status, ['ditolak']) || $credit->verified_at || $credit->updated_at > $credit->created_at) {
            $timeline[] = [
                'status' => 'verifikasi_dokumen',
                'date' => $credit->verified_at ?? ($credit->status === 'ditolak' ? $credit->updated_at : null),
                'is_completed' => $credit->verified_at !== null || $credit->status === 'ditolak',
                'notes' => $credit->verification_notes,
            ];
        }

        // Survey scheduled & completed
        if ($credit->survey_scheduled_date || $credit->survey_completed_at) {
             $timeline[] = [
                'status' => 'survey_dijadwalkan',
                'date' => $credit->survey_scheduled_date,
                'is_completed' => $credit->survey_completed_at !== null,
                'notes' => $credit->survey_notes,
            ];
        }

        // DP Paid
        if ($credit->dp_paid_at) {
            $timeline[] = [
                'status' => 'dp_dibayar',
                'date' => $credit->dp_paid_at,
                'is_completed' => true,
                'notes' => 'Metode: ' . $credit->dp_payment_method,
            ];
        }

        // Completed
        if ($credit->completed_at || $credit->is_completed) {
            $timeline[] = [
                'status' => 'selesai',
                'date' => $credit->completed_at,
                'is_completed' => true,
                'notes' => $credit->completion_notes,
            ];
        }

        return $timeline;
    }

    /**
     * Get all available status transitions for a credit
     */
    public function getAvailableTransitions(CreditDetail $credit): array
    {
        $currentStatus = $credit->status;

        // Map legacy statuses for backward compatibility
        $legacyMap = [
            'menunggu_persetujuan' => 'pengajuan_masuk',
            'dikirim_ke_surveyor' => 'dikirim_ke_leasing',
            'jadwal_survey' => 'survey_dijadwalkan',
            'data_tidak_valid' => 'verifikasi_dokumen' // Allow them to reject again or send to leasing
        ];

        if (array_key_exists($currentStatus, $legacyMap)) {
            $currentStatus = $legacyMap[$currentStatus];
        }

        $transitions = [
            'pengajuan_masuk' => [
                'verifikasi_dokumen' => 'Verify Documents',
                'ditolak' => 'Reject Application',
            ],
            'verifikasi_dokumen' => [
                'dikirim_ke_leasing' => 'Send to Leasing',
                'ditolak' => 'Reject Documents',
            ],
            'dikirim_ke_leasing' => [
                'survey_dijadwalkan' => 'Schedule Survey',
            ],
            'survey_dijadwalkan' => [
                'menunggu_keputusan_leasing' => 'Complete Survey',
            ],
            'menunggu_keputusan_leasing' => [
                'disetujui' => 'Approve Credit',
                'ditolak' => 'Reject Credit',
            ],
            'disetujui' => [
                'dp_dibayar' => 'Record DP Payment',
            ],
            'dp_dibayar' => [
                'selesai' => 'Complete Credit',
            ],
        ];

        return $transitions[$currentStatus] ?? [];
    }

    /**
     * Get status display information
     */
    public function getStatusInfo(string $status): array
    {
        $statusInfo = [
            'pengajuan_masuk' => [
                'label' => 'Application Received',
                'badge' => 'info',
                'icon' => 'inbox',
            ],
            'verifikasi_dokumen' => [
                'label' => 'Document Verification',
                'badge' => 'warning',
                'icon' => 'document-check',
            ],
            'dikirim_ke_leasing' => [
                'label' => 'Sent to Leasing',
                'badge' => 'info',
                'icon' => 'paper-plane',
            ],
            'survey_dijadwalkan' => [
                'label' => 'Survey Scheduled',
                'badge' => 'warning',
                'icon' => 'calendar',
            ],
            'menunggu_keputusan_leasing' => [
                'label' => 'Waiting for Decision',
                'badge' => 'info',
                'icon' => 'hourglass',
            ],
            'disetujui' => [
                'label' => 'Approved',
                'badge' => 'success',
                'icon' => 'check-mark',
            ],
            'ditolak' => [
                'label' => 'Rejected',
                'badge' => 'danger',
                'icon' => 'x-mark',
            ],
            'dp_dibayar' => [
                'label' => 'DP Paid',
                'badge' => 'success',
                'icon' => 'check-circle',
            ],
            'selesai' => [
                'label' => 'Completed',
                'badge' => 'success',
                'icon' => 'check-double',
            ],
        ];

        return $statusInfo[$status] ?? [
            'label' => $status,
            'badge' => 'secondary',
            'icon' => 'question',
        ];
    }

    /**
     * Get specific status color for frontend
     */
    public function getStatusColor(string $status): string
    {
        $statusColors = [
            'pengajuan_masuk' => 'info',
            'verifikasi_dokumen' => 'warning',
            'dikirim_ke_leasing' => 'info',
            'survey_dijadwalkan' => 'warning',
            'menunggu_keputusan_leasing' => 'info',
            'disetujui' => 'success',
            'ditolak' => 'danger',
            'dp_dibayar' => 'success',
            'selesai' => 'success',
            'dibatalkan' => 'secondary'
        ];

        return $statusColors[$status] ?? 'secondary';
    }
}
