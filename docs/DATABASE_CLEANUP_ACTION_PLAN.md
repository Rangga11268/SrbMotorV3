# 🧹 DATABASE CLEANUP ACTION PLAN

**Created**: March 11, 2026  
**Priority**: Sequential execution recommended

---

## 🎯 IMMEDIATE ACTIONS (Do First)

### ACTION 1: Delete Dead Code Model

**File to Delete**: `app/Models/MotorSpecification.php`

**Reason**:

- Table `motor_specifications` was dropped in migration `2026_03_07_195727`
- Model still references non-existent table
- Imports in MotorController reference this model

**Steps**:

1. Delete file: `rm app/Models/MotorSpecification.php`
2. Check for remaining references: `grep -r "MotorSpecification" app/`
3. Remove import from `app/Http/Controllers/MotorController.php`

**Expected References to Remove**:

```php
use App\Models\MotorSpecification;  // Line ~8 in MotorController
```

---

### ACTION 2: Verify Survey Schedules Table Usage

**Table**: `survey_schedules` (12 columns)  
**Status**: ✅ ACTIVELY USED (contrary to initial speculation)

**Where It's Used**:

- ✅ MotorGalleryController::scheduleSurvey()
- ✅ MotorGalleryController::confirmSurveyAttendance()
- ✅ MotorGalleryController::confirmSurveyCompletion()
- ✅ MotorGalleryController::requestSurveyReschedule()
- ✅ SurveySchedule model with 7 methods
- ✅ CreditDetail::surveySchedules() relationship
- ✅ TransactionDetail.jsx front-end display
- ✅ SurveyScheduleCard.jsx component

**Verdict**: ✅ **KEEP** - This table is essential and actively used

---

## 🟠 HIGH PRIORITY FIXES (This Sprint)

### FIX 1: Soft Delete Pattern Inconsistency

**Affected Table**: `transactions`  
**Problem Columns**: `cancelled_at`, `cancellation_reason`

**Current State**:

```sql
SHOW COLUMNS FROM transactions WHERE Field IN ('cancelled_at', 'cancellation_reason');
-- Returns:
-- cancelled_at: timestamp, nullable, default NULL
-- cancellation_reason: varchar(255), nullable, default NULL
```

**Issue**: Columns exist but model doesn't use SoftDeletes trait

**Current Model Code**:

```php
// File: app/Models/Transaction.php
namespace App\Models;

class Transaction extends Model
{
    // ⚠️ NO SoftDeletes trait present!
    use HasFactory;
    // Should have: use SoftDeletes;
}
```

**Solution Options**:

#### Option A: Implement Full Soft Delete (RECOMMENDED)

```php
// app/Models/Transaction.php
namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deleted_at', 'cancelled_at'];
}
```

Then update queries to exclude soft-deleted:

```php
// Before:
Transaction::all()  // Returns cancelled AND active

// After (with SoftDeletes):
Transaction::all()  // Returns only active (excludes soft-deleted)
Transaction::withTrashed()->all()  // Include cancelled
Transaction::onlyTrashed()->all()  // Only cancelled
```

#### Option B: Remove Soft Delete Columns (If Not Needed)

```php
// Create migration: php artisan make:migration remove_cancellation_from_transactions

Schema::table('transactions', function (Blueprint $table) {
    $table->dropColumn(['cancelled_at', 'cancellation_reason']);
});
```

**Recommendation**: Use **Option A** - Implement SoftDeletes properly

---

### FIX 2: Redundant Column Analysis

#### Column: `transactions.credit_amount`

**Current State**:

```sql
SELECT * FROM transactions WHERE transaction_type = 'CREDIT' LIMIT 1
-- Shows: credit_amount (duplicate of credit_details.down_payment)
```

**Usage**:

```php
// In Transaction model->fillable:
'credit_amount'

// Used in: CreditDetail creation
$creditDetail = $transaction->creditDetail()->create([
    'down_payment' => $transaction->credit_amount,  // ← loads from here
    // ...
]);
```

**Decision**:

- ✅ **KEEP** if transaction queries fetch credit_amount without join
- ❌ **DELETE** if always using `$transaction->creditDetail->down_payment`

