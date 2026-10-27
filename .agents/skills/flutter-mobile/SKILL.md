---
name: flutter-mobile
description: Development patterns, state management, REST API integration, and responsive mobile UI for the SRB Motor Flutter application in mobile/.
---

# Flutter Mobile Development (SRB Motor)

Use this skill when developing, refactoring, or building the Flutter customer application located in `mobile/`.

## 1. Directory & Code Organization
- **Root**: `mobile/lib/`
  - `models/`: Data models with JSON deserialization (`Motor`, `Transaction`, `User`, `Branch`).
  - `screens/`: UI Views (Katalog, Detail Motor, Order Form, Riwayat Cicilan, Profil).
  - `app_state.dart`: Global state management and authentication token management.
  - `main.dart`: Entry point, theme definitions, and top-level navigation.

## 2. API Communication & Token Handling
- Base URL configured from environment or constants pointing to `/api/` on Laravel backend.
- Store authentication token securely using `flutter_secure_storage` or shared preferences.
- Attach `Authorization: Bearer <token>` header to all protected requests.
- Handle token expiration (HTTP 401) by clearing credentials and redirecting to the login screen.

## 3. UI, Assets & Performance
- Consume shared assets from `assets/` directory (Single Source of Truth).
- Use `CachedNetworkImage` for catalog images to optimize bandwidth and smooth scrolling.
- Support responsive layout across different smartphone screen widths.
- Implement pull-to-refresh on catalog and transaction history screens.
