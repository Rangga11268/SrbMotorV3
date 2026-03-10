# 🔄 REFACTOR CREDIT FLOW - COMPREHENSIVE ANALYSIS & PLAN

## 📊 CURRENT vs NEW STATUS FLOW

### ❌ CURRENT STATUS MAPPING (COMPLEX)

```
menunggu_persetujuan  → Menunggu Persetujuan
data_tidak_valid      → Data Tidak Valid (if docs incomplete)
dikirim_ke_surveyor   → Dikirim ke Surveyor
jadwal_survey         → Jadwal Survey
disetujui             → Disetujui (Approved)
ditolak               → Ditolak (Rejected)
```

**Issues:**

- `dikirim_ke_surveyor` and `jadwal_survey` are two separate states but should be clearer
- Missing: explicit "survey in progress" state
- Missing: explicit "waiting for leasing decision" state
- Missing: explicit "DP paid" state
- Transaction completion not clearly separated from credit stages
- Complex mapping between credit_status and transaction status

---

## ✅ NEW 8-STAGE MODEL (SIMPLIFIED & CLEAR)

```
┌──────────────────────────────────────────────────┐
│ STAGE 1: PENGAJUAN MASUK (Application Received) │
│ Status: pengajuan_masuk                          │
│ What: User submits credit form + documents      │
│       Auto status when transaction created      │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 2: VERIFIKASI DOKUMEN (Document Check)    │
│ Status: verifikasi_dokumen                       │
│ What: Admin reviews KTP, KK, documents           │
│       Admin decides: valid or ask reupload      │
│       If valid → move to stage 3                │
│       If invalid → ask customer to reupload    │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 3: DIKIRIM KE LEASING (Sent to Leasing)   │
│ Status: dikirim_ke_leasing                       │
│ What: Admin sends application to leasing partner│
│       Leasing company receives & does initial   │
│       credit analysis                            │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 4: SURVEY DIJADWALKAN (Survey Scheduled)  │
│ Status: survey_dijadwalkan                       │
│ What: Leasing schedules survey date & time      │
│       Admin sets surveyor info                  │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 5: SURVEY BERJALAN (Survey In Progress)   │
│ Status: survey_berjalan                          │
│ What: Surveyor visits customer, checks:         │
│       - Address authenticity                    │
│       - Income verification                     │
│       - Living conditions                       │
│       - Any additional info                     │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 6: MENUNGGU KEPUTUSAN (Waiting Decision)  │
│ Status: menunggu_keputusan_leasing               │
│ What: Admin/surveyor inputs survey results      │
│       Leasing evaluates and makes decision      │
└────────────────────┬─────────────────────────────┘
                     ↓
           ┌─────────┴──────────┐
           ↓                    ↓
    ┌────────────┐       ┌───────────┐
    │ APPROVED ✅ │       │ REJECTED ❌ │
    └─────┬──────┘       └───────────┘
          │
          ↓
┌──────────────────────────────────────────────────┐
│ STAGE 7: DP DIBAYAR (DP Paid)                    │
│ Status: dp_dibayar                               │
│ What: Customer pays down payment                │
│       Admin confirms payment received           │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 8: SELESAI (Completed)                    │
│ Status: selesai                                  │
│ What: Motor prepared & delivered to customer   │
│       Customer begins monthly installments     │
└──────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA CHANGES

### Current `credit_details` Table:

```sql
- id
- transaction_id (FK)
- down_payment
- tenor
- monthly_installment
- credit_status (enum: menunggu_persetujuan, data_tidak_valid, dikirim_ke_surveyor, jadwal_survey, disetujui, ditolak)
- approved_amount
- created_at, updated_at
```

### ➕ NEW COLUMNS NEEDED:

```sql
-- Survey Information
- survey_scheduled_date      (nullable)  -- When survey is scheduled for
- survey_scheduled_time      (nullable)  -- Time of survey
- surveyor_name              (nullable)  -- Who will do survey
- surveyor_phone             (nullable)  -- Surveyor contact
- survey_notes               (nullable)  -- Surveyor findings

