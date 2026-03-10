# 🚀 CREDIT FLOW REFACTOR - STEP-BY-STEP IMPLEMENTATION GUIDE

## 📋 PHASE 1: DATABASE & MODELS (2-3 hours)

### Step 1.1: Create Migration File

**Create**: `database/migrations/2026_03_11_xxxxxx_refactor_credit_flow.php`

**Content** (see CREDIT_FLOW_TECHNICAL_SPEC.md for full migration code):

- Drop old credit_status enum
- Create new enum with 10 values
- Add survey columns (date, time, surveyor, notes)
- Add leasing columns (provider_id, reference, decision_date)
- Add decision columns (rejection_reason, internal_notes)
- Add DP payment tracking columns
- Add indices for performance

**Command**:

```bash
php artisan make:migration refactor_credit_flow --table=credit_details
```

### Step 1.2: Data Migration - Map Old Statuses

**Create**: `database/seeders/MigrateCreditStatusesSeeder.php`

Map existing data:

```php
// In seeder or migration
$creditDetails = CreditDetail::all();
foreach ($creditDetails as $credit) {
    // Map old → new
    switch($credit->credit_status) {
        case 'menunggu_persetujuan':
            $credit->credit_status = 'verifikasi_dokumen';
            break;
        case 'data_tidak_valid':
            $credit->credit_status = 'verifikasi_dokumen'; // Keep in same stage
            break;
        case 'dikirim_ke_surveyor':
            $credit->credit_status = 'dikirim_ke_leasing';
            break;
        case 'jadwal_survey':
            $credit->credit_status = 'survey_dijadwalkan';
            break;
        case 'disetujui':
            $credit->credit_status = 'disetujui'; // No change
            break;
        case 'ditolak':
            $credit->credit_status = 'ditolak'; // No change
            break;
    }
    $credit->save();
}
```

### Step 1.3: Update CreditDetail Model

**File**: `app/Models/CreditDetail.php`

**Changes**:

```php
// Add to fillable array
protected $fillable = [
    'transaction_id',
    'down_payment',
    'tenor',
    'monthly_installment',
    'credit_status',
    'approved_amount',
    // + NEW COLUMNS
    'survey_scheduled_date',
    'survey_scheduled_time',
    'surveyor_name',
    'surveyor_phone',
    'survey_notes',
    'survey_completed_at',
    'leasing_provider_id',
    'leasing_application_ref',
    'leasing_decision_date',
    'rejection_reason',
    'internal_notes',
    'dp_paid_date',
    'dp_payment_method',
    'dp_confirmed_by',
];

// Add relationships
public function leasingProvider()
{
    return $this->belongsTo(LeasingProvider::class);
}

public function dPConfirmedByUser()
{
    return $this->belongsTo(User::class, 'dp_confirmed_by');
}

// Add accessor for survey scheduled info
public function getSurveyScheduledInfoAttribute()
{
    if (!$this->survey_scheduled_date) {
        return null;
    }
    return "{$this->survey_scheduled_date} {$this->survey_scheduled_time}";
}
```

### Step 1.4: Run Migration

```bash
php artisan migrate
php artisan db:seed --class=MigrateCreditStatusesSeeder
```

✅ **Checkpoint**: Database schema updated, old data mapped successfully

---

## 📋 PHASE 2: SERVICES (1-2 hours)

### Step 2.1: Create CreditService

**Create**: `app/Services/CreditService.php`

