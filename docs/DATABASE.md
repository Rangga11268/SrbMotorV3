# DATABASE SCHEMA - SRB MOTORS

## 📊 Database Overview

**Database Name**: SRB Motor Database  
**Database Type**: MySQL 8.0+  
**Character Set**: UTF-8  
**Collation**: utf8mb4_unicode_ci

---

## 🗂️ Complete Table Schema

### 1. **users** (Pengguna Sistem)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INDEX idx_email (email)
INDEX idx_role (role)
```

**Purpose**: Menyimpan data user (customer & admin)  
**Key Fields**:

- `role`: 'admin' untuk admin, 'user' untuk customer
- `password`: Hashed dengan Bcrypt
- `email_verified_at`: Untuk email verification (jika digunakan)

---

### 2. **motors** (Katalog Motor)

```sql
CREATE TABLE motors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,          -- Honda, Yamaha, dll
    model VARCHAR(255) NULL,
    price DECIMAL(10, 2) NOT NULL,
    year INT NULL,                        -- Tahun produksi
    type VARCHAR(255) NULL,               -- Metin, Automatic, dll
    image_path VARCHAR(255) NOT NULL,     -- Path ke storage/motors/
    details TEXT NULL,                    -- Deskripsi singkat
    tersedia BOOLEAN DEFAULT TRUE,        -- Status ketersediaan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INDEX idx_brand (brand)
INDEX idx_tersedia (tersedia)
INDEX idx_price (price)
INDEX idx_created_at (created_at)
```

**Purpose**: Menyimpan daftar motor yang dijual  
**Key Fields**:

- `brand`: Honda, Yamaha, dll
- `price`: Format decimal untuk presisi uang
- `tersedia`: TRUE jika stok ada
- `image_path`: Stored di public disk (`storage/app/public/motors/`)

---

### 3. **motor_specifications** (Spesifikasi Motor)

```sql
CREATE TABLE motor_specifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    motor_id BIGINT NOT NULL,
    spec_key VARCHAR(255) NOT NULL,      -- engine_type, max_power, dll
    spec_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (motor_id) REFERENCES motors(id) ON DELETE CASCADE
);

INDEX idx_motor_id (motor_id)
```

**Purpose**: Menyimpan spesifikasi terperinci setiap motor  
**Key Fields**:

- `spec_key`: engine_type, engine_size, fuel_system, transmission, max_power, max_torque, additional_specs
- `spec_value`: Nilai spek
- Cascade delete: Jika motor dihapus, spesifikasi otomatis terhapus

---

### 4. **transactions** (Transaksi Pembelian)

```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    motor_id BIGINT NOT NULL,
    transaction_type ENUM('CASH', 'CREDIT') NOT NULL,
    status ENUM(
        'new_order',
        'waiting_payment',
        'payment_confirmed',
        'unit_preparation',
        'ready_for_delivery',
        'completed',
        'menunggu_persetujuan',
        'data_tidak_valid',
        'dikirim_ke_surveyor',
        'jadwal_survey',
        'disetujui',
        'ditolak'
    ) DEFAULT 'new_order',

    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_occupation VARCHAR(255) NOT NULL,

    booking_fee DECIMAL(10, 2) NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(255) NULL,                -- tunai, midtrans, dll
    payment_status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
    notes TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (motor_id) REFERENCES motors(id) ON DELETE CASCADE
);

