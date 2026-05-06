<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentReadyNotification extends Notification
{
    use Queueable;

    protected $transaction;
    protected $documentType;

    /**
     * Create a new notification instance.
     */
    public function __construct(Transaction $transaction, $documentType)
    {
        $this->transaction = $transaction;
        $this->documentType = $documentType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // We only want in-app database notification for now, WA is handled directly.
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
            'document_type' => $this->documentType,
            'message' => "Kabar gembira! {$this->documentType} untuk motor {$this->transaction->motor->name} Anda telah selesai dan siap diambil di dealer.",
            'created_at' => now(),
        ];
    }
}