```php
<?php
namespace App\Services;

use App\Models\CreditDetail;
use App\Models\Installment;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\CreditStatusUpdated;

class CreditService
{
    /**
     * STAGE 2 → 3: Approve documents and move to leasing
     */
    public function approveDocuments(CreditDetail $credit, array $data): CreditDetail
    {
        $credit->update([
            'credit_status' => 'dikirim_ke_leasing',
            'internal_notes' => $data['notes'] ?? null,
        ]);

        $this->notifyCustomer(
            $credit,
            'Dokumen Diterima',
            'Dokumen Anda telah diverifikasi dan akan segera diproses ke leasing.'
        );

        Log::info("Credit {$credit->id} documents approved");
        return $credit;
    }

    /**
     * STAGE 2 (Back): Ask customer to reupload documents
     */
    public function rejectDocuments(CreditDetail $credit, string $reason): CreditDetail
    {
        $credit->update([
            'credit_status' => 'verifikasi_dokumen', // Stay in same stage
            'internal_notes' => "Tolak: {$reason}",
        ]);

        $this->notifyCustomer(
            $credit,
            'Dokumen Perlu Diperbaiki',
            "Dokumen Anda perlu diperbaiki. Alasan: {$reason}. Silakan upload ulang."
        );

        Log::info("Credit {$credit->id} documents rejected: {$reason}");
        return $credit;
    }

    /**
     * STAGE 3: Send to leasing provider
     */
    public function sendToLeasing(CreditDetail $credit, array $data): CreditDetail
    {
        // Validate leasing provider exists
        $leasing = LeasingProvider::findOrFail($data['leasing_provider_id']);

        $credit->update([
            'credit_status' => 'dikirim_ke_leasing',
            'leasing_provider_id' => $data['leasing_provider_id'],
            'leasing_application_ref' => $data['reference'] ?? null,
            'internal_notes' => $data['notes'] ?? null,
        ]);

        Log::info("Credit {$credit->id} sent to leasing: {$leasing->name}");
        return $credit;
    }

    /**
     * STAGE 4: Schedule survey
     */
    public function scheduleSurvey(CreditDetail $credit, array $data): CreditDetail
    {
        $credit->update([
            'credit_status' => 'survey_dijadwalkan',
            'survey_scheduled_date' => $data['survey_date'],
            'survey_scheduled_time' => $data['survey_time'],
            'surveyor_name' => $data['surveyor_name'],
            'surveyor_phone' => $data['surveyor_phone'] ?? null,
            'internal_notes' => $data['location_notes'] ?? null,
        ]);

        $surveyDateTime = "{$data['survey_date']} {$data['survey_time']}";
        $this->notifyCustomer(
            $credit,
            'Survey Dijadwalkan',
            "Surveyor akan datang pada {$surveyDateTime}. Petugas: {$data['surveyor_name']}."
        );

        Log::info("Survey scheduled for credit {$credit->id}: {$surveyDateTime}");
        return $credit;
    }

    /**
     * STAGE 5: Start survey process
     */
    public function startSurvey(CreditDetail $credit): CreditDetail
    {
        $credit->update(['credit_status' => 'survey_berjalan']);

        Log::info("Survey started for credit {$credit->id}");
        return $credit;
    }

    /**
     * STAGE 5 → 6: Complete survey and record findings
     */
    public function completeSurvey(CreditDetail $credit, array $surveyData): CreditDetail
    {
        $credit->update([
            'credit_status' => 'menunggu_keputusan_leasing',
            'survey_completed_at' => now(),
            'survey_notes' => $surveyData['findings'],
            'internal_notes' => $surveyData['internal_notes'] ?? null,
        ]);

        Log::info("Survey completed for credit {$credit->id}. Waiting for leasing decision.");
        return $credit;
    }

    /**
     * STAGE 6 → 7a: Approve credit application
     */
    public function approveCredit(CreditDetail $credit, array $data): CreditDetail
    {
        $credit->update([
            'credit_status' => 'disetujui',
            'leasing_decision_date' => now(),
            'approved_amount' => $data['approved_amount'] ?? $credit->transaction->motor->price - $credit->down_payment,
            'internal_notes' => $data['notes'] ?? null,
        ]);

        // Generate installments when approved
        $this->generateInstallments($credit);

        $monthlyAmount = number_format($credit->monthly_installment, 0, ',', '.');
        $this->notifyCustomer(
            $credit,
            'SELAMAT! Kredit Disetujui',
            "Kredit Anda disetujui! Cicilan: Rp{$monthlyAmount}/bulan selama {$credit->tenor} bulan. Bayar DP untuk melanjutkan."
        );

        Log::info("Credit {$credit->id} approved by {$data['approved_by'] ?? 'admin'}");
        return $credit;
    }

    /**
     * STAGE 6 → 8a: Reject credit application
     */
    public function rejectCredit(CreditDetail $credit, array $data): CreditDetail
    {
        $credit->update([
            'credit_status' => 'ditolak',
            'leasing_decision_date' => now(),
            'rejection_reason' => $data['reason'],
            'internal_notes' => $data['notes'] ?? null,
        ]);

        $this->notifyCustomer(
            $credit,
            'Pengajuan Kredit Ditolak',
            "Mohon maaf, pengajuan kredit Anda ditolak. Alasan: {$data['reason']}. Hubungi kami untuk informasi lebih lanjut."
        );

        Log::info("Credit {$credit->id} rejected. Reason: {$data['reason']}");
        return $credit;
    }

    /**
     * STAGE 7 → 9: Confirm DP payment
     */
    public function confirmDPPayment(CreditDetail $credit, array $paymentData): CreditDetail
    {
        $credit->update([
            'credit_status' => 'dp_dibayar',
            'dp_paid_date' => now(),
            'dp_payment_method' => $paymentData['payment_method'],
            'dp_confirmed_by' => auth()->id(),
            'internal_notes' => $paymentData['notes'] ?? null,
        ]);

        // Generate installment schedule
        $this->generateInstallments($credit);

        $this->notifyCustomer(
            $credit,
            'DP Diterima - Motor Siap',
            'DP Anda telah diterima dan dikonfirmasi. Motor sedang disiapkan untuk pengiriman.'
        );

        Log::info("DP payment confirmed for credit {$credit->id}");
        return $credit;
    }

    /**
     * STAGE 9 → 10: Complete delivery
     */
    public function completeDelivery(CreditDetail $credit): CreditDetail
    {
        $credit->update([
            'credit_status' => 'selesai',
        ]);

        $credit->transaction->update([
            'status' => 'completed',
        ]);

        $this->notifyCustomer(
            $credit,
            'Motor Diterima - Terima Kasih!',
            'Motor Anda telah diterima. Cicilan bulanan akan dimulai sesuai jadwal. Terima kasih!'
        );

        Log::info("Delivery completed for credit {$credit->id}");
        return $credit;
    }

    /**
     * Generate monthly installment schedule
     */
    protected function generateInstallments(CreditDetail $credit): void
    {
        // Check if already generated
        if ($credit->transaction->installments()->exists()) {
            return; // Already generated
        }

        DB::transaction(function () use ($credit) {
            // DP installment (due today)
            Installment::create([
                'transaction_id' => $credit->transaction_id,
                'amount' => $credit->down_payment,
                'due_date' => now()->toDateString(),
                'status' => 'pending',
                'type' => 'down_payment',
            ]);

            // Monthly installments
            for ($i = 1; $i <= $credit->tenor; $i++) {
                Installment::create([
                    'transaction_id' => $credit->transaction_id,
                    'amount' => $credit->monthly_installment,
                    'due_date' => now()->addMonths($i)->toDateString(),
                    'status' => 'pending',
                    'type' => 'monthly',
                ]);
            }
        });
    }

    /**
     * Send notification to customer
     */
    protected function notifyCustomer(CreditDetail $credit, string $subject, string $message): void
    {
        $transaction = $credit->transaction;

        try {
            Mail::send(new CreditStatusUpdated(
                customer_name: $transaction->customer_name,
                subject: $subject,
                message: $message,
            ));
        } catch (\Exception $e) {
            Log::error("Failed to send email: {$e->getMessage()}");
        }

        // Optional: Send WhatsApp
        // WhatsAppService::send($transaction->customer_phone, $message);
    }
}
```

