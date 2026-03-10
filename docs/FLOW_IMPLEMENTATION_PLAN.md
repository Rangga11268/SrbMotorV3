# 🔄 END-TO-END FLOW & IMPLEMENTATION PLAN

**Last Updated**: March 11, 2026  
**Status**: Phase 3 Implementation - Complete Survey Integration

---

## 📊 CURRENT STATUS

| Feature                                 | Status             | Last Updated |
| --------------------------------------- | ------------------ | ------------ |
| ✅ Berita FE (Index + Show)             | READY              | Phase 3.1    |
| ✅ Admin Survey Modal Component         | READY              | Phase 2.2    |
| ✅ Customer Survey Card Display         | READY              | Phase 3.2    |
| 🔧 Admin Survey Integration (Edit page) | **JUST COMPLETED** | Now          |
| ⏳ Customer Survey Confirmation         | PENDING            | Next         |
| ⏳ Notification System                  | PENDING            | Next         |

---

## 🎯 COMPLETE USER → ADMIN → PAYMENT FLOW

### **FLOW 1: CUSTOMER ORDERS MOTOR (CASH)**

```
Step 1: Customer Browses
├─ Route: GET /motors
├─ Show: List of motors with images, specs, price
└─ Action: Click motor to see detail

Step 2: View Motor Detail
├─ Route: GET /motors/{id}
├─ Show: Full specifications, features, price
└─ Action: Click "Pesan Tunai" button

Step 3: Fill Cash Order Form
├─ Route: GET /motors/{motor}/cash-order
├─ Form Fields:
│  ├─ Nama Pelanggan (required)
│  ├─ No. WhatsApp (required, 10-12 digits)
│  ├─ Pekerjaan (required)
│  ├─ Booking Fee (optional, < harga motor)
│  ├─ Metode Pembayaran (bank transfer, cash, etc)
│  └─ Catatan (optional)
└─ Validation: Done via StoreTransactionRequest

Step 4: Submit Order
├─ Route: POST /motors/{motor}/order-cash
├─ Controller: MotorGalleryController@processCashOrder()
├─ Action:
│  ├─ Create Transaction record (status: 'new_order')
│  ├─ Create Installments (DP + remaining if booking fee exists)
│  ├─ Trigger Observer → Send WA to customer + admin
│  └─ Redirect to confirmation page
└─ Result: Order created successfully

Step 5: See Confirmation
├─ Route: GET /motors/order-confirmation/{transaction_id}
├─ Show:
│  ├─ Order ID
│  ├─ Motor details
│  ├─ Total amount + booking fee
│  ├─ Due dates for installment
│  └─ "Bayar Sekarang" button
└─ Action: Click to pay OR close

Step 6: Customer Pays (Optional now, can pay later from /installments)
├─ Route: GET /installments
├─ Show: List of customer's pending installments
├─ Action: Click "Bayar Online" for any installment
├─ Modal: Midtrans Snap payment gateway opens
├─ Payment: Customer chooses payment method and pay
└─ Result: Webhook updates status to 'paid'

🎉 CONCLUSION: Cash order complete - Ready for unit preparation
```

---

### **FLOW 2: CUSTOMER ORDERS MOTOR (CREDIT)**

