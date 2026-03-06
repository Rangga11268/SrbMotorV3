# UI/UX DESIGN SPECIFICATION - SRB MOTORS REDESIGN

**Version**: 2.0 - Modern Minimalist  
**Date**: March 6, 2026  
**Status**: Ready for Implementation

---

## 📐 DESIGN SYSTEM TOKENS

### Color Palette

#### Primary Colors
```
Brand/Primary:
  - Light:      #3B82F6  (rgb(59, 130, 246))
  - Main:       #2563EB  (rgb(37, 99, 235))  ← Use this
  - Dark:       #1D4ED8  (rgb(29, 78, 216))
  - Darker:     #1E40AF  (rgb(30, 64, 175))

Neutral/Gray Scale:
  - 50:   #F9FAFB   (Bg very light)
  - 100:  #F3F4F6   (Bg light - hover)
  - 200:  #E5E7EB   (Border, divider)
  - 300:  #D1D5DB   (Border secondary)
  - 400:  #9CA3AF   (Placeholder text)
  - 500:  #6B7280   (Text secondary)
  - 600:  #4B5563   (Text body)
  - 700:  #374151   (Text primary)
  - 800:  #1F2937   (Text dark)
  - 900:  #111827   (Text darkest, headings)

Success/Green:
  - Light:      #ECFDF5
  - Main:       #10B981  ← Use this
  - Dark:       #059669

Warning/Amber:
  - Light:      #FFFBEB
  - Main:       #F59E0B
  - Dark:       #D97706

Danger/Red:
  - Light:      #FEE2E2
  - Main:       #EF4444
  - Dark:       #DC2626
```

#### How to Use
```
Background:     #FFFFFF (white) atau #F9FAFB (off-white untuk section)
Text Primary:   #111827 (headings, important text)
Text Secondary: #6B7280 (body, descriptions)
Text Tertiary:  #9CA3AF (helper text, placeholders)
Border:         #E5E7EB (card borders, dividers)
Interactive:    #2563EB (links, focus states)
Success:        #10B981 (confirmation, approved status)
Error:          #EF4444 (danger, error messages)
```

---

### Typography

#### Font Family
```
Body Font:       "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif
Mono Font:       "Monaco", "Menlo", monospace (untuk code)

Note: Inter sudah tersedia di Google Fonts, cepat loading.
Fallback system font sebagai backup jika CDN down.
```

#### Font Sizes & Weights

```
Display / Hero:
  Size:     32px (2rem)
  Weight:   700 (bold)
  Line-H:   1.2  (tight untuk heading)
  Letter:   -0.5px

H1 (Page Title):
  Size:     28px (1.75rem)
  Weight:   700
  Line-H:   1.2
  Letter:   -0.3px

H2 (Section Title):
  Size:     24px (1.5rem)
  Weight:   600 (semibold)
  Line-H:   1.25
  Letter:   0px

H3 (Subsection):
  Size:     20px (1.25rem)
  Weight:   600
  Line-H:   1.4
  Letter:   0px

Body / Large:
  Size:     16px (1rem)
  Weight:   400 (regular)
  Line-H:   1.5   (comfort untuk reading)
  Letter:   0.3px

Body / Regular:
  Size:     14px (0.875rem)
  Weight:   400
  Line-H:   1.5
  Letter:   0.25px

Small / Caption:
  Size:     12px (0.75rem)
  Weight:   400
  Line-H:   1.5
  Letter:   0.2px

Bold Variant: Add weight 600-700 untuk emphasis
```

---

### Spacing System (8px Base)

```
0:    0px
px:   1px
0.5:  2px
1:    4px
1.5:  6px
2:    8px
2.5:  10px
3:    12px
3.5:  14px
4:    16px
5:    20px
6:    24px
7:    28px
8:    32px
9:    36px
10:   40px
12:   48px
14:   56px
16:   64px
20:   80px
24:   96px
28:   112px
32:   128px
36:   144px
40:   160px
44:   176px
48:   192px
52:   208px
56:   224px
60:   240px
64:   256px
72:   288px
80:   320px
96:   384px

Usage:
  - Padding inside components:  p-3, p-4, p-6
  - Margin between elements:    my-4, mb-6
  - Gap dalam grid/flex:        gap-3, gap-4
  - Line height:                leading-6, leading-7
```

---

### Border Radius

```
None:           0px
Small:          2px    (Untuk very subtle, rarely used)
Default:        4px    ← Most common (inputs, buttons, cards)
Medium:         6px    (Slightly rounded)
Large:          8px    (Cards hover effect, larger buttons)
XL:             12px   (Modal, larger components)
2XL:            16px   (Occasionally)
Full/Pill:      9999px (Fully rounded - badges, buttons with icon only)
```

---

### Shadows

