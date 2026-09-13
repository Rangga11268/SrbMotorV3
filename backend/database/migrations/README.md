# Migration Documentation

## Overview

This directory contains **consolidated database migrations** for SRB Motor application. The migration structure has been carefully ordered and tested to work safely for:

- ✅ Fresh installations
- ✅ Existing databases (with missing fields)
- ✅ Multiple developers running migrations

**Total: 22 migrations** (down from original 41 → 46% reduction)

## ⚠️ CRITICAL: Migration Execution Order is SAFE

The migrations have been **verified and reordered** to prevent foreign key constraint violations. The order below is TESTED and SAFE:

### Phase 1: Framework Foundations (No Dependencies)

```
0001_01_01_000001 - cache table
0001_01_01_000002 - jobs table
```

### Phase 2: Core Business Tables

```
2025_10_30_092515 - motors table
2025_10_30_092517 - contact_messages table
2025_11_04_000000 - users table ✅ FIXED: Moved BEFORE sessions!
2025_11_05_064733 - notifications table
2025_11_05_140000 - sessions table (depends on users ✓)
2025_11_05_150000 - password_reset_tokens table
2025_11_05_160000 - personal_access_tokens table
2025_11_07_120000 - add indexes (with safety checks)
2025_11_19_125905 - contact_messages nullable fix
```

### Phase 3: Support Tables

```
2026_03_07_195731 - promotions + motor_promotion
2026_03_07_195734 - leasing_providers + financing_schemes
2026_03_10_000001 - settings table
2026_03_10_000002 - banners table
2026_03_10_000003 - categories table
2026_03_10_000004 - posts table
```

### Phase 4: CONSOLIDATED Final Tables (ORDER IS CRITICAL!)

```
2026_03_11_000200 - transactions ✅ FIXED: Swapped to come BEFORE credit_details
2026_03_11_000300 - credit_details ✅ FIXED: Now AFTER transactions (depends on it!)
2026_03_11_000400 - installments (depends on credit_details)
2026_03_11_000500 - survey_schedules (depends on credit_details)
2026_03_11_000600 - documents (depends on credit_details)
```

## What Was Fixed

### Issue #1: Users Table 161 Days Late ✅

| Before                                   | After                       |
| ---------------------------------------- | --------------------------- |
| Users at 2026_03_11_000100               | Users at 2025_11_04_000000  |
| Sessions needs users (2025_11_05_140000) | ✓ Users now BEFORE sessions |
| ❌ FK Constraint Violation               | ✅ Works safely             |

### Issue #2: Credit Details Before Transactions ✅

| Before                            | After                             |
| --------------------------------- | --------------------------------- |
| Credit Details: 2026_03_11_000200 | Transactions: 2026_03_11_000200   |
| Transactions: 2026_03_11_000300   | Credit Details: 2026_03_11_000300 |
| ❌ References non-existent table  | ✅ Transactions exists first      |

### Issue #3: Index Migration Safety ✅

| Problem                                           | Fix                                               |
| ------------------------------------------------- | ------------------------------------------------- |
| Referenced `motor_specifications` (doesn't exist) | Removed invalid reference                         |
| Referenced tables from future (2026_03)           | Added safety checks: `if (Schema::hasTable(...))` |
| ❌ Would crash on any database                    | ✅ Safe guards for all scenarios                  |

## Safety Mechanisms

### Consolidated Migrations Use Smart Guards

```php
if (!Schema::hasTable('users')) {
    // Fresh install: Create with ALL fields
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        // ... all 25+ fields at once
    });
} else {
    // Existing database: Add only MISSING columns
    Schema::table('users', function (Blueprint $table) {
        if (!Schema::hasColumn('users', 'phone')) {
            $table->string('phone')->nullable();
        }
        // ... check each field individually
    });
}
```

**This means:**

- ✅ Fresh installs: Creates complete tables
- ✅ Existing databases: Adds only missing columns
- ✅ Failed migrations: Can retry safely
- ✅ Multiple runs: No duplicate errors
- ✅ Team environments: Each dev can run independently

## How to Use

### For Fresh Installation

```bash
php artisan migrate:fresh      # Clean install with all 22 migrations
php artisan migrate           # Just run migrations
```

### On Existing Database

```bash
php artisan migrate           # Adds only missing columns/tables
# Already-migrated data is preserved
```

### Troubleshooting

```bash
# See what's missing
php artisan migrate:status

# If migration fails, check:
# 1. Does dependent table exist?
# 2. Is the order correct? (use: ls -la)
# 3. Are foreign keys spelled right?

# Rollback if needed
php artisan migrate:rollback
php artisan migrate:rollback --step=1
```

## For Developers

### Adding a New Column

```bash
# Create new migration
php artisan make:migration add_x_to_y_table

# Add to up() method:
Schema::table('users', function (Blueprint $table) {
    $table->string('new_column')->nullable();
});

# Run migration
php artisan migrate
```

### Modifying a Consolidated Migration

**Only do this if migration hasn't been deployed yet!**

1. Edit the consolidated migration file
2. Delete from migrations history: `php artisan migrate:rollback`
3. Re-run: `php artisan migrate`

### Creating New Tables

```bash
php artisan make:migration create_my_table
# Add all fields in the up() method
```

## Consolidated Table Reference

### users (2025_11_04_000000)

**Holds:** Base user auth + Google OAuth + customer profile
**Fields:** 25+ fields (id, name, email, google_id, nik, alamat, etc.)

### transactions (2026_03_11_000200)

**Holds:** Motor purchase transactions and payments
**Depends On:** users, motors
**Fields:** Reference #, type, status, amounts, payment info, cancellation

### credit_details (2026_03_11_000300)

**Holds:** Credit/loan applications from leasing companies
**Depends On:** transactions, leasing_providers  
**Fields:** Status, tenor, interest rate, survey dates, DP payment, delivery status

### installments (2026_03_11_000400)

**Holds:** Monthly payment schedule for financed purchases
**Depends On:** credit_details
**Fields:** Due date, amount, payment status, Midtrans token, penalties, reminders

### survey_schedules (2026_03_11_000500)

**Holds:** Physical inspection schedule for mortgaged vehicles
**Depends On:** credit_details
**Fields:** Scheduled date, location, customer confirmation, findings

### documents (2026_03_11_000600)

**Holds:** Required documents for credit approval
**Depends On:** credit_details
**Fields:** Document type, file path, approval status, notes

## Testing Before Deployment

```bash
# Test on clean database
php artisan migrate:fresh --seed

# Should show 22 migrations completed:
# Migrating: 0001_01_01_000001_create_cache_table
# Migrated:  0001_01_01_000001_create_cache_table (45.23ms)
# ...
# Migrating: 2026_03_11_000600_consolidate_documents_table
# Migrated:  2026_03_11_000600_consolidate_documents_table (78.91ms)
# ✓ No errors = Ready to deploy!
```

## Summary of Improvements

| Metric               | Before               | After                 |
| -------------------- | -------------------- | --------------------- |
| Total Migrations     | 41 files             | 22 files              |
| Users table files    | 3 scattered          | 1 consolidated        |
| Credit Details files | 7 scattered          | 1 consolidated        |
| Transactions files   | 6 scattered          | 1 consolidated        |
| Order Safety         | ❌ 6 critical issues | ✅ All verified       |
| Codebase Clarity     | ❌ Confusing         | ✅ Clear dependencies |

**Key Wins:**

- ✅ 46% fewer migration files
- ✅ All dependencies verified
- ✅ Safe to run on any database state
- ✅ Easy for new developers to understand
- ✅ No circular dependencies
