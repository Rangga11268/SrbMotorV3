# ANALISIS KOMPREHENSIF & IMPROVEMENT PLAN - SRB MOTORS V2

**Last Updated**: March 9, 2026 (Late Evening)  
**Version**: 2.4 - Document Approval & Additional Feature Completion

---

## 📊 STATUS IMPLEMENTASI (Last Verified: March 9, 2026 - Late Evening)

> Ringkasan cepat apa yang sudah dan belum dikerjakan berdasarkan audit kode aktual.

### ✅ Sudah Diimplementasi

| #   | Item                                                | Keterangan                                                                                            |
| --- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Auth middleware pada route order                    | `Route::middleware(['auth', 'throttle:15,1'])` sudah aktif                                            |
| 2   | Midtrans webhook signature validation               | `PaymentCallbackController` sudah ada signature check + idempotency                                   |
| 3   | Rate limiting di routes                             | `throttle:15,1` pada order routes, `throttle:5,1` pada guest routes                                   |
| 4   | Google OAuth (Socialite)                            | `GoogleAuthController` dengan `stateless()`, google_id migration sudah ada                            |
| 5   | Google OAuth `email_verified_at` saat create user   | `email_verified_at = now()` di GoogleAuthController                                                   |
| 6   | TransactionService architecture                     | Service layer sudah ada dan dipakai TransactionController                                             |
| 7   | WA notifikasi ke user & admin saat order masuk      | Ada di `processCashOrder` dan `processCreditOrder`                                                    |
| 8   | Email notifikasi saat status kredit berubah         | `CreditStatusUpdated` mail di TransactionService                                                      |
| 9   | Cascade delete dokumen                              | `CreditDetail::booted()` hapus file fisik + record                                                    |
| 10  | Authorization check pada dokumen upload             | `user_id !== Auth::id()` di semua fungsi upload                                                       |
| 11  | `hasRequiredDocuments()` validasi kelengkapan       | Ada di model `CreditDetail`                                                                           |
| 12  | React import audit (useState, useEffect, lucide)    | Diperbaiki March 8, 2026                                                                              |
| 13  | Profile page layout fix (email badge overlap)       | Diperbaiki March 8, 2026                                                                              |
| 14  | Login/Register Google OAuth flash error display     | Ditambahkan flash error banner                                                                        |
| 15  | **Generate installment saat admin approve kredit**  | `generateInstallments` dibuat `public`, dipanggil di `updateCredit` — March 8, 2026                   |
| 16  | **Bunga/interest rate kredit (1.5% flat/bulan)**    | Kalkulasi baru + kolom `interest_rate` + migration — March 8, 2026                                    |
| 17  | **Cek stok motor + duplikasi order**                | `tersedia` check + active order check di cash & kredit — March 8, 2026                                |
| 18  | **WA notifikasi admin saat dokumen diupload**       | Ditambahkan di `uploadCreditDocuments` — March 8, 2026                                                |
| 19  | **Minimum DP 20% dari harga motor**                 | Custom error dengan nominal Rp di `processCreditOrder` — March 8, 2026                                |
| 20  | **Maksimum tenor 60 bulan**                         | Validasi `max:60` pada field tenor — March 8, 2026                                                    |
| 21  | **Form tenor dropdown fix (48→60 bulan)**           | Ditambahkan option 60 bulan ke CreditOrderForm — March 9, 2026                                        |
| 22  | **Add payment_method field ke CreditOrderForm**     | Select dropdown dengan options: Transfer Bank, E-Wallet, Virtual Account — March 9                    |
| 23  | **Add booking_fee field ke CashOrderForm**          | Input number dengan max-price validation hint — March 9, 2026                                         |
| 24  | **CashOrderForm payment_method UI sudah ada**       | Radio button UI untuk Transfer Bank & Tunai di Toko — Already existed                                 |
| 25  | **Status string standardization (snake_case only)** | Removed UPPERCASE variants dari CreditDetail model + InstallmentController — March 9                  |
| 26  | **Security headers (CSP, HSTS, X-Frame-Options)**   | SecurityHeadersMiddleware sudah aktif di bootstrap/app.php — March 9                                  |
| 27  | **MustVerifyEmail di User model**                   | Uncommented interface, added to User class, tested via `verified` middleware — March 9                |
| 28  | **Form client-side validation dengan error banner** | Validasi realtime + error list, auto-scroll ke atas — March 9, 2026                                   |
| 29  | **DP input improvement (Suggestion Button)**        | Button "Gunakan Min DP" + dynamic loan amount feedback — March 9, 2026                                |
| 30  | **Booking fee input improvement**                   | Dynamic sisa pembayaran + validation feedback - March 9, 2026                                         |
| 31  | **Format number dengan separator titik**            | 4700000 → 4.700.000 display, backend terima clean number — March 9, 2026                              |
| 32  | **Default tenor = 12 bulan (tidak empty)**          | Tenor dropdown default di value "12" — March 9, 2026                                                  |
| 33  | **Required attributes di semua form fields**        | Added required validation di DP, tenor, payment_method — March 9, 2026                                |
| 34  | **Color feedback untuk input validation**           | Border hijau saat valid, abu-abu saat invalid — March 9, 2026                                         |
| 35  | **Leasing provider selection di form kredit**       | Model relationship + migration + form dropdown populated from DB — March 9, 2026                      |
| 36  | **User bisa cancel order sendiri**                  | Route + controller method + authorization check + WhatsApp notification — March 9, 2026               |
| 37  | **Race condition fix di generate installment**      | DB::transaction + pessimistic locking (lockForUpdate) — March 9, 2026                                 |
| 38  | **Review status per dokumen (per-file approval)**   | Migration approval_status enum + model methods (approve/reject) + controller + routes — March 9, 2026 |

### ❌ Belum Diimplementasi

| #   | Item                                                 | Prioritas |
| --- | ---------------------------------------------------- | --------- |
| 1   | Jadwal survey dengan tanggal/waktu/lokasi            | 🟡 Sedang |
| 2   | Reminder cicilan jatuh tempo (scheduled job)         | 🟡 Sedang |
| 3   | Upload path standardization (2 format sekarang)      | 🟢 Rendah |
| 4   | Audit trail logging                                  | 🟢 Rendah |
| 5   | Authorization Policies (Laravel Policy)              | 🟢 Rendah |
| 6   | Admin panel CoreUI migration                         | 🟢 Rendah |
| 7   | UI/UX Redesign (Home, Catalog, Detail, Order Wizard) | 🟢 Rendah |

---

## 📋 EXECUTIVE SUMMARY

SRB Motors adalah **platform dealer motor end-to-end** dengan:

