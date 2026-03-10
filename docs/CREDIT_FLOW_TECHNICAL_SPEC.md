# 🎯 CREDIT FLOW REFACTOR - DETAILED TECHNICAL SPEC

## 📊 VISUAL FLOWCHART

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CREDIT APPLICATION LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────────────────┘

USER ACTIONS:
═════════════════════════════════════════════════════════════════════════════

            User Clicks "Ajukan Kredit"
                        │
                        ↓
            ┌──────────────────────────┐
            │ STAGE 1: PENGAJUAN MASUK  │  pengajuan_masuk
            │ (Application Received)    │  ━━━━━━━━━━━━━━── User submits form
            │                           │  + Documents uploaded (KTP, KK, Slip)
            └─────────────┬─────────────┘
                          │ [Auto transition]
                          ↓
            ┌──────────────────────────┐
            │ STAGE 2: VERIFIKASI       │  verifikasi_dokumen
            │ DOKUMEN                   │  ━━━━━━━━━━━━━━── Admin reviews docs
            │ (Document Check)          │  - Check completeness
            │                           │  - Check document quality
            │ ADMIN DECISION:           │  - Verify info matches
            │ ├─ ✅ VALID              │
            │ └─ ❌ INVALID (ask reup) │
            └─────────────┬─────────────┘
                          │
                ┌─────────┴──────────┐
                │                    │
        (✅ VALID)            (❌ ASK REUPLOAD)
                │                    │
                ↓                    └─→ Customer reuploads
                │                        back to STAGE 2
                ↓
            ┌──────────────────────────┐
            │ STAGE 3: DIKIRIM KE       │  dikirim_ke_leasing
            │ LEASING                   │  ━━━━━━━━━━━━━━── Admin sends to
            │ (Sent to Leasing)         │  leasing partner
            │ + Select Leasing Provider │  (FIF, Adira, BAF, etc)
            │ + Get Reference Number    │
            └─────────────┬─────────────┘
                          │ [Leasing reviews]
                          ↓
            ┌──────────────────────────┐
            │ STAGE 4: SURVEY           │  survey_dijadwalkan
            │ DIJADWALKAN               │  ━━━━━━━━━━━━━━── Leasing schedules
            │ (Survey Scheduled)        │  + Admin sets surveyor
            │ + Set Survey Date/Time    │  + Set survey location/date
            │ + Assign Surveyor         │
            └─────────────┬─────────────┘
                          │ [Scheduled date arrives]
                          ↓
            ┌──────────────────────────┐
            │ STAGE 5: SURVEY BERJALAN  │  survey_berjalan
            │ (Survey In Progress)      │  ━━━━━━━━━━━━━━── Surveyor visits
            │ + Surveyor visits home    │  - Verify address
            │ + Checks income, address  │  - Check living conditions
            │ + Collects survey data    │  - Verify income
            │                           │  - Additional checks
            └─────────────┬─────────────┘
                          │ [Survey complete]
                          ↓
            ┌──────────────────────────┐
            │ STAGE 6: MENUNGGU         │  menunggu_keputusan_leasing
            │ KEPUTUSAN LEASING         │  ━━━━━━━━━━━━━━── Admin enters
            │ (Waiting for Decision)    │  survey results
            │ + Input survey findings   │  + Leasing analyzes → decision
            │ + Leasing makes decision  │
            └─────────────┬─────────────┘
                          │
                ┌─────────┴──────────┐
                ↓                    ↓
        ┌─────────────┐    ┌──────────────┐
        │ APPROVED ✅  │    │ REJECTED ❌   │
        │ disetujui   │    │ ditolak      │
        └──────┬──────┘    └──────────────┘
               │                  │
               │                  └─→ Customer notified
               │                      Can reapply
               │
               ↓
        ┌──────────────────────────┐
        │ STAGE 7: DP DIBAYAR       │  dp_dibayar
        │ (DP Paid)                 │  ━━━━━━━━━━━━━━── Customer pays DP
        │ + Customer pays DP        │  + Admin confirms payment
        │ + Admin confirms payment  │  + Installments generated
        │ + Installments created    │
        └──────────┬─────────────────┘
                   │ [Dealer prepares unit]
                   ↓
        ┌──────────────────────────┐
        │ STAGE 8: SELESAI          │  selesai
        │ (Completed)               │  ━━━━━━━━━━━━━━── Motor delivered
        │ + Motor delivered         │  + Customer owns unit
        │ + Transaction complete    │  + Payment cycle begins
        └──────────────────────────┘

════════════════════════════════════════════════════════════════════════════════

DATABASE TABLES INVOLVED:
═════════════════════════════════════════════════════════════════════════════

