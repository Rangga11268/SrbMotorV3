<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motor;
use App\Models\StockTransfer;
use App\Services\BranchService;
use App\Repositories\MotorRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class StockTransferController extends Controller
{
    /**
     * Store a new stock transfer between branches.
     */
    public function store(Request $request, BranchService $branchService, MotorRepositoryInterface $motorRepo): RedirectResponse
    {
        $validated = $request->validate([
            'motor_id' => 'required|exists:motors,id',
            'to_branch' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $motor = Motor::findOrFail($validated['motor_id']);
        $quantity = (int) $validated['quantity'];
        $toBranch = $validated['to_branch'];
        $fromBranch = $motor->branch;

        if ($fromBranch === $toBranch) {
            return redirect()->back()->with('error', 'Cabang tujuan tidak boleh sama dengan cabang asal.');
        }

        if ($motor->stock < $quantity) {
            return redirect()->back()->with('error', "Stok tidak mencukupi. Stok saat ini di {$fromBranch}: {$motor->stock} unit.");
        }

        DB::beginTransaction();
        try {
            // 1. If transferring ALL units of this record, simply update its branch
            if ($motor->stock === $quantity) {
                $motor->update([
                    'branch' => $toBranch,
                ]);
            } else {
                // 2. Partial transfer: decrement source and increment/create in target branch
                $motor->decrement('stock', $quantity);

                $targetMotor = Motor::where('name', $motor->name)
                    ->where('model', $motor->model)
                    ->where('branch', $toBranch)
                    ->first();

                if ($targetMotor) {
                    $targetMotor->increment('stock', $quantity);
                    $targetMotor->update(['tersedia' => true]);
                } else {
                    $newMotor = $motor->replicate();
                    $newMotor->branch = $toBranch;
                    $newMotor->stock = $quantity;
                    $newMotor->tersedia = true;
                    $newMotor->no_rangka = null;
                    $newMotor->no_mesin = null;
                    $newMotor->save();
                }
            }

            // 3. Record transfer audit log
            StockTransfer::create([
                'motor_id' => $motor->id,
                'from_branch' => $fromBranch,
                'to_branch' => $toBranch,
                'quantity' => $quantity,
                'transferred_by' => auth()->id(),
                'notes' => $validated['notes'] ?? null,
            ]);

            DB::commit();

            // Clear cache across repository and service
            $motorRepo->clearCache();
            $branchService->clearCache();

            return redirect()->back()->with('success', "Berhasil mentransfer {$quantity} unit motor ke cabang {$toBranch}.");
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Stock transfer error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memproses mutasi stok: ' . $e->getMessage());
        }
    }
}