- **Customer Portal**: Katalog motor → Order cash/kredit → Upload dokumen → Bayar cicilan
- **Admin Panel**: Monitoring transaksi, verifikasi dokumen, laporan keuangan, manajemen user
- **Technology**: Laravel 12 + Inertia.js + React 19 + MySQL + Midtrans + Fonnte
- **Current Status**: Core bisnis logic sudah lengkap ✅ | UI perlu redesign ⚠️ | Security perlu hardening ⚠️

---

## 🔍 ANALISIS MENDALAM (A-Z)

### A. Temuan Positif ✅

#### 1. **Arsitektur Backend Solid**

- MVC pattern dengan Service Layer (TransactionService, WhatsAppService)
- Repository Pattern untuk data access + caching
- Observer Pattern untuk notifikasi otomatis
- Domain bisnis terstruktur di Models

#### 2. **Business Logic Komprehensif**

- 2 flow transaksi: CASH (sederhana) + CREDIT (kompleks dengan verifikasi)
- Installment generation otomatis
- Status workflow jelas dengan enum
- Payment integration sudah ada (Midtrans)

#### 3. **Frontend Structure Reasonable**

- Inertia.js sebagai bridge (sudah SPA-like)
- Component-based React (reusable components)
- Routes sudah grouped customer + admin

#### 4. **Database Schema Matang**

- Relationships clear (1-to-many, cascade delete)
- Constraints proper
- Migration files terstruktur

---

### B. Temuan Kritis ⚠️

#### 1. **SECURITY ISSUE: Routes Order Publik Tanpa Auth**

**Status**: ✅ **SUDAH DIFIX** — Route order sudah dalam `middleware(['auth', 'throttle:15,1'])` group.

~~**Problem**~~: ~~Routes order tidak protected~~

> Tinggal memastikan semua edge case route sudah masuk group yang benar.

#### 2. **SECURITY ISSUE: Webhook Midtrans Tidak Divalidasi**

**Status**: ✅ **SUDAH DIFIX** — `PaymentCallbackController` sudah implementasi signature SHA512 validation + idempotency check.

#### 3. **UI/UX Problem: Desain Tidak Konsisten**

- Multiple CSS files (`home.css`, `style.css`, `style-optimized.css`, `admin.css`) → overlap + maintenance nightmare.
- Color scheme terlalu kontras (neon, glow effects) → tidak professional untuk dealer motor.
- Motion effects berlebih (marquee, framer motion) → fokus pengunjung terganggu.
- Admin panel pakai template ad-hoc → tidak skala untuk fitur tambahan.

**Impact**: User experience tidak professional, maintenance sulit, branding tidak jelas.

#### 4. **Admin Panel Tidak Scalable**

- Dashboard/layout tidak modular.
- Tidak ada consistent component library.
- Sulit tambah halaman/fitur baru.

**Recommendation**: Migrate ke CoreUI (React Admin Template).

#### 5. **Fitur Notifikasi Belum Optimal**

- WhatsApp & Email ada tapi belum comprehensive.
- Tidak ada push notification real-time.
- Status laporan belum detail ke customer.

#### 6. **Form Order Pengalaman Kurang Baik**

- Wizard belum ada (1 halaman panjang).
- Preview ringkasan biaya tidak sticky.
- Validasi error tidak inline + helpful.

---

### C. Fitur Existing yang Perlu Improve

| Fitur           | Status     | Improvement                                |
| --------------- | ---------- | ------------------------------------------ |
| Katalog motor   | ✅ Ada     | Filter UI perlu dikerjakan, sticky sidebar |
| Order cash      | ✅ Ada     | Wizard 2-step + preview biaya              |
| Order kredit    | ✅ Ada     | Wizard 3-step + estimasi approval cepat    |
| Upload dokumen  | ✅ Ada     | Checklist, preview file, drag-drop         |
| Bayar cicilan   | ✅ Ada     | Reminder H-3/H-1, riwayat transparan       |
| Admin transaksi | ✅ Ada     | Quick actions, bulk approve                |
| Admin dokumen   | ✅ Ada     | Preview, checklist, audit trail            |
| Laporan         | ✅ Ada     | Filter advanced, export konsisten          |
| Notifikasi      | ⚠️ Parsial | Email bagus, perlu push + real-time        |

---

## 🎨 UI/UX REDESIGN PLAN

### A. Design Philosophy (Simple, Modern, Trust-focused)

#### 1. **Color Palette (3 Warna Inti)**

```
Primary (Gray):        #111827 atau #1F2937      (Slate/Charcoal)
Surface (Light):       #F8FAFC atau #FFFFFF      (Off-white/White)
Accent (Blue):         #2563EB atau #3B82F6      (Clean Blue)
Accent Alt (Success):  #10B981 atau #059669      (Emerald)
Surface Dark:          #F3F4F6                   (Light gray untuk hover)
Text Primary:          #111827                   (Dark)
Text Secondary:        #6B7280                   (Medium gray)
Border:                #E5E7EB                   (Light gray border)
```

#### 2. **Typography**

```
Primary Font:     "Inter" atau "Segoe UI" (sans-serif)
Fallback:         -apple-system, BlinkMacSystemFont, system-ui
Sizes:
  - Display:      32px/2rem (heading hero)
  - H1:           28px/1.75rem
  - H2:           24px/1.5rem
  - H3:           20px/1.25rem
  - Body:         16px/1rem
  - Small:        14px/0.875rem
  - Tiny:         12px/0.75rem
Line-height:      1.5 for body, 1.2 for headings
```

#### 3. **Spacing System (8px Grid)**

```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
5:    20px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
```

#### 4. **Component Tokens**

```
Border Radius:
  - None:         0px
  - Small:        4px
  - Default:      8px
  - Medium:       12px
  - Large:        16px
  - Full/Pill:    9999px

Shadows:
  - None:         none
  - Small:        0 1px 2px rgba(0,0,0,0.05)
  - Default:      0 1px 3px rgba(0,0,0,0.1)
  - Medium:       0 4px 6px rgba(0,0,0,0.07)
  - Large:        0 10px 15px rgba(0,0,0,0.1)
  - XL:           0 20px 25px rgba(0,0,0,0.1)

Transitions:
  - Default:      ease 150ms
  - Hover:        ease 200ms
  - (Tanpa overshoot, smooth saja)
```

---

### B. Redesign Per Halaman

#### 1. **Home Page**