```
Step 1-2: Same as Cash (Browse & View detail)

Step 3: Fill Credit Order Form
├─ Route: GET /motors/{motor}/credit-order
├─ Form Fields:
│  ├─ Nama Pelanggan (required)
│  ├─ No. WhatsApp (required)
│  ├─ Pekerjaan (required)
│  ├─ Tenor (1-36 bulan, default 12)
│  ├─ Down Payment (required, < harga)
│  └─ Catatan (optional)
├─ Calculation:
│  └─ Monthly Installment = (Motor Price - DP) / Tenor
└─ Validation: Done via StoreCreditOrderRequest

Step 4: Submit Credit Order
├─ Route: POST /motors/{motor}/order-credit
├─ Controller: MotorGalleryController@processCreditOrder()
├─ Action:
│  ├─ Create Transaction (status: 'new_order')
│  ├─ Create CreditDetail (credit_status: 'menunggu_persetujuan')
│  ├─ Trigger Observer → Send WA to both
│  └─ Redirect to next step
└─ Result: Waiting for document upload

Step 5: Upload Required Documents
├─ Route: GET /motors/{transaction}/upload-credit-documents
├─ Required Docs:
│  ├─ KTP (Kartu Tanda Penduduk) - Identity card
│  ├─ KK (Kartu Keluarga) - Family card
│  └─ SLIP_GAJI (Bukti gaji/penghasilan) - Income proof
├─ Validation:
│  ├─ File type: PDF, JPG, PNG
│  ├─ Max size: 2MB per file
│  └─ All 3 must be uploaded
├─ Storage: /storage/documents/
└─ Action: Upload files → Click "Kirim untuk Verifikasi"

Step 6: Admin Reviews Documents
├─ Route: GET /admin/transactions (Dashboard)
├─ Show: List of pending credit orders
├─ Action: Click transaction to open detail page

Step 7: Admin Can Choose Path A or B
│
├──► PATH A: DOCUMENTS VALID
│    │
│    ├─ Action: Transition credit_status → 'dikirim_ke_surveyor'
│    ├─ Result: Credit marked ready for survey
│    └─ Next: Go to Step 8A (Schedule Survey)
│
└──► PATH B: DOCUMENTS INVALID
     │
     ├─ Action: Transition credit_status → 'data_tidak_valid'
     ├─ Send notification to customer (ask for reupload)
     └─ Next: Customer reuploads documents

🎯 CURRENT PROJECT POINT: Admin can now schedule survey! ← NEW

Step 8A: ADMIN SCHEDULES SURVEY (NEW FEATURE - JUST ADDED)
├─ Route: Edit page is /admin/transactions/{id}/edit
├─ NEW Tab: "Jadwal Survey" (visible only for CREDIT type)
├─ Current Status:
│  ├─ If no survey: Shows "Belum ada jadwal survey" + button
│  └─ If survey exists: Shows SurveyScheduleCard with details
├─ Action: Click "Jadwalkan Survey" button
├─ Modal Opens: SurveyScheduleModal.jsx
├─ Form Fields:
│  ├─ Tanggal Survey (date picker, no past dates)
│  ├─ Jam Survey (time picker HH:MM)
│  ├─ Lokasi (textarea, min 5 chars)
│  ├─ Nama Surveyor (text, min 3 chars)
│  ├─ No. WhatsApp Surveyor (10-12 digits)
│  ├─ Catatan Survey (RichTextEditor for details)
│  └─ Submit button
├─ Backend:
│  ├─ Route: POST /credit-details/{creditDetail}/schedule-survey
│  ├─ Handler: MotorGalleryController@scheduleSurvey()
│  ├─ Action:
│  │  ├─ Validate input
│  │  ├─ Create/Update SurveySchedule record
│  │  ├─ Update CreditDetail status → 'jadwal_survey'
│  │  ├─ Send WA notification to surveyor
│  │  └─ Send WA notification to customer
│  └─ Response: Returns updated transaction with survey data
└─ Result: Survey scheduled successfully

Step 8B: CUSTOMER SEES SURVEY SCHEDULE
├─ Route: GET /motors/transactions/{transaction_id}
├─ (TransactionDetail page - Phase 3.2 done)
├─ Show: SurveyScheduleCard with:
│  ├─ Survey date, time, location
│  ├─ Surveyor name + WhatsApp link
│  ├─ Survey notes
│  └─ Status badge (pending/confirmed/completed/cancelled)
├─ Customer can confirm attendance OR request reschedule
└─ Action: (Will be implemented in Phase 3.3)

Step 9: SURVEYOR DOES INSPECTION (Manual Process for Now)
├─ Surveyor visits location on scheduled date
├─ Checks:
│  ├─ Income verification
│  ├─ Residence verification
│  ├─ Motor condition & location
│  └─ General creditworthiness
└─ Reports findings to admin

Step 10: ADMIN REVIEWS SURVEY RESULT
├─ Route: Back to /admin/transactions/{id}/edit
├─ Tab: "Proses Kredit"
├─ Status Options:
│  ├─ Change to 'disetujui' (Approved) ✅
│  ├─ Change to 'ditolak' (Rejected) ❌
│  └─ Change to other statuses
├─ Action: Select status and click "Simpan Semua Perubahan"
└─ Next: Go to Step 11A or 11B (Approval or Rejection)

Step 11A: IF APPROVED
├─ Credit Status: 'disetujui'
├─ Backend Action (Observer triggers):
│  ├─ Call TransactionService::generateInstallments()
│  ├─ Create Installment #0 (DP, due today)
│  ├─ Create Installment #1..N (monthly, due +1mo..+Nmo)
│  ├─ Send approval email to customer
│  ├─ Send approval WA to customer
│  └─ Message: "Kredit Anda disetujui! Cicilan bulanan Rp X mulai [date]"
└─ Next: Step 12 (Customer pays installments)

Step 11B: IF REJECTED
├─ Credit Status: 'ditolak'
├─ Backend Action (Observer triggers):
│  ├─ Send rejection email to customer
│  ├─ Send rejection WA to customer
│  ├─ Optional: Attach rejection reason in notes
│  └─ Message: "Permohonan kredit Anda telah ditolak. Hubungi kami untuk informasi lebih lanjut."
└─ Next: Customer can reapply with better documents

Step 12: CUSTOMER PAYS INSTALLMENTS
├─ Route: GET /installments
├─ Current Implementation: ✅ READY (done in previous session)
├─ Show:
│  ├─ List of all pending installments
│  ├─ Due dates with reminder badges
│  │  ├─ Red: Terlambat/Hari ini/1-7 hari lagi
│  │  ├─ Blue: 8-30 hari lagi
│  │  └─ Green: 30+ hari lagi
│  ├─ Amount per installment + penalties
│  └─ Payment status (pending/paid/verifying)
├─ Select: Check multiple installments for batch pay
├─ Action: Click "Bayar Online" or "Transfer"
├─ Modal: Midtrans Snap opens for payment
├─ Payment: Customer chooses method and pay
├─ Webhook: Updates installment status → 'paid'
└─ Confirmation: Email + WA sent to customer

Step 13: ALL INSTALLMENTS PAID
├─ Backend Check: All installments.status = 'paid'
├─ Auto Action:
│  ├─ Update transaction status → 'payment_confirmed'
│  ├─ Send celebration email/WA to customer
│  └─ Transaction ready for completion
└─ Result: Credit payment cycle complete

🎉 CONCLUSION: Credit order complete and paid - Ready for delivery
```