```
None:           none

Small/Subtle:   0 1px 2px 0 rgba(0, 0, 0, 0.05)
                (Buttons, cards on hover)

Default/Base:   0 1px 3px 0 rgba(0, 0, 0, 0.1),
                0 1px 2px 0 rgba(0, 0, 0, 0.06)
                (Default card shadow)

Medium:         0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06)
                (Elevated elements, dropdown)

Large:          0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05)
                (Modal, spotlight)

XL:             0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04)
                (Large hero elements)

2XL:            0 25px 50px -12px rgba(0, 0, 0, 0.25)
                (Very rare - only special hero moments)

NO GLOW/MULTIPLE SHADOW unless very intentional
NO COLOR SHADOW (keep all shadows in grayscale)
```

---

### Transitions & Animations

```
Duration:
  - Fast:    100ms   (Quick feedback like button hover)
  - Default: 150ms   (Standard state change)
  - Slow:    200ms   (Visibility change, fade)
  - Slower:  300ms   (Modal open, page transition)

Easing:
  - Default: ease (cubic-bezier(0.4, 0, 0.2, 1))
  - Linear:  linear (for progress bar)
  - In:      ease-in
  - Out:     ease-out (prefer for disappearing)
  - InOut:   ease-in-out

NO overshooting animations
NO bounce/elastic effects
Keep it professional and calm
```

---

### Component Tokens

#### Buttons

```
Primary Button:
  Bg:        #2563EB
  Text:      white
  Padding:   12px 16px (py-3 px-4)
  Border-R:  4px
  Font:      14px, weight 600
  State:
    - Default:  bg-blue-600
    - Hover:    bg-blue-700, shadow-small
    - Active:   bg-blue-800
    - Disabled: bg-gray-300, text-gray-500, cursor-not-allowed
  Transition: 150ms ease

Secondary Button:
  Bg:        #F3F4F6
  Text:      #111827
  Border:    1px solid #E5E7EB
  Padding:   12px 16px
  Border-R:  4px
  State:
    - Hover:  bg-gray-100, border-gray-300
    - Active: bg-gray-200

Ghost Button:
  Bg:        transparent
  Text:      #2563EB
  Padding:   12px 16px
  State:
    - Hover:  bg-blue-50
    - Active: bg-blue-100

Full-width Button:
  Width:     100%
  Common in forms & mobile
```

#### Input Fields

```
Text Input / Form Field:
  Height:       44px (py-2.5, allowing icon space)
  Padding:      12px 14px (px-3.5 py-2.5)
  Border:       1px solid #E5E7EB
  Border-R:     4px
  Bg:           white
  Text:         #111827, size 14px
  Placeholder:  #9CA3AF
  Font-W:       400
  
  State:
    - Focus:     border-blue-600, outline none, shadow small
    - Error:     border-red-500, bg-red-50
    - Disabled:  bg-gray-100, cursor-not-allowed
    - Success:   border-green-600
  
  Transition:   border-color 150ms ease, shadow 150ms ease

Textarea:
  Min-height:   100px (6 rows)
  Resize:       vertical
  Padding:      12px 14px
  Font:         14px, line-height 1.5

Select / Dropdown:
  Similar to input
  Icon:         Chevron down aligned right, 18px
  Padding-R:    40px (to accommodate icon)

Checkbox / Radio:
  Size:         18px x 18px
  Border-R:     2px (checkbox), full (radio)
  Accent:       blue-600
  Spacing:      8px gap between control & label
```

#### Card

```
Standard Card:
  Bg:        #FFFFFF
  Border:    1px solid #E5E7EB
  Border-R:  4px
  Padding:   24px (p-6)
  Shadow:    small (default)
  
  State:
    - Hover:  shadow medium, border-gray-300 (subtle lift)
    - Active: border-blue-600

Card Header:
  Padding-B:   16px (pb-4)
  Border-B:    1px solid #E5E7EB
  Typography:  H3, 600 weight

Card Body:
  Padding:     0 (if header present)

Card Footer:
  Padding-T:   16px (pt-4)
  Border-T:    1px solid #E5E7EB
  Display:     flex justify-between / justify-end
```

#### Badge / Pill

```
Status Badge:
  Sizes:
    - Small:   6px 12px, font 11px
    - Default: 8px 14px, font 12px
    - Large:   10px 16px, font 13px

  Variants:
    - Default:  bg-gray-100, text-gray-700
    - Blue:     bg-blue-100, text-blue-700
    - Green:    bg-green-100, text-green-700
    - Yellow:   bg-yellow-100, text-yellow-700
    - Red:      bg-red-100, text-red-700

  Border-R:    9999px (pill shape)
  Font-W:      500 (medium)
  Display:     inline-block

  Example usage:
    - "Tersedia"     → green badge
    - "Terjual"      → gray badge
    - "Disetujui"    → green badge
    - "Ditolak"      → red badge
    - "Pending"      → yellow badge
```

#### Modal / Overlay

