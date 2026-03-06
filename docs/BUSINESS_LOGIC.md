# BUSINESS LOGIC & FLOW - SRB MOTORS

## 📋 Overview Alur Bisnis

SRB Motors memiliki 2 model transaksi utama:

1. **CASH Transaction** (Tunai) - Pembayaran langsung
2. **CREDIT Transaction** (Cicilan) - Pembayaran terjadwal dengan verifikasi

---

## 💰 CASH TRANSACTION FLOW

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: CUSTOMER BROWSE MOTORS                          │
│                                                         │
│ - Kunjungi halaman katalog: /motors                    │
│ - Filter berdasarkan: brand, type, year, price        │
│ - Lihat detail motor: /motors/{id}                    │
│ - Optional: Compare beberapa motor                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: KLIK PESAN TUNAI                                │
│                                                         │
│ - Form: /motors/{motor}/cash-order                     │
│ - Fields:                                               │
│   - customer_name (required)                           │
│   - customer_phone (required, regex format)            │
│   - customer_occupation (required)                     │
│   - booking_fee (optional, numeric)                    │
│   - payment_method (required)                          │
│   - notes (optional)                                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: VALIDATION                                      │
│                                                         │
│ - Validate input via Requests/StoreTransactionRequest  │
│ - Check: booking_fee < total_amount                    │
│ - Return error jika invalid                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: CREATE TRANSACTION                              │
│                                                         │
│ Location: MotorGalleryController::processCashOrder()   │
│                                                         │
│ Data diproduksi:                                        │
│   - user_id: Auth::id()                                │
│   - motor_id: dari parameter                           │
│   - transaction_type: 'CASH'                           │
│   - status: 'new_order'                                │
│   - booking_fee: dari form (nullable)                  │
│   - total_amount: motor.price                          │
│   - customer_name, phone, occupation                   │
│   - payment_status: 'pending'                          │
│                                                         │
│ Result: Transaction created dengan status 'new_order'  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 5: CREATE INSTALLMENTS                             │
│                                                         │
│ Logic: MotorGalleryController::processCashOrder()      │
│                                                         │
│ Case 1: Ada Booking Fee                                │
│   - Installment #0 (DP):                               │
│     * amount = booking_fee                             │
│     * due_date = now() + 1 day                         │
│     * status = 'pending'                               │
│                                                         │
│   - Installment #1 (Sisa):                             │
│     * amount = motor.price - booking_fee               │
│     * due_date = now() + 7 days                        │
│     * status = 'pending'                               │
│                                                         │
│ Case 2: No Booking Fee                                 │
│   - Installment #1 (Full):                             │
│     * amount = motor.price                             │
│     * due_date = now() + 7 days                        │
│     * status = 'pending'                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 6: TRIGGER NOTIFICATIONS                           │
│                                                         │
│ Observer: TransactionObserver::created()               │
│                                                         │
│ WhatsApp Messages:                                      │
│   - To Customer:                                        │
│     "Halo [name]...\nTerima kasih! Pesanan motor      │
│      [motor.name] telah kami terima.\n                │
│      Order ID: #{transaction.id}\n...\n- SRB Motor"   │
│                                                         │
│   - To Admin:                                           │
│     "*[ADMIN] Order Tunai Baru*\n\n                   │
│      Pelanggan: [name]\nUnit: [motor]\n              │
│      Telp: [phone]\n\nSegera cek dashboard admin."    │
│                                                         │
│ Method: WhatsAppService::sendMessage() via Fonnte API  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 7: REDIRECT TO CONFIRMATION PAGE                   │
│                                                         │
│ - Redirect to: /motors/order-confirmation/{trans_id}  │
│ - Display: Order ID, Motor info, Payment details      │
│ - Button: Pay Now (via Midtrans), View Invoice        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 8: CUSTOMER PAYS                                   │
│                                                         │
│ - Klik "Bayar Sekarang"                               │
│ - Go to: /installments/{installment_id}/pay-online     │
│ - InstallmentController::createPayment()               │
│   * Set Midtrans config                                │
│   * Create Snap payment                                │
│   * Save snap_token → installment                      │
│   * Return snap_token                                  │
│                                                         │
│ - Frontend trigerkan: Snap.pay(snap_token)            │
│ - Modal Snap terbuka → Customer pilih payment method   │
│ - Payment processed di Midtrans server                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 9: MIDTRANS WEBHOOK CALLBACK                       │
│                                                         │
│ When payment SETTLED:                                   │
│   - POST /api/midtrans/notification                    │
│   - PaymentCallbackController::handle()                │
│   - Verify notification                                │
│   - Update installment:                                │
│     * status = 'paid'                                  │
│     * paid_at = now()                                  │
│     * payment_method = midtrans_[type]                 │
│                                                         │
│ When all installments paid:                             │
│   - Update transaction:                                │
│     * status = 'payment_confirmed'                     │
│   - Trigger notification to customer                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 10: ADMIN PROCESS & COMPLETION                     │
│                                                         │
│ Admin Dashboard (/admin/transactions/{id}):             │
│   1. Review pesanan                                     │
│   2. Update status → 'unit_preparation'               │
│   3. Update status → 'ready_for_delivery'             │
│   4. Update status → 'completed'                      │
│                                                         │
│ Each status change triggers customer notification       │
└─────────────────────────────────────────────────────────┘
```

### Cash Transaction Status Flow

```
┌──────────┐
│new_order │ (Initial state when order created)
└────┬─────┘
     ↓
