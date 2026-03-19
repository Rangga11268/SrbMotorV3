# SRB Motor Mobile App - Course Project Design

## Mobile Programming 1 (Flutter)

**Version**: 1.0
**Last Updated**: March 19, 2026
**Target Audience**: Course Project (MP-1)
**Platform**: Flutter (iOS & Android)

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Core Features](#core-features)
5. [Page Designs](#page-designs)
6. [Responsive Design Basics](#responsive-design-basics)
7. [Safe Area & Platform Handling](#safe-area--platform-handling)
8. [Navigation Structure](#navigation-structure)
9. [API Integration](#api-integration)
10. [State Management](#state-management)
11. [Implementation Checklist](#implementation-checklist)

---

## 1. PROJECT OVERVIEW

### What is SRB Motor?

E-commerce application untuk pembelian motor dengan opsi:

- **Cash Purchase** (langsung beli)
- **Credit Purchase** (dengan tenor cicilan)
- **Admin Management** (approve/reject credit)

### Course Project Goals

✅ Build functional mobile app untuk user flow utama
✅ Implement responsive design (support landscape & portrait)
✅ Integrate with existing Laravel backend
✅ Handle both iOS & Android safely
✅ Clean architecture dengan Riverpod state management

### Target Features for MVP

- ✅ Authentication (Login/Register/OTP)
- ✅ Browse Motors (Home + Catalog)
- ✅ Motor Detail + Reviews
- ✅ Place Order (Cash & Credit)
- ✅ Track Order Status
- ✅ User Profile
- ✅ Admin Dashboard (basic)

---

## 2. TECH STACK

### Frontend (Mobile)

```
Framework:           Flutter 3.25.0+
Language:            Dart 3.5+
State Management:    Riverpod 2.4+
HTTP Client:         Dio 5.3+
Auth:                Firebase Auth + JWT Token
Local Storage:       Hive (optional) + shared_preferences
UI:                  Material Design 3
```

### Backend (Already Built)

```
Framework:           Laravel 12
Database:            MySQL 8.0
Payment:             Midtrans Snap API
Authentication:      Laravel Session + JWT for mobile
```

### Key Packages

```yaml
dependencies:
  flutter: sdk: flutter
  riverpod: ^2.4.0
  dio: ^5.3.0
  shared_preferences: ^2.2.0
  google_fonts: ^6.0.0
  intl: ^0.19.0
  cached_network_image: ^3.3.0
  image_picker: ^1.0.0
  file_picker: ^6.0.0
```

---

## 3. DATABASE SCHEMA

### Active Tables (dari Laravel backend)

```
users (id, email, name, phone, birthdate, gender, niknim, full_address, password...)
├── transactions (id, user_id, motor_id, order_type: cash|credit, total_price...)
│   ├── credit_details (id, transaction_id, monthly_payment, tenor...)
│   │   └── installments (id, credit_detail_id, month_number, payment_date, is_paid...)
│   └── documents (id, transaction_id, document_type, file_path, is_verified...)
├── posts (id, title, content,  category_id, created_by...)
└── notifications (id, user_id, type, read_at...)

motors (id, name, brand, details, price, category_id...)
├── category (id, category_name)
└── leasing_provider (id, provider_name, monthly_rate...)

transaction_logs (id, transaction_id, status, created_at...)
survey_schedules (id, transaction_id, scheduled_date, status...)
settings (key, value)
```

### Key Relationships

```
User 1—→ Many Transactions
User 1—→ Many Notifications
Transaction 1—→ 1 Motor
Transaction 1—→ 0|1 CreditDetail
Transaction 1—→ Many Documents
Transaction 1—→ Many TransactionLogs
CreditDetail 1—→ Many Installments
Motor 1—→ 1 Category
```

---

## 4. CORE FEATURES

### 4.1 Authentication

- **Login**: Email + Password
- **Register**: Email, Password, Name, Phone
- **OTP Verification**: 6-digit code
- **Logout**: Clear token + shared_preferences
- **Remember Me**: Save token persistently

### 4.2 Home Screen

- Greeting message (Hello, [User]!)
- Featured motors carousel (auto-scroll 5s)
- Category chips (horizontal scroll)
- Motor grid (2 columns portrait, 3 columns landscape)
- Search bar shortcut

### 4.3 Motor Catalog

- Grid/List view toggle
- **Filters**:
    - Category (dropdown)
    - Price range (slider 0-500M)
    - Brand (dropdown)
    - Transmission (Auto/Manual)
- **Sort**: Price (asc/desc), Newest, Sales
- 2-3 column grid (responsive)

### 4.4 Motor Detail

- Image carousel (5+ photos)
- Specs (engine, transmission, weight, price)
- **Financing Options Table**:
  | Tenor | Monthly | Total |
  |-------|---------|-------|
  | 12 | 3.2M | 38.4M |
  | 24 | 1.8M | 43.2M |
  | 36 | 1.3M | 46.8M |
- Reviews section
- Related motors (3 items)
- Action: **Add to Cart** / **Order Now**

### 4.5 Cash Order Form

Single form screen:

- Customer Name
- Phone Number
- Occupation
- Address (textarea)
- Notes (optional)
- **Submit** button

### 4.6 Credit Order Form

4-step progress form:

**Step 1: Personal Info**

- Name, Phone, Birth Date
- Gender (radio: Laki-laki/Perempuan)
- NIK (ID number), Full Address

**Step 2: Tenor Selection**

- Select tenor (12/24/36/48 months)
- Show monthly payment preview
- Select leasing provider (display rate)

**Step 3: Document Upload**

- KTP (ID Card) photo/file
- NPWP (Tax ID) photo/file
- Payslip/Business proof
- Bank statement
- Selfie with ID

**Step 4: Review & Submit**

- Show all entered data
- Terms & Conditions checkbox
- Submit button

### 4.7 Order Status Tracking

8-stage timeline:

1. Order Placed (✓ Completed)
2. Waiting Admin Review (In Progress / Waiting)
3. Admin Approved
4. Waiting Payment
5. Payment Confirmed
6. Waiting Survey
7. Waiting Delivery
8. Order Complete

Display:

- Vertical timeline with status indicators
- Current status highlighted
- Timestamp for each stage
- Contact sales button (WhatsApp)

### 4.8 User Profile

- Avatar (placeholder or upload from camera)
- User Info (Email, Phone, Birthdate, Gender, NIK, Address)
- **Settings**:
    - Change Password
    - Notifications toggle
    - Dark mode toggle
    - Language (if multilingual)
- **Logout** button

### 4.9 Admin Dashboard (Simple)

- Total Users (KPI card)
- Total Revenue (KPI card)
- Pending Credit Approvals (KPI card)
- Recent Transactions (list, last 10)
- [Admin] Mark as Approved / Rejected

---

## 5. PAGE DESIGNS

### 5.1 Navigation Structure

```
BottomTabNavigationBar (5 tabs):
├── 🏠 Home
│   └── HomeScreen
│       ├── [Featured Carousel]
│       ├── [Category Chips]
│       └── [Motor Grid]
│           └── MotorDetailScreen
│
├── 🔍 Explore
│   └── CatalogScreen (Browse all motors with filters)
│       └── MotorDetailScreen
│
├── 👤 Profile
│   └── ProfileScreen
│
├── 🔔 Notifications
│   └── NotificationListScreen
│
└── ☰ Menu
    └── MenuScreen (Order history, Settings, Help, Logout)
```

### 5.2 Home Screen Layout

**Portrait (360-600px)**:

```
┌─────────────────────┐
│ ≡ SRB Motor    [🔔] │  ← AppBar
├─────────────────────┤
│ Hello, Budi Santoso!│  ← Greeting
├─────────────────────┤
│   [◄ Featured ►]    │  ← Auto-scroll carousel
│   [Motor image]     │
├─────────────────────┤
│ Categories:         │
│ [Sport] [Scooter]...│  ← Horizontal scroll
├─────────────────────┤
│ Popular Motors      │
├─────────────────────┤
│ ┌──────┐ ┌──────┐   │
│ │Aerox │ │ NMax │   │  ← 2-column grid
│ │4.5/5 │ │4.8/5 │   │
│ │Rp... │ │Rp... │   │
│ └──────┘ └──────┘   │
│ ┌──────┐ ┌──────┐   │
│ │ Nala │ │ Vario│   │
│ │4.2/5 │ │4.3/5 │   │
│ └──────┘ └──────┘   │
└─────────────────────┘
```

**Landscape (600px+)**:

```
┌──────────────────────────────────┐
│ ≡ SRB Motor          [🔔] [👤]   │  ← Compact AppBar
├──────────────────────────────────┤
│ Hello, Budi!                     │
│ ┌──────────┐ ┌──────────┐        │
│ │Featured  │ │Featured  │        │  ← 3-column grid
│ │Carousel  │ │Carousel  │        │
│ └──────────┘ └──────────┘        │
│ Categories: [Sport][Scooter]...  │
│ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ Aerox  │ │ NMax   │ │ Nala   │ │
│ │4.5/5   │ │4.8/5   │ │4.2/5   │ │
│ │ Rp... │ │ Rp... │ │ Rp... │ │
│ └────────┘ └────────┘ └────────┘ │
└──────────────────────────────────┘
```

### 5.3 Motor Detail Screen

**Portrait**:

```
┌─────────────────────┐
│ ◄ Motor Detail  [♥] │  ← AppBar
├─────────────────────┤
│ [◄ Image 1/5 ►]     │  ← Image carousel
│ [Thumbnails below]  │
├─────────────────────┤
│ Yamaha NMax         │  ← Title
│ Rp78,500,000       │  ← Price
│ ⭐ 4.8 (234 review) │
├─────────────────────┤
│ Specifications      │  ← Card
│ Engine: 155cc       │
│ Trans: Automatic    │
│ Weight: 125kg       │
├─────────────────────┤
│ Financing Options   │  ← Table
│ Tenor | Monthly     │
│ 12mo | Rp 6,5jt    │
│ 24mo | Rp 3,7jt    │
│ 36mo | Rp 2,7jt    │
├─────────────────────┤
│ Reviews (5 shown)   │  ← Card
│ ⭐⭐⭐⭐⭐          │
│ "Bagus banget!"     │
├─────────────────────┤
│ [Order Now] [Fav]   │  ← Action buttons
└─────────────────────┘
```

### 5.4 Catalog with Filters

**Portrait**:

```
┌─────────────────────┐
│ ≡ Catalog       [🔍] │
├─────────────────────┤
│ [Search...]         │  ← Sticky search
│ [Filters ↓] [↕ Sort]│
├─────────────────────┤
│ ┌──────┐ ┌──────┐   │
│ │Aerox │ │ NMax │   │  ← 2-column grid
│ │ Rp..│ │ Rp..│   │
│ └──────┘ └──────┘   │
│ ┌──────┐ ┌──────┐   │
│ │ Nala │ │ Vario│   │
│ │ Rp..│ │ Rp..│   │
│ └──────┘ └──────┘   │
└─────────────────────┘

--- Filter Bottom Sheet ---
┌─────────────────────┐
│ ⚙️ Filters         │
├─────────────────────┤
│ Category:           │
│ [Sport] [Scooter]   │
│ [All]               │
│                     │
│ Price Range:        │
│ [•————————] 0 - 500M │
│                     │
│ Brand:              │
│ □ Yamaha            │
│ ✓ Honda             │
│ □ Suzuki            │
│                     │
│ [Reset] [Apply]     │
└─────────────────────┘
```

### 5.5 Cash Order Form

```
┌─────────────────────┐
│ ◄ Pesan (Cash) │
├─────────────────────┤
│ ///////  Order      │
│ ///////  Yamaha     │
│ ///////  NMax       │
├─────────────────────┤
│ Rp78,500,000       │
│ Uang Muka: Rp10jt  │
│ Sisa: Rp68.5jt     │
├─────────────────────┤
│ Nama Lengkap:       │
│ [Budi Santoso    ]  │
│                     │
│ Nomor Telepon:      │
│ [+62812345678    ]  │
│                     │
│ Pekerjaan:          │
│ [Karyawan        ▼] │
│                     │
│ Alamat:             │
│ [Jalan Merdeka...]  │
│                     │
│ Catatan (opsional): │
│ [.................] │
│                     │
│         [Pesan]     │
└─────────────────────┘
```

### 5.6 Credit Order Form (4 Steps)

**Step 1: Personal Info**

```
┌─────────────────────┐
│ ◄ Pesan (Kredit) │
├─────────────────────┤
│ Step 1 of 4: Info   │
│ [████░░░░░░░░░] 25% │  ← Progress bar
├─────────────────────┤
│ Nama Lengkap:       │
│ [Budi Santoso    ]  │
│                     │
│ Tanggal Lahir:      │
│ [19-03-1990      ]  │
│                     │
│ Jenis Kelamin:      │
│ ◉ Laki-laki         │
│ ○ Perempuan         │
│                     │
│ No. NIK:            │
│ [3278012345678901]  │
│                     │
│ Alamat Lengkap:     │
│ [Jalan Merdeka...]  │
│                     │
│     [Lanjut]        │
└─────────────────────┘
```

**Step 2: Tenor Selection**

```
┌─────────────────────┐
│ ◄ Pesan (Kredit) │
├─────────────────────┤
│ Step 2 of 4: Tenor  │
│ [████████░░░░░] 50% │
├─────────────────────┤
│ Pilih Tenor:        │
│                     │
│ ✓ 12 bulan          │
│   Rp6,542,500/bln   │
│                     │
│ ○ 24 bulan          │
│   Rp3,546,000/bln   │
│                     │
│ ○ 36 bulan          │
│   Rp2,569,000/bln   │
│                     │
│ ○ 48 bulan          │
│   Rp2,047,500/bln   │
│                     │
│ Pembiayaan Leasing: │
│ [Astra Credit    ▼] │
│ Rate: 0.35% / bulan │
│                     │
│ [◄ Kembali] [Lanjut]│
└─────────────────────┘
```

**Step 3: Upload Dokumen**

```
┌─────────────────────┐
│ ◄ Pedan (Kredit)  │
├─────────────────────┤
│ Step 3 of 4: Docs   │
│ [██████████░░░] 75% │
├─────────────────────┤
│ KTP Scan:           │
│ [Upload] [Camera]   │
│ Status: ⏳ Pending   │
│                     │
│ NPWP (Opsional):    │
│ [Upload] [Camera]   │
│ Status: ⏳ Pending   │
│                     │
│ Slip Gaji:          │
│ [Upload] [Camera]   │
│ Status: ⏳ Pending   │
│                     │
│ Selfie + KTP:       │
│ [Upload] [Camera]   │
│ Status: ⏳ Pending   │
│                     │
│ [◄ Kembali] [Lanjut]│
└─────────────────────┘
```

**Step 4: Review & Submit**

```
┌─────────────────────┐
│ ◄ Pesan (Kredit) │
├─────────────────────┤
│ Step 4 of 4: Review │
│ [█████████████] 100%│
├─────────────────────┤
│ Data Pemesanan:     │
│                     │
│ Motor: Yamaha NMax  │
│ Harga: Rp78,500jt   │
│ Tenor: 12 bulan     │
│ Cicilan: Rp6,542.5k │
│                     │
│ Data Pribadi:       │
│ Nama: Budi Santoso  │
│ NIK: 3278012...     │
│ Alamat: Jalan...    │
│                     │
│ Dokumen:            │
│ ✓ KTP dan selfie    │
│ ⏳ Dalam Review      │
│                     │
│ □ Saya setuju dg    │
│   T&C pembiayaan    │
│                     │
│ [◄ Kembali] [Pesan] │
└─────────────────────┘
```

### 5.7 Order Status Tracking

```
┌─────────────────────┐
│ ◄ Status Order  [⋯] │
├─────────────────────┤
│ Order ID: ORD-00123 │
│ Yamaha NMax         │
│ Rp78,500,000       │
├─────────────────────┤
│ Timeline:           │
│                     │
│ ✓ Pesanan Diterima  │
│   03-19 10:30       │
│                     │
│ ✓ Review Admin      │
│   03-19 14:20       │
│                     │
│ ✓ Admin Approve     │
│   03-19 15:00       │
│                     │
│ ⏳ Tunggu Pembayaran │
│   (Menunggu...)     │
│                     │
│ ○ Bayar Konfirmasi  │
│                     │
│ ○ Tunggu Survey     │
│                     │
│ ○ Tunggu Kirim      │
│                     │
│ ○ Pesanan Selesai   │
│                     │
│ ========== Actions ==│
│ [💬 Chat Admin]     │
│ [📄 Download Invoice]│
├─────────────────────┤
│ *Hubungi sales jika  │
│ ada pertanyaan      │
└─────────────────────┘
```

### 5.8 User Profile

```
┌─────────────────────┐
│ Profil          [✎] │
├─────────────────────┤
│       [👤]          │  ← Avatar
│   Budi Santoso      │
│   budi@email.com    │
├─────────────────────┤
│ Informasi Pribadi   │
│ Email:              │
│ budi@email.com      │
│                     │
│ Nomor Telepon:      │
│ +6281234567890      │
│                     │
│ Tanggal Lahir:      │
│ 19-03-1990          │
│                     │
│ Jenis Kelamin:      │
│ Laki-laki           │
│                     │
│ NIK:                │
│ 3278012345678901    │
│                     │
│ Alamat:             │
│ Jalan Merdeka 123...│
├─────────────────────┤
│ Keamanan            │
│ [Ubah Password]     │
│                     │
│ Notifikasi          │
│ [Toggle switches]   │
│                     │
│ Tema:               │
│ ◉ Light ○ Dark      │
├─────────────────────┤
│      [Logout]       │
└─────────────────────┘
```

### 5.9 Admin Dashboard

```
┌─────────────────────┐
│ Dashboard Admin  [≡] │
├─────────────────────┤
│ Total User: 1,245   │  ← KPI Cards
│ Total Revenue: Rp.. │
│ Pending Approval: 8 │
├─────────────────────┤
│ Transaksi Terbaru:  │
│ ┌─────────────────┐ │
│ │ORD-00123       │ │  ← 2-column
│ │Budi Santoso    │ │
│ │Kredit | Pending│ │
│ │[Approve][Cls]  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ORD-00122       │ │
│ │Ahmad Wijaya    │ │
│ │Cash | Approved │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 6. RESPONSIVE DESIGN BASICS

### 6.1 Device Categories

```
COMPACT (< 600dp)
├── iPhone 11/12/13/14/15 (360-390px)
└── Older Android phones (360-480px)

MEDIUM (600-840dp)
├── iPad (6th-10th gen) landscape, 600px width
└── Larger Android phones in landscape (600-800px)

EXPANDED (> 840dp)
├── iPad Pro 11" & 12.9" landscape (840px+)
└── Web browser / Desktop emulation (1200px+)
```

### 6.2 Layout Grid System

| Device Size | Columns | Padding | Gutter |
| ----------- | ------- | ------- | ------ |
| Compact     | 2       | 16dp    | 12dp   |
| Medium      | 3       | 24dp    | 16dp   |
| Expanded    | 4       | 32dp    | 20dp   |

**Implementation** (Riverpod + MediaQuery):

```dart
class ResponsiveHelper {
  static int getColumns(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 600) return 2;
    if (width < 840) return 3;
    return 4;
  }

  static double getPadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 600) return 16;
    if (width < 840) return 24;
    return 32;
  }
}
```

### 6.3 Typography Scaling

| Element | Compact | Medium | Expanded |
| ------- | ------- | ------ | -------- |
| Display | 24px    | 28px   | 32px     |
| H1      | 20px    | 24px   | 28px     |
| H2      | 18px    | 20px   | 24px     |
| Body    | 14px    | 14px   | 16px     |
| Small   | 12px    | 12px   | 14px     |

**Implementation**:

```dart
TextStyle getDisplayStyle(BuildContext context) {
  final width = MediaQuery.of(context).size.width;
  final size = width < 600 ? 24.0 : (width < 840 ? 28.0 : 32.0);
  return TextStyle(fontSize: size, fontWeight: FontWeight.bold);
}
```

### 6.4 Image Sizing

**Motor Cards**:

- Compact: 180px wide, 240px height (3:4 aspect ratio)
- Medium: 200px wide, 260px height (same ratio)
- Expanded: 240px wide, 320px height (same ratio)

**Implementation**:

```dart
class MotorCard extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final width = MediaQuery.of(context).size.width;
    final cardWidth = width < 600 ? 180.0 : (width < 840 ? 200.0 : 240.0);
    final cardHeight = cardWidth * 1.33; // 3:4 ratio

    return SizedBox(
      width: cardWidth,
      height: cardHeight,
      child: Card(
        child: CachedNetworkImage(
          imageUrl: motor.image,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
```

### 6.5 Multi-Column Forms

**Portrait (Compact/Medium)**:

- All form fields: full width
- Button: full width

**Landscape (Medium/Expanded)**:

- 2 columns for form fields
- Button: max 300dp width, centered

**Implementation**:

```dart
class OrderForm extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLandscape = MediaQuery.of(context).orientation == Orientation.landscape;

    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(isLandscape ? 12.0 : 16.0),
        child: Column(
          children: [
            if (isLandscape)
              Row(
                children: [
                  Expanded(child: TextFormField(decoration: InputDecoration(labelText: 'Name'))),
                  SizedBox(width: 16),
                  Expanded(child: TextFormField(decoration: InputDecoration(labelText: 'Phone'))),
                ],
              )
            else
              Column(
                children: [
                  TextFormField(decoration: InputDecoration(labelText: 'Name')),
                  SizedBox(height: 12),
                  TextFormField(decoration: InputDecoration(labelText: 'Phone')),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
```

---

## 7. SAFE AREA & PLATFORM HANDLING

### 7.1 iOS Safe Insets

- **Top** (Notch): 39.3dp (iPhone 13+), 20.7dp (older)
- **Bottom** (Home Indicator): 34dp
- **Sides**: 0dp (typically)

### 7.2 Android Safe Insets

- **Top** (Status Bar): 24dp
- **Bottom**: 0dp
- **Sides**: 0dp

### 7.3 Implementation

**Wrap content with SafeArea**:

```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text('Home')),
    body: SafeArea(
      // Content automatically avoids notch/status bar
      child: SingleChildScrollView(
        child: Column(
          children: [
            // Your widgets here
          ],
        ),
      ),
    ),
  );
}
```

**For fullscreen images** (Optional - extend under status bar):

```dart
ExtendBodyBehindAppBar: true,
AppBar(backgroundColor: Colors.transparent, elevation: 0),
```

### 7.4 Platform-Specific Behavior

No need platform-specific code for **course project**. Use Material Design 3 for both iOS & Android:

```dart
MaterialApp(
  theme: ThemeData(
    useMaterial3: true, // Works beautifully on both platforms
    colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF2563EB)),
  ),
  // ...
)
```

---

## 8. NAVIGATION STRUCTURE

### 8.1 Bottom Tab Navigation

```
┌────────────────────────   ┐
│ [Content Area]           │
├────────────────────────   ┤
│ 🏠 Home │ 🔍 │ 👤 │ 🔔 │ ☰ │  ← 5 tabs
└────────────────────────   ┘
```

**Implementation** (Riverpod):

```dart
final currentTabProvider = StateProvider<int>((ref) => 0);

class MainNavigation extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentTab = ref.watch(currentTabProvider);

    return Scaffold(
      body: IndexedStack(
        index: currentTab,
        children: [
          HomeScreen(),
          CatalogScreen(),
          ProfileScreen(),
          NotificationScreen(),
          MenuScreen(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentTab,
        onTap: (index) => ref.read(currentTabProvider.notifier).state = index,
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Explore'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Notif'),
          BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'Menu'),
        ],
      ),
    );
  }
}
```

### 8.2 Screen Hierarchy

```
MainNavigation
├── HomeScreen
│   └── MotorDetailScreen
│       └── OrderFormScreen (Cash/Credit)
│           └── CheckoutScreen
│               └── PaymentScreen
├── CatalogScreen
│   ├── FilterBottomSheet
│   └── MotorDetailScreen (→ OrderForm)
├── ProfileScreen
│   └── EditProfileScreen
├── NotificationScreen
└── MenuScreen
    ├── OrderHistoryScreen
    │   └── OrderStatusScreen
    ├── SettingsScreen
    └── HelpScreen
```

---

## 9. API INTEGRATION

### 9.1 Base Configuration

**Dio Setup** (Riverpod):

```dart
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: 'http://192.168.1.5:8000/api', // Change to your IP
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  );

  // Add token interceptor
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = ref.read(authTokenProvider);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Handle token refresh or logout
        }
        return handler.next(error);
      },
    ),
  );

  return dio;
});
```

### 9.2 Key API Endpoints

| Method | Endpoint                         | Purpose                        |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/auth/login`                    | User login (email + password)  |
| POST   | `/auth/register`                 | User registration              |
| POST   | `/auth/otp-verify`               | OTP verification               |
| GET    | `/motors`                        | List all motors (with filters) |
| GET    | `/motors/{id}`                   | Motor detail + reviews         |
| GET    | `/motors/{id}/financing-options` | Available tenor options        |
| POST   | `/orders/cash`                   | Place cash order               |
| POST   | `/orders/credit`                 | Place credit order             |
| POST   | `/orders/{id}/documents/upload`  | Upload documents               |
| GET    | `/orders/{id}`                   | Order detail + status          |
| GET    | `/orders/{id}/timeline`          | Order status timeline          |
| GET    | `/user/profile`                  | User profile info              |
| PUT    | `/user/profile`                  | Update profile                 |
| GET    | `/notifications`                 | List notifications             |
| GET    | `/admin/dashboard`               | Admin KPI cards                |
| GET    | `/admin/transactions`            | Admin transaction list         |

