# 🔄 Credit Approval Workflow - SRB Motor

**Domain**: Credit Financing & Approval Process  
**Last Updated**: March 12, 2026  
**Status**: 🟢 Current & Active

---

## 📊 Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  CREDIT APPROVAL WORKFLOW                       │
└─────────────────────────────────────────────────────────────────┘

  Stage 1              Stage 2               Stage 3              Stage 4
  ┌────────────┐  ┌───────────────┐  ┌──────────────────┐  ┌────────────┐
  │  Pengajuan │  │ Verifikasi    │  │ Kirim ke Leasing │  │  Survey &  │
  │  Masuk     │→ │ Dokumen       │→ │ & Jadwal Survey  │→ │ Keputusan  │
  └────────────┘  └───────────────┘  └──────────────────┘  └────────────┘
         ↓              ↓                      ↓                   ↓
      [1]          [2]              [3]                       [4]

  Stage 5              Stage 6              Stage 7              Stage 8
  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  ┌───────────┐
  │ Menunggu   │  │ Disetujui  │  │ DP Dibayar       │  │  Selesai  │
  │ Keputusan  │→ │ (Approval) │→ │ (Down Payment)   │→ │ (Done)    │
  │ Leasing    │  │            │  │                  │  │           │
  └────────────┘  └────────────┘  └──────────────────┘  └───────────┘
         ↓              ↓                      ↓                  ↓
      [5]          [6]              [7]                     [8]
```

---

## 🔑 Status Details

### Stage 1: `pengajuan_masuk` (Application Received)

**What Happens**

- User fills credit application form
- Selects leasing provider (optional, can be set by admin later)
- Application is created with initial documents
- User is redirected to upload required documents
- Status stays at this stage until admin takes action

**Available Actions** (Admin Aksi Tersedia)

- ✅ `verifikasi_dokumen` - Verify & approve documents
- ❌ `ditolak` - Reject entire application

**Key Data**

- Application reference number
- Customer info (name, phone, NIK, income)
- Motor selection & price
- Down payment amount
- Tenor (loan period)
- Leasing provider (if selected by user)

**Transition Requirements**

- ❌ Cannot transition until all documents are either approved or rejected
- ✅ At least 1 document must be uploaded

---

### Stage 2: `verifikasi_dokumen` (Document Verification)

**What Happens**

- All documents have been reviewed individually
- Admin has approved/rejected each document
- System shows confirmation that docs are verified
- Ready to send to leasing partner

**Available Actions**

- ✅ `dikirim_ke_leasing` - Send to leasing partner
- ❌ `ditolak` - Reject documents (back to stage 1)

**Document Approval Sub-Process**
Before reaching stage 2, all documents must be in one of these states:

- `approved` - Admin clicked approve, document accepted
- `rejected` - Admin clicked reject, provided rejection reason

**Key Data**

- Document verification notes (admin notes)
- Individual document approval status
- Rejection reasons (if any rejected)

**Validation Rules**

```php
// All documents must be approved or rejected
$pending = credit.documents()->where('approval_status', 'pending')->count();
if ($pending > 0) {
    throw new Exception('All documents must be processed');
}
```

---

### Stage 3: `dikirim_ke_leasing` (Sent to Leasing Partner)

**What Happens**

- Application sent to leasing provider
- Leasing provider receives and processes application
- Admin can schedule survey for the property/customer
- Waiting for leasing to schedule their survey

**Available Actions**

- ✅ `survey_dijadwalkan` - Schedule survey with surveyor details
- (No rejection possible here, must go back via admin action)

**Key Data**

- Leasing provider selected (confirmed at this stage)
- Application reference from leasing
- Survey scheduled date & time
- Surveyor name & phone number
- Survey location (customer address)

**User View**

- Sees status as "Dikirim ke Leasing"
- Receives notification about leasing partner
- Waits for survey scheduling communication

---

### Stage 4: `survey_dijadwalkan` (Survey Scheduled)

**What Happens**

- Survey appointment is confirmed
- Date, time, and surveyor info provided to customer
- Surveyor will visit customer to assess property/collateral
- Customer must be available for survey

**Available Actions**

- ✅ `menunggu_keputusan_leasing` - Mark survey as complete, awaiting leasing decision
- (Cannot skip survey, must mark as done)

**Key Data**

- Survey scheduled date & time
- Surveyor name & contact
- Location for survey
- Survey notes (after completion)
- Survey report (if any)

**Customer Notification**

- Receives WhatsApp/email with survey details
- Can contact surveyor if issue
- Confirmation of attendance

---

### Stage 5: `menunggu_keputusan_leasing` (Waiting for Leasing Decision)

**What Happens**

- Survey has been completed
- Waiting for leasing provider to make approval/rejection decision
- Leasing reviews survey report and applicant data
- Decision pending from leasing partner

**Available Actions**

- ✅ `disetujui` - Approve credit (leasing approved)
- ❌ `ditolak` - Reject credit (leasing rejected)

**Duration**

- Typically 3-7 business days
- Depends on leasing provider's process

**Customer View**

- Status shows "Menunggu Keputusan Leasing"
- Cannot take action, must wait for leasing
- Can check status timeline

---

### Stage 6: `disetujui` (Credit Approved)

**What Happens**

- Leasing provider approved the credit
- Approval amount confirmed
- Credit terms finalized
- Awaiting down payment from customer

**Available Actions**

- ✅ `dp_dibayar` - Record down payment received
- (Customer must pay DP to proceed)

**Key Data**

- Approved credit amount
- Approved tenor
- Interest rate (if any)
- Monthly installment amount
- Approval date from leasing
- Approval reference from leasing

**Customer Notification**

- "Selamat! Kredit Anda disetujui"
- Payment instructions for DP
- Invoice for down payment
- Control number for payment

---

### Stage 7: `dp_dibayar` (Down Payment Paid)

**What Happens**

- Customer has paid down payment
- Payment verified by admin
- All requirements met for vehicle delivery
- Ready for final step

**Available Actions**

- ✅ `selesai` - Mark transaction as complete, ready for delivery

**Key Data**

- DP payment amount received
- Payment date
- Payment method
- Payment reference/proof
- Remaining financing balance

**Customer View**

- "DP Anda telah diterima"
- Can proceed to vehicle pickup
- Motor delivery scheduled

---

### Stage 8: `selesai` (Completed)

**What Happens**

- Transaction fully completed
- Customer owns the motor (with lien in leasing favor)
- Financing is active
- Customer starts monthly installments

**Available Actions**

- None (end of workflow)

**Key Data**

- Completion date
- Vehicle delivery confirmation
- Financing agreement signed
- First installment due date

**End State**

- Transaction moves to completed/archive
- Installment payments begin
- Vehicle is operational

---

## 🎬 User Journey by Type

### Customer Journey

```
1. Browse motors → 2. Fill credit form (select leasing)
  → 3. Upload documents → 4. Wait for admin verification
  → 5. Notified: dikirim ke leasing
  → 6. Survey scheduled notification
  → 7. Complete survey
  → 8. Wait for leasing decision
  → 9. Notification: Credit approved!
  → 10. Pay down payment
  → 11. Pickup motor
  → Status: Selesai ✓
