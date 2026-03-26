<?php

namespace App\Notifications;

use App\Models\Installment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstallmentReminder extends Notification
{
    use Queueable;

    protected $installment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Installment $installment)
    {
        $this->installment = $installment;
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
        $transactionId = $this->installment->transaction->id;
        $motorName = $this->installment->transaction->motor->name;
        $dueDate = $this->installment->due_date->format('d M Y');
        $amount = number_format($this->installment->amount, 0, ',', '.');

        return (new MailMessage)
                    ->subject('Pengingat Cicilan - SRB Motors')
                    ->greeting('Halo ' . $notifiable->name . '!')
                    ->line('Ini adalah pengingat untuk cicilan Anda yang akan datang.')
                    ->line('Detail Cicilan:')
                    ->line('ID Transaksi: ' . $transactionId)
                    ->line('Unit: ' . $motorName)
                    ->line('Cicilan Ke-' . $this->installment->installment_number)
                    ->line('Tanggal Jatuh Tempo: ' . $dueDate)
                    ->line('Jumlah Tagihan: Rp ' . $amount)
                    ->action('Bayar Sekarang', url('/motors/payment/' . $this->installment->id))
                    ->line('Mohon lakukan pembayaran tepat waktu untuk menghindari denda.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->installment->transaction->id,
            'installment_id' => $this->installment->id,
            'installment_number' => $this->installment->installment_number,
            'type' => 'INSTALLMENT_REMINDER',
            'title' => 'Pengingat Cicilan',
            'message' => 'Cicilan ke-' . $this->installment->installment_number . ' jatuh tempo pada ' . $this->installment->due_date->format('d M Y') . '. Jumlah: Rp ' . number_format($this->installment->amount, 0, ',', '.'),
            'due_date' => $this->installment->due_date,
            'amount' => $this->installment->amount,
            'created_at' => now(),
        ];
    }
}