### Step 2.2: Update TransactionService

**File**: `app/Services/TransactionService.php`

**Changes**:

```php
// In createTransaction method:
if ($data['transaction_type'] === 'CREDIT' && isset($data['credit_detail'])) {
    $creditData = $data['credit_detail'];
    $creditData['credit_status'] = 'pengajuan_masuk'; // NEW: Start from stage 1
    $this->handleCreditDetail($transaction, $creditData);
}

// Update handleCreditDetail:
protected function handleCreditDetail(Transaction $transaction, array $creditData): void
{
    $creditData['transaction_id'] = $transaction->id;

    if ($transaction->creditDetail) {
        $transaction->creditDetail->update($creditData);
    } else {
        CreditDetail::create($creditData);
    }

    // REMOVED: Don't auto-generate installments here
    // Now: Only generate when DP is paid (Stage 9)
}
```

✅ **Checkpoint**: Services created and integrated

---

## 📋 PHASE 3: CONTROLLERS (2-3 hours)

### Step 3.1: Create Admin/CreditController

**Create**: `app/Http/Controllers/Admin/CreditController.php`

```php
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditDetail;
use App\Models\Installment;
use App\Models\LeasingProvider;
use App\Services\CreditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditController extends Controller
{
    protected CreditService $creditService;

    public function __construct(CreditService $creditService)
    {
        $this->creditService = $creditService;
    }

    /**
     * List all credits with filters by stage
     */
    public function index(Request $request)
    {
        $query = CreditDetail::with(['transaction', 'leasingProvider']);

        if ($stage = $request->get('stage')) {
            $query->where('credit_status', $stage);
        }

        $credits = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Credits/Index', [
            'credits' => $credits,
            'filters' => [
                'stage' => $stage,
            ],
            'stages' => [
                'pengajuan_masuk',
                'verifikasi_dokumen',
                'dikirim_ke_leasing',
                'survey_dijadwalkan',
                'survey_berjalan',
                'menunggu_keputusan_leasing',
                'disetujui',
                'ditolak',
                'dp_dibayar',
                'selesai',
            ],
        ]);
    }

    /**
     * Show credit details with timeline
     */
    public function show(CreditDetail $credit)
    {
        $credit->load(['transaction', 'leasingProvider', 'dPConfirmedByUser']);

        return Inertia::render('Admin/Credits/Show', [
            'credit' => $credit,
            'transaction' => $credit->transaction,
            'leasingProviders' => LeasingProvider::all(),
        ]);
    }

    /**
     * STAGE 2: Verify and approve documents
     */
    public function approveDocuments(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $this->creditService->approveDocuments($credit, $validated);

        return back()->with('success', 'Dokumen disetujui, berkas akan dikirim ke leasing');
    }

    /**
     * STAGE 2: Reject documents, ask for reupload
     */
    public function rejectDocuments(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $this->creditService->rejectDocuments($credit, $validated['reason']);

        return back()->with('warning', 'Customer diminta untuk mengupload ulang dokumen');
    }

    /**
     * STAGE 3: Send to leasing provider
     */
    public function sendToLeasing(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'leasing_provider_id' => 'required|exists:leasing_providers,id',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $this->creditService->sendToLeasing($credit, $validated);

        return back()->with('success', 'Berkas dikirim ke leasing provider');
    }

    /**
     * STAGE 4: Schedule survey
     */
    public function scheduleSurvey(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'survey_date' => 'required|date',
            'survey_time' => 'required|date_format:H:i',
            'surveyor_name' => 'required|string',
            'surveyor_phone' => 'nullable|string',
            'location_notes' => 'nullable|string',
        ]);

        $this->creditService->scheduleSurvey($credit, $validated);

        return back()->with('success', 'Survey berhasil dijadwalkan');
    }

    /**
     * STAGE 5: Complete survey with findings
     */
    public function completeSurvey(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'findings' => 'required|string',
            'internal_notes' => 'nullable|string',
        ]);

        $this->creditService->completeSurvey($credit, $validated);

        return back()->with('success', 'Hasil survey diinput, menunggu keputusan leasing');
    }

    /**
     * STAGE 6: Approve credit
     */
    public function approve(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'approved_amount' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        $validated['approved_by'] = auth()->id();

        $this->creditService->approveCredit($credit, $validated);

        return back()->with('success', 'Kredit disetujui, customer dimulai pembayaran DP');
    }

    /**
     * STAGE 6: Reject credit
     */
    public function reject(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'reason' => 'required|string|in:penghasilan_kurang,riwayat_kredit_buruk,data_tidak_valid,alamat_tidak_jelas,lainnya',
            'notes' => 'nullable|string',
        ]);

        $this->creditService->rejectCredit($credit, $validated);

        return back()->with('success', 'Kreddit ditolak, customer telah diberitahu');
    }

    /**
     * STAGE 7 → 9: Confirm DP payment
     */
    public function confirmDPPayment(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|in:transfer,cash,e-wallet',
            'notes' => 'nullable|string',
        ]);

        $this->creditService->confirmDPPayment($credit, $validated);

        return back()->with('success', 'DP diterima, installment schedule dibuat');
    }

    /**
     * STAGE 9 → 10: Complete delivery
     */
    public function completeDelivery(CreditDetail $credit)
    {
        $this->creditService->completeDelivery($credit);

        return back()->with('success', 'Motor diterima, transaksi selesai');
    }
}
```