INDEX idx_user_id (user_id)
INDEX idx_motor_id (motor_id)
INDEX idx_status (status)
INDEX idx_transaction_type (transaction_type)
INDEX idx_created_at (created_at)
INDEX idx_payment_status (payment_status)
```

**Purpose**: Menyimpan semua transaksi (tunai & kredit)  
**Status Mapping**:

- **CASH**: new_order → waiting_payment → payment_confirmed → unit_preparation → ready_for_delivery → completed
- **CREDIT**: new_order → menunggu_persetujuan → [approved: disetujui, rejected: ditolak] → ready_for_delivery → completed
- **Alternate**: menunggu_persetujuan → data_tidak_valid → [ditolak]
- **Feature**: dikirim_ke_surveyor → jadwal_survey

---

### 5. **credit_details** (Detail Kredit)

```sql
CREATE TABLE credit_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id BIGINT NOT NULL UNIQUE,

    down_payment DECIMAL(10, 2) NOT NULL,           -- DP cicilan
    tenor INT NOT NULL,                             -- Jumlah bulan
    monthly_installment DECIMAL(10, 2) NOT NULL,    -- Cicilan per bulan
    approved_amount DECIMAL(10, 2) NULL,            -- Approved bank

    credit_status ENUM(
        'menunggu_persetujuan',
        'data_tidak_valid',
        'dikirim_ke_surveyor',
        'jadwal_survey',
        'disetujui',
        'ditolak',
        'PENDING_REVIEW',
        'DATA_INVALID',
        'SUBMITTED_TO_SURVEYOR',
        'SURVEY_SCHEDULED',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'menunggu_persetujuan',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

INDEX idx_transaction_id (transaction_id)
INDEX idx_credit_status (credit_status)
```

**Purpose**: Menyimpan detail kredit untuk transaksi kredit  
**Key Fields**:

- Hanya ada jika `transactions.transaction_type = 'CREDIT'`
- `tenor`: Misal 12 untuk cicilan 12 bulan
- `monthly_installment`: Sudah termasuk bunga (jika ada)
- Status: Workflow approval dokumen & survey
- Cascade delete: Jika transaction dihapus, credit detail terhapus

---

### 6. **documents** (File Dokumen Kredit)

```sql
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    credit_detail_id BIGINT NOT NULL,

    document_type ENUM(
        'KTP',
        'KK',                -- Kartu Keluarga
        'SLIP_GAJI',
        'SIM',               -- Optional
        'BPKB',              -- Optional
        'NPWP'               -- Optional
    ) NOT NULL,

    file_path VARCHAR(255) NOT NULL,     -- stored di storage/app/public/documents/
    original_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (credit_detail_id) REFERENCES credit_details(id) ON DELETE CASCADE
);

INDEX idx_credit_detail_id (credit_detail_id)
INDEX idx_document_type (document_type)
```

**Purpose**: Menyimpan file dokumen untuk verifikasi kredit  
**Required Documents**:

- KTP (Kartu Tanda Penduduk)
- KK (Kartu Keluarga)
- SLIP_GAJI (Bukti gaji)
- Auto-delete file saat document dihapus

---

### 7. **installments** (Cicilan Pembayaran)

```sql
CREATE TABLE installments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id BIGINT NOT NULL,

    installment_number INT NOT NULL,    -- 0=DP, 1-12=cicilan bulanan
    amount DECIMAL(15, 2) NOT NULL,
    penalty_amount DECIMAL(10, 2) DEFAULT 0,      -- Denda keterlambatan

    due_date DATE NOT NULL,             -- Tanggal jatuh tempo
    status ENUM('pending', 'waiting_approval', 'paid', 'overdue') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,

    payment_method VARCHAR(255) NULL,   -- tunai, midtrans_card, midtrans_va, dll
    payment_proof VARCHAR(255) NULL,    -- Path to image (if offline payment)

    snap_token VARCHAR(255) NULL,       -- Midtrans snap token
    midtrans_booking_code VARCHAR(255) NULL,  -- Midtrans reference code

    notes TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_installment (transaction_id, installment_number)
);

INDEX idx_transaction_id (transaction_id)
INDEX idx_due_date (due_date)
INDEX idx_status (status)
```

**Purpose**: Menyimpan jadwal cicilan  
**Key Fields**:

- `installment_number`: 0 untuk booking fee/DP, 1-12 untuk cicilan bulanan
- `due_date`: Otomatis dibuat saat approval (now + 1 month, now + 2 month, etc)
- `status`: pending → paid (jika pembayaran OK)
- `snap_token`: Token dari Midtrans untuk pembayaran online
- `midtrans_booking_code`: Reference untuk tracking di Midtrans
- **CASH Transaction**:
    - Installment #0: Booking fee (jika ada)
    - Installment #1: Sisa pembayaran
- **CREDIT Transaction**: Dihasilkan otomatis saat kredit disetujui:
    - Installment #0: Down payment
    - Installment #1-[tenor]: Monthly payment

---

### 8. **categories** (Kategori Motor)

```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) UNIQUE,
    description TEXT NULL,
    icon_path VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INDEX idx_name (name)
