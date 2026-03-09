# ANALISIS FORM PENGAJUAN KREDIT & CASH - March 9, 2026

## 📋 Overview

Analisis mendalam terhadap alur pengisian form di halaman **Pengajuan Kredit (CreditOrderForm)** dan **Pembelian Tunai (CashOrderForm)** untuk identifikasi masalah, UX issues, dan security gaps.

---

## 🔴 ISSUES DITEMUKAN

### A. CreditOrderForm Issues

#### 1. **Tenor Dropdown Mismatch (CRITICAL)**

**Location**: `CreditOrderForm.jsx` lines 250-276  
**Problem**:

- Frontend dropdown hanya menawarkan: 12, 24, 36, 48 bulan
- Backend (`MotorGalleryController`) allows: `max:60` bulan
- User tidak bisa pilih 49-60 bulan padahal backend support

**Impact**: Feature limitation, user tidak bisa manfaatkan tenor yang lebih panjang

**Fix Needed**:

```jsx
<option value="12">12 Bulan (1 Tahun)</option>
<option value="24">24 Bulan (2 Tahun)</option>
<option value="36">36 Bulan (3 Tahun)</option>
<option value="48">48 Bulan (4 Tahun)</option>
<option value="60">60 Bulan (5 Tahun)</option>  // ← ADD THIS
```

---

#### 2. **No Form Preview/Summary Before Submit**

**Location**: Entire form flow  
**Problem**:

- User fill form panjang (nama, HP, pekerjaan, DP, tenor)
- Client-side kalkulasi cicilan ada tapi **tidak ada final summary** sebelum submit
- Tidak bisa lihat total hutang, total bunga, dll sebelum commit

**Current Flow**:

```
User fills form → (only small installment estimate shown) → Submit → Redirect to upload documents
```

**Expected Flow**:

```
User fills form → Click "Preview" → See full breakdown:
  - Motor price
  - Down payment
  - Loan amount
  - Total interest (1.5% flat)
  - Monthly installment
  - Total paid over tenor
  → User confirm → Submit
```

**Impact**: User tidak fully informed tentang financial commitment sebelum submit

---

#### 3. **DP Validation Not Synced Between Frontend & Backend**

**Location**:

- Frontend: No validation, hanya placeholder text "Min. DP: Rp... (20% harga)"
- Backend: `processCreditOrder()` validasi `$minDownPayment`

**Problem**:

- User bisa input DP negative, 0, atau below-minimum client-side
- Backend akan reject → error confusing untuk user
- No **real-time validation feedback**

**Current**:

```
User: inputs down_payment -1000000 (negative)
      → Form shows "Min. DP: Rp..." (text-only)
      → User click submit
      → Backend reject with error
      → User see error message, bingung
```

**Fix Needed**:

```jsx
// Add onChange validation
const validateDownPayment = (value) => {
    const dpValue = parseFloat(value) || 0;
    const minDP = motor.price * 0.2;
    if (dpValue < minDP) {
        setErrors((prev) => ({
            ...prev,
            down_payment: `Min Rp${formatCurrency(minDP)}`,
        }));
    }
};
```

---

#### 4. **Missing Payment Method Selection**

**Location**: `CreditOrderForm.jsx` form body  
**Problem**:

- Form has `useForm` with `payment_method: "Transfer Bank"` (hardcoded default)
- **No UI select for payment_method** → User tidak bisa ganti
- Backend expect `payment_method` required
- Backend doesn't validate payment method options

**Impact**: Form tidak user-friendly, hardcoded method tidak clear

---

### B. CashOrderForm Issues

#### 1. **booking_fee Field Missing from Form UI**

**Location**: `CashOrderForm.jsx` form body  
**Problem**:

- Form state include `booking_fee: 0`
- **Form UI tidak render booking_fee input field**
- Backend `processCashOrder()` expect & validate booking_fee
- Controller check if `booking_fee >= motor.price` → must be less than price

**Impact**: User tidak bisa set booking fee meski form state siap, harus backend set 0

**Fix Needed**:

```jsx
// Add this field to form
<div className="space-y-2">
    <Label htmlFor="booking_fee">Booking Fee (Opsional)</Label>
    <input
        id="booking_fee"
        type="number"
        placeholder="Contoh: 500000"
        value={data.booking_fee}
        onChange={(e) => setData("booking_fee", e.target.value)}
    />
    <p className="text-xs text-gray-400">
        Max: Rp {formatCurrency(motor.price)}
    </p>
</div>
```

---

#### 2. **payment_method Field Not Rendered**

**Location**: `CashOrderForm.jsx` form body  
**Problem**:

- Form state include `payment_method: ""`
- **No UI to select payment_method**
- Backend require `payment_method` string

**Current Backend Validation**:

```php
'payment_method' => 'required|string',
```

### Expected Options\*\*:

- Transfer Bank
- Transfer e-Wallet
- Manual Pickup (jika ada)

---

#### 3. **No Cost Breakdown Before Confirmation**

**Location**: Entire form  
**Problem**:

