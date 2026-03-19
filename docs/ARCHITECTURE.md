# ARSITEKTUR SISTEM - SRB MOTORS

## 📐 Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Browser / React 19.2.1 + Inertia.js                │  │
│  │  - Pages (Home, Motors, Auth, Admin, etc)           │  │
│  │  - Components (Reusable UI)                         │  │
│  │  - Styling: Tailwind CSS 4.0                        │  │
│  │  - Charts: Recharts 3.5.1                           │  │
│  │  - Icons: Lucide React                              │  │
│  │  - Animations: Framer Motion                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Laravel 12 Framework (PHP 8.2+)                     │  │
│  │                                                      │  │
│  │  Routes (web.php, api.php)                          │  │
│  │    ├── Public Routes (/, /motors, /auth)            │  │
│  │    ├── Protected Routes (auth middleware)           │  │
│  │    └── Admin Routes (/admin/*)                      │  │
│  │                                                      │  │
│  │  Controllers (Request Handlers)                      │  │
│  │    ├── Frontend Controllers                         │  │
│  │    │   ├── HomeController                           │  │
│  │    │   ├── MotorGalleryController                   │  │
│  │    │   ├── AuthController                           │  │
│  │    │   └── InstallmentController                    │  │
│  │    └── Admin Controllers                            │  │
│  │        ├── AdminController (Dashboard)              │  │
│  │        ├── MotorController (CRUD)                   │  │
│  │        ├── TransactionController                    │  │
│  │        └── ReportController                         │  │
│  │                                                      │  │
│  │  Services (Business Logic)                          │  │
│  │    ├── TransactionService                           │  │
│  │    │   ├── createTransaction()                      │  │
│  │    │   ├── updateTransaction()                      │  │
│  │    │   ├── generateInstallments()                   │  │
│  │    │   └── handleCreditDetail()                     │  │
│  │    └── WhatsAppService                              │  │
│  │        └── sendMessage()                            │  │
│  │                                                      │  │
│  │  Models (Data Mapping)
 │  │    ├── User                                         │  │
│  │    ├── Motor                                        │  │
│  │    ├── Transaction                                  │  │
│  │    ├── CreditDetail                                 │  │
│  │    ├── Installment                                  │  │
│  │    ├── Document                                     │  │
│  │    ├── Category                                     │  │
│  │    ├── Post (News/Articles)                         │  │
│  │    ├── LeasingProvider                              │  │
│  │    ├── SurveySchedule                               │  │
│  │    ├── TransactionLog                               │  │
│  │    └── Setting                                      │  │
│  │                                                      │  │
│  │  Repositories (Data Access with Caching)            │  │
│  │    └── MotorRepository                              │  │
│  │        ├── getAll() [cached 1 hour]                 │  │
│  │        ├── getWithFilters()                         │  │
│  │        └── findById()                               │  │
│  │                                                      │  │
│  │  Observers (Event Listeners)                        │  │
│  │    ├── TransactionObserver                          │  │
│  │    │   ├── created() → send notifications           │  │
│  │    │   └── updated() → send notifications           │  │
│  │    └── CreditDetailObserver                         │  │
│  │                                                      │  │
│  │  Middleware (Request Pipeline)                      │  │
│  │    ├── AdminMiddleware                              │  │
│  │    ├── VerifiedMiddleware                           │  │
│  │    ├── HandleInertiaRequests                        │  │
│  │    └── RedirectIfAuthenticated                      │  │
│  │                                                      │  │
│  │  Helpers & Utilities                                │  │
│  │    ├── StatusHelper (status mapping)                │  │
│  │    └── CreditFlowHelper (transition validation)     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MySQL 8.0+ Database (utf8mb4 collation)             │  │
│  │                                                      │  │
│  │  CORE Tables (13 active):                            │  │
│  │  ├── users (authentication + profile)                │  │
│  │  ├── motors (product catalog)                        │  │
│  │  ├── categories (motor categories)                   │  │
│  │  ├── transactions (order management)                 │  │
│  │  ├── credit_details (financing details)              │  │
│  │  ├── documents (credit documents)                    │  │
│  │  ├── installments (payment schedule)                 │  │
│  │  ├── leasing_providers (finance partners)            │  │
│  │  ├── survey_schedules (credit survey)                │  │
│  │  ├── transaction_logs (audit trail)                  │  │
│  │  ├── posts (news & articles)                         │  │
│  │  ├── settings (app configuration)                    │  │
│  │  └── notifications (in-app notifications)            │  │
│  │                                                      │  │
│  │  SYSTEM Tables (auto-managed):                       │  │
│  │  ├── sessions (Laravel session)                      │  │
│  │  ├── password_reset_tokens (password reset)          │  │
│  │  └── personal_access_tokens (API auth)               │  │
│  │                                                      │  │
│  │  Relationships: One-to-Many, One-to-One             │  │
│  │  Indexing: Strategic for common queries               │  │
│  │  Caching: 1-hour TTL on motor catalog                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES LAYER                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Midtrans Payment Gateway                            │  │
│  │  ├── Snap Modal (payment UI)                         │  │
│  │  ├── Multi-payment methods                           │  │
│  │  └── Webhook callback handler                        │  │
│  │                                                      │  │
│  │  Fonnte WhatsApp Gateway                             │  │
│  │  └── SMS-like notifications to customers             │  │
│  │                                                      │  │
│  │  Laravel Mail                                        │  │
│  │  └── Email notifications                             │  │
│  │                                                      │  │
│  │  File Storage (Local)                                │  │
│  │  ├── Motor images (/storage/motors)                  │  │
│  │  └── Documents (/storage/documents)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

### Request Processing Flow

```
HTTP Request
    ↓
Route Matching (web.php)
    ↓
Middleware Stack
    ├── Check if authenticated
    ├── Check if admin (for admin routes)
    └── Prepare Inertia props
    ↓
Controller Method
    ├── Validate input
    ├── Call Service/Repository
    └── Return response
    ↓
Service Layer (Business Logic)
    ├── Transform data
    ├── Call Models
    └── Trigger Events/Notifications
    ↓
Model/Repository
    ├── Query database
    ├── Handle caching
    └── Return data
    ↓
Observer (Event Listener)
    ├── Send notifications
    ├── Trigger integrations
    └── Log events
    ↓
Response (JSON or Inertia View)
    ↓
Client (React Component)
```

---

## 🎯 Design Patterns Used

### 1. **MVC (Model-View-Controller)**

- **Models**: Data representation (`/app/Models`)
- **Views**: React components (`/resources/js`)
- **Controllers**: Request handlers (`/app/Http/Controllers`)

### 2. **Repository Pattern**

```php
MotorRepository implements MotorRepositoryInterface
├── getAll()          → Query from cache/db
├── getWithFilters()  → Filter + cache
└── findById()        → Single record + cache
```

**Benefits**:

- Centralized data access
- Easy to swap database
- Built-in caching (1 hour TTL)

### 3. **Service Layer Pattern**

```php
TransactionService
├── createTransaction()      → Business logic
├── updateTransaction()      → Orchestration
├── generateInstallments()   → Complex operations
└── sendStatusNotification() → External calls
```

**Benefits**:

- Separate business logic from controllers
- Reusable across controllers
- Easy to test

### 4. **Observer Pattern**

```php
TransactionObserver
├── created()  → Send notifications when transaction created
└── updated()  → Send notifications on status change
```

**Benefits**:

- Automatic event handling
- Decoupled notifications
- Can add listeners without changing code

### 5. **Dependency Injection**

```php
public function __construct(MotorRepositoryInterface $motorRepository)
{
    $this->motorRepository = $motorRepository;
}
```

**Benefits**:

- Loose coupling
- Easy to mock for testing
- ServiceProvider handles registration

---

## 🗃️ Component Architecture

### Backend Components

#### Controllers

```
Controllers/
├── HomeController                    (Dashboard visitor)
├── MotorGalleryController           (Katalog + order)
├── AuthController                   (Login/Register)
├── ProfileController                (User profile)
├── InstallmentController            (Cicilan)
├── AdminController                  (Admin dashboard)
├── MotorController                  (CRUD motor)
├── TransactionController            (Kelola transaksi)
├── ReportController                 (Laporan)
├── InvoiceController                (Invoice PDF)
├── PaymentCallbackController        (Midtrans webhook)
└── Admin/
    └── AdminProfileController       (Admin profile)
```

#### Services

```
Services/
├── TransactionService
│   ├── Transaction creation/update/delete
│   ├── Credit detail handling
│   ├── Installment generation
│   └── Notification sending
└── WhatsAppService
    └── Message handling via Fonnte
```

#### Models

```
Models/
├── User                    (users table + role)
├── Motor                   (motors table + specs relation)
├── Transaction             (transactions with relations)
├── CreditDetail            (credit_details table)
├── Installment             (installments table)
├── Document                (documents table)
├── MotorSpecification      (motor_specifications)
└── ContactMessage          (contact_messages table)
```

#### Repositories

```
Repositories/
├── MotorRepository
│   ├── getAll() with cache
│   ├── getWithFilters() with cache
│   ├── findById() with cache
│   └── getPopular()
└── MotorRepositoryInterface (Contract)
```

### Frontend Components

#### Page Components (React)

```
resources/js/Pages/
├── Home.jsx                         (Landing page)
├── Auth/
│   ├── Login.jsx
│   └── Register.jsx
├── Motors/
│   ├── Index.jsx                    (Katalog)
│   ├── Show.jsx                     (Detail)
│   ├── Compare.jsx                  (Banding)
│   ├── CashOrderForm.jsx
│   └── CreditOrderForm.jsx
├── Admin/
│   ├── Dashboard.jsx                (Analytics)
│   ├── Motors/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   └── Edit.jsx
│   ├── Transactions/
│   │   ├── Index.jsx
│   │   ├── Show.jsx
│   │   ├── Edit.jsx
│   │   └── Create.jsx
│   ├── Users/
│   ├── Reports/
│   └── Profile/
└── Installments/
    └── Index.jsx
```

#### Reusable Components

```
resources/js/Components/
├── Navigation
├── Sidebar
├── Card
├── Button
├── Modal
├── Form components
└── Chart components
```

---

## 🔌 Integration Architecture

### Payment Integration (Midtrans)

```
Customer clicks "Bayar"
    ↓
InstallmentController::createPayment()
    ├── Set Midtrans config
    ├── Create Snap payment
    └── Return snap_token
    ↓
Frontend: Snap.pay(token)
    ├── Opens payment modal
    └── Customer completes payment
    ↓
Midtrans Server:
    ├── Processes payment
    ├── Updates status
    └── Sends webhook callback
    ↓
PaymentCallbackController::handle()
    ├── Verify notification
    ├── Update installment status
    └── Update transaction status
    ↓
TransactionObserver::updated()
    ├── Sends email notification
    └── Sends WhatsApp notification
```

### Notification Architecture

```
Event Trigger (create/update transaction)
    ↓
TransactionObserver
    ├── created()
    │   ├── Notification::send(admin users)
    │   └── Notification::send(customer)
    └── updated()
        ├── Check if status changed
        ├── Notification::send(admin users)
        └── Notification::send(customer)
    ↓
Notification Classes
    ├── TransactionCreated
    └── TransactionStatusChanged
    ↓
Notification Channels
    ├── Email (via mail)
    ├── WhatsApp (via service)
    └── Database (in-app)
```

---

## 📊 Database Architecture

### Core Schema Relationships

```
users (1) ──── (many) transactions
              (many) contact_messages

motors (1) ──── (many) transactions
         (1) ──── (many) motor_specifications

transactions (1) ──── (1) credit_details
            (1) ──── (many) installments

credit_details (1) ──── (many) documents
```

### Key Tables

```
users                      → User accounts + roles
motors                     → Vehicle inventory
motor_specifications       → Vehicle specs
transactions               → All orders (cash/credit)
credit_details             → Credit-specific info
installments               → Payment schedule
documents                  → Uploaded files
contact_messages           → Customer inquiries
notifications              → System messages
```

---

## 🚀 Deployment Architecture

### Development Environment

```
Local Machine
├── Laravel dev server (port 8000)
├── Node.js dev server (Vite)
├── MySQL database
└── Redis (optional caching)
```

### Production Environment

```
Web Server (Apache/Nginx)
├── Application Server (Laravel)
├── Database Server (MySQL)
├── File Storage (Local/S3)
├── Cache Server (Redis/Memcached)
├── Queue Worker (Laravel Horizon)
└── Log Management (Syslog/ELK)
```

### Asset Pipeline

```
resources/js/     ─┐
resources/css/    ──→ Vite ──→ npm run build ──→ public/build/
                  ┘
```

---

## 🔐 Security Architecture

### Authentication Flow

```
Login Form
    ↓
AuthController::login()
    ├── Validate credentials
    ├── Auth::attempt()
    └── Session regenerate
    ↓
Middleware (auth/guest)
    ├── Check session
    ├── Verify role if admin
    └── Redirect if unauthorized
    ↓
Response with user context
```

### CSRF Protection

- Inertia middleware handles CSRF token
- Forms auto-include token in React
- SERVER checks token validity

### Password Security

- Bcrypt hashing (Hash::make())
- Minimum 8 characters required
- Password reset via email token

---

## ⚡ Performance Architecture

### Caching Strategy

```
MotorRepository
    ├── Cache key: motors:all:withSpecs:10
    ├── TTL: 1 hour (3600 seconds)
    ├── Driver: File (or Redis if available)
    └── Clear on: Motor create/update/delete
```

### Query Optimization

```
Eager Loading:
  Motor::with('specifications')->get()

Pagination:
  Motor::paginate(12)  → reduces load

Indexing:
  - Foreign keys: user_id, motor_id
  - Search fields: name, brand, type
  - Status fields: transaction status
```

### Frontend Optimization

```
React:
  ├── Code splitting (dynamic imports)
  ├── Lazy loading (images)
  └── Memo/useMemo for expensive renders

Tailwind:
  ├── JIT compilation
  ├── Purges unused styles
  └── Optimized bundle

Assets:
  ├── Minified on production
  ├── Versioned for caching
  └── CDN-ready
```

---

## 📈 Scalability Architecture

### Horizontal Scaling

- Stateless application (sessions in DB/cache)
- Load balancer → multiple app servers
- Shared database server
- Shared file storage (S3 ready)

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement advanced caching
- Use queue workers for heavy jobs

### Database Optimization

- Connection pooling
- Query indexing
- Read replicas (for large scale)
- Database sharding (if needed)

---

**Architecture Last Updated**: March 6, 2026