INDEX idx_slug (slug)
```

**Purpose**: Menyimpan kategori motor (Skuter Matik, Matic Sport, Manual, dll)  
**Key Fields**:

- `name`: Honda, Yamaha, Suzuki, etc
- `slug`: URL-friendly version untuk frontend
- Example data: "Skuter Matik", "Matic Sport", "Manual Premium"

**Active Categories in System**:

- Skuter Matik (5+ motors)
- Matic Sport (3+ motors)
- Manual Premium (2+ motors)
- Sports Bike (1+ motors)

---

### 9. **leasing_providers** (Provider Pembiayaan)

```sql
CREATE TABLE leasing_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    monthly_rate_percentage DECIMAL(5, 2) NOT NULL,  -- e.g., 0.35% per month
    max_tenor INT DEFAULT 48,
    min_down_payment_percentage DECIMAL(5, 2) DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INDEX idx_name (name)
INDEX idx_is_active (is_active)
```

**Purpose**: Menyimpan provider pembiayaan (bank, leasing company)  
**Key Fields**:

- `monthly_rate_percentage`: Bunga per bulan (0.35%, 0.40%, dll)
- `max_tenor`: Tenor maksimal yang ditawarkan (36, 48 bulan)
- `min_down_payment_percentage`: Minimal DP (10%, 15%, 20%)

**Active Providers**:

- Astra Credit (0.35% per month, max 48 months)
- BCA Finance (0.40% per month, max 36 months)
- Mandiri Tunas Finance (0.38% per month, max 48 months)

---

### 10. **posts** (Berita & Artikel)

```sql
CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    category_id BIGINT NULL,
    created_by VARCHAR(255) NULL,       -- Admin name
    published_at TIMESTAMP NULL,        -- NULL = draft

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

INDEX idx_slug (slug)
INDEX idx_published_at (published_at)
INDEX idx_created_at (created_at)
```

**Purpose**: Menyimpan artikel/berita untuk admin (Tips merawat, News, Promo)  
**Key Fields**:

- `slug`: URL-friendly (e.g., "tips-merawat-motor-matic")
- `published_at`: NULL = draft, timestamp = published
- Searchable & filterable by category

**Content Types**:

- Tips & Trik (perawatan, riding tips)
- Berita (promo, event, update)
- Review Motor (spesifikasi, perbandingan)

---

### 11. **survey_schedules** (Jadwal Survey Kredit)

```sql
CREATE TABLE survey_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    credit_detail_id BIGINT NOT NULL UNIQUE,
    scheduled_at TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('scheduled', 'ongoing', 'completed', 'rescheduled') DEFAULT 'scheduled',

    notes TEXT NULL,
    completed_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (credit_detail_id) REFERENCES credit_details(id) ON DELETE CASCADE
);