```

### Admin Journey

```
1. See new applications (pengajuan_masuk)
  → 2. Review documents indiv (approve/reject each)
  → 3. Click "Verify Documents" (stage 2)
  → 4. Select leasing, click "Send to Leasing" (stage 3)
  → 5. Schedule survey details (stage 4)
  → 6. Mark survey complete (stage 5)
  → 7. Get leasing decision (approve/reject) (stage 6)
  → 8. Record DP payment (stage 7)
  → 9. Mark complete (stage 8)
```

---

## 📋 Document Approval Sub-Workflow (Critical!)

This happens WITHIN stage 1, not a separate stage.

### Flow

```
Stage: pengajuan_masuk

User uploads documents [KTP, KK, Slip Gaji]
         ↓
Documents created with approval_status = "pending"
         ↓
Admin sees Documents table in credit detail
         ↓
Admin clicks APPROVE or REJECT on each document
         ↓
If REJECT: Shows modal for rejection reason
         ↓
Document updated: approval_status = "approved/rejected"
         ↓
Check: Are ALL documents approved/rejected?
    ├─ NO pending documents? → Show "Verify Documents" button
    └─ YES pending? → Disable "Verify Documents", show warning
         ↓
Admin clicks "Verify Documents" button
         ↓
Status: pengajuan_masuk → verifikasi_dokumen (Stage 2)
```

### Key Rules

- ❌ Cannot auto-transition on document approval (must click "Verify Documents")
- ✅ Must show warning if any documents pending
- ✅ Status badge updates: "3 Disetujui • 0 Ditolak • 2 Menunggu"
- ✅ User sees document status in their transaction detail page

### Database State

```php
// Documents table
id | credit_detail_id | document_type | approval_status | rejection_reason | created_at | updated_at
1  | 4                | KTP          | approved        | null             | ...        | ...
2  | 4                | KK           | approved        | null             | ...        | ...
3  | 4                | Slip Gaji    | rejected        | "Expired"        | ...        | ...