```
Backdrop:
  Bg:        rgba(0, 0, 0, 0.5) (50% opacity)
  Transition: opacity 200ms ease
  Z-index:   40 (below modal)

Modal:
  Bg:        white
  Border-R:  8px
  Shadow:    large
  Max-W:     600px (md)
  Padding:   32px (p-8)
  Z-index:   50 (above backdrop)
  
  Close icon:  18px, gray-400, hover gray-600

Modal Header:
  Spacing-B: 20px
  Typography: H2

Modal Footer:
  Spacing-T: 24px
  Display:   flex gap-3 justify-end
```

#### Data Table

```
Header Row:
  Bg:       #F9FAFB
  Border-B: 1px solid #E5E7EB
  Font:     weight 600, size 14px, text gray-900
  Padding:  16px 12px (py-4 px-3)

Body Row:
  Border-B: 1px solid #E5E7EB
  Padding:  12px (py-3 px-3)
  Font:     size 14px, text gray-700
  
  State:
    - Hover:  bg-gray-50

State Column:
  Use badge component
  Align:     center

Action Column:
  Buttons:   Icon/secondary/small
  Gap:       8px between actions
  Align:     center

Pagination:
  Between table & footer
  Style:     [<] [1] [2] [3] [>]
  Active page: blue background
```

---

## 🎨 COMPONENT LIBRARY

### Ready-Made Components (Tailwind)

#### 1. Button Component
```jsx
// Button.jsx - Multiple variants

export default function Button({ 
  children, 
  variant = 'primary',  // primary | secondary | ghost | danger
  size = 'md',          // sm | md | lg
  disabled = false,
  className = '',
  ...props 
}) {
  const baseStyles = 'font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600/20';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 active:bg-gray-300',
    ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### 2. Input Component
```jsx
// Input.jsx

export default function Input({
  label = '',
  error = '',
  helperText = '',
  icon = null,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          className={`
            w-full px-3.5 py-2.5 border rounded-md text-sm font-normal
            transition-all duration-150
            ${error 
              ? 'border-red-500 bg-red-50 focus:ring-red-500/20' 
              : 'border-gray-200 focus:border-blue-600 focus:ring-blue-600/20'
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${icon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
```

#### 3. Card Component
```jsx
// Card.jsx

export default function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg shadow-sm
      hover:shadow-md transition-shadow duration-150
      ${className}
    `}>
      {children}
    </div>
  );
}

// Card.Header
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`
      px-6 py-4 border-b border-gray-200
      ${className}
    `}>
      {children}
    </div>
  );
}

// Card.Body
export function CardBody({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

// Card.Footer
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`
      px-6 py-4 border-t border-gray-200
      flex justify-between items-center
      ${className}
    `}>
      {children}
    </div>
  );
}
```

#### 4. Badge Component
```jsx
// Badge.jsx

export default function Badge({ 
  children, 
  variant = 'default',  // default | blue | green | yellow | red
  size = 'md',          // sm | md | lg
  className = '' 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3.5 py-1 text-sm font-medium',
    lg: 'px-4 py-1.5 text-sm font-medium',
  };
  
  return (
    <span className={`
      inline-block rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
}
```

---

## 📋 LAYOUT TEMPLATES

### 1. Public Layout (Customer)
```jsx
// Layouts/PublicLayout.jsx
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### 2. Auth Layout
```jsx
// Layouts/AuthLayout.jsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
```

### 3. Admin Layout (CoreUI-based)
```jsx
// Layouts/AdminLayout.jsx
export default function AdminLayout({ children }) {
  return (
    <CContainer fluid>
      <CRow>
        <CSidebar />
        <CCol className="flex">
          <CNavbar />
          <main className="flex-1">
            {children}
          </main>
        </CCol>
      </CRow>
    </CContainer>
  );
}
```

---

## 🎯 IMPLEMENTATION CHECKLIST

**Phase 1 - Color & Typography**:
- [ ] Update `tailwind.config.js` dengan color tokens
- [ ] Create CSS custom properties untuk typography
- [ ] Setup Inter font import
- [ ] Remove all non-standard colors dari project

**Phase 1 - Components**:
- [ ] Create `resources/js/Components/UI/` folder
- [ ] Build Button, Input, Card, Badge components
- [ ] Build form helpers (Label, FormField, ErrorMessage)
- [ ] Build layout components (Navbar, Footer, Sidebar)

**Phase 2 - Pages**:
- [ ] Redesign Home page dengan new components
- [ ] Redesign Motors/Index dengan filter sidebar
- [ ] Redesign Motors/Show dengan new gallery
- [ ] Build Order Wizard forms

**Phase 3 - Admin**:
- [ ] Integrate CoreUI package
- [ ] Build admin layout
- [ ] Build dashboard components
- [ ] Build data table & form components

---

**Design System Ready for Development** ✅  
**Next**: Start Phase 1 implementation
