# PHASE 1 IMPLEMENTATION GUIDE - SRB MOTORS

**Target Duration**: 7 days  
**Deliverable**: Home page + Navbar + Footer redesigned with new design system  
**Status**: Ready to Start

---

## 📍 STARTING POINT

**Current State**:

- Multiple CSS files: `app.css`, `home.css`, `style.css`, `admin.css`
- Tailwind but with custom colors mixed in
- Neon colors (#00ff00, #ff00ff) need removal
- React components exist but styling inconsistent

**End State (Phase 1)**:

- Single source of truth: `tailwind.config.js` + component-scoped styles
- Professional color palette applied globally
- Navbar, Footer, Home page matching design mockups
- All tokens in DESIGN_SYSTEM.md applied
- No neon, no excessive motion, no inconsistent spacing

---

## 🛠️ SETUP: Tailwind Configuration

**File**: `tailwind.config.js`

Replace entire content with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/views/**/*.blade.php", "./resources/js/**/*.jsx"],
    theme: {
        extend: {
            // Color palette - SRB Motors Design System
            colors: {
                // Primary Blue
                blue: {
                    50: "#F0F9FF",
                    100: "#E0F2FE",
                    200: "#BAE6FD",
                    300: "#7DD3FC",
                    400: "#38BDF8",
                    500: "#0EA5E9",
                    600: "#2563EB", // ← MAIN use this
                    700: "#1D4ED8",
                    800: "#1E40AF",
                    900: "#1E3A8A",
                },
                // Neutral/Gray - exact from design system
                gray: {
                    50: "#F9FAFB",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#D1D5DB",
                    400: "#9CA3AF",
                    500: "#6B7280",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                    900: "#111827",
                },
                // Success/Green
                green: {
                    50: "#ECFDF5",
                    100: "#D1FAE5",
                    200: "#A7F3D0",
                    300: "#6EE7B7",
                    400: "#34D399",
                    500: "#10B981", // ← MAIN use this
                    600: "#059669",
                    700: "#047857",
                    800: "#065F46",
                    900: "#064E3B",
                },
                // Warning/Amber
                yellow: {
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    200: "#FDE68A",
                    300: "#FCD34D",
                    400: "#FBBF24",
                    500: "#F59E0B",
                    600: "#D97706",
                    700: "#B45309",
                    800: "#92400E",
                    900: "#78350F",
                },
                // Danger/Red
                red: {
                    50: "#FEE2E2",
                    100: "#FECACA",
                    200: "#FCA5A5",
                    300: "#F87171",
                    400: "#F87171",
                    500: "#EF4444",
                    600: "#DC2626",
                    700: "#B91C1C",
                    800: "#991B1B",
                    900: "#7F1D1D",
                },
            },

            // Typography
            fontFamily: {
                sans: [
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "system-ui",
                    "sans-serif",
                ],
                mono: ["Monaco", "Menlo", "monospace"],
            },
            fontSize: {
                xs: ["12px", { lineHeight: "1.5", letterSpacing: "0.2px" }],
                sm: ["14px", { lineHeight: "1.5", letterSpacing: "0.25px" }],
                base: ["16px", { lineHeight: "1.5", letterSpacing: "0.3px" }],
                lg: ["18px", { lineHeight: "1.5", letterSpacing: "0.3px" }],
                xl: ["20px", { lineHeight: "1.4", letterSpacing: "0px" }],
                "2xl": ["24px", { lineHeight: "1.25", letterSpacing: "0px" }],
                "3xl": ["28px", { lineHeight: "1.2", letterSpacing: "-0.3px" }],
                "4xl": ["32px", { lineHeight: "1.2", letterSpacing: "-0.5px" }],
            },
            fontWeight: {
                thin: 100,
                extralight: 200,
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800,
                black: 900,
            },

            // Spacing - 8px base
            spacing: {
                px: "1px",
                0: "0",
                0.5: "2px",
                1: "4px",
                1.5: "6px",
                2: "8px",
                2.5: "10px",
                3: "12px",
                3.5: "14px",
                4: "16px",
                5: "20px",
                6: "24px",
                7: "28px",
                8: "32px",
                9: "36px",
                10: "40px",
                12: "48px",
                14: "56px",
                16: "64px",
                20: "80px",
                24: "96px",
                28: "112px",
                32: "128px",
                36: "144px",
                40: "160px",
                44: "176px",
                48: "192px",
                52: "208px",
                56: "224px",
                60: "240px",
                64: "256px",
                72: "288px",
                80: "320px",
                96: "384px",
            },

            // Border Radius
            borderRadius: {
                none: "0",
                sm: "2px",
                DEFAULT: "4px",
                md: "6px",
                lg: "8px",
                xl: "12px",
                "2xl": "16px",
                full: "9999px",
            },

            // Shadows
            boxShadow: {
                none: "none",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                DEFAULT:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            },

            // Transitions
            transitionDuration: {
                100: "100ms",
                150: "150ms",
                200: "200ms",
                300: "300ms",
                500: "500ms",
                700: "700ms",
                1000: "1000ms",
            },
            transitionTimingFunction: {
                DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
                linear: "linear",
                in: "cubic-bezier(0.4, 0, 1, 1)",
                out: "cubic-bezier(0, 0, 0.2, 1)",
                "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        },
    },
    plugins: [],
};
```

**Verify**: Run `npm run build` to ensure no errors

---

## 🎨 STEP 1: Create Design System CSS

**File**: `resources/css/design-system.css`

```css
/* SRB Motors Design System - CSS Custom Properties */

:root {
    /* Colors */
    --color-primary: #2563eb;
    --color-primary-dark: #1d4ed8;
    --color-primary-darker: #1e40af;

    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;

    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-400: #9ca3af;
    --color-gray-500: #6b7280;
    --color-gray-600: #4b5563;
    --color-gray-700: #374151;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;

    /* Typography */
    --font-family-sans:
        "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
        sans-serif;
    --font-family-mono: "Monaco", "Menlo", monospace;

    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 28px;
    --font-size-4xl: 32px;

    /* Spacing */
    --space-unit: 8px;
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 12px;
    --space-lg: 16px;
    --space-xl: 24px;
    --space-2xl: 32px;
    --space-3xl: 48px;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md:
        0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-lg:
        0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Transitions */
    --transition-fast: 100ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slower: 300ms cubic-bezier(0.4, 0, 0.2, 1);

    /* Border Radius */
    --radius-sm: 2px;
    --radius-md: 4px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    --radius-full: 9999px;
}

/* Semantic color aliases */
:root {
    --color-bg-default: white;
    --color-bg-secondary: var(--color-gray-50);
    --color-text-primary: var(--color-gray-900);
    --color-text-secondary: var(--color-gray-700);
    --color-text-tertiary: var(--color-gray-500);
    --color-text-disabled: var(--color-gray-400);
    --color-border-default: var(--color-gray-200);
    --color-focus-ring: var(--color-primary);
}

/* Global Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-family-sans);
    color: var(--color-text-primary);
    background-color: var(--color-bg-default);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* NO NEON, NO MOTION ANIMATION - Keep Professional */
```

**Update**: `resources/css/app.css`

```css
@import "./design-system.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Remove old styles - delete these sections if present:
   - .neon-glow
   - .animate-pulse (replace with opacity)
   - .animate-bounce (remove completely)
   - .gradient-animation (remove)
   - Any @keyframes with "bounce", "ping", "pulse", "shake"
*/

/* Global component styles */

/* Utility: Full height layout */
.min-h-screen {
    min-height: 100vh;
}

/* Utility: Container widths */
.container-xs {
    max-width: 320px;
}
.container-sm {
    max-width: 640px;
}
.container-md {
    max-width: 768px;
}
.container-lg {
    max-width: 1024px;
}
.container-xl {
    max-width: 1280px;
}
.container-2xl {
    max-width: 1536px;
}

@media (max-width: 768px) {
    .container-lg,
    .container-xl,
    .container-2xl {
        max-width: 100%;
        padding: 0 16px;
    }
}
```

**Verify**: Check in browser - should see new colors loading

---

## 🏗️ STEP 2: Create Navbar Component

**File**: `resources/js/Components/Public/Navbar.jsx`

```jsx
import { Link } from "@inertiajs/react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/motors", label: "Daftar Motor" },
        { href: "/contact", label: "Hubungi Kami" },
        { href: "/faq", label: "FAQ" },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-150 font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <span className="text-sm text-gray-700">
                                    Halo, {auth.user.name}
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                                >
                                    Keluar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-gray-700 hover:text-blue-600 font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        {auth.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block py-2 text-blue-600 font-medium text-sm"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    className="block py-2 text-gray-700 font-medium text-sm"
                                >
                                    Keluar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block py-2 text-blue-600 font-medium text-sm"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="block py-2 text-blue-600 font-medium text-sm"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
```

---

## 🎯 STEP 3: Redesign Home Page

**File**: `resources/js/Pages/Home.jsx` (Full replacement coming soon in separate file)

---

## ✅ PHASE 1 CHECKLIST

- [ ] Update `tailwind.config.js` with new color tokens
- [ ] Create `design-system.css` with CSS variables
- [ ] Update `app.css` - import new styles, remove neon animations
- [ ] Create Button, Input, Card, Badge components in `resources/js/Components/UI/`
- [ ] Create Navbar component
- [ ] Create Footer component
- [ ] Redesign Home page layout
- [ ] Redesign Motors/Index catalog page
- [ ] Test all responsive breakpoints
- [ ] Deploy to staging for review
- [ ] Get approval before Phase 2

---

**Next**: Once approved, proceed to PHASE_2_IMPLEMENTATION_GUIDE.md
