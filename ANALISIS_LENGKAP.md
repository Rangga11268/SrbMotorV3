# SRB MOTORS - ANALISIS LENGKAP A-Z

## 📋 OVERVIEW APLIKASI
**Nama**: SRB Motors - Platform Manajemen Penjualan Motor  
**Tipe**: Web Application e-commerce  
**Framework**: Laravel 12 + React (Inertia.js)  
**Database**: MySQL 8.0+  
**PHP Version**: 8.2+  

---

## 🏗️ STRUKTUR ARSITEKTUR

### BACKEND STACK
- **Framework**: Laravel 12 (PHP Framework)
- **ORM**: Eloquent (Built-in Laravel)
- **Database**: MySQL
- **API Gateway**: Midtrans (Payment Gateway)
- **WhatsApp Gateway**: Fonnte API
- **Email**: Laravel Mail
- **File Storage**: Local Storage + Public Disk

### FRONTEND STACK
- **Framework**: React 19.2.1
- **Router**: Inertia.js 2.0 (Server-side routing)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom React Components
- **Charts**: Recharts 3.5.1
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Print**: React to Print
- **Carousel**: Swiper

---

## 💾 DATABASE SCHEMA

### Core Tables

#### 1. **users** (Autentikasi)
```
- id (Primary Key)
- name (varchar)
- email (varchar, unique)
- password (hashed)
- role (admin | user)
- timestamps
```

#### 2. **motors** (Inventaris Motor)
```
- id (PK)
- name (nama unit)
- brand (Honda/Yamaha)
- model (string)
- price (decimal 10,2)
- year (tahun produksi)
- type (Metin/Automatic/Sport)
- image_path (path gambar)
- details (deskripsi)
- tersedia (boolean - ketersediaan)
- timestamps
```

#### 3. **motor_specifications** (Spek Detail Motor)
```
- id (PK)
- motor_id (FK → motors)
- spec_key (engine_type, engine_size, dll)
- spec_value (value)
- timestamps
```

#### 4. **transactions** (Transaksi Pembelian)
```
- id (PK)
- user_id (FK → users)
- motor_id (FK → motors)
- transaction_type (CASH | CREDIT)
- status (new_order, waiting_payment, payment_confirmed, dll)
- customer_name (nama pembeli)
- customer_phone (nomor HP)
- customer_occupation (pekerjaan)
- booking_fee (deposit booking)
- total_amount (harga total)
- payment_method (tunai/online)
- payment_status (pending/confirmed/failed)
- notes (catatan)
- timestamps
```

#### 5. **credit_details** (Detail Kredit/Cicilan)
```
- id (PK)
- transaction_id (FK → transactions)
- down_payment (DP cicilan)
- tenor (jumlah bulan cicilan)
- monthly_installment (cicilan per bulan)
- approved_amount (jumlah disetujui bank)
- credit_status (menunggu_persetujuan, disetujui, ditolak)
- timestamps
```

#### 6. **documents** (File Dokumen Kredit)
```
- id (PK)
- credit_detail_id (FK → credit_details)
- document_type (KTP, KK, SLIP_GAJI)
- file_path (path file storage)
- original_name (nama file asli)
- timestamps
```

#### 7. **installments** (Cicilan Per Bulan)
```
- id (PK)
- transaction_id (FK → transactions)
- installment_number (0=DP, 1-12=cicilan)
- amount (jumlah pembayaran)
- penalty_amount (denda keterlambatan)
- due_date (tanggal jatuh tempo)
- status (pending, waiting_approval, paid, overdue)
- paid_at (waktu pembayaran)
- payment_method (tunai/midtrans)
- payment_proof (bukti pembayaran)
- snap_token (token payment gateway Midtrans)
- midtrans_booking_code (kode booking Midtrans)
- notes
- timestamps
```

#### 8. **contact_messages** (Pesan dari Customer)
```
- id (PK)
- name (nama pengirim)
- email (email pengirim)
- phone (no HP)
- message (isi pesan)
- status (baru/dibaca)
- timestamps
```

#### User-related Tables
- **notifications** - Notifikasi in-app
- **sessions** - Session management
- **password_reset_tokens** - Reset password
- **personal_access_tokens** - API tokens (Sanctum)

---

## 🔄 FLOW BISNIS

