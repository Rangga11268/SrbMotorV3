<?php

namespace App\Notifications;

use App\Models\SurveySchedule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SurveyScheduled extends Notification
{
    use Queueable;

    protected $surveySchedule;

    /**
     * Create a new notification instance.
     */
    public function __construct(SurveySchedule $surveySchedule)
    {
        $this->surveySchedule = $surveySchedule;
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
        $transactionId = $this->surveySchedule->transaction->id;
        $motorName = $this->surveySchedule->transaction->motor->name;
        $date = $this->surveySchedule->scheduled_date->format('d M Y');
        $time = $this->surveySchedule->scheduled_time ? $this->surveySchedule->scheduled_time->format('H:i') : 'TBA';

        return (new MailMessage)
                    ->subject('Jadwal Survey Terkonfirmasi - SRB Motor')
                    ->greeting('Halo ' . $notifiable->name . '!')
                    ->line('Jadwal survey untuk pengajuan kredit Anda telah ditentukan.')
                    ->line('Detail Survey:')
                    ->line('ID Transaksi: ' . $transactionId)
                    ->line('Unit: ' . $motorName)
                    ->line('Tanggal: ' . $date)
                    ->line('Waktu: ' . $time)
                    ->line('Lokasi: ' . $this->surveySchedule->location)
                    ->line('Surveyor: ' . ($this->surveySchedule->surveyor_name ?? 'Petugas Lapangan'))
                    ->action('Konfirmasi Kehadiran', url('/motors/order-status/' . $transactionId))
                    ->line('Mohon pastikan Anda berada di lokasi pada waktu tersebut.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->surveySchedule->transaction->id,
            'survey_id' => $this->surveySchedule->id,
            'type' => 'SURVEY_SCHEDULED',
            'title' => 'Jadwal Survey Dikonfirmasi',
            'message' => 'Survey Anda dijadwalkan pada ' . $this->surveySchedule->scheduled_date->format('d M Y') . ' pukul ' . ($this->surveySchedule->scheduled_time ? $this->surveySchedule->scheduled_time->format('H:i') : 'TBA'),
            'scheduled_date' => $this->surveySchedule->scheduled_date,
            'scheduled_time' => $this->surveySchedule->scheduled_time,
            'location' => $this->surveySchedule->location,
            'created_at' => now(),
        ];
    }
}