---

## 🔐 ADMIN TRANSACTION EDIT PAGE CLARITY

**Location**: `/admin/transactions/{id}/edit`  
**Controller**: `TransactionController@edit`  
**View**: `resources/js/Pages/Admin/Transactions/EditCombined.jsx`

### **5 TABS AVAILABLE:**

#### **Tab 1: Info Umum (Always Visible)**

**Editable:**

- 👤 Pelanggan (Customer) - Dropdown select
- 🏍️ Unit Motor - Dropdown select with price display
- 📍 Alamat Lengkap - Full text area
- 💵 / 💳 Metode Transaksi - Radio buttons (CASH or CREDIT)

**Purpose**: Update basic transaction information

---

#### **Tab 2: Proses Kredit (Only for CREDIT type)**

**Editable:**

- 🔴 Status Kredit (Credit Status):
    ```
    Options:
    - menunggu_persetujuan  → Initial state (waiting document review)
    - data_tidak_valid      → Docs incomplete, ask customer to reupload
    - dikirim_ke_surveyor   → Docs OK, ready for survey scheduling
    - jadwal_survey         → Survey scheduled with date/time
    - disetujui            → APPROVED ✅ (auto-generates installments)
    - ditolak              → REJECTED ❌ (customer can reapply)
    ```
- Tenor (Bulan) - Number of months (12, 24, 36, 48)
- Uang Muka (DP) - Down payment amount
- Angsuran Per Bulan - Monthly installment amount
- Total Disetujui - Total approved amount

