# 🤖 AI Agent Customization - SRB Motor Project

**Project**: SRB Motor Dealer Platform with Credit Financing  
**Stack**: Laravel 12 + React 19 + Inertia.js + Flutter (Mobile)  
**Last Updated**: March 19, 2026  
**Status**: 🟢 Production-Ready with Mobile Development Plan

---

## 📋 Project Overview

SRB Motor adalah platform dealer motor dengan sistem credit financing terintegrasi. Platform menghubungkan:

- **Customers**: Browse motors, apply credit, upload documents, track status
- **Admin**: Manage credit applications, process documents, handle surveys, approve/reject
- **Leasing Partners**: Provide financing decisions, manage survey process

---

## 🏗️ Core Architecture Patterns

### Naming Conventions

- **Controllers**: `[Domain][Entity]Controller` (e.g., `CreditController`, `MotorGalleryController`)
- **Services**: `[Domain]Service` (e.g., `CreditService`, `TransactionService`)
- **Models**: Singular + PascalCase (e.g., `CreditDetail`, `LeasingProvider`)
- **Requests**: `Store[Entity]Request`, `Update[Entity]Request`
- **Routes**: kebab-case (e.g., `/admin/credits/{id}/approve`)
- **Resources**: `[Entity]Resource` for API responses
- **Migrations**: `YYYY_MM_DD_HHMMSS_action_table_name`

### File Organization

```
app/
├── Http/Controllers/
│   ├── Admin/              # Admin-specific controllers
│   ├── Auth/               # Auth controllers
│   └── [Feature]Controller # Feature controllers
├── Services/               # Business logic layer
├── Models/                 # Eloquent models
├── Requests/               # Form validation
└── Exports/                # Excel exports
resources/
├── js/
│   ├── Pages/
│   │   ├── Admin/          # Admin pages
│   │   ├── Motors/         # User-facing pages
│   │   └── Auth/           # Auth pages
│   ├── Components/         # Reusable components
│   └── Layouts/            # Layout components
```

---

## 🔄 Credit Workflow (CRITICAL DOMAIN)

The **credit approval workflow** is the core domain. Always be aware that:

### Status Flow

```
pengajuan_masuk
  → verifikasi_dokumen
  → dikirim_ke_leasing
  → survey_dijadwalkan
  → menunggu_keputusan_leasing
  → disetujui
  → dp_dibayar
  → selesai
```

### Key Rules

- **Document verification**: All documents must be approved/rejected BEFORE status can change to `verifikasi_dokumen`
- **Leasing selection**: User selects during order, admin can override in "Send to Leasing" modal
- **Status transitions**: Only available transitions shown in "Aksi Tersedia" panel
- **No status bypass**: Cannot skip workflow stages, must follow sequence strictly

### Common Pitfalls to Avoid

❌ Don't auto-change status on document approve/reject (violates workflow)
❌ Don't require leasing input if user already selected during order (redundant)
❌ Don't show unavailable transitions in UI (confuses admin)
✅ Always validate all pending documents before status transition
✅ Honor user's leasing choice, allow admin override
✅ Show clear validation messages when workflow blocked

---

## 🎨 Frontend Patterns (React + Inertia)

### Component Structure

```javascript
export default function PageName({ data, errors }) {
    // State
    const { data: formData, setData, post, processing } = useForm({...});

    // Handlers
    const handleSubmit = (e) => { ... };

    // Render
    return <AdminLayout>...</AdminLayout>;
}
```

### Form Handling

- Always use Inertia's `useForm()` hook
- Validate on backend, show errors in UI
- Use `formData` for controlled inputs
- Show loading spinner during `processing`

### Styling

- Use **CoreUI** components (CButton, CCard, CAlert, etc)
- Add **Lucide icons** for consistency
- Custom styling with Tailwind classes
- Use `className="d-flex gap-3"` for spacing (CoreUI uses Bootstrap utils)

### Modals

- Store `activeModal` state as string
- Use `CModal visible={activeModal === "modalName"}`
- Clear modal on close: `setActiveModal(null)`
- Handle form submission with `onFinish` callback

---

## 💾 Database Patterns

### Key Tables

- **users**: Customer && admin accounts (includes profile fields)
- **motors**: Motor catalog
- **categories**: Motor categories (skuter matik, matic sport, dll)
- **transactions**: Order/credit request records
- **credit_details**: Credit application data with financing details
- **documents**: User-uploaded documents with approval_status
- **installments**: Payment schedule (cicilan) with Midtrans integration
- **leasing_providers**: Available financing partners (Astra, BCA Finance, dll)
- **survey_schedules**: Survey appointment records for credit verification
- **transaction_logs**: Audit trail for all transaction status changes
- **posts**: News & articles for customer information
- **settings**: System configuration (can be changed without code)
- **notifications**: In-app notification system

### Status Fields

- Always use `status` (string) for workflow state
- Always include `approval_status` for document approval
- Use `created_at`, `updated_at` for timestamps
- Foreign keys: `[table_singular]_id` (e.g., `leasing_provider_id`)

---

## 🔧 Backend Service Layer

### CreditService Pattern

```php
// In controller
$this->creditService->verifyDocuments($credit, $notes);

// In service
public function verifyDocuments(CreditDetail $credit, string $notes)
{
    // Business logic here
    // Update credit status
    // Create timeline entry
    // Send notifications
}
```

### Key Services

- **CreditService**: Credit workflow, transitions, validations
- **TransactionService**: Transaction CRUD, installment generation
- **WhatsAppService**: Send messages to users/admins

---

## 📱 User Flows (Understand These!)

### 1. Credit Application Flow

```
User fills form
  → Selects leasing provider
  → Confirms application
  → Redirected to upload documents
  → Documents shown in transaction detail page
  → Admin reviews and approves/rejects individual documents
  → User sees document status in their transaction detail
  → Admin clicks "Verify Documents" to proceed
```

