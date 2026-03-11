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
        string $scheduledDate
    ): bool {
        return $credit->update([
            'status' => 'survey_dijadwalkan',
            'survey_scheduled_date' => $scheduledDate,
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
        return $credit->update([
            'status' => 'selesai',
            'completion_notes' => $notes,
            'completed_at' => now(),
            'is_completed' => true,
        ]);
    }

    /**
     * Get all available status transitions for a credit
     */
    public function getAvailableTransitions(CreditDetail $credit): array
    {
        $currentStatus = $credit->status;

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
            'label' => ucfirst(str_replace('_', ' ', $status)),
            'badge' => 'secondary',
            'icon' => 'question',
        ];
    }
}