┌────────────────┐
│waiting_payment │ (Waiting for booking fee payment if applicable)
└────┬───────────┘
     ↓
┌──────────────────────┐
│payment_confirmed     │ (All payments received)
└────┬─────────────────┘
     ↓
┌──────────────────────┐
│unit_preparation      │ (Admin preparing the unit)
└────┬─────────────────┘
     ↓
┌──────────────────────┐
│ready_for_delivery    │ (Unit ready to handover)
└────┬─────────────────┘
     ↓
┌──────────────────────┐
│completed             │ (Final state - transaction done)
└──────────────────────┘
```

**Database Table**: transactions, installments
**Controllers**: MotorGalleryController, InstallmentController
**Services**: TransactionService, WhatsAppService
**Cost**: Nominal (booking fee + remaining payment)

---

## 🏦 CREDIT TRANSACTION FLOW

### Complex Multi-Stage Process

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: CUSTOMER BROWSE & SELECT                        │
│                                                         │
│ - Same as cash: /motors → /motors/{id}                │
│ - Klik "Pesan Cicilan"                                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: FILL CREDIT ORDER FORM                          │
│                                                         │
│ Route: /motors/{motor}/credit-order                    │
│ Form: CreditOrderForm component                        │
│                                                         │
│ Fields:                                                 │
│   - customer_name (required)                           │
│   - customer_phone (required)                          │
│   - customer_occupation (required)                     │
│   - tenor (required, 1-36 months)                      │
│   - down_payment (required, numeric)                   │
│   - payment_method (required)                          │
│   - notes (optional)                                   │
│                                                         │
│ Validation:                                             │
│   - tenor valid range                                  │
│   - DP < motor.price                                   │
│   - DP + monthly installment calculations              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: CREATE TRANSACTION & CREDIT DETAIL              │
│                                                         │
│ Location: MotorGalleryController::processCreditOrder() │
│                                                         │
│ Create Transaction:                                     │
│   - transaction_type: 'CREDIT'                         │
│   - status: 'new_order'                                │
│   - payment_status: 'pending'                          │
│   - customer info from form                            │
│                                                         │
│ Create CreditDetail:                                    │
│   - down_payment: dari form                            │
│   - tenor: dari form                                   │
│   - monthly_installment: hitung (motor.price - DP) / tenor
│   - credit_status: 'menunggu_persetujuan'             │
│                                                         │
│ Result: Transaction ready untuk dokumen upload         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: UPLOAD DOCUMENTS                                │
│                                                         │
│ Route: /motors/{transaction}/upload-credit-documents   │
│ Method: POST form-multipart                            │
│                                                         │
│ Required Documents:                                     │
│   1. KTP (Kartu Tanda Penduduk)                        │
│   2. KK (Kartu Keluarga)                               │
│   3. SLIP_GAJI (Bukti gaji/penghasilan)               │
│                                                         │
│ Validation:                                             │
│   - File type: PDF, JPG, PNG                           │
│   - File size: Max 2MB                                 │
│   - All 3 documents required                           │
│                                                         │
│ Storage: storage/app/public/documents/                  │
│                                                         │
│ Database:                                               │
│   - Create documents record untuk tiap file            │
│   - Original filename disimpan                         │
│   - document_type: KTP, KK, SLIP_GAJI                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 5: ADMIN DOCUMENT REVIEW                           │
│                                                         │
│ Location: Admin Dashboard                              │
│ Route: /admin/transactions/{id}                        │
│                                                         │
│ Admin melihat:                                          │
│   - All uploaded documents                              │
│   - Credit details: DP, tenor, monthly installment     │
│   - Has an "Edit Credit" button                        │
│                                                         │
│ Decisions:                                              │
│   1. Documents valid → Update credit_status to        │
│      'dikirim_ke_surveyor'                            │
│                                                         │
│   2. Documents incomplete/invalid →                    │
│      Update credit_status to 'data_tidak_valid'       │
│      Send notification to customer (re-upload)        │
│                                                         │
│ Action: POST /admin/transactions/{id}/update-credit    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 6: SURVEYOR SCHEDULING & INSPECTION                │
│                                                         │
│ When credit_status = 'dikirim_ke_surveyor':            │
│   - Admin meng-set tanggal survey di form              │
│   - Update credit_status = 'jadwal_survey'             │
│   - Surveyor conduct location inspection               │
│   - Verify: Income, residency, motor condition         │
│                                                         │
│ Admin then:                                             │
│   - Input hasil survey di form                         │
│   - Approve/Reject berdasarkan survey results          │
└─────────────────────────────────────────────────────────┘
                         ↓
   ┌─────────────────────────────────────────────────────┐
   │                     DECISION POINT                    │
   └─────────────────────────────────────────────────────┘
            ↙                              ↘
    ┌──────────────────┐          ┌──────────────────┐
    │ APPROVED ✅      │          │ REJECTED ❌      │
    └────────┬─────────┘          └────────┬─────────┘
             ↓                             ↓
┌─────────────────────────────┐  ┌─────────────────────────────┐
│ STEP 7A: APPROVAL WORKFLOW  │  │ STEP 7B: REJECTION WORKFLOW │
│                             │  │                             │
│ credit_status updated to:   │  │ credit_status updated to:   │
│   'disetujui' (Approved)    │  │   'ditolak' (Rejected)      │
│                             │  │                             │
│ Trigger:                    │  │ Send notification to:       │
│   TransactionService::      │  │   - Customer via email      │
│   generateInstallments()    │  │   - Customer via WhatsApp   │
│                             │  │   - Admin notification      │
│                             │  │                             │
│ Generate auto installments: │  │ Customer dapat:             │
│   1. Installment #0 (DP):   │  │   - View rejection reason   │
│      - amount = DP          │  │   - Option to re-apply      │
│      - due_date = today     │  │   - View dashboard status   │
│      - status = pending     │  │                             │
│                             │  │ Transaction remains in DB   │
│   2. Installment #1-N:      │  │ for archival                │
│      - amount = monthly     │  │                             │
│      - due_date = +1mo,    │  │ Can retry dengan dokumen    │
│        +2mo, ..., +Nmo     │  │ update yang berbeda         │
│      - status = pending     │  └─────────────────────────────┘
│                             │
│ Update transaction status:  │
│   status = 'disetujui'      │
│                             │
│ Send notifications:         │
│   - Email to customer       │
│   - WhatsApp to customer    │
│   - Email to admin          │
│                             │
│ Message: "Kredit disetujui! │
│ Cicilan bulanan Rp X akan   │
│ mulai pada [due_date]"      │
└─────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 8: CUSTOMER PAYS INSTALLMENTS                       │
│                                                         │
│ Route: /installments                                    │
│ Show: List of due installments                          │
│                                                         │
│ For each installment:                                   │
│   - Amount                                              │
│   - Due date                                            │
│   - Payment status (pending/paid)                       │
│   - Button: Pay Online (Midtrans)                      │
│                                                         │
│ Payment flow same as CASH:                              │
│   1. Click "Bayar Online"                              │
│   2. Midtrans Snap opens                               │
│   3. Customer select payment method                     │
│   4. Payment processed                                  │
│   5. Webhook updates status                             │
│   6. Email/WA confirmation sent                        │
│                                                         │
│ Process:                                                │
│   - POST /installments/{id}/pay-online                │
│   - InstallmentController::createPayment()             │
│   - Midtrans Snap token generated                      │
│   - Frontend: Snap.pay(token)                         │
│                                                         │
│ Webhook Loop:                                           │
│   - Midtrans settlement callback                        │
│   - Update installment status = 'paid'                │
│   - Update transaction if all paid                      │
│   - Send customer notification                         │
└─────────────────────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 9: TRANSACTION COMPLETION                          │
│                                                         │
│ When all installments marked 'paid':                    │
│   - Update transaction status = 'completed'            │
│   - Send final notification                             │
│   - Generate final invoice/receipt                      │
│   - Archive transaction                                 │
│                                                         │
│ Admin dashboard shows:                                  │
│   - All installments paid ✓                            │
│   - Transaction closed                                 │
│   - Can generate final report                          │
└─────────────────────────────────────────────────────────┘
```