-- Leasing Provider Info
- leasing_provider_id        (FK)        -- Which leasing: FIF, Adira, BAF, etc
- leasing_application_ref    (nullable)  -- Reference number from leasing company
- leasing_decision_date      (nullable)  -- When leasing made decision

-- Decision Information
- rejection_reason           (nullable)  -- If rejected: why? (penghasilan kurang, riwayat kredit buruk, dll)
- internal_notes             (nullable)  -- Admin notes during process

-- DP Payment Tracking
- dp_paid_date               (nullable)  -- When DP was paid
- dp_payment_method          (nullable)  -- How DP was paid (transfer, cash, etc)
- dp_confirmed_by            (nullable)  -- Which admin confirmed
```

### ✅ NEW ENUM VALUES:

```sql
credit_status enum:
- pengajuan_masuk              (1)
- verifikasi_dokumen           (2)
- dikirim_ke_leasing           (3)
- survey_dijadwalkan           (4)
- survey_berjalan              (5)
- menunggu_keputusan_leasing   (6)
- disetujui                    (7a)
- ditolak                      (8a)
- dp_dibayar                   (9)
- selesai                      (10)
```

---

## 📋 FILES TO MODIFY

### 1. **Database Migration** ✏️

- **File**: `database/migrations/2025_11_05_000002_create_complete_credit_details_table.php`
- **Changes Needed**:
    - Update enum values to new 10 statuses
    - Add new columns: surveyor_name, surveyor_phone, survey_scheduled_date, survey_scheduled_time, survey_notes
    - Add: leasing_provider_id (FK to leasing_providers), leasing_application_ref, leasing_decision_date
    - Add: rejection_reason, internal_notes, dp_paid_date, dp_payment_method, dp_confirmed_by
    - Create migration to alter existing table (data migration strategy)

### 2. **Models** 📦

- **CreditDetail.php**: Update fillable array, add relationships (surveyorUser, leasingProvider)
- **SurveySchedule.php**: May need changes if survey info now stored in credit_details
- **Document.php**: Keep as is (document approval tracking separate)

### 3. **Controllers** 🎮

- **MotorGalleryController.php**:
    - `processCreditOrder()`: Initial status = `pengajuan_masuk`
    - `uploadCreditDocuments()`: Still handles doc upload
    - `showDocumentManagement()`: Keep for document display

- **TransactionController.php**:
    - `index()`: Show with new statuses
    - `show()`: Display new fields prettily
    - `update()`: Update credit details with new flow
    - Add notes field display

- **Admin/CreditController.php** (NEW):
    - Dedicated credit management (maybe extract from TransactionController)
    - `verifiyDocuments()`: Move to stage 3 (dikirim_ke_leasing)
    - `scheduleSurvey()`: Configure surveyor, date, time (move to stage 4)
    - `enterSurveyResults()`: Input survey findings, move to stage 6
    - `makeDecision()`: Approve/reject with reason, move to stage 7/8a
    - `confirmDPPayment()`: Mark DP paid, move to stage 9

### 4. **Services** ⚙️

- **TransactionService.php**:
    - Update `handleCreditDetail()` to use new statuses
    - Update `generateInstallments()`: trigger only when reaching `dp_dibayar` status
    - Update notification logic for new stages

- **CreditService.php** (NEW):
    - Centralize credit-specific logic
    - `schedulesurvey()`
    - `enterSurveyResults()`
    - `makeDecision()` (approve/reject)
    - `confirmDPPayment()`

### 5. **Observers** 👁️

- **CreditDetailObserver.php**:
    - Update `syncTransactionStatus()` with new status mapping
    - New mapping logic for new stages
    - Trigger notifications at key stage transitions

### 6. **Views/Components** 🎨

- **Admin Dashboard**:
    - Update status display badges
    - Add new columns to credit list (surveyor, survey date, leasing provider)

- **Admin Transaction Edit** (`ShowConsolidated.jsx`):
    - Add new tabs or sections:
        - Tab 1: Order Info (unchanged)
        - Tab 2: Document Verification (choose: reupload or approve)
        - Tab 3: Leasing Details (select provider, input ref)
        - Tab 4: Survey Info (schedule, surveyor, results)
        - Tab 5: Decision (approve/reject with reason)
        - Tab 6: DP Payment (confirm payment)

- **Customer Views** (`TransactionDetail.jsx`):
    - Update status labels to new flow
    - Show current stage clearly
    - Show next required action

### 7. **Documentation** 📚

- Update `BUSINESS_LOGIC.md` with new flow
- Update `FLOW_IMPLEMENTATION_PLAN.md`
- Create status transition matrix

---

## 🔄 DATA MIGRATION STRATEGY

### Phase 1: Database Schema

```bash
php artisan make:migration update_credit_details_table
# Update enum, add columns, backfill existing records
```

### Phase 2: Existing Data Mapping

```php
// Map old statuses to new stages (placeholder strategy)
Old Status → New Status