// Credit details table
id | status              | ...
4  | pengajuan_masuk    | ...
```

---

## 🔄 Transitions Map

**Source of Truth**: `CreditService::getAvailableTransitions()`

All valid transitions:

```php
'pengajuan_masuk' => [
    'verifikasi_dokumen' => 'Verify Documents',
    'ditolak' => 'Reject Application',
],
'verifikasi_dokumen' => [
    'dikirim_ke_leasing' => 'Send to Leasing',
    'ditolak' => 'Reject Documents',
],
'dikirim_ke_leasing' => [
    'survey_dijadwalkan' => 'Schedule Survey',
],
'survey_dijadwalkan' => [
    'menunggu_keputusan_leasing' => 'Complete Survey',
],
'menunggu_keputusan_leasing' => [
    'disetujui' => 'Approve Credit',
    'ditolak' => 'Reject Credit',
],
'disetujui' => [
    'dp_dibayar' => 'Record DP Payment',
],
'dp_dibayar' => [
    'selesai' => 'Complete Credit',
],
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Verify Documents" button missing

**Cause**: Some documents still in `approval_status = "pending"`  
**Solution**: Admin must approve/reject each document first  
**User Message**: "⚠️ Semua dokumen harus disetujui atau ditolak sebelum melanjutkan verifikasi"

### Issue 2: Document status not updating in user view

**Cause**: UI showing cache, needs page reload  
**Solution**: Always reload page after approve/reject  
**Implementation**: `window.location.reload()` in onSuccess

### Issue 3: User sees old/expired document status

**Cause**: Document was rejected, user hasn't re-uploaded  
**Solution**: User must re-upload rejected documents  
**User Message**: "Dokumen Anda ditolak karena: [reason]. Silakan upload ulang."

### Issue 4: Cannot progress past survey scheduling

**Cause**: Missing surveyor details when schedule survey  
**Solution**: All fields (date, time, surveyor name, phone) required  
**Validation**: Form validation + server-side check

### Issue 5: DP payment showing as pending forever

**Cause**: Admin didn't click "Record DP Payment" (stage 7)  
**Solution**: Admin must confirm payment received from customer  
**Process**: Customer pays → Admin records → Status → selesai

---

## 🗂️ Related Code Files

**Models**

- `CreditDetail` - Main credit model
- `Document` - Uploaded documents
- `Transaction` - Customer order

**Controllers**

- `Admin/CreditController` - Manage workflow
    - `show()` - Display credit detail
    - `verifyDocuments()` - Stage 1 → 2
    - `sendToLeasing()` - Stage 2 → 3
    - `scheduleSurvey()` - Stage 3 → 4
    - `completeSurvey()` - Stage 4 → 5
    - `approveCredit()` - Stage 5 → 6
    - `rejectCredit()` - Stage 5 rejection
    - `recordDPPayment()` - Stage 6 → 7
    - `completeCredit()` - Stage 7 → 8

**Services**

- `CreditService::getAvailableTransitions()` - Get allowed next actions
- `CreditService::verifyDocuments()` - Approve documents
- `CreditService::sendToLeasing()` - Send to leasing partner
- etc.

**Frontend Components**

- `Admin/Credits/Show.jsx` - Main detail page
    - Document Status Alert
    - Documents Table with approve/reject buttons
    - Aksi Tersedia panel
    - Modals for each action

---

## 📝 Notes for Developers

1. **Status is immutable once set** - Only transition through defined paths
2. **Documents must be processed individually** - Cannot batch approve/reject
3. **Admin can override user choices** - e.g., change leasing provider
4. **Timeline is auto-created** - Each transition creates timeline entry
5. **Notifications are sent** - WhatsApp to customer at key stages
6. **No skipping stages** - Must follow workflow sequence strictly
7. **Workflow is role-based** - Only admin can transition, customer waits
8. **All data validated** - Reject if missing required fields for transition

---

## 🎯 Testing Checklist

When testing workflow:

- [ ] Document approval workflow (all docs must be done before verify)
- [ ] Auto-fill leasing if user selected, allow override
- [ ] Show "Verify Documents" button only when 0 pending docs
- [ ] Cannot transition without meeting prerequisites
- [ ] Timeline created for each transition
- [ ] User notifications sent at key stages
- [ ] Available transitions update dynamically
- [ ] Modal forms validate required fields
- [ ] Page reload shows updated status
- [ ] Edge case: Reject at stage 5 goes back properly

---

**Last Reviewed**: March 12, 2026  
**Maintained By**: Development Team  
**Version**: 1.0 - Current Active Workflow  
**Status**: 🟢 Production-Ready