**Purpose**: Manage credit application progress and financial details

**When to use**:

1. Set status based on document review
2. Adjust tenor/installment if needed
3. Review/confirm financial calculations
4. Transition to next stage

---

#### **Tab 3: Jadwal Survey (NEW - Only for CREDIT type)**

**Features:**

- View existing survey schedule (if any)
- "Jadwalkan Survey" button opens modal
- Modal form asks for:
    ```
    - Tanggal (Date of survey)
    - Jam (Time of survey)
    - Lokasi (Location to visit)
    - Nama Surveyor (Inspector's name)
    - No. WhatsApp Surveyor (For contact)
    - Catatan (Detailed survey instructions/notes)
    ```
- After submit: Updates survey_schedule record + sends WA to surveyor & customer

**When to use**:

- After document review is done (credit_status = 'dikirim_ke_surveyor')
- Before approving the credit
- To reschedule if surveyor reports conflict

---

#### **Tab 4: Dokumen & Catatan (Always Visible)**

**Editable:**

- Catatan Transaksi (Notes field for surveyor/rejection notes/instructions)
- Info: Document management done in Transaction DETAIL page (not edit)

**Purpose**: Store important notes for admin/surveyor reference

---

### **FIELD DESCRIPTIONS & USAGE**

| Field                  | Type         | Purpose                                         | When Used                                     |
| ---------------------- | ------------ | ----------------------------------------------- | --------------------------------------------- |
| **Pelanggan**          | Dropdown     | Select which customer this order belongs to     | Error handling, customer reassignment         |
| **Unit Motor**         | Dropdown     | Change motor (if customer wants different unit) | Order modification before completion          |
| **Alamat Lengkap**     | Text Area    | Delivery address for unit                       | Verify/correct before delivery                |
| **Metode Transaksi**   | Radio        | Lock transaction type (CASH or CREDIT)          | Usually set at order, don't change            |
| **Status Kredit**      | Dropdown     | Progress tracker for credit applications        | Main workflow control                         |
| **Tenor**              | Select       | Adjust loan duration (affects monthly payment)  | Can adjust if customer requests               |
| **Uang Muka**          | Input        | Down payment amount                             | Can adjust if customer negotiates             |
| **Angsuran Per Bulan** | Input        | Monthly payment obligation                      | Calculates automatically, can adjust          |
| **Total Disetujui**    | Input        | Max approved loan amount                        | Set based on vehicle price & creditworthiness |
| **Jadwal Survey**      | Card + Modal | Schedule location inspection                    | When document review is done                  |
| **Catatan**            | Text Area    | Free-form notes for team                        | Any admin notes/instructions                  |

---

## ✅ INTEGRATION CHECKLIST (WHAT'S DONE)

### **Phase 3.1: Berita Frontend**

- ✅ Routes configured: `/berita`, `/berita/{slug}`
- ✅ NewsController created with index() and show() methods
- ✅ Index.jsx with search, filter, pagination
- ✅ Show.jsx with full article, related posts, sharing
- ✅ Build successful, deployed

### **Phase 3.2: Customer Transaction Detail**

- ✅ TransactionDetail.jsx page created
- ✅ Shows motor details, credit details, installment list
- ✅ Displays survey schedule if exists
- ✅ Authorization check (customer can only see own transactions)
- ✅ Build successful, deployed

### **Phase 2.2: Survey Components (STANDALONE)**

- ✅ SurveyScheduleModal.jsx - Modal for scheduling
- ✅ SurveyScheduleCard.jsx - Card for displaying schedule
- ✅ Backend routes exist: POST /credit-details/{id}/schedule-survey
- ✅ Backend handler exists: MotorGalleryController@scheduleSurvey
- ✅ Database table: survey_schedules with all columns