### 2. Document Upload Flow

```
User uploads KTP, KK, Slip Gaji
  → Stored with approval_status = "pending"
  → Admin sees in detail page with approve/reject buttons
  → Admin approves/rejects with reason
  → User sees updated status immediately
  → Admin can verify only when 0 pending documents
```

### 3. Admin Workflow (Aksi Tersedia Panel)

```
Check available actions based on current status
  → Click action button
  → Modal appears with form
  → Fill required fields
  → Submit form
  → Status transitions to next stage
  → Timeline updated
  → Available actions update
```

---

## ⚠️ Common Anti-Patterns (Avoid These!)

❌ **Hard-coding status strings** → Use constants or enums  
❌ **Missing validation before transitions** → Always check prerequisites  
❌ **Showing all buttons at once** → Show only available transitions  
❌ **Redundant form inputs** → Reuse data from previous steps  
❌ **No error handling** → Always show user-friendly error messages  
❌ **Mixing business logic in controllers** → Extract to services  
❌ **Inconsistent naming** → Follow conventions strictly

---

## 🧪 Testing & Quality

### Before Suggesting Code

- [ ] Does it follow the naming conventions?
- [ ] Is business logic in a service, not controller?
- [ ] Does it respect the credit workflow rules?
- [ ] Are validators used for all inputs?
- [ ] Is the UI showing available actions only?
- [ ] Does it handle errors gracefully?

### Typical Issues to Fix

- Validation missing or incorrect
- Routes not in proper middleware groups
- Status changes without validation
- UI components not properly styled for consistency
- Missing error handling/user feedback

---

## 🚀 Performance Considerations

- **Eager load relationships**: `with(['documents', 'leasingProvider', ...])`
- **Pagination**: Use for large lists (credits, transactions, etc)
- **Caching**: Consider for leasing providers, settings
- **Indexes**: credit_details.status, transactions.user_id, documents.credit_detail_id

---

## 📚 Quick Reference

**Timezone**: Asia/Jakarta (or configured in .env)  
**Date Format**: d-m-Y (Indonesian format)  
**Currency**: IDR (Rupiah)  
**Language**: Indonesian bahasa for UI  
**Admin Path**: `/admin/*`  
**API Path**: `/api/*` (if needed)

---

## 🎯 Agent Instructions

When working on this project:

1. **Always understand the context** - What workflow stage are we in?
2. **Check the flow** - Is the suggested change respecting workflow rules?
3. **Suggest patterns** - Recommend using existing services/patterns
4. **Validate thoroughly** - Ask about edge cases and error scenarios
5. **Document changes** - Update CREDIT_FLOW.md if workflow changes
6. **Think about users** - How will customers/admins perceive this change?
7. **Stack-specific** - Remember: Laravel backend, React frontend, Inertia.js bridge
8. **Database first** - Check schema before suggesting features
9. **Test mentally** - Walk through the flow, check for gaps
10. **Clean code** - Follow conventions, avoid shortcuts

---

## 📱 Mobile Development Context (Flutter)

### What Changed (March 2026)

The project now includes a **Flutter mobile app development** parallel track:

- **MOBILE_DESIGN_COURSE_PROJECT.md**: Simplified mobile spec for MP-1 course project (MVP features)
- **MOBILE_DESIGN_SPECIFICATION.md**: Production-grade comprehensive mobile specification
- **API_REFERENCE.md**: Complete REST API documentation for mobile integration

### Mobile vs Web Differences to Know

- Mobile uses **JWT tokens** (not Laravel session cookies)
- Mobile database models same, but API payloads may differ
- Mobile has **iOS & Android safe area handling** requirements
- Mobile queries may be filtered for **performance** (smaller payloads)

### Key APIs for Mobile Agents

When helping with mobile development, refer to [API_REFERENCE.md](API_REFERENCE.md):

- Authentication endpoints (`/login`, `/register`, `/otp-verify`)
- Motor search & filtering (`/api/search/motors`)
- Transaction creation (`/motors/{motor}/process-cash-order`, `/process-credit-order`)
- Installment tracking (`/installments`, `/installments/{id}/pay`)
- Admin endpoints for credit approval

### Cross-Platform Consistency

- Web and mobile should show **same data**, access **same database**
- Status flows must be **identical** on both platforms
- Credit workflow rules apply **everywhere**

---

## 📚 Documentation Structure (Updated March 19, 2026)

### For Web Developers

- [INSTRUCTIONS.md](INSTRUCTIONS.md) - Code style & patterns
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [DATABASE.md](DATABASE.md) - All 13 active tables + schema
- [CREDIT_FLOW.md](CREDIT_FLOW.md) - Critical workflow
- [API_REFERENCE.md](API_REFERENCE.md) - REST API docs

### For Mobile Developers

- [MOBILE_DESIGN_COURSE_PROJECT.md](MOBILE_DESIGN_COURSE_PROJECT.md) - Course project MVP (~800 lines, simplified)
- [MOBILE_DESIGN_SPECIFICATION.md](MOBILE_DESIGN_SPECIFICATION.md) - Production spec (~5,300 lines, comprehensive)
- [API_REFERENCE.md](API_REFERENCE.md) - Same REST API docs
- [DATABASE.md](DATABASE.md) - Same database schema (13 tables)

### For Architects & Team Leads

- [AGENT.md](AGENT.md) - This file (agent context & patterns)
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design overview
- [BUSINESS_LOGIC.md](BUSINESS_LOGIC.md) - Domain rules

---

**Last Review**: March 19, 2026
**Updated Sections**: Mobile context, Documentation structure
**Maintained By**: Development Team  
**Status**: 🟢 Active & Current