```
Layout:
┌─────────────────────────────────────────┐
│         HEADER / NAVBAR                │ (sticky, minimal)
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION                           │ (50vh)
│  - Headline: "Cari motor impian mu"    │
│  - Subheadline: "Cicilan mulai Rp X/mo"│
│  - Search/Filter inline (mobile: below) │
│  - CTA: "Jelajahi katalog"              │
│                                         │
├─────────────────────────────────────────┤
│  WHY US? (3 cards)                      │
│  - "Harga terjangkau"                   │
│  - "Proses mudah & cepat"               │
│  - "Kepercayaan pelanggan"              │
├─────────────────────────────────────────┤
│  UNIT TERBARU / POPULER (4 cards)       │
│  - Grid responsif                       │
│  - Card: foto, nama, harga, status      │
│  - CTA: "Lihat detail"                  │
├─────────────────────────────────────────┤
│  QUICK LOAN SIMULATOR                   │
│  - Input: harga, tenor → output cicilan │
│  - Styled like minimal widget           │
├─────────────────────────────────────────┤
│  TESTIMONIAL / TRUST (2-3 items)        │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘

Color: White background, blue accent, gray text
Effect: NO neon, NO blur, NO marquee. Foto motor tetap hero.
```

#### 2. **Catalog Page (Motors/Index)**

```
Layout (2 kolom):
┌────────────┬──────────────────────────────────┐
│  FILTER    │      GRID MOTOR CARDS            │
│  (sticky)  │      (responsive 2-4 cols)       │
│            │                                  │
│ Brand ▼    │  ┌─────────┐  ┌─────────┐      │
│ Type ▼     │  │ Photo   │  │ Photo   │  ... │
│ Year ▼     │  │         │  │         │      │
│ Price▼     │  └─────────┘  └─────────┘      │
│            │  Motor Name    Motor Name       │
│ [Reset]    │  Rp XXX,XXX    Rp XXX,XXX      │
│            │  ⭐ Stok tersedia  Tersedia    │
│            │  [Detail] [Banding]            │
│            │                                │
│ Sort ▼     │  (paginate atau infinite load) │
│            │                                │
└────────────┴──────────────────────────────────┘

Color: Gray bg for sidebar, white for content cards
Effect: Clean filter, clear CTA, minimal distraction
```

#### 3. **Motor Detail Page (Motors/Show)**

```
Layout (2 kolom):
┌──────────────────┬──────────────────────┐
│  GALLERY (kiri)  │  INFO (kanan)        │
│  - Main foto     │  - Nama motor        │
│  - Thumbnails    │  - Harga besar       │
│  - Zoom icon     │  - Status tersedia   │
│                  │                      │
├──────────────────┤  AKSI UTAMA:         │
│  TABS:           │  [Beli Tunai]        │
│  - Spek          │  [Ajukan Kredit]     │
│  - Simulasi      │  [Chat WhatsApp]     │
│  - Legal         │                      │
│                  │  SPEC TABLE (dibawah)|
│                  │  - Engine CC/cc      │
│                  │  - Fuel type         │
│                  │  - Transmission      │
│                  │  - dst               │
└──────────────────┴──────────────────────┘

Tab: Spesifikasi TABLE
     Simulasi WIDGET (kalkulator)
     Legal EMBED (PDF viewer)

Color: Hero foto dominant, white back, blue accent untuk CTA
```

#### 4. **Order Form (Cash & Credit)**

```
WIZARD 2-3 Step dengan progress indicator
┌─────────────────────────────────────────┐
│  Step 1 ●─── Step 2 ─── Step 3         │ (progress bar)
└─────────────────────────────────────────┘

STEP 1: PERSONAL INFO
┌─────────────────────────────────────────┐
│  Your Details                           │
│                                         │
│  Full Name         [_______________]   │
│                    ️Error: wajib diisi  │
│  Phone Number      [_______________]   │
│  Occupation        [_______________]   │
│                                         │
│                  [← Back] [Lanjut →]    │
└─────────────────────────────────────────┘

STEP 2: PAYMENT METHOD (CASH) / TENOR (CREDIT)
┌─────────────────────────────────────────┐
│  Payment Details                        │
│                                         │
│  Motor: [Motor Name] @ Rp 50.000.000  │ (sticky card di kanan)
│                                         │
│  For CASH:                              │
│    Booking Fee     [_______________]   │
│    Remaining: Rp 40.000.000             │
│                                         │
│  For CREDIT:                            │
│    Down Payment    [_______________]   │
│    Tenor (months)  [dropdown: 12/24]   │
│    Monthly: Rp 3.333.333               │
│                                         │
│                  [← Back] [Lanjut →]    │
└─────────────────────────────────────────┘

STEP 3: CONFIRMATION & SUBMIT
┌─────────────────────────────────────────┐
│  Confirm Order                          │
│                                         │
│  Motor:        [Motor Name]             │ (review card)
│  Type:         Cash / Credit            │
│  DP/Booking:   Rp X                     │
│  Total Amount: Rp 50.000.000            │
│                                         │
│  ☐ Saya setuju dengan terms & conditions│
│                                         │
│  [← Back]              [Confirm Order]  │
└─────────────────────────────────────────┘

Sticky Summary (kanan):
┌──────────────┐
│ Order Summary│
├──────────────┤
│ Motor        │
│ Rp 50.000.000│
├──────────────┤
│ DP/Booking   │
│ Rp 10.000.000│
├──────────────┤
│ Cicilan      │
│ Rp 3.3M x12  │
├──────────────┤
│ TOTAL        │
│ Rp 50.000.000│
└──────────────┘

Color: White form, blue accent untuk button aktif, red danger jika ada error
Effect: Inline validation, helper text, NO loading wheel, skeleton OK.
```

#### 5. **User Dashboard (Transactions & Installments)**

```
┌─────────────────────────────────────────┐
│         MY TRANSACTIONS                 │
├─────────────────────────────────────────┤
│  FILTER: Status ▼ | Date ▼ | [Search]   │
│                                         │
│  Transaction ID #001 - Motor Name       │
│  ┌─────────────────────────────────────┐│
│  │ Status: ⏳ Menunggu Approval        ││
│  │                                     ││
│  │ Timeline:                           ││
│  │ ✓ Order created (3 Mar)             ││
│  │ ✓ Documents uploaded (3 Mar)        ││
│  │ ⏳ Review (Admin reviewing...)       ││
│  │ ○ Survey                            ││
│  │ ○ Approval                          ││
│  │                                     ││
│  │ [View documents] [Track status]     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Transaction ID #002 - Motor Name       │
│  ┌─────────────────────────────────────┐│
│  │ Status: 💚 Approved - Cicilan aktif  ││
│  │ Total: Rp 50.000.000                 ││
│  │ [Lihat cicilan]                      ││
│  └─────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│         MY INSTALLMENTS                 │
├─────────────────────────────────────────┤
│  FILTER: Status ▼ | [Sort]              │
│                                         │
│  Cicilan #1 - Booking Fee               │
│  ┌─────────────────────────────────────┐│
│  │ Rp 10.000.000                        ││
│  │ Due: 04 Mar 2026 (in 1 day)          ││
│  │ Status: ⏳ Pending                   ││
│  │ [Bayar sekarang] [Riwayat pembayaran]││
│  └─────────────────────────────────────┘│
│                                         │
│  Cicilan #2 - Cicilan Bulanan           │
│  ┌─────────────────────────────────────┐│
│  │ Rp 3.333.333                         ││
│  │ Due: 04 Apr 2026 (in 29 hari)        ││
│  │ Status: ⏳ Pending                   ││
│  │ [Bayar sekarang]                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘

Color: Timeline dengan chevron green-to-gray, status badge warna-warni
Effect: Clear status, easy action, no confusion
```