### 9.3 Service Layer (Riverpod)

```dart
// Authentication Service
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(dio: ref.watch(dioProvider));
});

final authTokenProvider = StateProvider<String??>((ref) => null);
final userProvider = StateProvider<User?>((ref) => null);

// Motor Service
final motorServiceProvider = Provider<MotorService>((ref) {
  return MotorService(dio: ref.watch(dioProvider));
});

final motorsListProvider = FutureProvider<List<Motor>>((ref) async {
  final service = ref.watch(motorServiceProvider);
  return service.getMotors();
});

final motorDetailProvider = FutureProvider.family<Motor, int>((ref, id) async {
  final service = ref.watch(motorServiceProvider);
  return service.getMotorDetail(id);
});

// Order Service
final orderServiceProvider = Provider<OrderService>((ref) {
  return OrderService(dio: ref.watch(dioProvider));
});
```

---

## 10. STATE MANAGEMENT

### 10.1 Riverpod Structure

```
lib/
├── providers/
│   ├── auth_provider.dart (login, register, logout)
│   ├── motor_provider.dart (motors list, detail, filters)
│   ├── order_provider.dart (create order, get status)
│   └── user_provider.dart (profile, notifications)
├── services/
│   ├── auth_service.dart
│   ├── motor_service.dart
│   ├── order_service.dart
│   └── payment_service.dart
├── models/
│   ├── user.dart
│   ├── motor.dart
│   ├── order.dart
│   ├── credit_detail.dart
│   └── transaction_log.dart
├── screens/
│   ├── auth/
│   ├── home/
│   ├── motor_detail/
│   ├── order_form/
│   └── ...
└── main.dart
```