menunggu_persetujuan    → verifikasi_dokumen (stage 2)
data_tidak_valid        → verifikasi_dokumen (stage 2)
dikirim_ke_surveyor     → dikirim_ke_leasing (stage 3)
jadwal_survey           → survey_dijadwalkan (stage 4)
disetujui               → disetujui (stage 7a)
ditolak                 → ditolak (stage 8a)
```

### Phase 3: Code Refactor

- Update models first
- Update services
- Update controllers
- Update views
- Test each stage

---

## 🧪 TESTING STRATEGY

### Unit Tests

- [ ] CreditService::schedulesurvey()
- [ ] CreditService::enterSurveyResults()
- [ ] CreditService::makeDecision()
- [ ] CreditService::confirmDPPayment()

### Feature Tests

- [ ] Full credit application flow (1→2→3→4→5→6→7a→9→10)
- [ ] Rejection flow (1→2→3→4→5→6→8a)
- [ ] Document reupload flow

### Integration Tests

- [ ] Admin dashboard shows correct statuses
- [ ] Customer sees correct next actions
- [ ] Notifications sent at right stages

---

## 📈 BENEFITS OF NEW FLOW

✅ **Simpler**: 8 clear stages vs 6 confusing ones
✅ **Clearer**: Each stage has single responsibility
✅ **Trackable**: Better audit trail of progress
✅ **User-friendly**: Customers understand where they are
✅ **Admin-friendly**: Clear actions at each stage
✅ **Flexible**: Easy to customize (change surveyor, reschedule, etc)
✅ **Data-rich**: More information captured (leasing ref, survey notes, etc)

---

## ⏲️ TIMELINE ESTIMATE

- **Analysis**: ✅ Done (this doc)
- **Schema Design**: 2-3 hours
- **DB Migration**: 1 hour
- **Code Refactor**: 6-8 hours
- **Testing**: 2-3 hours
- **Documentation**: 1 hour

**Total**: ~12-16 hours of development

---

## ⚠️ RISKS & MITIGATION

| Risk                         | Mitigation                       |
| ---------------------------- | -------------------------------- |
| Data loss during migration   | Backup DB before migration       |
| Existing orders broken       | Map old statuses safely          |
| Admin confusion              | Training on new flow             |
| Customer notifications wrong | Test notifications at each stage |
| Multiple concurrent edits    | Add optimistic locking           |

---

## 🎯 NEXT STEPS

1. ✅ Review this plan with team
2. ⏳ Create new migration file
3. ⏳ Refactor models & relationships
4. ⏳ Refactor TransactionService → split into CreditService
5. ⏳ Update controllers with new flow logic
6. ⏳ Update observers & event listeners
7. ⏳ Create new admin pages for each stage
8. ⏳ Update customer-facing views
9. ⏳ Write & run tests
10. ⏳ Database migration on production
