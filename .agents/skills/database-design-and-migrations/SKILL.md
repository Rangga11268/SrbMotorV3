---
name: database-design-and-migrations
description: Database schema design, relational modeling, indexing, foreign keys, and safe zero-downtime migrations for MySQL in SRB Motor.
---

# Database Design and Migrations (SRB Motor)

Use this skill when modifying database tables, writing Laravel migrations, indexing foreign keys, and optimizing queries.

## 1. Schema Design & Normalization (3NF)
- **Engine**: MySQL 8.0+ (`utf8mb4_unicode_ci`).
- **Normalized Tables**:
  - `users`: Core account data (name, email, password, role).
  - `motors`: Master motor catalog with brand, model, price, stock, no_rangka, no_mesin, branch.
  - `branches`: Dedicated branch master table (code, name, address, lat/long, operational_hours, quota).
  - `transactions`: Order records (cash or credit).
  - `credit_details`: 1-to-1 extension of credit transactions (down_payment, tenor, monthly_installment).
  - `documents`: Customer verification files (KTP, KK, Slip Gaji) linked to credit transactions.
  - `installments`: Installment schedules (#0 for DP/booking fee, #1..N for monthly payments).
  - `service_appointments`: Service booking per branch and time slot.
- **Rules**:
  - Do NOT store arbitrary JSON blobs for entity data that requires indexing or foreign key constraints.
  - Enforce referential integrity using `foreignId()->constrained()->onDelete('cascade')`.

## 2. Indexing Strategy
- Index all foreign keys (`user_id`, `motor_id`, `transaction_id`, `branch`).
- Index search and filter columns (`brand`, `status`, `created_at`, `due_date`).
- For multi-column queries, follow the ESR rule (Equality, Sort, Range).

## 3. Migration Best Practices
- Place migrations in `backend/database/migrations/`.
- Ensure each migration has a reversible `down()` method.
- Always test migrations with `php artisan migrate` before committing.
