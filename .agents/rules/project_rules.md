# SRB Motor Project Rules & Monorepo Context

## 1. Monorepo Root & Paths
- **Backend (Web & API)**: `backend/` (Laravel 12, Inertia.js, React 19). Commands like `composer`, `npm`, `php artisan` MUST be run inside `backend/`.
- **Mobile (App)**: `mobile/` (Flutter & Dart SDK). Flutter commands MUST be run inside `mobile/`.
- **Assets**: `assets/` (Centralized static assets for both web and mobile).
- **Docs**: `docs/` (Architecture diagrams, OpenAPI JSON, UML, and presentation files).

## 2. Coding Standards
- Maintain strict database integrity: always enforce foreign keys and use database transactions for financial mutations.
- Protect customer identification documents (KTP/KK) by storing them strictly in private disk (`storage/app/private/documents/`).
- Verify Midtrans webhook signatures on all incoming payment notifications.
- Follow the Ponytail philosophy: shortest working diff, standard framework features first, no unrequested abstractions.