### 10.2 Example: Order Form State

```dart
// Order creation form state
final orderFormProvider = StateNotifierProvider<OrderFormNotifier, OrderFormState>((ref) {
  return OrderFormNotifier(ref);
});

class OrderFormState {
  final String? motorId;
  final String? orderType; // 'cash' or 'credit'
  final String? customerName;
  final String? phone;
  final String? address;
  final List<File> documents;
  final bool isSubmitting;
  final String? error;

  OrderFormState({
    this.motorId,
    this.orderType,
    this.customerName,
    this.phone,
    this.address,
    this.documents = const [],
    this.isSubmitting = false,
    this.error,
  });

  OrderFormState copyWith({
    String? motorId,
    String? orderType,
    String? customerName,
    String? phone,
    String? address,
    List<File>? documents,
    bool? isSubmitting,
    String? error,
  }) => // ...
}

// Call in UI:
class OrderFormScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final formState = ref.watch(orderFormProvider);
    final notifier = ref.read(orderFormProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text('Pesan Motor')),
      body: Form(
        child: Column(
          children: [
            TextFormField(
              onChanged: (value) => notifier.setCustomerName(value),
            ),
            ElevatedButton(
              onPressed: formState.isSubmitting
                  ? null
                  : () => notifier.submitOrder(),
              child: Text('Pesan'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 11. IMPLEMENTATION CHECKLIST

### Phase 1: Setup (Week 1)

- [ ] Create Flutter project with Riverpod + Dio
- [ ] Setup project folder structure
- [ ] Create API service layer
- [ ] Configure BaseUrl (localhost IP for testing)
- [ ] Setup Material Design 3 theme

### Phase 2: Authentication (Week 1-2)

- [ ] Login screen UI
- [ ] Register screen UI
- [ ] OTP verification flow
- [ ] Implement auth service (Dio)
- [ ] Store token in shared_preferences
- [ ] Create auth guard (redirect unauthenticated users)

### Phase 3: Motor Catalog (Week 2-3)

- [ ] Home screen with motor list
- [ ] Motor detail screen
- [ ] Filter & search functionality
- [ ] Image carousel for motor photos
- [ ] Reviews display
- [ ] Responsive layout (2-3 column grid)

### Phase 4: Order Placement (Week 3-4)

- [ ] Cash order form (single step)
- [ ] Credit order form (4-step wizard)
- [ ] Document upload (camera + file picker)
- [ ] Form validation & error handling
- [ ] Spinner/loading state

### Phase 5: Order Tracking (Week 4-5)

- [ ] Order status timeline screen
- [ ] Status update polling
- [ ] Download invoice feature
- [ ] Contact sales button (WhatsApp link)

### Phase 6: User Profile & Settings (Week 5)

- [ ] Profile screen
- [ ] Edit profile functionality
- [ ] Dark mode toggle
- [ ] Notification settings
- [ ] Logout

### Phase 7: Polish & Responsive Design (Week 6)

- [ ] Test on 2+ devices (portrait & landscape)
- [ ] SafeArea implementation
- [ ] Responsive font sizing
- [ ] Touch target verification (48x48 minimum)
- [ ] Fix UI issues

### Phase 8: Testing & Deployment (Week 6-7)

- [ ] Debug on real device (Android emulator required)
- [ ] Integration testing with backend
- [ ] APK build for Android
- [ ] Device testing (landscape, orientation changes)
- [ ] Bug fixes & final polish

### Optional Features (if time permits)

- [ ] Image caching optimization
- [ ] Offline mode (local storage)
- [ ] Push notifications (FCM)
- [ ] Admin dashboard improvements
- [ ] Dark mode colors

---

## QUICK START

### 1. Setup Project

```bash
flutter create srb_motor_app --org com.srbmotor
cd srb_motor_app
flutter pub add riverpod dio shared_preferences
```

### 2. Update pubspec.yaml

```yaml
dependencies:
    flutter:
        sdk: flutter
    riverpod: ^2.4.0
    hooks_riverpod: ^2.4.0
    dio: ^5.3.0
    shared_preferences: ^2.2.0
    cached_network_image: ^3.3.0
    intl: ^0.19.0
    google_fonts: ^6.0.0
    image_picker: ^1.0.0
    file_picker: ^6.0.0