### **Phase 3.3: ADMIN SURVEY INTEGRATION (JUST COMPLETED NOW)**

- ✅ EditCombined.jsx updated with:
    - ✅ SurveyScheduleModal imported
    - ✅ New "Jadwal Survey" tab (Tab 4 for CREDIT only)
    - ✅ Survey schedule display or "not yet scheduled" message
    - ✅ "Jadwalkan Survey" button opens modal
    - ✅ Modal can create or reschedule survey
- ✅ Build successful
- ✅ Deployed

---

## ⏳ NEXT STEPS (NOT DONE YET)

### **Phase 3.4: Customer Survey Confirmation**

**Goal**: Let customer confirm attendance or reschedule survey

**Work Required**:

1. Update TransactionDetail.jsx to show confirmation UI
2. Add buttons: "Saya Bisa Hadir" / "Minta Reschedule"
3. Create endpoint: POST /survey-schedules/{id}/confirm
4. Create endpoint: POST /survey-schedules/{id}/reschedule-request
5. Handle notifications: WA/Email to admin when customer responds
6. Update survey_schedules table if needed (add customer_confirmation field)

---

### **Phase 3.5: Notification System**

**Goal**: Ensure all actors get notified at right time

**Missing Notifications**:

1. ✅ Order created → WA to customer + admin (DONE in TransactionObserver)
2. ✅ Document upload reminder → Manual admin follow-up (DONE via notes)
3. ⏳ Survey scheduled → WA to surveyor + customer (READY but needs test)
4. ⏳ Customer confirms survey → WA to surveyor + admin
5. ⏳ Survey completed → WA to admin (manual input)
6. ⏳ Credit approved → Email + WA to customer (READY via CreditStatusUpdated observer)
7. ⏳ Installment reminder → Scheduled job (implement using Laravel scheduler)
8. ⏳ Payment received → WA + Email to customer (READY via webhook)

---

## 🎯 TESTING CHECKLIST

### **Before Going Live**

- [ ] **Berita Page**
    - [ ] Access /berita and see published articles
    - [ ] Click article and see full content
    - [ ] Search functionality works
    - [ ] Category filter works
    - [ ] Share buttons work

- [ ] **Admin Edit Page**
    - [ ] Open /admin/transactions/{id}/edit for CREDIT order
    - [ ] See all 4 tabs (Info, Proses Kredit, Jadwal Survey, Catatan)
    - [ ] Can edit fields and save
    - [ ] Click "Jadwalkan Survey" button
    - [ ] Modal opens with form
    - [ ] Submit form and survey appears in card
    - [ ] Edit fields in modal and resave
    - [ ] Modal closes properly

- [ ] **Customer Verification**
    - [ ] Customer can see survey schedule in /motors/transactions/{id}
    - [ ] Survey details show correctly (date, time, location, surveyor)
    - [ ] Customer can click surveyor's WhatsApp link

- [ ] **End-to-End Flow**
    - [ ]   1. Customer order (credit)
    - [ ]   2. Customer uploads documents
    - [ ]   3. Admin reviews documents
    - [ ]   4. Admin schedules survey (NEW TEST)
    - [ ]   5. Customer sees survey scheduled
    - [ ]   6. Admin marks survey complete
    - [ ]   7. Admin approves credit
    - [ ]   8. Customer pays installments
    - [ ]   9. Order marked completed

---

## 📞 SUPPORT INFO

**Questions about specific endpoints?**

- See `routes/web.php` for all defined routes
- See `ARCHITECTURE.md` for system design
- See `BUSINESS_LOGIC.md` for flow details

**Need to modify something?**

- Edit files: Controllers in `app/Http/Controllers/`
- Edit forms: React components in `resources/js/Pages/`
- Edit styling: Use existing Tailwind/CoreUI classes

**Build after changes?**

```bash
npm run build  # Production build
# OR
npm run dev   # Development with hot reload
```