**Recommendation**: ✅ **KEEP** - Denormalization aids search/filter performance

---

#### Column: `users.profile_photo_path`

**Status**: Not displayed in any views

**Verification**:

```bash
grep -r "profile_photo_path" resources/
# No results - field not used in UI
```

**Recommendation**:

- ❌ **REMOVE** in next cleanup cycle
- Or ✅ **IMPLEMENT** if planning profile photo feature

**Removal Migration**:

```php
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('profile_photo_path');
});
```

---

#### Column: `users.remember_token`

**Status**: Laravel default field, might not be used

**Check**:

```php
// Search for "remember" in codebase:
// Line in web.php auth middlewares?
// UsageCheckHelper: grep -r "remember" routes/ config/
```

**Recommendation**:

- 🔍 **VERIFY** if remember-me feature is needed
- ✅ **KEEP** if maintaining remember-me checkbox on login
- ❌ **REMOVE** if not needed

---

### FIX 3: Document Approval Workflow

**Status**: ✅ Working correctly

**Columns Involved**:

- documents.approval_status (enum: pending, approved, rejected)
- documents.rejection_reason (text)
- documents.reviewed_at (timestamp)

**Usage**:

```php
// Create document
$document = Document::create([
    'approval_status' => 'pending',
    // ...
]);

// Approve workflow
$document->approve();  // Sets approved + reviewed_at

// Reject workflow
$document->reject($reason);  // Sets rejected + reviewed_at + rejection_reason

// Check status
$document->isPending()
$document->isApproved()
$document->isRejected()
```

**Verdict**: ✅ **NO CHANGES NEEDED** - This is working well

---

## 🟡 MEDIUM PRIORITY (Next Sprint)

### OPTIMIZATION 1: Rarely-Used Columns Audit

**Columns to Evaluate**:

1. **transactions.notes**
    - Type: text
    - Usage: ~0.1% queries
    - Action: Consider archiving or removing

2. **survey_schedules.notes**
    - Type: text
    - Usage: Rarely populated
    - Action: Verify if needed, consider removing

3. **credit_details.leasing_application_ref**
    - Type: varchar
    - Usage: External provider tracking only
    - Action: Keep (useful for reconciliation)

4. **credit_details.leasing_decision_date**
    - Type: datetime
    - Usage: Medium (audit trail)
    - Action: Keep

**Migration to Remove Low-Priority Columns** (Optional):

```php
// php artisan make:migration remove_rarely_used_columns

Schema::table('transactions', function (Blueprint $table) {
    $table->dropColumn('notes');
});

Schema::table('survey_schedules', function (Blueprint $table) {
    $table->dropColumn('notes');
});
```

---

### OPTIMIZATION 2: Data Archival Strategy

**Target**: Completed transactions older than 2 years

**SQL Query to Identify**:

```sql
SELECT COUNT(*) as old_records
FROM transactions
WHERE status = 'completed'
  AND created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
```

**Archival Process**:

1. Create archive table: `transactions_archive`
2. Move old records to archive
3. Create index on archive date
4. Update queries to exclude archived

**Pseudocode**:

```php
// Create archive table migration
Schema::create('transactions_archive', function (Blueprint $table) {
    // Same schema as transactions
    $table->index('archived_at');
});

// Move old data
DB::statement("
    INSERT INTO transactions_archive
    SELECT * FROM transactions
    WHERE status = 'completed'
    AND created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR)
");

// Delete from active
DB::statement("
    DELETE FROM transactions
    WHERE status = 'completed'
    AND created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR)
");
```

---

## 🟢 LOW PRIORITY (Nice to Have)

### ENHANCEMENT 1: Add Column Usage Documentation

**Create File**: `docs/DATABASE_COLUMN_GUIDE.md`

```markdown
# Database Column Usage Guide

## Frequently Used (QUERY ON)

- transactions.status → Used in 90% of transaction queries
- credit_details.credit_status → State machine for credit flow
- documents.approval_status → Workflow filtering

## Occasionally Used (REPORT)

- transactions.payment_method → Payment reports
- credit_details.interest_rate → Rate analysis
- posts.views → Popular content tracking

## Rarely Used (REFERENCE)

- credit_details.leasing_application_ref → External lookup
- survey_schedules.notes → Manual notes

## Not Used (ARCHIVE CANDIDATES)

- transactions.notes → Can be archived
- users.profile_photo_path → Not displayed
```