#### 6. **Admin Panel (CoreUI Template)**

Replace custom admin UI dengan **CoreUI React Admin Dashboard**:

- Pre-built components (navbar, sidebar, breadcrumb, card, table)
- Responsive design out-of-box
- Professional look
- Easy to extend

**CoreUI + Customization**:

```
Admin Panel Structure (CoreUI):
├── Sidebar (navigation auto-collapse mobile)
├── Navbar (user menu, notifications, search)
├── Main Content Area
│   ├── Dashboard (KPI cards + charts)
│   ├── Transactions (data table + filters)
│   ├── Documents (file preview + checklist)
│   ├── Users (user management)
│   ├── Motors (CRUD)
│   └── Reports (export capabilities)
└── Footer
```

---

### C. Design System Implementation

#### New File Structure:

```
resources/
├── css/
│   └── app.css                 (SINGLE SOURCE - Tailwind only)
├── js/
│   ├── Components/
│   │   ├── UI/                 (Reusable design components)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── ...
│   │   ├── Layout/             (Structural components)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx (untuk admin)
│   │   │   └── ...
│   │   └── Features/           (Business components)
│   │       ├── MotorCard.jsx
│   │       ├── OrderWizard.jsx
│   │       └── ...
│   ├── Pages/
│   │   ├── Home.jsx            (new design)
│   │   ├── Motors/
│   │   │   ├── Index.jsx       (new design)
│   │   │   ├── Show.jsx        (new design)
│   │   │   └── ...
│   │   ├── Admin/              (CoreUI-based)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions/
│   │   │   └── ...
│   │   └── Auth/
│   └── lib/
│       ├── hooks.js            (custom hooks)
│       └── utils.js            (utilities)
```

---

## 🔐 SECURITY HARDENING CHECKLIST

### Critical Issues (Fix Immediately)

- [ ] **Route Auth Protection**

    ```php
    Route::middleware('auth')->group(function () {
        Route::get('/motors/{motor}/cash-order', [...]);
        Route::post('/motors/{motor}/process-cash-order', [...]);
        // semua order routes harus diproteksi
    });
    ```

- [ ] **Webhook Signature Validation**

    ```php
    use Midtrans\Config;
    use Midtrans\Notification;

    public function handle(Request $request)
    {
        $notification = new Notification();
        $order_id = $notification->order_id;
        $status_code = $notification->status_code;
        $payment_type = $notification->payment_type;
        $fraud_status = $notification->fraud_status;

        // Verify signature
        $key = Config::$serverKey;
        $signature = hash('sha512', $order_id.$status_code.$key);

        if ($signature !== $request->signature_key) {
            abort(403, 'Invalid signature');
        }

        // Idempotency check: cek apakah callback sudah processed sebelumnya
        $log = CallbackLog::where('notification_id', $order_id)->first();
        if ($log) {
            return response()->json(['status' => 'already_processed']);
        }

        // Process...
        CallbackLog::create(['notification_id' => $order_id, ...]);
    }
    ```

- [ ] **Rate Limiting**

    ```php
    // app/Http/Middleware/RateLimitMiddleware.php
    Route::group(['middleware' => ['rate.limit']], function () {
        Route::post('/login', ...);                    // 5 per minute
        Route::post('/register', ...);                 // 3 per minute
        Route::post('/contact', ...);                  // 3 per minute
        Route::post('/motors/{motor}/process-*', ...); // 10 per minute
    });
    ```

- [ ] **Security Headers**
    ```php
    // app/Http/Middleware/SecurityHeaders.php
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('X-Content-Type-Options', 'nosniff')
            ->header('X-Frame-Options', 'DENY')
            ->header('X-XSS-Protection', '1; mode=block')
            ->header('Strict-Transport-Security', 'max-age=31536000')
            ->header('Content-Security-Policy', "default-src 'self' https:");
    }
    ```

### High Priority

- [ ] **Document Upload Security**
    - [ ] Validasi MIME type + magic bytes
    - [ ] Scan malware (VirusTotal API atau ClamAV)
    - [ ] Simpan dengan nama random: `uniqid().'.pdf'`
    - [ ] Private storage + signed URL untuk akses
    - [ ] Limit file size per upload (2MB)

- [ ] **Authorization Policies**

    ```php
    // Use Laravel Policies instead of manual role check
    public function update(User $user, Transaction $transaction)
    {
        // User hanya bisa lihat transaksi milik mereka
        return $user->id === $transaction->user_id;
    }
    ```

- [ ] **Audit Trail**
    ```php
    // Log setiap perubahan kritical
    Log::channel('audit')->info('Transaction status updated', [
        'transaction_id' => $transaction->id,
        'status' => $transaction->status,
        'changed_by' => auth()->id(),
        'timestamp' => now(),
    ]);
    ```

### Medium Priority

- [ ] **Input Validation Comprehensive**
    - [ ] Sanitize all inputs via FormRequest
    - [ ] Enum validation untuk status fields
    - [ ] Phone format validation strict

- [ ] **Data Leakage Prevention**
    - [ ] `$hidden` di Model untuk sensitive fields (password, tokens)
    - [ ] API responses jangan expose internal data
    - [ ] Error messages jangan expose DB structure

- [ ] **Session Security**
    ```php
    // .env
    SESSION_SECURE_COOKIES=true (production only)
    SESSION_HTTP_ONLY=true
    SESSION_SAME_SITE=lax
    ```

---

## 🔔 OAUTH GOOGLE INTEGRATION

### A. Setup Google Cloud Console

#### Step 1: Buat Project di Google Cloud Console

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Klik "Select a Project" → "New Project"
3. Nama: "SRB Motors"
4. Klik "Create"

#### Step 2: Enable Google+ API

1. Sidebar → "APIs & Services"
2. Search "Google+ API" atau "OAuth 2.0"
3. Klik "Google+ API" → "Enable"

#### Step 3: Create OAuth 2.0 Credential

1. "APIs & Services" → "Credentials"
2. Klik "+ Create Credentials" → "OAuth Client ID"
3. Pilih "Web Application"
4. Masukkan settings:

```
Name: SRB Motors Web App

Authorized JavaScript origins:
  - http://localhost:8000
  - http://localhost:3000  (jika Vite dev server)
  - https://srbmotor.com   (production domain)
  - https://www.srbmotor.com

Authorized redirect URIs:
  - http://localhost:8000/auth/google/callback
  - http://localhost:3000/auth/google/callback  (jika Vite)
  - https://srbmotor.com/auth/google/callback
  - https://www.srbmotor.com/auth/google/callback
```

5. Klik "Create"
6. Download JSON → simpan credentials (jangan commit ke git!)

#### Step 4: Ambil Client ID & Secret

```json
{
    "web": {
        "client_id": "XXXX-XXXX.apps.googleusercontent.com", // ← Copy ini
        "client_secret": "GOCSPX-XXXXXXXXXXXX", // ← Copy ini
        "redirect_uris": ["http://localhost:8000/auth/google/callback"]
    }
}
```

---

### B. Laravel Implementation

#### Step 1: Install Laravel Socialite

```bash
composer require laravel/socialite
```

#### Step 2: Config .env

```env
GOOGLE_CLIENT_ID=XXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXX
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

#### Step 3: Add to `config/services.php`

```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

#### Step 4: Create Google Auth Controller

```php
// app/Http/Controllers/GoogleAuthController.php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect()
    {
        return Socialite::driver('google')
            ->scopes(['email', 'profile'])
            ->redirect();
    }

    /**
     * Handle Google callback
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Cek user sudah ada?
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'role' => 'user', // Default role
                    'password' => bcrypt(uniqid()), // Unused untuk OAuth user
                    'google_id' => $googleUser->getId(),
                    'google_avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                // Update Google ID jika belum ada
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            }

            Auth::login($user, remember: true); // Auto login

            return redirect()->intended(route('home'));
        } catch (\Exception $e) {
            return redirect(route('login'))
                ->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }

    /**
     * Logout
     */
    public function logout()
    {
        Auth::logout();
        return redirect(route('home'));
    }
}
```

#### Step 5: Update User Model

```php
// app/Models/User.php

protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'google_id',      // ← Add
    'google_avatar',  // ← Add
];

protected $hidden = [
    'password',
    'remember_token',
];
```

#### Step 6: Migration untuk Google Fields

```php
// database/migrations/XXXX_add_google_to_users_table.php

Schema::table('users', function (Blueprint $table) {
    $table->string('google_id')->nullable()->unique();
    $table->string('google_avatar')->nullable();
});
```

Jalankan:

```bash
php artisan migrate
```

#### Step 7: Add Routes

```php
// routes/web.php

Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

Route::post('/logout', [GoogleAuthController::class, 'logout'])
    ->name('logout');
```

#### Step 8: Add Button di Login Page (React)

```jsx
// resources/js/Pages/Auth/Login.jsx

import { Link } from "@inertiajs/react";

export default function Login() {
    return (
        <div className="space-y-6">
            {/* Email login form */}
            <form>{/* ... existing form ... */}</form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Atau</span>
                </div>
            </div>

            {/* Google Login Button */}
            <Link
                href={route("auth.google")}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    {/* Google logo SVG */}
                </svg>
                Login dengan Google
            </Link>
        </div>
    );
}
```

---

### C. Production Deployment Checklist

```
BEFORE DEPLOY TO PRODUCTION:

☐ Update Google Console dengan production domain
☐ Change .env di production:
    GOOGLE_REDIRECT_URI=https://srbmotor.com/auth/google/callback

☐ Jangan commit GOOGLE_CLIENT_SECRET ke git
    (Simpan di .env production saja, atau CI/CD secrets)

☐ Enable "HTTPS only" di production

☐ Test OAuth flow di production domain
```

---

## 📅 PHASE-BY-PHASE ROADMAP

### **PHASE 1: Foundation (Week 1)**

**Goal**: Design system + basic UI redesign

**Tasks**:

- [ ] Establish color palette, typography, spacing tokens
- [ ] Create Tailwind config dengan design tokens baru
- [ ] Redesign Navbar & Footer komponens
- [ ] Redesign Home page (hero + 3 sections)
- [ ] Setup CoreUI untuk admin panel skeleton
- [ ] Standardisasi button, input, card komponens

**Deliverable**: Home page + Navbar + Footer baru live, coherent design system

**Timeline**: 5 working days

---

### **PHASE 2: Core Pages & Flows (Week 2)**

**Goal**: User-facing pages dengan UX baik, OAuth Google ready

**Tasks**:

- [ ] Redesign Motors/Index (filter sidebar + grid)
- [ ] Redesign Motors/Show (gallery + detail + action buttons)
- [ ] Implement Order Wizard (2-3 step forms)
- [ ] Build Google OAuth (setup Google Console + Laravel implementation)
- [ ] Create Google login button di Auth pages
- [ ] Build User Dashboard (transactions + installments)
- [ ] Setup JSON API endpoints untuk status real-time

**Deliverable**: Catalog beautifully designed, order wizard smooth, Google login working

**Timeline**: 5 working days

---

### **PHASE 3: Admin Panel & Real-time (Week 3)**

**Goal**: Complete admin panel dengan CoreUI, status update real-time

**Tasks**:

- [ ] Migrate admin UI ke CoreUI React template
- [ ] Design dashboard KPI cards + charts
- [ ] Build transactions list dengan filters + quick actions
- [ ] Build documents preview page dengan verification checklist
- [ ] Implement Axios polling untuk status update real-time (transactions, installments)
- [ ] Add toast notifications untuk status changes
- [ ] Add skeleton loaders untuk loading states

**Deliverable**: Professional admin panel, live status updates tanpa reload

**Timeline**: 5 working days

---

### **PHASE 4: Security Hardening + Testing (Week 4)**

**Goal**: Production-ready security + end-to-end validation

**Tasks**:

- [ ] Fix route auth protection (all order routes) — ✅ **DONE**
- [ ] Implement Midtrans webhook signature validation + idempotency — ✅ **DONE**
- [ ] Add rate limiting (login, register, contact, order) — ✅ **DONE (throttle)**
- [ ] Add security headers (CSP, HSTS, X-Frame-Options, etc)
- [ ] Upload document validation + scan
- [ ] Implement audit trail logging
- [ ] Authorization policies (user only see own transactions)
- [ ] Data leakage prevention ($hidden fields, safe API responses)
- [ ] Session security settings (.env)
- [ ] Comprehensive input validation dengan FormRequest
- [ ] Error handling + custom error pages
- [ ] Load testing + performance optimization

**Deliverable**: Security audit passed, production-ready

**Timeline**: 5 working days

---

### **PHASE 5: Polish + Deployment (Week 5)**

**Goal**: Final fixes, UAT, go live

**Tasks**:

- [ ] User Acceptance Testing (UAT) cycle
- [ ] Bug fixes & refinements
- [ ] Performance tuning
- [ ] Backup strategy
- [ ] Monitoring setup (logging, alerting)
- [ ] Deployment checklist complete
- [ ] Go live!

**Deliverable**: Live di production, monitoring active

**Timeline**: 3-5 working days

---

## 📦 TECH STACK UPDATES

### Current → Recommended

| Layer             | Current        | Recommended            | Reason                         |
| ----------------- | -------------- | ---------------------- | ------------------------------ |
| **Backend**       | Laravel 12     | ✅ Keep                | Solid, no change               |
| **Frontend**      | React 19       | ✅ Keep                | Modern, good UX                |
| **Router**        | Inertia.js     | ✅ Keep                | SSR ready, good DX             |
| **CSS**           | Tailwind 4     | ✅ Keep                | Utility-first perfect          |
| **Admin UI**      | Custom         | → **CoreUI**           | Professional, scalable         |
| **Auth**          | Email/Pass     | + **Google OAuth**     | Trust, ease of use             |
| **Payment**       | Midtrans       | ✅ Keep                | Reliable, local support        |
| **Notifications** | WhatsApp/Email | ✅ Keep                | Working well                   |
| **Monitoring**    | ?              | → **Sentry/LogRocket** | Error tracking, user analytics |

---

## 🎯 SUCCESS CRITERIA

- [ ] UI coherent, professional, trusted (simple modern design)
- [ ] All user flows smooth (1-click, no confusion)
- [ ] Admin panel powerful (filter, bulk actions, insights)
- [ ] Real-time status no-reload (Axios polling OR WebSocket)
- [ ] Security hardened (no auth bypass, no webhook fraud)
- [ ] Performance fast (<2s page load, <100ms API response)
- [ ] Google OAuth working (login alternative) — ✅ **DONE**
- [ ] Email verification working (akun terverifikasi sebelum transaksi)
- [ ] Order flow bugs fixed (bunga, installment generate, stok motor)
- [ ] UAT passed (0 critical bugs at go-live)

---

## 📧 RANCANGAN SISTEM VERIFIKASI EMAIL

**Tanggal Perancangan**: March 8, 2026  
**Status**: Belum diimplementasi  
**Prioritas**: Medium-High (dibutuhkan sebelum go-live transaksi)

### Latar Belakang

Saat ini user bisa register dan langsung melakukan order/cicilan tanpa memverifikasi email. Ini bermasalah karena:

- Email notifikasi status transaksi bisa gagal kirim ke email salah ketik
- Tidak ada jaminan akun dimiliki orang yang valid
- Potensi akun spam/bot untuk flooding sistem

---

### Alur Utama (Flow)

```
Register
   │
   ▼
Email verifikasi terkirim otomatis (Laravel VerifyEmail notification)
   │
   ▼
User login → bisa akses katalog & profil (read-only)
   │
   ├── Email BELUM verified  ──► Banner peringatan di profil
   │                              Tombol "Kirim Ulang Email Verifikasi"
   │                              Route checkout/order/cicilan → redirect notice
   │
   └── Email SUDAH verified  ──► Akses penuh ke semua fitur
```

---

### Komponen Backend yang Dibutuhkan

#### 1. Model `User` — Implement `MustVerifyEmail`

```php
// app/Models/User.php
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    // Laravel akan otomatis kirim email verifikasi setelah register
}
```

#### 2. Routes Verifikasi

```php
// routes/web.php — tambahkan dalam group auth middleware
Route::get('/email/verify', [EmailVerificationNoticeController::class, 'show'])
    ->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('verification.send');
```

#### 3. Controller Verifikasi

```php
// app/Http/Controllers/Auth/EmailVerificationController.php
public function verify(EmailVerificationRequest $request)
{
    if ($request->user()->hasVerifiedEmail()) {
        return redirect()->route('profile.show')->with('flash', [
            'success' => 'Email Anda sudah terverifikasi sebelumnya.'
        ]);
    }

    $request->fulfill(); // mark verified + fire event

    return redirect()->route('profile.show')->with('flash', [
        'success' => 'Email berhasil diverifikasi! Selamat datang di SRB Motors.'
    ]);
}
```

#### 4. Middleware Proteksi Route Transaksi

```php
// routes/web.php — semua route yang butuh email verified
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/motors/{motor}/cash-order', ...);
    Route::post('/motors/{motor}/credit-order', ...);
    Route::get('/installments', ...);
    Route::post('/installments/{id}/pay', ...);
});
```

#### 5. Proteksi di `GoogleAuthController`

User login via Google otomatis dianggap **verified** (karena Google sudah verifikasi emailnya):

```php
// Saat create user baru via Google OAuth, set email_verified_at
$user = User::create([
    'name'              => $googleUser->getName(),
    'email'             => $googleUser->getEmail(),
    'google_id'         => $googleUser->getId(),
    'email_verified_at' => now(), // ✅ Otomatis verified
    'password'          => Hash::make(Str::random(24)),
]);
```

---

### Komponen Frontend yang Dibutuhkan

#### 1. Banner di `Profile/Show.jsx` (jika belum verified)

```jsx
{
    !user.email_verified_at && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-black text-yellow-800">
                    Email belum terverifikasi
                </p>
                <p className="text-xs text-yellow-600">
                    Verifikasi email untuk bisa melakukan transaksi.
                </p>
            </div>
            <button
                onClick={handleResend}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-xs font-black hover:bg-yellow-600 transition-colors"
            >
                Kirim Ulang
            </button>
        </div>
    );
}
```

#### 2. Halaman Notice `VerificationNotice.jsx`

Ditampilkan saat user belum verified mencoba akses route transaksi:

- Pesan "Cek email Anda untuk link verifikasi"
- Tombol "Kirim Ulang Email"
- Link ke profil

---

### Konfigurasi Email