INDEX idx_credit_detail_id (credit_detail_id)
INDEX idx_scheduled_at (scheduled_at)
INDEX idx_status (status)
```

**Purpose**: Menyimpan jadwal survey rumah/tempat kerja untuk kredit  
**Workflow**:

1. Credit approved → Survey scheduled
2. Customer confirms attendance
3. Surveyor goes to location
4. Survey completed → Approval final

**Key Fields**:

- `scheduled_at`: Waktu survey dijadwalkan
- `location`: Alamat survey (rumah atau kantor customer)
- `status`: Track survey progress

---

### 12. **transaction_logs** (Log Perubahan Transaksi)

```sql
CREATE TABLE transaction_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id BIGINT NOT NULL,

    old_status VARCHAR(255) NULL,
    new_status VARCHAR(255) NOT NULL,
    action_description TEXT NULL,

    changed_by VARCHAR(255) NULL,      -- Admin atau system
    ip_address VARCHAR(45) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_created_at (created_at)
);
```

**Purpose**: Audit trail untuk setiap perubahan status transaksi  
**Use Case**:

- Track siapa approve/reject credit
- Lihat history perubahan status
- Audit compliance & troubleshooting

**Log Examples**:

```
transaction_id=102, old_status=menunggu_persetujuan, new_status=disetujui, changed_by=Admin1
transaction_id=102, old_status=disetujui, new_status=pending_payment, changed_by=System
```

---

### 13. **settings** (System Configuration)

```sql
CREATE TABLE settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    key VARCHAR(255) NOT NULL UNIQUE,  -- e.g., 'app.company_name'
    value LONGTEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'string',  -- string, integer, boolean, json
    description TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_key (key)
);
```

**Purpose**: Menyimpan konfigurasi aplikasi (dapat diubah tanpa coding)  
**Common Settings**:

```
key: 'app.company_name', value: 'SRB Motor'
key: 'app.phone', value: '+6285...'
key: 'app.email', value: 'info@srbmotor.com'
key: 'midtrans.server_key', value: '...'
key: 'fonnte.api_key', value: '...'
key: 'min_down_payment_percentage', value: '20'
key: 'max_credit_amount', value: '500000000'
```

---

### 14. **notifications** (Sistem Notifikasi)

```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,

    data JSON NOT NULL,
    read_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notifiable (notifiable_id, notifiable_type)
);
```

**Purpose**: Menyimpan notifikasi in-app system  
**Key Fields**:

- `notifiable_id` & `notifiable_type`: Polymorphic untuk siapa notifikasi ditujukan
- `data`: JSON dengan detail notifikasi
- `read_at`: NULL jika belum dibaca

---

### 14. **notifications** (Sistem Notifikasi)

```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,

    data JSON NOT NULL,
    read_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notifiable (notifiable_id, notifiable_type)
);
```

**Purpose**: Menyimpan notifikasi in-app system  
**Key Fields**:

- `notifiable_id` & `notifiable_type`: Polymorphic untuk siapa notifikasi ditujukan
- `data`: JSON dengan detail notifikasi
- `read_at`: NULL jika belum dibaca

---

### 15. **sessions** (Session Management)

```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_last_activity (last_activity),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Purpose**: Menyimpan session data untuk login/logout  
**Auto-managed**: Laravel handle ini otomatis

---

### 16. **password_reset_tokens** (Reset Password)

```sql
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,

    INDEX idx_token (token)
);
```

**Purpose**: Temporary token untuk reset password  
**Auto-cleanup**: Laravel otomatis hapus yang expired

---

### 17. **personal_access_tokens** (API Tokens)

```sql
CREATE TABLE personal_access_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tokenable_id BIGINT NOT NULL,
    tokenable_type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(80) UNIQUE NOT NULL,
    abilities JSON NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_tokenable (tokenable_id, tokenable_type)
);
```

**Purpose**: Tokens untuk API authentication (Sanctum)  
**Use Case**: Mobile app atau third-party integration

---

## 📊 Database Active Tables Summary

