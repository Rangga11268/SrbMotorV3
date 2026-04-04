<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BenefitNotesUpdated extends Notification
{
    use Queueable;

    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // For now, only send via database for simplicity, but mail can be added later
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Update Keuntungan & Manfaat - SRB Motor')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Admin SRB Motor telah memperbarui catatan keuntungan/manfaat untuk akun Anda.')
            ->line('Catatan: ' . $this->message)
            ->action('Lihat Profil Saya', url('/profile'))
            ->line('Terima kasih telah menjadi pelanggan setia SRB Motor!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'benefit_update',
            'title' => 'Update Keuntungan & Manfaat',
            'message' => $this->message,
            'action_url' => '/profile',
            'icon' => 'star',
            'created_at' => now(),
        ];
    }
}