Pastikan `.env` sudah set:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=app_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@srbmotors.com
MAIL_FROM_NAME="SRB Motors"
```

---

### Urutan Implementasi

| #   | Task                                                           | File                                  |
| --- | -------------------------------------------------------------- | ------------------------------------- |
| 1   | `User` implement `MustVerifyEmail`                             | `app/Models/User.php`                 |
| 2   | Tambah routes verifikasi                                       | `routes/web.php`                      |
| 3   | Buat `EmailVerificationController`                             | `app/Http/Controllers/Auth/`          |
| 4   | Buat `EmailVerificationNotificationController`                 | `app/Http/Controllers/Auth/`          |
| 5   | Proteksi route transaksi dengan `verified` middleware          | `routes/web.php`                      |
| 6   | Google OAuth: set `email_verified_at = now()` saat create user | `GoogleAuthController.php`            |
| 7   | Banner peringatan di `Profile/Show.jsx`                        | `resources/js/Pages/Profile/Show.jsx` |
| 8   | Buat halaman `VerificationNotice.jsx`                          | `resources/js/Pages/Auth/`            |
| 9   | Test flow lengkap (register → verify → order)                  | —                                     |

---

**Prepared by**: Copilot  
**Date**: March 8, 2026  
**Next Step**: Fix order flow critical bugs (installment generation + bunga kredit + stok motor check)

---

## 🛒 ANALISIS & IMPROVEMENT ORDER FLOW

**Tanggal Analisis**: March 8, 2026  
**Scope**: User pesan → isi form → upload dokumen (kredit) → admin proses → cicilan → selesai

---

### Flow Diagram Aktual

```
=== CASH ORDER ===
User → /motors/{id}/cash-order (form)
     → POST process-cash-order
     → Transaction CASH created + Installment #0 (booking fee) + #1 (pelunasan)
     → WA notif ke user & admin
     → Redirect ke /order-confirmation/{id}
     → User bayar via Midtrans Snap
     → Webhook callback → Installment status=paid
     → Semua lunas → Transaction status=payment_confirmed
     → Admin update status: unit_preparation → ready_for_delivery → completed

=== CREDIT ORDER ===
User → /motors/{id}/credit-order (form: nama, DP, tenor)
     → POST process-credit-order
     → Transaction CREDIT created + CreditDetail created
     → WA notif ke user & admin
     → Redirect ke /upload-credit-documents (wajib KTP, KK, Slip Gaji)
     → POST upload → Documents saved → status=menunggu_persetujuan
     → Redirect ke /order-confirmation/{id}

Admin → Dashboard → Review dokumen
      → Admin update credit_status: menunggu_persetujuan
                                   → data_tidak_valid (user harus revisi)
                                   → dikirim_ke_surveyor
                                   → jadwal_survey
                                   → disetujui ← ← ← MASALAH: cicilan tidak generate!
                                   → ditolak → Transaction cancelled

User → /installments → bayar DP + cicilan bulanan via Midtrans
     → Webhook → status=paid → jika semua lunas → completed
```

---

### 🔴 Bug Kritis Yang Ditemukan

#### BUG #1 — Installment tidak ter-generate saat kredit disetujui

**File**: `app/Http/Controllers/TransactionController.php` — `updateCredit()`

```php
// KONDISI SAAT INI:
public function updateCredit(Request $request, Transaction $transaction)
{
    $transaction->creditDetail->update([
        'credit_status' => $request->credit_status, // disetujui
    ]);
    $this->syncTransactionStatusFromCredit($transaction, $request->credit_status);
    // ❌ generateInstallments() TIDAK dipanggil!
    // ❌ User tidak pernah bisa bayar cicilan setelah disetujui
}
```

**Dampak**: Kredit disetujui admin → halaman cicilan user kosong → tidak bisa bayar sama sekali.

**Fix**:

```php
// Di updateCredit(), setelah update credit_status:
if ($request->credit_status === 'disetujui' && $transaction->creditDetail) {
    $creditData = $transaction->creditDetail->toArray();
    $this->transactionService->generateInstallmentsIfNeeded($transaction, $creditData);
}
```

> `generateInstallments` harus dipindah ke `public` (atau buat method `generateInstallmentsIfNeeded` di TransactionService).

---

#### BUG #2 — Bunga kredit 0% (business logic fatal)

**File**: `app/Http/Controllers/MotorGalleryController.php` — `processCreditOrder()`

```php
// KONDISI SAAT INI:
$loanAmount = $motor->price - $request->down_payment;
$monthlyInstallment = $loanAmount / $request->tenor; // ❌ Tidak ada bunga!
```

**Dampak**: Motor Rp 20jt, tenor 24 bulan → cicilan cuma Rp 833rb. Dealer rugi.

**Fix** — Gunakan flat rate:

```php
// Flat rate 1.5% per bulan (adjust sesuai kebijakan)
$interestRatePerMonth = 0.015; // bisa dari config atau FinancingScheme
$loanAmount = $motor->price - $request->down_payment;
$totalInterest = $loanAmount * $interestRatePerMonth * $request->tenor;
$totalPayment = $loanAmount + $totalInterest;
$monthlyInstallment = $totalPayment / $request->tenor;

// Simpan interest_rate ke CreditDetail
CreditDetail::create([
    ...
    'interest_rate' => $interestRatePerMonth * 100, // simpan sebagai persen
    'monthly_installment' => $monthlyInstallment,
]);
```

> Perlu tambah kolom `interest_rate` ke tabel `credit_details`.

---

#### BUG #3 — Tidak ada pengecekan stok/status motor saat order

**File**: `app/Http/Controllers/MotorGalleryController.php`

```php
// KONDISI SAAT INI — tidak ada cek status:
public function processCashOrder(Request $request, Motor $motor)
{
    // ❌ tidak ada: if ($motor->status !== 'tersedia') return error
    Transaction::create([...]);
}
```

**Dampak**: Motor yang sudah terjual atau dinonaktifkan masih bisa di-order.

**Fix**:

```php
// Tambah di awal processCashOrder dan processCreditOrder:
if (!$motor->is_active || $motor->status === 'terjual') {
    return back()->withErrors(['motor' => 'Maaf, unit ini sudah tidak tersedia.'])->withInput();
}

// Opsional: cegah order duplikasi
$existingOrder = Transaction::where('user_id', Auth::id())
    ->where('motor_id', $motor->id)
    ->whereNotIn('status', ['cancelled', 'ditolak'])
    ->exists();
