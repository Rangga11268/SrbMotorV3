# ANALISIS KOMPREHENSIF & IMPROVEMENT PLAN - SRB MOTORS V2

**Last Updated**: March 6, 2026  
**Version**: 2.0 - Redesign & Security Hardening

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
**Problem**:
```php
// routes/web.php
Route::get('/motors/{motor}/cash-order', [MotorGalleryController::class, 'showCashOrderForm']); // ❌ Tidak protected
Route::post('/motors/{motor}/process-cash-order', [MotorGalleryController::class, 'processCashOrder']); // ❌

// Tapi controller pakai Auth::id()
public function processCashOrder(Request $request, Motor $motor)
{
    $transaction = Transaction::create([
        'user_id' => Auth::id(),  // ← Bisa NULL jika tidak login!
        ...
    ]);
}
```

**Impact**: User tidak login bisa akses form, bisa buat error pada create transaction (nullable user_id).

**Fix**: Wajib `auth` middleware untuk semua proses order.

#### 2. **SECURITY ISSUE: Webhook Midtrans Tidak Divalidasi**
**Problem**:
```php
// PaymentCallbackController
public function handle(Request $request)
{
    $notification = $request->all(); // ← Raw data tanpa signature check
    // Update installment berdasarkan data Midtrans
}
```

**Impact**: Siapa saja bisa POST ke `/api/midtrans/notification` dengan data fake! (e.g., claim payment sudah paid padahal belum).

**Fix**: Validasi signature key + implement idempotency check.

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

| Fitur | Status | Improvement |
|-------|--------|-------------|
| Katalog motor | ✅ Ada | Filter UI perlu dikerjakan, sticky sidebar |
| Order cash | ✅ Ada | Wizard 2-step + preview biaya |
| Order kredit | ✅ Ada | Wizard 3-step + estimasi approval cepat |
| Upload dokumen | ✅ Ada | Checklist, preview file, drag-drop |
| Bayar cicilan | ✅ Ada | Reminder H-3/H-1, riwayat transparan |
| Admin transaksi | ✅ Ada | Quick actions, bulk approve |
| Admin dokumen | ✅ Ada | Preview, checklist, audit trail |
| Laporan | ✅ Ada | Filter advanced, export konsisten |
| Notifikasi | ⚠️ Parsial | Email bagus, perlu push + real-time |

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
    "client_secret": "GOCSPX-XXXXXXXXXXXX",               // ← Copy ini
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

import { Link } from '@inertiajs/react';

export default function Login() {
    return (
        <div className="space-y-6">
            {/* Email login form */}
            <form>
                {/* ... existing form ... */}
            </form>

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
                href={route('auth.google')}
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
- [ ] Fix route auth protection (all order routes)
- [ ] Implement Midtrans webhook signature validation + idempotency
- [ ] Add rate limiting (login, register, contact, order)
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

| Layer | Current | Recommended | Reason |
|-------|---------|-------------|--------|
| **Backend** | Laravel 12 | ✅ Keep | Solid, no change |
| **Frontend** | React 19 | ✅ Keep | Modern, good UX |
| **Router** | Inertia.js | ✅ Keep | SSR ready, good DX |
| **CSS** | Tailwind 4 | ✅ Keep | Utility-first perfect |
| **Admin UI** | Custom | → **CoreUI** | Professional, scalable |
| **Auth** | Email/Pass | + **Google OAuth** | Trust, ease of use |
| **Payment** | Midtrans | ✅ Keep | Reliable, local support |
| **Notifications** | WhatsApp/Email | ✅ Keep | Working well |
| **Monitoring** | ? | → **Sentry/LogRocket** | Error tracking, user analytics |

---

## 🎯 SUCCESS CRITERIA

- [ ] UI coherent, professional, trusted (simple modern design)
- [ ] All user flows smooth (1-click, no confusion)
- [ ] Admin panel powerful (filter, bulk actions, insights)
- [ ] Real-time status no-reload (Axios polling OR WebSocket)
- [ ] Security hardened (no auth bypass, no webhook fraud)
- [ ] Performance fast (<2s page load, <100ms API response)
- [ ] Google OAuth working (login alternative)
- [ ] UAT passed (0 critical bugs at go-live)

---

**Prepared by**: Copilot  
**Date**: March 6, 2026  
**Next Step**: Review & approve roadmap, then start Phase 1