credit_details (main status tracking)
├─ transaction_id ──→ transactions
├─ credit_status ─┐
├─ survey_scheduled_date
├─ survey_scheduled_time
├─ surveyor_name
├─ survey_notes
├─ leasing_provider_id ──→ leasing_providers
├─ leasing_decision_date
├─ rejection_reason
├─ dp_paid_date
└─ internal_notes

documents (document tracking)
├─ transaction_id
├─ document_type (KTP, KK, Slip Gaji, etc)
├─ approval_status (pending, approved, rejected)
└─ file_path

survey_schedules (survey details)
├─ credit_detail_id
├─ scheduled_date
├─ scheduled_time
└─ [other survey fields]

installments (payment tracking)
├─ transaction_id
├─ amount
├─ due_date
├─ status (pending, paid)
└─ payment_date
```

---

## 🔄 STATUS TRANSITION MATRIX

### Valid Transitions (What can change to what?)

```javascript
const statusTransitions = {
    // Stage 1: Application Received
    pengajuan_masuk: [
        "verifikasi_dokumen", // Auto transition when docs uploaded
    ],

    // Stage 2: Document Verification
    verifikasi_dokumen: [
        "pengajuan_masuk", // Ask customer to reupload docs
        "dikirim_ke_leasing", // Docs validated, send to leasing
    ],

    // Stage 3: Sent to Leasing
    dikirim_ke_leasing: [
        "survey_dijadwalkan", // Leasing schedules survey
    ],

    // Stage 4: Survey Scheduled
    survey_dijadwalkan: [
        "survey_berjalan", // Survey date reached
    ],

    // Stage 5: Survey In Progress
    survey_berjalan: [
        "menunggu_keputusan_leasing", // Survey complete, waiting decision
    ],

    // Stage 6: Waiting for Leasing Decision
    menunggu_keputusan_leasing: [
        "disetujui", // Approved
        "ditolak", // Rejected
    ],

    // Stage 7a: Approved
    disetujui: [
        "dp_dibayar", // DP paid
    ],

    // Stage 8a: Rejected
    ditolak: [
        "pengajuan_masuk", // Allow reapplication
    ],

    // Stage 9: DP Paid
    dp_dibayar: [
        "selesai", // Motor delivered
    ],

    // Stage 10: Completed
    selesai: [
        // Final state, no transitions
    ],
};
```

---

## 📋 DATABASE SCHEMA UPGRADE

### Migration File: `2026_03_11_xxxxxx_refactor_credit_flow.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {

            // 1. Update ENUM to new statuses
            $table->dropColumn('credit_status');
            $table->enum('credit_status', [
                'pengajuan_masuk',
                'verifikasi_dokumen',
                'dikirim_ke_leasing',
                'survey_dijadwalkan',
                'survey_berjalan',
                'menunggu_keputusan_leasing',
                'disetujui',
                'ditolak',
                'dp_dibayar',
                'selesai'
            ])->default('pengajuan_masuk');

            // 2. Survey Information
            $table->dateTime('survey_scheduled_date')->nullable();
            $table->time('survey_scheduled_time')->nullable();
            $table->string('surveyor_name')->nullable();
            $table->string('surveyor_phone')->nullable();
            $table->longText('survey_notes')->nullable();
            $table->dateTime('survey_completed_at')->nullable();

            // 3. Leasing Provider Info
            $table->foreignId('leasing_provider_id')
                ->nullable()
                ->constrained('leasing_providers')
                ->onDelete('set null');
            $table->string('leasing_application_ref')->nullable();
            $table->dateTime('leasing_decision_date')->nullable();

            // 4. Decision Information
            $table->text('rejection_reason')->nullable();
            $table->text('internal_notes')->nullable();

            // 5. DP Payment Tracking
            $table->dateTime('dp_paid_date')->nullable();
            $table->string('dp_payment_method')->nullable();
            $table->unsignedBigInteger('dp_confirmed_by')->nullable();

            // 6. Indices for performance
            $table->index('credit_status');
            $table->index('leasing_provider_id');
            $table->index('survey_scheduled_date');
        });
    }

    public function down(): void
    {
        Schema::table('credit_details', function (Blueprint $table) {
            $table->dropIndex(['credit_status']);
            $table->dropIndex(['leasing_provider_id']);
            $table->dropIndex(['survey_scheduled_date']);

            $table->dropForeignKeyIfExists(['leasing_provider_id']);
            $table->dropColumn([
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
                'credit_status'
            ]);

            // Restore old enum
            $table->enum('credit_status', [
                'menunggu_persetujuan',
                'data_tidak_valid',
                'dikirim_ke_surveyor',
                'jadwal_survey',
                'disetujui',
                'ditolak'
            ])->default('menunggu_persetujuan');
        });
    }
};
```

---

## 🏗️ CLASS STRUCTURE OVERVIEW

### CreditService (NEW)

```php
class CreditService
{
    // Stage 2 → 3
    public function approveDocuments(CreditDetail $credit, array $data)
    // Mark docs as valid, move to dikirim_ke_leasing