### Credit Transaction Status Flow

```
                    ┌─────────────────────┐
                    │ new_order           │
                    │ (Order created)     │
                    └─────────┬───────────┘
                              ↓
                    ┌─────────────────────────────────┐
                    │ menunggu_persetujuan            │
                    │ (Waiting document verification) │
                    └──┬─────────────────────────────┬─┘
                       ↓                             ↓
          ┌────────────────────────┐  ┌──────────────────────┐
          │ data_tidak_valid ❌    │  │ dikirim_ke_surveyor  │
          │ (Doc incomplete)       │  │ (Survey phase)       │
          └────────────────────────┘  └──┬───────────────────┘
                                         ↓
                           ┌─────────────────────────┐
                           │ jadwal_survey           │
                           │ (Scheduling survey)     │
                           └──┬───────────────┬──────┘
                              ↓               ↓
                    ┌────────────────────┐  ┌──────────┐
                    │ disetujui ✅       │  │ ditolak  │
                    │ (Approved)         │  │ (Rejected)
                    │ Installments       │  │          │
                    │ auto-generated     │  └──────────┘
                    └────────┬───────────┘
                             ↓
                    ┌─────────────────────┐
                    │ payment_process     │
                    │ (Customers paying   │
                    │  installments)      │
                    └────────┬────────────┘
                             ↓
                    ┌─────────────────────┐
                    │ completed ✓         │
                    │ (All paid)          │
                    └─────────────────────┘
```