### Step 3.2: Update Routes

**File**: `routes/web.php`

```php
// In admin group
Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
    // ... existing routes

    // Credit Management (NEW)
    Route::get('/credits', [Admin\CreditController::class, 'index'])->name('credits.index');
    Route::get('/credits/{credit}', [Admin\CreditController::class, 'show'])->name('credits.show');
    Route::post('/credits/{credit}/approve-documents', [Admin\CreditController::class, 'approveDocuments'])->name('credits.approve-documents');
    Route::post('/credits/{credit}/reject-documents', [Admin\CreditController::class, 'rejectDocuments'])->name('credits.reject-documents');
    Route::post('/credits/{credit}/send-to-leasing', [Admin\CreditController::class, 'sendToLeasing'])->name('credits.send-to-leasing');
    Route::post('/credits/{credit}/schedule-survey', [Admin\CreditController::class, 'scheduleSurvey'])->name('credits.schedule-survey');
    Route::post('/credits/{credit}/complete-survey', [Admin\CreditController::class, 'completeSurvey'])->name('credits.complete-survey');
    Route::post('/credits/{credit}/approve', [Admin\CreditController::class, 'approve'])->name('credits.approve');
    Route::post('/credits/{credit}/reject', [Admin\CreditController::class, 'reject'])->name('credits.reject');
    Route::post('/credits/{credit}/confirm-dp-payment', [Admin\CreditController::class, 'confirmDPPayment'])->name('credits.confirm-dp-payment');
    Route::post('/credits/{credit}/complete-delivery', [Admin\CreditController::class, 'completeDelivery'])->name('credits.complete-delivery');
});
```

