# COMPREHENSIVE MIGRATION ANALYSIS

**Date Generated:** March 11, 2026  
**Total Migrations:** 41 files

---

## 📋 DETAILED MIGRATION FILE ANALYSIS

### **GROUP 1: FRAMEWORK TABLES (Laravel Defaults)**

#### 1. `0001_01_01_000000_create_complete_users_table.php`

- **Type:** CREATE table
- **Table:** `users`
- **Columns:**
    - `id` (primary key)
    - `name` (string)
    - `email` (string, unique)
    - `email_verified_at` (timestamp, nullable)
    - `password` (string)
    - `remember_token`
    - `role` (string, default: 'user')
    - `created_at`, `updated_at` (timestamps)
- **Status:** ✅ Initial table creation

---

#### 2. `0001_01_01_000001_create_cache_table.php`

- **Type:** CREATE tables
- **Tables:**
    - `cache` (key-value storage)
    - `cache_locks` (lock management)
- **Status:** ✅ Framework utility tables

---

#### 3. `0001_01_01_000002_create_jobs_table.php`

- **Type:** CREATE tables
- **Tables:**
    - `jobs` (queue jobs)
    - `job_batches` (batch tracking)
    - `failed_jobs` (error tracking)
- **Status:** ✅ Queue management tables

---

### **GROUP 2: CORE BUSINESS TABLES (Created Oct-Nov 2025)**

#### 4. `2025_10_30_092515_create_complete_motors_table.php`

- **Type:** CREATE table
- **Table:** `motors`
- **Columns:**
    - `id` (primary key)
    - `name`, `brand`, `model`
    - `price` (decimal)
    - `year` (integer, nullable)
    - `type` (string, nullable)
    - `image_path`
    - `details` (text, nullable) **[DEPRECATED by 2026_03_07]**
    - `tersedia` (boolean, default: true)
    - `created_at`, `updated_at`
- **Status:** ⚠️ Modified by later migration (simplify_motor_specifications)

---

#### 5. `2025_10_30_092517_create_complete_contact_messages_table.php`

- **Type:** CREATE table
- **Table:** `contact_messages`
- **Columns:**
    - `id`, `name`, `email`, `subject`, `message`
    - `created_at`, `updated_at`
- **Status:** ⚠️ Modified later (subject changed to nullable - 2025_11_19)

---

#### 6. `2025_11_01_000000_create_complete_motor_specifications_table.php`

- **Type:** CREATE table
- **Table:** `motor_specifications` **[DEPRECATED]**
- **Columns:**
    - `id`, `motor_id` (FK to motors)
    - `spec_key`, `spec_value` (text)
    - `created_at`, `updated_at`
    - Index on `[motor_id, spec_key]`
- **Status:** ❌ **DROPPED by 2026_03_07_195727** (replaced with description field on motors)

---

#### 7. `2025_11_05_000001_create_complete_transactions_table.php`

- **Type:** CREATE table
- **Table:** `transactions`
- **Columns:**
    - `id`, `user_id` (FK), `motor_id` (FK)
    - `transaction_type` (enum: CASH, CREDIT)
    - `status` (enum - 13 different statuses) **[CHANGED TO STRING 2026_03_09]**
    - `notes` (text, nullable)
    - `booking_fee`, `total_amount` (decimal)
    - `payment_method`, `payment_status` (enum)
    - `created_at`, `updated_at`
- **Status:** ⚠️ Modified by 9+ later migrations

---

#### 8. `2025_11_05_000002_create_complete_credit_details_table.php`

- **Type:** CREATE table
- **Table:** `credit_details`
- **Columns:**
    - `id`, `transaction_id` (FK, unique)
    - `down_payment`, `tenor`, `monthly_installment` (decimals)
    - `credit_status` (enum - 6 values) **[CHANGED TO STRING 2026_03_11]**
    - `approved_amount` (decimal, nullable)
    - `created_at`, `updated_at`
- **Status:** ⚠️ Modified by 10+ later migrations (interest_rate, leasing_provider_id, survey columns, etc.)

---

#### 9. `2025_11_05_000003_create_complete_documents_table.php`

- **Type:** CREATE table
- **Table:** `documents`
- **Columns:**
    - `id`, `credit_detail_id` (FK)
    - `document_type` (enum: 8 types)
    - `file_path`, `original_name`
    - `created_at`, `updated_at`