### CASH TRANSACTION FLOW
1. Customer browse motors di halaman katalog
2. Klik "Pesan Sekarang" → Form order tunai
3. Isi: nama, HP, pekerjaan, booking fee (opsional)
4. Create Transaction (status: new_order)
5. **Jika ada booking fee**: Create Installment #0 (DP)
6. **Cicilan sisa**: Create Installment #1 (sisa harga)
7. WhatsApp notifikasi ke customer & admin
8. Customer bayar → status berubah menjadi payment_confirmed
9. Admin: unit_preparation → ready_for_delivery → completed

### CREDIT TRANSACTION FLOW
1. Customer klik "Pesan Cicilan" → Form kredit
2. Isi: tenor, rencana DP, nama lengkap, no HP, pekerjaan
3. Create Transaction (status: menunggu_persetujuan)
4. Create CreditDetail (credit_status: menunggu_persetujuan)
5. Customer upload dokumen: KTP, KK, SLIP_GAJI
6. **Admin**: Review dokumen
   - Jika valid: credit_status = dikirim_ke_surveyor
   - Jika tidak: credit_status = data_tidak_valid
7. **Surveyor**: Inspeksi lokasi
8. **Admin**: Approve/Reject
   - **Jika Approved**: 
     - Generate installments otomatis (DP + cicilan bulanan)
     - transaction status = disetujui
   - **Jika Rejected**: credit_status = ditolak
9. Customer bayar cicilan sesuai jadwal

---

## 📂 FOLDER STRUCTURE & FILE ORGANIZATION

### `/app/Models` - Data Models
- **Motor.php** - Model motor dengan relation ke specifications
- **MotorSpecification.php** - Spesifikasi motor
- **User.php** - User dengan method isAdmin()
- **Transaction.php** - Transaksi dengan relation ke user, motor, credit detail, installments
- **CreditDetail.php** - Detail kredit dengan hasRequiredDocuments()
- **Document.php** - File dokumen
- **Installment.php** - Cicilan dengan relation ke transaction
- **ContactMessage.php** - Pesan kontak

### `/app/Http/Controllers` - Business Logic

**Customer Controllers:**
- **HomeController** - Dashboard home
- **MotorGalleryController** - Katalog motor, compare, order flow
- **ProfileController** - Profile user
- **InstallmentController** - List cicilan, bayar online (Midtrans)
- **AuthController** - Login/Register
- **ContactController** - Form kontak
- **PageController** - Halaman statis (about)

**Admin Controllers:**
- **AdminController** - Dashboard admin (stats & analytics)
- **MotorController** - CRUD motor + spesifikasi
- **UserController** - Kelola user (edit/delete)
- **TransactionController** - CRUD transaksi, lihat detail, ubah status, upload dokumen
- **ContactMessageController** - Baca pesan kontak
- **ReportController** - Generate laporan (sales, income, customer, status)
- **InvoiceController** - Generate invoice PDF (Midtrans)
- **AdminProfileController** - Profile admin
- **PaymentCallbackController** - Webhook Midtrans callback

### `/app/Services` - Business Logic Layer
- **TransactionService** - Logika create/update/delete transaksi, handle credit detail, generate installments
- **WhatsAppService** - Integrasi Fonnte API untuk notifikasi WA

### `/app/Repositories` - Data Access Layer
- **MotorRepository** - Query motor dengan caching (1 jam)
- **MotorRepositoryInterface** - Interface contract

### `/app/Observers` - Event Listeners
- **TransactionObserver** - Trigger notifikasi saat transaksi dibuat/diupdate
- **CreditDetailObserver** - Observasi perubahan credit detail

### `/app/Helpers`
- **StatusHelper.php** - Helper functions untuk mapping status ke teks Indonesia

### `/app/Mail`
- **CreditStatusUpdated.php** - Template email status kredit

### `/app/Notifications`
- **TransactionCreated.php** - Notifikasi transaksi baru
- **TransactionStatusChanged.php** - Notifikasi perubahan status

### `/app/Exports`
- **ReportExport.php** - Export laporan ke Excel

### `/app/Http/Middleware`
- **AdminMiddleware** - Check role admin
- **HandleInertiaRequests** - Share data ke React
- **RedirectIfAuthenticated** - Redirect jika sudah login

### `/app/Http/Requests`
- **StoreTransactionRequest** - Validasi order
- **UpdateTransactionRequest** - Validasi update transaksi

### `/routes`
- **web.php** - Semua route web (public + admin)
- **api.php** - Webhook Midtrans callback
- **console.php** - Artisan commands