if ($existingOrder) {
    return back()->withErrors(['motor' => 'Anda sudah memiliki pesanan aktif untuk unit ini.'])->withInput();
}
```

---

### 🟠 Masalah Sedang

#### ISSUE #4 — WA admin tidak terkirim saat dokumen diupload

**File**: `app/Http/Controllers/MotorGalleryController.php` — `uploadCreditDocuments()`

Setelah dokumen berhasil disimpan dan status di-update ke `menunggu_persetujuan`, tidak ada notifikasi ke admin. Admin tidak tahu ada dokumen baru yang menunggu review.

**Fix**: Tambahkan WA notifikasi di akhir `uploadCreditDocuments()`:

```php
try {
    $adminPhone = config('services.fonnte.admin_phone');
    if ($adminPhone) {
        $msg = "*[ADMIN] Dokumen Kredit Baru*\n\nPelanggan: {$transaction->customer_name}\nUnit: {$transaction->motor->name}\nOrder ID: #{$transaction->id}\n\nDokumen telah diunggah. Segera review di dashboard.";
        \App\Services\WhatsAppService::sendMessage($adminPhone, $msg);
    }
} catch (\Exception $e) {
    \Log::error('WA Notification Error: ' . $e->getMessage());
}
```

---

#### ISSUE #5 — Status inconsistency (snake_case vs UPPERCASE)

Dua format status berjalan di sistem yang sama:

- `menunggu_persetujuan`, `data_tidak_valid`, `dikirim_ke_surveyor` (snake_case)
- `PENDING_REVIEW`, `DATA_INVALID`, `SUBMITTED_TO_SURVEYOR` (UPPERCASE)

**Dampak**: Filter admin by status bisa miss data, statusMap di Transaction model perlu duplicate entry.

**Fix**: Standardisasi ke satu format. Rekomendasi: **snake_case** (sudah mayoritas dipakai).
Jalankan migration untuk update data lama yang memakai format UPPERCASE.

---

#### ISSUE #6 — Tidak ada minimum DP dan batas tenor

```php
// KONDISI SAAT INI:
'down_payment' => 'required|numeric|min:0',     // ❌ DP bisa Rp 1
'tenor' => 'required|integer|min:1',             // ❌ Tenor bisa 999 bulan
```

**Fix**:

```php
'down_payment' => [
    'required', 'numeric',
    Rule::when(true, ["min:" . ($motor->price * 0.20)], []), // Min 20% OTR
],
'tenor' => 'required|integer|min:6|max:60', // 6 bulan - 5 tahun
```

---

#### ISSUE #7 — Race condition pada generate installment

```php
// KONDISI SAAT INI (TransactionService):
if ($transaction->installments()->count() === 0) { // ❌ Not atomic
    Installment::create([...]);
}
```

Dua request bersamaan bisa lolos cek dan memasukkan duplikat installment.

**Fix**: Gunakan database transaction + pessimistic locking:

```php
DB::transaction(function() use ($transaction, $creditData) {
    $locked = $transaction->fresh(['installments']); // fresh query
    if ($locked->installments()->count() === 0) {
        // create installments inside transaction
    }
});
```

---

### 🟡 Fitur Yang Kurang

#### MISSING #8 — Leasing provider tidak terhubung ke form kredit

Model `LeasingProvider` dan `FinancingScheme` sudah ada di database tapi tidak dipakai di `CreditOrderForm`. Akibatnya:

- User tidak bisa pilih leasing (FIF, Adira, WOM, dll)
- Admin tidak tahu mau submit ke leasing mana
- FinancingScheme (bunga, tenor) tidak dipakai sama sekali

**Fix**: Tambahkan field `leasing_provider_id` dan `financing_scheme_id` di form kredit, dan gunakan bunga dari `FinancingScheme` untuk menghitung cicilan.

---

#### MISSING #9 — Tidak ada field tanggal survey

Status `jadwal_survey` sudah ada tapi tidak ada field untuk menyimpan tanggal/waktu/lokasi survey. Admin tidak bisa record jadwal survey aktual.

**Fix**: Tambah kolom `survey_date`, `survey_time`, `survey_address` ke tabel `credit_details`.

---

#### MISSING #10 — Tidak ada reminder cicilan jatuh tempo

Tidak ada scheduled job untuk kirim WA/email H-3 atau H-1 sebelum due date cicilan.

**Fix**: Buat Artisan Command + Laravel Scheduler:

```php
// app/Console/Commands/SendInstallmentReminders.php
$upcoming = Installment::where('status', 'pending')
    ->whereIn('due_date', [now()->addDays(3)->toDateString(), now()->addDays(1)->toDateString()])
    ->with('transaction.motor')
    ->get();

foreach ($upcoming as $installment) {
    WhatsAppService::sendMessage($installment->transaction->customer_phone, $message);
}

// app/Console/Kernel.php (atau routes/console.php di Laravel 12)
Schedule::command('installments:send-reminders')->dailyAt('08:00');
```

---

#### MISSING #11 — Review status per dokumen

Admin hanya bisa lihat seluruh aplikasi kredit tapi tidak bisa mark per dokumen: `KTP = valid`, `KK = perlu diupload ulang`. Saat status `data_tidak_valid`, user tidak tahu dokumen mana yang bermasalah.

**Fix**: Tambah kolom `status` (`pending|valid|invalid`) dan `admin_notes` ke tabel `documents`. Tambah UI di admin untuk per-dokumen review.

---

#### MISSING #12 — User tidak bisa cancel order sendiri

Hanya admin yang bisa ubah status ke `cancelled`. User tidak punya tombol cancel pesanan selama masih dalam status `new_order` atau `menunggu_persetujuan`.

**Fix**: Tambahkan route + controller action:

```php
Route::post('/transactions/{transaction}/cancel', [UserTransactionController::class, 'cancel'])
    ->middleware('auth')
    ->name('transactions.user-cancel');

// Hanya boleh cancel jika status masih new_order atau menunggu_persetujuan
// dan belum ada pembayaran yang dilakukan
```

---

#### MISSING #13 — Path upload dokumen tidak konsisten

- User upload → `credit-documents/{transaction_id}/filename`
- Admin upload → `documents/filename`

**Fix**: Standardisasi ke satu format, misalnya `documents/transactions/{transaction_id}/{doc_type}/filename`.

---

### Urutan Prioritas Fix Order Flow

| #   | Item                                       | Status | Prioritas   |
| --- | ------------------------------------------ | ------ | ----------- |
| 1   | Generate installment saat kredit disetujui | ❌ Bug | 🔴 Critical |

| 2 | Bunga kredit (flat rate atau dari FinancingScheme) | ❌ Bug | 🔴 Critical |
| 3 | Cek stok/status motor saat order | ❌ Bug | 🔴 Critical |
| 4 | WA notifikasi admin saat dokumen diupload | ❌ Missing | 🟠 Tinggi |
| 5 | Minimum DP 20% + batas tenor max 60 bulan | ❌ Missing | 🟠 Tinggi |
| 6 | Status inconsistency (snake_case standardization) | ❌ Bug | 🟠 Tinggi |
| 7 | Race condition generate installment | ❌ Bug | 🟡 Sedang |
| 8 | Leasing provider di form kredit | ❌ Missing | 🟡 Sedang |
| 9 | Reminder cicilan H-3/H-1 | ❌ Missing | 🟡 Sedang |
| 10 | Review status per dokumen | ❌ Missing | 🟡 Sedang |
| 11 | User cancel order sendiri | ❌ Missing | 🟡 Sedang |
| 12 | Jadwal survey (tanggal/waktu/lokasi) | ❌ Missing | 🟡 Sedang |
| 13 | Standardisasi path dokumen upload | ❌ Bug | 🟢 Rendah |

---

**Prepared by**: Copilot  
**Date**: March 8, 2026  
**Next Step**: Fix order flow critical bugs (installment generation + bunga kredit + stok motor check)
