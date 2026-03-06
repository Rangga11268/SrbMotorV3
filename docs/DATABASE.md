# DATABASE SCHEMA - SRB MOTORS

## 📊 Database Overview

**Database Name**: SRB Motors Database  
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

### 8. **contact_messages** (Pesan Kontak)

```sql
CREATE TABLE contact_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    subject VARCHAR(255) NULL,          -- Nullable sejak migration
    message TEXT NOT NULL,

    status ENUM('new', 'read', 'replied') DEFAULT 'new',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INDEX idx_email (email)
INDEX idx_status (status)
INDEX idx_created_at (created_at)
```

**Purpose**: Menyimpan pesan kontak dari customer  
**Key Fields**:

- `status`: Untuk tracking apakah admin sudah baca/reply

---

### 9. **notifications** (Sistem Notifikasi)

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

### 10. **sessions** (Session Management)

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

### 11. **password_reset_tokens** (Reset Password)

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

### 12. **personal_access_tokens** (API Tokens)

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

## 📊 Database Relationships Diagram

```
users (1) ──── (many) transactions
              ──── (many) contact_messages
              ──── (many) notifications

motors (1) ──── (many) transactions
         ──── (many) motor_specifications

transactions (1) ──── (1) credit_details
            ──── (many) installments

credit_details (1) ──── (many) documents


RELATIONSHIP TYPES:
- One-to-Many: users → transactions
- One-to-One: transactions → credit_details
- Polymorphic One-to-Many: users/admin → notifications
```

---

## 🔑 Key Constraints

### Cascade Behavior

```
motors DELETE
  → Cascade delete motor_specifications

transactions DELETE
  → Cascade delete installments
  → Cascade delete credit_details
    → Cascade delete documents

credit_details DELETE
  → Cascade delete documents
    → Auto-delete file dari storage

documents DELETE
  → Auto-delete file dari storage
```

### Unique Constraints

```
users.email              UNIQUE
installments             UNIQUE (transaction_id, installment_number)
personal_access_tokens.token  UNIQUE
```

### Foreign Key Constraints

```
transactions.user_id     → users.id (CASCADE DELETE)
transactions.motor_id    → motors.id (CASCADE DELETE)
motor_specifications.motor_id → motors.id (CASCADE DELETE)
credit_details.transaction_id → transactions.id (CASCADE DELETE)
documents.credit_detail_id → credit_details.id (CASCADE DELETE)
installments.transaction_id → transactions.id (CASCADE DELETE)
```

---

## 📈 Indexing Strategy

### Fast Query Indexes

```
users:
  ├── email (for login)
  └── role (for authorization)

motors:
  ├── brand (for filtering)
  ├── tersedia (for availability)
  ├── price (for price filtering)
  └── created_at (for ordering)

transactions:
  ├── user_id (user's transaction list)
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