- Form shows motor price di sidebar (assumed)
- **No breakdown: harga + booking fee = total**
- User submit tanpa clear picture of costs

---

#### 4. **Duplicate Order Check Logic Issue**

**Location**: Both forms, controller lines ~160, ~280  
**Problem**:

- Both `processCashOrder` and `processCreditOrder` check:
    ```php
    $existingOrder = Transaction::where('user_id', Auth::id())
        ->where('motor_id', $motor->id)
        ->where('status', '!=', 'cancelled')
        ->exists();
    ```
- Check korrekt tapi **error message tidak helpful**
- User tidak tau order mana yang conflict (status apa)

---

### C. Shared Issues (Both Forms)

#### 1. **No Real-time Field Validation**

**Problem**:

- customer_name: no pattern check, no max-length visual indicator
- customer_phone: no format check on client
- All validation deferred to backend

**Impact**: User only knows error after submit

---

#### 2. **No Loading State During Submission**

**Problem**:

- Button show "Memproses..." but very subtle
- No overlay/spinner to prevent double-submit

---

#### 3. **No Error Recovery UX**

**Problem**:

- Backend error return to form with `.withInput()`
- But no focus on first error field
- No clear error summary

---

#### 4. **Status Strings Inconsistency**

**Problem**:

- Form→Backend create transaction with various statuses:
    - Cash: `status: 'new_order'`
    - Credit: `status: 'menunggu_persetujuan'`
    - CreditDetail: `credit_status: 'menunggu_persetujuan'`
- **Inconsistent string format**: some are `snake_case`, some UPPERCASE

**Impact**: CRITICAL - hard to track state in reports/logs

---

## ✅ Working Correctly

| Aspect                   | Status | Detail                                     |
| ------------------------ | ------ | ------------------------------------------ |
| Phone validation regex   | ✅     | `regex:/^[\+]?[0-9\s\-\(\)]+$/` correct    |
| DP minimum check         | ✅     | Backend validate 20% minimum               |
| Motor availability check | ✅     | `if (!$motor->tersedia)`                   |
| WA notification          | ✅     | Both forms trigger WA to user & admin      |
| Installment creation     | ✅     | Cash: 2 installments (booking + remaining) |
| Redirect flow            | ✅     | Cash→confirmation, Credit→upload-documents |

---

## 📊 Form Data Flow Diagram

### Cash Order Flow

```
CashOrderForm (empty validation)
    ↓
Submit to processCashOrder()
    ↓
Backend validate: name, phone, occupation, payment_method
    ↓
Check: motor tersedia, no duplicate order
    ↓
Create Transaction (CASH, status: new_order)
    ↓
Create 2 Installments (booking + remaining)
    ↓
Send WA notifications
    ↓
Redirect → motors.order.confirmation
    ↓
User see order summary + payment instructions
```

### Credit Order Flow

```
CreditOrderForm (client-side tenor/DP calc)
    ↓
Submit to processCreditOrder()
    ↓
Backend validate: name, phone, occupation, DP (20% min), tenor (1-60)
    ↓
Check: motor tersedia, no duplicate order
    ↓
Create Transaction (CREDIT, status: menunggu_persetujuan)
    ↓
Create CreditDetail (down_payment, tenor, monthly_installment, interest_rate)
    ↓
Send WA notifications (mention: "SEGERA UNGGAH DOKUMEN")
    ↓
Redirect → motors.upload-credit-documents
    ↓
User upload: KTP, KK, Slip Gaji
```

---

## 🔧 Recommended Fixes (Priority Order)

### P0 (Critical - Fixes mismatches causing confusion)

1. **Fix tenor dropdown** - Add 49-60 options to match backend max:60
2. **Fix payment_method field** - Add select/dropdown to both forms
3. **Fix booking_fee field** - Add input to CashOrderForm
4. **Add payment method options** - decide what methods are supported

### P1 (High - Fixes validation/UX)

1. **Add real-time DP validation** - prevent negative/below-minimum before submit
2. **Add form preview/summary** - show final breakdown before submit
3. **Add helpful error recovery** - focus first error, show summary
4. **Standardize status strings** - use UPPERCASE consistently in codebase

### P2 (Medium - Fixes polish)

1. **Add field-level validation** - show inline errors as user types
2. **Add loading spinner** - visual feedback during submission
3. **Improve duplicate order error** - show which motor & when user ordered
4. **Add payment method info** - help text for each payment method

---

## 🧪 Test Cases to Verify

- [ ] Submit DP below 20% minimum → see error
- [ ] Submit DP >= motor price → see error
- [ ] Submit negative DP → see error
- [ ] Set tenor 60 → verify installment calc correct
- [ ] Submit form empty → see all required field errors
- [ ] Submit duplicate order → see clear error message
- [ ] Cancel mid-form → check draft saved or lost
- [ ] Back button from form → check data lost
- [ ] Mobile responsiveness → verify form readable on small screen

---

## 📝 Status: TO-DO

**Priority**: Complete P0 fixes before end of sprint  
**Owner**: TBD  
**Date**: March 9, 2026
