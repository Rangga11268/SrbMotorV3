<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Installment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessOverdueInstallments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'installments:process-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cek semua angsuran yang lewat jatuh tempo dan tambahkan penalty denda harian.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        $this->info("Menjalankan proses pengecekan overdue cicilan untuk hari " . $today->toDateString());
        Log::info("Menjalankan command installments:process-overdue");

        // Cari angsuran yang belum dibayar atau pending yang telah lewat (atau telat 1 hari masuk hari jatuh tempo)
        $overdueInstallments = Installment::whereIn('status', ['belum_dibayar', 'pending'])
            ->whereDate('due_date', '<', $today)
            ->get();

        $count = 0;

        foreach ($overdueInstallments as $installment) {
            $dueDate = Carbon::parse($installment->due_date);
            $daysOverdue = (int) $dueDate->diffInDays($today);

            if ($daysOverdue > 0) {
                // Rumus Denda Harian: Asumsi 0.5% dari nominal cicilan per hari.
                // Anda dapat mengubah konstanta 0.005 ini kapan saja sesuai kebijakan perusahaan
                $penaltyPerDay = $installment->amount * 0.005;
                $totalPenalty = $penaltyPerDay * $daysOverdue;

                $totalWithPenalty = $installment->amount + $totalPenalty;

                $installment->update([
                    'is_overdue' => true,
                    'days_overdue' => $daysOverdue,
                    'penalty_amount' => $totalPenalty,
                    'total_with_penalty' => $totalWithPenalty,
                    'status' => 'overdue' // mengubah status
                ]);
                
                $count++;
            }
        }

        $this->info("Berhasil mengupdate {$count} data cicilan menjadi overdue beserta dendanya.");
        Log::info("Command installments:process-overdue selesai. Diupdate: {$count}");
    }
}