- **Status:** ⚠️ Modified later (approval_status fields added 2026_03_09)

---

#### 10. `2025_11_05_064733_create_complete_notifications_table.php`

- **Type:** CREATE table
- **Table:** `notifications`
- **Columns:**
    - `id` (UUID), `type`, `notifiable` (morphs)
    - `data` (text), `read_at`, `created_at`, `updated_at`
- **Status:** ✅ Standard Laravel notifications table

---

#### 11. `2025_11_05_140000_create_sessions_table.php`

- **Type:** CREATE table
- **Table:** `sessions`
- **Status:** ✅ Standard Laravel sessions table

---

#### 12. `2025_11_05_150000_create_password_reset_tokens_table.php`

- **Type:** CREATE table
- **Table:** `password_reset_tokens`
- **Status:** ✅ Standard Laravel password reset tokens

---

#### 13. `2025_11_05_160000_create_personal_access_tokens_table.php`

- **Type:** CREATE table
- **Table:** `personal_access_tokens`
- **Status:** ✅ Standard Laravel API tokens table

---

### **GROUP 3: INDEX ADDITIONS (Nov 2025)**

#### 14. `2025_11_07_064701_add_customer_info_to_transactions_table.php`

- **Type:** ALTER table
- **Table:** `transactions` (adds columns)
- **Columns Added:**
    - `customer_name` (string, nullable)
    - `customer_phone` (string, nullable)
    - `customer_occupation` (string, nullable)
- **Status:** ⚠️ **EARLY VERSION** - Later migrations (2026_03_11) add more customer fields

---

#### 15. `2025_11_07_120000_add_indexes_to_tables.php`

- **Type:** ALTER tables (adds indexes)
- **Tables Modified:** motors, motor_specifications, transactions, users, contact_messages, credit_details, documents
- **Status:** ⚠️ **Incomplete down() method** - doesn't actually drop indexes

---

#### 16. `2025_11_19_125905_make_subject_nullable_in_contact_messages_table.php`

- **Type:** ALTER table
- **Table:** `contact_messages`
- **Change:** `subject` column changed to nullable
- **Status:** ✅ Single purpose migration

---

### **GROUP 4: INSTALLMENTS TABLE (Dec 2025)**

#### 17. `2025_12_11_174115_create_installments_table.php`

- **Type:** CREATE table
- **Table:** `installments`
- **Columns:**
    - `id`, `transaction_id` (FK)
    - `installment_number`, `amount` (decimal)
    - `due_date` (date)
    - `status` (enum: pending, waiting_approval, paid, overdue)
    - `paid_at`, `payment_method`, `payment_proof`, `notes`
    - `created_at`, `updated_at`
    - Unique constraint on `[transaction_id, installment_number]`
- **Status:** ⚠️ Modified by 2 subsequent migrations

---

#### 18. `2025_12_11_185347_add_snap_token_to_installments_table.php`

- **Type:** ALTER table
- **Table:** `installments` (adds columns)
- **Columns Added:**
    - `snap_token` (string, nullable)
    - `midtrans_booking_code` (string, nullable)
- **Status:** ⚠️ Midtrans payment gateway integration

---

#### 19. `2025_12_18_054306_add_penalty_amount_to_installments_table.php`

- **Type:** ALTER table
- **Table:** `installments` (adds column)
- **Columns Added:**
    - `penalty_amount` (decimal, default: 0) - for late payments
- **Status:** ✅ Late payment tracking

---

### **GROUP 5: USER PROFILE ENHANCEMENTS (Mar 7-11, 2026)**

#### 20. `2026_03_07_163601_add_google_auth_to_users.php`

- **Type:** ALTER table
- **Table:** `users` (adds columns)
- **Columns Added:**
    - `google_id` (string, nullable, unique)
    - `profile_photo_path` (string, nullable)
- **Status:** ✅ OAuth integration

---

#### 21. `2026_03_11_add_customer_profile_fields_to_users_table.php`