**Database Tables**: transactions, credit_details, documents, installments
**Controllers**: MotorGalleryController, TransactionController, InstallmentController
**Services**: TransactionService, WhatsAppService
**Cost**: DP + (tenor × monthly_installment)

---

## 🔗 Business Logic Implementation

### TransactionService Key Methods

#### 1. `createTransaction()`

```
Input: array data
  - user_id, motor_id, transaction_type, booking_fee, etc

Process:
  1. Filter data berdasarkan allowed fields
  2. Create Transaction record
  3. If transaction_type = 'CREDIT' → handleCreditDetail()
  4. Trigger Observer → send notifications

Output: Transaction object
```

#### 2. `handleCreditDetail()`

```
Input: Transaction, array creditData

Process:
  1. If credit detail exists → update
  2. If not exists → create
  3. If credit_status = 'disetujui' → generateInstallments()

Output: CreditDetail created/updated
```

#### 3. `generateInstallments()`

```
Input: Transaction, array creditData

Process:
  1. Create Installment #0 (Down Payment)
     - amount = down_payment dari credit_data
     - due_date = now()
     - status = pending

  2. Loop i=1 to tenor
     - Create Installment #i
     - amount = monthly_installment
     - due_date = now()->addMonths(i)
     - status = pending

Output: Installments created (tenor+1 total)
```

#### 4. `sendStatusNotification()`

```
Input: Transaction, array data

Process:
  1. Check if status or credit_status changed
  2. Prepare notification message
  3. Send via Email → CreditStatusUpdated::class
  4. Send via WhatsApp → WhatsAppService::sendMessage()
  5. Log event

Output: Notifications sent
```

---

## 🧮 Financial Calculations

### Cash Transaction

```
Total Amount = Motor Price
Booking Fee = User input (optional, < Motor Price)
Remaining = Motor Price - Booking Fee

Installments:
  If Booking Fee:
    - Installment #0: Booking Fee (due in 1 day)
    - Installment #1: Remaining (due in 7 days)

  If No Booking Fee:
    - Installment #1: Total Amount (due in 7 days)
```

### Credit Transaction

```
Down Payment (DP) = User input
Tenor = User input (months)
Monthly Installment = (Motor Price - DP) / Tenor

Example:
  Motor Price: Rp 50,000,000
  DP: Rp 10,000,000
  Tenor: 12 months

  Monthly = (50,000,000 - 10,000,000) / 12
          = 40,000,000 / 12
          = Rp 3,333,333 per month

Installments:
  - Installment #0: DP (Rp 10,000,000) - due today
  - Installment #1: Monthly (Rp 3,333,333) - due +1 month
  - Installment #2: Monthly (Rp 3,333,333) - due +2 month
  - ...
  - Installment #12: Monthly (Rp 3,333,333) - due +12 month

Total to pay: Rp 10,000,000 + (12 × Rp 3,333,333)
            = Rp 50,000,000 ✓
```

---

## 📨 Notification Triggers

### On Transaction Created

- Email: "New order created"
- WhatsApp: Order confirmation
- Admin: New order alert

### On Status Change (Cash)

- new_order → waiting_payment: Booking fee reminder
- payment_confirmed → unit_preparation: Prep notification
- ready_for_delivery: Ready to pick up
- completed: Thank you message

### On Credit Status Change

- menunggu_persetujuan → dikirim_ke_surveyor: Survey scheduled
- dikirim_ke_surveyor → jadwal_survey: Survey appointment
- jadwal_survey → disetujui: Approval success + installment schedule
- jadwal_survey → ditolak: Approval rejection + retry option

---

**Business Logic Last Updated**: March 6, 2026