✅ **Checkpoint**: Controllers created and routes defined

---

## 📋 PHASE 4: OBSERVERS & NOTIFICATIONS (30-45 mins)

### Step 4.1: Update CreditDetailObserver

**File**: `app/Observers/CreditDetailObserver.php`

```php
<?php
namespace App\Observers;

use App\Models\CreditDetail;

class CreditDetailObserver
{
    /**
     * Handle updated event - sync transaction status
     */
    public function updated(CreditDetail $creditDetail): void
    {
        if ($creditDetail->isDirty('credit_status')) {
            $this->syncTransactionStatus($creditDetail);
        }
    }

    /**
     * NEW: Map credit stages to transaction statuses
     */
    private function syncTransactionStatus(CreditDetail $creditDetail): void
    {
        $transaction = $creditDetail->transaction;
        if (!$transaction) return;

        $statusMap = [
            'pengajuan_masuk'                => 'new_order',
            'verifikasi_dokumen'             => 'waiting_verification',
            'dikirim_ke_leasing'             => 'sent_to_leasing',
            'survey_dijadwalkan'             => 'survey_scheduled',
            'survey_berjalan'                => 'survey_in_progress',
            'menunggu_keputusan_leasing'     => 'waiting_decision',
            'disetujui'                      => 'approved',
            'ditolak'                        => 'rejected',
            'dp_dibayar'                     => 'dp_paid',
            'selesai'                        => 'completed',
        ];

        $newStatus = $statusMap[$creditDetail->credit_status] ?? $creditDetail->credit_status;

        if ($transaction->status !== $newStatus) {
            $transaction->update(['status' => $newStatus]);
        }
    }
}
```

✅ **Checkpoint**: Observers updated

---

## 📋 PHASE 5: VIEWS (Admin UI) (2-3 hours)

### Step 5.1: Create Admin/Credits/Index.jsx

**Create**: `resources/js/Pages/Admin/Credits/Index.jsx`

(See CREDIT_FLOW_TECHNICAL_SPEC.md for UI component structure)

Basic structure:

```jsx
export default function CreditsIndex({ credits, filters, stages }) {
    return (
        <AdminLayout>
            <div className="space-y-4">
                {/* Filters by stage */}
                <div className="flex gap-2">
                    {stages.map((stage) => (
                        <button
                            key={stage}
                            onClick={() =>
                                router.get(
                                    route("admin.credits.index", { stage }),
                                )
                            }
                            className={filters.stage === stage ? "active" : ""}
                        >
                            {getStageLabel(stage)}
                        </button>
                    ))}
                </div>

                {/* Credit list */}
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Motor</th>
                            <th>Stage</th>
                            <th>Leasing</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {credits.data.map((credit) => (
                            <tr key={credit.id}>
                                <td>{credit.transaction.customer_name}</td>
                                <td>{credit.transaction.motor.name}</td>
                                <td>
                                    <Badge status={credit.credit_status} />
                                </td>
                                <td>{credit.leasing_provider?.name}</td>
                                <td>
                                    <Link
                                        href={route(
                                            "admin.credits.show",
                                            credit.id,
                                        )}
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
```

### Step 5.2: Create Admin/Credits/Show.jsx

**Create**: `resources/js/Pages/Admin/Credits/Show.jsx`

Shows timeline and stage-specific actions