### `/resources/js` - React Frontend
```
/Pages - Halaman React
  - Home.jsx
  - Motors/
    - Index.jsx (katalog)
    - Show.jsx (detail motor)
    - Compare.jsx (banding motor)
    - CashOrderForm.jsx (form pesan tunai)
    - CreditOrderForm.jsx (form pesan kredit)
  - Auth/
    - Login.jsx
    - Register.jsx
  - Admin/
    - Dashboard.jsx
    - Motors/ (CRUD motor)
    - Transactions/ (CRUD transaksi)
    - Users/ (Kelola user)
    - Reports/ (Laporan)

/Components - Reusable Components
/Layouts - Layout wrappers
/Contexts - React Contexts
```

### `/resources/views`
- **Blade templates** untuk email, PDF, non-Inertia pages
- **emails/** - Template email Markdown
- **installments/** - Template kuitansi cicilan
- **layouts/** - Layout Blade

### `/database`
**migrations/** - Schema definition
- create_users, create_motors, create_motor_specifications
- create_transactions, create_credit_details, create_documents
- create_installments (dengan snap_token, midtrans_booking_code)
- add_customer_info_to_transactions
- add_penalty_amount_to_installments

**seeders/** - Sample data
- MotorFactory, UserFactory

### `/config`
- **app.php** - Config app (timezone: Asia/Jakarta)
- **database.php** - DB config
- **filesystems.php** - Storage config
- **mail.php** - Email config
- **midtrans.php** - Midtrans payment gateway config
- **cache.php** - Cache driver
- **queue.php** - Queue driver
- **session.php** - Session config

### `/storage`
- **app/** - File uploads (documents, motor images)
- **logs/** - Application logs
- **framework/** - Cache files

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Auth Model
- **Users Table**: name, email, password, role
- **Roles**: 
  - `admin` - Akses full dashboard admin
  - `user` - Hanya lihat pesanan sendiri

### Middleware Stack
- `auth` - Login required
- `guest` - Harus belum login (login/register page)
- `admin` - Login + role = admin

### Session & Sanctum
- Laravel Sessions (untuk web)
- Sanctum Tokens (jika ada mobile app)

---

## 🌐 ROUTING STRUCTURE

### Public Routes
```
GET  /                          HomeController - Halaman utama
GET  /motors                    MotorGalleryController - Katalog
GET  /motors/{motor}            MotorGalleryController - Detail motor
GET  /motors/compare            MotorGalleryController - Banding motor
GET  /about                     PageController - About us
POST /contact                   ContactController - Kirim pesan kontak
GET  /login                     AuthController - Form login
POST /login                     AuthController - Process login
GET  /register                  AuthController - Form register
POST /register                  AuthController - Process register
```

### Authenticated User Routes
```
POST /logout                    AuthController
GET  /profile                   ProfileController - Lihat profile
PUT  /profile                   ProfileController - Update profile
PUT  /profile/password          ProfileController - Update password

GET  /motors/{motor}/cash-order           - Form order tunai
POST /motors/{motor}/process-cash-order   - Process order tunai
GET  /motors/{motor}/credit-order         - Form order kredit
POST /motors/{motor}/process-credit-order - Process order kredit
GET  /motors/{transaction}/order-confirmation - Konfirmasi order
GET  /motors/{transaction}/upload-credit-documents - Upload dokumen kredit
POST /motors/{transaction}/upload-credit-documents - Process upload
GET  /motors/{transaction}/manage-documents - Kelola dokumen
POST /motors/{transaction}/update-documents - Update dokumen

GET  /motors/my-transactions    - List pesanan saya
GET  /installments              - List cicilan
POST /installments/{id}/pay     - Bayar cicilan offline
POST /installments/{id}/pay-online - Create Midtrans payment
POST /installments/{id}/check-status - Check status pembayaran
GET  /installments/{id}/receipt - Download kuitansi
```

### Admin Routes (prefix: /admin, middleware: admin)
```
GET  /admin                     AdminController - Dashboard
GET  /admin/motors              MotorController - List motor
GET  /admin/motors/create       MotorController - Form tambah motor
POST /admin/motors              MotorController - Store motor
GET  /admin/motors/{id}/edit    MotorController - Form edit
PUT  /admin/motors/{id}         MotorController - Update motor
DELETE /admin/motors/{id}       MotorController - Delete motor

GET  /admin/transactions        TransactionController - List semua transaksi
GET  /admin/transactions/create - Form tambah transaksi manual
POST /admin/transactions        - Store transaksi
GET  /admin/transactions/{id}   - Detail transaksi
GET  /admin/transactions/{id}/edit - Edit transaksi
POST /admin/transactions/{id}   - Update transaksi
DELETE /admin/transactions/{id} - Delete transaksi
POST /admin/transactions/{id}/status - Update status
GET  /admin/transactions/{id}/edit-credit - Edit detail kredit
PUT  /admin/transactions/{id}/update-credit - Update kredit
POST /admin/transactions/{id}/upload-document - Upload dokumen
DELETE /admin/documents/{id}    - Hapus dokumen

POST /admin/installments/{id}/approve - Approve cicilan
POST /admin/installments/{id}/reject  - Reject cicilan

GET  /admin/transactions/{id}/invoice/preview - Preview invoice
GET  /admin/transactions/{id}/invoice/download - Download invoice PDF

GET  /admin/reports             - Halaman laporan
GET  /admin/reports/create      - Form buat laporan
GET  /admin/reports/generate    - Generate laporan
GET  /admin/reports/export      - Export PDF
GET  /admin/reports/export-excel - Export Excel

GET  /admin/users               UserController - List user
GET  /admin/users/{id}/edit     - Edit user
PUT  /admin/users/{id}          - Update user
DELETE /admin/users/{id}        - Delete user

GET  /admin/contact             ContactMessageController - List pesan
GET  /admin/contact/{id}        - Detail pesan
DELETE /admin/contact/{id}      - Hapus pesan

GET  /admin/profile             AdminProfileController - Profile admin
PUT  /admin/profile             - Update profile
PUT  /admin/profile/password    - Update password
```

### API Routes
```
POST /api/midtrans/notification - Webhook callback Midtrans
```

---

## 🛠️ KEY FEATURES & IMPLEMENTATION

### 1. Motor Catalog & Gallery
- **List dengan pagination**: 12 per halaman
- **Filter**: search, brand, type, year, price range
- **Comparison**: Select multiple motors untuk banding
- **Caching**: 1 jam (Redis/File cache)
- **Images**: Public disk storage

### 2. Transaction Management
- **2 Tipe**: CASH (tunai) & CREDIT (cicilan)
- **Status Tracking**: 12 status berbeda untuk cash, 8 untuk credit
- **Document Upload**: KTP, KK, SLIP_GAJI
- **Installment Management**: Auto-generate cicilan saat approve kredit

### 3. Payment Integration
- **Payment Gateway**: Midtrans (Snap)
- **Payment Methods**: 
  - Kartu kredit
  - Bank transfer (VA)
  - E-wallet (GoPay, OVO, Dana)
  - Retail (Indomaret, Alfamart)
- **Automatic Status**: Update installment status saat payment settle
- **Webhook**: Callback dari Midtrans

### 4. Notification System
- **WhatsApp**: Fonnte API (pesan ke customer & admin)
- **Email**: Laravel Mail (status updates)
- **In-app**: Notification database

### 5. Reports & Analytics
- **Dashboard Stats**:
  - Total motors, transactions, users, kontak
  - Breakdown: cash vs credit
  - Recent transactions & motors
  - Monthly sales/revenue chart
  - Status distribution pie chart
- **Report Types**:
  - Sales Report (transaksi per brand/type)
  - Income Report (revenue)
  - Customer Report (by status)
  - Status Report (breakdown transaksi)
- **Export**: PDF (DomPDF) & Excel (Maatwebsite)

### 6. Invoice & Receipt
- **Invoice PDF**: Generated dengan detail transaksi
- **Receipt**: Kuitansi cicilan tercetak

---

## 🔌 EXTERNAL INTEGRATIONS

### 1. Midtrans Payment Gateway
**Config File**: `/config/midtrans.php`
**Usage**:
- Pembayaran booking fee (Snap modal)
- Pembayaran cicilan penuh
- Status tracking via webhook
- Support multiple payment methods

**Implementation**:
```php
// InstallmentController
Config::$serverKey = config('midtrans.server_key');
Snap::getPaymentUrl() → snap_token
→ Frontend trigerkan Snap.pay(token)
→ Payment success → POST /api/midtrans/notification
→ PaymentCallbackController handle
→ Update installment status
```

### 2. Fonnte WhatsApp API
**Config**: `/config/services.fonnte.token`, `fonnte.admin_phone`
**Usage**: 
- Notifikasi order baru
- Status update
- Bukti pembayaran

```php
// WhatsAppService::sendMessage($phone, $message)
// Auto-triggered via processOrder(), updateStatus()
```

### 3. Laravel Mail
**Config**: MAIL_MAILER, MAIL_HOST, MAIL_PORT, dll
**Usage**: Email notifikasi status kredit
**Template**: `resources/views/emails/`

---

## 📊 CACHING STRATEGY

### MotorRepository Caching
- **Key**: `motors:all:withSpecs:10`
- **TTL**: 1 jam (3600 detik)
- **Clear on**: Motor create/update/delete

### Cache Clear
- Manual via admin panel edit motor
- atau: `php artisan cache:clear`

---

## 🔍 KEY BUSINESS LOGIC

### 1. Auto Installment Generation
**File**: `TransactionService::generateInstallments()`
```
Jika kredit disetujui:
1. Buat Installment #0 = Down Payment (due date: hari ini)
2. Buat Installment #1-[tenor] = monthly_installment
   - Due date: +1 bulan, +2 bulan, dst
   - Status: pending
```

### 2. Credit Status Workflow
```
new_order
  ↓
menunggu_persetujuan (tunggu dokumen lengkap)
  ↓
[IF dokumen invalid] → data_tidak_valid
[IF dokumen valid] → dikirim_ke_surveyor
  ↓
jadwal_survey (surveyor scheduling)
  ↓
[IF survey ok] → disetujui (generate installments)
[IF survey bad] → ditolak
  ↓
disetujui → installments created & aktif
```

### 3. Payment Status Auto-Update
```
Customer bayar cicilan via Midtrans
  ↓
Midtrans charge (settlement)
  ↓
Webhook POST /api/midtrans/notification
  ↓
PaymentCallbackController::handle()
  ↓
Update installment status = paid
  ↓
Jika semua cicilan paid → update transaction status
```

---

## 📝 VALIDATION & ERROR HANDLING

### Request Validation
- **Requests/**: StoreTransactionRequest, UpdateTransactionRequest
- **Rules**: Validasi input form order, update profile, dll
- **Error Messages**: Bahasa Indonesia

### Error Handling
- **Logging**: `Illuminate\Support\Facades\Log`
- **Try-catch**: pada integrasi eksternal (WA, Midtrans)
- **Custom exceptions**: Sesuai kebutuhan

---

## 🎨 FRONTEND ARCHITECTURE

### Inertia.js Integration
- **Server-side routing**: Routes di `web.php`
- **Props sharing**: Via HandleInertiaRequests middleware
- **Components**: React JSX di `resources/js/`

### React Components Pattern
- Functional components (hooks)
- Props drilling untuk state
- Context API untuk global state (jika ada)

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Di `/resources/css/`
- **Responsive**: Mobile-first design

---

## 🧪 TESTING

### Test Files
- `/tests/Feature/` - Feature tests
- `/tests/Unit/` - Unit tests
- **Tool**: PHPUnit 11.5.3

### Running Tests
```bash
php artisan test
# atau composer test
```

---

## 📦 DEPENDENCIES SUMMARY

### PHP Libraries
- **barryvdh/laravel-dompdf**: PDF generation
- **maatwebsite/excel**: Excel export
- **midtrans/midtrans-php**: Payment gateway
- **laravel/sanctum**: API authentication
- **inertiajs/inertia-laravel**: React integration

### NPM Libraries
- **@inertiajs/react**: Client adapter
- **react**, **react-dom**: UI library
- **@tailwindcss/vite**: CSS compiler
- **axios**: HTTP client
- **recharts**: Charts
- **sweetalert2**: Modal popup
- **swiper**: Carousel
- **react-hot-toast**: Toast notifications

---

## 🚀 SETUP & DEPLOYMENT

### Development Setup
```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate
php artisan db:seed

# Build assets
npm run dev
php artisan serve
```

### Running Development Server
```bash
# Option 1: Use composer script
composer run dev

# Option 2: Manual (4 processes)
php artisan serve                    # Backend
php artisan queue:listen --tries=1   # Queue jobs
php artisan pail --timeout=0         # Log viewer
npm run dev                          # Frontend build
```

### Deployment Checklist
1. ✅ Environment variables (`.env` untuk production)
2. ✅ Database migrations (`php artisan migrate`)
3. ✅ Storage link (`php artisan storage:link`)
4. ✅ Cache clear (`php artisan cache:clear`)
5. ✅ Assets build (`npm run build`)
6. ✅ Config cache (`php artisan config:cache`)
7. ✅ .htaccess untuk routing
8. ✅ Midtrans keys configured
9. ✅ Fonnte WhatsApp token set
10. ✅ Mail config ready

---

## 💡 KEY INSIGHTS

### Architecture Pattern
- **MVC + Service Layer**: Controllers delegasi ke Services
- **Repository Pattern**: Data access via Repository (dengan caching)
- **Observer Pattern**: Auto notifikasi via Observers
- **Event-driven**: Notifications via Observers

### Data Flow
```
User Request → Route → Controller → Service → Model → Repository
       ↓                                             ↓
  Validation                                      Cache
       ↓
    View (React)
```

### Performance Optimization
- Repository caching (1 jam)
- Motor dengan specifications eager loading
- Pagination untuk list besar
- Index pada foreign keys & frequently queried columns
- Async notifications (queue-able)

---

## 🎯 BUSINESS LOGIC SUMMARY

1. **Motor Inventory**: CRUD dengan spesifikasi terperinci
2. **Cash Sale**: Order → Booking fee (opsional) → Remaining payment → Completed
3. **Credit Sale**: Order → Document upload → Verification → Approval → Auto installments → Payment tracking
4. **Payment**: Midtrans integration with webhook callback → Auto status update
5. **Reporting**: Analytics dashboard + exportable reports
6. **Notification**: WhatsApp + Email + In-app untuk key events

---

## 🔧 COMMON TASKS

### Add New Motor Type
1. Edit validation di MotorController (`type` enum)
2. UI sudah dinamis di katalog

### Add New Status
1. Update enum di `transactions` migration
2. Add mapping di StatusHelper
3. Add logic di TransactionService

### Custom Report
1. Add case di ReportController::generate()
2. Implement generateXxxReport() method
3. Create Report component

### Email Template
Create markdown file di `resources/views/emails/`

---

## 📱 FUTURE ENHANCEMENTS

Berdasarkan struktur saat ini, mudah untuk:
- Mobile app (gunakan Sanctum API)
- SMS notifications (ganti/tambah Fonnte)
- Inventory tracking (tambah stock column)
- Multiple branches (tambah branch_id)
- Advanced analytics (chart library sudah ada)
- Review/rating system (model baru + relation)

---

## 📋 TECH STACK SUMMARY

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Laravel | 12.0 |
| **PHP** | PHP | 8.2+ |
| **Frontend** | React | 19.2.1 |
| **Router** | Inertia.js | 2.0 |
| **Styling** | Tailwind CSS | 4.0 |
| **Database** | MySQL | 8.0+ |
| **Payment** | Midtrans | Latest |
| **WhatsApp** | Fonnte API | Latest |
| **PDF** | DomPDF | 3.1 |
| **Excel** | Maatwebsite | 3.1 |
| **Testing** | PHPUnit | 11.5.3 |

---

## 📞 SUPPORT & MAINTENANCE

### Common Issues & Solutions

**Issue**: Cache not clearing
```bash
php artisan cache:clear
php artisan config:clear
```

**Issue**: Assets not loading
```bash
npm run build
php artisan storage:link
```

**Issue**: Midtrans payment not working
- Check `MIDTRANS_SERVER_KEY` in `.env`
- Verify webhook URL configured
- Check IP whitelist di Midtrans dashboard

**Issue**: WhatsApp not sending
- Verify `FONNTE_TOKEN` in `.env`
- Check phone number format
- Review Fonnte API logs

---

## 📖 PROJECT STATUS

**Created**: 2025  
**Current Version**: 1.0  
**Last Updated**: March 6, 2026  
**Status**: Active Development  

---

## 🎓 DEVELOPMENT NOTES

### Code Standards
- Follow PSR-12 for PHP code style
- Use conventional commit messages
- Write meaningful variable names
- Comment complex business logic
- Use type hints in functions

### Best Practices
- Always validate user input
- Sanitize database queries
- Use transactions for critical operations
- Log important events
- Handle errors gracefully

### Database Best Practices
- Use foreign keys for relationships
- Index frequently queried columns
- Use soft deletes where appropriate
- Regular backups

---

**Dokumentasi Lengkap SRB Motors | Analisis A-Z**  
*Generated: March 6, 2026*
