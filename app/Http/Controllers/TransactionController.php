<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\CreditDetail;
use App\Models\Document;
use App\Models\Motor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Services\TransactionService;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }


    public function index(Request $request): \Inertia\Response|JsonResponse
    {
        $query = Transaction::with(['user', 'motor', 'creditDetail.documents'])
            ->orderBy('created_at', 'desc');


        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('motor', function ($m) use ($search) {
                        $m->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('type') && !empty($request->type)) {
            $query->where('transaction_type', $request->type);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        $transactions = $query->paginate(10)->appends($request->query());


        $transactions->getCollection()->transform(function ($transaction) {
            $transaction->documents_complete = $transaction->transaction_type === 'CREDIT' && $transaction->creditDetail
                ? $transaction->creditDetail->hasRequiredDocuments()
                : true;
            return $transaction;
        });


        $transactionTypes = Transaction::distinct('transaction_type')->pluck('transaction_type');
        $statuses = Transaction::distinct('status')->pluck('status');

        if ($request->ajax()) {
            return response()->json([
                'transactions' => $transactions,
                'transactionTypes' => $transactionTypes,
                'statuses' => $statuses,
                'filters' => $request->all(['search', 'type', 'status']),
            ]);
        }

        return \Inertia\Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'transactionTypes' => $transactionTypes,
            'statuses' => $statuses,
            'filters' => $request->all(['search', 'type', 'status']),
        ]);
    }


    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('Admin/Transactions/Create', [
            'users' => User::all(),
            'motors' => Motor::all(),
        ]);
    }


    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $this->transactionService->createTransaction($request->validated());

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction created successfully.');
    }


    public function show(Transaction $transaction): \Inertia\Response
    {
        $transaction->load(['user', 'motor', 'creditDetail', 'creditDetail.documents', 'installments' => function ($q) {
            $q->orderBy('installment_number', 'asc');
        }]);

        $transaction->documents_complete = $transaction->transaction_type === 'CREDIT' && $transaction->creditDetail
            ? $transaction->creditDetail->hasRequiredDocuments()
            : true;

        return \Inertia\Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction
        ]);
    }


    public function edit(Transaction $transaction): \Inertia\Response
    {
        $transaction->load(['creditDetail', 'user', 'motor']);

        return \Inertia\Inertia::render('Admin/Transactions/EditCombined', [
            'transaction' => $transaction,
            'users' => User::all(),
            'motors' => Motor::all(),
        ]);
    }


    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $this->transactionService->updateTransaction($transaction, $request->validated());

        // For convenience, if this is a credit transaction and credit data is passed, update it too
        if ($transaction->transaction_type === 'CREDIT' && $request->has('credit_detail')) {
            $this->transactionService->handleCreditDetail($transaction, $request->credit_detail);
        }

        return redirect()->route('admin.transactions.show', $transaction->id)
            ->with('success', 'Transaction updated successfully.');
    }



    public function destroy(Transaction $transaction): RedirectResponse
    {
        $this->transactionService->deleteTransaction($transaction);

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction deleted successfully.');
    }


    /**
     * Show the form for editing credit details.
     */
    public function editCredit(Transaction $transaction): \Inertia\Response|RedirectResponse
    {
        // Ensure this is a credit transaction
        if ($transaction->transaction_type !== 'CREDIT') {
            return redirect()->route('admin.transactions.show', $transaction->id)
                ->with('error', 'Transaksi ini bukan tipe kredit.');
        }

        $transaction->load(['creditDetail', 'creditDetail.documents', 'user', 'motor']);

        return \Inertia\Inertia::render('Admin/Transactions/EditCombined', [
            'transaction' => $transaction,
            'users' => User::all(),
            'motors' => Motor::all(),
        ]);
    }


    /**
     * Update the credit details (status, approved amount, notes).
     */
    public function updateCredit(Request $request, Transaction $transaction): RedirectResponse
    {
        $request->validate([
            'credit_status' => 'required|in:menunggu_persetujuan,data_tidak_valid,dikirim_ke_surveyor,jadwal_survey,disetujui,ditolak',
            'approved_amount' => 'nullable|numeric|min:0',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        // Update credit detail
        if ($transaction->creditDetail) {
            $transaction->creditDetail->update([
                'credit_status' => $request->credit_status,
                'approved_amount' => $request->approved_amount ?? 0,
            ]);
        }

        // Update transaction notes
        $transaction->update([
            'notes' => $request->admin_notes,
        ]);

        // Sync transaction status based on credit status
        $this->syncTransactionStatusFromCredit($transaction, $request->credit_status);

        // Generate installments when credit is approved (idempotent — skips if already generated)
        if ($request->credit_status === 'disetujui' && $transaction->creditDetail) {
            $fresh = $transaction->fresh(['installments', 'creditDetail']);
            $this->transactionService->generateInstallments($fresh, $fresh->creditDetail->toArray());
        }

        return redirect()->route('admin.transactions.show', $transaction->id)
            ->with('success', 'Status kredit berhasil diperbarui.');
    }


    /**
     * Synchronize transaction status based on credit status.
     */
    private function syncTransactionStatusFromCredit(Transaction $transaction, string $creditStatus): void
    {
        $statusMap = [
            'disetujui' => 'unit_preparation', // Credit approved -> prepare unit
            'ditolak' => 'cancelled',           // Credit rejected -> cancel transaction
            'menunggu_persetujuan' => 'menunggu_persetujuan',
            'data_tidak_valid' => 'data_tidak_valid',
            'dikirim_ke_surveyor' => 'dikirim_ke_surveyor',
            'jadwal_survey' => 'jadwal_survey',
        ];

        if (isset($statusMap[$creditStatus])) {
            $transaction->update(['status' => $statusMap[$creditStatus]]);
        }
    }


    public function updateStatus(Request $request, Transaction $transaction): RedirectResponse|\Illuminate\Http\JsonResponse
    {

        $request->validate([
            'status' => 'required|string',
        ]);

        $this->transactionService->updateStatus($transaction, $request->status);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'status' => $request->status]);
        }

        return redirect()->back()
            ->with('success', 'Transaction status updated successfully.');
    }


    public function uploadDocument(Request $request, Transaction $transaction): RedirectResponse
    {
        $request->validate([
            'document_type' => 'required|string|in:KTP,KK,SLIP_GAJI,BPKB,STNK,FAKTUR,LAINNYA',
            'document_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);


        if (!$transaction->creditDetail) {
            $creditDetail = CreditDetail::create([
                'transaction_id' => $transaction->id,
                'down_payment' => 0,
                'tenor' => 12,
                'monthly_installment' => 0,
                'credit_status' => 'menunggu_persetujuan',
            ]);
        } else {
            $creditDetail = $transaction->creditDetail;
        }


        $file = $request->file('document_file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();


        $filename = time() . '_' . uniqid() . '.' . $extension;


        $path = $file->storeAs('documents', $filename, 'public');


        Document::create([
            'credit_detail_id' => $creditDetail->id,
            'document_type' => $request->document_type,
            'file_path' => $path,
            'original_name' => $originalName,
        ]);

        return redirect()->back()
            ->with('success', 'Dokumen berhasil diunggah.');
    }


    public function deleteDocument(Document $document): RedirectResponse
    {

        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }


        $document->delete();

        return redirect()->back()
            ->with('success', 'Dokumen berhasil dihapus.');
    }
}
