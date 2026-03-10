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
        return $credit->update(['credit_status' => 'pengajuan_masuk']);
    }

    /**
     * Stage 2: Verify documents
     * @param string $internalNotes Notes from admin about verification
     */
    public function verifyDocuments(CreditDetail $credit, string $internalNotes = ''): bool
    {
        return $credit->update([
            'credit_status' => 'verifikasi_dokumen',
            'internal_notes' => $internalNotes,
        ]);
    }

    /**
     * Stage 2 - Reject: Mark documents as invalid
     * @param string $rejectionReason Reason for rejection
     */
    public function rejectDocument(CreditDetail $credit, string $rejectionReason): bool
    {
        return $credit->update([
            'credit_status' => 'ditolak',
            'rejection_reason' => $rejectionReason,
        ]);
    }

    /**
     * Stage 3: Send to leasing company
     * @param int $leasingProviderId The leasing provider ID
     * @param string $applicationRef Reference number from leasing company
     */
    public function sendToLeasing(CreditDetail $credit, int $leasingProviderId, string $applicationRef = ''): bool
    {
        return $credit->update([
            'credit_status' => 'dikirim_ke_leasing',
            'leasing_provider_id' => $leasingProviderId,
            'leasing_application_ref' => $applicationRef,
        ]);
    }

    /**
     * Stage 4: Schedule survey
     * @param \DateTime $scheduledDate Date of survey
     * @param string $scheduledTime Time of survey
     * @param string $surveyorName Name of surveyor
     * @param string $surveyorPhone Surveyor's phone number
     */
    public function scheduleSurvey(
        CreditDetail $credit,
        string $scheduledDate,
        string $scheduledTime,
        string $surveyorName,
        string $surveyorPhone
    ): bool {
        return $credit->update([
            'credit_status' => 'survey_dijadwalkan',
            'survey_scheduled_date' => $scheduledDate,
            'survey_scheduled_time' => $scheduledTime,
            'surveyor_name' => $surveyorName,
            'surveyor_phone' => $surveyorPhone,
        ]);
    }

    /**
     * Stage 5: Mark survey as in progress
     */
    public function startSurvey(CreditDetail $credit): bool
    {
        return $credit->update(['credit_status' => 'survey_berjalan']);
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
            'credit_status' => 'menunggu_keputusan_leasing',
        ]);
    }

    /**
     * Stage 6 - Approve: Mark credit as approved by leasing
     * @param float $approvedAmount The approved amount
     * @param float $interestRate The approved interest rate
     */
    public function approveCredit(
        CreditDetail $credit,
        float $approvedAmount,
        float $interestRate
    ): bool {
        return $credit->update([
            'credit_status' => 'disetujui',
            'approved_amount' => $approvedAmount,
            'interest_rate' => $interestRate,
            'leasing_decision_date' => now(),
        ]);
    }

    /**
     * Stage 6 - Reject: Mark credit as rejected by leasing
     * @param string $rejectionReason Reason for rejection from leasing
     */
    public function rejectCredit(CreditDetail $credit, string $rejectionReason): bool
    {
        return $credit->update([
            'credit_status' => 'ditolak',
            'rejection_reason' => $rejectionReason,
            'leasing_decision_date' => now(),
        ]);
    }

    /**
     * Stage 7: Mark DP as paid
     * @param string $paymentMethod Payment method used
     * @param User|int $confirmedByUser Admin user who confirmed the payment
     */
    public function recordDPPayment(
        CreditDetail $credit,
        string $paymentMethod,
        User|int $confirmedByUser
    ): bool {
        $confirmedById = $confirmedByUser instanceof User ? $confirmedByUser->id : $confirmedByUser;

        return $credit->update([
            'credit_status' => 'dp_dibayar',
            'dp_paid_date' => now(),
            'dp_payment_method' => $paymentMethod,
            'dp_confirmed_by' => $confirmedById,
        ]);
    }

    /**
     * Stage 8: Mark credit as completed
     * @param string $internalNotes Final notes
     */
    public function completeCredit(CreditDetail $credit, string $internalNotes = ''): bool
    {
        return $credit->update([
            'credit_status' => 'selesai',
            'internal_notes' => $internalNotes,
        ]);
    }

    /**
     * Get all available status transitions for a credit
     */
    public function getAvailableTransitions(CreditDetail $credit): array
    {
        $currentStatus = $credit->credit_status;

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
                'survey_berjalan' => 'Start Survey',
            ],
            'survey_berjalan' => [
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
            'survey_berjalan' => [
                'label' => 'Survey In Progress',
                'badge' => 'warning',
                'icon' => 'loading',
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
            'label' => ucfirst(str_replace('_', ' ', $status)),
            'badge' => 'secondary',
            'icon' => 'question',
        ];
    }

    /**
     * Get timeline of status changes for a credit
     */
    public function getTimeline(CreditDetail $credit): array
    {
        $timeline = [];

        // Add created event
        $timeline[] = [
            'date' => $credit->created_at,
            'status' => 'pengajuan_masuk',
            'label' => 'Application Created',
            'notes' => null,
        ];

        // Add verification event
        if ($credit->credit_status !== 'pengajuan_masuk') {
            $timeline[] = [
                'date' => $credit->updated_at,
                'status' => 'verifikasi_dokumen',
                'label' => 'Documents Verified',
                'notes' => $credit->internal_notes,
            ];
        }

        // Add survey scheduled event
        if ($credit->survey_scheduled_date) {
            $timeline[] = [
                'date' => $credit->survey_scheduled_date,
                'status' => 'survey_dijadwalkan',
                'label' => 'Survey Scheduled',
                'notes' => $credit->surveyor_name ? "Surveyor: {$credit->surveyor_name}" : null,
            ];
        }

        // Add survey completed event
        if ($credit->survey_completed_at) {
            $timeline[] = [
                'date' => $credit->survey_completed_at,
                'status' => 'menunggu_keputusan_leasing',
                'label' => 'Survey Completed',
                'notes' => $credit->survey_notes,
            ];
        }

        // Add leasing decision event
        if ($credit->leasing_decision_date) {
            $status = $credit->credit_status === 'ditolak' && $credit->rejection_reason ? 'ditolak' : 'disetujui';
            $timeline[] = [
                'date' => $credit->leasing_decision_date,
                'status' => $status,
                'label' => $status === 'ditolak' ? 'Credit Rejected' : 'Credit Approved',
                'notes' => $credit->rejection_reason ?? "Approved Amount: {$credit->approved_amount}",
            ];
        }

        // Add DP paid event
        if ($credit->dp_paid_date) {
            $timeline[] = [
                'date' => $credit->dp_paid_date,
                'status' => 'dp_dibayar',
                'label' => 'DP Payment Received',
                'notes' => $credit->dp_payment_method,
            ];
        }

        return $timeline;
    }
}
