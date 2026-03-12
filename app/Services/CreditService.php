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
        return $credit->update([
            'status' => 'verifikasi_dokumen',
            'verification_notes' => $notes,
            'verified_at' => now(),
        ]);
    }

    /**
     * Stage 2 - Reject: Mark documents as invalid
     * @param string $reason Reason for rejection
     */
    public function rejectDocument(CreditDetail $credit, string $reason): bool
    {
        return $credit->update([
            'status' => 'ditolak',
            'verification_notes' => $reason,
        ]);
    }

    /**
     * Stage 3: Send to leasing company
     * @param int $leasingProviderId The leasing provider ID
     * @param string $appRef Reference number from leasing company
     */
    public function sendToLeasing(CreditDetail $credit, int $leasingProviderId, string $appRef = ''): bool
    {
        return $credit->update([
            'status' => 'dikirim_ke_leasing',
            'leasing_provider_id' => $leasingProviderId,
            'reference_number' => $appRef ?: $credit->reference_number,
        ]);
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

        return $credit->update([
            'status' => 'survey_dijadwalkan',
            'survey_scheduled_date' => $surveyData['survey_scheduled_date'],
        ]);
    }

    /**
     * Stage 5 - Complete: Mark survey as completed
     * @param string $surveyNotes Notes from survey
     */
    public function completeSurvey(CreditDetail $credit, string $surveyNotes = ''): bool
    {
        return $credit->update([
            'survey_notes' => $surveyNotes,
            'survey_completed_at' => now(),
            'status' => 'menunggu_keputusan_leasing',
        ]);
    }

    /**
     * Stage 6 - Approve: Mark credit as approved by leasing
     */
    public function approveCredit(
        CreditDetail $credit
    ): bool {
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

        return $credit->update([
            'status' => 'disetujui',
            'verified_at' => now(),
        ]);
    }

    /**
     * Stage 6 - Reject: Mark credit as rejected by leasing
     * @param string $reason Reason for rejection from leasing
     */
    public function rejectCredit(CreditDetail $credit, string $reason): bool
    {
        return $credit->update([
            'status' => 'ditolak',
            'verification_notes' => $reason,
        ]);
    }

    /**
     * Stage 7: Mark DP as paid
     * @param string $paymentMethod Payment method used
     */
    public function recordDPPayment(
        CreditDetail $credit,
        string $paymentMethod
    ): bool {
        return $credit->update([
            'status' => 'dp_dibayar',
            'dp_paid_at' => now(),
            'dp_payment_method' => $paymentMethod,
        ]);
    }

    /**
     * Stage 8: Mark credit as completed
     * @param string $notes Final notes
     */
    public function completeCredit(CreditDetail $credit, string $notes = ''): bool
    {
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

        return $credit->update([
            'status' => 'selesai',
            'completion_notes' => $notes,
            'completed_at' => now(),
            'is_completed' => true,
        ]);
    }

    /**
     * Forced cancel (Admin)
     */
    public function cancelCredit(CreditDetail $credit): bool
    {
        DB::transaction(function () use ($credit) {
            $credit->update(['status' => 'dibatalkan']);
            $credit->transaction->update(['status' => 'cancelled']);
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
                'is_cancelled' => true,
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
