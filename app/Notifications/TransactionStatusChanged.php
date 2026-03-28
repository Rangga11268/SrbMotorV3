<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionStatusChanged extends Notification
{
    use Queueable;

    protected $transaction;

    /**
     * Create a new notification instance.
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $motorName = $this->transaction->motor->name;
        $transactionId = $this->transaction->id;
        $previousStatus = $this->transaction->getOriginal('status') ?? $this->transaction->status;
        $newStatus = $this->transaction->status;

        // Check if it's a credit status change
        $isCreditStatusChange = false;
        if ($this->transaction->transaction_type === 'CREDIT' && $this->transaction->creditDetail) {
            $previousCreditStatus = $this->transaction->creditDetail->getOriginal('status');
            $newCreditStatus = $this->transaction->creditDetail->status;
            if ($previousCreditStatus !== $newCreditStatus) {
                $isCreditStatusChange = true;
                $previousStatus = $previousCreditStatus;
                $newStatus = $newCreditStatus;
            }
        }

        $statusMessage = $this->getStatusMessage($newStatus, $isCreditStatusChange);

        return (new MailMessage)
            ->subject('Update Status Pesanan - SRB Motors')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Status pesanan Anda telah diperbarui.')
            ->line('Rincian pesanan:')
            ->line('ID Transaksi: ' . $transactionId)
            ->line('Motor: ' . $motorName)
            ->line('Tipe Pesanan: ' . ($this->transaction->transaction_type === 'CASH' ? 'Tunai' : 'Kredit'))
            ->line('Status Sebelumnya: ' . $previousStatus)
            ->line('Status Terbaru: ' . $newStatus)
            ->line('Keterangan: ' . $statusMessage)
            ->action('Lihat Pesanan', url('/motors/order-confirmation/' . $transactionId))
            ->line('Tim kami akan segera menghubungi Anda jika diperlukan.');
    }

    /**
     * Get status-specific message
     */
    private function getStatusMessage($status, $isCreditStatusChange = false)
    {
        if ($isCreditStatusChange) {
            switch ($status) {
                case 'APPROVED':
                    return 'Pengajuan kredit Anda telah disetujui. Silakan hubungi kami untuk proses selanjutnya.';
                case 'REJECTED':
                    return 'Mohon maaf, pengajuan kredit Anda ditolak. Silakan hubungi kami untuk informasi lebih lanjut.';
                case 'PENDING_REVIEW':
                    return 'Pengajuan kredit Anda sedang dalam proses review. Harap bersabar.';
                case 'SUBMITTED_TO_SURVEYOR':
                    return 'Pengajuan Anda telah diserahkan ke surveyor untuk proses verifikasi.';
                case 'DATA_INVALID':
                    return 'Data Anda perlu dilengkapi. Silakan periksa kembali dokumen yang diunggah.';
                case 'SURVEY_SCHEDULED':
                    return 'Jadwal survey telah ditentukan. Petugas kami akan menghubungi Anda.';
                default:
                    return 'Status pengajuan kredit telah diperbarui.';
            }
        } else {
            switch ($status) {
                case 'COMPLETED':
                    return 'Pesanan Anda telah selesai. Terima kasih telah membeli di SRB Motors.';
                case 'selesai':
                    return 'Motor Anda telah dikirim! Silakan cek kondisi unit dan konfirmasi penerimaan. Cicilan Anda akan mulai berjalan sesuai jadwal yang telah disepakati.';
                case 'READY_FOR_DELIVERY':
                    return 'Motor Anda siap untuk dikirim. Tim kami akan menghubungi Anda untuk konfirmasi jadwal.';
                case 'ready_for_delivery':
                    return 'Motor Anda siap untuk dikirim dalam 24 jam. Tim kami akan menghubungi Anda untuk konfirmasi jadwal pengiriman.';
                case 'PAYMENT_CONFIRMED':
                    return 'Pembayaran Anda telah dikonfirmasi. Motor Anda sedang disiapkan.';
                case 'UNIT_PREPARATION':
                    return 'Motor Anda sedang dalam proses persiapan.';
                case 'unit_preparation':
                    return 'Motor Anda sedang dalam proses persiapan lengkap (servis, perpanjangan BPKB, asuransi, dll). Perkiraan selesai dalam 3-5 hari kerja.';
                case 'WAITING_PAYMENT':
                    return 'Mohon segera lakukan pembayaran sesuai instruksi yang telah diberikan.';
                case 'NEW_ORDER':
                    return 'Pesanan Anda telah terdaftar dan sedang dalam proses.';
                default:
                    return 'Status pesanan telah diperbarui.';
            }
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $isCreditStatusChange = false;
        if ($this->transaction->transaction_type === 'CREDIT' && $this->transaction->creditDetail) {
            $previousCreditStatus = $this->transaction->creditDetail->getOriginal('status');
            $newCreditStatus = $this->transaction->creditDetail->status;
            if ($previousCreditStatus !== $newCreditStatus) {
                $isCreditStatusChange = true;
            }
        }

        return [
            'transaction_id' => $this->transaction->id,
            'motor_name' => $this->transaction->motor->name,
            'transaction_type' => $this->transaction->transaction_type,
            'previous_status' => $this->transaction->getOriginal('status') ?? $this->transaction->status,
            'current_status' => $this->transaction->status,
            'is_credit_status_change' => $isCreditStatusChange,
            'message' => 'Pesanan #' . str_pad($this->transaction->id, 4, '0', STR_PAD_LEFT) . ' saat ini: ' . str_replace('_', ' ', ucwords(strtolower($this->transaction->status))),
            'created_at' => now(),
        ];
    }
}