| #   | Table                  | Type    | Purpose                          | Status    |
| --- | ---------------------- | ------- | -------------------------------- | --------- |
| 1   | users                  | Core    | User accounts (customer & admin) | 🟢 Active |
| 2   | motors                 | Core    | Motor catalog                    | 🟢 Active |
| 3   | categories             | Core    | Motor categories                 | 🟢 Active |
| 4   | transactions           | Core    | Order management (cash & credit) | 🟢 Active |
| 5   | credit_details         | Core    | Credit financing details         | 🟢 Active |
| 6   | documents              | Core    | Credit supporting documents      | 🟢 Active |
| 7   | installments           | Core    | Payment installment schedule     | 🟢 Active |
| 8   | leasing_providers      | Core    | Financing providers              | 🟢 Active |
| 9   | survey_schedules       | Core    | Credit survey scheduling         | 🟢 Active |
| 10  | transaction_logs       | Audit   | Transaction change history       | 🟢 Active |
| 11  | posts                  | Content | News & articles                  | 🟢 Active |
| 12  | settings               | Config  | System configuration             | 🟢 Active |
| 13  | notifications          | System  | In-app notifications             | 🟢 Active |
| 14  | sessions               | System  | Session management               | 🟢 Auto   |
| 15  | password_reset_tokens  | System  | Password reset tokens            | 🟢 Auto   |
| 16  | personal_access_tokens | System  | API tokens (Sanctum)             | 🟢 Auto   |

**Note**: Tables 14-16 are auto-managed by Laravel Framework

---

## 📊 Database Relationships Diagram

```
┌─────────────────────────────────────────┐
│              CORE DATA MODELS             │
├─────────────────────────────────────────┤

users (1) ──── (many) transactions
         ──── (many) notifications

categories (1) ──── (many) motors
              ──── (many) posts

motors (1) ──── (many) transactions

transactions (1) ──── (1) credit_details
            ──── (many) installments
            ──── (many) transaction_logs

credit_details (1) ──── (many) documents
              ──── (1) survey_schedules
              ──── (many) leasing_providers (via value selection)

documents ──── (many) credit_details


RELATIONSHIP TYPES:
- One-to-Many: users → transactions, motors → transactions
- One-to-One: transactions → credit_details, credit_details → survey_schedules
- Polymorphic One-to-Many: users → notifications
- Lookup: leasing_providers (selected during credit creation)
```

---

## 🔑 Key Constraints Summary

### Cascade Behavior

```
motors DELETE
  → Cascade delete transactions (if motor removed from catalog)

transactions DELETE
  → Cascade delete installments
  → Cascade delete credit_details
    → Cascade delete documents
    → Cascade delete survey_schedules
  → Cascade delete transaction_logs

credit_details DELETE
  → Cascade delete documents
  → Cascade delete survey_schedules
    → Auto-delete files dari storage

categories DELETE
  → SET NULL pada posts.category_id
  → Motor categories tetap (foreign key RESTRICT)

users DELETE
  → Cascade delete transactions
  → Cascade delete notifications
  → SET NULL pada transaction_logs.changed_by
```

### Unique Constraints

```
users.email              UNIQUE
installments             UNIQUE (transaction_id, installment_number)
personal_access_tokens.token  UNIQUE
```

### Foreign Key Constraints

```
transactions.user_id           → users.id (CASCADE DELETE)
transactions.motor_id          → motors.id (CASCADE DELETE)

credit_details.transaction_id  → transactions.id (CASCADE DELETE)

documents.credit_detail_id     → credit_details.id (CASCADE DELETE)

installments.transaction_id    → transactions.id (CASCADE DELETE)

survey_schedules.credit_detail_id → credit_details.id (CASCADE DELETE)

transaction_logs.transaction_id   → transactions.id (CASCADE DELETE)

posts.category_id             → categories.id (SET NULL)

leasing_providers             → Referenced via data, not foreign key

sessions.user_id              → users.id (SET NULL)
```

---

## 📈 Indexing Strategy

### Typical Query Patterns & Their Indexes

```
For CACHE LAYER optimization:

1. Get all motors with filters
   → INDEX (tersedia, brand, price)
   → CACHED 1 HOUR (via MotorRepository)

2. Get user's transactions
   → INDEX (user_id, created_at DESC)
   → Query: SELECT * FROM transactions WHERE user_id=X ORDER BY created_at DESC

3. Get pending credit approvals (for admin)
   → INDEX (status, created_at DESC)
   → Query: SELECT * FROM credit_details WHERE status IN (...) ORDER BY created_at DESC

4. Get overdue installments (for payment reminders)
   → INDEX (status, due_date ASC)
   → Query: SELECT * FROM installments WHERE status='pending' AND due_date < NOW()

5. Get transaction audit trail
   → INDEX (transaction_id, created_at DESC)
   → Query: SELECT * FROM transaction_logs WHERE transaction_id=X

6. Search posts/news
   → INDEX (published_at DESC), FULLTEXT (title, content)
   → Query: SELECT * FROM posts WHERE published_at IS NOT NULL ORDER BY published_at DESC

COMPOSITE INDEXES:
- transactions (user_id, created_at DESC)
- installments (transaction_id, due_date)
- transaction_logs (transaction_id, created_at DESC)
- posts (published_at DESC, category_id)
```