- **Type:** ALTER table
- **Table:** `users` (adds multiple columns)
- **Columns Added:**
    - `alamat` (text, nullable) - Customer address
    - `nik` (string, nullable, unique) - National ID
    - `no_ktp` (string, nullable) - ID card number
    - `no_hp_backup` (string, nullable) - Backup phone
    - `jenis_kelamin` (enum: L, P) - Gender
    - `tanggal_lahir` (date, nullable) - DOB
    - `pekerjaan` (string, nullable) - Occupation
    - `pendapatan_bulanan` (decimal, nullable) - Monthly income
    - `nama_ibu_kandung` (string, nullable) - Mother's maiden name (security Q)
- **Status:** ⚠️ **CONSOLIDATION NEEDED** - Should merge with #20

---

### **GROUP 6: MOTOR TABLE REFACTORING (Mar 7, 2026)**

#### 22. `2026_03_07_195727_simplify_motor_specifications_table.php`

- **Type:** ALTER & DROP
- **Changes:**
    - Adds `description` (longText, nullable) to `motors`
    - Drops `details` column from `motors` (if exists)
    - **DROPS** entire `motor_specifications` table
- **Status:** ❌ **DESTRUCTIVE** - Better handled as part of initial table creation

---

### **GROUP 7: PROMOTIONS & LEASING (Mar 7, 2026)**

#### 23. `2026_03_07_195731_create_promotions_tables.php`

- **Type:** CREATE tables (2 tables)
- **Tables:**
    - `promotions` (id, title, badge_text, badge_color, valid_until, is_active, timestamps)
    - `motor_promotion` (pivot table: motor_id, promotion_id)
- **Status:** ✅ Many-to-many relationship

---

#### 24. `2026_03_07_195734_create_leasing_tables.php`

- **Type:** CREATE tables (2 tables)
- **Tables:**
    - `leasing_providers` (id, name, logo_path, timestamps)
    - `financing_schemes` (id, motor_id FK, provider_id FK, tenor, dp_amount, monthly_installment, timestamps)
- **Status:** ✅ Financing options management

---

### **GROUP 8: CREDIT DETAILS ENHANCEMENTS (Mar 8-11, 2026)**

#### 25. `2026_03_08_194631_add_interest_rate_to_credit_details_table.php`

- **Type:** ALTER table
- **Table:** `credit_details` (adds column)
- **Columns Added:**
    - `interest_rate` (decimal 5,4, default: 0.0150) - Monthly interest
- **Status:** ✅ Finance calculation

---

#### 26. `2026_03_09_000000_add_leasing_provider_to_credit_details.php`

- **Type:** ALTER table
- **Table:** `credit_details` (adds FK)
- **Columns Added:**
    - `leasing_provider_id` (FK to leasing_providers, nullable)
- **Status:** ✅ Links to financing scheme

---

#### 27. `2026_03_11_000001_refactor_credit_flow.php`

- **Type:** ALTER table
- **Table:** `credit_details` (adds multiple columns with existence checks)
- **Columns Added:**
    - `leasing_application_ref` (string, nullable)
    - `leasing_decision_date` (dateTime, nullable)
    - `rejection_reason` (text, nullable)
    - `internal_notes` (text, nullable)
    - `dp_paid_date` (dateTime, nullable)
    - `dp_payment_method` (string, nullable)
    - `dp_confirmed_by` (FK to users, nullable)
- **Status:** ⚠️ **INCOMPLETE down() method** - truncated in file
- **Note:** Attempts to add indices but has error-handling try-catch blocks

---

#### 28. `2026_03_11_add_survey_columns_to_credit_details.php`

- **Type:** ALTER table
- **Table:** `credit_details` (adds columns with existence checks)
- **Columns Added:**
    - `survey_scheduled_date` (date, nullable)
    - `survey_scheduled_time` (time, nullable)
    - `surveyor_name` (string, nullable)
    - `surveyor_phone` (string, nullable)
- **Status:** ⚠️ Duplicates columns that might be in survey_schedules table

---

#### 29. `2026_03_11_add_survey_notes_and_completed_to_credit_details.php`

- **Type:** ALTER table
- **Table:** `credit_details` (adds columns with existence checks)
- **Columns Added:**
    - `survey_notes` (text, nullable)
    - `survey_completed_at` (timestamp, nullable)
- **Status:** ⚠️ More survey-related columns

---

#### 30. `2026_03_11_000002_update_credit_status_to_string.php`

