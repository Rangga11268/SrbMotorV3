<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionCreated extends Notification
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
        
        return (new MailMessage)
                    ->subject('Konfirmasi Pesanan Baru - SRB Motor')
                    ->greeting('Halo ' . $notifiable->name . '!')
                    ->line('Terima kasih telah membuat pesanan di SRB Motor.')
                    ->line('Rincian pesanan Anda:')
                    ->line('ID Transaksi: ' . $transactionId)
                    ->line('Motor: ' . $motorName)
                    ->line('Tipe Pesanan: ' . ($this->transaction->transaction_type === 'CASH' ? 'Tunai' : 'Kredit'))
                    ->line('Status Saat Ini: ' . $this->transaction->status)
                    ->line('Total Jumlah: Rp ' . number_format($this->transaction->final_price, 0, ',', '.'))
                    ->action('Lihat Pesanan', url('/motors/order-confirmation/' . $transactionId))
                    ->line('Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'motor_name' => $this->transaction->motor->name,
            'transaction_type' => $this->transaction->transaction_type,
            'status' => $this->transaction->status,
            'final_price' => $this->transaction->final_price,
            'message' => 'Pesanan baru Anda berhasil dibuat dengan No #' . str_pad($this->transaction->id, 4, '0', STR_PAD_LEFT),
            'created_at' => now(),
        ];
    }
}
