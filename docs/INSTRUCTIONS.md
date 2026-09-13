# 📝 Coding Guidelines & Standards - SRB Motor

**Project**: SRB Motor Dealer Platform  
**Stack**: Laravel 12 + React 19 + Inertia.js  
**Enforced By**: ESLint, Laravel Pint, PHPStan

---

## 🎯 Core Principles

1. **Readability First** - Clear code > Clever code
2. **Explicit Over Implicit** - Show intention clearly
3. **DRY (Don't Repeat Yourself)** - Extract common patterns
4. **SOLID Principles** - Single responsibility, Open/closed, etc
5. **Fail Fast** - Validate early, throw exceptions with context

---

## 🔙 Backend (Laravel/PHP)

### 1. Code Style

**File Format**

```php
<?php

namespace App\Http\Controllers;

use App\Models\CreditDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditController extends Controller
{
    // Code here
}
```

**Naming**

- Classes: `PascalCase` (e.g., `CreditController`)
- Methods: `camelCase` (e.g., `getAvailableTransitions()`)
- Properties: `camelCase` (e.g., `$creditService`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `CREDIT_STATUS_PENDING`)
- Variables: `camelCase` (e.g., `$pendingCount`)

**Spacing**

```php
// Good
public function approveDocument(Request $request, Document $document)
{
    $document->approve();

    return back()->with('success', 'Dokumen telah disetujui.');
}

// Bad - too compact
public function approveDocument(Request $request, Document $document){$document->approve();return back()->with('success', 'Dokumen telah disetujui.');}
```

### 2. Controllers

**Rules**

- Keep controllers thin, max 200 lines
- Inject services via constructor
- Validate input with Request classes
- Return Inertia response or redirect
- One responsibility per method

**Pattern**

```php
class CreditController extends Controller
{
    public function __construct(private CreditService $creditService) {}

    public function show(CreditDetail $credit)
    {
        $credit->load(['documents', 'leasingProvider']);

        return Inertia::render('Admin/Credits/Show', [
            'credit' => $credit,
            'availableTransitions' => $this->creditService->getAvailableTransitions($credit),
        ]);
    }

    public function approve(Request $request, CreditDetail $credit)
    {
        $validated = $request->validate(['notes' => 'nullable|string']);

        $this->creditService->approveCredit($credit);

        return back()->with('success', 'Credit approved');
    }
}
```

### 3. Services

**Rules**

- Extract business logic from controllers
- One service per domain (CreditService, TransactionService)
- Public methods represent use cases
- Private methods for internal logic
- Always throw exceptions for failures

**Pattern**

```php
class CreditService
{
    public function verifyDocuments(CreditDetail $credit, string $notes = ''): void
    {
        if ($credit->hasInvalidDocuments()) {
            throw new \InvalidArgumentException('All documents must be approved/rejected');
        }

        $credit->update(['status' => 'verifikasi_dokumen']);
        $this->createTimeline($credit, 'Credit documents verified', $notes);
    }

    private function createTimeline(CreditDetail $credit, string $action, string $notes = ''): void
    {
        // Implementation
    }
}
```

### 4. Models

**Rules**

- Use type hints for relationships
- Keep model files to <300 lines
- Define fillable or guarded
- Add relationship type hints
- Timestamps enabled by default

**Pattern**

```php
class CreditDetail extends Model
{
    protected $fillable = ['status', 'dp_amount', 'tenor', 'monthly_installment'];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pengajuan_masuk');
    }
}
```

### 5. Validation

**Rules**

- Use Request classes, not inline validation
- Descriptive error messages in Indonesian
- Custom messages for unclear rules
- Validate early, throw on failure

**Pattern**

```php
class ApproveDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'approval_reason' => 'nullable|string|max:500',
            'approval_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'approval_reason.max' => 'Alasan tidak boleh lebih dari 500 karakter',
        ];
    }
}
```

---

## 🎨 Frontend (React)

### 1. Component Structure

**Naming**

```javascript
// Components: PascalCase
// Functions: camelCase
// Constants: UPPER_SNAKE_CASE
// Variables: camelCase
```

**File Template**

```javascript
import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Layout from "@/Layouts/AdminLayout";
import { CCard, CButton } from "@coreui/react";

export default function CreditShow({ credit, availableTransitions }) {
    // 1. State
    const [activeModal, setActiveModal] = useState(null);
    const { data, setData, post, processing } = useForm({});

    // 2. Effects
    useEffect(() => {
        // Initialize data
    }, []);

    // 3. Handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.credits.approve", credit.id));
    };

    // 4. Render
    return <Layout>{/* Content */}</Layout>;
}
```

### 1.5. Component Size Limits (CRITICAL RULE!)

**🚨 NEVER Create Components Longer Than 150 Lines**

This single rule forces clean architecture without you thinking about it.

**Why This Matters**

> Most frontends become unmaintainable because every screen is 800+ line component
>
> - Testing becomes impossible
> - Reusability goes to zero
> - Logic gets buried in JSX
> - Refactoring becomes nightmare
> - New developers get confused

**The Rule**

```
Max 150 lines = High quality component
100-150 lines = Risk zone, start splitting
150+ lines = SPLIT IMMEDIATELY
```

**Example: When Component Gets Too Big**

❌ Bad (800 line single component)

```javascript
// Single mega-component
export default function AdminCreditShow({ credit }) {
    // 200 lines of state
    // 300 lines of handlers
    // 300 lines of JSX
    // 800 lines TOTAL - NIGHTMARE!
}
```

✅ Good (Split into focused components)

```javascript
// creditShow.jsx - 60 lines (coordinator)
export default function AdminCreditShow({ credit }) {
    return (
        <>
            <CreditStatusCard credit={credit} />
            <CustomerInfoCard credit={credit} />
            <DocumentsSection credit={credit} />
            <ActionPanel credit={credit} />
        </>
    );
}

// components/CreditStatusCard.jsx - 45 lines
// components/CustomerInfoCard.jsx - 50 lines
// components/DocumentsSection.jsx - 80 lines
// components/ActionPanel.jsx - 90 lines
// Total: 5 focused, testable components
```

**Always Separate UI from Logic**

```javascript
// ❌ Bad: Logic mixed with JSX
export default function DocumentApproveButton({ doc }) {
    const [processing, setProcessing] = useState(false);
    const handleApprove = async () => {
        setProcessing(true);
        const response = await fetch(`/api/documents/${doc.id}/approve`);
        // 20 more lines of logic here
        setProcessing(false);
        window.location.reload();
    };
    return <button onClick={handleApprove}>Approve</button>;
}

// ✅ Good: Logic in hook, UI clean
function useDocumentApproval(docId) {
    const [processing, setProcessing] = useState(false);
    const approve = async () => {
        setProcessing(true);
        await fetch(`/api/documents/${docId}/approve`);
        setProcessing(false);
        window.location.reload();
    };
    return { approve, processing };
}

export default function DocumentApproveButton({ doc }) {
    const { approve, processing } = useDocumentApproval(doc.id);
    return <button onClick={approve} disabled={processing}>Approve</button>;
}
```

**Benefits of This Rule**

✅ Components are testable (single responsibility)
✅ Easy to reuse components
✅ Logic is testable in isolation
✅ JSX stays readable (rarely 100+ lines)
✅ Debugging becomes fast (know exactly where issue is)
✅ New code reviews take 2 minutes instead of 20
✅ Maintenance costs drop dramatically

### 2. Styling

**Rules**

- Use CoreUI components primarily
- Add custom Tailwind for layout
- Bootstrap utility classes for quick styling
- Consistent spacing: `gap-3`, `mb-4`, `p-3`
- Color from CoreUI theme

**Pattern**

```javascript
// Good
<CCard className="mb-4 border-0 shadow-sm">
    <CCardHeader className="bg-transparent border-bottom border-light py-3">
        <strong className="fs-6">Title</strong>
    </CCardHeader>
    <CCardBody className="p-4">
        <p className="mb-3">Content</p>
    </CCardBody>
</CCard>

// Bad - mixing styles without consistency
<div style={{marginBottom: '20px', border: '1px solid gray'}}>
    <h3>Title</h3>
    <p>Content</p>
</div>
```

### 3. Form Handling

**Pattern**

```javascript
function ApproveModal() {
    const { data, setData, post, processing } = useForm({
        approval_reason: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.documents.approve", documentId), {
            onSuccess: () => {
                setActiveModal(null);
                window.location.reload(); // Refresh if needed
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={data.approval_reason}
                onChange={(e) => setData("approval_reason", e.target.value)}
            />
            <button disabled={processing}>
                {processing ? "Loading..." : "Submit"}
            </button>
        </form>
    );
}
```

### 4. Icons & UI

**Rules**

- Use **Lucide React** for icons
- Use **CoreUI components** for structure
- Use **SweetAlert2** for modals/confirmations
- Import icons at top: `import { Check, X, Eye } from "lucide-react"`

**Pattern**

```javascript
import { Check, X, Eye } from "lucide-react";
import { CButton } from "@coreui/react";

<CButton className="d-flex align-items-center gap-2">
    <Check size={16} />
    Approve
</CButton>;
```

### 5. Comments & Documentation

```javascript
// Good - explains WHY
const handleApprove = () => {
    // Reload page to reflect document status changes since there's no real-time state sync
    window.location.reload();
};

// Bad - explains WHAT (code already shows this)
const handleApprove = () => {
    // Reload the window
    window.location.reload();
};
```

---

## 🗂️ Database

### 1. Migrations

**Naming**

```php
// Format: YYYY_MM_DD_HHMMSS_verb_table_name
2026_03_12_100530_create_credit_details_table
2026_03_12_150645_add_leasing_provider_id_to_credit_details

// Good names
add_approval_status_to_documents
create_survey_schedules_table
drop_old_credit_status_column
```

**Pattern**

```php
Schema::create('credit_details', function (Blueprint $table) {
    $table->id();

    // Foreign keys
    $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
    $table->foreignId('leasing_provider_id')->nullable()->constrained();

    // Data
    $table->decimal('dp_amount', 15, 2);
    $table->integer('tenor'); // months
    $table->string('status')->default('pengajuan_masuk');

    // Timestamps
    $table->timestamps();
    $table->softDeletes();
});
```

### 2. Relationships

**Pattern**

```php
// One-to-Many
public function documents(): HasMany
{
    return $this->hasMany(Document::class, 'credit_detail_id');
}

// Belongs To
public function leasingProvider(): BelongsTo
{
    return $this->belongsTo(LeasingProvider::class);
}

// Many-to-Many
public function surveyors(): BelongsToMany
{
    return $this->belongsToMany(Surveyor::class);
}
```

---

## 🧪 Testing

### 🚨 BUG REPORTING: Test-First Approach (CRITICAL!)

**When Bug is Reported, NEVER Start By Fixing It**

Instead, follow this process:

**Step 1: Write Failing Test First**

```php
test('documents should not auto-transition when all approved', function () {
    $credit = Credit::factory()->create(['status' => 'pengajuan_masuk']);
    $credit->documents()->createMany([
        ['approval_status' => 'approved'],
        ['approval_status' => 'approved'],
    ]);

    // Status should STILL be pengajuan_masuk (not auto-transition)
    expect($credit->fresh()->status)->toBe('pengajuan_masuk');

    // Only after clicking verify documents should it transition
    $creditService->verifyDocuments($credit);
    expect($credit->fresh()->status)->toBe('verifikasi_dokumen');
});
```

**Step 2: Run Test - It SHOULD FAIL** (proves bug exists)

```bash
./vendor/bin/pest tests/Feature/CreditServiceTest.php
# ❌ FAILED: Status was auto-transitioned
```

**Step 3: Fix the Bug**
Now you know exactly what needs fixing because test shows it.

```php
// BEFORE (buggy):
public function approveDocument(Document $document) {
    $document->approve();
    $credit = $document->creditDetail;
    if ($credit->documents()->where('approval_status', '!=', 'approved')->count() === 0) {
        $credit->status = 'semua_dokumen_disetujui'; // ❌ AUTO-TRANSITION
        $credit->save();
    }
}

// AFTER (fixed):
public function approveDocument(Document $document) {
    $document->approve();
    // ✅ NO auto-transition, let admin click "Verify Documents"
    return back()->with('success', 'Dokumen telah disetujui.');
}
```

**Step 4: Run Test Again - Should PASS**

```bash
./vendor/bin/pest tests/Feature/CreditServiceTest.php
# ✅ PASSED: Status remains pengajuan_masuk until verify
```

**Why This Approach?**

- ✅ You understand the bug completely
- ✅ Fix is validated by test
- ✅ Same bug won't happen twice (test prevents regression)
- ✅ Documentation of what should happen
- ✅ Confidence the fix is correct

### Guidelines

- ✅ **Write test FIRST for bugs** (test proves bug exists)
- ✅ Test business logic in services
- ✅ Test workflow transitions
- ✅ Test validation rules
- ✅ Test edge cases (empty, null, invalid data)
- ✅ Mock external services (WhatsApp, etc)

**Pattern**

```php
// tests/Feature/CreditServiceTest.php
test('can verify documents when all approved', function () {
    $credit = Credit::factory()->create();
    $credit->documents()->createMany([
        ['approval_status' => 'approved'],
        ['approval_status' => 'approved'],
    ]);

    $creditService->verifyDocuments($credit);

    expect($credit->fresh()->status)->toBe('verifikasi_dokumen');
});
```

---

## 🚫 Code Review Checklist

Before pushing code:

- [ ] Follows naming conventions throughout
- [ ] No hardcoded values (use constants)
- [ ] Proper error handling with user messages
- [ ] Validation on all inputs
- [ ] No N+1 queries (eager load relationships)
- [ ] No sensitive data in logs
- [ ] Comments explain WHY, not WHAT
- [ ] Tests passing locally
- [ ] No console.log or dd() left
- [ ] Consistent with existing patterns

---

## 🚀 Performance

### Don't Do This

```php
// N+1 query problem
foreach ($credits as $credit) {
    echo $credit->transaction->user->name; // Queries DB for each!
}

// Too many relationships
$credit->load(['docs', 'transactions', 'surveys', 'schedules']);
```

### Do This Instead

```php
// Eager load what you need
$credits = Credit::with(['transaction.user'])->get();
foreach ($credits as $credit) {
    echo $credit->transaction->user->name; // One query
}

// Load only what current page needs
$credit->load(['documents', 'leasingProvider']);
```

---

## �️ Database Best Practices

### Migrations & Schema

- Always use migrations for schema changes
- Never use raw `DB::statement()` for migrations
- Add meaningful comments to complex migrations
- Include both `up()` and `down()` methods
- Test rollback locally before pushing

### Queries & Performance

```php
// GOOD - Eager load relationships
$transactions = Transaction::with(['user', 'motor', 'installments'])->get();

// BAD - N+1 queries (loops cause DB hits)
foreach ($transactions as $t) {
    echo $t->user->name; // Extra query per iteration
}

// GOOD - Use whereRelation() for filtering
$credits = CreditDetail::whereRelation('documents', 'verification_status', '!=', 'approved')->get();

// BAD - Avoid unnecessary relations
$credits = CreditDetail::with('survey_schedules', 'notifications', 'logs')->get();
```

### Data Integrity

- Always use `foreign key()` and `on delete` constraints
- Validate data at model level (rules in casts)
- Use `transactional` operations for critical flows

```php
DB::transaction(function () {
    $transaction->update(['status' => 'approved']);
    $creditDetail->update(['credit_status' => 'approved']);
    Log::info("Transaction approved", ['transaction_id' => $transaction->id]);
});
```

---

## 🔌 API Design Standards

### Request Validation

```php
// Use Form Request classes (not in controller)
class StoreTransactionRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'motor_id' => 'required|exists:motors,id',
            'customer_name' => 'required|max:255',
            'customer_phone' => 'required|regex:/^(\+62|0)[0-9]{9,12}$/',
            'address' => 'required|min:10',
        ];
    }

    public function messages()
    {
        return [
            'customer_phone.regex' => 'Nomor telepon tidak valid',
        ];
    }
}
```

### Response Format

All API responses must follow:

```json
{
    "status": "success|error",
    "message": "Human readable message",
    "data": {},
    "meta": {} // optional
}
```

### Status Codes

```php
// ✅ Success
200 OK
201 Created
204 No Content

// ❌ Client Error
400 Bad Request
422 Unprocessable Entity (validation)
404 Not Found
401 Unauthorized (no token)
403 Forbidden (no permission)
429 Too Many Requests (rate limited)

// ❌ Server Error
500 Internal Server Error
503 Service Unavailable
```

---

## 🔐 Security Best Practices

### Authentication & Authorization

```php
// GOOD - Check authorization
if ($transaction->user_id !== auth()->id()) {
    abort(403, 'Tidak memiliki akses');
}

// BETTER - Use gate/policy
Gate::authorize('view', $transaction);
$this->authorize('view', $transaction);
```

### Payment Handling

```php
// ✅ NEVER log sensitive data
Log::info("Payment started", ['transaction_id' => $id]); // OK

// ❌ NEVER log card numbers or tokens
Log::info("Payment started", ['card' => $cardNumber]); // BAD!

// ✅ Use Midtrans tokenization
$snapToken = \Midtrans\Snap::getSnapToken($transactionDetails);
```

### File Uploads

```php
// GOOD - Validate file
$request->validate([
    'document' => 'required|file|mimes:pdf,jpg,png|max:5120' // 5MB
]);

Storage::put('documents/verified_' . time(), $request->file('document'));

// BAD - No validation
move_uploaded_file($_FILES['doc']['tmp_name'], 'public/');
```

---

## �📋 Commit Message Format

```
[TYPE] Brief description

Optional detailed explanation.
- List of changes
- Another change

Related to: #123
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

**Example**

```
[feat] Add document approval workflow in admin

- Add approve/reject buttons to documents table
- Save approval_status to documents
- Show document status in user transaction page
- Send notification to user on approval/rejection

Related to: Credit workflow
```

---

**Last Updated**: March 19, 2026  
**Status**: 🟢 Active Standard  
**Reviewed By**: Development Team