    // Stage 2 (Back)
    public function rejectDocuments(CreditDetail $credit, string $reason)
    // Ask customer to reupload, stay in verifikasi_dokumen

    // Stage 3
    public function sendToLeasing(CreditDetail $credit, array $data)
    // Select leasing provider, send application
    // Move to dikirim_ke_leasing

    // Stage 4
    public function scheduleSurvey(CreditDetail $credit, array $surveyData)
    // Set date, time, surveyor
    // Move to survey_dijadwalkan

    // Stage 5
    public function startSurvey(CreditDetail $credit)
    // Start survey process
    // Move to survey_berjalan

    // Stage 5 → 6
    public function completeSurvey(CreditDetail $credit, array $surveyResults)
    // Input survey findings (notes, observations)
    // Move to menunggu_keputusan_leasing

    // Stage 6 → 7a or 8a
    public function makeDecision(CreditDetail $credit, bool $approved, ?string $reason)
    // If approved: move to disetujui
    // If rejected: move to ditolak, save rejection_reason

    // Stage 7 → 9
    public function confirmDPPayment(CreditDetail $credit, array $paymentData)
    // Record DP payment, generate installments
    // Move to dp_dibayar

    // Stage 9 → 10
    public function completeDelivery(CreditDetail $credit)
    // Mark as completed
    // Move to selesai
}
```

### Controller Updates

```php
// Admin/CreditController (NEW)
class CreditController extends Controller
{
    // GET /admin/credits
    public function index()
    // List all credits with filters by stage

    // GET /admin/credits/{credit}
    public function show(CreditDetail $credit)
    // Show credit details with timeline

    // POST /admin/credits/{credit}/approve-documents
    public function approveDocuments(CreditDetail $credit)
    // Stage 2 → 3

    // POST /admin/credits/{credit}/reject-documents
    public function rejectDocuments(CreditDetail $credit)
    // Stage 2 (back)

    // POST /admin/credits/{credit}/send-to-leasing
    public function sendToLeasing(CreditDetail $credit)
    // Stage 3

    // POST /admin/credits/{credit}/schedule-survey
    public function scheduleSurvey(CreditDetail $credit)
    // Stage 4

    // POST /admin/credits/{credit}/start-survey
    public function startSurvey(CreditDetail $credit)
    // Stage 5

    // POST /admin/credits/{credit}/complete-survey
    public function completeSurvey(CreditDetail $credit)
    // Stage 5 → 6

    // POST /admin/credits/{credit}/approve
    public function approve(CreditDetail $credit)
    // Stage 6 → 7a

    // POST /admin/credits/{credit}/reject
    public function reject(CreditDetail $credit)
    // Stage 6 → 8a

    // POST /admin/credits/{credit}/confirm-dp-payment
    public function confirmDPPayment(CreditDetail $credit)
    // Stage 7 → 9