```

### 3. Main Entry Point

```dart
void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SRB Motor',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF2563EB)),
      ),
      home: const SplashScreen(),
    );
  }
}
```

### 4. Configure API Base URL

Update `lib/services/api_service.dart`:

```dart
const String API_BASE_URL = 'http://YOUR_LARAVEL_IP:8000/api';
// Example: http://192.168.1.5:8000/api
```

### 5. Run

```bash
flutter run
```

---

## TROUBLESHOOTING

### API Connection Issues

**Problem**: `Failed to connect to 192.168.x.x:8000`

- **Solution**: Ensure mobile device is on same WiFi as Laravel server
- Use `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows) to get server IP
- Update API_BASE_URL with correct IP

### SafeArea Cutting Content

**Problem**: Content is hidden behind notch or status bar

- **Solution**: Wrap Scaffold body with `SafeArea` widget

### Images Not Loading

**Problem**: `CachedNetworkImage` shows placeholder forever

- **Solution**: Verify image URL is accessible from mobile
- Check CORS if using cloud CDN
- Use `CachedNetworkImageProvider` for debugging

### Form Validation Not Working

**Problem**: `TextFormField` validation not triggering

- **Solution**: Ensure `Form` widget wraps fields and call `_formKey.currentState?.validate()`

---

## RESOURCES

- [Flutter Documentation](https://flutter.dev/docs)
- [Riverpod Documentation](https://riverpod.dev)
- [Material Design 3](https://m3.material.io)
- [Dio HTTP Client](https://pub.dev/packages/dio)
- [Flutter Responsive Guide](https://flutter.dev/docs/development/ui/layout/responsive)

---

**Last Updated**: March 19, 2026
**For**: Course Project - Mobile Programming 1
**Status**: Ready for Development ✅
