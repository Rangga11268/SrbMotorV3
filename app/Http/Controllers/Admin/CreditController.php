<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditDetail;
use App\Models\LeasingProvider;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CreditController extends Controller
{
    protected CreditService $creditService;

    public function __construct(CreditService $creditService)
    {
        $this->creditService = $creditService;
    }

    /**
     * Display all credits (dashboard overview)
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = CreditDetail::with(['transaction', 'transaction.user', 'transaction.motor']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                // Search by reference number
                $q->where('reference_number', 'like', "%{$search}%")
                    ->orWhereHas('transaction', function ($tq) use ($search) {
                        // Search by transaction ID, name, or phone
                        $tq->where('id', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhereHas('user', function ($uq) use ($search) {
                                // Search by user name or phone
                                $uq->where('name', 'like', "%{$search}%")
                                    ->orWhere('phone', 'like', "%{$search}%");
                            });
                    });
            });
        }

        $credits = $query->paginate(15)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($credits);
        }

        // Get unique statuses from the table for filters
        $statuses = CreditDetail::select('status')
            ->distinct()
            ->pluck('status')
            ->toArray();

        return Inertia::render('Admin/Credits/Index', [
            'credits' => $credits,
            'statuses' => $statuses,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show details of a specific credit
     */
    public function show(CreditDetail $credit)
    {
        $credit->load([
            'transaction',
            'transaction.user',
            'transaction.motor',
            'leasingProvider',
            'dPConfirmedByUser',
            'surveySchedules',
            'documents',
        ]);

        $availableTransitions = $this->creditService->getAvailableTransitions($credit);
        $timeline = $this->creditService->getTimeline($credit);
        $leasingProviders = LeasingProvider::all();

        return Inertia::render('Admin/Credits/Show', [
            'credit' => $credit,
            'availableTransitions' => $availableTransitions,
            'timeline' => $timeline,
            'leasingProviders' => $leasingProviders,
        ]);
    }

    /**
     * Stage 2: Verify Documents
     */
    public function verifyDocuments(Request $request, CreditDetail $credit)
    {
        // Check if all documents are approved or rejected
        $pendingCount = $credit->documents()->where('approval_status', 'pending')->count();

        if ($pendingCount > 0) {
            return redirect()->route('admin.credits.show', $credit)
                ->with('error', 'Semua dokumen harus disetujui atau ditolak terlebih dahulu sebelum verifikasi');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $this->creditService->verifyDocuments($credit, $validated['notes'] ?? '');

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Documents verified successfully');
    }

    /**
     * Stage 2 (Reject): Reject Document
     */
    public function rejectDocument(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $this->creditService->rejectDocument($credit, $validated['rejection_reason']);

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Application rejected');
    }

    /**
     * Stage 3: Send to Leasing
     */
    public function sendToLeasing(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'leasing_provider_id' => 'required|exists:leasing_providers,id',
            'leasing_application_ref' => 'nullable|string|max:100',
        ]);

        $this->creditService->sendToLeasing(
            $credit,
            $validated['leasing_provider_id'],
            $validated['leasing_application_ref'] ?? ''
        );

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Credit sent to leasing provider');
    }

    /**
     * Stage 4: Schedule Survey
     */
    public function scheduleSurvey(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'survey_scheduled_date' => 'required|date|after:today',
            'survey_scheduled_time' => 'required|date_format:H:i',
            'surveyor_name' => 'required|string|max:255',
            'surveyor_phone' => 'required|string|max:20',
        ]);

        $this->creditService->scheduleSurvey(
            $credit,
            $validated
        );

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Survey scheduled successfully');
    }

    /**
     * Stage 5: Start Survey
     */
    public function startSurvey(CreditDetail $credit)
    {
        $this->creditService->startSurvey($credit);

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Survey marked as in progress');
    }

    /**
     * Stage 5 (Complete): Complete Survey
     */
    public function completeSurvey(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'survey_notes' => 'nullable|string|max:2000',
        ]);

        $this->creditService->completeSurvey($credit, $validated['survey_notes'] ?? '');

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Survey completed, awaiting leasing decision');
    }

    /**
     * Stage 6 (Approve): Approve Credit
     */
    public function approveCredit(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'approved_amount' => 'required|numeric|min:0',
            'interest_rate' => 'required|numeric|min:0|max:100',
        ]);

        $this->creditService->approveCredit(
            $credit
        );

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Credit approved successfully');
    }

    /**
     * Stage 6 (Reject): Reject Credit
     */
    public function rejectCredit(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $this->creditService->rejectCredit($credit, $validated['rejection_reason']);

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Credit rejected');
    }

    /**
     * Stage 7: Record DP Payment
     */
    public function recordDPPayment(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'dp_payment_method' => 'required|string|max:255',
        ]);

        $this->creditService->recordDPPayment(
            $credit,
            $validated['dp_payment_method'],
            auth()->id()
        );

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'DP payment recorded successfully');
    }

    /**
     * Stage 8: Complete Credit
     */
    public function completeCredit(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $this->creditService->completeCredit($credit, $validated['notes'] ?? '');

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Credit process completed');
    }

    /**
     * Stage 9: Cancel Credit
     */
    public function cancel(CreditDetail $credit)
    {
        $this->creditService->cancelCredit($credit);

        return redirect()->route('admin.credits.show', $credit)
            ->with('success', 'Kredit berhasil dibatalkan');
    }

    /**
     * Destroy Credit Application
     */
    public function destroy(CreditDetail $credit)
    {
        $transaction = $credit->transaction;

        DB::transaction(function () use ($credit, $transaction) {
            $credit->delete();
            if ($transaction) {
                $transaction->delete();
            }
        });

        return redirect()->route('admin.credits.index')
            ->with('success', 'Pengajuan kredit berhasil dihapus');
    }

    /**
     * Approve a document
     */
    public function approveDocument(Request $request, \App\Models\Document $document)
    {
        try {
            $document->approve();

            return back()->with('success', 'Dokumen telah disetujui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyetujui dokumen.');
        }
    }

    /**
     * Reject a document upload
     */
    public function rejectDocumentUpload(Request $request, \App\Models\Document $document)
    {
        try {
            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:500',
            ]);

            $document->reject($validated['rejection_reason']);

            return back()->with('success', 'Dokumen telah ditolak.');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menolak dokumen.');
        }
    }

    /**
     * Export credits to Excel
     */
    public function export(Request $request)
    {
        $status = $request->query('status');
        $query = CreditDetail::with(['transaction', 'transaction.user']);

        if ($status) {
            $query->where('status', $status);
        }

        $credits = $query->get();

        // Implement export logic here
        // For now, returning JSON
        return response()->json([
            'message' => 'Export feature coming soon',
            'count' => $credits->count(),
        ]);
    }
}