- **Type:** ALTER & UPDATE
- **Table:** `credit_details`
- **Changes:**
    - Changes `credit_status` from enum to string (varchar)
    - Updates existing data mappings:
        - 'menunggu_persetujuan' → 'pengajuan_masuk'
        - 'dikirim_ke_surveyor' → 'survey_dijadwalkan'
        - 'data_tidak_valid' → 'pengajuan_masuk'
        - 'jadwal_survey' → 'survey_dijadwalkan'
- **Status:** ⚠️ **NOT REVERSIBLE** - down() is empty

---

### **GROUP 9: TRANSACTIONS ENHANCEMENTS (Mar 9-11, 2026)**

#### 31. `2026_03_09_000001_add_cancellation_to_transactions.php`

- **Type:** ALTER table
- **Table:** `transactions` (adds columns)
- **Columns Added:**
    - `cancelled_at` (timestamp, nullable)
    - `cancellation_reason` (string, nullable)
- **Status:** ✅ Order cancellation tracking

---

#### 32. `2026_03_09_163810_add_customer_address_to_transactions.php`

- **Type:** ALTER table
- **Table:** `transactions` (adds columns & modifies)
- **Columns Added:**
    - `customer_address` (text, nullable)
- **Other Changes:**
    - Changes `status` from enum to string(50) for flexibility
- **Status:** ⚠️ **NOT REVERSIBLE** - Changes to string type

---

#### 33. `2026_03_11_000002_add_customer_details_to_transactions.php`

- **Type:** ALTER table
- **Table:** `transactions` (adds columns with existence checks)
- **Columns Added:**
    - `customer_nik` (string, nullable)
    - `customer_monthly_income` (decimal, nullable)
    - `customer_employment_duration` (string, nullable)
    - `credit_amount` (decimal, nullable)
- **Status:** ⚠️ **DUPLICATES** existing columns from #31, #32

---

### **GROUP 10: SURVEY & DOCUMENT MANAGEMENT (Mar 9-11, 2026)**

#### 34. `2026_03_09_000002_create_survey_schedules_table.php`

- **Type:** CREATE table
- **Table:** `survey_schedules`
- **Columns:**
    - `id`, `credit_detail_id` (FK)
    - `scheduled_date` (date), `scheduled_time` (time)
    - `location`, `surveyor_name`, `surveyor_phone`
    - `status` (enum: pending, confirmed, completed, cancelled)
    - `notes` (text, nullable)
    - `created_at`, `updated_at`