---

## 🗂️ Data Volume Estimates

| Table             | Typical Size | Growth           |
| ----------------- | ------------ | ---------------- |
| users             | 500-5000     | +50-100/month    |
| motors            | 50-200       | +5-10/month      |
| categories        | 5-15         | +1/year          |
| transactions      | 2000-50000   | +100-500/month   |
| credit_details    | 500-10000    | +50-200/month    |
| documents         | 3000-80000   | +300-800/month   |
| installments      | 20000-200000 | +2000-8000/month |
| survey_schedules  | 500-5000     | +50-200/month    |
| transaction_logs  | 10000-100000 | +1000-5000/month |
| posts             | 50-500       | +5-20/month      |
| notifications     | 5000-50000   | +500-2000/month  |
| leasing_providers | 3-5          | static           |
| settings          | 20-50        | +1-2/year        |

**Recommended**: Implement archival strategy for old transactions after 3 years

---

## 📋 Migration Path

**Current Status** (as of Mar 19, 2026):

- ✅ All 13 core tables active
- ✅ 3 system tables (sessions, tokens, etc)
- ✅ Recent consolidation complete (Mar 13-18)
- ✅ Schema stable & production-ready

**Dropped Tables** (no longer used):

- `promotions` (dropped Mar 15) - Features moved to posts/settings
- `banners` (dropped Mar 15) - Display handled separately
- `contact_messages` (stored in posts optionally)
- `motor_units` (simplified to motor colors in transactions)
- `user_profiles` (consolidated to users table)

**Future-Ready**:

- Notification system (ready for push notifications via job queue)
- Settings table (ready for dynamic configuration)
- Transaction logs (ready for compliance audit trail)

---

## 🛡️ Data Integrity & Validation

├── motor_id (traffic by motor)
├── status (status filtering)
├── transaction_type (type filtering)
├── created_at (recent transactions)
└── payment_status (payment tracking)

installments:
├── transaction_id (installments of transaction)
├── due_date (find overdue)
└── status (find pending)

```

### Join/Relationship Indexes

- Foreign keys automatically indexed
- Reduces lookup time lors relations

---

## 🗂️ Migration Files

Migration files located di `/database/migrations/`:

```

2025_01_01_000000_create_complete_users_table.php
2025_01_01_000001_create_cache_table.php
2025_01_01_000002_create_jobs_table.php
2025_10_30_092515_create_complete_motors_table.php
2025_10_30_092517_create_complete_contact_messages_table.php
2025_11_01_000000_create_complete_motor_specifications_table.php
2025_11_05_000001_create_complete_transactions_table.php
2025_11_05_000002_create_complete_credit_details_table.php
2025_11_05_000003_create_complete_documents_table.php
2025_11_05_064733_create_complete_notifications_table.php
2025_11_05_140000_create_sessions_table.php
2025_11_05_150000_create_password_reset_tokens_table.php
2025_11_05_160000_create_personal_access_tokens_table.php
2025_11_07_064701_add_customer_info_to_transactions_table.php
2025_11_07_120000_add_indexes_to_tables.php
2025_11_19_125905_make_subject_nullable_in_contact_messages_table.php
2025_12_11_174115_create_installments_table.php
2025_12_11_185347_add_snap_token_to_installments_table.php
2025_12_18_054306_add_penalty_amount_to_installments_table.php

```

---

**Database Schema Last Updated**: March 6, 2026
```