### Step 5.3: Create Stage-Specific Forms

Create separate components for each action:

- `VerifyDocumentsForm.jsx`
- `SendToLeasingForm.jsx`
- `ScheduleSurveyForm.jsx`
- `EnterSurveyResultsForm.jsx`
- `ApproveDecisionForm.jsx`
- `RejectDecisionForm.jsx`
- `ConfirmDPPaymentForm.jsx`

✅ **Checkpoint**: Admin UI components created

---

## 📋 PHASE 6: CUSTOMER VIEWS (1-2 hours)

### Step 6.1: Update TransactionDetail.jsx

**File**: `resources/js/Pages/Motors/TransactionDetail.jsx`

Update status labels and show current stage:

```jsx
const statusLabels = {
    pengajuan_masuk: {
        label: "Pengajuan Masuk",
        icon: "📝",
        color: "gray",
    },
    verifikasi_dokumen: {
        label: "Verifikasi Dokumen",
        icon: "🔍",
        color: "blue",
    },
    // ... etc
};
```

✅ **Checkpoint**: Customer views updated

---

## 📋 PHASE 7: TESTING (2-3 hours)

### Step 7.1: Unit Tests

```php
// tests/Unit/Services/CreditServiceTest.php
public function test_approve_documents_transitions_to_dikirim_ke_leasing()
public function test_schedule_survey_updates_surveyor_info()
public function test_approve_credit_generates_installments()
public function test_reject_credit_saves_reason()
public function test_confirm_dp_payment_moves_to_completed()
```

### Step 7.2: Feature Tests

```php
// tests/Feature/CreditFlowTest.php
public function test_full_credit_flow_from_application_to_completion()
public function test_document_rejection_allows_reupload()
public function test_credit_rejection_allows_reapplication()
```

✅ **Checkpoint**: Tests passing

---

## 📋 PHASE 8: DEPLOYMENT (30 mins)

### Prerequisites

- [ ] Backup production database
- [ ] Test on staging environment
- [ ] All tests passing
- [ ] Code reviewed

### Steps

```bash
# 1. Pull latest code
git pull origin main

# 2. Run migration
php artisan migrate

# 3. Run data migration seeder
php artisan db:seed --class=MigrateCreditStatusesSeeder

# 4. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 5. Rebuild assets if needed
npm run build

# 6. Verify
php artisan tinker
# > CreditDetail::count() // Check data migrated
```

✅ **Deployment complete**

---

## 🎯 COMPLETION CHECKLIST

### Database

- [ ] Migration file created
- [ ] Migration runs without errors
- [ ] Data migration seeder works
- [ ] All old statuses mapped correctly

### Services

- [ ] CreditService class created with all methods
- [ ] TransactionService updated
- [ ] All methods tested

### Controllers

- [ ] Admin/CreditController created
- [ ] All actions implemented
- [ ] Routes defined
- [ ] Authorization checked

### Observers

- [ ] CreditDetailObserver updated with new mapping
- [ ] Status sync working

### Frontend

- [ ] Admin credits index page
- [ ] Admin credits show page
- [ ] All stage-specific forms
- [ ] Customer transaction detail updated
- [ ] Status labels correct

### Testing

- [ ] Unit tests written
- [ ] Feature tests written
- [ ] Full flow tested manually
- [ ] Edge cases tested

### Documentation

- [ ] Code comments added
- [ ] README updated
- [ ] Admin guide created

### Deployment

- [ ] Staging tested
- [ ] Database backed up
- [ ] Migration successful
- [ ] No errors in logs
- [ ] Customer notifications working

---

## 🆘 TROUBLESHOOTING

### Issue: Migration fails

**Solution**:

- Check enum syntax
- Ensure database supports enum
- Backup and rollback, fix, try again

### Issue: Old data shows wrong status

**Solution**:

- Run migration seeder to map old → new statuses
- Manual update if seeder misconfigured

### Issue: Installments not generating

**Solution**:

- Check CreditService::generateInstallments() called at right stage
- Verify DP amount and tenor values
- Check if installments already exist

### Issue: Customer not receiving notifications

**Solution**:

- Check email configuration
- Verify WhatsApp service set up
- Check notification logs

---

## 📞 SUPPORT

If issues arise:

1. Check logs: `storage/logs/laravel.log`
2. Check database: `CreditDetail::where('id', $id)->first()`
3. Check migrations: `php artisan migrate:status`
4. Rollback and retry: `php artisan migrate:rollback`
