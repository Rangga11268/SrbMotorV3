<?php

namespace App\Observers;

use App\Models\CreditDetail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class CreditDetailObserver
{
    /**
     * Handle the CreditDetail "updated" event.
     * Syncs Transaction status based on status.
     */
    public function updated(CreditDetail $creditDetail): void
    {
        // Check if status was updated
        if ($creditDetail->isDirty('status')) {
            $this->syncTransactionStatus($creditDetail);
            $this->notifyCustomer($creditDetail);
            $this->logStatusChange($creditDetail);
        }
    }

    /**
     * Synchronize the parent Transaction status based on status.
     */
    private function syncTransactionStatus(CreditDetail $creditDetail): void
    {
        $transaction = $creditDetail->transaction;

        if (!$transaction) {
            return;
        }

        $creditStatus = $creditDetail->status;

        // Define the mapping from status to transaction status
        $statusMap = [
            'pengajuan_masuk' => 'waiting_credit_approval',
            'verifikasi_dokumen' => 'waiting_credit_approval',
            'dikirim_ke_leasing' => 'waiting_credit_approval',
            'survey_dijadwalkan' => 'survey_scheduled',
            'survey_berjalan' => 'survey_in_progress',
            'menunggu_keputusan_leasing' => 'waiting_credit_approval',
            'disetujui' => 'unit_preparation',      // Credit approved
            'ditolak' => 'cancelled',                 // Credit rejected
            'dp_dibayar' => 'unit_preparation',      // DP paid, ready for preparation
            'selesai' => 'completed',                // Credit process complete
        ];

        // Only update if the credit status has a mapped transaction status
        if (isset($statusMap[$creditStatus])) {
            $newStatus = $statusMap[$creditStatus];

            // Avoid updating if status is already set (prevents loops)
            if ($transaction->status !== $newStatus) {
                $transaction->update(['status' => $newStatus]);

                Log::info("Transaction #{$transaction->id} status synced to '{$newStatus}' from status '{$creditStatus}'");
            }
        }
    }

    /**
     * Send notification to customer about credit status change
     */
    private function notifyCustomer(CreditDetail $creditDetail): void
    {
        try {
            $transaction = $creditDetail->transaction;
            if (!$transaction || !$transaction->customer) {
                return;
            }

            $customer = $transaction->customer;
            $status = $creditDetail->status;

            // Map credit status to notification type
            $notificationData = $this->getNotificationData($creditDetail, $status);

            // Send notification
            if ($notificationData) {
                $transaction->user->notify(new \App\Notifications\TransactionStatusChanged($transaction));
                Log::info("Credit status notification sent to customer {$customer->id}: {$status}");
            }
        } catch (\Exception $e) {
            Log::error("Error sending credit notification: {$e->getMessage()}");
        }
    }

    /**
     * Get notification data for each credit status
     */
    private function getNotificationData(CreditDetail $creditDetail, string $status): ?array
    {
        return match ($status) {
            'pengajuan_masuk' => [
                'title' => 'Aplikasi Kredit Diterima',
                'message' => 'Aplikasi kredit Anda telah kami terima dan sedang diproses.',
            ],
            'verifikasi_dokumen' => [
                'title' => 'Verifikasi Dokumen Selesai',
                'message' => 'Dokumen Anda telah kami verifikasi dan dilanjutkan ke tahap berikutnya.',
            ],
            'dikirim_ke_leasing' => [
                'title' => 'Pengajuan Dikirim ke Leasing',
                'message' => 'Pengajuan kredit Anda telah dikirim ke perusahaan leasing untuk diproses.',
            ],
            'survey_dijadwalkan' => [
                'title' => 'Jadwal Survey Dikonfirmasi',
                'message' => 'Survey atas jaminan Anda telah dijadwalkan. Mohon hadir pada waktu yang ditunjuk.',
            ],
            'survey_berjalan' => [
                'title' => 'Survey Sedang Berlangsung',
                'message' => 'Proses survey terhadap jaminan Anda sedang berlangsung.',
            ],
            'menunggu_keputusan_leasing' => [
                'title' => 'Menunggu Keputusan Leasing',
                'message' => 'Survey telah selesai. Kami menunggu keputusan dari pihak leasing.',
            ],
            'disetujui' => [
                'title' => 'Kredit Disetujui!',
                'message' => 'Selamat! Pengajuan kredit Anda telah disetujui. Silakan hubungi kami untuk melanjutkan proses pembayaran DP.',
            ],
            'ditolak' => [
                'title' => 'Pengajuan Kredit Ditolak',
                'message' => sprintf(
                    'Maaf, pengajuan kredit Anda telah ditolak. %s',
                    $creditDetail->rejection_reason ? "Alasan: {$creditDetail->rejection_reason}" : ''
                ),
            ],
            'dp_dibayar' => [
                'title' => 'DP Diterima',
                'message' => 'Kami telah menerima pembayaran DP Anda. Proses penyelesaian sedang berlangsung.',
            ],
            'selesai' => [
                'title' => 'Proses Kredit Selesai',
                'message' => 'Proses kredit Anda telah selesai. Terima kasih telah memilih kami!',
            ],
            default => null,
        };
    }

    /**
     * Log all status changes for audit trail
     */
    private function logStatusChange(CreditDetail $creditDetail): void
    {
        try {
            $originalStatus = $creditDetail->getOriginal('status');
            $newStatus = $creditDetail->status;
            $userId = auth()->id() ?? 'system';

            Log::channel('credit_status')
                ->info('Credit status changed', [
                    'credit_id' => $creditDetail->id,
                    'transaction_id' => $creditDetail->transaction_id,
                    'from_status' => $originalStatus,
                    'to_status' => $newStatus,
                    'changed_by' => $userId,
                    'timestamp' => now(),
                ]);
        } catch (\Exception $e) {
            Log::error("Error logging credit status change: {$e->getMessage()}");
        }
    }
}
