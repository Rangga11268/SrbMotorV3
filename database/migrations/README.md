# Migration Documentation

## Overview

This directory contains **consolidated database migrations** for SRB Motor application. Instead of many incremental migrations, we now have a clean, organized structure with **22 total migrations** (down from 41).

## Migration Structure

### 📦 Framework Migrations (5 files)
These are Laravel's built-in tables for caching, job queues, sessions, and authentication:

```
0001_01_01_000001_create_cache_table.php
0001_01_01_000002_create_jobs_table.php
2025_11_05_140000_create_sessions_table.php
2025_11_05_150000_create_password_reset_tokens_table.php
2025_11_05_160000_create_personal_access_tokens_table.php
```

### 🎯 Business Core Tables (11 files)
These are the original application tables that are stable and don't change often:

```
2025_10_30_092515_create_complete_motors_table.php
2025_10_30_092517_create_complete_contact_messages_table.php
2025_11_05_064733_create_complete_notifications_table.php
2025_11_07_120000_add_indexes_to_tables.php
2025_11_19_125905_make_subject_nullable_in_contact_messages_table.php
2026_03_07_195731_create_promotions_tables.php
2026_03_07_195734_create_leasing_tables.php
2026_03_10_000001_create_settings_table.php
2026_03_10_000002_create_banners_table.php
2026_03_10_000003_create_categories_table.php
2026_03_10_000004_create_posts_table.php
```

### ✅ Consolidated Final Tables (6 files)
These are **clean, consolidated versions** that replaced 19 fragmented migrations:

```
2026_03_11_000100_consolidate_users_table.php
2026_03_11_000200_consolidate_credit_details_table.php
2026_03_11_000300_consolidate_transactions_table.php
2026_03_11_000400_consolidate_installments_table.php
2026_03_11_000500_consolidate_survey_schedules_table.php
2026_03_11_000600_consolidate_documents_table.php
```

Each consolidated migration includes **ALL fields** that were previously scattered across multiple files.

---

## What Changed

### Before (41 migrations)
❌ Users table scattered across 3 files:
- Create users (2025-11-05)
- Add Google auth (2026-03-07)
- Add customer profile (2026-03-11)

❌ Credit Details table scattered across 7 files:
- Create credit_details (2025-11-05)
- Add interest_rate (2026-03-08)
- Add leasing_provider (2026-03-09)
- Add survey columns (2026-03-11) × 2
- Refactor credit flow (2026-03-11)

❌ Transactions table scattered across 6 files:
- Create transactions (2025-11-05)
- Add customer info (2025-11-07)
- Add cancellation (2026-03-09)
- Add customer details (2026-03-11)
- Add customer address (2026-03-09) × 2

❌ Installments table scattered across 4 files:
- Create installments (2025-12-11)
- Add snap_token (2025-12-11)
- Add penalty_amount (2025-12-18)
- Add reminder_sent (2026-03-09)

### After (22 migrations)
✅ **Clean consolidated structure** - Each table has ONE final migration with ALL fields

---

## How to Use

### Fresh Installation
```bash
# Run all migrations - will create clean database with consolidated structure
php artisan migrate

# If you need to start fresh
php artisan migrate:fresh
php artisan migrate:fresh --seed
```

### For Developers
When you need to **modify a table**, edit one of the consolidated migration files:

1. `consolidate_users_table.php` - All user-related fields
2. `consolidate_credit_details_table.php` - All credit/loan fields
3. `consolidate_transactions_table.php` - All transaction fields
4. `consolidate_installments_table.php` - All installment/payment fields
5. `consolidate_survey_schedules_table.php` - All survey fields
6. `consolidate_documents_table.php` - All document/approval fields

If you need to **add a new column** to users table, add it to `consolidate_users_table.php` and create a new migration that adds just that column:

```php
// 2026_03_12_000001_add_new_column_to_users.php
Schema::table('users', function (Blueprint $table) {
    $table->string('new_column')->nullable();
});
```

---

## Consolidated Table Schemas

### users
- **Original fields:** id, name, email, password, role, timestamps
- **Google OAuth:** google_id, profile_photo_path, phone
- **Customer Profile:** alamat, nik, no_ktp, no_hp_backup, jenis_kelamin, tanggal_lahir, pekerjaan, pendapatan_bulanan, nama_ibu_kandung

### credit_details
- **Base:** id, transaction_id, leasing_provider_id, status, reference_number
- **Financials:** tenor, interest_rate, monthly_installment, total_interest
- **Documents:** verification_notes, verified_at
- **Survey:** survey_scheduled_date, survey_completed_at, survey_notes
- **DP Payment:** dp_amount, dp_paid_at, dp_payment_method
- **Unit/Delivery:** unit_prepared_at, ready_for_delivery_at, delivered_at
- **Completion:** completed_at, completion_notes, is_completed
- **Customer Confirmation:** customer_confirms_survey, customer_survey_confirmed_at

### transactions
- **Base:** id, user_id, reference_number, transaction_type, status, motor_id
- **Prices:** motor_price, total_price, discount_amount, final_price
- **Customer Contact:** phone, address, city
- **Payment:** payment_method, payment_status, payment_date, payment_proof
- **Cancellation:** is_cancelled, cancelled_at, cancellation_reason
- **Notes:** notes, internal_notes

### installments
- **Base:** id, credit_detail_id, installment_number, due_date, amount, status
- **Payment:** paid_date, payment_method, payment_proof, snap_token
- **Late Payment:** is_overdue, days_overdue, penalty_amount, total_with_penalty
- **Reminder:** reminder_sent, reminder_sent_at

### survey_schedules
- **Base:** id, credit_detail_id, scheduled_date, status, location
- **Notes:** notes, survey_result, findings
- **Customer Confirmation:** customer_confirms, customer_confirmed_at, customer_confirmation_notes

### documents
- **Base:** id, credit_detail_id, document_type, description
- **File Info:** file_path, file_name, file_size
- **Approval:** status, approval_status, approval_notes, approved_at, rejected_at

---

## Summary

✅ **Cleaner:** Down from 41 to 22 migrations (46% reduction)
✅ **Easier to Maintain:** All table fields in one place
✅ **Better for Teams:** New developers understand structure faster
✅ **Organized:** Grouped by type (framework, business, consolidated)

---

See [docs/MIGRATIONS_ANALYSIS.md](../docs/MIGRATIONS_ANALYSIS.md) for detailed before/after analysis.
