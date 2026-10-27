---
name: frontend-ui-engineering
description: React 19, Inertia.js, and Tailwind CSS frontend engineering patterns for the SRB Motor web application in backend/resources/js/.
---

# Frontend UI Engineering (React + Inertia + Tailwind)

Use this skill when developing or modifying web user interfaces for Customer or Admin portals in `backend/resources/js/`.

## 1. Stack & Directory Structure
- **Framework**: React 19 with Inertia.js (`@inertiajs/react`).
- **Styling**: Tailwind CSS + Bootstrap utilities.
- **Directory**: `backend/resources/js/`
  - `Pages/`: Inertia Page components (e.g. `Home.jsx`, `Motors/`, `Admin/`).
  - `Components/`: Reusable widgets (Navbar, Footer, Modal, Cards, Badges).
  - `Layouts/`: Base application layout (`AppLayout.jsx`, `AdminLayout.jsx`).

## 2. Inertia Form Handling & State
- Always use `useForm()` hook from `@inertiajs/react` for form submissions.
  - Automatically manages `data`, `setData`, `post`, `put`, `processing`, and `errors`.
- Show clear loading and disabled states on submit buttons while `processing === true`.
- Handle flash messages (`props.flash.success`, `props.flash.error`) using toast or alert notifications.

## 3. Responsive & Accessible UI
- Design mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
- Ensure interactive elements have adequate tap targets (min 44x44px).
- Provide meaningful alt text for motor images and clear labels for input fields.