    // POST /admin/credits/{credit}/complete-delivery
    public function completeDelivery(CreditDetail $credit)
    // Stage 9 → 10
}
```

---

## 📱 View Structure (NextJS/Inertia)

### Admin Credit Management Pages

```
Admin/Credits/
├─ Index.jsx                           -- List all applications
│  └─ Shows filter by stage
│  └─ Shows status badge, customer, leasing, stage
├─ Show.jsx                            -- Detail view with timeline
│  └─ Shows full history
│  └─ Shows documents
│  └─ Shows survey info
├─ VerifyDocuments.jsx                 -- Stage 2 action
├─ SendToLeasing.jsx                   -- Stage 3 action
├─ ScheduleSurvey.jsx                  -- Stage 4 action
├─ EnterSurveyResults.jsx              -- Stage 5→6 action
├─ MakeDecision.jsx                    -- Stage 6 decision
│  ├─ ApproveForm.jsx
│  └─ RejectForm.jsx
├─ ConfirmDPPayment.jsx                -- Stage 7→9 action
└─ CompleteDelivery.jsx                -- Stage 9→10 action
```

### Customer Views (Updates)

```
Motors/
├─ TransactionDetail.jsx               -- Customer sees status, next action
├─ CreditApplicationStatus.jsx         -- New: shows current stage with ETA
└─ [existing components with updated labels]
```

---

## 🔔 NOTIFICATION TRIGGERS

```javascript
const notificationTriggers = {
    // When admin approves documents
    "verifikasi_dokumen → dikirim_ke_leasing": {
        email: "Dokumen Anda Diterima",
        whatsapp: "Berkas sudah valid, sedang diproses ke leasing",
    },

    // When added to leasing assessment
    dikirim_ke_leasing: {
        admin: "Application sent to leasing",
        internal: "Track leasing reference",
    },

    // When survey scheduled
    survey_dijadwalkan: {
        email: "Survey Dijadwalkan",
        whatsapp: "Surveyor akan datang pada [date] jam [time]",
    },

    // When survey complete
    "survey_berjalan → menunggu_keputusan_leasing": {
        admin: "Survey complete, waiting leasing decision",
    },

    // When approved
    "menunggu_keputusan_leasing → disetujui": {
        email: "SELAMAT! Kredit Disetujui",
        whatsapp: "Cicilan Anda: Rp [amount]/bulan selama [tenor] bulan",
    },

    // When rejected
    "menunggu_keputusan_leasing → ditolak": {
        email: "Pengajuan Kredit Ditolak",
        whatsapp: "Keterangan: [reason]. Hubungi kami untuk informasi.",
    },

    // When DP confirmed
    "disetujui → dp_dibayar": {
        email: "DP Diterima, Motor Siap",
        whatsapp: "Motor Anda sedang disiapkan untuk pengiriman",
    },
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ]   1. Create migration file with schema updates
- [ ]   2. Update CreditDetail model:
    - [ ] Add new fillable columns
    - [ ] Add relationships: leasingProvider(), surveyor()
    - [ ] Add accessor methods for formatting
- [ ]   3. Create CreditService class with all methods
- [ ]   4. Update CreditDetailObserver:
    - [ ] Update syncTransactionStatus()
    - [ ] Map new statuses to transaction statuses
- [ ]   5. Create Admin/CreditController with all actions
- [ ]   6. Create migration file for existing data:
    - [ ] Map old statuses → new statuses
- [ ]   7. Update Admin UI components:
    - [ ] Credits/Index.jsx with new filters
    - [ ] Credits/Show.jsx with timeline
    - [ ] Stage-specific action pages
- [ ]   8. Update customer views:
    - [ ] TransactionDetail.jsx with new status labels
    - [ ] Show current stage clearly
- [ ]   9. Update routes:
    - [ ] Add new admin credit routes
- [ ]   10. Write tests for each service method
- [ ]   11. Write tests for status transitions
- [ ]   12. Database migration on staging/prod
- [ ]   13. Test full application flow

---

## 📊 Status Label Mapping (for UI)

```javascript
const statusLabels = {
    pengajuan_masuk: {
        id: "Pengajuan Masuk",
        icon: "📝",
        color: "gray",
        description: "Aplikasi diterima, menunggu verifikasi dokumen",
    },
    verifikasi_dokumen: {
        id: "Verifikasi Dokumen",
        icon: "🔍",
        color: "blue",
        description: "Admin sedang memeriksa dokumen Anda",
    },
    dikirim_ke_leasing: {
        id: "Dikirim ke Leasing",
        icon: "✈️",
        color: "purple",
        description: "Data dikirim ke leasing untuk analisis",
    },
    survey_dijadwalkan: {
        icon: "📅",
        id: "Survey Dijadwalkan",
        color: "cyan",
        description: "Jadwal survey Anda [tanggal] jam [jam]",
    },
    survey_berjalan: {
        icon: "👤",
        id: "Survey Berjalan",
        color: "yellow",
        description: "Surveyor sedang mengunjungi lokasi Anda",
    },
    menunggu_keputusan_leasing: {
        icon: "⏳",
        id: "Menunggu Keputusan",
        color: "orange",
        description: "Leasing sedang mengevaluasi aplikasi Anda",
    },
    disetujui: {
        icon: "✅",
        id: "Disetujui",
        color: "green",
        description: "Kredit disetujui! Lanjut ke pembayaran DP",
    },
    ditolak: {
        icon: "❌",
        id: "Ditolak",
        color: "red",
        description: "Alasan: [reason]. Silakan hubungi kami untuk konsultasi",
    },
    dp_dibayar: {
        icon: "💳",
        id: "DP Dibayar",
        color: "teal",
        description: "DP diterima, motor siap dikirim",
    },
    selesai: {
        icon: "🎉",
        id: "Selesai",
        color: "green",
        description: "Motor sudah diterima, cicilan dimulai",
    },
};
```
