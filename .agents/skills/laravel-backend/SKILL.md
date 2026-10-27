---
name: laravel-backend
description: Best practices for Laravel 12 backend development in SRB Motor, covering Eloquent models, controllers, Inertia responses, Sanctum REST APIs, Midtrans payments, and service layers.
---

# Laravel Backend Development Guide (SRB Motor)

Use this skill when developing, refactoring, or debugging the backend application located in `backend/`.

## 1. Architecture & Layering
- **Directory**: `backend/app/`
- **Controllers**:
  - Web views use Inertia: `Inertia::render('PageName', $props)`
  - Mobile APIs in `app/Http/Controllers/Api/`: return JSON responses (`response()->json([...])`)
- **Services** (`app/Services/`):
  - `PaymentService`: Encapsulates Midtrans Snap token generation, status checking, and settlement.
  - `BranchService`: Encapsulates branch coordinates, Haversine distance, and stock availability across branches.
  - `WhatsAppService`: Encapsulates Fonnte WhatsApp notification dispatching.
  - `CreditService`: Manages credit review, document validation, and installment schedule generation.

## 2. Controllers & Request Lifecycle
- Always validate input with `$request->validate([...])` or Form Requests (`app/Http/Requests`).
- Never run heavy logic or external HTTP calls directly in blade or inertia render paths; delegate to services or queued jobs.
- Use Database Transactions (`DB::beginTransaction()`, `DB::commit()`, `DB::rollBack()`) for multi-step mutations (e.g. creating transaction + credit details + installments + updating motor availability).

## 3. Eloquent & Query Best Practices
- Prevent N+1 queries by eager loading relations: `Transaction::with(['user', 'motor', 'creditDetail.documents', 'installments'])`.
- Scope model queries when filtering by status or user (`$query->where('user_id', auth()->id())`).
- Use model attribute casting (`$casts = ['operational_hours' => 'array', 'price' => 'decimal:2']`).

## 4. REST API & Mobile Contract (Sanctum)
- Mobile routes are defined in `backend/routes/api.php` under `Route::middleware('auth:sanctum')`.
- Endpoints must follow standard REST conventions and return consistent JSON structure:
  ```json
  {
    "success": true,
    "message": "Deskripsi sukses",
    "data": { ... }
  }
  ```
- Keep `docs/openapi.json` and Postman collection updated whenever API contracts change.
