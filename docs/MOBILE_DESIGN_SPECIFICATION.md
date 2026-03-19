# 📱 SRB MOTOR - MOBILE APP DESIGN SPECIFICATION

**Project**: SRB Motor Mobile App (Flutter)  
**Version**: 1.0 - Initial Design  
**Date**: March 18, 2026  
**Status**: 🟢 Ready for Development  
**Course**: Web Programming 3 - Mobile Extension

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Analysis](#system-analysis)
3. [Architecture & Infrastructure](#architecture--infrastructure)
4. [Database Strategy](#database-strategy)
5. [Mobile Features & User Flows](#mobile-features--user-flows)
6. [UI/UX Specification](#uiux-specification)
7. [Technology Stack](#technology-stack)
8. [API Integration & Backend Adaptation](#api-integration--backend-adaptation)
9. [Data Security & Sync Strategy](#data-security--sync-strategy)
10. [Development Roadmap](#development-roadmap)
11. [Performance & Optimization](#performance--optimization)

---

## EXECUTIVE SUMMARY

### Project Overview

SRB Motor adalah platform penjualan dan pembiayaan motor online berbasis web (Laravel + React). Proyek ini akan dikembangkan menjadi aplikasi mobile native menggunakan **Flutter** untuk menjangkau lebih banyak pengguna dengan pengalaman yang optimal di smartphone.

### Mobile App Objectives

| Objective            | Target                          | Success Metric       |
| :------------------- | :------------------------------ | :------------------- |
| **Browse Motors**    | Catalog dengan filter real-time | 3-tap browsing       |
| **Submit Orders**    | Cash & Credit pemesanan         | 5-step checkout      |
| **Track Status**     | Real-time order tracking        | Status notifications |
| **Payment**          | Midtrans integration            | Secure payment flow  |
| **Customer Support** | In-app messaging & WhatsApp     | <2hour response      |
| **Admin Management** | Dashboard & approvals           | Web feature parity   |

### Key Advantages Over Web

```
✅ Offline capability (cache motors catalog)
✅ Push notifications (order updates)
✅ Biometric authentication (TouchID/FaceID)
✅ Direct WhatsApp integration
✅ Camera for document upload
✅ Native experience (smooth scrolling, animations)
✅ Notification deep linking
✅ Faster load times
```

### Scope

```
📱 User Features:
  ├── Browse & Filter Motors
  ├── View Motor Details & Financing Schemes
  ├── Submit Cash & Credit Orders
  ├── Track Order Status (Real-time)
  ├── Upload Documents (Digital Camera)
  ├── View & Pay Installments
  ├── Notification Center
  ├── User Profile Management
  ├── WhatsApp Support
  └── Mobile Payment (Midtrans)

👨‍💼 Admin Features:
  ├── Transaction Management
  ├── Credit Application Review
  ├── Document Approval
  ├── User & Motor Management
  ├── Basic Dashboard (KPIs)
  └── Notification Management
```

---

## SYSTEM ANALYSIS

### Current Web System (Backend Reference - VERIFIED)

```
Web Version Stack:
├── Backend:       Laravel 12 (PHP 8.2+)
├── Frontend:      React 19.2+ Inertia.js (Server-driven rendering)
├── Database:      MySQL 8.0+ (shared with mobile)
├── Payment:       Midtrans Snap API
├── Messaging:     Fonnte WhatsApp API (via WhatsAppService)
├── File Storage:  Local filesystem (public/storage path)
├── Authentication: Laravel Session + Google OAuth (will add JWT for mobile)
└── Architecture:  Repository pattern + Service layer

Active Tables (13 total):
  ├── users - User accounts (20 cols), role-based (admin/customer), consolidated
  ├── motors - Motor inventory (14 cols), tersedia boolean, colors JSON
  ├── transactions - BOTH cash & credit orders (33 cols), statuses enum
  ├── credit_details - Credit-specific workflow (18 cols), 8-stage processing
  ├── installments - Payment schedule (21 cols), Midtrans integration
  ├── documents - File uploads (15 cols), approval workflow
  ├── categories - Motor + Post categories (9 cols)
  ├── leasing_providers - Finance partners (5 cols)
  ├── transaction_logs - Audit trail (12 cols), every status change logged
  ├── survey_schedules - Property assessments (19 cols), credit workflow
  ├── posts - Blog/News articles (12 cols), featured images, slug-based
  ├── settings - Global configuration (8 cols), category-grouped
  └── notifications - User alerts (8 cols), database-stored

Dropped Features (NOT in mobile spec):
  ✗ Promotions (was motor discount badges)
  ✗ Banners (was homepage carousel)
  ✗ ContactMessages (was form submissions)

Key Services (Business Logic):
  ├── TransactionService - Create orders, manage installments
  ├── CreditService - 8-stage credit approval workflow (FSM pattern)
  ├── PaymentService - Midtrans status mapping & settlement
  └── WhatsAppService - Customer notifications via Fonnte

Key Controllers:
  ├── Public: HomeController, MotorGalleryController, NewsController
  ├── Auth: AuthController, GoogleAuthController
  ├── Customer: TransactionController, InstallmentController, ProfileController
  └── Admin: CreditController, MotorController, UserController, NewsController,
             CategoriesController, LeasingProviderController
```

### Existing Infrastructure We'll Leverage

| Component           | Current                               | Mobile Usage                    |
| :------------------ | :------------------------------------ | :------------------------------ |
| **API Endpoints**   | /motors, /transactions, /installments | Expose via REST API             |
| **Database**        | MySQL                                 | Shared backend (no separate DB) |
| **Payment Gateway** | Midtrans                              | Same Snap Token integration     |
| **Messaging**       | Fonnte WhatsApp                       | Push + WhatsApp notifications   |
| **Authentication**  | Laravel Session + Google OAuth        | JWT + OAuth for mobile          |
| **File Storage**    | Local filesystem                      | CORS-enabled upload             |

### Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│         CURRENT STATE (Web-only)                        │
│                                                         │
│  Client: React Browser ─────────────────┐             │
│                                          ↓             │
│                              Laravel API (Inertia)    │
│                                   ↓                    │
│                          MySQL Database               │
│                                   ↓                    │
│           ┌────────────┬──────────┴──────────┬─────┐  │
│           ↓            ↓                     ↓     ↓  │
│       Midtrans     Fonnte WhatsApp    Local Storage  │
│                                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│      FUTURE STATE (Web + Mobile)                       │
│                                                         │
│  Client Web        Client Mobile                       │
│  (React Browser) ─────────┬─────── (Flutter App)      │
│         │                  │                           │
│         └──────────┬───────┘                           │
│                    ↓                                    │
│        Laravel API (REST+Inertia)                      │
│         Added Endpoints:                                │
│         - /api/mobile/*                                 │
│         - JWT Authentication                            │
│         - File Handling for Camera                      │
│                    ↓                                    │
│            MySQL Database (shared)                      │
│                    ↓                                    │
│        ┌──────────┬──────────┬─────────┐              │
│        ↓          ↓          ↓         ↓              │
│     Midtrans  Fonnte+FCM  Storage  Firebase          │
│                                    (optional)          │
│                                                        │
└─────────────────────────────────────────────────────────┘
```

### Database Compatibility Analysis

✅ **Fully Compatible** - No schema changes needed

```
All 13 tables designed for multi-platform access:
- No web-specific data structures
- Relationships normalized (1:N, 1:1)
- Timestamps on all transactional tables
- Proper indexing for queries
```

✅ **API-Ready Models**

```
Laravel Models already support:
- Resource API serialization
- Relationship loading control
- Query optimization (eager loading)
- Pagination (cursor & offset)
```

---

## ARCHITECTURE & INFRASTRUCTURE

### Mobile App Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│              FLUTTER MOBILE APP ARCHITECTURE              │
└──────────────────────────────────────────────────────────┘

PRESENTATION LAYER
├── Screens/Pages (StatefulWidget, StatelessWidget)
│   ├── Authentication Screens
│   │   ├── Login/Sign Up
│   │   ├── Password Reset
│   │   └── Biometric Auth
│   │
│   ├── Customer Screens
│   │   ├── Home (Featured Motors)
│   │   ├── Motor Catalog (Filter/Search)
│   │   ├── Motor Detail
│   │   ├── Order Flow (Cash & Credit)
│   │   ├── Order Tracking
│   │   ├── Payment/Installments
│   │   ├── Documents Upload
│   │   ├── Profile
│   │   └── Notifications
│   │
│   └── Admin Screens
│       ├── Admin Dashboard
│       ├── Transaction Management
│       ├── Credit Review
│       ├── Document Approval
│       ├── Motor Management
│       └── Reports
│
├── Widget/Components (Reusable)
│   ├── Motor Cards
│   ├── Order Forms
│   ├── Status Badges
│   ├── Document Upload Widget
│   ├── Payment Status Card
│   ├── Filter Panel
│   └── Custom AppBar
│
└── Animations & Transitions
    ├── Page transitions
    ├── Loading animations
    └── Success/Error animations

BUSINESS LOGIC LAYER (BLoC / Provider / Riverpod)
├── Authentication Service
│   ├── Login/Logout
│   ├── Token management
│   ├── Biometric auth
│   └── Session refresh
│
├── Motor Service
│   ├── getMotors() [with caching]
│   ├── getMotorDetail()
│   ├── searchMotors()
│   ├── filterMotors()
│   └── getFinancingSchemes()
│
├── Transaction Service
│   ├── createCashOrder()
│   ├── createCreditOrder()
│   ├── getOrderStatus()
│   ├── updateOrder()
│   └── cancelOrder()
│
├── Payment Service
│   ├── generateSnapToken()
│   ├── initiatePayment()
│   └── handlePaymentCallback()
│
├── Document Service
│   ├── uploadDocument()
│   ├── getDocumentList()
│   └── deleteDocument()
│
├── Notification Service
│   ├── getNotifications()
│   ├── markAsRead()
│   └── handleDeepLinks()
│
└── Admin Service
    ├── getTransactions()
    ├── approveCreditDetail()
    ├── approveDocument()
    ├── updateTransactionStatus()
    └── generateReports()

DATA LAYER (Repository Pattern)
├── Local Storage
│   ├── SQLite (cached motors, user prefs)
│   ├── SharedPrefs (tokens, settings)
│   └── File system (temp images)
│
├── Remote API (HTTP Client)
│   ├── Dio/http package
│   ├── Request interceptors (auth)
│   ├── Error handling
│   └── Timeout policies
│
└── State Management
    ├── Current user state
    ├── Motor catalog cache
    ├── Order tracking state
    └── UI state (loading, error)

EXTERNAL SERVICES
├── Midtrans Payment Gateway
├── Firebase Cloud Messaging (FCM)
├── Firebase Analytics (optional)
├── Fonnte WhatsApp API
├── Google Auth / Firebase Auth
└── Device camera & gallery

UTILITIES & HELPERS
├── API Client Configuration
├── Logger & Debug Tools
├── Date/Time formatters
├── Currency formatters
├── Validators
└── Constants & Config
```

### State Management Approach

```
Recommended: Provider + Riverpod (Light & Performant)

Provider Hierarchy:
└── RootApp
    ├── authProvider (JWT token, user data)
    ├── motorProvider (motor catalog, cache)
    ├── transactionProvider (orders, transactions)
    ├── paymentProvider (payment state, snap token)
    └── notificationProvider (notifications, badge count)

Alternative: BLoC (Enterprise-grade, heavy)
Alternative: GetX (Simple, quick)

Choice: Riverpod for optimal balance
```

---

## DATABASE STRATEGY

### Local Database (SQLite)

**Purpose**: Offline support, caching, faster UI load

```
Flutter Local Tables:

1. cached_motors
   ├── id (PK)
   ├── motor_id (remote FK)
   ├── name
   ├── brand
   ├── model
   ├── price
   ├── image_path
   ├── details
   ├── tersedia
   ├── colors (JSON)
   ├── cached_at (TIMESTAMP)
   └── expires_at (TIMESTAMP)

2. cached_transactions
   ├── id (PK)
   ├── transaction_id (remote FK)
   ├── reference_number
   ├── status
   ├── motor_name
   ├── total_price
   ├── sync_status (pending/synced)
   └── synced_at (TIMESTAMP)

3. user_preferences
   ├── id (PK)
   ├── user_id
   ├── theme_mode (light/dark)
   ├── notification_enabled
   ├── language
   ├── last_search_terms (JSON)
   ├── favorite_motors (JSON array)
   └── updated_at (TIMESTAMP)

4. temporary_uploads
   ├── id (PK)
   ├── document_type
   ├── file_path
   ├── file_name
   ├── file_size
   ├── upload_status (pending/failed)
   ├── error_message
   └── created_at (TIMESTAMP)
```

**Sync Strategy**:

```
1. Cache invalidation: 24 hours for catalogs, 5 min for transactions
2. Smart sync: Only upload when WiFi available
3. Conflict resolution: Server-side wins (optimistic update on UI)
4. Periodic refresh: Background task every 30 minutes
```

### Remote API Integration

**Shared database with web** - No separate mobile DB needed

**API Adaptation Required on Backend**:

```php
// New/Modified Laravel Routes (app/routes/api.php)

// Existing endpoints (already available in Laravel)
GET    /motors                         // List motors
GET    /motors/{id}                    // Motor detail
GET    /motors?search=...&brand=...    // Search & filter

POST   /transactions                   // Create order (web-compatible)
GET    /transactions/{id}              // Get order status

POST   /documents                      // Upload documents
GET    /documents?transaction_id=...   // Get docs

POST   /installments/{id}/pay-online   // Pay installment

// New mobile-specific endpoints needed:
POST   /api/mobile/auth/login          // Mobile JWT login
POST   /api/mobile/auth/logout         // Invalidate token
POST   /api/mobile/auth/refresh        // Refresh JWT token
POST   /api/mobile/fcm-token           // Register FCM token

GET    /api/mobile/motors              // Optimized list (pagination)
POST   /api/mobile/motors/{id}/favorites  // Favorite motor

GET    /api/mobile/notifications       // Paginated notifications
PATCH  /api/mobile/notifications/{id}  // Mark as read

POST   /api/mobile/documents/upload    // File upload with progress
POST   /api/mobile/documents/delete/{id}  // Delete document

GET    /api/mobile/profile             // User profile
PATCH  /api/mobile/profile             // Update profile
POST   /api/mobile/profile/avatar      // Upload avatar

GET    /api/mobile/financing-schemes   // Available credit schemes
```

**Headers & Authentication**:

```
All requests include:
- Authorization: Bearer {JWT_TOKEN}
- X-App-Version: 1.0
- X-Platform: ios / android
- X-Device-Id: unique device identifier

JWT Token Structure:
{
  "sub": user_id,
  "email": "user@example.com",
  "role": "customer|admin",
  "iat": timestamp,
  "exp": timestamp + 7days,
  "iss": "SrbMotor.com"
}
```

---

## MOBILE FEATURES & USER FLOWS

### Feature Matrix: Web vs Mobile

| Feature                | Web ✓ |   Mobile   | Priority |
| :--------------------- | :---: | :--------: | :------- |
| **Browse Motors**      |   ✓   |     ✓      | P0       |
| Search & Filter        |   ✓   |     ✓      | P0       |
| Motor Detail View      |   ✓   |     ✓      | P0       |
| Cash Order             |   ✓   |     ✓      | P0       |
| Credit Order           |   ✓   |     ✓      | P0       |
| Document Upload        |   ✓   | ✓ (Camera) | P0       |
| Order Tracking         |   ✓   |     ✓      | P0       |
| Payment (Midtrans)     |   ✓   |     ✓      | P0       |
| Installment Management |   ✓   |     ✓      | P1       |
| Notifications          |   ✓   |  ✓ (Push)  | P0       |
| User Profile           |   ✓   |     ✓      | P1       |
| Biometric Auth         |   ✗   |     ✓      | P1       |
| Offline Motor Catalog  |   ✗   |     ✓      | P2       |
| Motor Comparison       |   ✓   |     ✓      | P2       |
| Favorite Motors        |   ✗   |     ✓      | P2       |
| Admin Dashboard        |   ✓   |  Limited   | P2       |
| Admin Approvals        |   ✓   |     ✓      | P2       |

### Customer User Flows

#### 1. Browse & Order (Cash)

```
Start: App Launch
  ↓
Login/Biometric [Done]
  ↓
Home Screen (Featured Motors, Categories)
  ↓
Browse Catalog (Search/Filter)
  ├─→ View Motor Detail
  │   ├─→ See Financing Schemes
  │   ├─→ Add to Favorites ❤️
  │   └─→ Share via WhatsApp
  │
  └─→ Click "Pesan Tunai" (Cash Order)
      ↓
      Order Form (Name, Phone, Occupation, Notes)
        └─→ Validate Input
      ↓
      Order Confirmation
        ├─→ Motor Details
        ├─→ Total Price
        ├─→ Booking Fee (if set)
        └─→ "Bayar Sekarang" / "Bayar Nanti"
      ↓
      Midtrans Payment (if Bayar Sekarang)
        ├─→ Choose Payment Method
        ├─→ Input Card / Bank Details
        └─→ Success ✓
      ↓
      Order Confirmation Screen
        ├─→ Order ID
        ├─→ Invoice
        └─→ Track Order Button
      ↓
      Real-time Tracking
        ├─→ New Order
        ├─→ Waiting Payment
        ├─→ Unit Preparation
        ├─→ Ready for Delivery
        └─→ Completed

End: Order placed & trackable
```

#### 2. Order (Credit) - Complex Flow

```
Start: App Launch
  ↓
Browse Motor
  ↓
Click "Pesan Cicilan"
  ↓
Credit Application Form
  ├─→ Personal Info (Name, Phone, NIK, Address)
  ├─→ Income Info (Monthly Income, Occupation, Duration)
  ├─→ Credit Details:
  │   ├─→ Tenor (12-60 months)
  │   ├─→ Down Payment Amount
  │   └─→ Leasing Provider (Auto or Manual)
  └─→ Save Application
  ↓
Documents Upload Screen
  (Multiple uploads allowed)
  ├─→ KTP (ID Card)
  │   ├─→ Camera Capture OR
  │   ├─→ Gallery Select
  │   └─→ Preview before upload
  │
  ├─→ NPWP (Tax ID) - Optional
  ├─→ Payslip
  ├─→ Bank Statement (3 months)
  ├─→ Selfie
  └─→ Additional Documents
  ↓
Review & Submit [All docs uploaded]
  ├─→ Show: Application Summary
  ├─→ Show: Documents Checklist
  └─→ Confirm Submit
  ↓
Submission Confirmation
  ├─→ Application ID
  ├─→ Status: "Verifying Documents"
  └─→ Next steps notification
  ↓
Real-time Status Tracking
  ├─→ verifikasi_dokumen
  │   └─→ See each document approval status
  ├─→ dikirim_ke_leasing
  │   └─→ See leasing provider details
  ├─→ survey_dijadwalkan
  │   ├─→ Survey date & time
  │   ├─→ Surveyor info
  │   └─→ Confirm attendance
  ├─→ menunggu_keputusan_leasing
  ├─→ disetujui (Approved!)
  │   └─→ See loan terms & conditions
  ├─→ dp_dibayar
  │   └─→ Pay DP via Midtrans
  └─→ invoice_penyelesaian
      └─→ DONE

Push Notifications at each stage

End: Credit approved, ready for delivery
```

#### 3. Track Order & Pay Installments

```
Start: Transactions Tab
  ↓
List All Orders (with pagination)
  ├─→ Status Badge (New, In Progress, Done)
  ├─→ Motor Name
  ├─→ Amount
  └─→ Last Updated
  ↓
Click Order → Detail View
  ├─→ Motor Photo
  ├─→ Order Info (ID, Type, Total)
  ├─→ Status Timeline (Step-by-step)
  │   └─→ Each step shows timestamp
  ├─→ Installments List (if Credit)
  │   ├─→ Installment #1, #2, ...
  │   ├─→ Amount, Due Date
  │   ├─→ Status (Paid, Pending, Overdue)
  │   └─→ "Pay Now" button
  └─→ Timeline Events
      └─→ Full history of status changes
  ↓
Click "Pay Now" → Payment
  ├─→ Confirm Amount
  ├─→ Choose Payment Method
  ├─→ Midtrans Modal
  └─→ Success ✓
  ↓
Installment Updated
  ├─→ Status: Paid ✓
  ├─→ Paid At: [timestamp]
  └─→ Next Installment Info

End: Installment paid
```

### Admin User Flows

#### 1. Transaction Management

```
Admin Login
  ↓
Dashboard (KPI Cards)
  ├─→ New Orders Today
  ├─→ Pending Approvals
  ├─→ Total Revenue (this month)
  └─→ Active Users
  ↓
Transactions List
  ├─→ Filter: Status, Type, Date Range
  ├─→ Search: Order ID, Customer Name
  └─→ Sort: Latest, Oldest, Amount
  ↓
Click Order → Detail View
  ├─→ Customer Info
  ├─→ Motor Info
  ├─→ Order Timeline
  ├─→ Payment Status
  └─→ Actions:
      ├─→ Update Status
      ├─→ Add Notes
      └─→ Send Message to Customer

End: Manage order flow
```

#### 2. Credit Approval

```
Admin Dashboard
  ↓
Credit Applications (Filter: Pending, Approved, Rejected)
  ↓
Click Application → Review
  ├─→ Customer Info
  ├─→ Credit Details
  │   ├─→ Tenor
  │   ├─→ DP Amount
  │   └─→ Leasing Provider
  ├─→ Documents
  │   ├─→ KTP - [View] [Approve] [Reject]
  │   ├─→ NPWP - [View] [Approve] [Reject]
  │   ├─→ Payslip - [View] [Approve] [Reject]
  │   └─→ Bank Statement - [View] [Approve] [Reject]
  │
  └─→ Actions:
      ├─→ Approve All Documents
      ├─→ Send to Leasing
      ├─→ Schedule Survey
      └─→ Reject Application
  ↓
After Approval
  ├─→ Auto-notify customer (Push + WhatsApp)
  └─→ Move to next stage

End: Credit approved
```

---

## UI/UX SPECIFICATION

### Design System Tokens (Adapted from Web)

#### Color Palette

```
Primary: #2563EB (Blue - main actions)
Primary Dark: #1E40AF (Darker blue - hover)
Secondary: #10B981 (Green - success, approved)
Danger: #EF4444 (Red - cancel, rejected)
Warning: #F59E0B (Amber - pending)
Neutral: #6B7280 (Gray - secondary text)
Background: #FFFFFF (White)
Background Light: #F9FAFB (Off-white for sections)
Border: #E5E7EB (Light gray)
Text Primary: #111827 (Dark gray - headings)
Text Secondary: #6B7280 (Gray - body)
```

#### Typography (Mobile-optimized)

```
Font Family: Inter (fallback: system font)

Display (Hero):
  Size: 28px
  Weight: 700
  Line-height: 1.2
  Letter-spacing: -0.5px

Heading 1:
  Size: 24px
  Weight: 700
  Line-height: 1.2

Heading 2:
  Size: 20px
  Weight: 600
  Line-height: 1.25

Body Large:
  Size: 16px
  Weight: 500
  Line-height: 1.5

Body Regular:
  Size: 14px
  Weight: 400
  Line-height: 1.5

Small / Helper:
  Size: 12px
  Weight: 400
  Line-height: 1.4
  Color: #6B7280 (gray)
```

#### Spacing System

```
Base unit: 4px

Spacing Scale:
  xs:   4px
  sm:  8px
  md:  16px
  lg:  24px
  xl:  32px
  2xl: 48px

Border Radius:
  sm: 4px (inputs, small elements)
  md: 8px (cards, modals)
  lg: 16px (large sections)
  full: 9999px (circles, pills)
```

### Screen Layouts

#### 1. Home Screen (Customer)

```
┌─────────────────────────┐
│ [Menu] SRB Motor  [Bell]│  ← AppBar (24dp height)
├─────────────────────────┤
│ Welcome, Budi! 👋       │  ← Greeting + User name
│                         │
│ Featured Motors         │  ← Section title
│ ┌─────────────────────┐ │
│ │ [Yamaha NMAX]      │ │  ← Featured motor card
│ │ Rp 31.200.000      │ │
│ │ [View Details]     │ │
│ └─────────────────────┘ │
│                         │
│ Browse by Category      │  ← Horizontal scroll
│ ┌──┬──┬──┬──┐          │
│ │ Sport │ Matic │ ...  │
│ └──┴──┴──┴──┘          │
│                         │
│ Latest Motors           │  ← Scrollable list
│ ┌──────────┬──────────┐ │
│ │ [Image] │ Honda PCX│ │  ← Grid: 2 columns
│ │         │ Rp 24M  │ │
│ │ [Image] │ Yamaha  │ │     Each card tappable
│ │         │ Rp 31M  │ │
│ └──────────┴──────────┘ │
│                         │
│  [View All Motors] ──→  │  ← CTA
│                         │
└─────────────────────────┘
```

#### 2. Motor Catalog (Search & Filter)

```
┌─────────────────────────┐
│ ← [Search Motors......] │  ← Sticky search bar
├─────────────────────────┤
│ ⚙️ Filters              │  ← Filter button (shows count)
├─────────────────────────┤
│ Motors (12)             │  ← Result count
│                         │
│ ┌──────────┬──────────┐ │
│ │ [IMG]    │ [IMG]    │ │  ← 2-column grid
│ │ Honda    │ Yamaha   │ │
│ │ PCX      │ NMAX     │ │
│ │ Rp 24M   │ Rp 31M   │ │
│ │          │          │ │
│ │ [TERJUAL]│ Available│ │  ← Status badge
│ └──────────┴──────────┘ │
│                         │
│ ┌──────────┬──────────┐ │
│ │ [IMG]    │ [IMG]    │ │
│ └──────────┴──────────┘ │
│                         │
│  Load more... [🔄]     │  ← Bottom pagination
│                         │
└─────────────────────────┘

Filter Panel (Modal):
┌─────────────────────────┐
│ Filters      [  ✕  ]    │  ← Header + close
├─────────────────────────┤
│ Brand                   │  ← Dropdown
│ [Pilih Brand ▼]        │
│                         │
│ Type                    │
│ [Semua Tipe ▼]         │
│                         │
│ Year                    │
│ [2024 ▼]               │
│                         │
│ Price Range             │  ← Slider
│ Rp 20M ←─ slider ─→ 40M │
│                         │
│ Stock Status            │  ← Radio buttons
│ ○ Available             │
│ ○ Including Sold        │
│                         │
│ [Reset]  [Apply Filter] │  ← Actions (bottom)
│                         │
└─────────────────────────┘
```

#### 3. Motor Detail

```
┌─────────────────────────┐
│ ← Informasi Motor       │  ← Header
├─────────────────────────┤
│ [Large Motor Image]     │  ← Full-width image
│       250px height      │
│ [◀     ▶] [1/3]        │  ← Image carousel
├─────────────────────────┤
│ Yamaha NMAX Turbo 2024  │  ← Motor name
│ ★★★★★ (142 reviews)    │
│                         │
│ Rp 31.200.000           │  ← Price (large)
│                         │
│ Specs:                  │  ← Key specs
│ 🏷️ Type: Sport Matic    │
│ 📅 Year: 2024           │
│ 🏁 Condition: New       │
│                         │
│ 📝 Description:         │  ← Details
│ Desain sporty yang      │
│ agresif dengan performa │
│ mesin yang tangguh...   │
│                         │
│ Financing Options       │  ← Schemes
│ ┌─────────────────────┐ │
│ │ BCA Finance         │ │
│ │ DP: 10% | 24 bulan  │ │
│ │ Rp 1.3M / bulan     │ │
│ └─────────────────────┘ │
│                         │
│ [❤️ Save] [Compare]    │  ← Actions
│                         │
│ Colors Available        │  ← Color picker
│ [Red] [Blue] [Silver]  │
│                         │
├─────────────────────────┤
│ [Pesan Tunai]           │  ← CTA buttons
│ [Pesan Cicilan]         │
│                         │
└─────────────────────────┘
```

#### 4. Order Tracking

```
┌─────────────────────────┐
│ ← Order #ORD-00123      │
├─────────────────────────┤
│ Status: Unit Preparation│  ← Current status (colored)
│ Updated: 2 hours ago    │
│                         │
│ Motor:                  │  ← Quick info
│ Yamaha NMAX Turbo       │
│ Rp 31.200.000           │
│                         │
│ Timeline:               │  ← Status flow
│ ✓ New Order             │
│ 📅 [date]               │  ← Completed (green)
│                         │
│ ✓ Payment Confirmed     │
│ 📅 [date]               │
│                         │
│ ⏳ Unit Preparation     │  ← In progress (blue)
│ Started 2 hours ago     │
│                         │
│ ○ Ready for Delivery    │  ← Upcoming (gray)
│ Estimated: [date]       │
│                         │
│ ○ Completed             │
│                         │
│ Actions:                │  ← Interactive
│ [Chat with Admin]       │
│ [Download Invoice]      │
│                         │
│ Installments (if Credit)│
│ ┌─────────────────────┐ │
│ │ #1: Rp 3.120.000   │ │
│ │ Due: 28 Mar 2026    │ │
│ │ Status: Paid ✓      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ #2: Rp 3.120.000   │ │
│ │ Due: 28 Apr 2026    │ │
│ │ Status: Pending     │ │
│ │ [Pay Now]           │ │
│ └─────────────────────┘ │
│                         │
│ [Share Order]           │
│                         │
└─────────────────────────┘
```

#### 5. Payment/Checkout

```
┌─────────────────────────┐
│ ← Konfirmasi Pesanan    │
├─────────────────────────┤
│ Motor:                  │
│ Yamaha NMAX Turbo       │
│ [Small thumbnail]       │
│                         │
│ Price Breakdown:        │
│ ─────────────────       │
│ Motor Price             │
│ Rp 31.200.000           │
│                         │
│ Booking Fee             │
│ Rp 3.000.000            │
│                         │
│ Total:                  │
│ Rp 34.200.000           │  ← Bold, large
│                         │
│ Payment Method:         │
│ [Choose Method ▼]       │  ← Dropdown
│                         │
│ Customer Info:          │  ← Pre-filled
│ Budi Santoso            │
│ 081234567890            │
│ Guru                    │
│                         │
│ [Agree to Terms ✓]      │  ← Checkbox
│                         │
├─────────────────────────┤
│ [Cancel]  [Bayar Sekarang]  ← Buttons
│                         │
└─────────────────────────┘

Midtrans Payment Modal: (Overlays entire screen)
┌─────────────────────────┐
│ Midtrans Payment        │  ← System dialog
├─────────────────────────┤
│ Available Payment       │
│ Methods:                │
│                         │
│ [Card] [Bank Transfer]  │
│ [E-wallet] [BNPL]       │  ← Large buttons
│                         │
│ (User completes payment)│
│                         │
│ Payment Successful! ✓   │
│ Order #ORD-00123        │
│                         │
│ [Continue]              │
│                         │
└─────────────────────────┘

Success Page:
┌─────────────────────────┐
│ ✓ Pesanan Berhasil!     │
│                         │
│ Nomor Pesanan:          │
│ ORD-00123               │
│                         │
│ Total Pembayaran:       │
│ Rp 34.200.000           │
│                         │
│ Motor akan segera       │
│ dipersiapkan. Anda akan │
│ menerima update via     │
│ WhatsApp.               │
│                         │
│ [Lacak Pesanan]         │
│ [Kembali ke Home]       │
│                         │
└─────────────────────────┘
```

#### 6. Documents Upload (Credit Order)

```
┌─────────────────────────┐
│ ← Upload Documents      │
├─────────────────────────┤
│ Lengkapi dokumen untuk  │
│ verifikasi aplikasi     │
│ cicilan. Gunakan kamera │
│ atau galeri.            │
│                         │
│ Required Documents:     │
│ ┌─────────────────────┐ │
│ │ KTP                 │ │
│ │ Kartu Tanda Pengenal│ │  ← Each item
│ │ [📷 Take Photo]     │ │      scrollable
│ │ or [📁 Choose File] │ │
│ │ [✓ Uploaded]        │ │  ← Status indicator
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ NPWP (Optional)     │ │
│ │ Nomor Pokok Wajib   │ │
│ │ [📷 Take Photo]     │ │
│ │ or [📁 Choose File] │ │
│ │ [⏳ Uploading...]     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Bank Statement      │ │
│ │ (3 bulan terakhir)  │ │
│ │ [📷 Take Photo]     │ │
│ │ or [📁 Choose File] │ │
│ │ [⚠️ Missing]          │ │
│ └─────────────────────┘ │
│                         │
│ [Submit Documents]      │
│                         │
└─────────────────────────┘

Camera Capture Flow:
1. Click "📷 Take Photo"
2. Camera opens (full screen)
3. User aligns document
4. Click "📸" to capture
5. Preview: "Crop" or "Retake"
6. Confirm: "Upload" or "Cancel"
7. Shows upload progress
8. Confirmation: "✓ Uploaded"
```

#### 7. Notifications Tab

```
┌─────────────────────────┐
│ Notifikasi              │  ← Title
├─────────────────────────┤
│ Today:                  │  ← Date separator
│ ┌─────────────────────┐ │
│ │ 🟢 Order Confirmed  │ │  ← Unread (blue dot)
│ │ Pesanan #ORD-00123  │ │
│ │ Pembayaran diterima │ │
│ │ 10:30 AM            │ │
│ │ [Tap to view]       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ⏳ Unit Preparation │ │
│ │ Motor sedang        │ │
│ │ dipersiapkan...     │ │
│ │ 09:15 AM            │ │
│ └─────────────────────┘ │
│                         │
│ Yesterday:              │  ← Date separator
│ ┌─────────────────────┐ │
│ │ ✓ Dokumen Diterima │ │  ← Read (gray)
│ │ Cicilan application │ │
│ │ sedang diverifikasi │ │
│ │ 05:22 PM            │ │
│ └─────────────────────┘ │
│                         │
│ [Mark all as read]      │  ← Action
│                         │
└─────────────────────────┘
```

#### 8. User Profile

```
┌─────────────────────────┐
│ Profil Saya             │
├─────────────────────────┤
│      [Avatar Image]     │  ← 100px circle
│      Budi Santoso       │
│      081234567890       │
│                         │
│ [Edit Profile]          │  ← Button
│                         │
│ ─────────────────       │
│ Account                 │  ← Section
│ Email: budi@email.com   │
│ Phone: 081234567890     │
│ NIK: 1234567890123456   │
│                         │
│ Address:                │
│ Jl. Jend. Ahmad Yani    │
│ No. 123, Jakarta Pusat  │
│                         │
│ ─────────────────       │
│ Preferences             │
│ Theme: Light 🌞         │
│ Language: Indonesia 🇮🇩 │
│ Notifications: On ✓     │
│                         │
│ ─────────────────       │
│ Help & Legal            │
│ [FAQ]                   │
│ [Privacy Policy]        │
│ [Terms & Conditions]    │
│ [Contact Support]       │
│ [Report Bug]            │
│                         │
│ ─────────────────       │
│ [Logout]                │
│                         │
│ Version: 1.0 (Build 15) │
│                         │
└─────────────────────────┘
```

#### 9. Admin Dashboard (Simplified)

```
┌─────────────────────────┐
│ 👤 Admin Panel          │
├─────────────────────────┤
│ Today's Summary:        │
│ ┌────────┬────────────┐ │
│ │New     │Pending     │ │
│ │Orders  │Approvals   │ │  ← KPI cards
│ │   5    │      2     │ │
│ └────────┴────────────┘ │
│                         │
│ ┌────────┬────────────┐ │
│ │Revenue │Active      │ │
│ │This    │Users       │ │
│ │Month   │            │ │
│ │851M    │    234     │ │
│ └────────┴────────────┘ │
│                         │
│ Recent Transactions:    │
│ ┌─────────────────────┐ │
│ │ ORD-00125          │ │  ← Simple list
│ │ Budi - Cash Order  │ │
│ │ Status: New        │ │
│ │ Rp 34,2M | 1h ago  │ │
│ │ [View]             │ │
│ └─────────────────────┘ │
│                         │
│ Pending Approvals:      │
│ ┌─────────────────────┐ │
│ │ Siti - Credit App   │ │
│ │ Status: Verify Docs │ │  ← Action items
│ │ [Review] [Approve]  │ │
│ └─────────────────────┘ │
│                         │
│ [View All] [Reports]    │
│                         │
└─────────────────────────┘
```

### Navigation Structure

```
Bottom Tab Navigation (Customer):

┌─────────────────────────┐
│ Screen Content Area     │
│                         │
│                         │
├─────────────────────────┤
│ [🏠] [🔍] [👤] [🔔] [☰]│  ← 5 tabs
│ Home Explore Profile... Menu

Tab Definitions:
- Home: Featured, categories, quick actions
- Explore: Search/filter motors, compare
- Orders: Transaction list, tracking (if logged in)
- Profile: User info, preferences, settings (if logged in)
- Menu: More options, admin link, support, logout


Drawer Navigation (Side Menu when more options):

┌────────────────┐
│ SRB Motor      │ ← Logo/branding
├────────────────┤
│ Home           │
│ Browse Motors  │
│ My Orders      │
│ Installments   │
│ Favorites      │
├────────────────┤
│ Help & Support │
│ Settings       │
│ About Us       │
├────────────────┤
│ Logout         │
│                │
└────────────────┘
```

---

## TECHNOLOGY STACK

### Flutter Ecosystem (Recommended for Mobile)

```
Core Framework:
├── Flutter 3.25.0+ (Latest stable, Dart 3.5+)
├── Null Safety (enforced)
└── Material Design 3 (matches web design system)

State Management:
├── Riverpod 2.4+ (Recommended)
│   ├── Async state management
│   ├── Dependency injection
│   ├── Excellent typing
│   └── Great DevTools integration
│
├── StateNotifier (for complex state)
└── Consumer/ConsumerWidget (for UI binding)

HTTP & Networking:
├── Dio 5.3+ (HTTP client)
│   ├── Request/Response interceptors
│   ├── Automatic retry
│   ├── Timeout handling
│   └── File upload progress
│
└── http package (as fallback)

Local Storage:
├── Hive (key-value cache)
│   ├── Fast & simple
│   ├── No additional setup
│   └── Good for tokens, preferences
│
├── SQLite (via sqflite)
│   ├── Structured data
│   ├── Querying capability
│   └── Complex caching
│
└── shared_preferences (simple key-value)

Authentication & Biometrics:
├── Firebase Auth (or custom JWT)
├── google_sign_in (for Google OAuth)
├── local_auth (Biometric - Touch/Face ID)
└── flutter_secure_storage (secure token storage)

Payment Integration:
├── midtrans_sdk (Official Midtrans Flutter SDK)
└── Custom Snap Token handling

Push Notifications:
├── Firebase Cloud Messaging (FCM)
├── flutter_local_notifications (local alerts)
└── Deep linking for notification actions

Document & File Handling:
├── image_picker (Camera & Gallery)
├── camera (Advanced camera control)
├── file_picker (File selection)
├── pdf (PDF viewing/annotation)
└── Permission Handler (Request permissions)

UI Components & Styling:
├── Flutter Material Widgets (built-in)
├── flutter_staggered_grid_view (Grid layouts)
├── shimmer (Loading placeholders)
├── lottie (Animations)
├── google_fonts (Typography)
└── flutter_screenutil (Responsive design)

Routing & Navigation:
├── go_router (Modern navigation)
│   ├── Deep linking
│   ├── Named routes
│   ├── Guards/middleware
│   └── Web URL-like navigation
│
└── Auto routing (alternative)

Data Serialization:
├── json_serializable (Code generation)
├── freezed (Immutable models)
└── built_value (Value types)

Analytics & Logging:
├── Firebase Analytics
├── Sentry (Error tracking)
├── Logger package (Local logging)
└── Integration with web analytics

Testing:
├── flutter_test (Unit tests)
├── mockito (Mocking)
├── integration_test (E2E tests)
└── golden_toolkit (Widget testing)

Development & Debugging:
├── Flutter DevTools
├── Riverpod DevTools
├── Talker (Logging UI)
└── Device Preview (Multi-device testing)
```

### Project Structure

```
lib/
├── main.dart                          ← App entry point
│
├── config/                            ← Configuration
│   ├── app_config.dart               ← App constants
│   ├── api_endpoints.dart            ← API URLs
│   └── theme/                        ← Theme config
│       ├── app_colors.dart
│       ├── app_typography.dart
│       └── app_theme.dart
│
├── models/                            ← Data models
│   ├── user_model.dart
│   ├── motor_model.dart
│   ├── transaction_model.dart
│   ├── credit_detail_model.dart
│   ├── installment_model.dart
│   ├── document_model.dart
│   └── notification_model.dart
│
├── services/                          ← External service wrappers
│   ├── api_service.dart              ← HTTP client wrapper
│   ├── auth_service.dart             ← Auth logic
│   ├── payment_service.dart          ← Midtrans integration
│   └── fcm_service.dart              ← Firebase messaging
│
├── repositories/                      ← Data access layer
│   ├── auth_repository.dart
│   ├── motor_repository.dart
│   ├── transaction_repository.dart
│   ├── installment_repository.dart
│   ├── document_repository.dart
│   └── notification_repository.dart
│
├── providers/                         ← Riverpod state
│   ├── auth_provider.dart            ← Current user, token
│   ├── motor_provider.dart           ← Motor catalog
│   ├── transaction_provider.dart     ← Orders list
│   ├── payment_provider.dart         ← Payment state
│   ├── notification_provider.dart    ← Notifications
│   └── admin_provider.dart           ← Admin state
│
├── screens/                           ← UI Pages
│   ├── auth/
│   │   ├── login_screen.dart
│   │   ├── signup_screen.dart
│   │   ├── password_reset_screen.dart
│   │   └── biometric_auth_screen.dart
│   │
│   ├── customer/
│   │   ├── home_screen.dart
│   │   ├── explore_screen.dart
│   │   ├── motor_detail_screen.dart
│   │   ├── orders_screen.dart
│   │   ├── order_detail_screen.dart
│   │   ├── cash_order_screen.dart
│   │   ├── credit_order_screen.dart
│   │   ├── payment_screen.dart
│   │   ├── documents_upload_screen.dart
│   │   ├── profile_screen.dart
│   │   ├── notifications_screen.dart
│   │   └── favorites_screen.dart
│   │
│   └── admin/
│       ├── admin_dashboard_screen.dart
│       ├── transactions_screen.dart
│       ├── credit_review_screen.dart
│       ├── document_approval_screen.dart
│       └── user_management_screen.dart
│
├── widgets/                           ← Reusable components
│   ├── motor_card.dart
│   ├── status_badge.dart
│   ├── motor_filter_panel.dart
│   ├── order_timeline.dart
│   ├── payment_status_card.dart
│   ├── document_picker_widget.dart
│   ├── installment_card.dart
│   └── custom_app_bar.dart
│
├── utils/                             ← Helpers & utilities
│   ├── constants.dart
│   ├── validators.dart
│   ├── formatters.dart               ← Currency, date formatting
│   ├── extensions.dart               ← String, DateTime extensions
│   └── logger.dart
│
├── router/                            ← Navigation
│   └── app_router.dart               ← Go router config
│
└── main_dev.dart                      ← Dev entry point (optional)

pubspec.yaml                           ← Dependencies
android/                               ← Android native code
ios/                                   ← iOS native code
test/                                  ← Unit tests
integration_test/                      ← E2E tests
```

### Dependencies (pubspec.yaml)

```yaml
dependencies:
    flutter:
        sdk: flutter

    # State management
    riverpod: ^2.4.0
    flutter_riverpod: ^2.4.0
    state_notifier: ^1.0.0

    # HTTP & Networking
    dio: ^5.3.0
    http: ^1.1.0

    # Storage
    hive: ^2.2.0
    hive_flutter: ^1.1.0
    shared_preferences: ^2.2.0
    sqflite: ^2.3.0

    # Authentication
    firebase_auth: ^4.10.0
    google_sign_in: ^6.1.0
    local_auth: ^2.1.0
    flutter_secure_storage: ^9.0.0

    # Payment
  midtrans_sdk: ^2.1.0  # Official Midtrans Flutter SDK
  snap_webview: ^0.1.0  # Alternative: Webview for Snap
    # Firebase
    firebase_core: ^2.21.0
    firebase_messaging: ^14.6.0
    firebase_analytics: ^10.5.0

    # UI & Navigation
    go_router: ^12.0.0
    flutter_screenutil: ^5.9.0
    google_fonts: ^6.1.0
    lottie: ^2.6.0
    shimmer: ^3.0.0
    flutter_staggered_grid_view: ^0.7.0

    # Media
    image_picker: ^1.0.0
    camera: ^0.10.0
    file_picker: ^6.1.0
    permissionhandler: ^11.4.0

    # Data serialization
    json_serializable: ^6.7.0
    freezed_annotation: ^2.4.0

    # Utils
    intl: ^0.19.0
    uuid: ^4.0.0
    logger: ^2.0.0

dev_dependencies:
    flutter_test:
        sdk: flutter
    build_runner: ^2.4.0
    json_serializable: ^6.7.0
    freezed: ^2.4.0
    mockito: ^5.4.0
    integration_test:
        sdk: flutter
```

---

## API INTEGRATION & BACKEND ADAPTATION

### Required Backend Changes

#### 1. JWT Authentication (New)

**File**: `config/auth.php`, `app/Http/Controllers/Api/AuthController.php`

```php
// New routes in routes/api.php
Route::post('/auth/login', [AuthController::class, 'mobileLogin']);
Route::post('/auth/register', [AuthController::class, 'mobileRegister']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/auth/refresh', [AuthController::class, 'refresh']);

// JWT Config (Laravel Sanctum)
// Users table needs: api_token column (nullable)
```

#### 2. FCM Token Registration

```php
// New endpoint
Route::post('/fcm-token', [NotificationController::class, 'registerFcmToken'])
    ->middleware('auth:sanctum');

// Add to users migration:
// $table->string('fcm_token')->nullable();
```

#### 3. Mobile-Optimized Endpoints

```php
// Optimize existing endpoints for pagination
Route::get('/motors', [MotorController::class, 'index'])
    ->middleware('throttle:60,1'); // Rate limiting

// Add cursor-based pagination for better mobile performance
// Return format: { data: [...], next_cursor: "...", prev_cursor: "..." }
```

#### 4. File Upload with Progress

```php
// Handle multipart uploads
Route::post('/documents/upload', [DocumentController::class, 'upload'])
    ->middleware(['auth:sanctum', 'throttle:30,1']);

// Return: { success: true, file_id: 123, progress: 100 }
```

#### 5. CORS Configuration

```php
// config/cors.php - Only allow mobile app domain
'allowed_origins' => ['*'], // For development, restrict in production
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['X-App-Version', 'X-Platform'],
```

#### 6. API Response Format (Standardized)

```php
// Base response format for all API endpoints
{
  "success": true,
  "status_code": 200,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "total": 100,
    "per_page": 12,
    "current_page": 1,
    "total_pages": 9
  },
  "timestamp": "2026-03-18T14:30:00Z"
}

// Error response
{
  "success": false,
  "status_code": 422,
  "message": "Validation failed",
  "errors": {
    "phone": ["Phone number is invalid"]
  },
  "timestamp": "2026-03-18T14:30:00Z"
}
```

#### 7. Version-Specific API Endpoints

```php
// routes/api.php structure
Route::prefix('v1')->group(function () {
    Route::post('/motors', ...);
    Route::post('/transactions', ...);
});

// Allows future v2 changes without breaking mobile app
// Add header: X-Api-Version: v1
```

### Backend Implementation Checklist

```
✓ Add JWT Token generation (Laravel Sanctum)
✓ Create mobile-specific auth endpoints
✓ Add FCM token management
✓ Implement file upload progress tracking
✓ Add rate limiting for API endpoints
✓ Configure CORS for mobile
✓ Standardize API response format
✓ Add logging for mobile requests (User-Agent tracking)
✓ Implement API versioning system
✓ Add endpoint-level access control (mobile vs web)
✓ Create API documentation (Swagger/OpenAPI)
✓ Add automated testing for API endpoints
```

---

## DATA SECURITY & SYNC STRATEGY

### Authentication Flow

```
Mobile App Authentication:

1. User Opens App
   ↓
2. Check LocalStorage for JWT Token
   ├─→ Token Exists & Valid (check expiry)
   │   └─→ Restore Previous Session (Direct to Home)
   │
   └─→ No Token / Expired
       └─→ Show Login Screen
       ↓
3. User Enters Credentials
   ├─→ Email/Password Login
   │   └─→ POST /api/auth/login {email, password}
   │       ├─→ Success: Get JWT Token
   │       └─→ Fail: Show error, retry
   │
   └─→ Google/Social Login (Optional)
       └─→ POST /api/auth/google {google_id_token}
       ├─→ Success: Create account if new
       └─→ Store JWT Token
       ↓
4. Save JWT in Secure Storage
   ├─→ ios_keychain (iOS)
   ├─→ Android Keystore (Android)
   └─→ flutter_secure_storage handles both
   ↓
5. Set Authorization Header
   └─→ All requests: Authorization: Bearer {JWT_TOKEN}
   ↓
6. Token Refresh Strategy
   ├─→ Check token expiry before each request
   ├─→ If expiry < 1 hour → Refresh token
   │   └─→ POST /api/auth/refresh
   │       └─→ Get new token, store in secure storage
   └─→ If expired → Show login screen

7. Logout
   └─→ DELETE /api/auth/logout (optional backend cleanup)
   └─→ Clear secure storage
   └─→ Clear cached data
   └─→ Redirect to login
```

### Data Sync Strategy

```
Motor Catalog Cache:
├─→ Initial Load: Download full catalog (check timestamp)
├─→ Cache TTL: 24 hours
├─→ Smart Update: Check modification date, only download if changed
├─→ Size: ~2-5 MB (all motors + minimal data)
├─→ Storage: SQLite local database
└─→ Fallback: Show cached data if offline (graceful degradation)

Transaction Sync:
├─→ Orders: Always fetch from server (real-time)
├─→ Local Cache: Last 10 transactions in SQLite
├─→ Sync on App Resume: Check for updates
├─→ Manual Refresh: Pull-to-refresh on transaction list
└─→ Notifications: FCM push updates status changes

Document Upload:
├─→ Queue System: Save to local DB if upload fails
├─→ Retry Logic: Auto-retry on WiFi availability
├─→ Progress Tracking: Show upload % on UI
├─→ Duplicate Prevention: Hash file, check before upload
└─→ Resumable Upload: Support pause/resume (Dio feature)

Notifications:
├─→ FCM: Push received → Store in SQLite
├─→ Sync on Open: Fetch unread count from server
├─→ Mark as Read: POST to server + update local
└─→ Background: FCM background handler updates DB
```

### Offline Capability

```
What Works Offline:
✓ Browse cached motors
✓ View user profile (cached)
✓ Read cached transactions
✓ View notifications history
✗ Cannot: Create orders, pay, upload documents, chat

Offline Handling:
1. Detect network status (connectivity_plus package)
2. Show "Offline Mode" banner
3. Disable action buttons (with tooltip: "No internet")
4. Queue actions (save locally, sync when online)
5. Show sync status: "Syncing..." → "Synced ✓" or "Sync failed"
6. Allow retry when network available
```

### Security Best Practices

```
✓ Token Storage:
  ├─→ Use flutter_secure_storage (NOT SharedPrefs)
  ├─→ iOS Keychain / Android Keystore
  └─→ Never store in plaintext

✓ SSL/TLS:
  ├─→ Force HTTPS on all API calls
  ├─→ Certificate pinning (optional, for high security)
  └─→ Validate server certificate

✓ Permission Requests:
  ├─→ Request camera permission before document upload
  ├─→ Request location (if needed for survey)
  ├─→ Request contacts (for WhatsApp integration)
  └─→ Show purpose explanation

✓ Data Privacy:
  ├─→ Don't log sensitive data (passwords, NIK, etc)
  ├─→ Implement data retention policy
  ├─→ Clear sensitive data on logout
  └─→ Respect user privacy settings

✓ Code Security:
  ├─→ Use code obfuscation (flutter build release --obfuscate)
  ├─→ Enable ProGuard for Android
  ├─→ Keep dependencies updated
  └─→ Run security scanners (snyk, dependency-check)

✓ API Security:
  ├─→ Rate limiting (prevent brute force)
  ├─→ Input validation (all inputs)
  ├─→ SQL injection prevention (ORM used)
  └─→ CSRF tokens for state-changing operations
```

---

## DEVELOPMENT ROADMAP

### Phase 1: Foundation (Week 1-2)

**Deliverables**: Basic app structure, authentication, motor browsing

```
Tasks:
□ Project setup & folder structure
□ Design system implementation (colors, typography)
□ Navigation setup (go_router, bottom tabs)
□ State management setup (Riverpod)
□ HTTP client configuration (Dio interceptors)
□ Authentication implementation
  ├─→ Login screen
  ├─→ JWT token handling
  ├─→ Secure token storage
  └─→ Session restoration
□ Home screen
  ├─→ Featured motors carousel
  ├─→ Categories section
  ├─→ Quick actions
  └─→ User greeting
□ Backend: JWT endpoints + CORS configuration

Output:
- User can login/logout
- Home screen shows featured motors
- Navigation between tabs works
- Token properly stored & refreshed
```

### Phase 2: Browse & Order (Week 3-4)

**Deliverables**: Motor catalog, search/filter, cash order flow

```
Tasks:
□ Motor catalog screen
  ├─→ Grid layout (2 columns)
  ├─→ Motor cards with images
  ├─→ Pagination
  └─→ Loading state (shimmer)
□ Search & filter functionality
  ├─→ Search input with debounce
  ├─→ Filter modal (brand, type, price)
  ├─→ Filter persistence
  └─→ Search history
□ Motor detail screen
  ├─→ Image carousel
  ├─→ Specs display
  ├─→ Financing schemes
  ├─→ Color picker
  ├─→ Share functionality
  └─→ Favorite button
□ Cash order flow
  ├─→ Order form
  ├─→ Validation
  ├─→ Confirmation dialog
  └─→ Success screen
□ Motor catalog caching (SQLite)
□ Backend: Optimize /motors endpoint pagination

Output:
- User can browse 100+ motors with filter/search
- User can place cash order
- Motor data cached locally for offline viewing
```

### Phase 3: Payment & Tracking (Week 5-6)

**Deliverables**: Midtrans payment, order tracking, installments

```
Tasks:
□ Midtrans integration
  ├─→ Snap token generation
  ├─→ Snap web view overlay
  ├─→ Payment result handling
  └─→ Error handling
□ Order tracking screen
  ├─→ Status timeline
  ├─→ Real-time updates
  ├─→ Installment list
  └─→ Download invoice
□ Installment payment
  ├─→ Pay now button
  ├─→ Midtrans modal
  ├─→ Payment confirmation
  └─→ Auto-refresh on payment
□ Notifications integration
  ├─→ FCM setup
  ├─→ Notification handler
  ├─→ Deep linking (open specific order)
  └─→ Badge counter
□ Notification tab screen
  ├─→ Notification list with date grouping
  ├─→ Mark as read
  ├─→ Notification detail
  └─→ Clear notifications
□ Backend: Webhook for payment callbacks

Output:
- Full payment workflow functional
- User receives notifications on order updates
- Installments tracked & can be paid
```

### Phase 4: Credit Orders & Documents (Week 7-8)

**Deliverables**: Credit order flow, document upload, approval tracking

```
Tasks:
□ Credit order form
  ├─→ Personal info fields
  ├─→ Income/employment info
  ├─→ Tenor selection
  ├─→ Down payment input
  └─→ Leasing provider selection
□ Document upload
  ├─→ Camera integration
  ├─→ Gallery picker
  ├─→ Image compress/resize
  ├─→ Multiple file upload
  ├─→ Upload progress
  ├─→ File preview
  └─→ Error handling
□ Credit application tracking
  ├─→ Status timeline (pengajuan→approved)
  ├─→ Document approval status
  ├─→ Admin notes display
  ├─→ Survey scheduling modal
  └─→ Real-time updates
□ Background file sync
  ├─→ Queue system for failed uploads
  ├─→ Auto-retry on WiFi
  ├─→ Show retry status
  └─→ Delete uploaded document
□ Backend: File upload endpoints, progress tracking API

Output:
- User can submit credit order with documents
- Real-time tracking of credit approval
- Can confirm survey appointment via app
```

### Phase 5: Advanced Features (Week 9-10)

**Deliverables**: Admin panel, biometric auth, favorites, offline mode

```
Tasks:
□ Admin features
  ├─→ Admin login flag detection
  ├─→ Admin tab navigation
  ├─→ Transaction management list
  ├─→ Credit review screen with approvals
  ├─→ Document approval (view + buttons)
  ├─→ Update transaction status
  ├─→ Simple dashboard (KPI cards)
  └─→ Basic reports (today's sales, etc)
□ Biometric authentication
  ├─→ Register/enroll fingerprint
  ├─→ Login with biometric
  ├─→ Fallback to password
  ├─→ Manual enrollment screen
  └─→ Require re-authentication for sensitive actions
□ Favorite motors
  ├─→ Heart icon on motor cards
  ├─→ Favorites screen
  ├─→ Local storage of favorites
  ├─→ Sync with server (optional)
  └─→ Quick actions from favorites
□ Offline catalog
  ├─→ Download all motors locally (with prompt)
  ├─→ Storage size warning
  ├─→ Offline indicator
  ├─→ Sync status
  └─→ Manual refresh option
□ Settings screen
  ├─→ Theme toggle (light/dark)
  ├─→ Language selection
  ├─→ Notification preferences
  ├─→ App version info
  ├─→ Biometric settings
  └─→ Cache management (clear all)
□ Better error handling & retry UI
□ Backend: Admin-specific API endpoints

Output:
- Admin can manage transactions from mobile
- User can login with fingerprint
- App works reasonably well offline
- Polish and refinement
```

### Phase 6: Testing & Release (Week 11-12)

**Deliverables**: QA, bug fixes, app store releases

```
Tasks:
□ Unit testing
  ├─→ Provider tests
  ├─→ Service tests
  ├─→ Model serialization tests
  ├─→ Validator tests
  └─→ Achieve 70%+ coverage
□ Widget testing
  ├─→ Motor card widget
  ├─→ Order form validation
  ├─→ Status timeline
  └─→ Approval buttons
□ Integration testing
  ├─→ Full order flow (offline simulation)
  ├─→ Authentication flow
  ├─→ Document upload
  └─→ Notification handling
□ E2E testing
  ├─→ Test on real devices
  ├─→ Various network conditions (WiFi, 4G, offline)
  ├─→ Different orientations
  └─→ Device sizes (phone, tablet)
□ Performance testing
  ├─→ App startup time < 2s
  ├─→ List scrolling FPS > 60
  ├─→ Memory usage < 150MB
  ├─→ Battery consumption test
  └─→ Network optimization
□ Security testing
  ├─→ Token security review
  ├─→ Data encryption audit
  ├─→ Dependency vulnerability scan
  ├─→ Code obfuscation verification
  └─→ OWASP mobile checklist
□ Beta release
  ├─→ Firebase TestLab testing
  ├─→ Beta tester recruitment
  ├─→ Crash reporting setup (Firebase Crashlytics)
  ├─→ Feedback collection
  └─→ Bug fixing iteration
□ App store preparation
  ├─→ Screenshots & descriptions (Play Store, App Store)
  ├─→ Icon & branding assets
  ├─→ Privacy policy & terms
  ├─→ Permissions justification
  ├─→ Version numbering (1.0.0)
  ├─→ Release notes
  └─→ Store listing optimization
□ Deploy to stores
  ├─→ Google Play Store
  ├─→ Apple App Store
  └─→ Monitor reviews & ratings

Output:
- Fully tested, production-ready app
- Published on both app stores
- Monitoring & support system in place
```

### Timeline Summary

```
┌─────────────────────────────────────────────────────┐
│ DEVELOPMENT TIMELINE (12 Weeks)                     │
├─────────────────────────────────────────────────────┤
│ Week 1-2:   Foundation & Auth           [1.0 alpha]  │
│ Week 3-4:   Browse & Cash Order         [1.0 beta1]  │
│ Week 5-6:   Payment & Tracking          [1.0 beta2]  │
│ Week 7-8:   Credit & Documents          [1.0 RC]     │
│ Week 9-10:  Advanced Features           [1.0 RC2]    │
│ Week 11-12: Testing & Release           [1.0 GA]     │
│                                          [▓▓▓▓▓▓▓]  │
│ Milestones:                                         │
│ ✓ Basic features working (Week 4)                  │
│ ✓ Full functionality (Week 8)                      │
│ ✓ Beta ready (Week 10)                             │
│ ✓ App Store ready (Week 12)                        │
└─────────────────────────────────────────────────────┘
```

---

## PERFORMANCE & OPTIMIZATION

### Mobile App Performance Targets

```
Metric | Target | Method
─────────────────────────────────────────────────
App Startup | < 2s | Profile with DevTools, lazy load
List Scrolling | >60 FPS | Pagination, image caching, BuildContext optimization
Image Load | <1s (3G) | Network image cache, thumbnail generation
API Response | <2s (avg) | Backend optimization, pagination limits
Memory Usage | <150MB | Proper disposal of resources, stream cleanup
Battery Drain | Low | Reduce wake locks, geolocation sparingly
```

### Optimization Techniques

```
Images:
├─→ Lazy loading (load on scroll)
├─→ Image caching (cached_network_image package)
├─→ Thumbnail generation (cloudinary or local)
├─→ Compression before upload
└─→ WebP format for smaller size

Network:
├─→ Request batching (combine multiple calls)
├─→ Pagination (limit results per page)
├─→ Compression (gzip)
├─→ Caching (HTTP cache headers)
├─→ CDN for static assets
└─→ Connection pooling

Database:
├─→ Index on frequently queried columns
├─→ Pagination for list queries
├─→ Cursor-based pagination for large result sets
├─→ Denormalization where appropriate
└─→ Query batching

App:
├─→ Const constructors (const Widget(...))
├─→ Repaint boundaries (avoid full rebuild)
├─→ Lazy loading of routes
├─→ Stream optimization (don't expose StreamSubscription)
└─→ Memory leak prevention (dispose listeners)

Device:
├─→ Reduce location polling frequency
├─→ Batch notifications
├─→ Smart background sync (WiFi + mains power)
└─→ Store only necessary data locally
```

### Monitoring & Metrics

```
Use Firebase for monitoring:
├─→ Crashlytics (crash reporting)
├─→ Performance Monitoring
│   ├─→ App start time
│   ├─→ Network request latency
│   ├─→ Frames rendered (janky frames)
│   └─→ Memory usage
├─→ Firebase Analytics
│   ├─→ User engagement
│   ├─→ Feature usage
│   ├─→ Funnel analysis (order completion rate)
│   └─→ User retention
└─→ Custom metrics
    ├─→ Payment success rate
    ├─→ Document upload success
    └─→ API error rate
```

---

## DEPLOYMENT & DISTRIBUTION

### Build Configuration

```
Android:
├─→ minSdkVersion: 21 (Android 5.0)
├─→ targetSdkVersion: 34 (Android 14)
├─→ Build types: debug, release, profile
├─→ Signing: Keystore for Play Store
└─→ ProGuard: Enable code obfuscation

iOS:
├─→ Deployment target: iOS 12.0+
├─→ Signing certificate: Apple Developer
├─→ Provisioning profile: For distribution
├─→ Code signing: Automatic (Xcode)
└─→ App thinning: Enabled for smaller downloads
```

### Release Management

```
Versioning: MAJOR.MINOR.PATCH (e.g., 1.0.0)
- 1.x.x: Feature releases
- 1.2.x: Bug fixes & patches
- 1.2.3+1: Build number for both stores

Channels:
├─→ Development: Internal testing
├─→ Beta: Public beta testing (TestFlight + Google Play Beta)
├─→ Production: General release
└─→ Canary: Optional early access (small percentage rollout)

Release Process:
1. Merge PR to main branch
2. Run full test suite
3. Build APK/IPA
4. Upload to beta channel
5. Collect feedback (1-2 weeks)
6. Fix critical issues
7. Promote to production
8. Monitor crash rate (target: <0.1%)
9. Full rollout after 24+ hours stability
```

---

## CONCLUSION & SUCCESS CRITERIA

### Project Success Criteria

```
✓ ALL Phase 1-3 features working on both iOS & Android
✓ <100ms API response time (P95)
✓ <0.5% crash rate in production
✓ >80% test coverage for critical paths
✓ 4.0+ app store rating (50+ reviews)
✓ <2 second app startup
✓ >100K downloads in first 2 months
✓ Customer satisfaction score >85%
✓ Zero data loss incidents
✓ Payment success rate >95%
```

### Post-Launch Plan

```
Month 1:
├─→ Monitor crash reports daily
├─→ Fix critical bugs immediately (< 24h)
├─→ Respond to app store reviews
├─→ Gather user feedback
└─→ Iterate on UX based on analytics

Month 2-3:
├─→ Phase 5 features (biometric, admin, offline)
├─→ Performance optimizations
├─→ Additional payment methods
└─→ Regional localization (Bahasa Indonesia/English)

Month 4+:
├─→ Advanced features (motor comparison, AR view)
├─→ API v2 development
├─→ Server-side optimizations
├─→ Marketing campaigns
└─→ Periodic updates & maintenance
```

### Documentation for Future Maintenance

```
Keep updated:
├─→ API documentation (Swagger/OpenAPI)
├─→ Architecture diagrams
├─→ Database schema updates
├─→ Deployment procedures
├─→ Troubleshooting guides
└─→ Code comments for complex logic

Version control:
├─→ Git branching strategy (Git Flow)
├─→ Commit message standards
├─→ Pull request templates
├─→ Release notes format
└─→ Changelog management
```

---

## APPENDICES

### Appendix A: Database Validation Checklist

✅ **ACTIVE Tables** (Currently in use - verified against actual code):

- users (20 columns) → ✓ Mobile-compatible (id, name, email, password, role, phone, NIK, address, income, employment, mother_name, gender, DOB, google_id, email_verified_at, etc.)
- motors (14 columns) → ✓ All fields needed (id, name, brand, model, price, year, type, image_path, details_HTML, tersedia_boolean, min_dp, colors_JSON)
- transactions (33 columns) → ✓ Optimized for mobile (handles both CASH & CREDIT orders)
- credit_details (18 columns) → ✓ 8-stage workflow tracking
- installments (21 columns) → ✓ Payment tracking with Midtrans integration
- documents (15 columns) → ✓ File handling with approval status
- categories (9 columns) → ✓ For motors AND post filtering
- leasing_providers (5 columns) → ✓ Finance partner management
- transaction_logs (12 columns) → ✓ Audit trail of status changes
- survey_schedules (19 columns) → ✓ Credit property assessment
- posts (12 columns) → ✓ Blog/news articles (ACTIVE - not stretch goal)
- settings (8 columns) → ✓ System configuration
- notifications (8 columns) → ✓ User alert system

❌ **DROPPED Tables** (No longer exist - confirmed in migrations):

- promotions (motor discount schemes) - DROPPED in migration 2026_03_15
- banners (homepage promotional banners) - DROPPED in migration 2026_03_15
- contact_messages (form submissions) - DROPPED in migration 2026_03_15
- motor_units (consolidated into motors table)
- user_profiles (consolidated into users table)

**Status**: ✅ No schema changes needed. Current 13 tables ready for mobile access. Remove promotions/banners/contact features from mobile spec.

### Appendix B: Feature Comparison Matrix

| Feature                  | Web ✓ |   Mobile   | Priority | Notes                                                  |
| :----------------------- | :---: | :--------: | :------- | :----------------------------------------------------- |
| **Browse Motors**        |   ✓   |     ✓      | P0       | 2-column grid, filter by brand/type/year/price         |
| Search & Filter          |   ✓   |     ✓      | P0       | Real-time search, fixed search bar + modal filters     |
| Motor Detail View        |   ✓   |     ✓      | P0       | Images carousel, specs, financing schemes              |
| Motor Comparison         |   ✓   |     ✓      | P2       | Compare 3-4 motors side-by-side                        |
| Cash Order (Tunai)       |   ✓   |     ✓      | P0       | Simple checkout (name, phone, occupation, booking_fee) |
| Credit Order (Cicilan)   |   ✓   |     ✓      | P0       | Complex form with multi-stage document upload          |
| Document Upload          |   ✓   | ✓ (Camera) | P0       | Camera capture + gallery picker + file preview         |
| Order Tracking           |   ✓   |     ✓      | P0       | Real-time status with timeline view                    |
| Payment (Midtrans)       |   ✓   |     ✓      | P0       | Snap modal/webview, status callback                    |
| Installment Management   |   ✓   |     ✓      | P0       | List, pay, receipt download, monthly reminders         |
| Notifications            |   ✓   |  ✓ (Push)  | P0       | FCM push + in-app center + deep linking                |
| News/Blog Browsing       |   ✓   |     ✓      | P1       | Read-only posts by category (NEW in mobile spec)       |
| User Profile             |   ✓   |     ✓      | P1       | View & edit personal info, change password             |
| Invoice Download         |   ✓   |     ✓      | P1       | PDF generation & local storage                         |
| Biometric Auth           |   ✗   |     ✓      | P1       | Touch/Face ID (mobile only)                            |
| Offline Motor Catalog    |   ✗   |     ✓      | P2       | SQLite/Hive cache, sync on network                     |
| Favorite Motors          |   ✗   |     ✓      | P2       | Heart icon, dedicated favorites tab (stored locally)   |
| Admin Dashboard          |   ✓   |  Limited   | P2       | KPI cards + transaction list (tablet-optimized)        |
| Admin Credit Approvals   |   ✓   |     ✓      | P2       | 8-stage workflow, view docs, approve/reject            |
| Admin Transaction Status |   ✓   |     ✓      | P2       | Update status, send WhatsApp messages                  |
| Admin Motor Management   |   ✓   |     ✗      | P3       | Create/edit motors (future phase)                      |
| Admin News Management    |   ✓   |     ✗      | P3       | Blog post CRUD (future - content editors)              |
| Promotions/Banners       |   ✓   |     ✗      | P3       | DROPPED from web - not in mobile spec                  |
| Contact Form             |   ✓   |     ✗      | P3       | DROPPED from web - not in mobile spec                  |

### Appendix C: API Endpoints Summary (Real Routes)

#### Public/Guest Routes

```
GET    /                              → Home
GET    /motors                        → Motor catalog with search/filter
GET    /motors/{id}                   → Motor detail
GET    /motors/compare?ids=1,2,3     → Motor comparison
GET    /berita                        → News/Blog listing
GET    /berita/{slug}                 → News/Blog detail
GET    /about                         → About page
POST   /contact                       → Contact form submission
```

#### Authentication Routes

```
POST   /login                         → Email/password login
POST   /register                      → Register new user
GET    /auth/google                   → Google OAuth redirect
GET    /auth/google/callback          → Google OAuth callback
POST   /logout                        → Logout (auth required)
POST   /forgot-password               → Password reset request
POST   /reset-password/{token}        → Password reset
POST   /email/verification-notification  → Resend verification
```

#### Customer Routes (Protected - auth + verified)

```
Order Processing:
GET    /motors/{id}/cash-order        → Cash order form
POST   /motors/{id}/process-cash-order → Submit cash order
GET    /motors/{id}/credit-order      → Credit order form
POST   /motors/{id}/process-credit-order → Submit credit order
GET    /motors/order-confirmation/{id} → Order confirmation

Payment & Installments:
GET    /installments                  → Installments listing
POST   /installments/{id}/pay-online  → Pay installment (Midtrans)
POST   /installments/{id}/check-status → Check payment status
GET    /installments/{id}/receipt     → Download receipt/invoice
POST   /installments/pay-multiple     → Pay multiple (batch)

Documents (Credit Orders):
POST   /documents/{id}/upload         → Upload document
GET    /documents                     → List user documents
DELETE /documents/{id}                → Delete document

Transaction Tracking:
GET    /transactions                  → User transactions list
GET    /transactions/{id}             → Transaction detail
GET    /motors/my-transactions        → Alternative: my transactions

Profile:
GET    /profile                       → Profile view
GET    /profile/edit                  → Profile edit form
PUT    /profile                       → Update profile
PUT    /profile/password              → Update password

Invoice:
GET    /transactions/{id}/invoice     → View invoice preview
GET    /transactions/{id}/invoice/download → Download invoice PDF
```

#### Admin Routes (Protected - auth + admin role)

```
Dashboard:
GET    /admin                         → Admin dashboard (KPIs)

Transaction Management:
GET    /admin/transactions            → Transactions list
GET    /admin/transactions/{id}       → Transaction detail
POST   /admin/transactions/{id}/status → Update transaction status

Credit Management:
GET    /admin/credits                 → Credit applications list
GET    /admin/credits/{id}            → Credit detail + approval interface
POST   /admin/credits/{id}/verify-documents → Verify docs (stage 2)
POST   /admin/credits/{id}/send-to-leasing → Send to leasing (stage 3)
POST   /admin/credits/{id}/schedule-survey → Schedule survey (stage 3.5)
POST   /admin/credits/{id}/start-survey → Start survey
POST   /admin/credits/{id}/complete-survey → Complete survey (stage 4)
POST   /admin/credits/{id}/approve    → Approve credit (stage 6)
POST   /admin/credits/{id}/reject     → Reject credit
POST   /admin/credits/{id}/record-dp-payment → Record DP payment
GET    /admin/credits/export          → Export credits to Excel

Document Approval:
POST   /admin/documents/{id}/approve  → Approve document
POST   /admin/documents/{id}/reject   → Reject document upload

Installment Management:
POST   /admin/installments/{id}/approve → Approve installment
POST   /admin/installments/{id}/reject → Reject installment

Motor Management:
GET    /admin/motors                  → Motors list
GET    /admin/motors/create           → Create motor form
POST   /admin/motors                  → Store motor
GET    /admin/motors/{id}             → Motor detail
GET    /admin/motors/{id}/edit        → Edit motor form
PUT    /admin/motors/{id}             → Update motor
DELETE /admin/motors/{id}             → Delete motor

User Management:
GET    /admin/users                   → Users list
GET    /admin/users/{id}              → User detail
GET    /admin/users/{id}/edit         → Edit user form
PUT    /admin/users/{id}              → Update user

Content Management:
GET    /admin/news                    → News/Blog posts list
GET    /admin/news/create             → Create post form
POST   /admin/news                    → Store post
GET    /admin/news/{id}/edit          → Edit post form
PUT    /admin/news/{id}               → Update post
DELETE /admin/news/{id}               → Delete post

GET    /admin/categories              → Categories list (for motors & posts)
GET    /admin/categories/create       → Create category
POST   /admin/categories              → Store category
GET    /admin/categories/{id}/edit    → Edit category
PUT    /admin/categories/{id}         → Update category
DELETE /admin/categories/{id}         → Delete category

GET    /admin/leasing-providers       → Leasing providers list
GET    /admin/leasing-providers/create → Create leasing provider
POST   /admin/leasing-providers       → Store provider
GET    /admin/leasing-providers/{id}/edit → Edit provider
PUT    /admin/leasing-providers/{id}  → Update provider
DELETE /admin/leasing-providers/{id}  → Delete provider

Settings:
GET    /admin/settings               → Settings overview
GET    /admin/settings/{category}/edit → Edit setting category
PUT    /admin/settings/{category}     → Update settings
POST   /admin/settings                → Store new setting
DELETE /admin/settings/{id}           → Delete setting

Reports:
GET    /admin/reports                → Reports overview
GET    /admin/reports/generate        → Generate custom report
GET    /admin/reports/export          → Export report (CSV/Excel)

Admin Profile:
GET    /admin/profile                 → Admin profile view
GET    /admin/profile/edit            → Admin profile edit
PUT    /admin/profile                 → Update admin profile
PUT    /admin/profile/password        → Change password
```

#### New Mobile-Specific Endpoints (To be implemented)

```
Authentication:
POST   /api/mobile/auth/login         → Mobile JWT login
POST   /api/mobile/auth/register      → Mobile registration
POST   /api/mobile/auth/logout        → Logout (invalidate token)
POST   /api/mobile/auth/refresh       → Refresh JWT token

Devices:
POST   /api/mobile/fcm-token          → Register FCM token for notifications

Motors:
GET    /api/mobile/motors             → Paginated motor list with caching
GET    /api/mobile/motors/{id}        → Motor detail
POST   /api/mobile/motors/{id}/favorites → Favorite a motor
GET    /api/mobile/motors/favorites   → List favorite motors

Notifications:
GET    /api/mobile/notifications      → Paginated notifications
PATCH  /api/mobile/notifications/{id}/read → Mark as read
GET    /api/mobile/notifications/unread-count → Badge count

Profile:
GET    /api/mobile/profile            → User profile
PATCH  /api/mobile/profile            → Update profile
POST   /api/mobile/profile/avatar     → Upload avatar
```

**Notes**:

- All web routes currently render via Inertia.js (React)
- Mobile app will use REST API (existing routes + new mobile-specific endpoints)
- Payment webhooks: POST /api/midtrans/notification (PaymentCallbackController)

### Appendix D: Testing Scenarios

```
Critical User Journeys:
✓ Browse → Detail → Cash Order → Payment → Success
✓ Browse → Detail → Credit Order → Upload → Tracking
✓ Login → View Orders → Track Status
✓ Receive Notification → Deep Link → Order Detail
✓ Admin: Login → Review Credit → Approve → Notify

Edge Cases:
✗ Network disconnects during upload
✗ Payment gateway timeout
✗ Concurrent order submission
✗ Expired JWT during operation
✗ Large file upload (>10MB)
✗ Poor network (3G/throttled)
✗ Device rotation during form entry
✗ Locale switching (future)
```

---

**Document Status**: ✅ Complete & Ready for Development  
**Next Action**: Begin Phase 1 implementation  
**Questions/Clarifications**: See team meeting agenda items
