# SRB Motor Database ERD (Consolidated)

This document provides the latest Entity Relationship Diagram (ERD) for the SRB Motor application, reflecting the optimized schema where user profiles are merged into the `users` table and physical motor unit tracking has been simplified.

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ TRANSACTIONS : "makes"
    CATEGORIES ||--o{ MOTORS : "classifies"
    MOTORS ||--o{ TRANSACTIONS : "is sold in"
    TRANSACTIONS ||--o{ TRANSACTION_LOGS : "has"
    TRANSACTIONS ||--o{ DOCUMENTS : "requires"
    TRANSACTIONS ||--o| CREDIT_DETAILS : "has if credit"
    LEASING_PROVIDERS ||--o{ CREDIT_DETAILS : "provides"
    CREDIT_DETAILS ||--o{ INSTALLMENTS : "has"
    CREDIT_DETAILS ||--o{ SURVEY_SCHEDULES : "has"

    USERS {
        bigint id PK
        string name
        string email
        string password
        string role
        string phone
        string google_id
        text alamat
        string nik
        string no_ktp
        string no_hp_backup
        string jenis_kelamin
        date tanggal_lahir
        string occupation
        decimal monthly_income
        string nama_ibu_kandung
        timestamp created_at
    }

    MOTORS {
        bigint id PK
        bigint category_id FK
        string name
        string slug
        decimal price
        decimal min_dp_amount
        json colors
        string stock_status
        boolean is_active
    }

    TRANSACTIONS {
        bigint id PK
        bigint user_id FK
        bigint motor_id FK
        string order_type
        string status
        decimal total_price
        string color
        string name "Customer Name"
        string email "Customer Email"
        string phone "Customer Phone"
        string nik "Customer NIK"
        text address "Customer Address"
        string occupation
        decimal monthly_income
        string employment_duration
        string payment_method
        text payment_proof
        string snap_token
        timestamp created_at
    }

    CREDIT_DETAILS {
        bigint id PK
        bigint transaction_id FK
        bigint leasing_provider_id FK
        decimal dp_amount
        int tenor
        decimal interest_rate
        decimal monthly_installment
        string leasing_status
        date leasing_decision_date
        timestamp dp_paid_at
        text rejection_reason
    }

    INSTALLMENTS {
        bigint id PK
        bigint credit_detail_id FK
        int installment_number
        decimal amount
        date due_date
        timestamp paid_at
        string status
        decimal penalty_amount
        decimal total_with_penalty
    }

    DOCUMENTS {
        bigint id PK
        bigint transaction_id FK
        string document_type
        string file_path
        string approval_status
        text rejection_reason
    }

    CATEGORIES {
        bigint id PK
        string name
        string slug
        string icon
    }

    LEASING_PROVIDERS {
        bigint id PK
        string name
        string logo_path
    }

    TRANSACTION_LOGS {
        bigint id PK
        bigint transaction_id FK
        string status_from
        string status_to
        bigint actor_id
        string actor_type
        text notes
    }

    SURVEY_SCHEDULES {
        bigint id PK
        bigint credit_detail_id FK
        date scheduled_date
        time scheduled_time
        string surveyor_name
        string surveyor_phone
        string status
    }
```

## Core Table Descriptions

### users
*Consolidated table containing both authentication data and personal profile information.*
- **nik/no_ktp**: Identification numbers.
- **occupation/monthly_income**: Financial profile for credit assessment.
- **alamat**: Detailed residential address.

### motors
*Catalog of available motorcycle models.*
- **colors**: JSON array of available color variations (e.g. `["Merah", "Hitam", "Putih"]`).
- **min_dp_amount**: Minimum down payment required for credit.
- **stock_status**: General availability (tersedia, habis).

### transactions
*Main record for both Cash and Credit purchases.*
- **order_type**: 'cash' or 'credit'.
- **Customer Fields**: Snapshot of user data at the time of purchase to maintain historical accuracy even if the user profile changes later.
- **color**: Selected color variation for this specific purchase.

### credit_details
*Extra information required specifically for credit transactions.*
- **leasing_status**: Tracking the application progress with the leasing provider (pending, approved, rejected).
- **dp_amount/tenor**: Agreed financial terms.

### installments
*Granular tracking of monthly payments for credit purchases.*
- **penalty_amount**: Automatically calculated if payment is overdue.
- **status**: 'unpaid', 'paid', 'late'.

### documents
*Supporting files (KTP, KK, etc.) uploaded by users for credit verification.*
- **approval_status**: 'pending', 'approved', 'rejected'.