- **Status:** ⚠️ **DUPLICATES survey info** now also in credit_details (#28)

---

#### 35. `2026_03_11_000002_add_customer_confirmation_to_survey_schedules.php`

- **Type:** ALTER table
- **Table:** `survey_schedules` (adds columns)
- **Columns Added:**
    - `customer_confirmed_at` (timestamp, nullable)
    - `customer_notes` (text, nullable)
- **Status:** ✅ Customer confirmation tracking

---

#### 36. `2026_03_09_000003_add_document_approval_status.php`

- **Type:** ALTER table
- **Table:** `documents` (adds columns)
- **Columns Added:**
    - `approval_status` (enum: pending, approved, rejected, default: pending)
    - `rejection_reason` (text, nullable)
    - `reviewed_at` (timestamp, nullable)
- **Status:** ✅ Document approval workflow

---

### **GROUP 11: INSTALLMENTS ENHANCEMENTS (Mar 9, 2026)**

#### 37. `2026_03_09_000004_add_reminder_sent_to_installments.php`

- **Type:** ALTER table
- **Table:** `installments` (adds column)
- **Columns Added:**
    - `reminder_sent_at` (timestamp, nullable)
- **Status:** ✅ Payment reminder tracking

---

### **GROUP 12: CMS CONTENT TABLES (Mar 10, 2026)**

#### 38. `2026_03_10_000001_create_settings_table.php`

- **Type:** CREATE table
- **Table:** `settings`
- **Columns:**
    - `id`, `key` (unique, indexed), `value` (longText)
    - `type` (default: 'string')
    - `category` (default: 'general')
    - `description`, `created_at`, `updated_at`
- **Status:** ✅ Application settings management

---

#### 39. `2026_03_10_000002_create_banners_table.php`

- **Type:** CREATE table
- **Table:** `banners`
- **Columns:**
    - `id`, `title`, `description`, `image_path`
    - `button_text`, `button_url`
    - `status` (enum: active, inactive)
    - `position` (int, default: 0), `published_at`, `expired_at`
    - `created_at`, `updated_at`
    - Indexes on status & position
- **Status:** ✅ Homepage banners

---

#### 40. `2026_03_10_000003_create_categories_table.php`

- **Type:** CREATE table
- **Table:** `categories`
- **Columns:**
    - `id`, `name` (unique), `slug` (unique)
    - `description`, `icon`
    - `order` (default: 0), `is_active` (default: true)
    - `created_at`, `updated_at`
    - Indexes on is_active & order
- **Status:** ✅ Content categories

---

#### 41. `2026_03_10_000004_create_posts_table.php`

- **Type:** CREATE table
- **Table:** `posts`
- **Columns:**
    - `id`, `category_id` (FK), `title`, `slug` (unique)
    - `content` (text), `featured_image`, `excerpt`
    - `status` (enum: draft, published, archived)
    - `views` (bigInt, default: 0)
    - `published_at`, `created_at`, `updated_at`
    - Indexes on slug, status, published_at
- **Status:** ✅ Blog posts / content management

---

---

## 🔍 CONSOLIDATION PLAN

### **CRITICAL ISSUES IDENTIFIED**

#### ⛔ **Issue 1: Motor Specifications Refactoring Mess**

- **Created:** 2025_11_01 (`motor_specifications` table)
- **Dropped:** 2026_03_07 (migration #22 destructively drops it)
- **Problem:** Should have been part of initial design, not created then destroyed
- **Solution:** Delete #22; redesign motors table from start with `description` field instead

---

#### ⛔ **Issue 2: Credit Details Table - Fragmented Across 7 Migrations**

- **Initial:** #25 (2025_11_05)
- **Additions:** #25, #26, #28, #29, #30, #27, #11
- **All should be:** ONE consolidated creation migration
- **Current columns (should be consolidated):**
    - down_payment, tenor, monthly_installment
    - credit_status (changed from enum to string)
    - approved_amount
    - interest_rate
    - leasing_provider_id (FK)
    - leasing_application_ref, leasing_decision_date
    - rejection_reason, internal_notes
    - dp_paid_date, dp_payment_method, dp_confirmed_by (FK)
    - survey_scheduled_date, survey_scheduled_time
    - surveyor_name, surveyor_phone
    - survey_notes, survey_completed_at

---

#### ⛔ **Issue 3: Transactions Table - 6 Separate Alter Migrations**

- **Initial:** #7 (2025_11_05)
- **Additions:** #14, #31, #32, #33
- **Status changed:** Enum → String (#32 AND #27) ✅ REDUNDANT
- **Customer fields scattered:**
    - Initial: customer_name, customer_phone, customer_occupation (#14)
    - Later: customer_nik, monthly_income, employment_duration, credit_amount (#33)
    - Earlier: customer_address (#32)
- **Should have:** ONE consolidated table with ALL fields

---

#### ⛔ **Issue 4: Users Table - Multiple Profile Field Migrations**

- **Initial:** #1 (0001_01_01)
- **Additions:** #20 (Google auth), #21 (Profile fields)
- **Columns added in #21:**
    - alamat, nik, no_ktp, no_hp_backup, jenis_kelamin, tanggal_lahir, pekerjaan, pendapatan_bulanan, nama_ibu_kandung
- **Should be:** Combined into one #20 migration

---

#### ⛔ **Issue 5: Installments Table - 3 Sequential Additions**

- **Initial:** #17 (2025_12_11)
- **Additions:** #18, #19, #37
- **Could be:** Combined into single creation

---

#### ⛔ **Issue 6: Survey Data Duplication**

- **Table:** `survey_schedules` created (#34)
- **Also added to:** `credit_details` table (#28, #29)
- **Columns in BOTH tables:**
    - scheduled_date, scheduled_time, surveyor_name, surveyor_phone, notes
- **Solution:** Choose ONE location (recommend `survey_schedules` as dedicated table, remove from credit_details)

---

#### ⛔ **Issue 7: Index Migration Strategy**

- **Migration #15:** Attempts to add indexes to multiple tables
- **Problem:** `.down()` is incomplete and doesn't actually remove indexes
- **Solution:** Move all indexes into their respective table creation migrations

---

### **RECOMMENDED CONSOLIDATION STRATEGY**

#### **PHASE 1: Keep These (Framework Essentials)**

- #1: `users` table creation
- #2: `cache` table creation
- #3: `jobs` table creation
- #11: `sessions` table creation
- #12: `password_reset_tokens` table creation
- #13: `personal_access_tokens` table creation
- #23: `promotions` & `motor_promotion` tables
- #24: `leasing_providers` & `financing_schemes` tables
- #38: `settings` table
- #39: `banners` table
- #40: `categories` table
- #41: `posts` table

---

#### **PHASE 2: Consolidate Into New Comprehensive Migrations**

##### **NEW Migration: `2026_03_11_000000_create_complete_motors_table.php`**

Consolidates: #4, #6, #22

```php
Schema::create('motors', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('brand');
    $table->string('model')->nullable();
    $table->decimal('price', 10, 2);
    $table->integer('year')->nullable();
    $table->string('type')->nullable();
    $table->string('image_path');
    $table->longText('description')->nullable();
    $table->boolean('tersedia')->default(true);
    $table->timestamps();

    // Indexes
    $table->index(['brand', 'type']);
    $table->index('year');
    $table->index('price');
    $table->index('tersedia');
    $table->index(['brand', 'tersedia']);
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_contact_messages_table.php`**

Consolidates: #5, #16

```php
Schema::create('contact_messages', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->string('subject')->nullable(); // Made nullable from start
    $table->text('message');
    $table->timestamps();

    $table->index('created_at');
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_transactions_table.php`**

Consolidates: #7, #14, #31, #32, #33

```php
Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('motor_id')->constrained()->onDelete('cascade');

    // Transaction basics
    $table->enum('transaction_type', ['CASH', 'CREDIT']);
    $table->string('status')->default('new_order');
    $table->text('notes')->nullable();
    $table->decimal('booking_fee', 10, 2)->nullable();
    $table->decimal('total_amount', 10, 2);
    $table->decimal('credit_amount', 15, 2)->nullable();

    // Payment info
    $table->string('payment_method')->nullable();
    $table->enum('payment_status', ['pending', 'confirmed', 'failed'])->default('pending');

    // Customer info (consolidated)
    $table->string('customer_name')->nullable();
    $table->string('customer_phone')->nullable();
    $table->string('customer_occupation')->nullable();
    $table->text('customer_address')->nullable();
    $table->string('customer_nik')->nullable();
    $table->decimal('customer_monthly_income', 15, 2)->nullable();
    $table->string('customer_employment_duration')->nullable();

    // Cancellation
    $table->timestamp('cancelled_at')->nullable();
    $table->string('cancellation_reason')->nullable();

    $table->timestamps();

    // Indexes
    $table->index(['user_id', 'status']);
    $table->index(['motor_id', 'transaction_type']);
    $table->index('transaction_type');
    $table->index('status');
    $table->index('created_at');
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_credit_details_table.php`**

Consolidates: #8, #25, #26, #27, #28, #29, #30

```php
Schema::create('credit_details', function (Blueprint $table) {
    $table->id();
    $table->foreignId('transaction_id')->constrained()->onDelete('cascade')->unique();

    // Principal credit info
    $table->decimal('down_payment', 10, 2);
    $table->integer('tenor');
    $table->decimal('monthly_installment', 10, 2);
    $table->decimal('approved_amount', 10, 2)->nullable();
    $table->decimal('interest_rate', 5, 4)->default(0.0150);

    // Status (as string from start)
    $table->string('credit_status')->default('pengajuan_masuk');

    // Leasing provider
    $table->foreignId('leasing_provider_id')->nullable()->constrained('leasing_providers')->onDelete('set null');
    $table->string('leasing_application_ref')->nullable();
    $table->dateTime('leasing_decision_date')->nullable();

    // Decision info
    $table->text('rejection_reason')->nullable();
    $table->text('internal_notes')->nullable();

    // Down payment tracking
    $table->dateTime('dp_paid_date')->nullable();
    $table->string('dp_payment_method')->nullable();
    $table->unsignedBigInteger('dp_confirmed_by')->nullable();

    // Survey info (linked to survey_schedules - remove duplication)
    // NOTE: Use survey_schedules table for detailed survey data

    $table->timestamps();

    // Indexes
    $table->index('credit_status');
    $table->foreign('dp_confirmed_by')->references('id')->on('users')->onDelete('set null');
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_documents_table.php`**

Consolidates: #9, #36

```php
Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('credit_detail_id')->constrained()->onDelete('cascade');

    $table->enum('document_type', ['KTP', 'KK', 'SLIP_GAJI', 'BPKB', 'STNK', 'FAKTUR', 'LAINNYA']);
    $table->string('file_path');
    $table->string('original_name');

    // Approval workflow
    $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
    $table->text('rejection_reason')->nullable();
    $table->timestamp('reviewed_at')->nullable();

    $table->timestamps();

    // Indexes
    $table->index('document_type');
    $table->index('credit_detail_id');
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_installments_table.php`**

Consolidates: #17, #18, #19, #37

```php
Schema::create('installments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');

    // Installment details
    $table->integer('installment_number');
    $table->decimal('amount', 15, 2);
    $table->decimal('penalty_amount', 15, 2)->default(0);
    $table->date('due_date');

    // Status & payment tracking
    $table->enum('status', ['pending', 'waiting_approval', 'paid', 'overdue'])->default('pending');
    $table->timestamp('paid_at')->nullable();
    $table->string('payment_method')->nullable();
    $table->string('payment_proof')->nullable();

    // Midtrans integration
    $table->string('snap_token')->nullable();
    $table->string('midtrans_booking_code')->nullable();

    // Communication
    $table->text('notes')->nullable();
    $table->timestamp('reminder_sent_at')->nullable();

    $table->timestamps();

    // Constraints
    $table->unique(['transaction_id', 'installment_number']);
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_survey_schedules_table.php`**

Consolidates: #34, #35
**Remove survey columns from credit_details table**

```php
Schema::create('survey_schedules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('credit_detail_id')->constrained('credit_details')->onDelete('cascade');

    // Schedule data
    $table->date('scheduled_date');
    $table->time('scheduled_time');
    $table->string('location')->nullable();

    // Surveyor info
    $table->string('surveyor_name')->nullable();
    $table->string('surveyor_phone')->nullable();

    // Status & notes
    $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
    $table->text('notes')->nullable();

    // Customer confirmation
    $table->timestamp('customer_confirmed_at')->nullable();
    $table->text('customer_notes')->nullable();

    $table->timestamps();
});
```

---

##### **NEW Migration: `2026_03_11_000000_create_complete_users_table.php`** (UPDATED)

Consolidates: #1, #20, #21

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();

    // Authentication
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();

    // OAuth
    $table->string('google_id')->nullable()->unique();
    $table->string('profile_photo_path')->nullable();

    // Role
    $table->string('role')->default('user');

    // Customer profile fields
    $table->text('alamat')->nullable();
    $table->string('nik')->nullable()->unique();
    $table->string('no_ktp')->nullable();
    $table->string('no_hp_backup')->nullable();
    $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
    $table->date('tanggal_lahir')->nullable();
    $table->string('pekerjaan')->nullable();
    $table->decimal('pendapatan_bulanan', 15, 0)->nullable();
    $table->string('nama_ibu_kandung')->nullable();

    $table->timestamps();

    // Indexes
    $table->index('role');
    $table->index('email');
    $table->index('created_at');
});
```

---

#### **PHASE 3: Delete These Migrations**

These will be superseded by consolidated versions:

- #4: `2025_10_30_092515_create_complete_motors_table.php`
- #5: `2025_10_30_092517_create_complete_contact_messages_table.php`
- #6: `2025_11_01_000000_create_complete_motor_specifications_table.php`
- #7: `2025_11_05_000001_create_complete_transactions_table.php`
- #8: `2025_11_05_000002_create_complete_credit_details_table.php`
- #9: `2025_11_05_000003_create_complete_documents_table.php`
- #14: `2025_11_07_064701_add_customer_info_to_transactions_table.php`
- #15: `2025_11_07_120000_add_indexes_to_tables.php`
- #16: `2025_11_19_125905_make_subject_nullable_in_contact_messages_table.php`
- #17: `2025_12_11_174115_create_installments_table.php`
- #18: `2025_12_11_185347_add_snap_token_to_installments_table.php`
- #19: `2025_12_18_054306_add_penalty_amount_to_installments_table.php`
- #20: `2026_03_07_163601_add_google_auth_to_users.php`
- #21: `2026_03_11_add_customer_profile_fields_to_users_table.php`
- #22: `2026_03_07_195727_simplify_motor_specifications_table.php`
- #25: `2026_03_08_194631_add_interest_rate_to_credit_details_table.php`
- #26: `2026_03_09_000000_add_leasing_provider_to_credit_details.php`
- #27: `2026_03_11_000001_refactor_credit_flow.php`
- #28: `2026_03_11_add_survey_columns_to_credit_details.php`
- #29: `2026_03_11_add_survey_notes_and_completed_to_credit_details.php`
- #30: `2026_03_11_000002_update_credit_status_to_string.php`
- #31: `2026_03_09_000001_add_cancellation_to_transactions.php`
- #32: `2026_03_09_163810_add_customer_address_to_transactions.php`
- #33: `2026_03_11_000002_add_customer_details_to_transactions.php`
- #34: `2026_03_09_000002_create_survey_schedules_table.php`
- #35: `2026_03_11_000002_add_customer_confirmation_to_survey_schedules.php`
- #36: `2026_03_09_000003_add_document_approval_status.php`
- #37: `2026_03_09_000004_add_reminder_sent_to_installments.php`

**Total to delete: 33 migrations**

---

#### **PHASE 4: Keep These (Non-Consolidable)**

- #2: Cache tables
- #3: Jobs tables
- #10: Notifications table
- #11: Sessions table
- #12: Password reset tokens
- #13: Personal access tokens
- #23: Promotions tables
- #24: Leasing tables
- #38: Settings table
- #39: Banners table
- #40: Categories table
- #41: Posts table

**Total to keep: 12 migrations**

---

## 📊 FINAL MIGRATION STRUCTURE (After Consolidation)

### **41 current migrations → 21 final migrations**

**New file breakdown:**

1. `0001_01_01_000000_create_complete_users_table.php` (UPDATED)
2. `0001_01_01_000001_create_cache_table.php`
3. `0001_01_01_000002_create_jobs_table.php`
4. `2026_03_11_000000_create_complete_motors_table.php` (NEW - consolidated)
5. `2026_03_11_000000_create_complete_contact_messages_table.php` (NEW - consolidated)
6. `2026_03_11_000000_create_complete_transactions_table.php` (NEW - consolidated)
7. `2026_03_11_000000_create_complete_credit_details_table.php` (NEW - consolidated)
8. `2026_03_11_000000_create_complete_documents_table.php` (NEW - consolidated)
9. `2026_03_11_000000_create_complete_installments_table.php` (NEW - consolidated)
10. `2026_03_11_000000_create_complete_survey_schedules_table.php` (NEW - consolidated)
11. `2025_11_05_064733_create_complete_notifications_table.php`
12. `2025_11_05_140000_create_sessions_table.php`
13. `2025_11_05_150000_create_password_reset_tokens_table.php`
14. `2025_11_05_160000_create_personal_access_tokens_table.php`
15. `2026_03_07_195731_create_promotions_tables.php`
16. `2026_03_07_195734_create_leasing_tables.php`
17. `2026_03_10_000001_create_settings_table.php`
18. `2026_03_10_000002_create_banners_table.php`
19. `2026_03_10_000003_create_categories_table.php`
20. `2026_03_10_000004_create_posts_table.php`

**Total: ~21 final migrations** (clean and consolidated)

---

## ✅ BENEFITS OF CONSOLIDATION

1. **Cleaner codebase:** 41 → 21 migrations
2. **Single source of truth:** No fragmented table definitions
3. **Better rollback safety:** Complete table definitions in one place
4. **Eliminate data inconsistencies:** No partial updates or duplicate columns
5. **Easier debugging:** Find all table columns in one migration
6. **Improved maintainability:** Future developers see complete schema clearly
7. **Reduces migration run time:** Fewer migrations to execute
8. **Cleaner git history:** No "fix migration" commits

---

## ⚠️ IMPLEMENTATION NOTES

**Before proceeding with consolidation:**

1. **BACKUP the database** - This is a major refactoring
2. **Fresh migrations only** - This only works if you're starting fresh or rolling everything back
3. **If database already migrated:**
    - Create a new "rollback" migration that drops all tables
    - Then applies the consolidated migrations
    - OR manually delete all tables from DB and run fresh migrations
4. **Test in development first** - Run full consolidation in dev environment
5. **Update any seeder files** that might reference old table structures