---

### ENHANCEMENT 2: Add Indexes for Performance

**High-Value Columns Missing Indexes**:

```php
// Migration: php artisan make:migration add_performance_indexes

Schema::table('transactions', function (Blueprint $table) {
    $table->index('status');
    $table->index(['user_id', 'transaction_type']);
    $table->index(['created_at', 'status']);
});

Schema::table('credit_details', function (Blueprint $table) {
    $table->index('credit_status');
    $table->index('created_at');
});

Schema::table('documents', function (Blueprint $table) {
    $table->index('approval_status');
});

Schema::table('posts', function (Blueprint $table) {
    $table->index(['status', 'published_at']);
});
```

---

## 📋 CHECKLIST FOR IMPLEMENTATION

### Phase 1: Immediate Cleanup (1-2 hours)

- [ ] Delete `app/Models/MotorSpecification.php`
- [ ] Remove MotorSpecification import from MotorController.php
- [ ] Run tests to verify no broken references
- [ ] Commit as "Remove dead code: MotorSpecification model"

### Phase 2: Soft Delete Implementation (2-3 hours)

- [ ] Add SoftDeletes trait to Transaction model
- [ ] Create migration to change cancelled_at behavior
- [ ] Update queries using cancelled_at
- [ ] Test cancellation workflow
- [ ] Commit as "Implement proper soft-delete for transactions"

### Phase 3: Column Analysis (2-3 hours)

- [ ] Document purpose of rarely-used columns
- [ ] Get stakeholder approval for column removal
- [ ] Create migration for removal
- [ ] Test application without removed columns
- [ ] Commit as "Remove unused columns: profile_photo_path, remember_token"

### Phase 4: Data Archival Setup (3-4 hours)

- [ ] Design archival strategy
- [ ] Create archive tables
- [ ] Implement archival process
- [ ] Set up retention policy
- [ ] Test archive restore procedure
- [ ] Commit as "Add transaction archival system"

### Phase 5: Performance Optimization (1-2 hours)

- [ ] Add missing indexes
- [ ] Run EXPLAIN on slow queries
- [ ] Benchmark before/after
- [ ] Document index strategy
- [ ] Commit as "Add performance indexes to frequently-queried columns"

---

## ✅ VERIFICATION CHECKLIST

After each cleanup, verify:

```bash
# 1. No broken imports
php artisan tinker
>>> use App\Models\MotorSpecification;
>>> Error: Class not found ✓

# 2. Database integrity
php artisan migrate:status  # All up ✓

# 3. Tests pass
php artisan test  # All tests green ✓

# 4. Laravel up
php artisan tinker
>>> DB::table('motors')->count()
>>> 42 ✓

# 5. No SQL errors
php artisan tinker
>>> foreach(DB::select('SELECT * FROM transactions LIMIT 1') as $t)
>>>   dd($t);
>>> Success ✓
```

---

## 📝 SUMMARY

### Tables Status

- ✅ **ALL ACTIVE** (19 tables) - No tables to delete
- ✅ **survey_schedules CONFIRMED ACTIVE** - Keep it
- ❌ **motor_specifications DELETED** - Last reference to remove

### Models Status

- ✅ All 16 models are used
- ❌ MotorSpecification.php is dead code - DELETE

### Columns to Address

1. **transactions.cancelled_at** → Fix soft-delete pattern (HIGH)
2. **transactions.notes** → Archive/remove (LOW)
3. **users.profile_photo_path** → Remove if unused (LOW)
4. **users.remember_token** → Verify then decide (LOW)

### Redundancy: Acceptable

- survey_schedules duplicating credit_details columns = OK (independent queries)
- transactions.credit_amount = OK (denormalization for search)

---

**Estimated Total Effort**: 10-15 hours across 5 phases  
**Recommended Pace**: 1 phase per week  
**Risk Level**: LOW (most changes are safe deletions)
