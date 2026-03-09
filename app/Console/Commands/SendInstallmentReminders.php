<?php

namespace App\Console\Commands;

use App\Models\Installment;
use App\Services\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendInstallmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'installments:send-reminders';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Send WhatsApp reminders for upcoming installments (3 days before due date)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $whatsappService = new WhatsAppService();

        // Find installments due within the next 3 days that haven't been reminded yet
        $upcomingInstallments = Installment::whereNull('reminder_sent_at')
            ->where('payment_status', '!=', 'paid')
            ->whereBetween('due_date', [
                Carbon::now()->startOfDay(),
                Carbon::now()->addDays(3)->endOfDay()
            ])
            ->with(['transaction.user', 'transaction.motor'])
            ->get();

        $sentCount = 0;

        foreach ($upcomingInstallments as $installment) {
            try {
                $user = $installment->transaction->user;
                $motor = $installment->transaction->motor;

                // Format date
                $dueDate = Carbon::parse($installment->due_date)->locale('id')->format('d F Y');
                $amountFormatted = number_format($installment->amount, 0, ',', '.');

                $message = "Halo {$user->name},\n\n⏰ PENGINGAT CICILAN\n\nKendaraan: {$motor->name}\nJumlah: Rp{$amountFormatted}\nJatuh Tempo: {$dueDate}\n\nMohon segera melakukan pembayaran cycilan Anda sebelum tanggal jatuh tempo untuk menghindari denda keterlambatan.\n\nTerima kasih,\n- SRB Motor";

                // Send WhatsApp message
                $whatsappService->sendMessage($user->phone, $message);

                // Mark reminder as sent
                $installment->reminder_sent_at = Carbon::now();
                $installment->save();

                Log::info('Installment reminder sent', [
                    'installment_id' => $installment->id,
                    'user_id' => $user->id,
                    'amount' => $installment->amount,
                    'due_date' => $installment->due_date,
                ]);

                $sentCount++;
            } catch (\Exception $e) {
                Log::error('Error sending installment reminder', [
                    'installment_id' => $installment->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Installment reminders sent: {$sentCount}");
        Log::info("Installment reminders sent successfully", ['count' => $sentCount]);
    }
}
